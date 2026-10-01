import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { allTests } from "@/lib/questions";
import { scoreAndStore } from "@/lib/report";

export default async function StudentHomePage() {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login?role=student");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { profile: true, attempt: { include: { tests: true } } },
  });
  if (!user?.profile || !user.attempt) redirect("/login?role=student");

  const tests = allTests();
  const submitted = user.attempt.tests.filter((test) => test.status === "submitted").length;
  if (submitted === tests.length && user.attempt.status !== "complete") {
    await scoreAndStore(user.attempt.id);
  }
  const fresh = await prisma.attempt.findUnique({ where: { id: user.attempt.id } });
  const complete = fresh?.status === "complete";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{user.profile.fullName}</h1>
          <p className="text-sm text-stone-600">
            {user.profile.school} · Class {user.profile.className} · {user.profile.city}
          </p>
        </div>
        <LogoutButton />
      </header>

      {complete ? (
        <section className="mt-16 rounded border border-teal-200 bg-white px-6 py-10 text-center">
          <p className="text-xl font-medium">Your report has been sent to your counsellor.</p>
        </section>
      ) : (
        <>
          <p className="mt-8 text-sm text-stone-600">{submitted} of 5 tests submitted.</p>
          <ul className="mt-4 space-y-3">
            {tests.map((test) => {
              const row = user.attempt?.tests.find((item) => item.testKey === test.key);
              const status = row?.status ?? "not_started";
              const label = status === "submitted" ? "Submitted" : status === "in_progress" ? "In progress" : "Not started";
              return (
                <li key={test.key} className="flex items-center justify-between rounded border border-stone-200 bg-white px-4 py-4">
                  <div>
                    <p className="font-medium">{test.title}</p>
                    <p className="text-sm text-stone-500">
                      {test.minutes} minutes · {label}
                    </p>
                  </div>
                  {status === "submitted" ? (
                    <span className="text-sm text-stone-400">Locked</span>
                  ) : (
                    <Link href={`/student/test/${test.key}`} className="rounded bg-teal-800 px-3 py-2 text-sm text-white">
                      {status === "in_progress" ? "Continue" : "Start"}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
