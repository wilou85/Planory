import { describe, expect, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import { CONTACT_SOURCES } from "@/lib/analytics/conversions";
import { TRAFFIC_MEDIUMS } from "@/lib/analytics/traffic-source";
import { WEB_VITAL_NAMES } from "@/lib/analytics/validate";
import {
  contactSourceLabel,
  deviceLabel,
  mediumLabel,
  percentChange,
  rateWebVital,
  webVitalLabel,
} from "@/lib/admin-analytics/labels";

describe("dashboard labels", () => {
  describe("invariants", () => {
    it("gives every known key a French label different from the raw key", () => {
      const cases = [
        ...CONTACT_SOURCES.map((key) => ({ key, label: contactSourceLabel(key) })),
        ...TRAFFIC_MEDIUMS.map((key) => ({ key, label: mediumLabel(key) })),
        ...["desktop", "mobile", "tablet", "unknown"].map((key) => ({ key, label: deviceLabel(key) })),
        ...WEB_VITAL_NAMES.map((key) => ({ key, label: webVitalLabel(key) })),
      ];
      assertInvariantForEach(
        cases,
        ({ key, label }) => label.trim().length > 0 && label !== key,
        ({ key }) => `${key} needs a French label`,
      );
    });

    it("falls back to the raw key for unknown values instead of hiding them", () => {
      expect(contactSourceLabel("nouveau_bouton")).toBe("nouveau_bouton");
      expect(contactSourceLabel("sector_aeroport")).toBe("Page secteur (aeroport)");
      expect(mediumLabel("inconnu")).toBe("inconnu");
    });

    it("reports no percentage change when there is nothing to compare with", () => {
      assertInvariant(percentChange(12, 0) === null, "previous = 0 has no meaningful %");
      assertInvariant(percentChange(0, 0) === null, "0 → 0 has no meaningful %");
      expect(percentChange(15, 10)).toBe(50);
      expect(percentChange(5, 10)).toBe(-50);
      assertInvariantForEach(
        [[1, 2], [2, 1], [3, 3], [100, 7]],
        ([current, previous]) => Math.sign(percentChange(current, previous) ?? 0) === Math.sign(current - previous),
        ([current, previous]) => `sign must follow the direction ${previous} → ${current}`,
      );
    });

    it("rates web vitals with Google's thresholds (good ≤ first, poor > second)", () => {
      expect(rateWebVital("LCP", 2500)).toBe("good");
      expect(rateWebVital("LCP", 2501)).toBe("needs-improvement");
      expect(rateWebVital("LCP", 4001)).toBe("poor");
      expect(rateWebVital("INP", 200)).toBe("good");
      expect(rateWebVital("INP", 501)).toBe("poor");
      expect(rateWebVital("CLS", 0.1)).toBe("good");
      expect(rateWebVital("CLS", 0.26)).toBe("poor");
      expect(rateWebVital("FCP", 1800)).toBe("good");
      expect(rateWebVital("TTFB", 1801)).toBe("poor");
    });
  });
});
