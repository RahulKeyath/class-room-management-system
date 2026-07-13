import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/lib/role-context";
import { StudentView } from "@/modules/attendance/components/student-view";
import { AdminView } from "@/modules/attendance/components/admin-view";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — Northgate Academy" },
      { name: "description", content: "Track student and staff attendance with daily summaries." },
    ],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  const { role } = useRole();
  return role === "student" ? <StudentView /> : <AdminView />;
}
