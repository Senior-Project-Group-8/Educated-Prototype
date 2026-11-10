import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FEATURES } from "@/data/features";
import REQS from "@/data/requirements.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Adapt — Adaptive Learning Prototype" }, { name: "description", content: "Prototype of an adaptive learning platform: 4PL IRT difficulty, AI assistant, analytics, and portals for every role." },
    { property: "og:title", content: "Adapt — Adaptive Learning Prototype" }, { property: "og:description", content: "Adaptive learning across students, teachers, parents and admins." },
  ] }),
  component: Index,
});
const ROLES = [
  { to: "/student", t: "Student", d: "Adaptive practice, hints, UniHub assistant, badges" },
  { to: "/learner", t: "Independent learner", d: "Self-paced levels with instant feedback" },
  { to: "/teacher", t: "Teacher", d: "Class risk, error trends, authoring, exports" },
  { to: "/parent", t: "Parent", d: "Engagement hours, milestones, gain alerts" },
  { to: "/admin", t: "Administrator", d: "Cohort compliance and semester archives" },
] as const;
function Index() {
  return (
    <>
      <section className="bg-hero rounded-xl p-10 text-primary-foreground md:p-14">
        <div className="font-mono text-xs uppercase tracking-widest opacity-80">Senior project · Group 8 prototype</div>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Learning that adjusts to every learner, every answer.</h1>
        <p className="mt-4 max-w-2xl opacity-90">
          A 4PL IRT model with a discount factor re-estimates ability after each task, keeping students in flow — while teachers, parents and administrators see what's happening in real time.
        </p>
        <div className="mt-6 font-mono text-sm opacity-90">P(u=1|θ) = c + (d − c) / (1 + e<sup>−a(θ−b)</sup>)</div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg"><Link to="/student">Try as a student</Link></Button>
          <Button asChild variant="outline" size="lg" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/matrix">View traceability (R1–R{REQS.length})</Link></Button>
        </div>
      </section>
      <h2 className="mt-10 mb-4 text-2xl font-semibold">Enter as…</h2>
      <div className="grid gap-3 md:grid-cols-5">
        {ROLES.map((r) => (
          <Link key={r.to} to={r.to} className="group rounded-lg border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary">
            <div className="font-display text-lg font-semibold group-hover:text-primary">{r.t}</div><div className="mt-1 text-sm text-muted-foreground">{r.d}</div>
          </Link>))}
      </div>
      <h2 className="mt-10 mb-4 text-2xl font-semibold">Feature modules</h2>
      <div className="grid gap-3 md:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.id} className="rounded-lg border bg-card p-4">
            <div className="font-mono text-xs text-primary">F{f.id} · {(REQS as { features: number[] }[]).filter((r) => r.features.includes(f.id)).length} requirements</div>
            <div className="mt-1 font-medium">{f.name}</div>
          </div>))}
      </div>
    </>
  );
}
