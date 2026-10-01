const base = "http://localhost:3000";
const login = await fetch(base + "/api/auth/login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    email: "counsellor@local.test",
    password: "ChangeMe123",
    role: "counsellor",
  }),
});
const cookie = login.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
const id = "cmuphrti300f3lns0tycma048";
const pdf = await fetch(base + "/api/counsellor/students/" + id + "/report", {
  headers: { cookie },
});
const buf = Buffer.from(await pdf.arrayBuffer());
console.log(pdf.status, pdf.headers.get("content-type"), pdf.headers.get("content-disposition"), buf.length, buf.subarray(0, 5).toString());
