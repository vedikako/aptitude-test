import { NextResponse } from "next/server";
import { noteRequest, renderMetrics } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = performance.now();
  noteRequest(performance.now() - started, 200);
  return new NextResponse(renderMetrics(), {
    headers: { "Content-Type": "text/plain; version=0.0.4; charset=utf-8" },
  });
}
