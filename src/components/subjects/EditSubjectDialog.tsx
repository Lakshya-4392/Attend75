import { useState, useEffect } from "react";
import { Edit, BookOpen, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Subject, DayOfWeek } from "@/types/attendance";

interface EditSubjectDialogProps {
  subject: Subject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSubject: (id: string, updates: Partial<Subject>) => void;
}

const daysOfWeek = [
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
  { id: 6, name: 'Saturday', short: 'Sat' },
  { id: 0, name: 'Sunday', short: 'Sun' },
];

export function EditSubjectDialog({ subject, open, onOpenChange, onUpdateSubject }: EditSubjectDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    classesHeld: 0,
    classesAttended: 0,
    requiredAttendance: [75],
    daysOfWeek: [] as number[],
    semester: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    if (subject) {
      const data = {
        name: subject.name,
        classesHeld: subject.classesHeld,
        classesAttended: subject.classesAttended,
        requiredAttendance: [subject.requiredAttendance],
        daysOfWeek: subject.daysOfWeek,
        semester: subject.semester || ''
      };
      setFormData(data);
      setOriginalData(data);
      setHasUnsavedChanges(false);
    }
  }, [subject]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, originalData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }
    
    if (formData.classesAttended > formData.classesHeld) {
      newErrors.classesAttended = 'Attended classes cannot exceed total classes';
    }
    
    if (formData.daysOfWeek.length === 0) {
      newErrors.daysOfWeek = 'Select at least one day of the week';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !subject) return;

    const updates: Partial<Subject> = {
      name: formData.name.trim(),
      classesHeld: formData.classesHeld,
      classesAttended: formData.classesAttended,
      requiredAttendance: formData.requiredAttendance[0],
      daysOfWeek: formData.daysOfWeek as DayOfWeek[],
      semester: formData.semester
    };

    onUpdateSubject(subject.id, updates);
    setErrors({});
    setHasUnsavedChanges(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleForceClose = () => {
    setShowUnsavedWarning(false);
    setHasUnsavedChanges(false);
    onOpenChange(false);
  };

  const handleDayToggle = (dayId: number) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayId)
        ? prev.daysOfWeek.filter(id => id !== dayId)
        : [...prev.daysOfWeek, dayId]
    }));
  };

  if (!subject) return null;

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Subject
          </DialogTitle>
          <DialogDescription>
            Update subject information and schedule.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Subject Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              placeholder="e.g., Computer Networks"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Class Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classesHeld">Total Classes Held</Label>
              <Input
                id="classesHeld"
                type="number"
                min="0"
                value={formData.classesHeld}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  classesHeld: Math.max(0, parseInt(e.target.value) || 0)
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classesAttended">Classes Attended</Label>
              <Input
                id="classesAttended"
                type="number"
                min="0"
                max={formData.classesHeld}
                value={formData.classesAttended}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  classesAttended: Math.max(0, parseInt(e.target.value) || 0)
                }))}
                className={errors.classesAttended ? "border-destructive" : ""}
              />
              {errors.classesAttended && (
                <p className="text-sm text-destructive">{errors.classesAttended}</p>
              )}
            </div>
          </div>

          {/* Required Attendance */}
          <div className="space-y-3">
            <Label>Required Attendance: {formData.requiredAttendance[0]}%</Label>
            <Slider
              value={formData.requiredAttendance}
              onValueChange={(value) => setFormData(prev => ({ ...prev, requiredAttendance: value }))}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Days of Week */}
          <div className="space-y-3">
            <Label>Days of Week</Label>
            <div className="grid grid-cols-4 gap-2">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-day-${day.id}`}
                    checked={formData.daysOfWeek.includes(day.id)}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <Label 
                    htmlFor={`edit-day-${day.id}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {day.short}
                  </Label>
                </div>
              ))}
            </div>
            {errors.daysOfWeek && (
              <p className="text-sm text-destructive">{errors.daysOfWeek}</p>
            )}
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              placeholder="e.g., Fall 2023"
              value={formData.semester}
              onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!hasUnsavedChanges}>
            {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Unsaved Changes Warning */}
    <AlertDialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Unsaved Changes
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes that will be lost if you close this dialog. 
            Are you sure you want to continue without saving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Editing</AlertDialogCancel>
          <AlertDialogAction onClick={handleForceClose} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}