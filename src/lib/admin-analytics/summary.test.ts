import { describe, expect, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import {
  ANALYTICS_SUMMARY_PII_KEYS,
  emptyAnalyticsSummary,
  normalizeAnalyticsSummary,
  type AnalyticsSummary,
} from "@/lib/admin-analytics/summary";

function walkKeys(value: unknown, keys: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) walkKeys(item, keys);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      keys.add(key);
      walkKeys(child, keys);
    }
  }
}

describe("analytics summary invariants", () => {
  it("empty summary has non-negative counters and empty series", () => {
    const empty = emptyAnalyticsSummary("30d");
    assertInvariant(empty.range === "30d", "range preserved");
    assertInvariant(empty.sessions === 0 && empty.pageviews === 0, "zero counters");
    assertInvariant(empty.series.length === 0, "no series points");
    assertInvariant(empty.top_pages.length === 0, "no pages");
  });

  it("normalizes nullish SQL rows into finite non-negative numbers", () => {
    const summary = normalizeAnalyticsSummary({
      range: "7d",
      sessions: null,
      pageviews: "12",
      avg_page_time_s: "3.5",
      avg_scroll_depth: Number.NaN,
      devices: [{ device: "desktop", count: "4" }, { device: null, count: -1 }],
      top_pages: [{ path: "/offre", pageviews: "9" }],
      funnels: {
        lead_magnet: { form_start: "2", form_submit: 1, form_error: null, magnets: [] },
        contact: { cta_click: "1", funnel_step: "1" },
        sectors: { cta_click: 0, funnel_step: 0, by_sector: [{ sector: "hopital", count: "3" }] },
      },
      series: [{ day: "2026-10-01", pageviews: "2", sessions: "1" }],
    });
    expect(summary.sessions).toBe(0);
    expect(summary.pageviews).toBe(12);
    expect(summary.avg_page_time_s).toBe(3.5);
    expect(summary.avg_scroll_depth).toBe(0);
    expect(summary.devices[0]).toEqual({ device: "desktop", count: 4 });
    expect(summary.top_pages[0]).toEqual({ path: "/offre", pageviews: 9 });
    expect(summary.funnels.lead_magnet.form_start).toBe(2);
    expect(summary.funnels.sectors.by_sector[0]).toEqual({ sector: "hopital", count: 3 });
  });

  it("keeps the conversion rate within [0, 1] whatever the SQL rows say", () => {
    const cases = [
      { sessions: 0, conversions: 0 },
      { sessions: 0, conversions: 3 },
      { sessions: 4, conversions: 9 },
      { sessions: "10", conversions: "2" },
      { sessions: null, conversions: Number.NaN },
    ];
    assertInvariantForEach(
      cases.map((row) => normalizeAnalyticsSummary(row).conversion_rate),
      (rate) => Number.isFinite(rate) && rate >= 0 && rate <= 1,
      (rate) => `conversion rate out of bounds: ${rate}`,
    );
    expect(normalizeAnalyticsSummary({ sessions: "10", conversions: "2" }).conversion_rate).toBe(0.2);
  });

  it("never exposes PII field names in the summary payload", () => {
    const summary: AnalyticsSummary = normalizeAnalyticsSummary({
      ...emptyAnalyticsSummary("90d"),
      top_pages: [{ path: "/contact", pageviews: 1 }],
    });
    const keys = new Set<string>();
    walkKeys(summary, keys);
    assertInvariantForEach(
      [...ANALYTICS_SUMMARY_PII_KEYS],
      (key) => !keys.has(key),
      (key) => `summary must not contain PII key ${key}`,
    );
  });
});
