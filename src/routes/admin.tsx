import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHead, Panel, Stat } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { COMPLIANCE, SEMESTERS, SKILLS, STUDENTS } from "@/data/mock";
import { normalizedGain } from "@/lib/engine";
import { downloadCsv } from "@/lib/csv";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Administration — Adapt" }, { name: "description", content: "Cohort segmentation, grade-level skill compliance and multi-semester archives." },
    { property: "og:title", content: "Administration — Adapt" }, { property: "og:description", content: "Cohort compliance and archives." },
  ] }),
  component: Admin,
});
const TARGET = 75;
function Admin() {
  const [sem, setSem] = useState(SEMESTERS[2]!);
  const cohorts = [...new Set(STUDENTS.map((s) => s.cohort))].map((c) => {
    const g = STUDENTS.filter((s) => s.cohort === c);
    return { c, n: g.length, grade: g[0]!.grade, gain: g.reduce((a, s) => a + normalizedGain(s.pre, s.post), 0) / g.length, hours: g.reduce((a, s) => a + s.hours, 0) / g.length };
  });
  const comp = COMPLIANCE[sem]!;
  const met = SKILLS.filter((s) => (comp[s.code] ?? 0) >= TARGET).length;
  return (
    <>
      <PageHead role="Administrator" title="Institutional oversight" sub="Audit grade-level skill compliance across cohorts and semesters. (R8, R31, R43, R56, R74, R80, R91, R96)" />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Cohorts" value={cohorts.length} /><Stat label="Students" value={STUDENTS.length} />
        <Stat label="Skills meeting target" value={`${met}/${SKILLS.length}`} sub={`≥ ${TARGET}% mastery`} /><Stat label="Archived semesters" value={SEMESTERS.length} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Cohort segmentation" tag="F3 · F6 · R43">
          <Table><TableHeader><TableRow><TableHead>Cohort</TableHead><TableHead>Grade</TableHead><TableHead>Students</TableHead><TableHead>Avg gain</TableHead><TableHead>Avg hrs/wk</TableHead></TableRow></TableHeader>
            <TableBody>{cohorts.map((c) => <TableRow key={c.c}><TableCell>{c.c}</TableCell><TableCell>{c.grade}</TableCell><TableCell>{c.n}</TableCell><TableCell className="font-mono">{c.gain.toFixed(2)}</TableCell><TableCell>{c.hours.toFixed(1)}</TableCell></TableRow>)}</TableBody></Table>
        </Panel>
        <Panel title="Skill compliance" tag="F6 · R56, R80">
          <div className="mb-3 flex gap-1">{SEMESTERS.map((s) => <Button key={s} size="sm" variant={s === sem ? "default" : "outline"} onClick={() => setSem(s)}>{s}</Button>)}</div>
          <ul className="space-y-3">{SKILLS.map((s) => (
            <li key={s.code}><div className="flex justify-between text-sm"><span><span className="font-mono text-xs text-primary">{s.code}</span> {s.name}</span><span className={(comp[s.code] ?? 0) >= TARGET ? "text-success" : "text-destructive"}>{(comp[s.code] ?? 0)}%</span></div>
              <div className="relative mt-1 h-2 rounded bg-muted"><div className={`h-2 rounded ${(comp[s.code] ?? 0) >= TARGET ? "bg-success" : "bg-warning"}`} style={{ width: `${(comp[s.code] ?? 0)}%` }} /><div className="absolute top-[-3px] h-3.5 w-0.5 bg-foreground" style={{ left: `${TARGET}%` }} /></div></li>))}</ul>
        </Panel>
        <Panel title="Multi-semester archive" tag="F3 · R91, R96" className="lg:col-span-2">
          <Table><TableHeader><TableRow><TableHead>Skill</TableHead>{SEMESTERS.map((s) => <TableHead key={s}>{s}</TableHead>)}<TableHead>Trend</TableHead></TableRow></TableHeader>
            <TableBody>{SKILLS.map((k) => <TableRow key={k.code}><TableCell className="font-mono text-xs">{k.code}</TableCell>{SEMESTERS.map((s) => <TableCell key={s}>{COMPLIANCE[s]![k.code]}%</TableCell>)}<TableCell className="text-success">+{COMPLIANCE[SEMESTERS[2]!]![k.code]! - COMPLIANCE[SEMESTERS[0]!]![k.code]!} pts</TableCell></TableRow>)}</TableBody></Table>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => downloadCsv("compliance-archive.csv", SKILLS.map((k) => ({ code: k.code, skill: k.name, ...Object.fromEntries(SEMESTERS.map((s) => [s, COMPLIANCE[s]![k.code]])) })))}>Export audit log</Button>
        </Panel>
      </div>
    </>
  );
}
