import Link from "next/link";
import { LoginForm } from "@/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const counsellor = role === "counsellor";
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold">{counsellor ? "Counsellor login" : "Student login"}</h1>
      <p className="mt-2 text-sm text-stone-600">
        {counsellor ? "This account is fixed for the practice." : "Use the email and password you registered with."}
      </p>
      <div className="mt-6">
        <LoginForm role={counsellor ? "counsellor" : "student"} />
      </div>
      <p className="mt-6 text-sm">
        <Link href="/" className="text-teal-800 underline-offset-2 hover:underline">
          Back
        </Link>
        {counsellor ? null : (
          <>
            {" · "}
            <Link href="/register" className="text-teal-800 underline-offset-2 hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </main>
  );
}
