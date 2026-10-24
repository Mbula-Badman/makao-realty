import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import { PropertySearch } from "@/components/property-search";
import { PropertyCard } from "@/components/property-card";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getProperties } from "@/lib/property-source";

const categories = [
  { name: "Land", copy: "A place to put down roots.", image: "photo-1500382017468-9049fed747ef", query: "Land" },
  { name: "Homes", copy: "Room for the life you imagine.", image: "photo-1600607687939-ce8a6c25118c", query: "House" },
  { name: "Apartments", copy: "A considered city address.", image: "photo-1600566753086-00f18fb6b3ea", query: "Apartment" },
  { name: "Commercial", copy: "Space for what comes next.", image: "photo-1497366754035-f200968a6e72", query: "Commercial" },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allProperties = await getProperties();
  const featured = allProperties.filter((property) => property.featured).slice(0, 3);
  return (
    <>
      <section className="relative min-h-[650px] overflow-hidden bg-forest md:min-h-[690px]">
        <Image src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90" alt="Sunlit contemporary home framed by greenery" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#112927]/85 via-[#112927]/45 to-[#112927]/5" />
        <div className="page-shell relative flex min-h-[650px] flex-col justify-center pb-24 pt-24 md:min-h-[690px]">
          <div className="max-w-[660px]">
            <p className="eyebrow !text-[#e4c795]">A place to call your own</p>
            <h1 className="mt-6 font-display text-[clamp(3.2rem,8vw,6.25rem)] leading-[.99] tracking-[-.055em] text-white">
              Find your perfect property<span className="text-[#d3b277]">.</span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-7 text-white/75 md:text-base">
              Discover land, homes, and investment opportunities you can trust.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-semibold text-forest transition hover:bg-[#f1eadc]">Create your account <ArrowRight size={14} /></Link>
              <Link href="/properties" className="inline-flex items-center border border-white/50 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/10">Browse properties</Link>
            </div>
          </div>
          <div className="mt-10 max-w-[860px]">
            <PropertySearch />
            <p className="mt-3 text-[10px] text-white/55">Every journey starts with a conversation. We’re here to help you find the right fit.</p>
          </div>
          <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-[10px] uppercase tracking-[.18em] text-white/70 md:flex">
            <span className="h-px w-10 bg-gold" /> Nairobi · Coast · Beyond
          </div>
        </div>
      </section>

      <section className="page-shell py-20 md:py-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="eyebrow">A thoughtful collection</p><h2 className="section-title mt-4 max-w-xl">Places with a little more possibility.</h2></div>
          <Link href="/properties" className="inline-flex items-center gap-2 pb-1 text-xs font-semibold text-forest">Explore all properties <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => <PropertyCard key={property.slug} property={property} />)}
        </div>
        <p className="mt-8 text-[10px] text-stone-400">Sample listings for demonstration only. Availability and details are not verified.</p>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <div className="page-shell">
          <div className="max-w-xl"><p className="eyebrow">Find your kind of place</p><h2 className="section-title mt-4">A good place to begin.</h2></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((item) => (
              <Link key={item.name} href={`/properties?type=${item.query}`} className="group relative min-h-[270px] overflow-hidden bg-forest">
                <Image src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=800&q=80`} alt={`${item.name} property category`} fill sizes="(max-width: 640px) 100vw, 25vw" className="property-image object-cover opacity-75 transition group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102624]/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="mb-3 grid h-8 w-8 place-items-center rounded-full border border-white/60"><ArrowUpRight size={15} /></span>
                  <h3 className="font-display text-2xl">{item.name}</h3><p className="mt-1 text-xs text-white/75">{item.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-12 py-20 md:grid-cols-[.9fr_1.1fr] md:items-center md:gap-20 md:py-28">
        <div className="relative aspect-[.93/1] overflow-hidden bg-sage">
          <Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Warm, welcoming home interior with natural materials" fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
          <div className="absolute bottom-5 left-5 bg-white px-5 py-4">
            <p className="font-display text-2xl text-forest">Home, thoughtfully.</p><p className="mt-1 text-[10px] text-stone-500">Good decisions start with good people.</p>
          </div>
        </div>
        <div>
          <p className="eyebrow">The Makao difference</p>
          <h2 className="section-title mt-4">A little more care at every step.</h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-stone-600">Property decisions are personal. We make space to understand what matters to you, share the information we have, and help you move forward with confidence.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              { icon: HeartHandshake, title: "People come first", text: "Advice grounded in your needs, not a sales script." },
              { icon: ShieldCheck, title: "Clear conversations", text: "Straightforward information, with no promises we can’t support." },
              { icon: BadgeCheck, title: "Thoughtful guidance", text: "Support to ask the right questions at every stage." },
              { icon: Leaf, title: "A considered approach", text: "A curated selection, chosen with care." },
            ].map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><span className="mt-0.5 text-gold"><Icon size={19} /></span><div><h3 className="text-[13px] font-semibold text-ink">{title}</h3><p className="mt-1 text-[11px] leading-5 text-stone-500">{text}</p></div></div>)}
          </div>
          <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-forest">Get to know us <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <div className="page-shell grid gap-10 md:grid-cols-[.8fr_1.2fr] md:items-center">
          <div><p className="eyebrow">Kind words</p><h2 className="section-title mt-4">The experience matters, too.</h2><p className="mt-4 max-w-sm text-xs leading-6 text-stone-500">Illustrative sample testimonials below. Replaced with approved client feedback before publication.</p></div>
          <div className="border-l border-gold/70 py-2 pl-7 sm:pl-12">
            <span className="font-display text-5xl leading-none text-gold">“</span>
            <blockquote className="mt-2 max-w-xl font-display text-2xl leading-relaxed text-ink md:text-[30px]">They took time to understand what we needed, and every conversation felt clear and considered.</blockquote>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[.15em] text-stone-500">Sample testimonial · Nairobi</p>
          </div>
        </div>
      </section>

      <section className="page-shell flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div><p className="eyebrow">Let’s find your place</p><h2 className="mt-3 font-display text-3xl tracking-[-.04em] text-ink">A good conversation is a good start.</h2></div>
        <div className="flex flex-wrap gap-3"><WhatsAppLink /><Link href="/contact" className="inline-flex items-center gap-2 bg-forest px-5 py-3 text-xs font-semibold text-white transition hover:bg-ink">Talk to our team <ArrowRight size={14} /></Link></div>
      </section>
    </>
  );
}
