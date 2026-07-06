"use client";

import type { AttendanceRecord } from "../types";

interface RosterTableProps {
  records: AttendanceRecord[];
  isLoading?: boolean;
}

/**
 * RosterTable displays attendance records in a styled table.
 * Designed to be used within the Attendance page.
 */
export function RosterTable({ records, isLoading }: RosterTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Loading attendance records…
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No attendance records found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-medium text-muted-foreground">
              Student
            </th>
            <th className="px-4 py-3 font-medium text-muted-foreground">
              Date
            </th>
            <th className="px-4 py-3 font-medium text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium text-foreground">
                {record.student_name ?? `Student #${record.student_id}`}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {record.date}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={record.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    present: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    absent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    excused: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        colors[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}
