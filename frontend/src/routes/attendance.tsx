import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/lib/role-context";
import {
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  Beaker,
  Globe,
  Monitor,
  Music,
  Palette,
  Dumbbell,
  Building2,
  ChevronRight,
  UserCheck,
  UserX,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — Northgate Academy" },
      { name: "description", content: "Track student and staff attendance with daily summaries." },
    ],
  }),
  component: AttendancePage,
});

/* ── Class data (LKG → 12) ─────────────────────────────────── */
const CLASS_DATA = [
  { id: "lkg", label: "LKG", fullName: "Lower Kindergarten", students: 42, present: 39, absent: 2, late: 1, gradient: "linear-gradient(135deg, oklch(0.72 0.16 340), oklch(0.60 0.20 350))" },
  { id: "ukg", label: "UKG", fullName: "Upper Kindergarten", students: 45, present: 42, absent: 1, late: 2, gradient: "linear-gradient(135deg, oklch(0.68 0.18 310), oklch(0.55 0.22 320))" },
  { id: "1", label: "Class 1", fullName: "First Standard", students: 48, present: 44, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.50 0.22 290))" },
  { id: "2", label: "Class 2", fullName: "Second Standard", students: 50, present: 47, absent: 2, late: 1, gradient: "linear-gradient(135deg, oklch(0.60 0.16 255), oklch(0.45 0.20 265))" },
  { id: "3", label: "Class 3", fullName: "Third Standard", students: 46, present: 43, absent: 2, late: 1, gradient: "linear-gradient(135deg, oklch(0.58 0.15 230), oklch(0.44 0.19 240))" },
  { id: "4", label: "Class 4", fullName: "Fourth Standard", students: 52, present: 49, absent: 1, late: 2, gradient: "linear-gradient(135deg, oklch(0.62 0.14 200), oklch(0.48 0.18 210))" },
  { id: "5", label: "Class 5", fullName: "Fifth Standard", students: 55, present: 51, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.65 0.14 175), oklch(0.50 0.18 185))" },
  { id: "6", label: "Class 6", fullName: "Sixth Standard", students: 54, present: 50, absent: 2, late: 2, gradient: "linear-gradient(135deg, oklch(0.65 0.14 155), oklch(0.50 0.18 165))" },
  { id: "7", label: "Class 7", fullName: "Seventh Standard", students: 58, present: 54, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.68 0.14 130), oklch(0.52 0.18 140))" },
  { id: "8", label: "Class 8", fullName: "Eighth Standard", students: 56, present: 52, absent: 2, late: 2, gradient: "linear-gradient(135deg, oklch(0.72 0.15 95), oklch(0.56 0.19 105))" },
  { id: "9", label: "Class 9", fullName: "Ninth Standard", students: 60, present: 56, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.75 0.15 75), oklch(0.58 0.19 85))" },
  { id: "10", label: "Class 10", fullName: "Tenth Standard", students: 64, present: 60, absent: 2, late: 2, gradient: "linear-gradient(135deg, oklch(0.70 0.16 50), oklch(0.55 0.20 60))" },
  { id: "11", label: "Class 11", fullName: "Eleventh Standard", students: 58, present: 54, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.65 0.18 30), oklch(0.50 0.22 40))" },
  { id: "12", label: "Class 12", fullName: "Twelfth Standard", students: 62, present: 58, absent: 2, late: 2, gradient: "linear-gradient(135deg, oklch(0.60 0.20 15), oklch(0.48 0.24 25))" },
];

/* ── Department data ────────────────────────────────────────── */
const DEPARTMENT_DATA = [
  { id: "math", label: "Mathematics", icon: BookOpen, staff: 8, present: 7, absent: 0, onLeave: 1, gradient: "linear-gradient(135deg, oklch(0.60 0.16 255), oklch(0.45 0.20 265))" },
  { id: "english", label: "English", icon: Globe, staff: 7, present: 6, absent: 0, onLeave: 1, gradient: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.50 0.22 290))" },
  { id: "physics", label: "Physics", icon: Beaker, staff: 5, present: 5, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.58 0.15 230), oklch(0.44 0.19 240))" },
  { id: "chemistry", label: "Chemistry", icon: Beaker, staff: 5, present: 4, absent: 1, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.65 0.14 175), oklch(0.50 0.18 185))" },
  { id: "biology", label: "Biology", icon: Beaker, staff: 4, present: 4, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.65 0.14 155), oklch(0.50 0.18 165))" },
  { id: "history", label: "History", icon: Globe, staff: 4, present: 3, absent: 0, onLeave: 1, gradient: "linear-gradient(135deg, oklch(0.72 0.15 95), oklch(0.56 0.19 105))" },
  { id: "cs", label: "Computer Science", icon: Monitor, staff: 6, present: 6, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.55 0.18 280), oklch(0.40 0.22 290))" },
  { id: "pe", label: "Physical Education", icon: Dumbbell, staff: 3, present: 3, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.70 0.16 50), oklch(0.55 0.20 60))" },
  { id: "music", label: "Music", icon: Music, staff: 2, present: 2, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.68 0.18 310), oklch(0.55 0.22 320))" },
  { id: "art", label: "Fine Arts", icon: Palette, staff: 2, present: 2, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.72 0.16 340), oklch(0.60 0.20 350))" },
  { id: "admin", label: "Administration", icon: Building2, staff: 12, present: 11, absent: 1, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.24 0.08 265), oklch(0.40 0.13 258))" },
];

/* ── Inline styles for animations not available in Tailwind ── */
const cardTransition: React.CSSProperties = {
  transition: "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
};

function AttendancePage() {
  const { role } = useRole();
  const [date] = useState(new Date().toLocaleDateString("en-US", { dateStyle: "long" }));
  const [view, setView] = useState<"students" | "staff">("students");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const totals = (rows: { status: string }[]) => ({
    present: rows.filter((r) => r.status === "Present").length,
    absent: rows.filter((r) => r.status === "Absent").length,
    late: rows.filter((r) => r.status === "Late" || r.status === "On Leave").length,
  });

  /* ── Student personal view ─────────────────────────────── */
  if (role === "student") {
    const days = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const r = Math.random();
      const status = r > 0.92 ? "Absent" : r > 0.86 ? "Late" : "Present";
      return { date: d, status };
    });
    const t = totals(days);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">My Attendance</h1>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Present</p><p className="text-2xl font-semibold text-success">{t.present}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Late</p><p className="text-2xl font-semibold text-warning">{t.late}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Absent</p><p className="text-2xl font-semibold text-destructive">{t.absent}</p></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Calendar View</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {days.reverse().map((d, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs ${
                    d.status === "Present"
                      ? "bg-success/15 text-success"
                      : d.status === "Late"
                      ? "bg-warning/20 text-warning-foreground"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  <span className="font-semibold">{d.date.getDate()}</span>
                  <span className="text-[10px] opacity-70">{d.date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ── Aggregate stats ───────────────────────────────────── */
  const totalStudents = CLASS_DATA.reduce((s, c) => s + c.students, 0);
  const totalPresent = CLASS_DATA.reduce((s, c) => s + c.present, 0);
  const totalAbsent = CLASS_DATA.reduce((s, c) => s + c.absent, 0);
  const totalLate = CLASS_DATA.reduce((s, c) => s + c.late, 0);

  const totalStaff = DEPARTMENT_DATA.reduce((s, d) => s + d.staff, 0);
  const staffPresent = DEPARTMENT_DATA.reduce((s, d) => s + d.present, 0);
  const staffAbsent = DEPARTMENT_DATA.reduce((s, d) => s + d.absent, 0);
  const staffOnLeave = DEPARTMENT_DATA.reduce((s, d) => s + d.onLeave, 0);

  /* ── Admin / Teacher view ──────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Header with gradient hero */}
      <div
        className="rounded-xl p-6 md:p-8 text-primary-foreground shadow-[var(--shadow-elegant)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm opacity-80 flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {date}
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">Attendance</h1>
            <p className="opacity-80 mt-2 text-sm md:text-base">
              Select a class or department to manage today's attendance.
            </p>
          </div>

          {/* Toggle */}
          <div
            className="flex rounded-lg p-1 backdrop-blur-sm"
            style={{ background: "oklch(1 0 0 / 12%)" }}
          >
            <button
              id="toggle-students"
              onClick={() => {
                setView("students");
                setSelectedClassId(null);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
              style={{
                background: view === "students" ? "oklch(1 0 0 / 22%)" : "transparent",
                opacity: view === "students" ? 1 : 0.7,
              }}
            >
              <GraduationCap className="h-4 w-4" />
              Students
            </button>
            <button
              id="toggle-staff"
              onClick={() => {
                setView("staff");
                setSelectedClassId(null);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
              style={{
                background: view === "staff" ? "oklch(1 0 0 / 22%)" : "transparent",
                opacity: view === "staff" ? 1 : 0.7,
              }}
            >
              <Users className="h-4 w-4" />
              Staff
            </button>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {view === "students" ? (
            <>
              <QuickStat icon={GraduationCap} label="Total Students" value={totalStudents} />
              <QuickStat icon={UserCheck} label="Present" value={totalPresent} />
              <QuickStat icon={Clock} label="Late" value={totalLate} />
              <QuickStat icon={UserX} label="Absent" value={totalAbsent} />
            </>
          ) : (
            <>
              <QuickStat icon={Users} label="Total Staff" value={totalStaff} />
              <QuickStat icon={UserCheck} label="Present" value={staffPresent} />
              <QuickStat icon={Clock} label="On Leave" value={staffOnLeave} />
              <QuickStat icon={UserX} label="Absent" value={staffAbsent} />
            </>
          )}
        </div>
      </div>

      {/* Cards grid */}
      {view === "students" ? (
        selectedClassId ? (
          (() => {
            const cls = CLASS_DATA.find((c) => c.id === selectedClassId)!;
            const sections = ["A", "B", "C"].map((name, i) => {
              const baseStudents = Math.floor(cls.students / 3);
              const rem = cls.students % 3;
              const basePresent = Math.floor(cls.present / 3);
              const remPresent = cls.present % 3;
              
              const students = baseStudents + (i < rem ? 1 : 0);
              const present = basePresent + (i < remPresent ? 1 : 0);
              const absentAndLate = students - present;
              const absent = Math.floor(absentAndLate / 2);
              const late = absentAndLate - absent;
              
              return { name, students, present, absent, late };
            });

            return (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <button 
                    onClick={() => setSelectedClassId(null)} 
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-background border border-border/60 shadow-sm hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      {cls.label}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Sections</span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Select a section to manage attendance</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sections.map((sec) => {
                    const secAttendancePct = Math.round((sec.present / sec.students) * 100);
                    return (
                      <button
                        key={sec.name}
                        className="group relative overflow-hidden rounded-xl border border-border/60 bg-card text-left shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        style={cardTransition}
                      >
                        <div className="h-1.5 w-full" style={{ background: cls.gradient }} />
                        <div className="p-5 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">Section {sec.name}</h3>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                                <Users className="h-4 w-4" />
                                <span>{sec.students} Students</span>
                              </div>
                            </div>
                            <div
                              className="h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm"
                              style={{ background: cls.gradient }}
                            >
                              {sec.name}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-muted-foreground font-medium">Attendance</span>
                              <span className="font-bold" style={{ color: secAttendancePct >= 90 ? "oklch(0.65 0.14 155)" : secAttendancePct >= 75 ? "oklch(0.75 0.15 75)" : "oklch(0.6 0.22 27)" }}>
                                {secAttendancePct}%
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${secAttendancePct}%`,
                                  background: cls.gradient,
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Present</span>
                                <span className="text-sm font-semibold text-success flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5"/>{sec.present}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Late</span>
                                <span className="text-sm font-semibold text-warning flex items-center gap-1.5"><Clock className="h-3.5 w-3.5"/>{sec.late}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Absent</span>
                                <span className="text-sm font-semibold text-destructive flex items-center gap-1.5"><UserX className="h-3.5 w-3.5"/>{sec.absent}</span>
                              </div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-primary/5 transition-all duration-300 -mr-1">
                              <ArrowRight className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()
        ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Select Class</h2>
              <p className="text-sm text-muted-foreground">Choose a class to view or mark attendance</p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {CLASS_DATA.length} Classes
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {CLASS_DATA.map((cls) => {
              const attendancePct = Math.round((cls.present / cls.students) * 100);
              return (
                <button
                  key={cls.id}
                  id={`class-card-${cls.id}`}
                  onClick={() => setSelectedClassId(cls.id)}
                  className="group relative overflow-hidden rounded-xl border border-border/60 bg-card text-left shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  style={cardTransition}
                >
                  {/* Gradient accent bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ background: cls.gradient }}
                  />

                  <div className="p-4 space-y-3">
                    {/* Title row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-base">{cls.label}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{cls.fullName}</p>
                      </div>
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0"
                        style={{ background: cls.gradient }}
                      >
                        {cls.label.replace("Class ", "").slice(0, 3)}
                      </div>
                    </div>

                    {/* Students count */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>{cls.students} Students</span>
                    </div>

                    {/* Attendance bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Attendance</span>
                        <span className="font-semibold" style={{ color: attendancePct >= 90 ? "oklch(0.65 0.14 155)" : attendancePct >= 75 ? "oklch(0.75 0.15 75)" : "oklch(0.6 0.22 27)" }}>
                          {attendancePct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${attendancePct}%`,
                            background: cls.gradient,
                          }}
                        />
                      </div>
                    </div>

                    {/* Status chips */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex items-center gap-1 text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        {cls.present}
                      </span>
                      <span className="flex items-center gap-1 text-warning">
                        <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                        {cls.late}
                      </span>
                      <span className="flex items-center gap-1 text-destructive">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                        {cls.absent}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        )
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Select Department</h2>
              <p className="text-sm text-muted-foreground">Choose a department to view or mark staff attendance</p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {DEPARTMENT_DATA.length} Departments
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DEPARTMENT_DATA.map((dept) => {
              const DeptIcon = dept.icon;
              const attendancePct = Math.round((dept.present / dept.staff) * 100);
              return (
                <button
                  key={dept.id}
                  id={`dept-card-${dept.id}`}
                  className="group relative overflow-hidden rounded-xl border border-border/60 bg-card text-left shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  style={cardTransition}
                >
                  {/* Gradient accent bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ background: dept.gradient }}
                  />

                  <div className="p-5 space-y-4">
                    {/* Title row */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{dept.label}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{dept.staff} Members</p>
                      </div>
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-primary-foreground shrink-0"
                        style={{ background: dept.gradient }}
                      >
                        <DeptIcon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Attendance bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Attendance</span>
                        <span className="font-semibold" style={{ color: attendancePct >= 90 ? "oklch(0.65 0.14 155)" : attendancePct >= 75 ? "oklch(0.75 0.15 75)" : "oklch(0.6 0.22 27)" }}>
                          {attendancePct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${attendancePct}%`,
                            background: dept.gradient,
                          }}
                        />
                      </div>
                    </div>

                    {/* Status chips */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5 text-success">
                        <UserCheck className="h-3.5 w-3.5" />
                        {dept.present} Present
                      </span>
                      {dept.onLeave > 0 && (
                        <span className="flex items-center gap-1.5 text-warning">
                          <Clock className="h-3.5 w-3.5" />
                          {dept.onLeave} Leave
                        </span>
                      )}
                      {dept.absent > 0 && (
                        <span className="flex items-center gap-1.5 text-destructive">
                          <UserX className="h-3.5 w-3.5" />
                          {dept.absent} Absent
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Quick stat pill (inside hero) ──────────────────────────── */
function QuickStat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div
      className="rounded-lg px-4 py-3 flex items-center gap-3"
      style={{ background: "oklch(1 0 0 / 10%)" }}
    >
      <Icon className="h-5 w-5 opacity-80" />
      <div>
        <p className="text-[11px] opacity-70 leading-none">{label}</p>
        <p className="text-lg font-semibold leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}
