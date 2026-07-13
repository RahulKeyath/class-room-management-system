import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowRight } from "lucide-react";
import { CLASS_DATA } from "../data/mock-data";

const cardTransition: React.CSSProperties = {
  transition: "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
};

interface ClassGridProps {
  setSelectedClassId: (id: string) => void;
}

export function ClassGrid({ setSelectedClassId }: ClassGridProps) {
  return (
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
  );
}
