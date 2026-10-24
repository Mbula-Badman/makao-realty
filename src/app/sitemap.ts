import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/property-source";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const properties = await getProperties();
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/properties`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    ...properties.map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
