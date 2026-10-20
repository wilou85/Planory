import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import { buildSitemapEntries, buildSitemapXml } from "@/lib/sitemap";
import { RESOURCE_ARTICLES } from "@/lib/resources";
import { SITE_URL } from "@/lib/site";

/**
 * `npm run sitemap:generate` (part of `npm run build`) runs this file:
 * invariants first, then src/app/sitemap.xml is written from the same entries.
 */
describe("sitemap", () => {
  const entries = buildSitemapEntries();
  const locs = entries.map((e) => e.loc);

  describe("invariants", () => {
    it("every URL is on the canonical https www host", () => {
      assertInvariantForEach(
        locs,
        (loc) => loc === SITE_URL || loc.startsWith(`${SITE_URL}/`),
        (loc) => `non-canonical host: ${loc}`,
      );
    });

    it("never lists redirecting URLs (internal /fr prefix, /en/fr, trailing slash)", () => {
      assertInvariantForEach(
        locs,
        (loc) => {
          const path = loc.slice(SITE_URL.length) || "/";
          return !/^\/fr(\/|$)/.test(path) && !/^\/en\/fr(\/|$)/.test(path) && (path === "/" || !path.endsWith("/"));
        },
        (loc) => `redirecting URL in sitemap: ${loc}`,
      );
    });

    it("lists each URL once", () => {
      assertInvariant(new Set(locs).size === locs.length, "duplicate <loc> in sitemap");
    });

    it("every URL declares reciprocal fr-FR / en-GB / x-default alternates that are themselves listed", () => {
      assertInvariantForEach(
        entries,
        (e) =>
          locs.includes(e.alternates["fr-FR"]) &&
          locs.includes(e.alternates["en-GB"]) &&
          e.alternates["x-default"] === e.alternates["fr-FR"] &&
          (e.loc === e.alternates["fr-FR"] || e.loc === e.alternates["en-GB"]),
        (e) => `broken hreflang cluster for ${e.loc}`,
      );
    });

    it("lists every article in both languages", () => {
      assertInvariantForEach(
        RESOURCE_ARTICLES,
        (a) => locs.includes(`${SITE_URL}${a.path}`) && locs.includes(`${SITE_URL}/en${a.path}`),
        (a) => `article missing from sitemap: ${a.path}`,
      );
    });

    it("every lastmod is a valid ISO date not in the future", () => {
      assertInvariantForEach(
        entries,
        (e) => !Number.isNaN(Date.parse(e.lastmod)) && Date.parse(e.lastmod) <= Date.now(),
        (e) => `bad lastmod ${e.lastmod} for ${e.loc}`,
      );
    });
  });

  it("writes src/app/sitemap.xml", () => {
    writeFileSync(join(process.cwd(), "src/app/sitemap.xml"), buildSitemapXml(entries));
  });
});
