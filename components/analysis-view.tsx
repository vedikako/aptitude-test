import type { Analysis } from "@/lib/scoring";

export function AnalysisView({ analysis }: { analysis: Analysis }) {
  const date = new Date(analysis.student.completedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const place = ["Primary", "Secondary", "Third"];

  return (
    <article className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold">{analysis.student.fullName}</h2>
        <p className="text-stone-600">
          Class {analysis.student.className} · {analysis.student.school} · {analysis.student.city}
        </p>
        <p className="text-sm text-stone-500">Completed {date}</p>
      </header>

      <section>
        <h3 className="text-lg font-semibold">Study habits</h3>
        <ul className="mt-3 space-y-3">
          {analysis.studyHabits.map((area) => (
            <li key={area.key}>
              <p className="font-medium">
                {area.label}: {area.rating}
              </p>
              <p className="text-sm text-stone-700">{area.sentence}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Learning style</h3>
        <p className="mt-3 text-sm">
          {analysis.learningStyle.ranked.map((item, index) => `${place[index]}: ${item.label}`).join(" · ")}
        </p>
        <p className="mt-1 text-sm text-stone-700">{analysis.learningStyle.sentence}</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Aptitude</h3>
        <ul className="mt-3 space-y-3">
          {[analysis.aptitude.verbal, analysis.aptitude.numerical].map((area) => (
            <li key={area.key}>
              <p className="font-medium">
                {area.label}: {area.rating} ({area.score}%)
              </p>
              <p className="text-sm text-stone-700">{area.sentence}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Adjustment</h3>
        <ul className="mt-3 space-y-3">
          {analysis.adjustment.map((area) => (
            <li key={area.key}>
              <p className="font-medium">
                {area.label}: {area.rating}
              </p>
              <p className="text-sm text-stone-700">{area.sentence}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Multiple intelligence</h3>
        <p className="mt-2 text-sm text-stone-600">Strongest first.</p>
        <ul className="mt-3 space-y-3">
          {analysis.intelligences.map((area) => (
            <li key={area.key}>
              <p className="font-medium">
                {area.label}: {area.score} out of {area.max}
              </p>
              <p className="text-sm text-stone-700">{area.sentence}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
