import Link from "next/link";

export default function DashboardPage() {
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
              className="transition-colors hover:text-foreground"
            >
              Attendance
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Dashboard Content ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-semibold text-foreground">
          Dashboard
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card: Total Classes */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Total Classes
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">—</p>
          </div>

          {/* Card: Students Enrolled */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Students Enrolled
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">—</p>
          </div>

          {/* Card: Attendance Today */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Attendance Today
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">—</p>
          </div>
        </div>
      </section>
    </main>
  );
}
