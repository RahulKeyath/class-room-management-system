import Link from "next/link";
import { RosterTable } from "@/features/attendance/components/RosterTable";
import { apiFetch } from "@/lib/api";
import { AttendanceRecord } from "@/features/attendance/types";

export default async function AttendancePage() {
  let records: AttendanceRecord[] = [];
  try {
    records = await apiFetch<AttendanceRecord[]>("/api/v1/attendance", {
      next: { revalidate: 0 },
    });
  } catch (error) {
    console.error("Failed to fetch attendance:", error);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            🎓 Classroom Management
          </h1>
          <nav className="flex gap-4 text-sm font-medium text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/attendance"
              className="text-foreground"
            >
              Attendance
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Attendance Content ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Attendance
          </h2>
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            id="mark-attendance-btn"
          >
            Mark Attendance
          </button>
        </div>

        <RosterTable records={records} />
      </section>
    </main>
  );
}
