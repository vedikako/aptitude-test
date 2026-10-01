import PDFDocument from "pdfkit";
import type { Analysis } from "@/lib/scoring";
import {
  adjustmentCopy,
  aptitudeCopy,
  depthFor,
  depthWord,
  intelligenceCopy,
  intelligenceDepth,
  parentNotes,
  studentTips,
  studyCopy,
  styleCopy,
} from "@/lib/report-narrative";

const TEAL = "#115e59";
const INK = "#1c1917";
const MUTED = "#57534e";
const PAPER = "#fafaf9";
const LEFT = 48;
const WIDTH = 499;
const contents = [
  ["About this report", "3"],
  ["Study habits", "4"],
  ["Learning style", "7"],
  ["Multiple intelligence", "10"],
  ["Aptitude", "15"],
  ["Adjustment", "17"],
  ["Notes for the student", "20"],
  ["Notes for parents", "21"],
  ["How to read this report", "22"],
];

function dateLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function header(doc: PDFKit.PDFDocument, analysis: Analysis, section: string) {
  doc.rect(0, 0, doc.page.width, 28).fill(TEAL);
  doc.fillColor("#ffffff").font("Helvetica").fontSize(9);
  doc.text(analysis.student.fullName, LEFT, 9, { width: 240, lineBreak: false });
  doc.text(`Class ${analysis.student.className}`, LEFT, 9, { width: WIDTH, align: "right", lineBreak: false });
  doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(11).text(section, LEFT, 40, { width: WIDTH, lineBreak: false });
  doc.moveTo(LEFT, 58).lineTo(LEFT + WIDTH, 58).strokeColor("#d6d3d1").lineWidth(1).stroke();
  doc.x = LEFT;
  doc.y = 72;
  doc.fillColor(INK);
}

function footer(doc: PDFKit.PDFDocument, page: number) {
  const bottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc.font("Helvetica").fontSize(8).fillColor("#a8a29e");
  doc.text(String(page), LEFT, 812, { width: WIDTH, align: "center", lineBreak: false });
  doc.page.margins.bottom = bottom;
  doc.x = LEFT;
  doc.y = 72;
  doc.fillColor(INK);
}

function openPage(doc: PDFKit.PDFDocument, analysis: Analysis, section: string, page: number) {
  doc.addPage();
  header(doc, analysis, section);
  footer(doc, page);
  doc.x = LEFT;
  doc.y = 72;
}

function heading(doc: PDFKit.PDFDocument, text: string) {
  doc.font("Helvetica-Bold").fontSize(13).fillColor(TEAL).text(text, LEFT, doc.y, { width: WIDTH });
  doc.moveDown(0.35);
  doc.fillColor(INK);
}

function paragraph(doc: PDFKit.PDFDocument, text: string) {
  doc.font("Helvetica").fontSize(11).fillColor(INK).text(text, LEFT, doc.y, { width: WIDTH, lineGap: 2 });
  doc.moveDown(0.45);
}

function bullets(doc: PDFKit.PDFDocument, items: string[]) {
  doc.font("Helvetica").fontSize(11).fillColor(INK);
  for (const item of items) {
    const y = doc.y;
    doc.text("-", LEFT + 4, y, { width: 14, lineBreak: false });
    doc.text(item, LEFT + 18, y, { width: WIDTH - 18, lineGap: 1 });
    doc.moveDown(0.2);
  }
  doc.moveDown(0.35);
}

function ratingLine(doc: PDFKit.PDFDocument, text: string) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor(INK).text(text, LEFT, doc.y, { width: WIDTH });
  doc.moveDown(0.35);
}

function cover(doc: PDFKit.PDFDocument, analysis: Analysis) {
  const student = analysis.student;
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(PAPER);
  doc.rect(0, 0, doc.page.width, 300).fill(TEAL);
  doc.fillColor("#ccfbf1").font("Helvetica").fontSize(12).text("CLASS 9  -  FOUNDATION ASSESSMENT", LEFT, 78, {
    width: WIDTH,
  });
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(32).text(student.fullName, LEFT, 112, { width: WIDTH });
  doc.moveDown(0.6);
  doc.font("Helvetica").fontSize(14).text(`Class ${student.className}`, { width: WIDTH });
  doc.moveDown(0.25);
  doc.text(student.school, { width: WIDTH });
  doc.moveDown(0.25);
  doc.text(student.city, { width: WIDTH });
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(16).text("Area profile", LEFT, 360, { width: WIDTH });
  doc.moveDown(0.6);
  doc.font("Helvetica").fontSize(12).fillColor(MUTED);
  paragraph(
    doc,
    "This report describes how the student stood in study habits, learning style, multiple intelligence, aptitude, and adjustment. It is written for the counsellor to keep and to discuss with the family.",
  );
  doc.fillColor(INK).font("Helvetica").fontSize(12);
  doc.text(`Completed ${dateLabel(student.completedAt)}`, LEFT, doc.y, { width: WIDTH });
  doc.moveDown(1.2);
  doc.font("Helvetica").fontSize(11).fillColor(MUTED).text(
    "The report does not name a career, a stream, or a recommended field.",
    LEFT,
    doc.y,
    { width: WIDTH },
  );
}

function contentsPage(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "Report at a glance", page);
  paragraph(
    doc,
    "The pages follow the five tests in the order the student took them. Each area has a short meaning, the result for this student, and a few practical next steps.",
  );
  doc.moveDown(0.4);
  for (const [title, number] of contents) {
    const y = doc.y;
    doc.font("Helvetica").fontSize(12).fillColor(INK).text(title, LEFT, y, { width: 400, lineBreak: false });
    doc.font("Helvetica").fontSize(12).fillColor(TEAL).text(number, LEFT, y, {
      width: WIDTH,
      align: "right",
      lineBreak: false,
    });
    doc.moveTo(LEFT, y + 16).lineTo(LEFT + WIDTH, y + 16).strokeColor("#e7e5e4").stroke();
    doc.y = y + 28;
    doc.moveDown(0.15);
  }
}

function aboutPage(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "About this report", page);
  heading(doc, `Dear ${analysis.student.fullName.split(" ")[0] || "student"},`);
  paragraph(
    doc,
    "Class 9 is a year of new academic load and new social expectations. This profile is a snapshot of how you worked through five tests on one occasion. It is a starting point for a conversation, not a finished description of you.",
  );
  paragraph(doc, "The report is arranged so a counsellor can answer five plain questions.");
  bullets(doc, [
    "Which study habits are already steady, and which ones need a simpler routine?",
    "Does this student take in a lesson more readily by seeing it, hearing it, or doing it?",
    "Which of the eight intelligences are strongest right now, and which are quieter?",
    "How did verbal reasoning and numerical reasoning compare on the aptitude paper?",
    "Where does school life, friendship, or emotion ask for more support?",
  ]);
  paragraph(
    doc,
    "A high score is not a prize, and a quieter score is not a fault. Everyone has some of each area. The useful reading is the pattern: what to lean on while studying, and what to practise without turning it into a label.",
  );
  paragraph(
    doc,
    "No career is suggested here. Subject choices and later work depend on interest, marks, health, and the options actually available, which this test does not measure.",
  );
}

function studyResults(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "Study habits", page);
  heading(doc, "What this test looks at");
  paragraph(
    doc,
    "Study habits are the repeatable ways a student takes information in and gets it back out. This test looks at four of them: learning technique, memory, examination technique, and concentration.",
  );
  heading(doc, "Result for this student");
  for (const [index, area] of analysis.studyHabits.entries()) {
    ratingLine(doc, `${index + 1}.  ${area.label}: ${area.rating}`);
    paragraph(doc, area.sentence);
  }
  paragraph(
    doc,
    "The next pages explain each area and suggest what to keep or change. Suggestions follow the rating, so a very good area is not given the same advice as an area that needs work.",
  );
}

function pairedStudy(
  doc: PDFKit.PDFDocument,
  analysis: Analysis,
  page: number,
  keys: string[],
) {
  openPage(doc, analysis, "Study habits", page);
  for (const key of keys) {
    const area = analysis.studyHabits.find((item) => item.key === key);
    const copy = studyCopy[key];
    if (!area || !copy) continue;
    const depth = depthFor(area.rating);
    heading(doc, area.label);
    paragraph(doc, copy.meaning);
    ratingLine(doc, `Rating: ${area.rating}`);
    paragraph(doc, copy.reads[depth]);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(INK).text("What helps next", LEFT, doc.y, { width: WIDTH });
    doc.moveDown(0.3);
    bullets(doc, copy.tips[depth]);
  }
}

function styleResults(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "Learning style", page);
  heading(doc, "What this test looks at");
  paragraph(
    doc,
    "Learning style is the route through which a new idea usually lands. The three routes here are visual, auditory, and kinesthetic. Most students use all three. One of them is simply the easiest door.",
  );
  paragraph(doc, "There is no best style. The point is to study in the way that already works, and to borrow the other two when a subject does not fit the favourite route.");
  heading(doc, "Result for this student");
  const ranks = ["Primary", "Secondary", "Third"];
  analysis.learningStyle.ranked.forEach((item, index) => {
    ratingLine(doc, `${ranks[index]}: ${item.label}  (${item.points} points)`);
  });
  paragraph(doc, analysis.learningStyle.sentence);
  paragraph(
    doc,
    "The following pages describe each style. The student's own rank is marked at the top of that style, so the primary style can be used first without ignoring the other two.",
  );
}

function stylePages(doc: PDFKit.PDFDocument, analysis: Analysis, startPage: number) {
  const order = ["visual", "auditory", "kinesthetic"] as const;
  const first = order.slice(0, 2);
  openPage(doc, analysis, "Learning style", startPage);
  writeStyles(doc, analysis, first);
  openPage(doc, analysis, "Learning style", startPage + 1);
  writeStyles(doc, analysis, ["kinesthetic"]);
  paragraph(
    doc,
    "Use the primary style for the first pass through a chapter. Use the third style once a week on purpose, so a subject that arrives in the wrong form does not stay out of reach.",
  );
}

function writeStyles(doc: PDFKit.PDFDocument, analysis: Analysis, keys: string[]) {
  const ranks = ["Primary", "Secondary", "Third"];
  for (const key of keys) {
    const index = analysis.learningStyle.ranked.findIndex((item) => item.key === key);
    const item = analysis.learningStyle.ranked[index];
    const copy = styleCopy[key];
    if (!item || !copy) continue;
    heading(doc, item.label);
    ratingLine(doc, `For this student: ${ranks[index] ?? "Also noted"}`);
    paragraph(doc, copy.meaning);
    doc.font("Helvetica-Bold").fontSize(11).text("Often looks like", LEFT, doc.y, { width: WIDTH });
    doc.moveDown(0.3);
    bullets(doc, copy.traits);
    doc.font("Helvetica-Bold").fontSize(11).text("A useful way to study", LEFT, doc.y, { width: WIDTH });
    doc.moveDown(0.3);
    bullets(doc, copy.tips);
  }
}

function intelligenceIntro(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "Multiple intelligence", page);
  heading(doc, "What this inventory looks at");
  paragraph(
    doc,
    "Multiple intelligence treats ability as several channels rather than one rank. The eight channels here are people, picture, music, self, word, logic, nature, and body. A student has some of each. The scores show which channels are doing more of the work today.",
  );
  bullets(doc, [
    "A strong score is a comfortable way to learn. It is not a job title.",
    "A quieter score can rise if the student spends time on it.",
    "This is one sitting. It can change as interests and practice change.",
  ]);
  heading(doc, "Scores, strongest first");
  for (const area of analysis.intelligences) {
    const depth = intelligenceDepth(area.score ?? 0, area.max ?? 0);
    const y = doc.y;
    doc.font("Helvetica").fontSize(12).fillColor(INK).text(area.label, LEFT, y, { width: 180, lineBreak: false });
    doc.text(`${area.score} / ${area.max}`, LEFT + 190, y, { width: 120, lineBreak: false });
    doc.fillColor(TEAL).text(depthWord(depth), LEFT + 320, y, { width: 160, lineBreak: false });
    doc.y = y + 22;
  }
  doc.moveDown(0.6);
  doc.fillColor(INK);
  paragraph(
    doc,
    `The strongest channel on this sitting is ${analysis.strongest || "not available"}. The next pages take each channel in a fixed order so they can be compared from one student to another.`,
  );
}

function intelligencePairs(
  doc: PDFKit.PDFDocument,
  analysis: Analysis,
  page: number,
  keys: string[],
) {
  openPage(doc, analysis, "Multiple intelligence", page);
  for (const key of keys) {
    const area = analysis.intelligences.find((item) => item.key === key);
    const copy = intelligenceCopy[key];
    if (!area || !copy) continue;
    const depth = intelligenceDepth(area.score ?? 0, area.max ?? 0);
    heading(doc, area.label);
    ratingLine(doc, `Score: ${area.score} out of ${area.max}  -  ${depthWord(depth)}`);
    paragraph(doc, copy.meaning);
    paragraph(doc, area.sentence);
    doc.font("Helvetica-Bold").fontSize(11).text("Ways to use it", LEFT, doc.y, { width: WIDTH });
    doc.moveDown(0.25);
    bullets(doc, copy.practice.slice(0, 3));
  }
}

function aptitudeResults(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "Aptitude", page);
  heading(doc, "What this test looks at");
  paragraph(
    doc,
    "Aptitude here is split into two scores. Verbal reasoning uses words: jumble, odd-one-out, analogy, and same or opposite. Numerical reasoning uses quantities: word problems and series. A blank answer is counted as not correct.",
  );
  heading(doc, "Result for this student");
  for (const area of [analysis.aptitude.numerical, analysis.aptitude.verbal]) {
    ratingLine(doc, `${area.label} reasoning: ${area.rating} (${area.score}%)`);
    paragraph(doc, area.sentence);
  }
  paragraph(
    doc,
    "These percentages describe this paper only. They are not a school mark, and they are not a prediction of mathematics or language grades.",
  );
}

function aptitudeDetail(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "Aptitude", page);
  for (const area of [analysis.aptitude.numerical, analysis.aptitude.verbal]) {
    const copy = aptitudeCopy[area.key];
    if (!copy) continue;
    const depth = depthFor(area.rating);
    heading(doc, `${area.label} reasoning`);
    paragraph(doc, copy.meaning);
    ratingLine(doc, `Rating: ${area.rating}  -  ${area.score}% correct`);
    paragraph(doc, copy.reads[depth]);
    doc.font("Helvetica-Bold").fontSize(11).text("Practice that matches this rating", LEFT, doc.y, { width: WIDTH });
    doc.moveDown(0.3);
    bullets(doc, copy.tips[depth]);
  }
}

function adjustmentResults(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "Adjustment", page);
  heading(doc, "What this test looks at");
  paragraph(
    doc,
    "Adjustment asks how the student is coping with feelings, with school, and with other people. Unlike the other tests, a lower score is the more comfortable reading. Each yes that signals difficulty adds a point.",
  );
  heading(doc, "Result for this student");
  analysis.adjustment.forEach((area, index) => {
    ratingLine(doc, `${index + 1}.  ${area.label}: ${area.rating}  (score ${area.score})`);
    paragraph(doc, area.sentence);
  });
  paragraph(
    doc,
    "Read the bands on the next pages before comparing students. An above-average adjustment is a low difficulty count, not a high mark in the ordinary sense.",
  );
}

function adjustmentDetail(doc: PDFKit.PDFDocument, analysis: Analysis, page: number, keys: string[]) {
  openPage(doc, analysis, "Adjustment", page);
  for (const key of keys) {
    const area = analysis.adjustment.find((item) => item.key === key);
    const copy = adjustmentCopy[key];
    if (!area || !copy) continue;
    const depth = depthFor(area.rating);
    heading(doc, area.label);
    paragraph(doc, copy.meaning);
    ratingLine(doc, `Rating: ${area.rating}  -  score ${area.score}`);
    paragraph(doc, copy.rangeNote);
    paragraph(doc, copy.reads[depth]);
    doc.font("Helvetica-Bold").fontSize(11).text("What helps next", LEFT, doc.y, { width: WIDTH });
    doc.moveDown(0.25);
    bullets(doc, copy.tips[depth]);
  }
}

function studentPage(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "Notes for the student", page);
  paragraph(
    doc,
    `${analysis.student.fullName.split(" ")[0] || "You"}, these notes sit beside the scores. They are general to class 9, and they use the pattern in your own profile: lean on ${analysis.learningStyle.ranked[0]?.label ?? "your primary"} learning, and treat ${analysis.strongest || "the strongest intelligence"} as a way into harder work.`,
  );
  bullets(doc, studentTips);
}

function parentPage(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "Notes for parents", page);
  paragraph(
    doc,
    `The most useful thing a parent can do with this profile is to understand ${analysis.student.fullName}'s way of studying, and then support that way. The scores are a conversation, not a ranking against other children.`,
  );
  heading(doc, "Worth doing");
  bullets(doc, parentNotes.do);
  heading(doc, "Worth avoiding");
  bullets(doc, parentNotes.avoid);
}

function closingPage(doc: PDFKit.PDFDocument, analysis: Analysis, page: number) {
  openPage(doc, analysis, "How to read this report", page);
  paragraph(
    doc,
    "This profile is an educational snapshot. It is based only on the answers given in the five tests. It is not a medical, psychological, or clinical assessment, and it does not diagnose a condition.",
  );
  paragraph(
    doc,
    "High and low scores are not good and bad character. They describe how this student responded on this day. A later sitting can look different if habits, health, or effort have changed.",
  );
  paragraph(
    doc,
    "The counsellor may share the printed copy with the student and the parents. The student cannot download it from the test site. Nothing in these pages names a career, a stream, or a college.",
  );
  paragraph(
    doc,
    `Prepared for ${analysis.student.fullName}, class ${analysis.student.className}, ${analysis.student.school}, ${analysis.student.city}. Completed ${dateLabel(analysis.student.completedAt)}.`,
  );
}

export function analysisToPdf(analysis: Analysis) {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 64, bottom: 48, left: 48, right: 48 },
  });
  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc.info.Title = `Foundation assessment - ${analysis.student.fullName}`;
  cover(doc, analysis);
  contentsPage(doc, analysis, 2);
  aboutPage(doc, analysis, 3);
  studyResults(doc, analysis, 4);
  pairedStudy(doc, analysis, 5, ["learning", "memory"]);
  pairedStudy(doc, analysis, 6, ["examination", "concentration"]);
  styleResults(doc, analysis, 7);
  stylePages(doc, analysis, 8);
  intelligenceIntro(doc, analysis, 10);
  intelligencePairs(doc, analysis, 11, ["people", "picture"]);
  intelligencePairs(doc, analysis, 12, ["music", "self"]);
  intelligencePairs(doc, analysis, 13, ["word", "logic"]);
  intelligencePairs(doc, analysis, 14, ["nature", "body"]);
  aptitudeResults(doc, analysis, 15);
  aptitudeDetail(doc, analysis, 16);
  adjustmentResults(doc, analysis, 17);
  adjustmentDetail(doc, analysis, 18, ["emotional", "educational"]);
  adjustmentDetail(doc, analysis, 19, ["social"]);
  studentPage(doc, analysis, 20);
  parentPage(doc, analysis, 21);
  closingPage(doc, analysis, 22);

  doc.end();
  return done;
}

export function reportFileName(analysis: Analysis) {
  const day = analysis.student.completedAt.slice(0, 10);
  const name = analysis.student.fullName.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "student";
  return `Report-${name}-${day}.pdf`;
}
