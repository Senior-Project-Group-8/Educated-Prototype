export type Student = { id: string; name: string; cohort: string; grade: number; pre: number; post: number;
  loginsPerWeek: number; missed: number; accuracyDrop: number; activeDrop: number; hours: number; attempts: number;
  topError: string; milestones: number; onTime: number };
export const STUDENTS: Student[] = [
  { id: "s1", name: "Maya Chen", cohort: "Algebra I · P2", grade: 8, pre: 52, post: 81, loginsPerWeek: 5, missed: 0, accuracyDrop: 0, activeDrop: 0, hours: 6.4, attempts: 42, topError: "Sign error", milestones: 7, onTime: 100 },
  { id: "s2", name: "Jordan Ruiz", cohort: "Algebra I · P2", grade: 8, pre: 38, post: 49, loginsPerWeek: 1, missed: 3, accuracyDrop: 0.25, activeDrop: 0.5, hours: 1.2, attempts: 11, topError: "Exponent addition", milestones: 1, onTime: 40 },
  { id: "s3", name: "Aisha Okafor", cohort: "Algebra I · P2", grade: 8, pre: 64, post: 88, loginsPerWeek: 4, missed: 0, accuracyDrop: 0, activeDrop: 0.1, hours: 5.1, attempts: 37, topError: "Distribution", milestones: 6, onTime: 95 },
  { id: "s4", name: "Liam Novak", cohort: "Algebra I · P4", grade: 8, pre: 45, post: 58, loginsPerWeek: 2, missed: 2, accuracyDrop: 0.15, activeDrop: 0.3, hours: 2.3, attempts: 19, topError: "Order of operations", milestones: 2, onTime: 65 },
  { id: "s5", name: "Sofia Petrova", cohort: "Algebra I · P4", grade: 8, pre: 71, post: 90, loginsPerWeek: 6, missed: 0, accuracyDrop: 0, activeDrop: 0, hours: 7.8, attempts: 55, topError: "Sign error", milestones: 9, onTime: 100 },
  { id: "s6", name: "Ethan Brooks", cohort: "Pre-Algebra · P1", grade: 7, pre: 30, post: 52, loginsPerWeek: 3, missed: 1, accuracyDrop: 0.05, activeDrop: 0.15, hours: 3.6, attempts: 28, topError: "Exponent addition", milestones: 4, onTime: 80 },
  { id: "s7", name: "Noah Kim", cohort: "Pre-Algebra · P1", grade: 7, pre: 41, post: 44, loginsPerWeek: 1, missed: 4, accuracyDrop: 0.3, activeDrop: 0.6, hours: 0.8, attempts: 7, topError: "Sign error", milestones: 0, onTime: 30 },
  { id: "s8", name: "Grace Liu", cohort: "Pre-Algebra · P1", grade: 7, pre: 58, post: 76, loginsPerWeek: 4, missed: 0, accuracyDrop: 0, activeDrop: 0.05, hours: 4.9, attempts: 33, topError: "Distribution", milestones: 5, onTime: 90 },
];
export const SKILLS = [
  { code: "8.EE.A.1", name: "Integer exponent properties", grade: 8 },
  { code: "8.EE.C.7", name: "Solve linear equations in one variable", grade: 8 },
  { code: "7.NS.A.1", name: "Add & subtract rational numbers", grade: 7 },
  { code: "7.EE.A.1", name: "Expand linear expressions", grade: 7 },
];
export const SEMESTERS = ["Fall 2025", "Spring 2026", "Fall 2026"];
export const COMPLIANCE: Record<string, Record<string, number>> = {
  "Fall 2025": { "8.EE.A.1": 61, "8.EE.C.7": 66, "7.NS.A.1": 72, "7.EE.A.1": 58 },
  "Spring 2026": { "8.EE.A.1": 70, "8.EE.C.7": 74, "7.NS.A.1": 79, "7.EE.A.1": 67 },
  "Fall 2026": { "8.EE.A.1": 78, "8.EE.C.7": 83, "7.NS.A.1": 85, "7.EE.A.1": 74 },
};
export const TUTORIALS: Record<string, string> = {
  "Sign error": "Integer arithmetic",
  "Operation confusion": "Integer arithmetic",
  "Distribution error": "Linear equations",
  "Order of operations": "Linear equations",
  "Forgot to divide": "Linear equations",
  "Exponent addition": "Exponent rules",
  "Multiplied exponents": "Exponent rules",
};
