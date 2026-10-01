import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseAnalysis } from "@/lib/report";

export default async function CounsellorPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "counsellor") redirect("/login?role=counsellor");
  const { q = "", status = "all" } = await searchParams;
  const query = q.trim().toLowerCase();

  const students = await prisma.user.findMany({
    where: { role: "student" },
    include: { profile: true, attempt: { include: { tests: true, result: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = students
    .map((student) => {
      const submitted = student.attempt?.tests.filter((test) => test.status === "submitted").length ?? 0;
      const complete = student.attempt?.status === "complete";
      const strongest = student.attempt?.result ? parseAnalysis(student.attempt.result.payload).strongest : "";
      return {
        id: student.id,
        name: student.profile?.fullName ?? student.email,
        school: student.profile?.school ?? "",
        className: student.profile?.className ?? "",
        city: student.profile?.city ?? "",
        submitted,
        complete,
        completedAt: student.attempt?.completedAt,
        strongest,
      };
    })
    .filter((row) => {
      if (status === "complete" && !row.complete) return false;
      if (status === "in_progress" && row.complete) return false;
      if (!query) return true;
      return row.name.toLowerCase().includes(query) || row.school.toLowerCase().includes(query);
    });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Students</h1>
        <LogoutButton />
      </header>
      <form className="mt-6 flex flex-wrap gap-3" action="/counsellor">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name or school"
          className="rounded border border-stone-300 px-3 py-2"
        />
        <select name="status" defaultValue={status} className="rounded border border-stone-300 px-3 py-2">
          <option value="all">All</option>
          <option value="in_progress">In progress</option>
          <option value="complete">Complete</option>
        </select>
        <button className="rounded bg-teal-800 px-4 py-2 text-white">Filter</button>
      </form>

      {rows.length === 0 ? (
        <p className="mt-10 text-stone-600">No students yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-300 text-stone-500">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">School</th>
                <th className="py-2 pr-3">Class</th>
                <th className="py-2 pr-3">City</th>
                <th className="py-2 pr-3">Tests</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Completed</th>
                <th className="py-2 pr-3">Strongest area</th>
                <th className="py-2">Report</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-stone-200">
                  <td className="py-3 pr-3">
                    <Link href={`/counsellor/students/${row.id}`} className="text-teal-800 underline-offset-2 hover:underline">
                      {row.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-3">{row.school}</td>
                  <td className="py-3 pr-3">{row.className}</td>
                  <td className="py-3 pr-3">{row.city}</td>
                  <td className="py-3 pr-3">{row.submitted} of 5</td>
                  <td className="py-3 pr-3">{row.complete ? "Complete" : "In progress"}</td>
                  <td className="py-3 pr-3">{row.completedAt ? row.completedAt.toLocaleDateString("en-IN") : "—"}</td>
                  <td className="py-3 pr-3">{row.strongest || "—"}</td>
                  <td className="py-3">
                    {row.complete ? (
                      <a href={`/api/counsellor/students/${row.id}/report`} className="text-teal-800 underline-offset-2 hover:underline">
                        Download
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
