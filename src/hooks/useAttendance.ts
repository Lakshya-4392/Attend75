import React, { useState, useEffect } from 'react';
import {
  Subject,
  AttendanceRecord,
  AttendanceStats,
  CreateSubjectInput,
  AttendanceStatus,
  DateString,
  DayOfWeek,
  SubjectAttendanceData,
  isValidDateString,
  isValidAttendanceStatus
} from '@/types/attendance';

// Empty defaults for fresh start
const defaultSubjects: Subject[] = [];

const defaultAttendanceRecords: AttendanceRecord[] = [];

// Storage keys
const SUBJECTS_STORAGE_KEY = 'attendance_subjects';
const RECORDS_STORAGE_KEY = 'attendance_records';

// Helper functions for localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export function useAttendance() {
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    loadFromStorage(SUBJECTS_STORAGE_KEY, defaultSubjects)
  );
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
    loadFromStorage(RECORDS_STORAGE_KEY, defaultAttendanceRecords)
  );

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(SUBJECTS_STORAGE_KEY, subjects);
  }, [subjects]);

  useEffect(() => {
    saveToStorage(RECORDS_STORAGE_KEY, attendanceRecords);
  }, [attendanceRecords]);

  // No need to update subject counts - we'll calculate everything from records

  // Better ID generation to prevent collisions
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  const addSubject = (subject: CreateSubjectInput) => {
    // Validate subject data
    if (!subject.name?.trim()) {
      throw new Error('Subject name is required');
    }
    if (subject.classesAttended > subject.classesHeld) {
      throw new Error('Classes attended cannot exceed classes held');
    }
    if (!Array.isArray(subject.daysOfWeek) || subject.daysOfWeek.length === 0) {
      throw new Error('At least one day of the week must be selected');
    }

    const newSubject: Subject = {
      ...subject,
      id: generateId(),
      name: subject.name.trim(),
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(subject =>
      subject.id === id ? { ...subject, ...updates } : subject
    ));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    setAttendanceRecords(prev => prev.filter(record => record.subjectId !== id));
  };

  const markAttendance = (subjectId: string, date: DateString, status: AttendanceStatus) => {
    // Validate inputs
    if (!subjectId?.trim()) {
      throw new Error('Subject ID is required');
    }
    if (!date?.trim()) {
      throw new Error('Date is required');
    }
    if (!isValidAttendanceStatus(status)) {
      throw new Error('Invalid attendance status');
    }

    if (!isValidDateString(date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    // Check if subject exists
    const subjectExists = subjects.some(s => s.id === subjectId);
    if (!subjectExists) {
      throw new Error('Subject not found');
    }

    const existingRecord = attendanceRecords.find(
      record => record.subjectId === subjectId && record.date === date
    );

    if (existingRecord) {
      // Update existing record
      setAttendanceRecords(prev => prev.map(record =>
        record.id === existingRecord.id
          ? {
            ...record,
            status,
            updatedAt: new Date().toISOString().split('T')[0] as DateString
          }
          : record
      ));
    } else {
      // Add new record
      const newRecord: AttendanceRecord = {
        id: generateId(),
        subjectId,
        date,
        status,
        createdAt: new Date().toISOString().split('T')[0] as DateString
      };
      setAttendanceRecords(prev => [...prev, newRecord]);
    }
  };



  const toggleDutyLeave = (recordId: string) => {
    setAttendanceRecords(prev => prev.map(record =>
      record.id === recordId
        ? { ...record, status: record.status === 'duty-leave' ? 'absent' as const : 'duty-leave' as const }
        : record
    ));
  };

  const getTodaysSubjects = (date: DateString = new Date().toISOString().split('T')[0] as DateString) => {
    const dayOfWeek = new Date(date).getDay() as DayOfWeek;
    return subjects.filter(subject => subject.daysOfWeek.includes(dayOfWeek));
  };

  const getAttendanceStats = (subjectId?: string): AttendanceStats => {
    const relevantRecords = subjectId
      ? attendanceRecords.filter(r => r.subjectId === subjectId)
      : attendanceRecords;

    const totalPresent = relevantRecords.filter(r => r.status === 'present' || r.status === 'duty-leave').length;
    const totalAbsent = relevantRecords.filter(r => r.status === 'absent').length;
    const totalDutyLeave = relevantRecords.filter(r => r.status === 'duty-leave').length;
    const total = relevantRecords.length;

    return {
      totalPresent,
      totalAbsent,
      totalDutyLeave,
      totalRecords: total,
      attendancePercentage: total > 0 ? (totalPresent / total) * 100 : 0
    };
  };

  const getSubjectAttendanceData = React.useCallback((subjectId: string): SubjectAttendanceData => {
    const subjectRecords = attendanceRecords.filter(r => r.subjectId === subjectId);
    const subject = subjects.find(s => s.id === subjectId);
    
    // Calculate attendance from records
    const recordsPresent = subjectRecords.filter(r => r.status === 'present' || r.status === 'duty-leave').length;
    const recordsTotal = subjectRecords.length;
    
    // Combine initial subject data with attendance records
    // Total classes = initial classes + new records
    // Attended classes = initial attended + new present records
    const initialClassesHeld = subject?.classesHeld || 0;
    const initialClassesAttended = subject?.classesAttended || 0;
    
    const finalClassesHeld = initialClassesHeld + recordsTotal;
    const finalClassesAttended = initialClassesAttended + recordsPresent;

    const attendancePercentage = finalClassesHeld > 0 ? (finalClassesAttended / finalClassesHeld) * 100 : 0;
    const isAtRisk = subject ? attendancePercentage < subject.requiredAttendance : false;

    return {
      classesAttended: finalClassesAttended,
      classesHeld: finalClassesHeld,
      attendancePercentage,
      isAtRisk,
      classesNeededToReachTarget: isAtRisk && subject ? Math.ceil(
        (subject.requiredAttendance / 100 * finalClassesHeld - finalClassesAttended) /
        (1 - subject.requiredAttendance / 100)
      ) : undefined
    };
  }, [attendanceRecords, subjects]);

  const importData = (data: { subjects: Subject[], attendanceRecords: AttendanceRecord[] }) => {
    if (data.subjects && Array.isArray(data.subjects)) {
      setSubjects(data.subjects);
    }
    if (data.attendanceRecords && Array.isArray(data.attendanceRecords)) {
      setAttendanceRecords(data.attendanceRecords);
    }
  };

  const clearAllData = () => {
    setSubjects([]);
    setAttendanceRecords([]);
  };

  return {
    subjects,
    attendanceRecords,
    addSubject,
    updateSubject,
    deleteSubject,
    markAttendance,
    toggleDutyLeave,
    getTodaysSubjects,
    getAttendanceStats,
    getSubjectAttendanceData,
    importData,
    clearAllData
  };
}