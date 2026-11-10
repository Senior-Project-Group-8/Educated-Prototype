import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHead, Panel } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import REQS from "@/data/requirements.json";
import { FEATURES, ROLE_ROUTE } from "@/data/features";

export const Route = createFileRoute("/matrix")({
  head: () => ({ meta: [
    { title: "Traceability matrix R1–R96 — Adapt" }, { name: "description", content: "Requirements R1–R96 mapped to features F1–F7 with links to each implementation." },
    { property: "og:title", content: "Traceability matrix — Adapt" }, { property: "og:description", content: "R1–R96 mapped to F1–F7." },
  ] }),
  component: Matrix,
});
type Req = { id: string; desc: string; role: string; features: number[] };
function Matrix() {
  const reqs = REQS as Req[];
  const [q, setQ] = useState(""); const [role, setRole] = useState("All"); const [f, setF] = useState(0);
  const roles = ["All", ...new Set(reqs.map((r) => r.role))];
  const shown = reqs.filter((r) => (role === "All" || r.role === role) && (!f || r.features.includes(f)) && (r.id + r.desc).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHead role="Systems engineering" title="Traceability matrix" sub={`${reqs.length} requirements · 7 features · ${((reqs.filter((r) => r.features.length).length / reqs.length) * 100).toFixed(1)}% coverage. Click a row to open where it is implemented.`} />
      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-7">
        {FEATURES.map((ft) => (
          <button key={ft.id} onClick={() => setF(f === ft.id ? 0 : ft.id)} className={`rounded-md border p-2 text-left ${f === ft.id ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>
            <div className="font-mono text-xs">F{ft.id}</div><div className="text-sm font-medium">{ft.short}</div>
            <div className="text-xs opacity-70">{reqs.filter((r) => r.features.includes(ft.id)).length} reqs</div>
          </button>))}
      </div>
      <Panel title={`${shown.length} requirements`}>
        <div className="mb-3 flex flex-wrap gap-2">
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
          {roles.map((r) => <button key={r} onClick={() => setRole(r)} className={`rounded-full border px-3 text-xs ${r === role ? "bg-secondary font-semibold" : ""}`}>{r}</button>)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs text-muted-foreground"><th className="py-2">ID</th><th>Requirement</th><th>Role</th>{FEATURES.map((ft) => <th key={ft.id} className="w-10 text-center font-mono">F{ft.id}</th>)}<th /></tr></thead>
            <tbody>{shown.map((r) => (
              <tr key={r.id} className="border-b hover:bg-muted/50">
                <td className="py-1.5 font-mono text-xs text-primary">{r.id}</td><td>{r.desc}</td><td className="text-xs text-muted-foreground">{r.role}</td>
                {FEATURES.map((ft) => <td key={ft.id} className="text-center">{r.features.includes(ft.id) ? <span className="inline-block h-3 w-3 rounded-sm bg-primary" /> : ""}</td>)}
                <td><Link to={ROLE_ROUTE[r.role] ?? "/"} className="text-xs text-primary underline-offset-2 hover:underline">view →</Link></td>
              </tr>))}</tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
