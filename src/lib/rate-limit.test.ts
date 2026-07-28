import { afterEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit (memory fallback)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("allows up to the limit then blocks", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    const key = `test:${Date.now()}-${Math.random()}`;
    const opts = { limit: 2, windowMs: 60_000 };

    expect((await checkRateLimit(key, opts)).ok).toBe(true);
    expect((await checkRateLimit(key, opts)).ok).toBe(true);
    const blocked = await checkRateLimit(key, opts);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("fails closed when Upstash is configured but unreachable", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    const result = await checkRateLimit(`upstash-down:${Date.now()}`, {
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });

    expect(result.ok).toBe(false);
    expect(result.retryAfterSec).toBe(60);
  });
});
