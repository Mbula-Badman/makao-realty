import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_COOKIE, getCustomerSession } from "@/lib/customer-auth";

export async function GET() {
  try {
    const user = await getCustomerSession();
    return user
      ? NextResponse.json({ user })
      : NextResponse.json({ error: "Please sign in." }, { status: 401 });
  } catch (error) {
    console.error("Could not read customer session:", error);
    return NextResponse.json({ error: "Could not read your account session." }, { status: 503 });
  }
}

export async function DELETE() {
  (await cookies()).delete(CUSTOMER_COOKIE);
  return NextResponse.json({ success: true });
}
