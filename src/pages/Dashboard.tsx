import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAttendance } from "@/hooks/useAttendance";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/attendance";

export default function Dashboard() {
  const { subjects, getAttendanceStats, attendanceRecords, getSubjectAttendanceData } = useAttendance();

  const handleExportReport = () => {
    // Create comprehensive report data
    const reportData = {
      generatedDate: new Date().toISOString(),
      overallStats: getAttendanceStats(),
      subjects: subjects.map(subject => {
        const attendanceData = getSubjectAttendanceData(subject.id);
        const subjectRecords = attendanceRecords.filter(r => r.subjectId === subject.id);
        return {
          name: subject.name,
          requiredAttendance: subject.requiredAttendance,
          currentAttendance: Math.round(attendanceData.attendancePercentage),
          classesHeld: attendanceData.classesHeld,
          classesAttended: attendanceData.classesAttended,
          isAtRisk: attendanceData.attendancePercentage < subject.requiredAttendance,
          records: subjectRecords
        };
      }),
      totalSubjects: subjects.length,
      atRiskSubjects: subjects.filter(subject => {
        const attendanceData = getSubjectAttendanceData(subject.id);
        return attendanceData.attendancePercentage < subject.requiredAttendance;
      }).length
    };

    // Export as JSON
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const overallStats = getAttendanceStats();
  
  // Calculate attendance stats without duty leave
  const statsWithoutDutyLeave = {
    totalPresent: attendanceRecords.filter(r => r.status === 'present').length,
    totalAbsent: attendanceRecords.filter(r => r.status === 'absent').length,
    totalDutyLeave: attendanceRecords.filter(r => r.status === 'duty-leave').length,
    attendancePercentage: (() => {
      const nonDutyRecords = attendanceRecords.filter(r => r.status !== 'duty-leave');
      const presentCount = nonDutyRecords.filter(r => r.status === 'present').length;
      return nonDutyRecords.length > 0 ? (presentCount / nonDutyRecords.length) * 100 : 0;
    })()
  };
  
  // Calculate subjects needing attention
  const atRiskSubjects = subjects.filter(subject => {
    const attendanceData = getSubjectAttendanceData(subject.id);
    return attendanceData.attendancePercentage < subject.requiredAttendance;
  });

  const getClassesNeeded = (subject: Subject) => {
    const attendanceData = getSubjectAttendanceData(subject.id);
    const currentPercentage = attendanceData.attendancePercentage;
    if (currentPercentage >= subject.requiredAttendance) return 0;
    
    // Calculate classes needed to reach required percentage
    const targetAttendance = subject.requiredAttendance / 100;
    const classesNeeded = Math.ceil(
      (targetAttendance * attendanceData.classesHeld - attendanceData.classesAttended) / 
      (1 - targetAttendance)
    );
    return Math.max(0, classesNeeded);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Overview of your attendance performance</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportReport}>
          <BarChart3 className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Duty Leave</p>
                <p className="text-2xl font-bold">{Math.round(overallStats.attendancePercentage)}%</p>
                <p className="text-xs text-muted-foreground">Without: {Math.round(statsWithoutDutyLeave.attendancePercentage)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-success/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-2xl font-bold">{overallStats.totalPresent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold">{overallStats.totalAbsent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-warning/10 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold">{atRiskSubjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => {
              const attendanceData = getSubjectAttendanceData(subject.id);
              const percentage = Math.round(attendanceData.attendancePercentage);
              const isAtRisk = percentage < subject.requiredAttendance;
              const classesNeeded = getClassesNeeded(subject);
              
              return (
                <div key={subject.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{subject.name}</h3>
                        {isAtRisk && (
                          <Badge variant="destructive" className="text-xs">
                            At Risk
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {attendanceData.classesAttended} of {attendanceData.classesHeld} classes attended
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-lg font-bold",
                        isAtRisk ? "text-destructive" : "text-success"
                      )}>
                        {percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Target: {subject.requiredAttendance}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-300",
                          isAtRisk ? "bg-destructive" : "bg-success"
                        )}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    {/* Classes needed info */}
                    {isAtRisk && classesNeeded > 0 && (
                      <p className="text-sm text-destructive">
                        Attend {classesNeeded} more consecutive classes to reach {subject.requiredAttendance}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* At Risk Subjects */}
      {atRiskSubjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">⚠️ Subjects Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atRiskSubjects.map((subject) => {
                const attendanceData = getSubjectAttendanceData(subject.id);
                const percentage = Math.round(attendanceData.attendancePercentage);
                const classesNeeded = getClassesNeeded(subject);
                
                return (
                  <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg bg-destructive/5">
                    <div>
                      <h4 className="font-medium">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">Current: {percentage}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-destructive">
                        Need {classesNeeded} more classes
                      </p>
                      <p className="text-xs text-muted-foreground">
                        to reach {subject.requiredAttendance}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}