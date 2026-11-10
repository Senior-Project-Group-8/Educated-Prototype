import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BADGES, useStore, viewTopic } from "@/lib/store";
import { normalizedGain } from "@/lib/engine";
import { Panel, Stat } from "./AppShell";

export function Milestones() {
  const xp = useStore((s) => s.xp); const badges = useStore((s) => s.badges); const streak = useStore((s) => s.streak); const level = useStore((s) => s.level);
  const next = (Math.floor(xp / 100) + 1) * 100;
  return (
    <Panel title="Milestones" tag="F7 · R32, R33, R68, R92">
      <div className="flex items-end justify-between"><div className="font-display text-3xl font-bold">{xp} XP</div><div className="text-sm text-muted-foreground">🔥 streak {streak}</div></div>
      <Progress value={(xp % 100)} className="my-2 h-2" /><div className="text-xs text-muted-foreground">{next - xp} XP to milestone {next / 100}</div>
      <div className="mt-3 text-xs text-muted-foreground">Flow zone: Bloom {level + 1} — matched to your ability</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {BADGES.map((b) => {
          const on = badges.includes(b.id);
          return <div key={b.id} className={`rounded-md border p-2 text-center text-[11px] ${on ? "animate-pop border-accent bg-accent/20" : "opacity-40"}`}>{on ? "🏅" : "🔒"}<div>{b.name}</div></div>;
        })}
      </div>
    </Panel>
  );
}

export function Recommendations() {
  const errors = useStore((s) => s.errors); const views = useStore((s) => s.topicViews); const level = useStore((s) => s.level);
  const ranked = Object.entries(errors).sort((a, b) => b[1] - a[1]);
  const topicFor = (why: string) => why.match(/exponent|like term|power rule/i) ? "Exponent rules" : why.match(/operand|carry|multiplied$|negative adds/i) ? "Integer arithmetic" : why.match(/distribut|divide|order of|coefficient|factor|constant/i) ? "Linear equations" : "Integer arithmetic";
  const recs = ranked.length ? ranked.slice(0, 3).map(([why, n]) => ({ topic: topicFor(why), why, n }))
    : [{ topic: ["Integer arithmetic", "Linear equations", "Exponent rules"][Math.min(2, Math.floor(level / 2))]!, why: "Matched to current cognitive level", n: 0 }];
  return (
    <Panel title="Recommended for you" tag="F2 · R17, R39, R50, R94">
      <ul className="space-y-2">
        {recs.map((r, i) => (
          <li key={i} className="flex items-center justify-between gap-2 rounded-md border bg-background p-3 text-sm">
            <div><div className="font-medium">Tutorial: {r.topic}</div><div className="text-xs text-muted-foreground">{r.why}{r.n ? ` · ${r.n}×` : ""} · viewed {views[r.topic] ?? 0}×</div></div>
            <Button size="sm" variant="outline" onClick={() => viewTopic(r.topic)}>Open</Button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function MyProgress() {
  const results = useStore((s) => s.results); const lat = useStore((s) => s.latencies);
  const pre = 48; const acc = results.length ? results.filter(Boolean).length / results.length : 0;
  const post = results.length ? Math.round(pre + (100 - pre) * acc * Math.min(1, results.length / 10)) : pre;
  return (
    <Panel title="My progress" tag="F3 · R1, R19, R36, R51">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Stat label="Pre-test" value={pre} /><Stat label="Current est." value={post} />
        <Stat label="Gain g" value={normalizedGain(pre, post).toFixed(2)} sub="(post−pre)/(100−pre)" />
        <Stat label="Avg. speed" value={lat.length ? `${(lat.reduce((a, b) => a + b, 0) / lat.length / 1000).toFixed(1)}s` : "—"} />
      </div>
    </Panel>
  );
}

export function EventLog() {
  const log = useStore((s) => s.log);
  return (
    <Panel title="Telemetry log" tag="F3 · R18, R38, R61, R67">
      <ul className="max-h-56 space-y-1 overflow-y-auto font-mono text-xs">
        {log.map((e, i) => <li key={i} className="flex gap-2"><span className="w-16 shrink-0 text-primary">{e.type}</span><span className="text-muted-foreground">{e.detail}</span></li>)}
      </ul>
    </Panel>
  );
}
