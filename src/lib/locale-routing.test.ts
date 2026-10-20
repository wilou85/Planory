import { describe, expect, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import {
  FR_INTERNAL_REWRITE_SOURCE,
  LOCALE_REWRITES,
  isLocaleRewriteSource,
} from "@/lib/locale-routing";

describe("locale rewrite invariants", () => {
  it("never rewrites /admin (or /api, /en) into the internal /fr tree", () => {
    assertInvariantForEach(
      [
        "/admin",
        "/admin/",
        "/admin/login",
        "/admin/analytics",
        "/api",
        "/api/admin/login",
        "/en",
        "/en/faq",
        "/favicon.ico",
        "/logo.png",
        "/sw.js",
        "/images/hero-immeuble.jpg",
        "/manifest.webmanifest",
        "/_next/static/chunk.js",
      ],
      (path) => !isLocaleRewriteSource(path),
      (path) => `${path} must stay outside locale rewrites`,
    );
  });

  it("rewrites ordinary French public paths (root is app/page.tsx, not rewritten)", () => {
    assertInvariant(
      !isLocaleRewriteSource("/"),
      "root / is served by app/page.tsx, not rewritten",
    );
    assertInvariantForEach(
      ["/faq", "/ressources/planning-hospitalier", "/offre", "/produit"],
      (path) => isLocaleRewriteSource(path),
      (path) => `${path} must be rewritten for FR`,
    );
  });

  it("exposes a rewrite whose source excludes admin", () => {
    assertInvariant(LOCALE_REWRITES.length >= 1, "at least one rewrite");
    assertInvariant(
      FR_INTERNAL_REWRITE_SOURCE.includes("admin"),
      "rewrite source must mention admin in the negative lookahead",
    );
    assertInvariantForEach(
      LOCALE_REWRITES,
      (rule) => rule.destination === "/fr" || rule.destination.startsWith("/fr/"),
      (rule) => `${rule.source} must rewrite into /fr`,
    );
  });
});
