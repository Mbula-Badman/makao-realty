import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["For sale", "For rent"]).optional(),
  title: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().min(20).max(4000).optional(),
}).refine((value) => Object.keys(value).length > 0);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "No valid listing changes were provided." }, { status: 400 });
  try {
    const property = await prisma.property.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ property });
  } catch (error) {
    console.error("Could not update property listing:", error);
    return NextResponse.json({ error: "Could not update the listing. It may have been removed." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Could not delete property listing:", error);
    return NextResponse.json({ error: "Could not delete the listing. It may have been removed." }, { status: 503 });
  }
}
