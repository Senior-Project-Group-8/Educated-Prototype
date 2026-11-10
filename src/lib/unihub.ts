// Simulates the UniHub prompt-template guardrail (uni_hub_template.md): answers only from the institutional KB.
export const UNIHUB_CONFIG = { model: "gpt (simulated)", temperature: 0.4, maxTokens: 600, template: "/prompts/uni_hub_template.md" };
export const TEMPLATE_MD = `# UniHub Assistant
You answer ONLY questions about Northfield Academy courses, fees, registration, deadlines, exam results, and platform navigation.
Politely refuse anything else.`;
const KB: { keys: string[]; answer: string }[] = [
  { keys: ["fee", "tuition", "cost", "pay"], answer: "**Course fees (Fall 2026)**\n- Algebra I: $120 materials fee\n- Pre-Algebra: $95\n- Payment due **Sept 15** via the Billing tab." },
  { keys: ["register", "enroll", "registration", "sign up"], answer: "**Registration** opens **Aug 1** and closes **Sept 5**. Go to *Courses → Enroll* and pick your section." },
  { keys: ["deadline", "due", "when"], answer: "**Upcoming deadlines**\n1. Unit 3 Linear Equations – **Nov 14**\n2. Midterm review set – **Nov 21**\n3. Exponents quiz – **Dec 2**" },
  { keys: ["exam", "result", "grade", "score"], answer: "Exam results post **5 business days** after the test under *Progress → Scores*, including pre/post and normalized gain." },
  { keys: ["exponent", "power"], answer: "**Product rule:** \\(x^a · x^b = x^{a+b}\\). Only *like terms* combine: \\(2x^2 + x^3\\) stays as is — it is **not** \\(3x^5\\)." },
  { keys: ["linear", "equation", "solve"], answer: "To solve \\(ax + b = c\\): subtract **b** from both sides, then divide by **a**. Check by substituting back." },
  { keys: ["sign", "negative"], answer: "Subtracting a negative is adding: \\(5 − (−3) = 8\\). Watch the sign on every move across the equals sign." },
  { keys: ["navigate", "where", "find", "dashboard", "badge", "hint"], answer: "Use the top bar to switch views. **Practice** has adaptive tasks and hints; **Progress** shows gains; badges appear in **Milestones**." },
];
export function unihubReply(q: string): string {
  const s = q.toLowerCase();
  const hit = KB.find((k) => k.keys.some((w) => s.includes(w)));
  const text = hit ? hit.answer :
    "I'm sorry — I can only help with Northfield Academy topics such as **courses, fees, registration, deadlines, exam results, math practice topics,** and **platform navigation**. Could you ask about one of those?";
  return text.split(/\s+/).slice(0, Math.floor(UNIHUB_CONFIG.maxTokens * 0.75)).join(" ");
}
