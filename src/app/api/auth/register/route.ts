import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createCustomerSession, hashPassword, setCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { getClientAddress, isRateLimited } from "@/lib/rate-limit";

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30).optional().or(z.literal("")),
  password: z.string().min(10).max(128),
});

export async function POST(request: Request) {
  if (isRateLimited(`register:${getClientAddress(request)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many sign-up attempts. Please wait and try again." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your name, a valid email and phone, and a password of at least 10 characters." }, { status: 400 });
  }

  try {
    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        phone: parsed.data.phone || null,
        passwordHash: await hashPassword(parsed.data.password),
      },
      select: { id: true, email: true, name: true },
    });
    const token = await createCustomerSession(user);
    await setCustomerSession(token);
    return NextResponse.json({ user: { name: user.name, email: user.email } }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "An account with that email already exists. Sign in instead." }, { status: 409 });
    }
    console.error("Could not register customer account:", error);
    return NextResponse.json({ error: "Registration is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
