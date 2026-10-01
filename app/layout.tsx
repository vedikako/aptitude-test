import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { noteRequest } from "@/lib/metrics";
import { ensureCounsellor } from "@/lib/seed";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foundation assessment",
  description: "Class 9 assessment for students and their counsellor.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const started = performance.now();
  try {
    await ensureCounsellor();
    noteRequest(performance.now() - started, 200);
  } catch (error) {
    noteRequest(performance.now() - started, 500);
    throw error;
  }
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen bg-stone-50 text-stone-900 antialiased`}>{children}</body>
    </html>
  );
}
