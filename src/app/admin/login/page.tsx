"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/header";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Sign in failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("We couldn’t reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[70vh] bg-paper px-5 py-16">
      <div className="mx-auto max-w-md bg-white p-8 shadow-soft sm:p-10">
        <Brand />
        <p className="eyebrow mt-10">Staff access</p>
        <h1 className="mt-3 font-display text-3xl text-ink">Welcome back.</h1>
        <p className="mt-2 text-sm text-stone-500">Sign in to manage property listings and enquiries.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-xs text-stone-600">Email address<input name="email" type="email" required autoComplete="username" className="mt-2 h-12 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest" /></label>
          <label className="block text-xs text-stone-600">Password<input name="password" type="password" required autoComplete="current-password" className="mt-2 h-12 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest" /></label>
          {error && <p role="alert" className="text-xs leading-5 text-red-700">{error}</p>}
          <button disabled={busy} className="w-full bg-forest py-3.5 text-xs font-semibold text-white hover:bg-ink disabled:opacity-60">{busy ? "Signing in…" : "Sign in securely"}</button>
        </form>
        <Link href="/" className="mt-6 inline-block text-xs text-stone-500 underline underline-offset-4">Return to Makao Realty</Link>
      </div>
    </section>
  );
}
