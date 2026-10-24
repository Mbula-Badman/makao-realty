"use client";

import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { propertyCategories, type Property } from "@/lib/properties";
import { PropertyCard } from "@/components/property-card";

export function PropertyBrowser({ properties }: { properties: Property[] }) {
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("type") || "All properties");
  const [status, setStatus] = useState(params.get("status") || "Any status");
  const [location, setLocation] = useState(params.get("location") || "");
  const [sort, setSort] = useState("Featured first");
  const [view, setView] = useState<"grid" | "list">("grid");

  const visible = useMemo(() => {
    const filtered = properties.filter((property) => {
      const matchesCategory = category === "All properties" || property.category === category;
      const matchesStatus = status === "Any status" || property.status === status;
      const matchesLocation = !location || `${property.location} ${property.county}`.toLowerCase().includes(location.toLowerCase());
      return matchesCategory && matchesStatus && matchesLocation;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "Price: low to high") return a.price - b.price;
      if (sort === "Price: high to low") return b.price - a.price;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [category, location, properties, sort, status]);

  return (
    <>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-stone-500"><span className="font-semibold text-ink">{visible.length}</span> thoughtfully selected properties</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="listing-status">Availability</label>
          <select id="listing-status" value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 border border-stone-200 bg-white px-3 text-xs text-stone-600">
            <option>Any status</option><option>For sale</option><option>For rent</option>
          </select>
          <label className="sr-only" htmlFor="listing-sort">Sort properties</label>
          <select id="listing-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 border border-stone-200 bg-white px-3 text-xs text-stone-600">
            <option>Featured first</option><option>Price: low to high</option><option>Price: high to low</option>
          </select>
          <button onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`grid h-10 w-10 place-items-center border ${view === "grid" ? "border-forest bg-forest text-white" : "border-stone-200 text-stone-500"}`}><Grid2X2 size={16} /></button>
          <button onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`grid h-10 w-10 place-items-center border ${view === "list" ? "border-forest bg-forest text-white" : "border-stone-200 text-stone-500"}`}><List size={16} /></button>
        </div>
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {propertyCategories.map((item) => (
          <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-[11px] transition ${category === item ? "border-forest bg-forest text-white" : "border-stone-200 text-stone-600 hover:border-forest"}`}>{item}</button>
        ))}
        <label className="ml-auto flex min-w-[180px] items-center gap-2 border-b border-stone-300 px-2 text-stone-500">
          <SlidersHorizontal size={14} /><span className="sr-only">Filter by location</span>
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Filter by location" className="w-full bg-transparent py-2 text-xs outline-none placeholder:text-stone-400" />
        </label>
      </div>
      {visible.length ? (
        <div className={view === "grid" ? "grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-8 md:grid-cols-2"}>
          {visible.map((property) => <PropertyCard key={property.slug} property={property} />)}
        </div>
      ) : (
        <div className="border border-dashed border-stone-300 py-20 text-center">
          <p className="font-display text-2xl text-ink">Nothing quite like that yet.</p>
          <p className="mt-3 text-sm text-stone-500">Try broadening your search or choosing a different category.</p>
          <button onClick={() => { setCategory("All properties"); setStatus("Any status"); setLocation(""); }} className="mt-5 text-xs font-semibold text-forest underline underline-offset-4">Clear filters</button>
        </div>
      )}
      <p className="mt-10 text-center text-[11px] leading-5 text-stone-400">Listings shown are illustrative demo content and are not confirmed offers. Please enquire to verify availability and property details.</p>
    </>
  );
}
