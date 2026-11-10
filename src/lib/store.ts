import { useSyncExternalStore } from "react";
import { estimateTheta, generateItem, nextLevel, type Item, type Trial } from "./engine";

export type LogEvent = { t: number; type: string; detail: string };
export type State = {
  level: number; theta: number; trials: Trial[]; results: boolean[]; item: Item; seed: number;
  xp: number; streak: number; badges: string[]; log: LogEvent[]; attempts: Record<string, number>;
  errors: Record<string, number>; topicViews: Record<string, number>; sessionStart: number; latencies: number[];
};
const init = (): State => ({
  level: 1, theta: 0, trials: [], results: [], item: generateItem(1, 7), seed: 7, xp: 0, streak: 0,
  badges: [], log: [{ t: 0, type: "login", detail: "Session started" }], attempts: {}, errors: {}, topicViews: {},
  sessionStart: 0, latencies: [],
});
let state = init();
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
export const store = {
  get: () => state,
  set(fn: (s: State) => Partial<State>) { state = { ...state, ...fn(state) }; emit(); },
  log(type: string, detail: string) { store.set((s) => ({ log: [{ t: Date.now(), type, detail }, ...s.log].slice(0, 200) })); },
};
const serverState = init();
export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => sel(state), () => sel(serverState));
}

export const BADGES: { id: string; name: string; test: (s: State) => boolean }[] = [
  { id: "first", name: "First Step", test: (s) => s.results.length >= 1 },
  { id: "streak3", name: "Hot Streak ×3", test: (s) => s.streak >= 3 },
  { id: "analyze", name: "Analyst (Bloom 4)", test: (s) => s.level >= 3 },
  { id: "creator", name: "Summit (Bloom 6)", test: (s) => s.level >= 5 },
  { id: "ten", name: "Ten Tasks", test: (s) => s.results.length >= 10 },
  { id: "resilient", name: "Resilient", test: (s) => s.results.filter((r) => !r).length >= 2 && s.streak >= 2 },
];

export function submitAnswer(choice: number, latencyMs: number) {
  const s = state; const it = s.item; const correct = choice === it.answer;
  const trials = [...s.trials, { a: it.a, b: it.b, c: it.c, d: it.d, correct }];
  const results = [...s.results, correct];
  const theta = estimateTheta(trials, 0.8);
  const level = nextLevel(s.level, results);
  const errors = { ...s.errors };
  if (!correct) { const why = it.distractors[choice] ?? "Unclassified error"; errors[why] = (errors[why] ?? 0) + 1; }
  const streak = correct ? s.streak + 1 : 0;
  store.set(() => ({ trials, results, theta, level, errors, streak, xp: s.xp + (correct ? 10 + 5 * s.level : 2),
    attempts: { ...s.attempts, [it.topic]: (s.attempts[it.topic] ?? 0) + 1 }, latencies: [...s.latencies, latencyMs] }));
  store.log("submit", `${it.topic} L${s.level} → ${correct ? "correct" : "incorrect"} (${(latencyMs / 1000).toFixed(1)}s)`);
  if (level !== s.level) store.log("dda", `Difficulty ${level > s.level ? "increased" : "reduced"} to Bloom ${level + 1}`);
  const earned = BADGES.filter((b) => !state.badges.includes(b.id) && b.test(state));
  if (earned.length) { store.set((x) => ({ badges: [...x.badges, ...earned.map((e) => e.id)] })); earned.forEach((e) => store.log("badge", e.name)); }
  return { correct, why: correct ? null : it.distractors[choice] ?? null, newBadges: earned.map((e) => e.name), levelChange: level - s.level };
}
export function nextItem() {
  store.set((s) => ({ seed: s.seed + 13, item: generateItem(s.level, s.seed + 13) }));
}
export function chooseLevel(level: number) {
  store.set((s) => ({ level, item: generateItem(level, s.seed + 5), seed: s.seed + 5 }));
  store.log("navigate", `Self-selected Bloom level ${level + 1}`);
}
export function viewTopic(topic: string) {
  store.set((s) => ({ topicViews: { ...s.topicViews, [topic]: (s.topicViews[topic] ?? 0) + 1 } }));
  store.log("material", `Viewed tutorial: ${topic}`);
}
