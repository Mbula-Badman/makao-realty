import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, createAdminToken, safeStringEqual } from "@/lib/admin-auth";

const credentialsSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = credentialsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || !process.env.ADMIN_JWT_SECRET) {
    console.error("Admin login is not configured.");
    return NextResponse.json({ error: "Admin login is not configured on this server." }, { status: 503 });
  }
  if (!safeStringEqual(parsed.data.email.toLowerCase(), adminEmail.toLowerCase()) || !safeStringEqual(parsed.data.password, adminPassword)) {
    return NextResponse.json({ error: "Those credentials weren’t recognised." }, { status: 401 });
  }

  try {
    const token = await createAdminToken(adminEmail);
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch (error) {
    console.error("Could not create admin session:", error);
    return NextResponse.json({ error: "Admin login is not configured correctly." }, { status: 503 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
