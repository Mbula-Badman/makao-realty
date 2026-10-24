import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";
import { formatPrice } from "@/lib/properties";
import { getProperties, getPropertyBySlug } from "@/lib/property-source";
import { EnquiryForm } from "@/components/enquiry-form";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { PropertyCard } from "@/components/property-card";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [];
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  return {
    title: property.title,
    description: `${property.title} in ${property.location}. Enquire with Makao Realty for details.`,
    openGraph: { images: [property.image] },
  };
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  const allProperties = await getProperties();
  const similar = allProperties.filter((item) => item.slug !== property.slug && item.category === property.category).slice(0, 2);

  return (
    <>
      <Script
        id={`ld-json-${property.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: property.title,
            description: property.description,
            image: property.images,
            offers: {
              "@type": "Offer",
              price: property.price,
              priceCurrency: "KES",
              availability: "https://schema.org/InStock",
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/properties/${property.slug}`,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="page-shell pt-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-forest"><ArrowLeft size={14} /> Back to properties</Link>
        <div className="mt-6 grid gap-3 md:grid-cols-[1.5fr_1fr]">
          <div className="relative min-h-[300px] overflow-hidden bg-sage md:min-h-[520px]">
            <Image src={property.images[0]} alt={`${property.title} main view`} fill priority sizes="(max-width: 768px) 100vw, 65vw" className="object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            {property.images.slice(1, 3).map((src, index) => <div key={src} className="relative min-h-[145px] overflow-hidden bg-sage md:min-h-0"><Image src={src} alt={`${property.title} gallery image ${index + 2}`} fill sizes="(max-width: 768px) 50vw, 35vw" className="object-cover" /></div>)}
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] text-stone-400">Illustrative photography. Images may not depict the specific property.</p>
      </div>

      <div className="page-shell grid gap-12 py-10 md:grid-cols-[1fr_360px] md:gap-16 md:py-14">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-forest"><span>{property.category}</span><span className="text-gold">·</span><span>{property.status}</span></div>
          <h1 className="mt-3 font-display text-4xl tracking-[-.04em] text-ink md:text-5xl">{property.title}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-stone-500"><MapPin size={15} /> {property.location}</p>
          <p className="mt-5 font-display text-3xl text-forest">{formatPrice(property.price, property.status)}</p>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-4 border-y border-stone-200 py-5 text-xs text-stone-600">
            <span className="flex items-center gap-2"><Maximize2 size={15} /> {property.size}</span>
            {property.bedrooms && <span className="flex items-center gap-2"><BedDouble size={15} /> {property.bedrooms} bedrooms</span>}
            {property.bathrooms && <span className="flex items-center gap-2"><Bath size={15} /> {property.bathrooms} bathrooms</span>}
            <span>Ref. {property.reference}</span>
          </div>
          <div className="mt-8">
            <h2 className="font-display text-2xl text-ink">A little about this property</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">{property.description}</p>
          </div>
          <div className="mt-8">
            <h2 className="font-display text-2xl text-ink">Details to make it yours</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {property.amenities.map((amenity) => <li key={amenity} className="flex items-center gap-3 text-xs text-stone-600"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{amenity}</li>)}
            </ul>
          </div>
          <div className="mt-9 border-l-2 border-gold bg-paper p-5 text-xs leading-6 text-stone-600">
            Property information is supplied for guidance and is not a legal or availability verification. Independently confirm title, approvals, boundaries, pricing, and other details before making a decision.
          </div>
        </div>
        <aside className="h-fit border border-stone-200 p-6 md:sticky md:top-6">
          <p className="eyebrow">Start a conversation</p>
          <h2 className="mt-3 font-display text-2xl text-ink">Interested in this property?</h2>
          <p className="mt-2 text-xs leading-5 text-stone-500">Share a few details and our team will be in touch.</p>
          <div className="mt-5"><EnquiryForm propertySlug={property.slug} propertyName={property.title} /></div>
          <div className="mt-3"><WhatsAppLink message={`Hello Makao Realty, I’m interested in ${property.title} (${property.reference}).`} /></div>
        </aside>
      </div>
      {similar.length > 0 && <section className="bg-paper py-16"><div className="page-shell"><p className="eyebrow">Keep exploring</p><h2 className="section-title mt-3">A few more to consider.</h2><div className="mt-8 grid gap-7 sm:grid-cols-2">{similar.map((item) => <PropertyCard key={item.slug} property={item} />)}</div></div></section>}
    </>
  );
}
