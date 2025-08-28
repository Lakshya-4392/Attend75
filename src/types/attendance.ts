// Day of week type for better type safety
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0, Monday = 1, ..., Saturday = 6

// Attendance status with clear definitions
export type AttendanceStatus = 'present' | 'absent' | 'duty-leave';

// Date string in ISO format (YYYY-MM-DD)
export type DateString = string;

// Color in hex format
export type HexColor = string;

// Percentage value (0-100)
export type Percentage = number;

export interface Subject {
  readonly id: string;
  name: string;
  classesHeld: number;
  classesAttended: number;
  requiredAttendance: Percentage; // 0-100
  daysOfWeek: DayOfWeek[]; // Array of day numbers (0-6)
  color: HexColor;
  semester?: string;
  createdAt?: DateString;
  updatedAt?: DateString;
}

// Input type for creating a new subject (without generated fields)
export type CreateSubjectInput = Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>;

// Input type for updating a subject (all fields optional except id)
export type UpdateSubjectInput = Partial<Omit<Subject, 'id'>> & { id: string };

export interface AttendanceRecord {
  readonly id: string;
  subjectId: string;
  date: DateString; // ISO date format (YYYY-MM-DD)
  status: AttendanceStatus;
  reason?: string;
  createdAt?: DateString;
  updatedAt?: DateString;
}

// Input type for creating a new attendance record
export type CreateAttendanceRecordInput = Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>;

// Input type for updating an attendance record
export type UpdateAttendanceRecordInput = Partial<Omit<AttendanceRecord, 'id'>> & { id: string };

export interface DaySchedule {
  date: DateString;
  subjects: Subject[];
  dayOfWeek: DayOfWeek;
}

export interface AttendanceStats {
  totalPresent: number;
  totalAbsent: number;
  totalDutyLeave: number;
  totalRecords: number;
  attendancePercentage: Percentage;
}

// Extended stats for detailed analysis
export interface DetailedAttendanceStats extends AttendanceStats {
  subjectId?: string;
  subjectName?: string;
  dateRange?: {
    start: DateString;
    end: DateString;
  };
  trend?: 'improving' | 'declining' | 'stable';
}

// Subject-specific attendance data
export interface SubjectAttendanceData {
  classesAttended: number;
  classesHeld: number;
  attendancePercentage: Percentage;
  isAtRisk: boolean;
  classesNeededToReachTarget?: number;
}

// Settings interface (moved from hook to types for better organization)
export interface AttendanceSettings {
  defaultRequiredAttendance: Percentage;
  includeDutyLeaves: boolean;
  showWarningAt: Percentage;
  showCriticalAt: Percentage;
  autoMarkWeekends: boolean;
  notificationsEnabled: boolean;
  reminderTime: string; // HH:MM format
}

// Export/Import data structure
export interface AttendanceDataExport {
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  settings?: AttendanceSettings;
  exportDate: DateString;
  version: string;
}

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter and sort options
export interface AttendanceFilter {
  subjectIds?: string[];
  dateRange?: {
    start: DateString;
    end: DateString;
  };
  status?: AttendanceStatus[];
  semester?: string;
}

export interface SortOptions {
  field: keyof Subject | keyof AttendanceRecord;
  direction: 'asc' | 'desc';
}

// Utility types for better type safety
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Constants for validation
export const VALIDATION_CONSTANTS = {
  MIN_REQUIRED_ATTENDANCE: 50,
  MAX_REQUIRED_ATTENDANCE: 100,
  MIN_SUBJECT_NAME_LENGTH: 1,
  MAX_SUBJECT_NAME_LENGTH: 100,
  MAX_REASON_LENGTH: 500,
  DATE_FORMAT_REGEX: /^\d{4}-\d{2}-\d{2}$/,
  TIME_FORMAT_REGEX: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  HEX_COLOR_REGEX: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
} as const;

// Type guards for runtime type checking
export const isValidDayOfWeek = (day: number): day is DayOfWeek => {
  return Number.isInteger(day) && day >= 0 && day <= 6;
};

export const isValidAttendanceStatus = (status: string): status is AttendanceStatus => {
  return ['present', 'absent', 'duty-leave'].includes(status);
};

export const isValidDateString = (date: string): date is DateString => {
  return VALIDATION_CONSTANTS.DATE_FORMAT_REGEX.test(date) && !isNaN(Date.parse(date));
};

export const isValidPercentage = (value: number): value is Percentage => {
  return Number.isFinite(value) && value >= 0 && value <= 100;
};

export const isValidHexColor = (color: string): color is HexColor => {
  return VALIDATION_CONSTANTS.HEX_COLOR_REGEX.test(color);
};