import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { noteRequest } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = performance.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    noteRequest(performance.now() - started, 200);
    return NextResponse.json({
      status: "ok",
      release: process.env.APP_RELEASE ?? "local",
    });
  } catch {
    noteRequest(performance.now() - started, 500);
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}
