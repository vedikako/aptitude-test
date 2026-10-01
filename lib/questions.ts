import fs from "fs";
import path from "path";
import { TEST_ORDER, type TestKey } from "@/lib/constants";

export type Option = { id: string; label: string };

export type Question = {
  id: string;
  prompt: string;
  options: Option[];
  scale?: string;
  reverse?: boolean;
  ability?: "verbal" | "numerical";
  correctOptionId?: string;
};

export type QuestionGroup = { title: string; questions: Question[] };

export type TestFile = {
  key: TestKey;
  title: string;
  minutes: number;
  instructions: string;
  groups: QuestionGroup[];
};

const FILES: Record<TestKey, string> = {
  study_habits: "study-habits.json",
  learning_style: "learning-style.json",
  aptitude: "aptitude.json",
  adjustment: "adjustment.json",
  multiple_intelligence: "multiple-intelligence.json",
};

const cache = new Map<TestKey, TestFile>();

export function loadTest(key: TestKey): TestFile {
  const cached = cache.get(key);
  if (cached) return cached;
  const file = path.join(process.cwd(), "data", "tests", FILES[key]);
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as TestFile;
  cache.set(key, parsed);
  return parsed;
}

export function allTests() {
  return TEST_ORDER.map((key) => loadTest(key));
}

export function publicTest(key: TestKey) {
  const test = loadTest(key);
  return {
    key: test.key,
    title: test.title,
    minutes: test.minutes,
    instructions: test.instructions,
    groups: test.groups.map((group) => ({
      title: group.title,
      questions: group.questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        options: question.options,
      })),
    })),
  };
}

export function questionsIn(key: TestKey) {
  return loadTest(key).groups.flatMap((group) => group.questions);
}
