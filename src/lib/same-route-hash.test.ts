import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { applySameRouteHash, handleSameRouteHashClick } from "@/lib/same-route-hash";

describe("same-route-hash", () => {
  beforeEach(() => {
    const location = {
      href: "https://www.planory.net/produit",
      origin: "https://www.planory.net",
      pathname: "/produit",
      hash: "",
    };
    vi.stubGlobal("window", {
      location,
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("HashChangeEvent", class HashChangeEvent extends Event {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("applies a new hash via location.hash", () => {
    applySameRouteHash("planning");
    expect(window.location.hash).toBe("#planning");
  });

  it("handles same-route product module links", () => {
    const preventDefault = vi.fn();
    const handled = handleSameRouteHashClick("/produit#skynet", { preventDefault });
    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalled();
    expect(window.location.hash).toBe("#skynet");
  });

  it("does not intercept cross-route links", () => {
    const preventDefault = vi.fn();
    const handled = handleSameRouteHashClick("/faq", { preventDefault });
    expect(handled).toBe(false);
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
