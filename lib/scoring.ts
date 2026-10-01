import fs from "fs";
import path from "path";
import {
  ADJUST_LABELS,
  INTELLIGENCE_LABELS,
  INTELLIGENCE_ORDER,
  STUDY_LABELS,
  STYLE_LABELS,
  STYLE_ORDER,
} from "@/lib/constants";
import { allTests, type Question } from "@/lib/questions";

type Band = { max: number; label: string };

type BandsFile = {
  studyHabits: Band[];
  aptitude: Band[];
  adjustment: Record<string, Band[]>;
};

export type AreaScore = {
  key: string;
  label: string;
  rating: string;
  sentence: string;
  score?: number;
  max?: number;
};

export type Analysis = {
  student: {
    fullName: string;
    school: string;
    className: string;
    city: string;
    completedAt: string;
    attemptId: string;
  };
  studyHabits: AreaScore[];
  learningStyle: {
    ranked: { key: string; label: string; points: number }[];
    sentence: string;
  };
  aptitude: {
    verbal: AreaScore;
    numerical: AreaScore;
  };
  adjustment: AreaScore[];
  intelligences: AreaScore[];
  strongest: string;
};

function bands(): BandsFile {
  const file = path.join(process.cwd(), "data", "bands.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as BandsFile;
}

function bandLabel(list: Band[], value: number) {
  const found = list.find((item) => value <= item.max);
  return found?.label ?? list[list.length - 1]?.label ?? "Average";
}

function pointsFor(question: Question, value: string | undefined) {
  if (!value) return null;
  if (question.options.some((option) => option.id === "agree")) {
    const map: Record<string, number> = { agree: 2, neutral: 1, disagree: 0 };
    const raw = map[value];
    if (raw === undefined) return null;
    return question.reverse ? 2 - raw : raw;
  }
  const positive = value === "yes" || value === "often";
  const raw = positive ? 1 : 0;
  return question.reverse ? 1 - raw : raw;
}

function answeredPoints(questions: Question[], answers: Record<string, string>) {
  const byScale = new Map<string, { points: number; count: number; maxEach: number }>();
  for (const question of questions) {
    const scale = question.scale;
    if (!scale) continue;
    const point = pointsFor(question, answers[question.id]);
    if (point === null) continue;
    const maxEach = question.options.some((option) => option.id === "agree") ? 2 : 1;
    const current = byScale.get(scale) ?? { points: 0, count: 0, maxEach };
    current.points += point;
    current.count += 1;
    current.maxEach = maxEach;
    byScale.set(scale, current);
  }
  return byScale;
}

function studySentence(label: string, rating: string) {
  if (rating === "Very good" || rating === "Good") {
    return `${label} is a steady part of how this student studies.`;
  }
  if (rating === "Average") {
    return `${label} is mixed. Some useful habits are there, and some still slip.`;
  }
  return `${label} is the area that would help most from a simpler daily routine.`;
}

function styleSentence(label: string) {
  if (label === "Visual") {
    return "This student takes in new ideas most readily through pictures, layout, and things they can see.";
  }
  if (label === "Auditory") {
    return "This student takes in new ideas most readily by listening and talking them through.";
  }
  return "This student takes in new ideas most readily by doing, moving, and trying the task.";
}

function aptitudeSentence(label: string, rating: string) {
  if (rating === "Excellent" || rating === "Above average") {
    return `${label} reasoning is a clear strength on this test.`;
  }
  if (rating === "Average") {
    return `${label} reasoning is in the middle of this test. Practice will move it more than talent talk will.`;
  }
  return `${label} reasoning needs more careful practice before it feels comfortable.`;
}

function adjustmentSentence(label: string, rating: string) {
  if (rating === "Above average") {
    return `${label} adjustment looks settled. The student is handling this part of school life with some ease.`;
  }
  if (rating === "Average") {
    return `${label} adjustment is ordinary for this age. Some situations still take extra effort.`;
  }
  return `${label} adjustment is the tighter area. It is worth a calm conversation, not a label.`;
}

function intelligenceSentence(label: string, score: number, max: number) {
  const ratio = max === 0 ? 0 : score / max;
  if (ratio >= 0.7) {
    return `${label} stands out as a natural way this student likes to work and learn.`;
  }
  if (ratio >= 0.45) {
    return `${label} is present, without being the main way this student approaches things.`;
  }
  return `${label} is quieter right now. It can still grow if the student spends time on it.`;
}

export function buildAnalysis(
  answers: Record<string, string>,
  student: Analysis["student"],
): Analysis {
  const file = bands();
  const tests = Object.fromEntries(allTests().map((test) => [test.key, test]));

  const studyQuestions = tests.study_habits.groups.flatMap((group) => group.questions);
  const study = answeredPoints(studyQuestions, answers);
  const studyHabits = Object.keys(STUDY_LABELS).map((key) => {
    const row = study.get(key);
    const percent = !row || row.count === 0 ? 0 : Math.round((row.points / (row.count * row.maxEach)) * 100);
    const rating = bandLabel(file.studyHabits, percent);
    const label = STUDY_LABELS[key];
    return { key, label, rating, sentence: studySentence(label, rating) };
  });

  const styleQuestions = tests.learning_style.groups.flatMap((group) => group.questions);
  const styles = answeredPoints(styleQuestions, answers);
  const ranked = STYLE_ORDER.map((key) => ({
    key,
    label: STYLE_LABELS[key],
    points: styles.get(key)?.points ?? 0,
  })).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return STYLE_ORDER.indexOf(a.key as (typeof STYLE_ORDER)[number]) -
      STYLE_ORDER.indexOf(b.key as (typeof STYLE_ORDER)[number]);
  });

  const aptitudeQuestions = tests.aptitude.groups.flatMap((group) => group.questions);
  function ability(kind: "verbal" | "numerical"): AreaScore {
    const items = aptitudeQuestions.filter((question) => question.ability === kind);
    const correct = items.filter((question) => answers[question.id] && answers[question.id] === question.correctOptionId).length;
    const percent = items.length === 0 ? 0 : Math.round((correct / items.length) * 100);
    const rating = bandLabel(file.aptitude, percent);
    const label = kind === "verbal" ? "Verbal" : "Numerical";
    return {
      key: kind,
      label,
      rating,
      score: percent,
      max: 100,
      sentence: aptitudeSentence(label, rating),
    };
  }

  const adjustQuestions = tests.adjustment.groups.flatMap((group) => group.questions);
  const adjustmentScores = new Map<string, number>();
  for (const question of adjustQuestions) {
    const point = pointsFor(question, answers[question.id]);
    if (point === null || !question.scale) continue;
    adjustmentScores.set(question.scale, (adjustmentScores.get(question.scale) ?? 0) + point);
  }
  const adjustment = Object.keys(ADJUST_LABELS).map((key) => {
    const score = adjustmentScores.get(key) ?? 0;
    const rating = bandLabel(file.adjustment[key] ?? [], score);
    const label = ADJUST_LABELS[key];
    return { key, label, rating, score, sentence: adjustmentSentence(label, rating) };
  });

  const miQuestions = tests.multiple_intelligence.groups.flatMap((group) => group.questions);
  const mi = new Map<string, { score: number; max: number }>();
  for (const question of miQuestions) {
    if (!question.scale) continue;
    const current = mi.get(question.scale) ?? { score: 0, max: 0 };
    current.max += 2;
    const point = pointsFor(question, answers[question.id]);
    if (point !== null) current.score += point;
    mi.set(question.scale, current);
  }
  const intelligences = INTELLIGENCE_ORDER.map((key) => {
    const row = mi.get(key) ?? { score: 0, max: 0 };
    const label = INTELLIGENCE_LABELS[key];
    return {
      key,
      label,
      rating: `${row.score}`,
      score: row.score,
      max: row.max,
      sentence: intelligenceSentence(label, row.score, row.max),
    };
  }).sort((a, b) => {
    if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0);
    return INTELLIGENCE_ORDER.indexOf(a.key as (typeof INTELLIGENCE_ORDER)[number]) -
      INTELLIGENCE_ORDER.indexOf(b.key as (typeof INTELLIGENCE_ORDER)[number]);
  });

  return {
    student,
    studyHabits,
    learningStyle: {
      ranked,
      sentence: styleSentence(ranked[0]?.label ?? "Visual"),
    },
    aptitude: { verbal: ability("verbal"), numerical: ability("numerical") },
    adjustment,
    intelligences,
    strongest: intelligences[0] ? `${intelligences[0].label} intelligence` : "",
  };
}
