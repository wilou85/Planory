import { generateKeyPairSync } from "node:crypto";
import { decodeJwt } from "jose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import {
  clearSearchConsoleCache,
  fetchSearchConsoleSummary,
  readSearchConsoleConfig,
  type SearchConsoleConfig,
} from "@/lib/search-console";

const NOW = new Date("2026-10-20T12:00:00.000Z");
const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const PEM = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

const config: SearchConsoleConfig = {
  siteUrl: "sc-domain:planory.net",
  clientEmail: "dashboard@planory.iam.gserviceaccount.com",
  privateKey: PEM,
};

type QueryBody = { startDate: string; endDate: string; dimensions?: string[]; rowLimit?: number };

function fakeGoogle(rowsFor: (body: QueryBody) => unknown[] = () => []) {
  const queries: QueryBody[] = [];
  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    if (url === "https://oauth2.googleapis.com/token") {
      return Response.json({ access_token: "token-123", expires_in: 3600 });
    }
    const body = JSON.parse(String(init?.body)) as QueryBody;
    queries.push(body);
    return Response.json({ rows: rowsFor(body) });
  });
  return { fetchImpl, queries };
}

const summarize = (fetchImpl: typeof fetch, range = "7d") =>
  fetchSearchConsoleSummary(range, { config, fetchImpl, now: NOW });

beforeEach(() => clearSearchConsoleCache());

describe("readSearchConsoleConfig", () => {
  it("is null unless the site and the service account are all configured", () => {
    expect(readSearchConsoleConfig({})).toBeNull();
    expect(
      readSearchConsoleConfig({ GSC_SITE_URL: "sc-domain:planory.net", GOOGLE_SERVICE_ACCOUNT_EMAIL: "a@b" }),
    ).toBeNull();
    expect(
      readSearchConsoleConfig({
        GSC_SITE_URL: "sc-domain:planory.net",
        GOOGLE_SERVICE_ACCOUNT_EMAIL: "a@b",
        GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n",
      })?.privateKey,
    ).toBe("-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n");
  });
});

describe("fetchSearchConsoleSummary", () => {
  it("reports 'not configured' without calling Google", async () => {
    const { fetchImpl } = fakeGoogle();
    const summary = await fetchSearchConsoleSummary("30d", {
      config: null,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      now: NOW,
    });
    expect(summary).toEqual({ configured: false });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("authenticates with a read-only service-account token", async () => {
    const { fetchImpl } = fakeGoogle();
    await summarize(fetchImpl as unknown as typeof fetch);

    const [tokenUrl, tokenInit] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(tokenUrl).toBe("https://oauth2.googleapis.com/token");
    const assertion = new URLSearchParams(String(tokenInit.body)).get("assertion") ?? "";
    expect(decodeJwt(assertion)).toMatchObject({
      iss: config.clientEmail,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
    });

    const [queryUrl, queryInit] = fetchImpl.mock.calls[1] as [string, RequestInit];
    expect(queryUrl).toBe(
      "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aplanory.net/searchAnalytics/query",
    );
    expect(new Headers(queryInit.headers).get("authorization")).toBe("Bearer token-123");
  });

  it("maps totals, top queries and pages (as public paths) from Google rows", async () => {
    const { fetchImpl } = fakeGoogle((body) => {
      const dim = body.dimensions?.[0];
      if (dim === "query") return [{ keys: ["logiciel planning"], clicks: 4, impressions: 80, ctr: 0.05, position: 6.2 }];
      if (dim === "page") return [{ keys: ["https://www.planory.net/secteurs/hopital"], clicks: 3, impressions: 40, ctr: 0.075, position: 4 }];
      if (dim === "date") return [{ keys: ["2026-10-18"], clicks: 2, impressions: 30, ctr: 0.0667, position: 7 }];
      return [{ clicks: 10, impressions: 200, ctr: 0.05, position: 8.4 }];
    });

    const summary = await summarize(fetchImpl as unknown as typeof fetch);
    assertInvariant(summary.configured, "configured summary expected");
    expect(summary.totals).toEqual({ clicks: 10, impressions: 200, ctr: 0.05, position: 8.4 });
    expect(summary.queries[0]).toEqual({ key: "logiciel planning", clicks: 4, impressions: 80, ctr: 0.05, position: 6.2 });
    expect(summary.pages[0].key).toBe("/secteurs/hopital");
    expect(summary.series).toEqual([{ day: "2026-10-18", clicks: 2, impressions: 30 }]);
  });

  describe("invariants", () => {
    it("queries a window of exactly the range length, ending before today, and the previous period right before it", async () => {
      for (const [range, days] of [["7d", 7], ["30d", 30], ["90d", 90]] as const) {
        clearSearchConsoleCache();
        const { fetchImpl, queries } = fakeGoogle();
        const summary = await summarize(fetchImpl as unknown as typeof fetch, range);
        assertInvariant(summary.configured, "configured");
        const spanDays = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86_400_000 + 1;
        const current = queries.find((q) => !q.dimensions && q.startDate === summary.startDate)!;
        const previous = queries.find((q) => !q.dimensions && q.startDate !== summary.startDate)!;
        assertInvariant(spanDays(current.startDate, current.endDate) === days, `${range} current span`);
        assertInvariant(current.endDate < NOW.toISOString().slice(0, 10), "Google data for today is incomplete");
        assertInvariant(spanDays(previous.startDate, previous.endDate) === days, `${range} previous span`);
        assertInvariant(spanDays(previous.endDate, current.startDate) === 2, "previous period ends the day before");
      }
    });

    it("never returns out-of-range CTR or position, even with no data", async () => {
      const { fetchImpl } = fakeGoogle((body) =>
        body.dimensions ? [{ keys: ["x"], clicks: 1, impressions: 0, ctr: 7, position: -3 }] : [],
      );
      const summary = await summarize(fetchImpl as unknown as typeof fetch);
      assertInvariant(summary.configured, "configured");
      assertInvariantForEach(
        [summary.totals, summary.previous, ...summary.queries, ...summary.pages],
        (row) => row.ctr >= 0 && row.ctr <= 1 && row.position >= 0,
        (row) => `out-of-range metrics: ${JSON.stringify(row)}`,
      );
    });

    it("surfaces Google errors instead of showing zeros", async () => {
      const fetchImpl = vi.fn(async (url: string) =>
        url.includes("oauth2")
          ? Response.json({ access_token: "t", expires_in: 3600 })
          : Response.json(
              { error: { message: "User does not have sufficient permission for site 'sc-domain:planory.net'." } },
              { status: 403 },
            ),
      );
      await expect(summarize(fetchImpl as unknown as typeof fetch)).rejects.toThrow(
        /sufficient permission/,
      );
    });
  });
});
