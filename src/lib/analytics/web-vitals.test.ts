import { describe, it } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import { createWebVitalFilter } from "@/lib/analytics/web-vitals";

describe("createWebVitalFilter", () => {
  describe("invariants", () => {
    it("sends a measure once even when several listeners report it", () => {
      const accept = createWebVitalFilter();
      const fcp = { name: "FCP", value: 2548, navigationId: "nav-1" };
      assertInvariant(accept(fcp), "first report is sent");
      assertInvariant(!accept({ ...fcp }), "duplicate from a second listener is dropped");
    });

    it("keeps distinct measures: other metric, other value, or other (soft) navigation", () => {
      const accept = createWebVitalFilter();
      accept({ name: "LCP", value: 1200, navigationId: "nav-1" });
      assertInvariant(accept({ name: "CLS", value: 1200, navigationId: "nav-1" }), "other metric");
      assertInvariant(accept({ name: "LCP", value: 1300, navigationId: "nav-1" }), "updated value");
      assertInvariant(accept({ name: "LCP", value: 1200, navigationId: "nav-2" }), "soft navigation");
    });

    it("ignores metrics the dashboard does not track", () => {
      const accept = createWebVitalFilter();
      assertInvariant(!accept({ name: "FID", value: 10 }), "FID is deprecated");
      assertInvariant(!accept({ name: "Next.js-hydration", value: 10 }), "custom Next metrics");
    });
  });
});
