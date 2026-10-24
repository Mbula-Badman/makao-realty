import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const CUSTOMER_COOKIE = "makao_session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters.");
  return new TextEncoder().encode(secret);
}

export function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(`${salt.toString("hex")}:${derivedKey.toString("hex")}`);
    });
  });
}

export function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex, extra] = storedHash.split(":");
  if (!saltHex || !hashHex || extra || !/^[a-f0-9]{32}$/.test(saltHex) || !/^[a-f0-9]{128}$/.test(hashHex)) {
    return Promise.resolve(false);
  }
  return new Promise((resolve, reject) => {
    scrypt(password, Buffer.from(saltHex, "hex"), 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(timingSafeEqual(derivedKey, Buffer.from(hashHex, "hex")));
    });
  });
}

export async function createCustomerSession(user: { id: string; email: string }) {
  return new SignJWT({ role: "CUSTOMER", email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${sessionLifetimeSeconds}s`)
    .sign(getAuthSecret());
}

export async function setCustomerSession(token: string) {
  (await cookies()).set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionLifetimeSeconds,
  });
}

export async function getCustomerSession() {
  const token = (await cookies()).get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const secret = getAuthSecret();

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (payload.role !== "CUSTOMER" || typeof payload.sub !== "string") return null;
    userId = payload.sub;
  } catch {
    return null;
  }
  return prisma.user.findUnique({
    where: { id: userId, role: "CUSTOMER" },
    select: { id: true, name: true, email: true, phone: true },
  });
}
