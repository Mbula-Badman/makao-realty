import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({ id: z.string().min(1), status: z.enum(["NEW", "CONTACTED", "CLOSED"]) });

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const enquiries = await prisma.enquiry.findMany({
      include: { property: { select: { title: true, reference: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error("Could not load customer enquiries:", error);
    return NextResponse.json({ error: "Could not load enquiries. Check the database connection." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Choose a valid enquiry status." }, { status: 400 });
  try {
    const enquiry = await prisma.enquiry.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
    return NextResponse.json({ enquiry });
  } catch (error) {
    console.error("Could not update customer enquiry:", error);
    return NextResponse.json({ error: "Could not update this enquiry." }, { status: 503 });
  }
}
