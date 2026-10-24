const attemptsByKey = new Map<string, number[]>();
const maxTrackedKeys = 10_000;

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const attempts = (attemptsByKey.get(key) || []).filter((time) => now - time < windowMs);
  if (attempts.length >= limit) {
    attemptsByKey.set(key, attempts);
    return true;
  }
  attempts.push(now);
  attemptsByKey.set(key, attempts);

  if (attemptsByKey.size > maxTrackedKeys) {
    attemptsByKey.forEach((timestamps, trackedKey) => {
      if (!timestamps.some((time) => now - time < windowMs)) attemptsByKey.delete(trackedKey);
    });
  }
  return false;
}

export function clearRateLimit(key: string) {
  attemptsByKey.delete(key);
}

export function getClientAddress(request: Request) {
  return request.headers.get("x-real-ip")
    || request.headers.get("x-vercel-forwarded-for")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}
