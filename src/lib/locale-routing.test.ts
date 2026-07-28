import { describe, expect, it } from "vitest";
import { resolveLocaleRouting } from "@/lib/locale-routing";

describe("locale routing (next.config mirror)", () => {
  it("rewrites FR public paths to /fr/*", () => {
    expect(resolveLocaleRouting("/produit")).toEqual({
      type: "rewrite",
      to: "/fr/produit",
    });
    expect(resolveLocaleRouting("/secteurs/hopital")).toEqual({
      type: "rewrite",
      to: "/fr/secteurs/hopital",
    });
  });

  it("rewrites home to /fr", () => {
    expect(resolveLocaleRouting("/")).toEqual({ type: "rewrite", to: "/fr" });
  });

  it("passes /en through", () => {
    expect(resolveLocaleRouting("/en")).toEqual({ type: "next" });
    expect(resolveLocaleRouting("/en/produit")).toEqual({ type: "next" });
  });

  it("redirects public /fr/* to unprefixed FR URLs", () => {
    expect(resolveLocaleRouting("/fr/produit")).toEqual({
      type: "redirect",
      to: "/produit",
    });
    expect(resolveLocaleRouting("/fr")).toEqual({ type: "redirect", to: "/" });
  });

  it("bypasses API, static assets and llms", () => {
    expect(resolveLocaleRouting("/api/lead-magnet")).toEqual({ type: "next" });
    expect(resolveLocaleRouting("/_next/static/chunks/main.js")).toEqual({
      type: "next",
    });
    expect(resolveLocaleRouting("/llms.txt")).toEqual({ type: "next" });
    expect(resolveLocaleRouting("/og-planory.png")).toEqual({ type: "next" });
  });
});
