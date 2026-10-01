import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSessionToken(request.cookies.get("session")?.value);

  if (pathname.startsWith("/student")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?role=student", request.url));
    }
    if (session.role !== "student") {
      return NextResponse.redirect(new URL("/counsellor", request.url));
    }
  }

  if (pathname.startsWith("/counsellor")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?role=counsellor", request.url));
    }
    if (session.role !== "counsellor") {
      return NextResponse.redirect(new URL("/student", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student", "/student/:path*", "/counsellor", "/counsellor/:path*"],
};
