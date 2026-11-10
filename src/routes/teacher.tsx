import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { toast } from "sonner";
import { PageHead, Panel, Stat } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STUDENTS } from "@/data/mock";
import { normalizedGain, riskLabel, riskScore } from "@/lib/engine";
import { downloadCsv } from "@/lib/csv";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/teacher")({
  head: () => ({ meta: [
    { title: "Instructor workspace — Adapt" }, { name: "description", content: "Class metrics, early alerts, error logs and assignment authoring." },
    { property: "og:title", content: "Instructor workspace — Adapt" }, { property: "og:description", content: "Class metrics, early alerts, and authoring." },
  ] }),
  component: Teacher,
});

const INTERVENTIONS: Record<string, string> = {
  "Exponent addition": "Mini-lesson contrasting product rule vs. combining like terms",
  "Sign error": "Number-line warm-up on subtracting negatives",
  Distribution: "Area-model practice for distributing over parentheses",
  "Order of operations": "Inverse-operations sequencing drill",
};

function Teacher() {
  const rows = useMemo(() => STUDENTS.map((s) => ({ ...s, risk: riskScore(s), g: normalizedGain(s.pre, s.post) })), []);
  const errorLog = useStore((s) => s.errors);
  const [assignments, setAssignments] = useState([{ title: "Unit 3 — Linear equations", due: "2026-11-14", cohort: "Algebra I · P2", level: 3 }]);
  const [form, setForm] = useState({ title: "", due: "", cohort: "Algebra I · P2", level: 2 });
  const trends = Object.entries(rows.reduce<Record<string, number>>((a, r) => ({ ...a, [r.topError]: (a[r.topError] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
  const alerts = rows.filter((r) => r.risk >= 0.4);
  const avg = (k: "pre" | "post" | "g") => rows.reduce((a, r) => a + r[k], 0) / rows.length;

  return (
    <>
      <PageHead role="Teacher" title="Instructor workspace" sub="Monitor the class, catch at-risk students early, and author adaptive assignments." />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Students" value={rows.length} /><Stat label="Avg pre → post" value={`${avg("pre").toFixed(0)} → ${avg("post").toFixed(0)}`} />
        <Stat label="Avg normalized gain" value={avg("g").toFixed(2)} /><Stat label="Early alerts" value={alerts.length} sub="EAP risk ≥ moderate" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Class roster & risk" tag="F3 · F5 · R3, R20, R28, R72">
          <Table>
            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Logins/wk</TableHead><TableHead>On-time</TableHead><TableHead>Attempts</TableHead><TableHead>Gain</TableHead><TableHead>Risk</TableHead></TableRow></TableHeader>
            <TableBody>{rows.map((r) => (
              <TableRow key={r.id}><TableCell><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.cohort}</div></TableCell>
                <TableCell>{r.loginsPerWeek}</TableCell><TableCell>{r.onTime}%</TableCell><TableCell>{r.attempts}</TableCell><TableCell className="font-mono">{r.g.toFixed(2)}</TableCell>
                <TableCell><Badge variant={riskLabel(r.risk) === "High" ? "destructive" : riskLabel(r.risk) === "Moderate" ? "secondary" : "outline"}>{riskLabel(r.risk)} {(r.risk * 100).toFixed(0)}%</Badge></TableCell></TableRow>
            ))}</TableBody>
          </Table>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => downloadCsv("class-progress.csv", rows.map(({ name, cohort, pre, post, g, risk, attempts, onTime }) => ({ name, cohort, pre, post, gain: g.toFixed(2), risk: risk.toFixed(2), attempts, onTime })))}>Export CSV (R44)</Button>
        </Panel>
        <div className="space-y-5">
          <Panel title="Early-alert feed" tag="F5 · R54, R89">
            <ul className="space-y-2 text-sm">{alerts.map((a) => (
              <li key={a.id} className="rounded-md border-l-4 border-destructive bg-destructive/5 p-2">
                <b>{a.name}</b> — {a.loginsPerWeek <= 1 && "low login frequency · "}{a.missed > 0 && `${a.missed} missed tasks · `}{a.activeDrop >= 0.3 && `active time ↓${(a.activeDrop * 100).toFixed(0)}%`}
              </li>))}</ul>
          </Panel>
          <Panel title="Error trends → interventions" tag="F5 · R66, R85">
            <ul className="space-y-2 text-sm">{trends.map(([e, n]) => (
              <li key={e}><div className="flex justify-between"><b>{e}</b><span className="font-mono">{n} students</span></div><div className="text-xs text-muted-foreground">→ {INTERVENTIONS[e]}</div></li>))}</ul>
            {Object.keys(errorLog).length > 0 && <div className="mt-3 border-t pt-2 text-xs"><b>Live session errors:</b> {Object.entries(errorLog).map(([k, v]) => `${k} (${v})`).join("; ")}</div>}
          </Panel>
        </div>
        <Panel title="Pre/post knowledge gain" tag="F3 · R65, R78">
          <div className="h-64"><ResponsiveContainer><BarChart data={rows.map((r) => ({ name: r.name.split(" ")[0], Pre: r.pre, Post: r.post }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Legend />
            <Bar dataKey="Pre" fill="var(--chart-2)" /><Bar dataKey="Post" fill="var(--chart-1)" /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Author assignment" tag="F6 · R49, R73">
          <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); if (!form.title || !form.due) { toast.error("Title and due date required"); return; }
            setAssignments((a) => [...a, form]); toast.success(`Assigned to ${form.cohort}`); setForm({ ...form, title: "" }); }}>
            <Input placeholder="Assignment title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="flex gap-2"><Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
              <select className="rounded-md border bg-background px-2 text-sm" value={form.cohort} onChange={(e) => setForm({ ...form, cohort: e.target.value })}>
                {[...new Set(STUDENTS.map((s) => s.cohort))].map((c) => <option key={c}>{c}</option>)}</select>
              <select className="rounded-md border bg-background px-2 text-sm" value={form.level} onChange={(e) => setForm({ ...form, level: +e.target.value })}>
                {[1, 2, 3, 4, 5, 6].map((l) => <option key={l} value={l}>Bloom {l}</option>)}</select></div>
            <Button type="submit" className="w-full">Distribute</Button>
          </form>
          <ul className="mt-3 space-y-1 text-sm">{assignments.map((a, i) => <li key={i} className="flex justify-between border-b py-1"><span>{a.title}</span><span className="text-xs text-muted-foreground">{a.cohort} · due {a.due}</span></li>)}</ul>
        </Panel>
      </div>
    </>
  );
}
