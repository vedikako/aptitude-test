import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isTestKey } from "@/lib/constants";
import { questionsIn } from "@/lib/questions";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "student") {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  const body = (await request.json()) as { testKey?: string; questionId?: string; value?: string };
  if (!body.testKey || !isTestKey(body.testKey) || !body.questionId || !body.value) {
    return NextResponse.json({ error: "Missing answer." }, { status: 400 });
  }

  const question = questionsIn(body.testKey).find((item) => item.id === body.questionId);
  if (!question || !question.options.some((option) => option.id === body.value)) {
    return NextResponse.json({ error: "Unknown answer." }, { status: 400 });
  }

  const attempt = await prisma.attempt.findUnique({
    where: { userId: session.id },
    include: { tests: true },
  });
  const part = attempt?.tests.find((test) => test.testKey === body.testKey);
  if (!attempt || !part || part.status === "submitted") {
    return NextResponse.json({ error: "This test is closed." }, { status: 409 });
  }
  if (!part.deadlineAt || part.deadlineAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Time is up." }, { status: 409 });
  }

  await prisma.answer.upsert({
    where: { attemptId_questionId: { attemptId: attempt.id, questionId: body.questionId } },
    create: {
      attemptId: attempt.id,
      testKey: body.testKey,
      questionId: body.questionId,
      value: body.value,
    },
    update: { value: body.value },
  });
  return NextResponse.json({ ok: true });
}
