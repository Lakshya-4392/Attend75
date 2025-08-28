import { useState } from "react";
import { MoreVertical, Edit, Trash2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Subject } from "@/types/attendance";
import { cn } from "@/lib/utils";

interface SubjectManagementCardProps {
  subject: Subject;
  attendanceData: {
    classesAttended: number;
    classesHeld: number;
    attendancePercentage: number;
  };
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function SubjectManagementCard({ subject, attendanceData, onEdit, onDelete }: SubjectManagementCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const attendancePercentage = Math.round(attendanceData.attendancePercentage);
  const isAtRisk = attendancePercentage < subject.requiredAttendance;

  return (
    <>
      <Card className="group transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate">
              {subject.name}
            </CardTitle>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(subject)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Days of week */}
          <div className="flex flex-wrap gap-1">
            {subject.daysOfWeek.map(day => (
              <Badge key={day} variant="secondary" className="text-xs">
                {dayNames[day]}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Attendance Stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Attendance</span>
              <span className={cn(
                "font-bold",
                isAtRisk ? "text-destructive" : "text-success"
              )}>
                {attendancePercentage}%
              </span>
            </div>
            
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-300",
                  isAtRisk ? "bg-destructive" : "bg-success"
                )}
                style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
              />
            </div>
            
            <div className="text-xs text-muted-foreground">
              {attendanceData.classesAttended} of {attendanceData.classesHeld} classes attended
            </div>
          </div>

          {/* Status and Quick Info */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Target: {subject.requiredAttendance}%
            </div>
            {isAtRisk && (
              <Badge variant="destructive" className="text-xs">
                At Risk
              </Badge>
            )}
          </div>

          {/* Semester */}
          {subject.semester && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {subject.semester}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subject.name}"? This will remove all attendance records for this subject. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(subject.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}