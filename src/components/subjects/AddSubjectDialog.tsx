import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Subject, DayOfWeek } from "@/types/attendance";
import { useAttendanceSettings } from "@/hooks/useAttendanceSettings";

interface AddSubjectDialogProps {
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  trigger?: React.ReactNode;
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

export function AddSubjectDialog({ onAddSubject, trigger }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false);
  const { settings } = useAttendanceSettings();
  
  // Generate current semester based on current date
  const getCurrentSemester = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0-indexed, so add 1
    
    if (month >= 1 && month <= 5) {
      return `Spring ${year}`;
    } else if (month >= 6 && month <= 8) {
      return `Summer ${year}`;
    } else {
      return `Fall ${year}`;
    }
  };
  
  const [formData, setFormData] = useState({
    name: '',
    classesHeld: 0,
    classesAttended: 0,
    requiredAttendance: [settings.defaultRequiredAttendance],
    daysOfWeek: [] as number[],
    semester: getCurrentSemester()
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!validateForm()) return;

    const colors = [
      'hsl(175, 75%, 45%)', // teal
      'hsl(260, 30%, 65%)', // lavender
      'hsl(140, 75%, 45%)', // green
      'hsl(45, 95%, 55%)',  // yellow
      'hsl(210, 75%, 55%)', // blue
      'hsl(320, 75%, 55%)', // pink
    ];

    const newSubject: Omit<Subject, 'id'> = {
      name: formData.name.trim(),
      classesHeld: formData.classesHeld,
      classesAttended: formData.classesAttended,
      requiredAttendance: formData.requiredAttendance[0],
      daysOfWeek: formData.daysOfWeek as DayOfWeek[],
      color: colors[Math.floor(Math.random() * colors.length)],
      semester: formData.semester
    };

    onAddSubject(newSubject);
    
    // Reset form
    setFormData({
      name: '',
      classesHeld: 0,
      classesAttended: 0,
      requiredAttendance: [settings.defaultRequiredAttendance],
      daysOfWeek: [],
      semester: getCurrentSemester()
    });
    setErrors({});
    setOpen(false);
  };

  const handleDayToggle = (dayId: number) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayId)
        ? prev.daysOfWeek.filter(id => id !== dayId)
        : [...prev.daysOfWeek, dayId]
    }));
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Add Subject
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Add New Subject
          </DialogTitle>
          <DialogDescription>
            Add a new subject to track your attendance. Specify which days you have classes.
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
                    id={`day-${day.id}`}
                    checked={formData.daysOfWeek.includes(day.id)}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <Label 
                    htmlFor={`day-${day.id}`} 
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Subject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}