import { createHash, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "makao_admin";
const tokenLifetime = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_JWT_SECRET must contain at least 32 characters.");
  return new TextEncoder().encode(secret);
}

export function safeStringEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export async function createAdminToken(email: string) {
  return new SignJWT({ role: "ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${tokenLifetime}s`)
    .sign(getSecret());
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return payload.role === "ADMIN" && payload.sub === process.env.ADMIN_EMAIL;
  } catch (error) {
    if (error instanceof Error && error.name === "JWSSignatureVerificationFailed") return false;
    if (error instanceof Error && error.name === "JWTExpired") return false;
    if (error instanceof Error && error.name === "JWTClaimValidationFailed") return false;
    if (error instanceof Error && error.name === "JWSInvalid") return false;
    throw error;
  }
}
