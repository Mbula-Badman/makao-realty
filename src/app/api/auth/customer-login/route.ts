import { NextResponse } from "next/server";
import { z } from "zod";
import { createCustomerSession, setCustomerSession, verifyPassword } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { clearRateLimit, isRateLimited } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const attemptKey = `login:${email}`;
  if (isRateLimited(attemptKey, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many sign-in attempts. Please wait before trying again." }, { status: 429 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email, role: "CUSTOMER" },
      select: { id: true, name: true, email: true, passwordHash: true },
    });
    const validPassword = user
      ? await verifyPassword(parsed.data.password, user.passwordHash)
      : await verifyPassword(parsed.data.password, "00000000000000000000000000000000:" + "0".repeat(128));
    if (!user || !validPassword) {
      return NextResponse.json({ error: "Email or password wasn’t recognised." }, { status: 401 });
    }
    clearRateLimit(attemptKey);
    const token = await createCustomerSession(user);
    await setCustomerSession(token);
    return NextResponse.json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Could not sign in customer:", error);
    return NextResponse.json({ error: "Sign-in is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
