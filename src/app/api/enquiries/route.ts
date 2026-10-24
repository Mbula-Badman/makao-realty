import { NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(2000),
  propertySlug: z.string().max(100).optional().nullable(),
  website: z.string().max(500).optional(),
});

const submissionTimes = new Map<string, number[]>();

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ success: true });

  const clientAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (submissionTimes.get(clientAddress) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 5) return NextResponse.json({ error: "Please wait a little before sending another enquiry." }, { status: 429 });
  recent.push(now);
  submissionTimes.set(clientAddress, recent);

  try {
    const customer = await getCustomerSession();
    const property = parsed.data.propertySlug
      ? await prisma.property.findFirst({ where: { slug: parsed.data.propertySlug, published: true }, select: { id: true } })
      : null;
    if (parsed.data.propertySlug && !property) {
      return NextResponse.json({ error: "This listing is no longer available. Please refresh and try again." }, { status: 404 });
    }
    await prisma.enquiry.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        message: parsed.data.message,
        propertyId: property?.id,
        userId: customer?.id,
      },
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Could not save property enquiry:", error);
    return NextResponse.json({ error: "We couldn’t save your enquiry. Please try again shortly." }, { status: 503 });
  }
}
