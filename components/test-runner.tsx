"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type PublicQuestion = { id: string; prompt: string; options: { id: string; label: string }[] };
type PublicGroup = { title: string; questions: PublicQuestion[] };

function numberGroups(groups: PublicGroup[]) {
  let number = 0;
  return groups.map((group) => ({
    title: group.title,
    questions: group.questions.map((question) => {
      number += 1;
      return { ...question, number };
    }),
  }));
}

export function StartTest({ testKey }: { testKey: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <div>
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      <button
        type="button"
        disabled={pending}
        className="rounded bg-teal-800 px-4 py-2 text-white disabled:opacity-60"
        onClick={async () => {
          setPending(true);
          setError("");
          const response = await fetch(`/api/attempts/tests/${testKey}/start`, { method: "POST" });
          const data = (await response.json()) as { error?: string };
          setPending(false);
          if (!response.ok) {
            setError(data.error ?? "Could not start this test.");
            return;
          }
          router.refresh();
        }}
      >
        {pending ? "Starting…" : "Start"}
      </button>
    </div>
  );
}

export function TestRunner({
  testKey,
  title,
  groups,
  deadlineAt,
  initialAnswers,
}: {
  testKey: string;
  title: string;
  groups: PublicGroup[];
  deadlineAt: string;
  initialAnswers: Record<string, string>;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState(initialAnswers);
  const [failed, setFailed] = useState<string | null>(null);
  const [left, setLeft] = useState(() => Math.max(0, new Date(deadlineAt).getTime() - Date.now()));
  const [submitting, setSubmitting] = useState(false);
  const submitted = useRef(false);
  const numbered = numberGroups(groups);
  const questions = numbered.flatMap((group) => group.questions);
  const answered = questions.filter((question) => answers[question.id]).length;

  async function submit(forced = false) {
    if (submitted.current) return;
    const blanks = questions.filter((question) => !answers[question.id]).length;
    if (!forced && blanks > 0 && !window.confirm(`${blanks} questions are still blank. Submit anyway?`)) {
      return;
    }
    submitted.current = true;
    setSubmitting(true);
    await fetch(`/api/attempts/tests/${testKey}/submit`, { method: "POST" });
    router.push("/student");
    router.refresh();
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      const remaining = new Date(deadlineAt).getTime() - Date.now();
      setLeft(Math.max(0, remaining));
      if (remaining <= 0) {
        window.clearInterval(timer);
        void submit(true);
      }
    }, 1000);
    return () => window.clearInterval(timer);
    // submit is stable enough for the deadline of this page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadlineAt]);

  const minutes = Math.floor(left / 60000);
  const seconds = Math.floor((left % 60000) / 1000);

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-stone-200 bg-stone-50 px-4 py-3">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-stone-600">
            {answered} of {questions.length} answered
          </p>
        </div>
        <p className="font-mono text-lg">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </p>
        <button
          type="button"
          disabled={submitting}
          onClick={() => void submit(false)}
          className="rounded bg-teal-800 px-4 py-2 text-white disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-6">
        {numbered.map((group) => (
          <section key={group.title}>
            {numbered.length > 1 ? <h2 className="mb-4 text-lg font-semibold">{group.title}</h2> : null}
            <ol className="space-y-6">
              {group.questions.map((question) => (
                <li key={question.id} className="rounded border border-stone-200 bg-white p-4">
                  <p className="font-medium">
                    {question.number}. {question.prompt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {question.options.map((option) => (
                      <label key={option.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={question.id}
                          checked={answers[question.id] === option.id}
                          onChange={async () => {
                            setAnswers((current) => ({ ...current, [question.id]: option.id }));
                            setFailed(null);
                            const response = await fetch("/api/attempts/answers", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ testKey, questionId: question.id, value: option.id }),
                            });
                            if (!response.ok) setFailed(question.id);
                          }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {failed === question.id ? <p className="mt-2 text-sm text-red-700">Not saved</p> : null}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
