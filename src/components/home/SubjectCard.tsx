import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subject, AttendanceRecord } from "@/types/attendance";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
  attendanceRecord?: AttendanceRecord;
  getSubjectAttendanceData: (subjectId: string) => {
    classesAttended: number;
    classesHeld: number;
    attendancePercentage: number;
  };
  onMarkAttendance: (subjectId: string, status: 'present' | 'absent') => void;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function SubjectCard({ subject, attendanceRecord, getSubjectAttendanceData, onMarkAttendance }: SubjectCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate attendance data dynamically so it updates when records change
  const attendanceData = getSubjectAttendanceData(subject.id);
  const attendancePercentage = Math.round(attendanceData.attendancePercentage);
  
  const handleMarkAttendance = (status: 'present' | 'absent') => {
    setIsLoading(true);
    try {
      onMarkAttendance(subject.id, status);
      // Small delay to show the loading state
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present':
        return 'text-success';
      case 'absent':
        return 'text-destructive';
      case 'duty-leave':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'present':
        return <Check className="h-4 w-4" />;
      case 'absent':
        return <X className="h-4 w-4" />;
      case 'duty-leave':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="group transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{subject.name}</CardTitle>
          <div className={cn(
            "flex items-center space-x-1 text-sm font-medium",
            getStatusColor(attendanceRecord?.status)
          )}>
            {getStatusIcon(attendanceRecord?.status)}
            {attendanceRecord?.status && (
              <span className="capitalize">{attendanceRecord.status.replace('-', ' ')}</span>
            )}
          </div>
        </div>
        
        {/* Days of week */}
        <div className="flex space-x-1">
          {subject.daysOfWeek.map(day => (
            <Badge key={day} variant="secondary" className="text-xs">
              {dayNames[day]}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Attendance percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Attendance</span>
            <span className={cn(
              "font-medium",
              attendancePercentage >= subject.requiredAttendance ? "text-success" : "text-destructive"
            )}>
              {attendancePercentage}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                attendancePercentage >= subject.requiredAttendance ? "bg-success" : "bg-destructive"
              )}
              style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {attendanceData.classesAttended} of {attendanceData.classesHeld} classes attended
          </div>
        </div>

        {/* Attendance buttons */}
        {!attendanceRecord && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleMarkAttendance('present')}
              disabled={isLoading}
              variant="success"
            >
              <Check className="h-4 w-4 mr-2" />
              Present
            </Button>
            <Button
              onClick={() => handleMarkAttendance('absent')}
              disabled={isLoading}
              variant="destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Absent
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}