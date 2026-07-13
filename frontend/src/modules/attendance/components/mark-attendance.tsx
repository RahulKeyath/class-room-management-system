import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ChevronRight,
  Search,
  UserCheck,
  UserX,
  Clock,
  Users,
  CheckCircle2,
  Save,
  RotateCcw,
} from "lucide-react";
import { CLASS_DATA } from "../data/mock-data";

/* ── Types ──────────────────────────────────────────────── */
type AttendanceStatus = "Present" | "Absent" | "Late";

interface StudentRecord {
  id: string;
  name: string;
  rollNo: number;
  status: AttendanceStatus;
}

/* ── Deterministic student data per section ─────────────── */
const FIRST_NAMES = [
  "Aarav", "Priya", "Arjun", "Ananya", "Vihaan", "Diya", "Reyansh", "Isha",
  "Advait", "Kavya", "Aditya", "Meera", "Sai", "Riya", "Krishna", "Nisha",
  "Rohan", "Tanvi", "Vivaan", "Shreya", "Kabir", "Pooja", "Aryan", "Simran",
  "Dev", "Neha", "Raj", "Anika", "Shaurya", "Trisha",
];

const LAST_NAMES = [
  "Sharma", "Patel", "Singh", "Reddy", "Kumar", "Gupta", "Nair", "Iyer",
  "Desai", "Mehta", "Joshi", "Verma", "Rao", "Pillai", "Chatterjee", "Bhat",
  "Kapoor", "Malhotra", "Srinivasan", "Banerjee", "Mishra", "Agarwal",
  "Das", "Pandey", "Kulkarni", "Hegde", "Saxena", "Menon", "Tiwari", "Shah",
];

function generateStudents(classId: string, section: string, count: number): StudentRecord[] {
  // Use a simple hash to generate deterministic but varied data
  const seed = (classId + section).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  
  return Array.from({ length: count }, (_, i) => {
    const nameIdx = (seed + i * 7) % FIRST_NAMES.length;
    const lastIdx = (seed + i * 13 + 3) % LAST_NAMES.length;
    const statusSeed = (seed * (i + 1) * 17) % 100;
    const status: AttendanceStatus =
      statusSeed > 92 ? "Absent" : statusSeed > 85 ? "Late" : "Present";

    return {
      id: `STU-${classId.toUpperCase()}-${section}-${String(i + 1).padStart(3, "0")}`,
      name: `${FIRST_NAMES[nameIdx]} ${LAST_NAMES[lastIdx]}`,
      rollNo: i + 1,
      status,
    };
  });
}

/* ── Status styling helpers ─────────────────────────────── */
const STATUS_CONFIG: Record<AttendanceStatus, { color: string; bg: string; icon: typeof UserCheck; label: string }> = {
  Present: {
    color: "oklch(0.65 0.14 155)",
    bg: "oklch(0.65 0.14 155 / 10%)",
    icon: UserCheck,
    label: "Present",
  },
  Late: {
    color: "oklch(0.75 0.15 75)",
    bg: "oklch(0.75 0.15 75 / 10%)",
    icon: Clock,
    label: "Late",
  },
  Absent: {
    color: "oklch(0.6 0.22 27)",
    bg: "oklch(0.6 0.22 27 / 10%)",
    icon: UserX,
    label: "Absent",
  },
};

const cardTransition: React.CSSProperties = {
  transition: "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
};

/* ── Props ──────────────────────────────────────────────── */
interface MarkAttendanceProps {
  classId: string;
  section: string;
  onBack: () => void;
}

/* ── Component ──────────────────────────────────────────── */
export function MarkAttendance({ classId, section, onBack }: MarkAttendanceProps) {
  const cls = CLASS_DATA.find((c) => c.id === classId)!;

  // Deterministic student count for the section
  const baseCount = Math.floor(cls.students / 3);
  const sectionIndex = section.charCodeAt(0) - 65; // A=0, B=1, C=2
  const studentCount = baseCount + (sectionIndex < cls.students % 3 ? 1 : 0);

  const initialStudents = useMemo(
    () => generateStudents(classId, section, studentCount),
    [classId, section, studentCount],
  );

  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [saved, setSaved] = useState(false);

  /* ── Derived data ──────────────────────────────────────── */
  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(s.rollNo).includes(searchQuery),
      ),
    [students, searchQuery],
  );

  const stats = useMemo(() => {
    const present = students.filter((s) => s.status === "Present").length;
    const late = students.filter((s) => s.status === "Late").length;
    const absent = students.filter((s) => s.status === "Absent").length;
    const pct = Math.round((present / students.length) * 100);
    return { present, late, absent, total: students.length, pct };
  }, [students]);

  /* ── Handlers ──────────────────────────────────────────── */
  const cycleStatus = (id: string) => {
    setSaved(false);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next: AttendanceStatus =
          s.status === "Present" ? "Late" : s.status === "Late" ? "Absent" : "Present";
        return { ...s, status: next };
      }),
    );
  };

  const setAllStatus = (status: AttendanceStatus) => {
    setSaved(false);
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const resetAll = () => {
    setSaved(false);
    setStudents(initialStudents);
  };

  const handleSave = () => {
    setSaved(true);
    // In the future this would call an API
  };

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* ── Breadcrumb header ────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-background border border-border/60 shadow-sm hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {cls.label}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Section {section}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Attendance</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Mark today's attendance for each student
          </p>
        </div>
      </div>

      {/* ── Summary hero strip ───────────────────────────── */}
      <div
        className="rounded-xl p-5 md:p-6 text-primary-foreground shadow-[var(--shadow-elegant)]"
        style={{ background: cls.gradient }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: title + class info */}
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-md"
              style={{ background: "oklch(1 0 0 / 18%)" }}
            >
              {section}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {cls.label} — Section {section}
              </h3>
              <p className="text-sm opacity-80 flex items-center gap-1.5 mt-0.5">
                <Users className="h-3.5 w-3.5" />
                {stats.total} Students
              </p>
            </div>
          </div>

          {/* Right: attendance percentage ring */}
          <div className="flex items-center gap-5">
            {[
              { label: "Present", value: stats.present, Icon: UserCheck },
              { label: "Late", value: stats.late, Icon: Clock },
              { label: "Absent", value: stats.absent, Icon: UserX },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center mb-1"
                  style={{ background: "oklch(1 0 0 / 12%)" }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-base font-bold leading-none">{value}</span>
                <span className="text-[10px] opacity-70 mt-0.5">{label}</span>
              </div>
            ))}

            {/* Percentage badge */}
            <div className="flex flex-col items-center">
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg border-2"
                style={{
                  borderColor: "oklch(1 0 0 / 30%)",
                  background: "oklch(1 0 0 / 10%)",
                }}
              >
                {stats.pct}%
              </div>
              <span className="text-[10px] opacity-70 mt-1">Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar: search + quick actions ──────────────── */}
      <Card className="shadow-[var(--shadow-soft)] border-border/60">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="attendance-search"
                placeholder="Search by name, ID, or roll no…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            {/* Quick-set buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 hover:bg-success/10 hover:text-success hover:border-success/30 transition-colors"
                onClick={() => setAllStatus("Present")}
              >
                <UserCheck className="h-3.5 w-3.5" />
                All Present
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                onClick={() => setAllStatus("Absent")}
              >
                <UserX className="h-3.5 w-3.5" />
                All Absent
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={resetAll}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            </div>

            {/* Save button */}
            <Button
              size="sm"
              className="ml-auto gap-1.5 shadow-sm"
              onClick={handleSave}
              style={
                saved
                  ? { background: "oklch(0.65 0.14 155)", color: "white" }
                  : {}
              }
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Attendance
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Student list ─────────────────────────────────── */}
      <Card className="shadow-[var(--shadow-soft)] border-border/60 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Student Roster</CardTitle>
          <Badge variant="secondary" className="font-mono text-xs">
            {filtered.length} of {stats.total}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column headers */}
          <div
            className="grid items-center px-5 py-2.5 border-b border-border/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none"
            style={{ gridTemplateColumns: "3.5rem 1fr 10rem 9rem" }}
          >
            <span>Roll</span>
            <span>Student</span>
            <span className="text-center">Student ID</span>
            <span className="text-center">Status</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/40">
            {filtered.map((student, idx) => {
              const cfg = STATUS_CONFIG[student.status];
              const StatusIcon = cfg.icon;

              return (
                <div
                  key={student.id}
                  className="grid items-center px-5 py-3 hover:bg-muted/40 transition-colors duration-150"
                  style={{
                    gridTemplateColumns: "3.5rem 1fr 10rem 9rem",
                    animationDelay: `${idx * 20}ms`,
                  }}
                >
                  {/* Roll number */}
                  <span className="text-sm font-mono text-muted-foreground">
                    {student.rollNo}
                  </span>

                  {/* Student info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className="text-xs font-semibold"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {student.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{student.name}</span>
                  </div>

                  {/* ID */}
                  <span className="text-xs font-mono text-muted-foreground text-center">
                    {student.id}
                  </span>

                  {/* Status toggle button */}
                  <div className="flex justify-center">
                    <button
                      id={`status-${student.id}`}
                      onClick={() => cycleStatus(student.id)}
                      className="group/btn relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                      style={{
                        ...cardTransition,
                        color: cfg.color,
                        background: cfg.bg,
                        borderColor: `color-mix(in oklch, ${cfg.color} 25%, transparent)`,
                      }}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {cfg.label}
                      <span className="ml-0.5 opacity-0 group-hover/btn:opacity-60 transition-opacity text-[10px]">
                        ↻
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">No students found</p>
              <p className="text-xs mt-1">
                Try adjusting your search query
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Bottom action bar (sticky) ───────────────────── */}
      <div
        className="sticky bottom-4 mx-auto max-w-md rounded-xl border border-border/60 bg-card/95 backdrop-blur-md px-5 py-3 shadow-[var(--shadow-elegant)] flex items-center justify-between gap-4"
        style={cardTransition}
      >
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-success font-semibold">
            <UserCheck className="h-3.5 w-3.5" /> {stats.present}
          </span>
          <span className="flex items-center gap-1.5 text-warning font-semibold">
            <Clock className="h-3.5 w-3.5" /> {stats.late}
          </span>
          <span className="flex items-center gap-1.5 text-destructive font-semibold">
            <UserX className="h-3.5 w-3.5" /> {stats.absent}
          </span>
          <span className="text-muted-foreground font-medium">
            {stats.pct}% attendance
          </span>
        </div>
        <Button
          size="sm"
          className="gap-1.5 shadow-sm"
          onClick={handleSave}
          style={
            saved
              ? { background: "oklch(0.65 0.14 155)", color: "white" }
              : {}
          }
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
