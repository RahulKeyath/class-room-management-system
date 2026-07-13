import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TIMETABLE } from "@/lib/mock-data";

export const Route = createFileRoute("/timetable")({
  head: () => ({
    meta: [
      { title: "Timetable — Northgate Academy" },
      { name: "description", content: "Weekly class timetable for students and teachers." },
    ],
  }),
  component: TimetablePage,
});

const subjectColor: Record<string, string> = {
  Mathematics: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  Physics: "bg-chart-2/10 border-chart-2/30",
  Chemistry: "bg-chart-3/10 border-chart-3/30",
  Biology: "bg-chart-4/10 border-chart-4/30",
  English: "bg-accent/10 text-accent border-accent/30",
  History: "bg-chart-5/10 border-chart-5/30",
  "Computer Sci.": "bg-primary/10 text-primary border-primary/30",
};

function TimetablePage() {
  const todayIdx = (() => {
    const d = new Date().getDay();
    return d === 0 || d === 6 ? -1 : d - 1;
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Weekly Timetable</h1>
        <p className="text-sm text-muted-foreground">Class schedule for the current academic week</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Tap any cell for details</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid gap-2" style={{ gridTemplateColumns: "120px repeat(5, 1fr)" }}>
              <div />
              {TIMETABLE.days.map((day, i) => (
                <div
                  key={day}
                  className={`text-center text-sm font-semibold py-2 rounded-md ${
                    i === todayIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day}
                </div>
              ))}

              {TIMETABLE.periods.map((period, periodIdx) => (
                <FragmentRow
                  key={period}
                  period={period}
                  cells={TIMETABLE.days.map((_, dayIdx) => TIMETABLE.schedule[dayIdx][periodIdx])}
                  todayIdx={todayIdx}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FragmentRow({
  period,
  cells,
  todayIdx,
}: {
  period: string;
  cells: { subject: string; teacher: string; room: string }[];
  todayIdx: number;
}) {
  return (
    <>
      <div className="text-xs font-mono text-muted-foreground flex items-center justify-end pr-2 py-3">
        {period}
      </div>
      {cells.map((c, i) => {
        const colorClass =
          subjectColor[c.subject] ?? "bg-secondary border-border text-secondary-foreground";
        return (
          <div
            key={i}
            className={`rounded-md border p-2.5 text-xs hover:shadow-[var(--shadow-soft)] transition-shadow cursor-pointer ${colorClass} ${
              i === todayIdx ? "ring-1 ring-primary/30" : ""
            }`}
          >
            <p className="font-semibold leading-tight">{c.subject}</p>
            <p className="opacity-75 mt-1 truncate">{c.teacher}</p>
            <p className="opacity-60 text-[10px] mt-0.5">Room {c.room}</p>
          </div>
        );
      })}
    </>
  );
}
