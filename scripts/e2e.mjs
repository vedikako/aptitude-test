import fs from "fs";
import path from "path";

const base = "http://localhost:3000";
const cookies = new Map();

function store(res) {
  for (const c of res.headers.getSetCookie()) {
    const [pair] = c.split(";");
    const i = pair.indexOf("=");
    cookies.set(pair.slice(0, i), pair.slice(i + 1));
  }
}

function headers(json) {
  const h = { cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join("; ") };
  if (json) h["content-type"] = "application/json";
  return h;
}

async function send(url, opts = {}) {
  const res = await fetch(base + url, {
    ...opts,
    headers: { ...headers(Boolean(opts.body)), ...(opts.headers || {}) },
  });
  store(res);
  const text = await res.text();
  let data = text;
  try {
    data = JSON.parse(text);
  } catch {
    data = text.slice(0, 180);
  }
  return { status: res.status, data, type: res.headers.get("content-type"), res };
}

const email = `student${Date.now()}@example.com`;
const registered = await send("/api/auth/register", {
  method: "POST",
  body: JSON.stringify({
    fullName: "Asha Rao",
    email,
    password: "password12",
    confirm: "password12",
    phone: "9000000000",
    school: "Amity",
    className: "9",
    city: "Navi Mumbai",
  }),
});
if (registered.status !== 201) {
  console.log("register failed", registered);
  process.exit(1);
}

const tests = [
  "study_habits",
  "learning_style",
  "aptitude",
  "adjustment",
  "multiple_intelligence",
];
const files = {
  study_habits: "study-habits.json",
  learning_style: "learning-style.json",
  aptitude: "aptitude.json",
  adjustment: "adjustment.json",
  multiple_intelligence: "multiple-intelligence.json",
};

for (const key of tests) {
  const start = await send(`/api/attempts/tests/${key}/start`, { method: "POST" });
  if (start.status !== 200) {
    console.log("start failed", key, start);
    process.exit(1);
  }
  const file = JSON.parse(fs.readFileSync(path.join("data/tests", files[key]), "utf8"));
  const questions = file.groups.flatMap((group) => group.questions);
  for (const question of questions) {
    const value =
      question.correctOptionId ||
      question.options[question.reverse ? question.options.length - 1 : 0].id;
    const saved = await send("/api/attempts/answers", {
      method: "PATCH",
      body: JSON.stringify({ testKey: key, questionId: question.id, value }),
    });
    if (saved.status !== 200) {
      console.log("save failed", question.id, saved);
      process.exit(1);
    }
  }
  const done = await send(`/api/attempts/tests/${key}/submit`, { method: "POST" });
  console.log("submitted", key, done.status, done.data.attemptStatus);
}

const home = await send("/student");
console.log("student home has message", String(home.data).includes("sent to your counsellor"));
console.log("student home hides scores", !String(home.data).includes("Very good"));

const blocked = await send("/api/counsellor/students/someone/report");
console.log("student pdf status", blocked.status);

await send("/api/auth/logout", { method: "POST" });
const login = await send("/api/auth/login", {
  method: "POST",
  body: JSON.stringify({
    email: "counsellor@local.test",
    password: "ChangeMe123",
    role: "counsellor",
  }),
});
console.log("counsellor login", login.status, login.data.role);

const list = await send("/counsellor");
const html = String(list.data);
console.log("list", list.status, html.includes("Asha Rao"));
const idMatch = html.match(/\/counsellor\/students\/([a-z0-9]+)/i);
if (!idMatch) {
  console.log("no student id");
  process.exit(1);
}
const pdfRes = await fetch(`${base}/api/counsellor/students/${idMatch[1]}/report`, { headers: headers(false) });
const buf = Buffer.from(await pdfRes.arrayBuffer());
console.log("pdf", pdfRes.status, pdfRes.headers.get("content-type"), buf.length, buf.subarray(0, 5).toString());
const detail = await send(`/counsellor/students/${idMatch[1]}`);
console.log("detail has analysis", String(detail.data).includes("Study habits"), String(detail.data).includes("Download report"));
