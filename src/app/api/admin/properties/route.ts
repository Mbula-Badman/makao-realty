import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const propertySchema = z.object({
  title: z.string().trim().min(3).max(120),
  location: z.string().trim().min(2).max(120),
  county: z.string().trim().min(2).max(80),
  price: z.number().int().positive().max(2_000_000_000),
  category: z.enum(["Land", "House", "Apartment", "Commercial"]),
  status: z.enum(["For sale", "For rent"]),
  size: z.string().trim().min(1).max(80),
  bedrooms: z.number().int().min(0).max(100).nullable(),
  bathrooms: z.number().int().min(0).max(100).nullable(),
  description: z.string().trim().min(20).max(4000),
  amenities: z.array(z.string().trim().min(2).max(100)).max(30),
  images: z.array(z.string().url().refine((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" && parsed.hostname === (process.env.IMAGE_HOSTNAME || "images.unsplash.com");
    } catch {
      return false;
    }
  }, "Images must use HTTPS from the configured image host.")).min(1).max(12),
  featured: z.boolean(),
  published: z.boolean(),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const [properties, enquiries] = await Promise.all([
      prisma.property.findMany({ include: { images: { orderBy: { position: "asc" } }, _count: { select: { enquiries: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.enquiry.count({ where: { status: "NEW" } }),
    ]);
    return NextResponse.json({ properties, newEnquiries: enquiries });
  } catch (error) {
    console.error("Could not load admin properties:", error);
    return NextResponse.json({ error: "Could not load the dashboard. Check the database connection." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = propertySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the listing details and image URLs." }, { status: 400 });
  const slug = parsed.data.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const reference = `MK-${Date.now().toString().slice(-8)}`;
  try {
    const property = await prisma.property.create({
      data: {
        ...parsed.data,
        slug: `${slug}-${reference.toLowerCase()}`,
        reference,
        images: { create: parsed.data.images.map((url, position) => ({ url, alt: `${parsed.data.title} image ${position + 1}`, position })) },
      },
    });
    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error("Could not create property listing:", error);
    return NextResponse.json({ error: "Could not create the listing. Please check the database and try again." }, { status: 503 });
  }
}
