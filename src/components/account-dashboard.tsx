"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Enquiry = {
  id: string;
  message: string;
  status: string;
  createdAt: Date;
  property: { title: string; slug: string; reference: string } | null;
};

export function AccountDashboard({
  name,
  email,
  enquiries,
}: {
  name: string;
  email: string;
  enquiries: Enquiry[];
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <section className="min-h-[70vh] bg-paper py-12 md:py-16">
      <div className="page-shell">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="eyebrow">Your Makao account</p>
            <h1 className="mt-3 font-display text-4xl tracking-[-.04em] text-ink">Hello, {name}.</h1>
            <p className="mt-2 text-sm text-stone-500">{email}</p>
          </div>
          <button onClick={logout} className="border border-stone-300 px-4 py-2.5 text-xs font-semibold text-forest hover:bg-white">Sign out</button>
        </div>

        <div className="mt-10 bg-white p-6 shadow-soft md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
            <div><p className="eyebrow">Your conversations</p><h2 className="mt-2 font-display text-2xl text-ink">Property enquiries</h2></div>
            <Link href="/properties" className="text-xs font-semibold text-forest underline underline-offset-4">Explore properties</Link>
          </div>
          {enquiries.length ? (
            <div className="divide-y divide-stone-100">
              {enquiries.map((enquiry) => (
                <article key={enquiry.id} className="py-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {enquiry.property ? (
                      <Link href={`/properties/${enquiry.property.slug}`} className="text-sm font-semibold text-ink hover:text-forest">{enquiry.property.title} <span className="ml-1 text-[10px] font-normal text-stone-400">· {enquiry.property.reference}</span></Link>
                    ) : <p className="text-sm font-semibold text-ink">General enquiry</p>}
                    <span className="text-[10px] uppercase tracking-wider text-stone-500">{enquiry.status.toLowerCase()}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-xs leading-5 text-stone-600">{enquiry.message}</p>
                  <p className="mt-2 text-[10px] text-stone-400">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="font-display text-2xl text-ink">Your next chapter starts somewhere.</p>
              <p className="mt-2 text-sm text-stone-500">You haven’t sent any enquiries yet. Browse properties to find a place that feels right.</p>
              <Link href="/properties" className="mt-5 inline-block bg-forest px-5 py-3 text-xs font-semibold text-white hover:bg-ink">Browse properties</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
