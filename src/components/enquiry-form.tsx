"use client";

import { useState } from "react";

type Props = { propertySlug?: string; propertyName?: string };

export function EnquiryForm({ propertySlug, propertyName }: Props) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setMessage("");
    setBusy(true);
    try {
      const form = new FormData(formElement);
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          message: form.get("message"),
          propertySlug,
          website: form.get("website"),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "We couldn’t send that just now. Please try again.");
        return;
      }
      formElement.reset();
      setMessage("Thank you. Your enquiry has been sent, and our team will be in touch.");
    } catch {
      setMessage("We couldn’t send that just now. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-[11px] text-stone-600">Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" className="mt-1.5 h-11 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest" /></label>
      <label className="block text-[11px] text-stone-600">Phone number<input name="phone" required minLength={7} maxLength={30} autoComplete="tel" className="mt-1.5 h-11 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest" /></label>
      <label className="block text-[11px] text-stone-600">Email address<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1.5 h-11 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest" /></label>
      <label className="block text-[11px] text-stone-600">Message<textarea name="message" required minLength={10} maxLength={2000} defaultValue={propertyName ? `Hello, I’m interested in ${propertyName}.` : ""} rows={4} className="mt-1.5 w-full resize-y border border-stone-200 px-3 py-2 text-sm outline-none focus:border-forest" /></label>
      <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button disabled={busy} className="w-full bg-forest px-4 py-3 text-xs font-semibold text-white transition hover:bg-ink disabled:opacity-60">{busy ? "Sending…" : "Send enquiry"}</button>
      <p aria-live="polite" role="status" className="text-xs leading-5 text-forest">{message}</p>
    </form>
  );
}
