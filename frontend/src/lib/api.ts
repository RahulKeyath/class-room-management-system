// frontend/src/lib/api.ts

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper for standard API calls
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody}`);
  }

  return response.json();
}

/* ── Attendance Types (Matching backend Go models) ────────── */
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: number;
  class_id: number;
  student_id: number;
  student_name?: string;
  date: string;
  status: AttendanceStatus;
}

export interface MarkAttendancePayload {
  class_id: number;
  student_id: number;
  date: string; // "YYYY-MM-DD"
  status: AttendanceStatus;
}

/* ── API Methods ─────────────────────────────────────────── */
export const api = {
  // Health check
  getHealth: () => fetchAPI<{ status: string; time: string }>("/health"),

  // Attendance endpoints
  getAttendanceRecord: (id: number) =>
    fetchAPI<AttendanceRecord>(`/api/v1/attendance/${id}`),

  markAttendance: (payload: MarkAttendancePayload) =>
    fetchAPI<AttendanceRecord>("/api/v1/attendance", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};