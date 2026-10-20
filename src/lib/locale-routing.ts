/**
 * Locale routing for the French-default public site.
 * Unprefixed paths are rewritten internally to /fr/… for the [locale] segment.
 * Paths under /en, /api, /admin and static assets must never be rewritten.
 */
import type { NextConfig } from "next";

type Redirect = NonNullable<Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>>[number];
type Rewrite = {
  source: string;
  destination: string;
};

/**
 * Named `:path` + `/fr/:path` (Next substitutes named params; `$1` is unreliable here).
 * Negative lookahead skips en / api / admin / _next and any segment with a file
 * extension (`sw.js`, `hero.jpg`, `manifest.webmanifest`).
 * Root `/` is not matched (no `:path` segment) — served by `src/app/page.tsx`.
 */
export const FR_INTERNAL_REWRITE_SOURCE =
  "/:path((?!en(?:/|$)|api(?:/|$)|admin(?:/|$)|_next(?:/|$)|[^/]*\\.[^/]*).*)";

/**
 * Prefer `afterFiles` in next.config so `public/` assets are checked first.
 * afterFiles still runs before dynamic `[locale]`, so `/faq` → `/fr/faq` works.
 */
export const LOCALE_REWRITES: Rewrite[] = [
  {
    source: FR_INTERNAL_REWRITE_SOURCE,
    destination: "/fr/:path",
  },
];

export const LOCALE_REDIRECTS: Redirect[] = [];

/** Mirror of the rewrite exclusion rules, for unit tests (Next does not expose matcher eval). */
export function isLocaleRewriteSource(pathname: string): boolean {
  if (!pathname.startsWith("/")) return false;
  if (pathname === "/") return false;
  if (
    pathname === "/en" ||
    pathname.startsWith("/en/") ||
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/_next/")
  ) {
    return false;
  }
  if (pathname.split("/").some((segment) => segment.includes("."))) {
    return false;
  }
  return true;
}
