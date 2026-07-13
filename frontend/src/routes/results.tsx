import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RESULTS } from "@/lib/mock-data";
import { Award, Download } from "lucide-react";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — Northgate Academy" },
      { name: "description", content: "View academic results, marks, and grades by subject." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const total = RESULTS.reduce((a, r) => a + r.marks, 0);
  const max = RESULTS.reduce((a, r) => a + r.max, 0);
  const percent = ((total / max) * 100).toFixed(1);
  const overallGrade = +percent >= 90 ? "A+" : +percent >= 80 ? "A" : +percent >= 70 ? "B+" : "B";

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Academic Results</h1>
          <p className="text-sm text-muted-foreground">Final term assessment · 2025-26</p>
        </div>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Download Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 overflow-hidden border-border/60" style={{ background: "var(--gradient-primary)" }}>
          <CardContent className="p-6 text-primary-foreground">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">Overall Performance</p>
                <p className="text-4xl font-semibold mt-1">{percent}%</p>
                <p className="text-sm opacity-80 mt-1">{total} / {max} marks</p>
              </div>
              <div className="h-16 w-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0">Grade {overallGrade}</Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0">Rank 4 / 64</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Subjects</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-semibold">{RESULTS.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Distinction</span><span className="font-semibold text-success">{RESULTS.filter(r => r.marks >= 85).length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">First Class</span><span className="font-semibold">{RESULTS.filter(r => r.marks >= 70 && r.marks < 85).length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Below 70%</span><span className="font-semibold text-warning">{RESULTS.filter(r => r.marks < 70).length}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Results</CardTitle>
          <CardDescription>Marks, grades and remarks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead className="w-[200px]">Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RESULTS.map((r) => (
                <TableRow key={r.subject}>
                  <TableCell className="font-medium">{r.subject}</TableCell>
                  <TableCell>{r.marks} / {r.max}</TableCell>
                  <TableCell><Progress value={(r.marks / r.max) * 100} className="h-2" /></TableCell>
                  <TableCell><Badge variant="secondary" className="font-mono">{r.grade}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{r.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
