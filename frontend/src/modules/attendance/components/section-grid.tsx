import { Users, UserCheck, UserX, Clock, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { CLASS_DATA } from "../data/mock-data";

const cardTransition: React.CSSProperties = {
  transition: "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
};

interface SectionGridProps {
  selectedClassId: string;
  setSelectedClassId: (id: string | null) => void;
  onSelectSection: (section: string) => void;
}

export function SectionGrid({ selectedClassId, setSelectedClassId, onSelectSection }: SectionGridProps) {
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
              onClick={() => onSelectSection(sec.name)}
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
}
