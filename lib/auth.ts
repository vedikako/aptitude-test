import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { readSessionToken, signSession, type SessionUser } from "@/lib/session";

export type { SessionUser };
export { signSession, readSessionToken };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getSession() {
  const jar = await cookies();
  return readSessionToken(jar.get("session")?.value);
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete("session");
}
