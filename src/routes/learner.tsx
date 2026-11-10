import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/AppShell";
import { Practice } from "@/components/Practice";
import { Milestones, MyProgress, Recommendations } from "@/components/StudentWidgets";

export const Route = createFileRoute("/learner")({
  head: () => ({ meta: [
    { title: "Self-paced learning — Adapt" }, { name: "description", content: "Unconstrained self-directed practice with instant feedback." },
    { property: "og:title", content: "Self-paced learning — Adapt" }, { property: "og:description", content: "Self-directed practice with instant feedback." },
  ] }),
  component: Learner,
});
function Learner() {
  return (
    <>
      <PageHead role="Independent learner" title="Learn at your own pace" sub="Pick any cognitive level — no syllabus, no deadlines. Feedback is instant and the engine still adapts. (R7, R16, R48, R70, R86)" />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5"><Practice selfPaced /><MyProgress /></div>
        <div className="space-y-5"><Recommendations /><Milestones /></div>
      </div>
    </>
  );
}
