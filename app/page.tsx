import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-teal-800">Class 9</p>
      <h1 className="mt-2 text-4xl font-semibold">Foundation assessment</h1>
      <p className="mt-4 text-stone-600">
        Students complete five tests. The counsellor receives the analysis. Students do not see their scores.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link href="/login?role=student" className="rounded bg-teal-800 px-4 py-3 text-center text-white">
          Student login
        </Link>
        <Link href="/login?role=counsellor" className="rounded border border-teal-800 px-4 py-3 text-center text-teal-900">
          Counsellor login
        </Link>
        <Link href="/register" className="text-center text-sm text-teal-800 underline-offset-2 hover:underline">
          Create student account
        </Link>
      </div>
    </main>
  );
}
