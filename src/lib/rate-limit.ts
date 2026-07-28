type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
  ok: boolean;
  retryAfterSec: number;
};

const UPSTASH_UNAVAILABLE_RETRY_SEC = 60;

function isUpstashConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

function memoryRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/**
 * Upstash Redis REST — caller must ensure env is configured.
 * Returns null only on transport / API failure.
 */
async function upstashRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<RateLimitResult | null> {
  const base = process.env.UPSTASH_REDIS_REST_URL!.trim().replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!.trim();

  const redisKey = `rl:${key}`;
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const incrRes = await fetch(`${base}/incr/${encodeURIComponent(redisKey)}`, {
      method: "POST",
      headers,
    });
    if (!incrRes.ok) {
      console.error("[rate-limit] upstash incr failed", incrRes.status);
      return null;
    }
    const incrJson = (await incrRes.json()) as { result?: number };
    const count = Number(incrJson.result ?? 0);

    if (count === 1) {
      const expireRes = await fetch(
        `${base}/expire/${encodeURIComponent(redisKey)}/${windowSec}`,
        { method: "POST", headers },
      );
      if (!expireRes.ok) {
        console.error("[rate-limit] upstash expire failed", expireRes.status);
      }
    }

    if (count > limit) {
      const ttlRes = await fetch(`${base}/ttl/${encodeURIComponent(redisKey)}`, {
        headers,
      });
      const ttlJson = ttlRes.ok
        ? ((await ttlRes.json()) as { result?: number })
        : { result: windowSec };
      const ttl = Number(ttlJson.result ?? windowSec);
      return {
        ok: false,
        retryAfterSec: Math.max(1, ttl > 0 ? ttl : windowSec),
      };
    }

    return { ok: true, retryAfterSec: 0 };
  } catch (err) {
    console.error("[rate-limit] upstash error", err);
    return null;
  }
}

/**
 * Rate-limit : Upstash si configuré (multi-instances), sinon mémoire locale.
 * Si Upstash est configuré mais indisponible → fail-closed (pas de fallback mémoire).
 */
export async function checkRateLimit(
  key: string,
  {
    limit = 5,
    windowMs = 15 * 60 * 1000,
  }: { limit?: number; windowMs?: number } = {},
): Promise<RateLimitResult> {
  if (isUpstashConfigured()) {
    const remote = await upstashRateLimit(key, { limit, windowMs });
    if (remote) return remote;
    console.error(
      "[rate-limit] Upstash configured but unavailable — failing closed (no in-memory fallback)",
    );
    return { ok: false, retryAfterSec: UPSTASH_UNAVAILABLE_RETRY_SEC };
  }

  return memoryRateLimit(key, { limit, windowMs });
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
