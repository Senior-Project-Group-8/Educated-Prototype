export const FEATURES = [
  { id: 1, short: "Adaptive DDA", name: "Adaptive Learning Engine & Fast DDA", where: "/student" },
  { id: 2, short: "Personalization", name: "Lesson Planning & Recommendations", where: "/learner" },
  { id: 3, short: "Analytics", name: "Real-Time Analytics & Progress Tracking", where: "/teacher" },
  { id: 4, short: "AI Chatbot", name: "Domain-Specific AI Assistant (UniHub)", where: "/student" },
  { id: 5, short: "Feedback & Alerts", name: "Real-Time Feedback & Early-Alert Predictor", where: "/teacher" },
  { id: 6, short: "Portals", name: "Stakeholder Management & Curriculum Portal", where: "/admin" },
  { id: 7, short: "Gamification", name: "Gamified Engagement & Milestones", where: "/student" },
] as const;
export const ROLE_ROUTE: Record<string, string> = { Student: "/student", Teacher: "/teacher", Parent: "/parent", Admin: "/admin", "Independent Learner": "/learner", System: "/student" };
