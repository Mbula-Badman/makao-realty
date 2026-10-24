import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BedDouble, Maximize2 } from "lucide-react";
import type { Property } from "@/lib/properties";
import { formatPrice } from "@/lib/properties";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="property-card group">
      <Link href={`/properties/${property.slug}`} aria-label={`View ${property.title}`}>
        <div className="relative aspect-[1.28/1] overflow-hidden bg-sage">
          <Image
            src={property.image}
            alt={`${property.title}, ${property.location}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="property-image object-cover"
          />
          {property.badge && <span className="absolute left-4 top-4 bg-white px-3 py-2 text-[9px] font-semibold uppercase tracking-[.12em] text-forest">{property.badge}</span>}
          <span className="absolute right-4 top-4 bg-forest px-3 py-2 text-[9px] font-semibold uppercase tracking-[.1em] text-white">{property.status}</span>
          <span className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white text-forest transition group-hover:bg-gold group-hover:text-white"><ArrowUpRight size={17} /></span>
        </div>
        <div className="pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-stone-500">{property.location}</p>
              <h3 className="mt-2 font-display text-[21px] leading-tight tracking-[-.025em] text-ink">{property.title}</h3>
            </div>
            <p className="whitespace-nowrap pt-1 text-right text-[13px] font-semibold text-forest">{formatPrice(property.price, property.status)}</p>
          </div>
          <div className="mt-4 flex items-center gap-5 border-t border-stone-200 pt-4 text-[11px] text-stone-500">
            <span>{property.category}</span>
            {property.bedrooms && <span className="flex items-center gap-1.5"><BedDouble size={14} /> {property.bedrooms} beds</span>}
            <span className="flex items-center gap-1.5"><Maximize2 size={13} /> {property.size}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
