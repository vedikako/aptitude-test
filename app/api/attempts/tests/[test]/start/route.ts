import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isTestKey } from "@/lib/constants";
import { loadTest } from "@/lib/questions";

export async function POST(_request: Request, context: { params: Promise<{ test: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "student") {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  const { test } = await context.params;
  if (!isTestKey(test)) {
    return NextResponse.json({ error: "Unknown test." }, { status: 404 });
  }

  const attempt = await prisma.attempt.findUnique({
    where: { userId: session.id },
    include: { tests: true, answers: true },
  });
  const part = attempt?.tests.find((row) => row.testKey === test);
  if (!attempt || !part) {
    return NextResponse.json({ error: "No attempt." }, { status: 404 });
  }
  if (part.status === "submitted") {
    return NextResponse.json({ error: "Already submitted." }, { status: 409 });
  }

  let deadlineAt = part.deadlineAt;
  if (!deadlineAt) {
    const minutes = loadTest(test).minutes;
    deadlineAt = new Date(Date.now() + minutes * 60 * 1000);
    await prisma.attemptTest.update({
      where: { id: part.id },
      data: { status: "in_progress", startedAt: new Date(), deadlineAt },
    });
  }

  const answers = Object.fromEntries(
    attempt.answers.filter((answer) => answer.testKey === test).map((answer) => [answer.questionId, answer.value]),
  );
  return NextResponse.json({ deadlineAt: deadlineAt.toISOString(), answers });
}
