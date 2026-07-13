import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SYLLABUS, SUBJECTS } from "@/lib/mock-data";
import { BookOpen, CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/syllabus")({
  head: () => ({
    meta: [
      { title: "Syllabus — Northgate Academy" },
      { name: "description", content: "Subject-wise syllabus and curriculum progress." },
    ],
  }),
  component: SyllabusPage,
});

function SyllabusPage() {
  const [active, setActive] = useState(SUBJECTS[0]);
  const units = SYLLABUS[active] ?? [];
  const overall = units.length ? Math.round(units.reduce((a, u) => a + u.progress, 0) / units.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Syllabus</h1>
        <p className="text-sm text-muted-foreground">Curriculum progress across all subjects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Subject list */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Subjects</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {SUBJECTS.map((s) => {
              const u = SYLLABUS[s] ?? [];
              const p = u.length ? Math.round(u.reduce((a, x) => a + x.progress, 0) / u.length) : 0;
              const isActive = s === active;
              return (
                <button
                  key={s}
                  onClick={() => setActive(s)}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{s}</span>
                    <span className={`text-xs ${isActive ? "opacity-90" : "text-muted-foreground"}`}>{p}%</span>
                  </div>
                  <div className={`mt-1.5 h-1 rounded-full overflow-hidden ${isActive ? "bg-primary-foreground/20" : "bg-muted"}`}>
                    <div
                      className={`h-full ${isActive ? "bg-primary-foreground" : "bg-primary"}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Detail */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-border/60" style={{ background: "var(--gradient-primary)" }}>
            <CardContent className="p-6 text-primary-foreground">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-white/15 flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{active}</h2>
                  <p className="text-sm opacity-80 mt-0.5">{units.length} units · Academic Year 2025-26</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Progress value={overall} className="h-2 bg-white/20 [&>div]:bg-white" />
                    <span className="text-sm font-semibold whitespace-nowrap">{overall}% complete</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {units.map((u, i) => (
              <Card key={i} className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{u.unit}</CardTitle>
                      <CardDescription>{u.topics.length} topics</CardDescription>
                    </div>
                    <Badge
                      variant={u.progress === 100 ? "default" : "secondary"}
                      className={u.progress === 100 ? "bg-success text-success-foreground hover:bg-success/90" : ""}
                    >
                      {u.progress === 100 ? "Completed" : `${u.progress}%`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <Progress value={u.progress} className="h-1.5" />
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3">
                    {u.topics.map((t, ti) => {
                      const done = (ti + 1) / u.topics.length <= u.progress / 100;
                      return (
                        <li key={ti} className="flex items-center gap-2 text-sm">
                          {done ? (
                            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <span className={done ? "" : "text-muted-foreground"}>{t}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
