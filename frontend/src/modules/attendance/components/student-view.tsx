import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StudentView() {
  const totals = (rows: { status: string }[]) => ({
    present: rows.filter((r) => r.status === "Present").length,
    absent: rows.filter((r) => r.status === "Absent").length,
    late: rows.filter((r) => r.status === "Late" || r.status === "On Leave").length,
  });

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
