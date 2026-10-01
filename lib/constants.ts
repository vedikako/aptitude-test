export const TEST_ORDER = [
  "study_habits",
  "learning_style",
  "aptitude",
  "adjustment",
  "multiple_intelligence",
] as const;

export type TestKey = (typeof TEST_ORDER)[number];

export function isTestKey(value: string): value is TestKey {
  return (TEST_ORDER as readonly string[]).includes(value);
}

export const STYLE_LABELS: Record<string, string> = {
  visual: "Visual",
  auditory: "Auditory",
  kinesthetic: "Kinesthetic",
};

export const STYLE_ORDER = ["visual", "auditory", "kinesthetic"] as const;

export const INTELLIGENCE_LABELS: Record<string, string> = {
  people: "People",
  picture: "Picture",
  music: "Music",
  self: "Self",
  word: "Word",
  logic: "Logic",
  nature: "Nature",
  body: "Body",
};

export const INTELLIGENCE_ORDER = [
  "people",
  "picture",
  "music",
  "self",
  "word",
  "logic",
  "nature",
  "body",
] as const;

export const STUDY_LABELS: Record<string, string> = {
  learning: "Learning technique",
  memory: "Memory",
  examination: "Examination technique",
  concentration: "Concentration",
};

export const ADJUST_LABELS: Record<string, string> = {
  emotional: "Emotional",
  educational: "Educational",
  social: "Social",
};
