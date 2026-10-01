import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { analysisToPdf, reportFileName } from "@/lib/report-pdf";
import { parseAnalysis } from "@/lib/report";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "counsellor") {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  const { id } = await context.params;
  const student = await prisma.user.findFirst({
    where: { id, role: "student" },
    include: { attempt: { include: { result: true } } },
  });
  if (!student?.attempt?.result) {
    return NextResponse.json({ error: "Report is not ready." }, { status: 404 });
  }
  const analysis = parseAnalysis(student.attempt.result.payload);
  const pdf = await analysisToPdf(analysis);
  const fileName = reportFileName(analysis);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
