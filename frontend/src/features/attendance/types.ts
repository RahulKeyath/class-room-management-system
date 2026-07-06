/**
 * TypeScript interfaces mirroring the Go backend domain structs.
 * Keep these in sync with `backend/internal/attendance/models.go`.
 */

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: "student" | "teacher";
  created_at: string;
}

export interface ClassInfo {
  id: number;
  name: string;
  teacher_id: number;
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  class_id: number;
  student_id: number;
  student_name?: string;
  date: string;
  status: AttendanceStatus;
}

export interface MarkAttendanceRequest {
  class_id: number;
  student_id: number;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}
