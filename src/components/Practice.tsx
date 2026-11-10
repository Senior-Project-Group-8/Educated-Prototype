import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BLOOM, p4pl, rollingAccuracy } from "@/lib/engine";
import { chooseLevel, nextItem, submitAnswer, useStore } from "@/lib/store";
import { Panel } from "./AppShell";

export function Practice({ selfPaced = false }: { selfPaced?: boolean }) {
  const item = useStore((s) => s.item);
  const level = useStore((s) => s.level);
  const theta = useStore((s) => s.theta);
  const results = useStore((s) => s.results);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; why: string | null } | null>(null);
  const [hint, setHint] = useState(false);
  const started = useRef(Date.now());
  useEffect(() => { started.current = Date.now(); setPicked(null); setFeedback(null); setHint(false); }, [item.id]);

  const pSuccess = p4pl(theta, item.a, item.b, item.c, item.d);
  const acc = rollingAccuracy(results);

  function choose(i: number) {
    if (feedback) return;
    setPicked(i);
    const r = submitAnswer(i, Date.now() - started.current);
    setFeedback(r);
    if (!r.correct) setHint(true);
    r.newBadges.forEach((b) => toast.success(`Badge unlocked: ${b}`));
    if (r.levelChange > 0) toast(`Level up → ${BLOOM[level + 1]}`, { description: "Consecutive correct answers raised complexity." });
    if (r.levelChange < 0) toast(`Difficulty eased → ${BLOOM[level - 1]}`, { description: "Rolling accuracy fell below 60%." });
  }

  return (
    <Panel title="Adaptive practice" tag="F1 · F5 · R9–R14, R26, R40, R95">
      <div className="mb-4 flex flex-wrap gap-1">
        {BLOOM.map((b, i) => (
          <button key={b} disabled={!selfPaced} onClick={() => chooseLevel(i)}
            className={`rounded px-2 py-1 font-mono text-[11px] ${i === level ? "bg-primary text-primary-foreground" : i < level ? "bg-secondary" : "bg-muted text-muted-foreground"} ${selfPaced ? "cursor-pointer hover:ring-1 hover:ring-ring" : ""}`}>
            {i + 1}·{b}
          </button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">{item.topic} · steps {item.steps} · b={item.b.toFixed(2)}</div>
      <div className="my-4 font-mono text-2xl">{item.prompt}</div>
      <div className="grid grid-cols-2 gap-2">
        {item.choices.map((c, i) => {
          const state = feedback ? (i === item.answer ? "correct" : i === picked ? "wrong" : "idle") : "idle";
          return (
            <Button key={i} variant={state === "correct" ? "success" : state === "wrong" ? "destructive" : "outline"}
              className="h-12 justify-start font-mono text-base" onClick={() => choose(i)}>{c}</Button>
          );
        })}
      </div>
      {hint && !feedback?.correct && (
        <div className="mt-4 animate-pop rounded-md border border-accent bg-accent/15 p-3 text-sm">
          <div className="font-semibold">💡 Hint</div>{item.hint}
        </div>
      )}
      {feedback && (
        <div className={`mt-3 rounded-md p-3 text-sm ${feedback.correct ? "bg-success/15" : "bg-destructive/10"}`}>
          {feedback.correct ? "Correct — nice work." : <>Incorrect. <b>Diagnosed:</b> {feedback.why ?? "unclassified error"}.</>}
          <Button size="sm" className="ml-3" onClick={nextItem}>Next task →</Button>
        </div>
      )}
      {!feedback && <Button variant="ghost" size="sm" className="mt-3" onClick={() => setHint(true)}>Show hint</Button>}
      <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4 text-xs">
        <div><div className="text-muted-foreground">Ability θ</div><div className="font-mono text-lg">{theta.toFixed(2)}</div></div>
        <div><div className="text-muted-foreground">P(correct) 4PL</div><div className="font-mono text-lg">{(pSuccess * 100).toFixed(0)}%</div></div>
        <div><div className="text-muted-foreground">Rolling acc. (5)</div><div className={`font-mono text-lg ${acc < 0.6 ? "text-destructive" : ""}`}>{(acc * 100).toFixed(0)}%</div>
          <Progress value={acc * 100} className="mt-1 h-1" /></div>
      </div>
    </Panel>
  );
}
