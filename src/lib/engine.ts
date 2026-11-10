// F1 Adaptive engine: 4PL IRT, discounted ability estimation, AIG, DDA rules. F5: distractor analysis & hints.
export type Item = {
  id: string; topic: string; bloom: number; prompt: string;
  choices: string[]; answer: number; distractors: Record<number, string>;
  steps: number; magnitude: number; a: number; b: number; c: number; d: number; hint: string;
};
export const BLOOM = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];

/** P(u=1|θ) = c + (d−c)/(1+e^{−a(θ−b)}) */
export function p4pl(theta: number, a: number, b: number, c: number, d: number) {
  return c + (d - c) / (1 + Math.exp(-a * (theta - b)));
}

/** Attribute-based difficulty (no knowledge components needed). */
export function attributeDifficulty(steps: number, magnitude: number, bloom: number) {
  return -2 + 0.45 * steps + 0.25 * Math.log10(Math.max(1, magnitude)) + 0.35 * bloom;
}

export type Trial = { b: number; a: number; c: number; d: number; correct: boolean };

/** Discounted MAP estimate of θ: weights past trials by γ^{T−t}. */
export function estimateTheta(trials: Trial[], gamma = 0.8, prior = 0) {
  let theta = prior;
  const T = trials.length;
  for (let it = 0; it < 40; it++) {
    let g = -(theta - prior) * 0.3, h = -0.3; // weak normal prior keeps small samples stable
    trials.forEach((tr, t) => {
      const w = Math.pow(gamma, T - 1 - t);
      const P = p4pl(theta, tr.a, tr.b, tr.c, tr.d);
      const s = (P - tr.c) / (tr.d - tr.c);
      const dP = tr.a * (tr.d - tr.c) * s * (1 - s);
      const u = tr.correct ? 1 : 0;
      g += w * ((u - P) * dP) / (P * (1 - P));
      h -= w * (dP * dP) / (P * (1 - P));
    });
    const step = g / h;
    theta -= Math.max(-1, Math.min(1, step));
    if (Math.abs(step) < 1e-4) break;
  }
  return Math.max(-3, Math.min(3, theta));
}

export function rollingAccuracy(results: boolean[], window = 5) {
  const r = results.slice(-window);
  return r.length ? r.filter(Boolean).length / r.length : 1;
}

/** DDA rule: drop level when rolling accuracy < 60%, raise after 2 consecutive correct. */
export function nextLevel(level: number, results: boolean[]) {
  const n = results.length;
  if (n >= 3 && rollingAccuracy(results) < 0.6) return Math.max(0, level - 1);
  if (n >= 2 && results[n - 1] && results[n - 2]) return Math.min(5, level + 1);
  return level;
}

// ---- Adaptive Item Generator ----
const rnd = (s: number) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
const ri = (seed: number, lo: number, hi: number) => lo + Math.floor(rnd(seed) * (hi - lo + 1));
function shuffle(choices: string[], correct: string, seed: number) {
  const arr = [...choices].sort((x, y) => rnd(seed + x.length + x.charCodeAt(0)) - rnd(seed + y.length + y.charCodeAt(0)));
  return { choices: arr, answer: arr.indexOf(correct) };
}
export function generateItem(level: number, seed: number): Item {
  const L = Math.max(0, Math.min(5, level));
  let prompt = "", correct = "", wrong: [string, string][] = [], steps = 1, magnitude = 10, topic = "", hint = "";
  if (L <= 1) {
    const x = ri(seed, 2, 9 + L * 20), y = ri(seed + 1, 2, 9 + L * 20);
    topic = "Integer arithmetic"; steps = 1 + L; magnitude = x * y;
    if (L === 0) { prompt = `${x} + ${y} = ?`; correct = `${x + y}`;
      wrong = [[`${x - y}`, "Sign error: subtracted instead of added"], [`${x * y}`, "Operation confusion: multiplied"], [`${x + y + 1}`, "Off-by-one carry error"]];
      hint = "Check the operation sign: '+' means combine both quantities.";
    } else { prompt = `${x} − (−${y}) = ?`; correct = `${x + y}`;
      wrong = [[`${x - y}`, "Sign error: subtracting a negative adds"], [`${-x - y}`, "Distributed the negative to both terms"], [`${y - x}`, "Reversed operand order"]];
      hint = "Operational sign check: minus a negative becomes plus.";
    }
  } else if (L <= 3) {
    const a = ri(seed, 2, 6), b = ri(seed + 2, 1, 12), c = a * ri(seed + 3, 2, 9) + b;
    topic = "Linear equations"; steps = 2 + (L - 2); magnitude = c;
    if (L === 2) { prompt = `Solve for x: ${a}x + ${b} = ${c}`; correct = `${(c - b) / a}`;
      wrong = [[`${(c + b) / a}`, "Sign error: added the constant instead of subtracting"], [`${c / a - b}`, "Order of operations: divided before isolating x"], [`${c - b}`, "Forgot to divide by the coefficient"]];
      hint = "Undo the +" + b + " first (subtract from both sides), then divide by " + a + ".";
    } else { const k = ri(seed + 4, 2, 4); prompt = `Solve for x: ${k}(x + ${b}) = ${k * ((c - b) / a + b)}`; correct = `${(c - b) / a}`;
      wrong = [[`${(c - b) / a + b * (k - 1)}`, "Distribution error: multiplied only the first term"], [`${(c - b) / a + 2 * b}`, "Sign error when moving the constant"], [`${k * ((c - b) / a + b)}`, "Forgot to divide by the outer factor"]];
      hint = "Term distribution alert: the " + k + " multiplies BOTH x and " + b + ".";
    }
  } else {
    const p = ri(seed, 2, 5), q = ri(seed + 1, 2, 5) + (L === 5 ? 1 : 0);
    topic = "Exponent rules"; steps = 3 + (L - 4); magnitude = 100;
    if (L === 4) { prompt = `Simplify: x^${p} · x^${q}`; correct = `x^${p + q}`;
      wrong = [[`x^${p * q}`, "Multiplied exponents instead of adding (product rule)"], [`2x^${p + q}`, "Added coefficients that aren't there"], [`x^${Math.abs(p - q)}`, "Subtracted exponents (quotient rule misuse)"]];
      hint = "Product rule: same base → add exponents.";
    } else { prompt = `Simplify: 2x^${p} + x^${q}`; correct = `2x^${p} + x^${q}`;
      wrong = [[`3x^${p + q}`, "Exponent addition error: combined unlike terms"], [`2x^${p * q}`, "Applied power rule to a sum"], [`3x^${p}`, "Treated x^" + q + " as a like term of x^" + p]];
      hint = "Only like terms (same exponent) can be combined. These cannot.";
    }
  }
  const all = [correct, ...wrong.map((w) => w[0])];
  const { choices, answer } = shuffle(Array.from(new Set(all)), correct, seed);
  const distractors: Record<number, string> = {};
  wrong.forEach(([v, why]) => { const i = choices.indexOf(v); if (i >= 0 && i !== answer) distractors[i] = why; });
  const b = attributeDifficulty(steps, magnitude, L);
  return { id: `I${seed}`, topic, bloom: L, prompt, choices, answer, distractors, steps, magnitude,
    a: 1.2, b, c: 1 / choices.length, d: 0.97, hint };
}

/** F5 Early-Alert Predictor: weighted risk score 0..1 */
export function riskScore(s: { loginsPerWeek: number; missed: number; accuracyDrop: number; activeDrop: number }) {
  const z = -2 + 0.6 * Math.max(0, 4 - s.loginsPerWeek) + 0.7 * s.missed + 4 * s.accuracyDrop + 3 * s.activeDrop;
  return 1 / (1 + Math.exp(-z));
}
export const riskLabel = (r: number) => (r >= 0.66 ? "High" : r >= 0.4 ? "Moderate" : "Low");
export const normalizedGain = (pre: number, post: number) => (pre >= 100 ? 0 : (post - pre) / (100 - pre));
