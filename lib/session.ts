import { SignJWT, jwtVerify } from "jose";

export type SessionUser = {
  id: string;
  role: "student" | "counsellor";
  name: string;
};

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(value);
}

export async function signSession(user: SessionUser) {
  return new SignJWT({ role: user.role, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readSessionToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const role = payload.role;
    if ((role !== "student" && role !== "counsellor") || !payload.sub) {
      return null;
    }
    return {
      id: payload.sub,
      role,
      name: typeof payload.name === "string" ? payload.name : "",
    } satisfies SessionUser;
  } catch {
    return null;
  }
}
