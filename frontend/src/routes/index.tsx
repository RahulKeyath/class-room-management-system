import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRole } from "@/lib/role-context";
import {
  STATS,
  CURRENT_USER,
  RECENT_ACTIVITY,
  TIMETABLE,
  RESULTS,
  PERFORMANCE_TREND,
  STUDENTS,
} from "@/lib/mock-data";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Northgate Academy" },
      { name: "description", content: "Classroom management dashboard for staff and students." },
    ],
  }),
  component: Dashboard,
});

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card className="shadow-[var(--shadow-soft)] border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            {trend && <p className="text-xs text-success mt-1">{trend}</p>}
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { role } = useRole();
  const user = CURRENT_USER[role];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const todayIdx = Math.min(new Date().getDay() === 0 || new Date().getDay() === 6 ? 0 : new Date().getDay() - 1, 4);
  const todaysClasses = TIMETABLE.schedule[todayIdx];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-xl p-6 md:p-8 text-primary-foreground shadow-[var(--shadow-elegant)]" style={{ background: "var(--gradient-primary)" }}>
        <p className="text-sm opacity-80">{today}</p>
        <h1 className="text-2xl md:text-3xl font-semibold mt-1">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="opacity-80 mt-2 max-w-2xl text-sm md:text-base">
          {role === "admin" && "Here's what's happening across the school today."}
          {role === "teacher" && "Your classes, attendance and performance — all in one place."}
          {role === "student" && "Stay on top of your timetable, results and progress."}
        </p>
      </div>

      {/* Stats */}
      {role === "admin" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={GraduationCap} label="Total Students" value={STATS.totalStudents.toLocaleString()} trend="+24 this month" />
          <StatCard icon={Users} label="Total Staff" value={String(STATS.totalStaff)} trend="+2 this month" />
          <StatCard icon={CalendarCheck} label="Attendance Today" value={`${STATS.attendanceToday}%`} trend="+1.2% vs avg" />
          <StatCard icon={BookOpen} label="Classes Today" value={String(STATS.classesToday)} />
        </div>
      )}

      {role === "teacher" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={GraduationCap} label="My Students" value="64" />
          <StatCard icon={CalendarCheck} label="Avg Attendance" value="93%" trend="+0.8%" />
          <StatCard icon={BookOpen} label="Classes Today" value="5" />
          <StatCard icon={TrendingUp} label="Class Avg Score" value="82.4" trend="+3.1" />
        </div>
      )}

      {role === "student" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={CalendarCheck} label="My Attendance" value="96%" trend="Above average" />
          <StatCard icon={TrendingUp} label="Overall GPA" value="3.80" trend="+0.12" />
          <StatCard icon={BookOpen} label="Subjects" value="7" />
          <StatCard icon={Clock} label="Classes Today" value="6" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance / Attendance chart */}
        <Card className="lg:col-span-2 shadow-[var(--shadow-soft)] border-border/60">
          <CardHeader>
            <CardTitle>{role === "student" ? "My Performance Trend" : "Attendance Trend"}</CardTitle>
            <CardDescription>
              {role === "student" ? "Term-by-term scores" : "School-wide attendance over recent terms"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={PERFORMANCE_TREND}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.13 255)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.55 0.13 255)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 250)" />
                <XAxis dataKey="term" stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 260)" fontSize={12} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.9 0.015 250)" }} />
                <Area type="monotone" dataKey="score" stroke="oklch(0.4 0.13 258)" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today schedule */}
        <Card className="shadow-[var(--shadow-soft)] border-border/60">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>{TIMETABLE.days[todayIdx]}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysClasses.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="text-xs font-mono text-muted-foreground w-20 shrink-0">
                  {TIMETABLE.periods[i].split(" - ")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.teacher} · {c.room}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role === "student" ? (
          <Card className="lg:col-span-2 shadow-[var(--shadow-soft)] border-border/60">
            <CardHeader>
              <CardTitle>Latest Results</CardTitle>
              <CardDescription>Most recent assessment marks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {RESULTS.slice(0, 5).map((r) => (
                <div key={r.subject} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{r.subject}</span>
                      <span className="text-sm text-muted-foreground">{r.marks}/{r.max}</span>
                    </div>
                    <Progress value={(r.marks / r.max) * 100} className="h-2" />
                  </div>
                  <Badge variant="secondary" className="font-mono">{r.grade}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2 shadow-[var(--shadow-soft)] border-border/60">
            <CardHeader>
              <CardTitle>Attendance Snapshot</CardTitle>
              <CardDescription>Recent student check-ins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {STUDENTS.slice(0, 6).map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.id} · {s.grade}</p>
                  </div>
                  <Badge
                    variant={s.status === "Present" ? "default" : s.status === "Late" ? "secondary" : "destructive"}
                    className={s.status === "Present" ? "bg-success text-success-foreground hover:bg-success/90" : ""}
                  >
                    {s.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="shadow-[var(--shadow-soft)] border-border/60">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
