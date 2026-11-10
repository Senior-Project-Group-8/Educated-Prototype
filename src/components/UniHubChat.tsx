import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UNIHUB_CONFIG, unihubReply } from "@/lib/unihub";
import { store } from "@/lib/store";
import { Panel } from "./AppShell";

type Msg = { role: "user" | "bot"; text: string };
const MAX = 500;

function chime(freq: number) {
  try {
    const ctx = new AudioContext(); const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.value = freq; g.gain.setValueAtTime(0.08, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.25);
  } catch { /* audio unavailable */ }
}

export function UniHubChat() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: "Hi! I'm **UniHub**. Ask about courses, fees, deadlines, exam results, or a math topic." }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const lastRef = useRef<HTMLDivElement>(null);
  useEffect(() => { lastRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [msgs, typing]);

  async function send() {
    const q = input.trim();
    if (!q || q.length > MAX || typing) return;
    setMsgs((m) => [...m, { role: "user", text: q }]); setInput(""); chime(660); setTyping(true);
    store.log("chat", `UniHub query (${q.length} chars)`);
    // Simulates async POST /AI/chat_with_unihub/
    const reply = await new Promise<string>((r) => setTimeout(() => r(unihubReply(q)), 700 + Math.random() * 600));
    setTyping(false); setMsgs((m) => [...m, { role: "bot", text: reply }]); chime(880);
  }
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); }
  }

  return (
    <Panel title="UniHub assistant" tag="F4 · R21–R25, R34, R58, R76">
      <div className="mb-2 font-mono text-[10px] text-muted-foreground">
        temp {UNIHUB_CONFIG.temperature} · max {UNIHUB_CONFIG.maxTokens} tokens · {UNIHUB_CONFIG.template}
      </div>
      <div className="h-72 space-y-2 overflow-y-auto rounded-md border bg-background p-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
            <div className={`prose-chat max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-1 px-3 py-2" aria-label="Assistant is typing">
            {[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d * 120}ms` }} />)}
          </div>
        )}
        <div ref={lastRef} />
      </div>
      <div className="mt-2 flex gap-2">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} rows={2}
          placeholder="Enter to send · Shift+Enter for new line" className="resize-none" />
        <Button onClick={() => void send()} disabled={!input.trim() || input.length > MAX || typing}>Send</Button>
      </div>
      <div className={`mt-1 text-right text-xs ${input.length > MAX ? "text-destructive" : "text-muted-foreground"}`}>{input.length}/{MAX}</div>
    </Panel>
  );
}
