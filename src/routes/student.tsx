import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/AppShell";
import { Practice } from "@/components/Practice";
import { UniHubChat } from "@/components/UniHubChat";
import { EventLog, Milestones, MyProgress, Recommendations } from "@/components/StudentWidgets";

export const Route = createFileRoute("/student")({
  head: () => ({ meta: [
    { title: "Student workspace — Adapt" }, { name: "description", content: "Adaptive practice, hints, AI assistant and milestones for students." },
    { property: "og:title", content: "Student workspace — Adapt" }, { property: "og:description", content: "Adaptive practice, hints, AI assistant and milestones." },
  ] }),
  component: Student,
});
function Student() {
  return (
    <>
      <PageHead role="Student" title="Your learning workspace" sub="Tasks adapt to you in real time: two correct in a row raises the level, accuracy under 60% eases it." />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5"><Practice /><MyProgress /><EventLog /></div>
        <div className="space-y-5"><Milestones /><Recommendations /><UniHubChat /></div>
      </div>
    </>
  );
}
