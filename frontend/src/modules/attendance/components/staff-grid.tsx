import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Clock, ChevronRight } from "lucide-react";
import { DEPARTMENT_DATA } from "../data/mock-data";

const cardTransition: React.CSSProperties = {
  transition: "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
};

export function StaffGrid() {
  return (
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
  );
}
