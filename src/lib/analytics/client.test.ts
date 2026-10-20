import { describe, expect, it, vi } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { ANALYTICS_CONSENT_STORAGE_KEY } from "@/lib/analytics/types";

function memoryStorage(seed: Record<string, string> = {}): Storage {
  const store = new Map(Object.entries(seed));
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => store.get(k) ?? null,
    key: (i: number) => [...store.keys()][i] ?? null,
    removeItem: (k: string) => {
      store.delete(k);
    },
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
  };
}

describe("trackAnalyticsEvent invariants", () => {
  it("does not call the network without granted consent", async () => {
    const fetchImpl = vi.fn();
    const sent = await trackAnalyticsEvent("pageview", {
      consent: "unknown",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      storage: memoryStorage(),
    });
    assertInvariant(sent === false, "must report not sent");
    assertInvariant(fetchImpl.mock.calls.length === 0, "must not fetch");

    const denied = await trackAnalyticsEvent("pageview", {
      consent: "denied",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      storage: memoryStorage({ [ANALYTICS_CONSENT_STORAGE_KEY]: "denied" }),
    });
    assertInvariant(denied === false, "denied must not send");
    assertInvariant(fetchImpl.mock.calls.length === 0, "still no fetch");
  });

  it("posts a validated payload when consent is granted", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 204 });
    const storage = memoryStorage({ [ANALYTICS_CONSENT_STORAGE_KEY]: "granted" });

    const sent = await trackAnalyticsEvent("funnel_step", {
      consent: "granted",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      storage,
      path: "/ressources/outils/grille-excel-vs-logiciel",
      locale: "fr",
      payload: { funnel: "lead_magnet", step: "form_view" },
    });

    assertInvariant(sent === true, "must report sent");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as {
      sessionId: string;
      type: string;
      payload: Record<string, unknown>;
    };
    assertInvariant(Boolean(body.sessionId), "sessionId required");
    assertInvariant(body.type === "funnel_step", "type preserved");
    assertInvariant(body.payload.funnel === "lead_magnet", "funnel metadata");
    assertInvariant(!("email" in body.payload), "no email");
  });

  it("tags only the first pageview of a session with its traffic source", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 204 });
    const storage = memoryStorage({ [ANALYTICS_CONSENT_STORAGE_KEY]: "granted" });
    const send = (now: number) =>
      trackAnalyticsEvent("pageview", {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        storage,
        path: "/",
        now,
        referrer: "https://www.google.fr/",
        search: "",
      });
    const bodies = () =>
      fetchImpl.mock.calls.map(
        ([, init]) => JSON.parse(String((init as RequestInit).body)) as {
          sessionId: string;
          payload: Record<string, unknown>;
        },
      );

    const t0 = Date.UTC(2026, 9, 20, 10);
    await send(t0);
    await send(t0 + 60_000);
    await send(t0 + 3 * 60 * 60 * 1000);

    const [landing, inner, comeback] = bodies();
    expect(landing.payload).toMatchObject({ entry: true, source: "google", medium: "organic" });
    assertInvariant(!("entry" in inner.payload), "later pageviews must not be counted as entries");
    assertInvariant(inner.sessionId === landing.sessionId, "same session while active");
    assertInvariant(comeback.sessionId !== landing.sessionId, "idle visitor starts a new session");
    assertInvariant(comeback.payload.entry === true, "a new session has its own entry");
  });
});
