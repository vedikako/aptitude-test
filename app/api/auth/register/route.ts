import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setSessionCookie, signSession } from "@/lib/auth";
import { ensureCounsellor } from "@/lib/seed";
import { TEST_ORDER } from "@/lib/constants";

export async function POST(request: Request) {
  await ensureCounsellor();
  const body = (await request.json()) as Record<string, string>;
  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const confirm = body.confirm ?? "";
  const phone = body.phone?.trim() ?? "";
  const school = body.school?.trim() ?? "";
  const className = body.className?.trim() || "9";
  const city = body.city?.trim() ?? "";

  if (!fullName || !email || !phone || !school || !city) {
    return NextResponse.json({ error: "Fill in every field." }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (password !== confirm) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const taken = await prisma.user.findUnique({ where: { email } });
  if (taken) {
    return NextResponse.json({ error: "That email is already registered." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      role: "student",
      profile: { create: { fullName, phone, school, className, city } },
      attempt: {
        create: {
          tests: { create: TEST_ORDER.map((testKey) => ({ testKey })) },
        },
      },
    },
  });

  const token = await signSession({ id: user.id, role: "student", name: fullName });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true }, { status: 201 });
}
