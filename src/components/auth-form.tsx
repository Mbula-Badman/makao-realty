"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/header";

type Props = { mode: "login" | "register" };

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const isRegistration = mode === "register";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(isRegistration ? "/api/auth/register" : "/api/auth/customer-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          password: form.get("password"),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "We couldn’t complete that request. Please try again.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("We couldn’t reach the server. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[70vh] bg-paper px-5 py-14 md:py-20">
      <div className="mx-auto max-w-md bg-white p-7 shadow-soft sm:p-10">
        <Brand />
        <p className="eyebrow mt-9">{isRegistration ? "Your property journey" : "Welcome back"}</p>
        <h1 className="mt-3 font-display text-3xl text-ink">{isRegistration ? "Create your account." : "Sign in to Makao."}</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          {isRegistration ? "Save your details and keep your property enquiries together." : "Pick up where you left off and follow your property enquiries."}
        </p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          {isRegistration && (
            <>
              <label className="block text-xs text-stone-600">Full name<input name="name" required minLength={2} maxLength={100} autoComplete="name" className="mt-2 h-12 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest" /></label>
              <label className="block text-xs text-stone-600">Phone number <span className="text-stone-400">(optional)</span><input name="phone" type="tel" minLength={7} maxLength={30} autoComplete="tel" className="mt-2 h-12 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest" /></label>
            </>
          )}
          <label className="block text-xs text-stone-600">Email address<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-2 h-12 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest" /></label>
          <label className="block text-xs text-stone-600">Password<input name="password" type="password" required minLength={isRegistration ? 10 : 1} maxLength={128} autoComplete={isRegistration ? "new-password" : "current-password"} className="mt-2 h-12 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest" />{isRegistration && <span className="mt-1 block text-[10px] text-stone-400">Use at least 10 characters.</span>}</label>
          {error && <p role="alert" className="text-xs leading-5 text-red-700">{error}</p>}
          <button disabled={busy} className="w-full bg-forest py-3.5 text-xs font-semibold text-white transition hover:bg-ink disabled:opacity-60">{busy ? "Please wait…" : isRegistration ? "Create account" : "Sign in"}</button>
        </form>
        <p className="mt-6 text-center text-xs text-stone-500">
          {isRegistration ? "Already have an account? " : "New to Makao? "}
          <Link href={isRegistration ? "/login" : "/register"} className="font-semibold text-forest underline underline-offset-4">{isRegistration ? "Sign in" : "Create an account"}</Link>
        </p>
      </div>
    </section>
  );
}
