import Link from "next/link";
import { RegisterForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold">Create a student account</h1>
      <p className="mt-2 text-sm text-stone-600">After this you can start the five tests.</p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-6 text-sm">
        <Link href="/login?role=student" className="text-teal-800 underline-offset-2 hover:underline">
          I already have an account
        </Link>
      </p>
    </main>
  );
}
