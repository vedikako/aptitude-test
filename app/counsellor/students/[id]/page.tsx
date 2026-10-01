import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AnalysisView } from "@/components/analysis-view";
import { getSession } from "@/lib/auth";
import { TEST_ORDER } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { allTests } from "@/lib/questions";
import { parseAnalysis } from "@/lib/report";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "counsellor") redirect("/login?role=counsellor");
  const { id } = await params;

  const student = await prisma.user.findFirst({
    where: { id, role: "student" },
    include: { profile: true, attempt: { include: { tests: true, result: true } } },
  });
  if (!student?.profile || !student.attempt) notFound();

  const titles = Object.fromEntries(allTests().map((test) => [test.key, test.title]));
  const byKey = Object.fromEntries(student.attempt.tests.map((test) => [test.testKey, test.status]));
  const analysis = student.attempt.result ? parseAnalysis(student.attempt.result.payload) : null;
  const open = TEST_ORDER.filter((key) => byKey[key] !== "submitted").map((key) => titles[key]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/counsellor" className="text-sm text-teal-800 underline-offset-2 hover:underline">
        All students
      </Link>
      <header className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{student.profile.fullName}</h1>
          <p className="text-sm text-stone-600">
            {student.profile.school} · Class {student.profile.className} · {student.profile.city} · {student.profile.phone}
          </p>
        </div>
        {analysis ? (
          <a href={`/api/counsellor/students/${student.id}/report`} className="rounded bg-teal-800 px-4 py-2 text-sm text-white">
            Download report
          </a>
        ) : null}
      </header>

      <ul className="mt-6 space-y-1 text-sm">
        {TEST_ORDER.map((key) => (
          <li key={key}>
            {titles[key]}: {byKey[key] === "submitted" ? "Submitted" : byKey[key] === "in_progress" ? "In progress" : "Not started"}
          </li>
        ))}
      </ul>

      {analysis ? (
        <div className="mt-10">
          <AnalysisView analysis={analysis} />
        </div>
      ) : (
        <p className="mt-10 text-stone-700">
          Tests still open: {open.join(", ") || "waiting to score"}.
        </p>
      )}
    </main>
  );
}
