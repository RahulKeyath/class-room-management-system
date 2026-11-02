// frontend/src/lib/api.ts
import type { Institution } from "@/lib/institutions";

const rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:8000").trim();
// Automatically ensure localhost development uses http:// to prevent SSL protocol errors
export const API_BASE_URL = rawUrl.replace(/^https:\/\/localhost/, "http://localhost");

const AUTH_TOKEN_KEY = "crm_auth_token";

export function getAuthToken(): string | null {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  try {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // Ignore storage errors
  }
}

export function clearAuthToken() {
  try {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // Ignore storage errors
  }
}

// Helper for standard API calls
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error ${response.status}: ${errorBody}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    const text = await response.text();
    return text ? (JSON.parse(text) as T) : (null as T);
  } catch (err) {
    console.error(`[API] Error calling ${url}:`, err);
    throw err;
  }
}

/* ── Auth Types (Matching backend Go models) ────────────── */
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  department: string;
  institution_id: number;
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
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

/* ── Role Types (Matching backend Go models) ────────────── */
export interface DbUserRole {
  id: number;
  role: string;
  status: string;
}

export interface DbDepartment {
  id: number;
  name: string;
}

export interface DbPermission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface DbInstitutionalRole {
  id: number;
  name: string;
  slug: string;
  department: string;
  description: string;
  status: "active" | "inactive";
  isSystem: boolean;
  color: string;
  iconName: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  institutionId: number;
}

export interface CreateRolePayload {
  institutionId: number;
  name: string;
  slug: string;
  department?: string;
  description?: string;
  status?: "active" | "inactive";
  color?: string;
  iconName?: string;
  permissions: string[];
}

export interface UpdateRolePayload {
  name: string;
  slug: string;
  department?: string;
  description?: string;
  status?: "active" | "inactive";
  color?: string;
  iconName?: string;
  permissions: string[];
}

/* ── Institution Types (Matching backend Go models) ────────── */
export type CreateInstitutionPayload = Omit<Institution, "id">;

/* ── API Methods ─────────────────────────────────────────── */
export const api = {
  // Health check
  getHealth: () => fetchAPI<{ status: string; time: string }>("/health"),

  // Auth endpoints
  login: (email: string, password: string) =>
    fetchAPI<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => fetchAPI<ApiUser>("/api/v1/auth/me"),

  // Institution endpoints
  getInstitutions: () => fetchAPI<Institution[]>("/api/v1/institutions"),
  createInstitution: (payload: CreateInstitutionPayload) =>
    fetchAPI<Institution>("/api/v1/institutions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Role & Department endpoints
  getUserRoles: () => fetchAPI<DbUserRole[]>("/api/v1/roles"),
  getDepartments: () => fetchAPI<DbDepartment[]>("/api/v1/departments"),
  createDepartment: (name: string) =>
    fetchAPI<DbDepartment>("/api/v1/departments", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  deleteDepartment: (name: string) =>
    fetchAPI<void>(`/api/v1/departments/${encodeURIComponent(name)}`, {
      method: "DELETE",
    }),

  // Permission endpoints
  getPermissions: () => fetchAPI<DbPermission[]>("/api/v1/permissions"),
  seedPermissions: () =>
    fetchAPI<DbPermission[]>("/api/v1/permissions/seed", {
      method: "POST",
    }),

  // Institutional Roles CRUD (PostgreSQL roles and role_permissions tables)
  getInstitutionalRoles: (institutionId?: number | string) =>
    fetchAPI<DbInstitutionalRole[]>(
      institutionId !== undefined && institutionId !== ""
        ? `/api/v1/institutional-roles?institution_id=${encodeURIComponent(institutionId)}`
        : "/api/v1/institutional-roles",
    ),
  createInstitutionalRole: (payload: CreateRolePayload) =>
    fetchAPI<DbInstitutionalRole>("/api/v1/institutional-roles", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateInstitutionalRole: (id: number | string, payload: UpdateRolePayload) =>
    fetchAPI<DbInstitutionalRole>(`/api/v1/institutional-roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteInstitutionalRole: (id: number | string) =>
    fetchAPI<void>(`/api/v1/institutional-roles/${id}`, {
      method: "DELETE",
    }),

  // Attendance endpoints
  getAttendanceRecord: (id: number) =>
    fetchAPI<AttendanceRecord>(`/api/v1/attendance/${id}`),

  markAttendance: (payload: MarkAttendancePayload) =>
    fetchAPI<AttendanceRecord>("/api/v1/attendance", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};