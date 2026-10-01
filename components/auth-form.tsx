"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ role }: { role: "student" | "counsellor" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.get("email"),
            password: form.get("password"),
            role,
          }),
        });
        const data = (await response.json()) as { error?: string };
        setPending(false);
        if (!response.ok) {
          setError(data.error ?? "Could not log in.");
          return;
        }
        router.push(role === "counsellor" ? "/counsellor" : "/student");
        router.refresh();
      }}
    >
      <label className="block text-sm">
        Email
        <input name="email" type="email" required className="mt-1 w-full rounded border border-stone-300 px-3 py-2" />
      </label>
      <label className="block text-sm">
        Password
        <input name="password" type="password" required className="mt-1 w-full rounded border border-stone-300 px-3 py-2" />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={pending} className="rounded bg-teal-800 px-4 py-2 text-white disabled:opacity-60">
        {pending ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const payload = Object.fromEntries(form.entries());
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as { error?: string };
        setPending(false);
        if (!response.ok) {
          setError(data.error ?? "Could not create the account.");
          return;
        }
        router.push("/student");
        router.refresh();
      }}
    >
      {[
        ["fullName", "Full name", "text"],
        ["email", "Email", "email"],
        ["password", "Password", "password"],
        ["confirm", "Confirm password", "password"],
        ["phone", "Phone", "tel"],
        ["school", "School", "text"],
        ["city", "City", "text"],
      ].map(([name, label, type]) => (
        <label key={name} className="block text-sm">
          {label}
          <input name={name} type={type} required className="mt-1 w-full rounded border border-stone-300 px-3 py-2" />
        </label>
      ))}
      <label className="block text-sm">
        Class
        <input name="className" defaultValue="9" required className="mt-1 w-full rounded border border-stone-300 px-3 py-2" />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={pending} className="rounded bg-teal-800 px-4 py-2 text-white disabled:opacity-60">
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
