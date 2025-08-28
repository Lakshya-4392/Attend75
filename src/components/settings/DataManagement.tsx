import { useState } from "react";
import { Download, Upload, Trash2, Archive } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAttendance } from "@/hooks/useAttendance";

export function DataManagement() {
  const { subjects, attendanceRecords, getSubjectAttendanceData, importData, clearAllData } = useAttendance();
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const exportData = () => {
    const data = {
      subjects,
      attendanceRecords,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Create CSV data
    const csvData = [
      ['Date', 'Subject', 'Status', 'Attendance %', 'Classes Held', 'Classes Attended']
    ];

    subjects.forEach(subject => {
      const subjectRecords = attendanceRecords.filter(r => r.subjectId === subject.id);
      const attendanceData = getSubjectAttendanceData(subject.id);
      const percentage = Math.round(attendanceData.attendancePercentage);
      
      if (subjectRecords.length > 0) {
        subjectRecords.forEach(record => {
          csvData.push([
            record.date,
            subject.name,
            record.status,
            `${percentage}%`,
            attendanceData.classesHeld.toString(),
            attendanceData.classesAttended.toString()
          ]);
        });
      } else {
        csvData.push([
          '',
          subject.name,
          'No records',
          `${percentage}%`,
          attendanceData.classesHeld.toString(),
          attendanceData.classesAttended.toString()
        ]);
      }
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError(null);
    setImportSuccess(false);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate the imported data structure
        if (!data.subjects || !Array.isArray(data.subjects)) {
          throw new Error('Invalid data format: subjects array is missing or invalid');
        }
        
        if (!data.attendanceRecords || !Array.isArray(data.attendanceRecords)) {
          throw new Error('Invalid data format: attendanceRecords array is missing or invalid');
        }
        
        // Validate data version compatibility
        if (data.version && data.version !== "1.0") {
          console.warn('Data version mismatch. Attempting to import anyway.');
        }
        
        // Import the data
        importData({
          subjects: data.subjects,
          attendanceRecords: data.attendanceRecords
        });
        
        setImportSuccess(true);
        setImporting(false);
        
        // Clear the file input
        event.target.value = '';
        
      } catch (error) {
        console.error('Error importing data:', error);
        setImportError(error instanceof Error ? error.message : 'Failed to import data');
        setImporting(false);
      }
    };
    
    reader.onerror = () => {
      setImportError('Failed to read the file');
      setImporting(false);
    };
    
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    clearAllData();
    // Also clear localStorage settings
    try {
      localStorage.removeItem('attendanceSettings');
      localStorage.removeItem('accent-color');
      localStorage.removeItem('vite-ui-theme');
    } catch (error) {
      console.warn('Failed to clear some localStorage items:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Export, import, and manage your attendance data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Export Data</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" onClick={exportData} className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
            <Button variant="outline" onClick={exportToExcel} className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            JSON format preserves all data. CSV format is Excel-compatible.
          </p>
        </div>

        {/* Import Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Import Data</h4>
          <div className="space-y-2">
            <Label htmlFor="import-file">Select backup file</Label>
            <Input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
            />
            {importing && (
              <p className="text-xs text-blue-600">Importing data...</p>
            )}
            {importSuccess && (
              <p className="text-xs text-green-600">✅ Data imported successfully!</p>
            )}
            {importError && (
              <p className="text-xs text-red-600">❌ {importError}</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Import a previously exported JSON file to restore your data.
          </p>
        </div>

        {/* Data Statistics */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Data Overview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Subjects</div>
              <div className="font-medium">{subjects.length}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Records</div>
              <div className="font-medium">{attendanceRecords.length}</div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="justify-start">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your subjects, attendance records, and settings. 
                  This action cannot be undone. Make sure to export your data first if you want to keep it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="text-xs text-muted-foreground">
            This action will remove all data from your browser's storage.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}