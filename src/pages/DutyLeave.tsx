import { useState } from "react";
import { FileText, Calendar, ToggleLeft, ToggleRight, Trash2, Plus, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useAttendance } from "@/hooks/useAttendance";

export default function DutyLeave() {
  const { subjects, attendanceRecords, toggleDutyLeave } = useAttendance();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    date: "",
    subjectId: "",
    reason: ""
  });

  // Get all duty leave records from attendance records
  const dutyLeaveRecords = attendanceRecords.filter(record => record.status === 'duty-leave');

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || "Subject Not Found";
  };

  const handleAddLeave = () => {
    if (newLeave.date && newLeave.subjectId && newLeave.reason) {
      // This would need to be implemented in the attendance system
      // For now, we'll show a message that this needs to be marked from the home page
      alert("To mark duty leave, please go to the Home page and mark attendance first, then toggle it to duty leave.");
      setNewLeave({ date: "", subjectId: "", reason: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleToggleDutyLeave = (recordId: string) => {
    toggleDutyLeave(recordId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Duty Leave Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your duty leaves and authorized absences</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              How to Mark Duty Leave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Mark Duty Leave</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Steps to mark duty leave:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Go to the <strong>Home page</strong></li>
                  <li>Find the subject for the day you want to mark duty leave</li>
                  <li>Click <strong>"Present"</strong> to mark attendance first</li>
                  <li>The attendance will be recorded as present</li>
                  <li>If needed, you can toggle it to duty leave status later</li>
                </ol>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Duty leaves are counted as present in your attendance percentage, 
                  so they help maintain your required attendance level.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {dutyLeaveRecords.length === 0 ? (
          <Card className="bg-gradient-to-br from-background/50 to-background/80 backdrop-blur-sm border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Duty Leaves</h3>
              <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base max-w-md">
                You haven't marked any duty leaves yet. To mark duty leave, go to the Home page, 
                mark attendance first, then toggle it to duty leave status.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go to Home Page
              </Button>
            </CardContent>
          </Card>
        ) : (
          dutyLeaveRecords.map((record) => {
            const subject = subjects.find(s => s.id === record.subjectId);
            return (
              <Card key={record.id} className="bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-sm border-border/40 hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 pb-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-warning mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">
                        {subject?.name || "Subject Not Found"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end space-x-2 sm:space-x-0 sm:space-y-2">
                    <Badge variant="outline" className="text-warning border-warning text-xs">
                      Duty Leave
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleDutyLeave(record.id)}
                        className="h-8 px-2 text-xs"
                        title="Convert back to absent"
                      >
                        <ToggleRight className="h-4 w-4 mr-1" />
                        Revert
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {record.reason || "No reason provided"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    This attendance is counted as present in your attendance percentage.
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}