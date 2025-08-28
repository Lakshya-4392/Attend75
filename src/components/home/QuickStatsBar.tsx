import { TrendingUp, BookOpen, Target, Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AttendanceStats } from "@/types/attendance";

interface EnhancedAttendanceStats extends AttendanceStats {
  totalClassesHeld?: number;
  totalClassesAttended?: number;
}

interface QuickStatsBarProps {
  stats: EnhancedAttendanceStats;
}

export function QuickStatsBar({ stats }: QuickStatsBarProps) {
  const attendancePercentage = Math.round(stats.attendancePercentage || 0);
  
  const statItems = [
    {
      label: "Overall Attendance",
      value: `${attendancePercentage}%`,
      icon: Target,
      color: attendancePercentage >= 75 ? "text-success" : "text-destructive",
      showProgress: true,
      progressValue: attendancePercentage
    },
    {
      label: "Classes Attended", 
      value: `${stats.totalClassesAttended || 0}/${stats.totalClassesHeld || 0}`,
      icon: BookOpen,
      color: "text-primary"
    },
    {
      label: "Total Classes",
      value: stats.totalClassesHeld || 0,
      icon: TrendingUp,
      color: "text-muted-foreground"
    }
  ];

  return (
    <div className="space-y-3">
      {/* Live indicator */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Attendance Overview</h3>
        <Badge variant="secondary" className="text-xs">
          <Radio className="h-3 w-3 mr-1 text-success animate-pulse" />
          Live Updates
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statItems.map((item) => (
          <Card key={item.label} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`${item.color} bg-current/10 p-2 rounded-lg`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                  {item.showProgress && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            item.progressValue >= 75 ? "bg-success" : "bg-destructive"
                          }`}
                          style={{ width: `${Math.min(item.progressValue, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}