import { describe, expect, it, vi } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import {
  PRODUCT_MODULE_PANEL_ID,
  scrollProductModuleIntoView,
} from "@/lib/product-module-scroll";

describe("product module scroll invariants", () => {
  it("always scrolls the stable module panel into view when the user picks a module", () => {
    const spy = vi.fn();
    const doc = {
      getElementById: (id: string) =>
        id === PRODUCT_MODULE_PANEL_ID ? { scrollIntoView: spy } : null,
    };

    scrollProductModuleIntoView("planning", doc);

    assertInvariant(spy.mock.calls.length === 1, "scrollIntoView must run once");
    expect(spy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("falls back to the module hash id when the stable panel is missing", () => {
    const spy = vi.fn();
    const doc = {
      getElementById: (id: string) =>
        id === "skynet" ? { scrollIntoView: spy } : null,
    };

    scrollProductModuleIntoView("skynet", doc);

    assertInvariant(spy.mock.calls.length === 1, "fallback scroll must run");
  });
});
