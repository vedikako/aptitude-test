import assert from "node:assert/strict";
import { questionsIn } from "../lib/questions";
import { buildAnalysis } from "../lib/scoring";

const answers: Record<string, string> = {};
for (const question of questionsIn("aptitude")) {
  if (question.correctOptionId) answers[question.id] = question.correctOptionId;
}
for (const question of questionsIn("study_habits")) {
  answers[question.id] = question.reverse ? "rarely" : "often";
}
for (const question of questionsIn("learning_style")) {
  answers[question.id] = question.scale === "visual" && !question.reverse ? "yes" : "no";
}
for (const question of questionsIn("adjustment")) {
  answers[question.id] = "no";
}
for (const question of questionsIn("multiple_intelligence")) {
  answers[question.id] = question.scale === "people" && !question.reverse ? "agree" : "disagree";
}

const analysis = buildAnalysis(answers, {
  fullName: "Sample Student",
  school: "Amity",
  className: "9",
  city: "Navi Mumbai",
  completedAt: new Date().toISOString(),
  attemptId: "sample",
});

assert.equal(analysis.aptitude.verbal.rating, "Excellent");
assert.equal(analysis.aptitude.numerical.rating, "Excellent");
assert.ok(analysis.studyHabits.every((area) => area.rating === "Very good"));
assert.equal(analysis.learningStyle.ranked[0]?.label, "Visual");
assert.equal(analysis.intelligences[0]?.label, "People");
assert.ok(!JSON.stringify(analysis).toLowerCase().includes("career"));
console.log("scoring checks passed");
