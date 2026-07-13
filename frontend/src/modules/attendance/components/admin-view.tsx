import { useState } from "react";
import { Calendar, Users, GraduationCap, UserCheck, UserX, Clock } from "lucide-react";
import { QuickStat } from "./quick-stat";
import { ClassGrid } from "./class-grid";
import { StaffGrid } from "./staff-grid";
import { SectionGrid } from "./section-grid";
import { MarkAttendance } from "./mark-attendance";
import { CLASS_DATA, DEPARTMENT_DATA } from "../data/mock-data";

export function AdminView() {
  const [date] = useState(new Date().toLocaleDateString("en-US", { dateStyle: "long" }));
  const [view, setView] = useState<"students" | "staff">("students");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const totalStudents = CLASS_DATA.reduce((s, c) => s + c.students, 0);
  const totalPresent = CLASS_DATA.reduce((s, c) => s + c.present, 0);
  const totalAbsent = CLASS_DATA.reduce((s, c) => s + c.absent, 0);
  const totalLate = CLASS_DATA.reduce((s, c) => s + c.late, 0);

  const totalStaff = DEPARTMENT_DATA.reduce((s, d) => s + d.staff, 0);
  const staffPresent = DEPARTMENT_DATA.reduce((s, d) => s + d.present, 0);
  const staffAbsent = DEPARTMENT_DATA.reduce((s, d) => s + d.absent, 0);
  const staffOnLeave = DEPARTMENT_DATA.reduce((s, d) => s + d.onLeave, 0);

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
                setSelectedSection(null);
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
                setSelectedSection(null);
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
        selectedClassId && selectedSection ? (
          <MarkAttendance
            classId={selectedClassId}
            section={selectedSection}
            onBack={() => setSelectedSection(null)}
          />
        ) : selectedClassId ? (
          <SectionGrid
            selectedClassId={selectedClassId}
            setSelectedClassId={(id) => {
              setSelectedClassId(id);
              setSelectedSection(null);
            }}
            onSelectSection={setSelectedSection}
          />
        ) : (
          <ClassGrid setSelectedClassId={setSelectedClassId} />
        )
      ) : (
        <StaffGrid />
      )}
    </div>
  );
}
