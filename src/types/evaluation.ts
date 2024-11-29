export const EVALUATIONS = ["Best", "Better", "Needs Improvement", "Worst"] as const;

export type Evaluation = (typeof EVALUATIONS)[number];

