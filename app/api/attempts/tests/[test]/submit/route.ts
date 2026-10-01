import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isTestKey } from "@/lib/constants";
import { scoreAndStore } from "@/lib/report";

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
    include: { tests: true },
  });
  const part = attempt?.tests.find((row) => row.testKey === test);
  if (!attempt || !part) {
    return NextResponse.json({ error: "No attempt." }, { status: 404 });
  }
  if (part.status !== "submitted") {
    await prisma.attemptTest.update({
      where: { id: part.id },
      data: { status: "submitted", submittedAt: new Date() },
    });
  }

  const fresh = await prisma.attemptTest.findMany({ where: { attemptId: attempt.id } });
  const allDone = fresh.every((row) => row.status === "submitted");
  if (allDone) {
    await scoreAndStore(attempt.id);
    return NextResponse.json({ attemptStatus: "complete" });
  }
  return NextResponse.json({ attemptStatus: "in_progress" });
}
