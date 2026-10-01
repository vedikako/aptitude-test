import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

let seeded = false;

export async function ensureCounsellor() {
  if (seeded) return;
  const email = process.env.COUNSELLOR_EMAIL?.trim().toLowerCase();
  const password = process.env.COUNSELLOR_PASSWORD;
  if (!email || !password) {
    throw new Error("COUNSELLOR_EMAIL and COUNSELLOR_PASSWORD must be set");
  }
  const existing = await prisma.user.findFirst({ where: { role: "counsellor" } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        role: "counsellor",
      },
    });
  }
  seeded = true;
}
