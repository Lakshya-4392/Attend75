import { useState, useEffect } from 'react';
import { AttendanceSettings } from '@/types/attendance';

// Use the centralized type definition
export type AttendanceSettingsState = AttendanceSettings;

const defaultSettings: AttendanceSettingsState = {
  defaultRequiredAttendance: 75,
  includeDutyLeaves: true,
  showWarningAt: 80,
  showCriticalAt: 75,
  autoMarkWeekends: false,
  notificationsEnabled: true,
  reminderTime: "09:00"
};

const SETTINGS_STORAGE_KEY = 'attendanceSettings';

export function useAttendanceSettings() {
  const [settings, setSettings] = useState<AttendanceSettingsState>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Auto-save settings whenever they change (with proper debouncing)
  useEffect(() => {
    // Don't save on initial load
    if (JSON.stringify(settings) === JSON.stringify(defaultSettings)) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        setSaveStatus('saved');
        const clearStatusTimeout = setTimeout(() => setSaveStatus('idle'), 2000);
        
        // Cleanup function to clear the status timeout if component unmounts
        return () => clearTimeout(clearStatusTimeout);
      } catch (error) {
        console.error('Failed to save attendance settings:', error);
        setSaveStatus('error');
        const clearStatusTimeout = setTimeout(() => setSaveStatus('idle'), 3000);
        return () => clearTimeout(clearStatusTimeout);
      }
    }, 500); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [settings]);

  const updateSettings = (updates: Partial<AttendanceSettingsState>) => {
    // Validate settings before applying
    const newSettings = { ...settings, ...updates };
    
    // Validate attendance percentages
    if (newSettings.defaultRequiredAttendance < 50 || newSettings.defaultRequiredAttendance > 100) {
      throw new Error('Default required attendance must be between 50% and 100%');
    }
    
    if (newSettings.showWarningAt < 50 || newSettings.showWarningAt > 100) {
      throw new Error('Warning threshold must be between 50% and 100%');
    }
    
    if (newSettings.showCriticalAt < 50 || newSettings.showCriticalAt > 100) {
      throw new Error('Critical threshold must be between 50% and 100%');
    }
    
    // Critical threshold should be <= warning threshold
    if (newSettings.showCriticalAt > newSettings.showWarningAt) {
      throw new Error('Critical threshold must be less than or equal to warning threshold');
    }
    
    // Validate reminder time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (newSettings.reminderTime && !timeRegex.test(newSettings.reminderTime)) {
      throw new Error('Invalid reminder time format. Expected HH:MM');
    }
    
    setSaveStatus('saving');
    setSettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    saveStatus
  };
}