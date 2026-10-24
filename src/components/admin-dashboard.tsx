"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/header";

type AdminProperty = {
  id: string;
  title: string;
  reference: string;
  location: string;
  price: number;
  status: string;
  published: boolean;
  featured: boolean;
  _count: { enquiries: number };
};
type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
  property: { title: string; reference: string } | null;
};

const inputClass = "mt-1.5 h-11 w-full border border-stone-200 px-3 text-sm outline-none focus:border-forest";

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"properties" | "enquiries">("properties");
  const [listings, setListings] = useState<AdminProperty[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(async () => {
    const [propertyResponse, enquiryResponse] = await Promise.all([fetch("/api/admin/properties"), fetch("/api/admin/enquiries")]);
    if (propertyResponse.status === 401 || enquiryResponse.status === 401) {
      router.push("/admin/login");
      return;
    }
    const propertyData = await propertyResponse.json();
    const enquiryData = await enquiryResponse.json();
    if (!propertyResponse.ok || !enquiryResponse.ok) {
      setNotice(propertyData.error || enquiryData.error || "Could not load dashboard data.");
      return;
    }
    setListings(propertyData.properties);
    setEnquiries(enquiryData.enquiries);
  }, [router]);

  useEffect(() => {
    queueMicrotask(() => void loadData());
  }, [loadData]);

  async function mutate(url: string, method: string, body?: unknown) {
    setNotice("");
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const result = await response.json();
    if (!response.ok) {
      setNotice(result.error || "That action couldn’t be completed.");
      return false;
    }
    setNotice("Changes saved.");
    await loadData();
    return true;
  }

  async function createListing(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const images = String(form.get("images") || "").split(/\r?\n|,/).map((url) => url.trim()).filter(Boolean);
    const amenities = String(form.get("amenities") || "").split(",").map((value) => value.trim()).filter(Boolean);
    const payload = {
      title: String(form.get("title")),
      location: String(form.get("location")),
      county: String(form.get("county")),
      price: Number(form.get("price")),
      category: String(form.get("category")),
      status: String(form.get("status")),
      size: String(form.get("size")),
      bedrooms: form.get("bedrooms") ? Number(form.get("bedrooms")) : null,
      bathrooms: form.get("bathrooms") ? Number(form.get("bathrooms")) : null,
      description: String(form.get("description")),
      amenities,
      images,
      featured: form.get("featured") === "on",
      published: form.get("published") === "on",
    };
    const created = await mutate("/api/admin/properties", "POST", payload);
    if (created) {
      setShowForm(false);
      formElement.reset();
    }
    setBusy(false);
  }

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <section className="min-h-[70vh] bg-paper py-10 md:py-14">
      <div className="page-shell">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><Brand /><p className="eyebrow mt-8">Makao Realty · Workspace</p><h1 className="mt-2 font-display text-3xl text-ink">Your dashboard.</h1></div>
          <button onClick={logout} className="border border-stone-300 px-4 py-2.5 text-xs font-semibold text-forest hover:bg-white">Sign out</button>
        </div>
        <div className="mt-8 flex gap-6 border-b border-stone-200">
          <button onClick={() => setTab("properties")} className={`border-b-2 pb-3 text-xs font-semibold ${tab === "properties" ? "border-gold text-forest" : "border-transparent text-stone-500"}`}>Properties ({listings.length})</button>
          <button onClick={() => setTab("enquiries")} className={`border-b-2 pb-3 text-xs font-semibold ${tab === "enquiries" ? "border-gold text-forest" : "border-transparent text-stone-500"}`}>Enquiries ({enquiries.filter((item) => item.status === "NEW").length} new)</button>
        </div>
        {notice && <p role="status" className="mt-5 border border-stone-200 bg-white px-4 py-3 text-xs text-forest">{notice}</p>}
        {tab === "properties" ? (
          <div className="mt-6">
            <div className="mb-4 flex justify-end"><button onClick={() => setShowForm(!showForm)} className="bg-forest px-4 py-3 text-xs font-semibold text-white hover:bg-ink">{showForm ? "Close form" : "Add a property"}</button></div>
            {showForm && <form onSubmit={createListing} className="mb-7 grid gap-4 bg-white p-5 shadow-soft sm:grid-cols-2 sm:p-7">
              <h2 className="font-display text-2xl text-ink sm:col-span-2">Create a listing</h2>
              <label className="text-xs text-stone-600">Title<input name="title" required minLength={3} maxLength={120} className={inputClass} /></label>
              <label className="text-xs text-stone-600">Location<input name="location" required className={inputClass} /></label>
              <label className="text-xs text-stone-600">County<input name="county" required className={inputClass} /></label>
              <label className="text-xs text-stone-600">Price (KSh)<input name="price" type="number" min="1" required className={inputClass} /></label>
              <label className="text-xs text-stone-600">Property type<select name="category" className={inputClass}><option>Land</option><option>House</option><option>Apartment</option><option>Commercial</option></select></label>
              <label className="text-xs text-stone-600">Availability<select name="status" className={inputClass}><option>For sale</option><option>For rent</option></select></label>
              <label className="text-xs text-stone-600">Size<input name="size" required placeholder="e.g. ¼ acre or 1,200 sq ft" className={inputClass} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs text-stone-600">Bedrooms<input name="bedrooms" type="number" min="0" className={inputClass} /></label>
                <label className="text-xs text-stone-600">Bathrooms<input name="bathrooms" type="number" min="0" className={inputClass} /></label>
              </div>
              <label className="text-xs text-stone-600 sm:col-span-2">Description<textarea name="description" required minLength={20} rows={3} className="mt-1.5 w-full border border-stone-200 p-3 text-sm outline-none focus:border-forest" /></label>
              <label className="text-xs text-stone-600 sm:col-span-2">Image URLs (HTTPS; one per line)<textarea name="images" required placeholder="https://example.com/property-photo.jpg" rows={2} className="mt-1.5 w-full border border-stone-200 p-3 text-sm outline-none focus:border-forest" /></label>
              <label className="text-xs text-stone-600 sm:col-span-2">Amenities (comma separated)<input name="amenities" className={inputClass} /></label>
              <div className="flex flex-wrap gap-6 text-xs text-stone-600 sm:col-span-2"><label className="flex items-center gap-2"><input name="published" type="checkbox" /> Publish listing</label><label className="flex items-center gap-2"><input name="featured" type="checkbox" /> Feature on homepage</label></div>
              <button disabled={busy} className="bg-forest px-5 py-3 text-xs font-semibold text-white disabled:opacity-60 sm:col-span-2">{busy ? "Saving…" : "Save property"}</button>
            </form>}
            <div className="overflow-x-auto bg-white shadow-soft"><table className="w-full min-w-[700px] text-left text-xs"><thead className="border-b border-stone-200 bg-white text-[10px] uppercase tracking-wider text-stone-400"><tr><th className="px-5 py-4">Property</th><th className="px-4 py-4">Price</th><th className="px-4 py-4">Visibility</th><th className="px-4 py-4">Enquiries</th><th className="px-4 py-4">Actions</th></tr></thead><tbody>
              {listings.map((item) => <tr key={item.id} className="border-b border-stone-100 last:border-0"><td className="px-5 py-4"><p className="font-semibold text-ink">{item.title}</p><p className="mt-1 text-[10px] text-stone-500">{item.location} · {item.reference}</p></td><td className="px-4 py-4 text-stone-600">KSh {new Intl.NumberFormat("en-KE").format(item.price)}</td><td className="px-4 py-4"><button onClick={() => void mutate(`/api/admin/properties/${item.id}`, "PATCH", { published: !item.published })} className={item.published ? "text-forest underline underline-offset-4" : "text-stone-400 underline underline-offset-4"}>{item.published ? "Published" : "Draft"}</button></td><td className="px-4 py-4 text-stone-600">{item._count.enquiries}</td><td className="px-4 py-4"><div className="flex gap-3"><button onClick={() => void mutate(`/api/admin/properties/${item.id}`, "PATCH", { featured: !item.featured })} className="text-forest underline underline-offset-4">{item.featured ? "Unfeature" : "Feature"}</button><button onClick={() => { if (window.confirm(`Delete ${item.title}?`)) void mutate(`/api/admin/properties/${item.id}`, "DELETE"); }} className="text-red-700 underline underline-offset-4">Delete</button></div></td></tr>)}
              {!listings.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-stone-500">No property listings yet. Add your first listing above.</td></tr>}
            </tbody></table></div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {enquiries.map((item) => <article key={item.id} className="bg-white p-5 shadow-soft"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-ink">{item.name}</p><p className="mt-1 text-xs text-stone-500">{item.email} · {item.phone}</p></div><select aria-label={`Status for enquiry from ${item.name}`} value={item.status} onChange={(event) => void mutate("/api/admin/enquiries", "PATCH", { id: item.id, status: event.target.value })} className="border border-stone-200 px-3 py-2 text-xs"><option value="NEW">New</option><option value="CONTACTED">Contacted</option><option value="CLOSED">Closed</option></select></div><p className="mt-4 whitespace-pre-line text-sm leading-6 text-stone-600">{item.message}</p><p className="mt-3 text-[10px] text-stone-400">{item.property ? `${item.property.title} · ${item.property.reference} · ` : ""}{new Date(item.createdAt).toLocaleString()}</p></article>)}
            {!enquiries.length && <p className="bg-white px-5 py-12 text-center text-sm text-stone-500">No enquiries yet. They’ll appear here when customers get in touch.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
