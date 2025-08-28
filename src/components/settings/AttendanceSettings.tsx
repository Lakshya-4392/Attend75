import { RotateCcw, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAttendanceSettings } from "@/hooks/useAttendanceSettings";

export function AttendanceSettings() {
  const { settings, updateSettings, resetSettings, saveStatus } = useAttendanceSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Preferences</CardTitle>
        <CardDescription>
          Configure your attendance tracking preferences and thresholds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Required Attendance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Default Required Attendance</Label>
            <Badge variant="secondary">{settings.defaultRequiredAttendance}%</Badge>
          </div>
          <Slider
            value={[settings.defaultRequiredAttendance]}
            onValueChange={(value) => updateSettings({ defaultRequiredAttendance: value[0] })}
            max={100}
            min={50}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            This will be the default attendance requirement for new subjects
          </p>
        </div>

        {/* Warning Thresholds */}
        <div className="space-y-4">
          <Label>Alert Thresholds</Label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show warning at</Label>
              <Badge variant="outline" className="text-warning border-warning">
                {settings.showWarningAt}%
              </Badge>
            </div>
            <Slider
              value={[settings.showWarningAt]}
              onValueChange={(value) => updateSettings({ showWarningAt: value[0] })}
              max={100}
              min={70}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show critical at</Label>
              <Badge variant="destructive">
                {settings.showCriticalAt}%
              </Badge>
            </div>
            <Slider
              value={[settings.showCriticalAt]}
              onValueChange={(value) => updateSettings({ showCriticalAt: value[0] })}
              max={settings.showWarningAt}
              min={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Duty Leaves in Attendance</Label>
              <p className="text-xs text-muted-foreground">
                Count duty leaves as present when calculating percentages
              </p>
            </div>
            <Switch
              checked={settings.includeDutyLeaves}
              onCheckedChange={(checked) => updateSettings({ includeDutyLeaves: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-mark Weekends</Label>
              <p className="text-xs text-muted-foreground">
                Automatically skip weekend days in attendance tracking
              </p>
            </div>
            <Switch
              checked={settings.autoMarkWeekends}
              onCheckedChange={(checked) => updateSettings({ autoMarkWeekends: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Reminders</Label>
              <p className="text-xs text-muted-foreground">
                Get notified about today's classes and attendance status
              </p>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
            />
          </div>
        </div>

        {/* Reminder Time */}
        {settings.notificationsEnabled && (
          <div className="space-y-2">
            <Label htmlFor="reminderTime">Daily Reminder Time</Label>
            <Input
              id="reminderTime"
              type="time"
              value={settings.reminderTime}
              onChange={(e) => updateSettings({ reminderTime: e.target.value })}
              className="w-32"
            />
          </div>
        )}

        {/* Save Status & Reset */}
        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {saveStatus === 'saving' && (
              <p className="text-xs text-blue-600">Saving...</p>
            )}
            {saveStatus === 'saved' && (
              <p className="text-xs text-green-600 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Settings saved automatically
              </p>
            )}
            {saveStatus === 'error' && (
              <p className="text-xs text-red-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Failed to save settings
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            className="flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}