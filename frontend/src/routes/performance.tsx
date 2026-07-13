import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PERFORMANCE_TREND, SUBJECT_BREAKDOWN } from "@/lib/mock-data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, Target, Award, Activity } from "lucide-react";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Performance — Northgate Academy" },
      { name: "description", content: "Detailed performance analysis with trends and subject breakdowns." },
    ],
  }),
  component: PerformancePage,
});

function PerformancePage() {
  const avg = (SUBJECT_BREAKDOWN.reduce((a, s) => a + s.score, 0) / SUBJECT_BREAKDOWN.length).toFixed(1);
  const classAvg = (SUBJECT_BREAKDOWN.reduce((a, s) => a + s.class, 0) / SUBJECT_BREAKDOWN.length).toFixed(1);
  const best = [...SUBJECT_BREAKDOWN].sort((a, b) => b.score - a.score)[0];
  const weakest = [...SUBJECT_BREAKDOWN].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Performance Analysis</h1>
        <p className="text-sm text-muted-foreground">Comprehensive academic insights and trends</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={TrendingUp} label="Overall Average" value={`${avg}%`} sub={`Class avg ${classAvg}%`} accent="text-primary" />
        <KpiCard icon={Award} label="Strongest Subject" value={best.subject} sub={`${best.score}%`} accent="text-success" />
        <KpiCard icon={Target} label="Needs Focus" value={weakest.subject} sub={`${weakest.score}%`} accent="text-warning" />
        <KpiCard icon={Activity} label="Improvement" value="+8.4%" sub="vs previous term" accent="text-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Score progression across terms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={PERFORMANCE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 250)" />
                <XAxis dataKey="term" stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 260)" fontSize={12} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.9 0.015 250)" }} />
                <Line type="monotone" dataKey="score" stroke="oklch(0.4 0.13 258)" strokeWidth={3} dot={{ r: 5, fill: "oklch(0.4 0.13 258)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject vs Class Average</CardTitle>
            <CardDescription>How you compare per subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={SUBJECT_BREAKDOWN}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 250)" />
                <XAxis dataKey="subject" stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.9 0.015 250)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="score" fill="oklch(0.4 0.13 258)" radius={[4, 4, 0, 0]} name="You" />
                <Bar dataKey="class" fill="oklch(0.75 0.05 250)" radius={[4, 4, 0, 0]} name="Class Avg" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill Profile</CardTitle>
          <CardDescription>Multi-dimensional view of subject strengths</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={SUBJECT_BREAKDOWN}>
              <PolarGrid stroke="oklch(0.9 0.015 250)" />
              <PolarAngleAxis dataKey="subject" stroke="oklch(0.5 0.03 260)" fontSize={12} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="oklch(0.5 0.03 260)" fontSize={10} />
              <Radar dataKey="score" stroke="oklch(0.4 0.13 258)" fill="oklch(0.4 0.13 258)" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  icon: Icon, label, value, sub, accent,
}: {
  icon: typeof TrendingUp; label: string; value: string; sub: string; accent: string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-semibold mt-1 truncate">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
          <div className={`h-9 w-9 rounded-lg bg-muted flex items-center justify-center ${accent}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
