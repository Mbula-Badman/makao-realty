"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function PropertySearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (category) params.set("type", category);
    if (status) params.set("status", status);
    router.push(`/properties${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={search} className="grid gap-2 rounded-sm bg-white p-3 shadow-soft sm:grid-cols-[1.25fr_1fr_1fr_auto] sm:items-center">
      <label className="flex min-h-12 items-center gap-3 border-b border-stone-200 px-3 sm:border-b-0 sm:border-r">
        <span className="sr-only">Location</span>
        <span className="text-lg text-gold">⌖</span>
        <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Where are you looking?" className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-stone-400" />
      </label>
      <label className="flex min-h-12 items-center border-b border-stone-200 px-3 sm:border-b-0 sm:border-r">
        <span className="sr-only">Property type</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full bg-transparent text-[13px] text-stone-600 outline-none">
          <option value="">Property type</option>
          <option>Land</option><option>House</option><option>Apartment</option><option>Commercial</option>
        </select>
      </label>
      <label className="flex min-h-12 items-center border-b border-stone-200 px-3 sm:border-b-0 sm:border-r">
        <span className="sr-only">Listing type</span>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full bg-transparent text-[13px] text-stone-600 outline-none">
          <option value="">Sale or rent</option><option>For sale</option><option>For rent</option>
        </select>
      </label>
      <button className="flex min-h-12 items-center justify-center gap-2 bg-forest px-6 text-[12px] font-semibold text-white transition hover:bg-ink">
        <Search size={15} /> Find a property
      </button>
    </form>
  );
}
