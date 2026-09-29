/** Centralized rate limits. Refs: SPEC §20 + §26.18.
 * ponytail: in-memory map; use Redis/Upstash when multi-instance.
 */
const hits = new Map<string, number[]>();

export const RATE_LIMITS = {
  register: { limit: 3, windowMs: 60 * 60 * 1000 },
  passwordReset: { limit: 3, windowMs: 60 * 60 * 1000 },
  projectSubmission: { limit: 5, windowMs: 60 * 60 * 1000 },
  organiserApplication: { limit: 1, windowMs: 30 * 24 * 60 * 60 * 1000 },
  login: { limit: 10, windowMs: 15 * 60 * 1000 },
} as const;

export type RateLimitKey = keyof typeof RATE_LIMITS;

export function checkRateLimit(key: RateLimitKey, id: string): { ok: boolean; retryAfterMs: number } {
  const { limit, windowMs } = RATE_LIMITS[key];
  const now = Date.now();
  const mapKey = `${key}:${id}`;
  const arr = (hits.get(mapKey) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    const oldest = arr[0] ?? now;
    return { ok: false, retryAfterMs: windowMs - (now - oldest) };
  }
  arr.push(now);
  hits.set(mapKey, arr);
  return { ok: true, retryAfterMs: 0 };
}

export function resetRateLimits(): void {
  hits.clear();
}
