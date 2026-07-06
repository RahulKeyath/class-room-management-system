"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { AttendanceRecord, MarkAttendanceRequest } from "../types";

// ── Query Keys ──────────────────────────────────────────────────────
export const attendanceKeys = {
  all: ["attendance"] as const,
  list: () => [...attendanceKeys.all, "list"] as const,
  detail: (id: number) => [...attendanceKeys.all, "detail", id] as const,
};

// ── Queries ─────────────────────────────────────────────────────────

/**
 * Fetches all attendance records from the API.
 */
export function useAttendanceList() {
  return useQuery({
    queryKey: attendanceKeys.list(),
    queryFn: () =>
      apiFetch<AttendanceRecord[]>("/api/v1/attendance"),
  });
}

/**
 * Fetches a single attendance record by ID.
 */
export function useAttendanceDetail(id: number) {
  return useQuery({
    queryKey: attendanceKeys.detail(id),
    queryFn: () =>
      apiFetch<AttendanceRecord>(`/api/v1/attendance/${id}`),
    enabled: !!id,
  });
}

// ── Mutations ───────────────────────────────────────────────────────

/**
 * Marks attendance for a student. Invalidates the attendance list
 * cache on success so the UI refreshes automatically.
 */
export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAttendanceRequest) =>
      apiFetch<AttendanceRecord>("/api/v1/attendance", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.list() });
    },
  });
}
