import type { Property as DbProperty } from "@prisma/client";
import { properties as demoProperties, type Property } from "@/lib/properties";
import { prisma } from "@/lib/prisma";

type WithImages = DbProperty & { images: { url: string }[] };

function toPublicProperty(item: WithImages): Property {
  const images = item.images.map((image) => image.url);
  return {
    slug: item.slug,
    title: item.title,
    location: item.location,
    county: item.county,
    price: item.price,
    category: item.category as Property["category"],
    status: item.status as Property["status"],
    size: item.size,
    bedrooms: item.bedrooms ?? undefined,
    bathrooms: item.bathrooms ?? undefined,
    image: images[0] || "",
    images,
    featured: item.featured,
    reference: item.reference,
    description: item.description,
    amenities: item.amenities,
  };
}

export async function getProperties(): Promise<Property[]> {
  if (!process.env.DATABASE_URL) return demoProperties;

  try {
    const rows = await prisma.property.findMany({
      where: { published: true },
      include: { images: { orderBy: { position: "asc" } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return rows.map(toPublicProperty);
  } catch (error) {
    console.warn("Database unavailable; falling back to demo properties.", error);
    return demoProperties;
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  if (!process.env.DATABASE_URL) return demoProperties.find((item) => item.slug === slug);

  try {
    const item = await prisma.property.findFirst({
      where: { slug, published: true },
      include: { images: { orderBy: { position: "asc" } } },
    });
    return item ? toPublicProperty(item) : undefined;
  } catch (error) {
    console.warn(`Database unavailable for slug ${slug}; falling back to demo data.`, error);
    return demoProperties.find((item) => item.slug === slug);
  }
}
