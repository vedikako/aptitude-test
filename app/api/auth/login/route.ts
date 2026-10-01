import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { ensureCounsellor } from "@/lib/seed";

export async function POST(request: Request) {
  await ensureCounsellor();
  const body = (await request.json()) as { email?: string; password?: string; role?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const role = body.role === "counsellor" ? "counsellor" : "student";

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }
  if (user.role !== role) {
    return NextResponse.json({ error: "Use the matching login." }, { status: 403 });
  }

  const name = user.profile?.fullName ?? "Counsellor";
  const token = await signSession({
    id: user.id,
    role: user.role as "student" | "counsellor",
    name,
  });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, role: user.role });
}
