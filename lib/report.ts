import { prisma } from "@/lib/db";
import { buildAnalysis, type Analysis } from "@/lib/scoring";

export async function scoreAndStore(attemptId: string) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: { answers: true, user: { include: { profile: true } }, result: true },
  });
  if (!attempt || attempt.result) return attempt?.result ?? null;
  const profile = attempt.user.profile;
  const answers = Object.fromEntries(attempt.answers.map((answer) => [answer.questionId, answer.value]));
  const completedAt = new Date();
  const analysis = buildAnalysis(answers, {
    fullName: profile?.fullName ?? "Student",
    school: profile?.school ?? "",
    className: profile?.className ?? "9",
    city: profile?.city ?? "",
    completedAt: completedAt.toISOString(),
    attemptId: attempt.id,
  });
  const [result] = await prisma.$transaction([
    prisma.result.create({
      data: { attemptId, payload: JSON.stringify(analysis) },
    }),
    prisma.attempt.update({
      where: { id: attemptId },
      data: { status: "complete", completedAt },
    }),
  ]);
  return result;
}

export function parseAnalysis(payload: string): Analysis {
  return JSON.parse(payload) as Analysis;
}
