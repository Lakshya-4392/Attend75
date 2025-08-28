import { useAttendance } from "@/hooks/useAttendance";
import { TodaysSummary } from "@/components/home/TodaysSummary";
import { SubjectCard } from "@/components/home/SubjectCard";
import { QuickStatsBar } from "@/components/home/QuickStatsBar";

export default function Home() {
  const {
    getTodaysSubjects,
    markAttendance,
    attendanceRecords,
    getSubjectAttendanceData,
    subjects
  } = useAttendance();

  const today = new Date().toISOString().split('T')[0];
  const todaysSubjects = getTodaysSubjects(today);

  // Get today's attendance records
  const todaysRecords = attendanceRecords.filter(record => record.date === today);

  // Calculate overall attendance stats combining initial data + records (real-time updates)
  const calculateOverallStats = () => {
    // Calculate totals by combining initial subject data with attendance records
    let totalClassesHeld = 0;
    let totalClassesAttended = 0;

    subjects.forEach(subject => {
      const subjectData = getSubjectAttendanceData(subject.id);
      totalClassesHeld += subjectData.classesHeld;
      totalClassesAttended += subjectData.classesAttended;
    });

    // Calculate from records for the other stats
    const allRecords = attendanceRecords;
    const totalPresent = allRecords.filter(r => r.status === 'present' || r.status === 'duty-leave').length;
    const totalAbsent = allRecords.filter(r => r.status === 'absent').length;
    const totalDutyLeave = allRecords.filter(r => r.status === 'duty-leave').length;
    const totalRecords = allRecords.length;

    // Calculate attendance percentage
    const attendancePercentage = totalClassesHeld > 0 ? (totalClassesAttended / totalClassesHeld) * 100 : 0;



    return {
      totalPresent,
      totalAbsent,
      totalDutyLeave,
      totalRecords,
      totalClassesHeld,
      totalClassesAttended,
      attendancePercentage
    };
  };

  const enhancedStats = calculateOverallStats();

  const handleMarkAttendance = (subjectId: string, status: 'present' | 'absent') => {
    try {
      markAttendance(subjectId, today, status);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      // In a real app, you might want to show a toast notification here
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <TodaysSummary date={today} totalClasses={todaysSubjects.length} />

      {/* Quick Stats - Overall Attendance */}
      <QuickStatsBar stats={enhancedStats} />

      {/* Subject List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Today's Classes</h2>

        {todaysSubjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todaysSubjects.map((subject) => {
              const attendanceRecord = todaysRecords.find(
                record => record.subjectId === subject.id
              );

              return (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  attendanceRecord={attendanceRecord}
                  getSubjectAttendanceData={getSubjectAttendanceData}
                  onMarkAttendance={handleMarkAttendance}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No classes scheduled for today!</p>
            <p className="text-sm mt-2">Enjoy your free day 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}