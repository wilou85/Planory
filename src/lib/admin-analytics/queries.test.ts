import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import { fetchAnalyticsSummary, type SummaryQuery } from "@/lib/admin-analytics/queries";

const NOW = new Date("2026-10-20T12:00:00.000Z");
const DAY_MS = 24 * 60 * 60 * 1000;
const ENV = "production";

let pg: PGlite;
const query: SummaryQuery = (text, params) => pg.query(text, params);

type EventRow = {
  type: string;
  session?: string;
  visitor?: string;
  path?: string;
  device?: string;
  payload?: Record<string, unknown>;
  daysAgo?: number;
  environment?: string;
};

async function insert(...rows: EventRow[]) {
  for (const row of rows) {
    await pg.query(
      `INSERT INTO public.analytics_events (created_at, environment, session_id, visitor_id, type, path, device, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
      [
        new Date(NOW.getTime() - (row.daysAgo ?? 1) * DAY_MS).toISOString(),
        row.environment ?? ENV,
        row.session ?? "s1",
        row.visitor ?? `v-${row.session ?? "s1"}`,
        row.type,
        row.path ?? "/",
        row.device ?? "desktop",
        JSON.stringify(row.payload ?? {}),
      ],
    );
  }
}

const contactClick = (session: string, source = "header"): EventRow => ({
  type: "cta_click",
  session,
  payload: { funnel: "contact", cta: "contact_mailto", source },
});
const leadSubmit = (session: string): EventRow => ({
  type: "form_submit",
  session,
  payload: { funnel: "lead_magnet", magnetSlug: "grille" },
});
const entry = (session: string, source: string, medium: string, path = "/"): EventRow => ({
  type: "pageview",
  session,
  path,
  payload: { entry: true, source, medium },
});

const summarize = (range = "30d", q: SummaryQuery = query) =>
  fetchAnalyticsSummary(range, { query: q, environment: ENV, now: NOW });

beforeAll(async () => {
  pg = new PGlite();
  await pg.exec(readFileSync(join(process.cwd(), "sql/analytics_events.sql"), "utf8"));
  await pg.exec(readFileSync(join(process.cwd(), "sql/admin_users.sql"), "utf8"));
});

afterAll(async () => {
  await pg.close();
});

beforeEach(async () => {
  await pg.exec("TRUNCATE public.analytics_events");
});

describe("fetchAnalyticsSummary (real Postgres)", () => {
  describe("invariants", () => {
    it("only counts events of the current environment inside the requested window", async () => {
      await insert(
        { type: "pageview", session: "s1", path: "/offre" },
        { type: "pageview", session: "s2", path: "/offre", daysAgo: 6 },
        { type: "pageview", session: "s3", path: "/faq", daysAgo: 20 },
        { type: "pageview", session: "s4", path: "/faq", daysAgo: 40 },
        { type: "pageview", session: "s5", path: "/faq", environment: "development" },
      );

      const week = await summarize("7d");
      expect([week.pageviews, week.sessions]).toEqual([2, 2]);
      const month = await summarize("30d");
      expect([month.pageviews, month.sessions]).toEqual([3, 3]);
      expect(month.top_pages).toEqual([
        { path: "/offre", pageviews: 2 },
        { path: "/faq", pageviews: 1 },
      ]);
      assertInvariant(
        month.series.reduce((sum, point) => sum + point.pageviews, 0) === month.pageviews,
        "daily series must add up to the pageview total",
      );
    });

    it("never lets a malformed numeric payload zero out the other KPIs", async () => {
      await insert(
        { type: "pageview" },
        { type: "page_time", payload: { seconds: 10 } },
        { type: "page_time", payload: { seconds: "abc" } },
        { type: "scroll_depth", payload: { depth: 80 } },
        { type: "scroll_depth", payload: { depth: "deep" } },
      );

      const summary = await summarize();
      expect(summary.pageviews).toBe(1);
      expect(summary.avg_page_time_s).toBe(10);
      expect(summary.avg_scroll_depth).toBe(80);
    });

    it("reports database failures instead of disguising them as an empty summary", async () => {
      const failing: SummaryQuery = async () => {
        throw new Error("connection refused");
      };
      await expect(summarize("30d", failing)).rejects.toThrow("connection refused");
    });

    it("splits conversion funnels by their funnel tag", async () => {
      await insert(
        { type: "form_start", payload: { funnel: "lead_magnet", magnetSlug: "grille" } },
        { type: "form_submit", payload: { funnel: "lead_magnet", magnetSlug: "grille" } },
        { type: "form_error", payload: { funnel: "lead_magnet", stage: "api" } },
        { type: "cta_click", payload: { funnel: "contact", cta: "mailto" } },
        { type: "cta_click", payload: { funnel: "sectors", sector: "hotellerie" } },
        { type: "funnel_step", payload: { funnel: "sectors", sector: "hotellerie" } },
      );

      const { funnels } = await summarize();
      expect(funnels.lead_magnet).toMatchObject({ form_start: 1, form_submit: 1, form_error: 1 });
      expect(funnels.lead_magnet.magnets).toEqual([{ magnetSlug: "grille", form_submit: 1 }]);
      expect(funnels.contact).toEqual({ cta_click: 1, funnel_step: 0 });
      expect(funnels.sectors).toEqual({
        cta_click: 1,
        funnel_step: 1,
        by_sector: [{ sector: "hotellerie", count: 2 }],
      });
    });

    it("keeps the funnel monotone: sessions ≥ engaged sessions ≥ converted sessions", async () => {
      await insert(
        { type: "pageview", session: "home-only" },
        { type: "pageview", session: "product", path: "/produit" },
        { type: "pageview", session: "contact" },
        contactClick("contact"),
        { type: "pageview", session: "lead", path: "/ressources/outils/grille" },
        leadSubmit("lead"),
        { type: "pageview", session: "sector-click" },
        { type: "cta_click", session: "sector-click", payload: { funnel: "sectors" } },
        { type: "pageview", session: "two-pages" },
        { type: "pageview", session: "two-pages", path: "/faq" },
        { type: "pageview", session: "en-offer", path: "/en/offre" },
      );

      const summary = await summarize();
      expect(summary.sessions).toBe(7);
      expect(summary.engaged_sessions).toBe(5);
      expect(summary.conversions).toBe(2);
      assertInvariant(
        summary.sessions >= summary.engaged_sessions &&
          summary.engaged_sessions >= summary.conversions,
        "funnel steps must never increase",
      );
      expect(summary.conversion_rate).toBeCloseTo(2 / 7);
    });

    it("attributes every session to exactly one traffic source and one entry page", async () => {
      await insert(
        entry("g1", "google", "organic", "/produit"),
        contactClick("g1"),
        entry("g2", "google", "organic"),
        { type: "pageview", session: "g2", path: "/faq" },
        entry("li", "linkedin", "social", "/secteurs/hopital"),
        leadSubmit("li"),
        { type: "pageview", session: "legacy", path: "/faq" },
      );

      const summary = await summarize();
      expect(summary.sources).toEqual([
        { source: "google", medium: "organic", sessions: 2, conversions: 1 },
        { source: "inconnue", medium: "inconnu", sessions: 1, conversions: 0 },
        { source: "linkedin", medium: "social", sessions: 1, conversions: 1 },
      ]);
      assertInvariant(
        summary.sources.reduce((sum, row) => sum + row.sessions, 0) === summary.sessions,
        "per-source sessions must add up to the session total",
      );
      expect(summary.entry_pages).toEqual([
        { path: "/", sessions: 1, conversions: 0 },
        { path: "/faq", sessions: 1, conversions: 0 },
        { path: "/produit", sessions: 1, conversions: 1 },
        { path: "/secteurs/hopital", sessions: 1, conversions: 1 },
      ]);
    });

    it("compares with the previous period of the same length, without overlap", async () => {
      await insert(
        { type: "pageview", session: "now1", daysAgo: 1 },
        contactClick("now1"),
        { type: "pageview", session: "now2", daysAgo: 6 },
        { type: "pageview", session: "prev1", daysAgo: 8 },
        { type: "pageview", session: "prev2", daysAgo: 13 },
        { type: "pageview", session: "prev2", daysAgo: 13 },
        { type: "pageview", session: "older", daysAgo: 15 },
      );

      const week = await summarize("7d");
      expect([week.sessions, week.pageviews, week.conversions]).toEqual([2, 2, 1]);
      expect(week.previous).toEqual({ sessions: 2, pageviews: 3, visitors: 2, conversions: 0 });
    });

    it("counts each visitor once and flags those with more than one session as returning", async () => {
      await insert(
        { type: "pageview", session: "a-old", visitor: "a", daysAgo: 20 },
        { type: "pageview", session: "a-new", visitor: "a", daysAgo: 2 },
        { type: "pageview", session: "b1", visitor: "b", daysAgo: 2 },
        { type: "pageview", session: "c1", visitor: "c", daysAgo: 3 },
        { type: "pageview", session: "c2", visitor: "c", daysAgo: 1 },
      );

      const week = await summarize("7d");
      expect(week.visitors).toBe(3);
      expect(week.returning_visitors).toBe(2);
      assertInvariant(week.returning_visitors <= week.visitors, "returning visitors are a subset");
    });

    it("splits FR and EN traffic by public path prefix only", async () => {
      await insert(
        { type: "pageview", session: "f", path: "/" },
        { type: "pageview", session: "f", path: "/enquete" },
        { type: "pageview", session: "e", path: "/en" },
        { type: "pageview", session: "e", path: "/en/faq" },
        { type: "pageview", session: "e", path: "/en/offre" },
      );

      const { locales } = await summarize();
      expect(locales).toEqual([
        { locale: "en", pageviews: 3, sessions: 1 },
        { locale: "fr", pageviews: 2, sessions: 1 },
      ]);
    });

    it("counts devices in visits, not in events", async () => {
      await insert(
        { type: "pageview", session: "d1", device: "desktop" },
        { type: "page_time", session: "d1", device: "desktop", payload: { seconds: 3 } },
        { type: "pageview", session: "d1", device: "desktop", path: "/faq" },
        { type: "pageview", session: "m1", device: "mobile" },
      );
      const { devices, sessions } = await summarize();
      expect(devices).toEqual([
        { device: "desktop", count: 1 },
        { device: "mobile", count: 1 },
      ]);
      assertInvariant(
        devices.reduce((sum, row) => sum + row.count, 0) === sessions,
        "device visits must add up to the visit total",
      );
    });

    it("breaks contact clicks down by the button that produced them", async () => {
      await insert(contactClick("x", "header"), contactClick("y", "header"), contactClick("z", "hero"));
      const { contact_sources } = await summarize();
      expect(contact_sources).toEqual([
        { source: "header", count: 2 },
        { source: "hero", count: 1 },
      ]);
    });

    it("reports the p75 of each web vital and the most frequent JS errors", async () => {
      await insert(
        ...[1000, 2000, 3000, 4000].map((value, i) => ({
          type: "web_vital",
          session: `wv${i}`,
          payload: { name: "LCP", value, rating: value <= 2500 ? "good" : "poor" },
        })),
        { type: "web_vital", payload: { name: "CLS", value: "broken", rating: "good" } },
        { type: "js_error", session: "e1", path: "/faq", payload: { message: "boom" } },
        { type: "js_error", session: "e2", path: "/faq", payload: { message: "boom" } },
        { type: "js_error", session: "e2", path: "/", payload: { message: "other" } },
      );

      const summary = await summarize();
      expect(summary.web_vitals).toEqual([{ name: "LCP", p75: 3250, samples: 4, good_share: 0.5 }]);
      expect(summary.js_errors).toEqual([
        { message: "boom", count: 2, sessions: 2, path: "/faq" },
        { message: "other", count: 1, sessions: 1, path: "/" },
      ]);
    });
  });
});
