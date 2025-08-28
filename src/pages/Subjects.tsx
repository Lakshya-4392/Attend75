import { useState } from "react";
import { Plus, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";
import { AddSubjectDialog } from "@/components/subjects/AddSubjectDialog";
import { SubjectManagementCard } from "@/components/subjects/SubjectManagementCard";
import { EditSubjectDialog } from "@/components/subjects/EditSubjectDialog";
import { Subject } from "@/types/attendance";

export default function Subjects() {
  const { subjects, addSubject, updateSubject, deleteSubject, getSubjectAttendanceData } = useAttendance();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.semester?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Manage Subjects</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Add and configure your subjects</p>
        </div>
        <AddSubjectDialog onAddSubject={addSubject} />
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Total: {subjects.length} subjects</span>
          <span>Active: {subjects.length}</span>
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => {
            const attendanceData = getSubjectAttendanceData(subject.id);
            return (
              <SubjectManagementCard
                key={subject.id}
                subject={subject}
                attendanceData={attendanceData}
                onEdit={handleEditSubject}
                onDelete={deleteSubject}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "No subjects found" : "No subjects yet"}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {searchTerm 
                ? "Try adjusting your search terms to find the subject you're looking for."
                : "Get started by adding your first subject. You can specify which days you have classes and track your attendance."
              }
            </p>
            {!searchTerm && (
              <AddSubjectDialog 
                onAddSubject={addSubject}
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Subject
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Subject Dialog */}
      <EditSubjectDialog
        subject={editingSubject}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdateSubject={updateSubject}
      />
    </div>
  );
}