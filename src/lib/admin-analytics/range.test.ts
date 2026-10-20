import { describe, expect, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import { parseAnalyticsRange, type AnalyticsRange } from "@/lib/admin-analytics/range";

describe("parseAnalyticsRange invariants", () => {
  it("accepts only 7d, 30d and 90d", () => {
    assertInvariantForEach(
      ["7d", "30d", "90d"] as AnalyticsRange[],
      (value) => parseAnalyticsRange(value).range === value,
      (value) => `${value} must be accepted`,
    );
  });

  it("defaults invalid or missing values to 30d", () => {
    for (const input of [undefined, null, "", "1d", "year", "30", 30]) {
      const parsed = parseAnalyticsRange(input);
      assertInvariant(parsed.range === "30d", `${JSON.stringify(input)} → 30d`);
      assertInvariant(parsed.days === 30, "30 days");
    }
  });

  it("never returns a since date in the future or a window wider than the range", () => {
    const now = new Date("2026-10-20T12:00:00.000Z");
    for (const range of ["7d", "30d", "90d"] as AnalyticsRange[]) {
      const parsed = parseAnalyticsRange(range, now);
      assertInvariant(parsed.since.getTime() <= now.getTime(), "since ≤ now");
      const spanMs = now.getTime() - parsed.since.getTime();
      expect(spanMs).toBe(parsed.days * 24 * 60 * 60 * 1000);
    }
  });
});
