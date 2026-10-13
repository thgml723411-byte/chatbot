import type { StudyItem } from "@/types/study";

export const studyData: StudyItem[] = [
  {
    id: 1,
    title: "Concept Explain",
    description: "Ask AI to explain React concepts in a simple way.",
    mode: "explain",
  },
  {
    id: 2,
    title: "Make Quiz",
    description: "Create short React practice questions from your topic.",
    mode: "quiz",
  },
  {
    id: 3,
    title: "Get Hint",
    description: "Get step-by-step hints without seeing the answer first.",
    mode: "hint",
  },
];
