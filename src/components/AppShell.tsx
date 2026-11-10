import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/student", label: "Student" },
  { to: "/learner", label: "Independent" },
  { to: "/teacher", label: "Teacher" },
  { to: "/parent", label: "Parent" },
  { to: "/admin", label: "Admin" },
  { to: "/matrix", label: "Traceability" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
          <Link to="/" className="font-display text-xl font-bold text-primary">Adapt<span className="text-accent">.</span></Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
                className="rounded px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <span className="ml-auto hidden font-mono text-xs text-muted-foreground lg:block">RBAC · prototype</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}

export function Panel({ title, tag, children, className = "" }: { title: string; tag?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border bg-card p-5 shadow-card ${className}`}>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {tag && <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{tag}</span>}
      </div>
      {children}
    </section>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function PageHead({ role, title, sub }: { role: string; title: string; sub: string }) {
  return (
    <div className="mb-6">
      <div className="font-mono text-xs uppercase tracking-widest text-primary">{role}</div>
      <h1 className="mt-1 text-3xl font-bold">{title}</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">{sub}</p>
    </div>
  );
}
