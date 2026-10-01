import Link from "next/link";
import { redirect } from "next/navigation";
import { StartTest, TestRunner } from "@/components/test-runner";
import { getSession } from "@/lib/auth";
import { isTestKey } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { publicTest, questionsIn } from "@/lib/questions";

export default async function TestPage({ params }: { params: Promise<{ test: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login?role=student");
  const { test } = await params;
  if (!isTestKey(test)) redirect("/student");

  const attempt = await prisma.attempt.findUnique({
    where: { userId: session.id },
    include: { tests: true, answers: true },
  });
  const part = attempt?.tests.find((row) => row.testKey === test);
  if (!attempt || !part || part.status === "submitted") redirect("/student");

  const content = publicTest(test);
  const count = questionsIn(test).length;

  if (part.status === "not_started" || !part.deadlineAt) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/student" className="text-sm text-teal-800 underline-offset-2 hover:underline">
          Back
        </Link>
        <h1 className="mt-4 text-3xl font-semibold">{content.title}</h1>
        <p className="mt-4 text-stone-700">{content.instructions}</p>
        <p className="mt-3 text-sm text-stone-500">
          {count} questions · {content.minutes} minutes. The clock starts when you press Start.
        </p>
        <div className="mt-8">
          <StartTest testKey={test} />
        </div>
      </main>
    );
  }

  const initialAnswers = Object.fromEntries(
    attempt.answers.filter((answer) => answer.testKey === test).map((answer) => [answer.questionId, answer.value]),
  );

  return (
    <TestRunner
      testKey={test}
      title={content.title}
      groups={content.groups}
      deadlineAt={part.deadlineAt.toISOString()}
      initialAnswers={initialAnswers}
    />
  );
}
