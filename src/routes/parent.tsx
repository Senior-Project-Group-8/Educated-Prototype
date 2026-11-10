import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { PageHead, Panel, Stat } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { STUDENTS } from "@/data/mock";
import { normalizedGain, riskLabel, riskScore } from "@/lib/engine";

export const Route = createFileRoute("/parent")({
  head: () => ({ meta: [
    { title: "Parent portal — Adapt" }, { name: "description", content: "Track your child's engagement hours, milestones, and learning gains." },
    { property: "og:title", content: "Parent portal — Adapt" }, { property: "og:description", content: "Engagement hours, milestones, and gains." },
  ] }),
  component: Parent,
});
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function Parent() {
  const kids = [STUDENTS[0], STUDENTS[1]];
  const [id, setId] = useState(kids[0].id);
  const k = kids.find((x) => x.id === id)!;
  const week = DAYS.map((d, i) => ({ d, hours: +((k.hours / 7) * (0.5 + Math.abs(Math.sin(i + k.pre)))).toFixed(1) }));
  const risk = riskLabel(riskScore(k));
  return (
    <>
      <PageHead role="Parent" title="Family overview" sub="See how engaged your child is and where to encourage them at home. (R5, R30, R55, R79, R90)" />
      <div className="mb-4 flex gap-2">{kids.map((c) => <button key={c.id} onClick={() => setId(c.id)} className={`rounded-full border px-4 py-1 text-sm ${c.id === id ? "bg-primary text-primary-foreground" : "bg-card"}`}>{c.name}</button>)}</div>
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Active hours this week" value={k.hours} /><Stat label="Milestones" value={k.milestones} />
        <Stat label="Normalized gain" value={normalizedGain(k.pre, k.post).toFixed(2)} sub={`${k.pre} → ${k.post}`} /><Stat label="On-time work" value={`${k.onTime}%`} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Daily active time" tag="F3"><div className="h-60"><ResponsiveContainer><LineChart data={week}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="d" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line dataKey="hours" stroke="var(--chart-1)" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Panel>
        <Panel title="Alerts & milestones" tag="F6 · R79">
          <ul className="space-y-2 text-sm">
            {risk !== "Low" && <li className="rounded-md border-l-4 border-destructive bg-destructive/5 p-2">Engagement has dropped — {k.missed} missed tasks this week. A short check-in may help.</li>}
            <li className="rounded-md border-l-4 border-accent bg-accent/10 p-2">{k.name.split(" ")[0]} reached {k.milestones} milestones. Next: "Summit (Bloom 6)".</li>
            <li className="rounded-md border-l-4 border-primary bg-primary/5 p-2">Focus area: <b>{k.topError}</b>. Teacher recommended a 10‑minute practice set.</li>
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">Progress to next milestone</div><Progress value={(k.milestones % 3) * 33 + 20} className="mt-1" />
        </Panel>
      </div>
    </>
  );
}
