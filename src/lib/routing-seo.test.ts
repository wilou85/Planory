import { describe, expect, it } from "vitest";
import { getContactMailtoHref, CONTACT_EMAIL } from "@/lib/contact-nav";
import {
  getLocaleFromPath,
  localizePath,
  stripLocalePrefix,
} from "@/lib/i18n";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { getResourceArticles } from "@/lib/resources";
import { getPageSeo, SITE_PAGES, SITE_URL } from "@/lib/site";
import { buildSitemapEntries, serializeSitemapXml } from "@/lib/build-sitemap";
import { getHreflangLanguages } from "@/lib/seo";

describe("i18n path helpers", () => {
  it("detects locale from path", () => {
    expect(getLocaleFromPath("/")).toBe("fr");
    expect(getLocaleFromPath("/produit")).toBe("fr");
    expect(getLocaleFromPath("/en")).toBe("en");
    expect(getLocaleFromPath("/en/produit")).toBe("en");
  });

  it("strips and localizes paths", () => {
    expect(stripLocalePrefix("/en/secteurs/hopital")).toBe("/secteurs/hopital");
    expect(localizePath("/produit", "en")).toBe("/en/produit");
    expect(localizePath("/produit", "fr")).toBe("/produit");
    expect(localizePath("/", "en")).toBe("/en");
  });
});

describe("getPageSeo single source", () => {
  it("returns FR and EN meta from SITE_PAGES", () => {
    const fr = getPageSeo("/contact", "fr");
    const en = getPageSeo("/contact", "en");
    expect(fr?.title).toContain("Contact Planory");
    expect(en?.title).toBe("Contact Planory — Demo request and inquiry");
    expect(en?.description).toMatch(/20-minute/);
  });

  it("covers outils hub", () => {
    expect(getPageSeo("/ressources/outils", "en")?.title).toMatch(/Free tools/);
  });
});

describe("contact mailto", () => {
  it("builds a prefilled mailto for FR and EN with %20 spaces", () => {
    const fr = getContactMailtoHref("fr");
    const en = getContactMailtoHref("en");
    expect(fr.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);
    expect(en.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);
    expect(fr).not.toMatch(/\+/);
    expect(fr).toContain("%20");

    const frParams = new URLSearchParams(fr.slice(fr.indexOf("?") + 1));
    const enParams = new URLSearchParams(en.slice(en.indexOf("?") + 1));
    expect(frParams.get("subject")).toBe("Prise de contact — Planory");
    expect(frParams.get("body")).toContain("Nb d’agents");
    expect(frParams.get("body")).toContain("Disponibilités pour un premier échange");
    expect(enParams.get("subject")).toBe("Contact request — Planory");
    expect(enParams.get("body")).toContain("Availability for a first call");
  });
});

describe("sitemap from SITE_PAGES", () => {
  it("lists FR and EN homepage and mirrors SITE_PAGES", () => {
    const entries = buildSitemapEntries();
    const urls = new Set(entries.map((e) => e.url));

    expect(urls.has(SITE_URL)).toBe(true);
    expect(urls.has(`${SITE_URL}/en`)).toBe(true);

    for (const page of SITE_PAGES) {
      const frUrl = page.path === "/" ? SITE_URL : `${SITE_URL}${page.path}`;
      const enUrl = `${SITE_URL}${localizePath(page.path, "en")}`;
      expect(urls.has(frUrl)).toBe(true);
      expect(urls.has(enUrl)).toBe(true);
    }
  });

  it("lists FR/EN articles and lead magnets without duplicates", () => {
    const entries = buildSitemapEntries();
    const urls = entries.map((e) => e.url);

    expect(new Set(urls).size).toBe(urls.length);

    for (const article of getResourceArticles("fr")) {
      expect(urls).toContain(`${SITE_URL}${article.path}`);
      expect(urls).toContain(`${SITE_URL}${localizePath(article.path, "en")}`);
    }
    for (const magnet of LEAD_MAGNETS) {
      expect(urls).toContain(`${SITE_URL}${magnet.path}`);
      expect(urls).toContain(`${SITE_URL}${localizePath(magnet.path, "en")}`);
    }
  });

  it("includes hreflang alternates on each entry", () => {
    const home = buildSitemapEntries().find((e) => e.url === SITE_URL);
    expect(home?.alternates?.languages?.["fr-FR"]).toBe(SITE_URL);
    expect(home?.alternates?.languages?.["en-GB"]).toBe(`${SITE_URL}/en`);
    expect(home?.alternates?.languages?.["x-default"]).toBe(SITE_URL);
    expect(getHreflangLanguages("/")["x-default"]).toBe(SITE_URL);
  });

  it("serializes XML with all locs and xhtml hreflang", () => {
    const entries = buildSitemapEntries();
    const xml = serializeSitemapXml(entries);
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(xml).toContain(`<loc>${SITE_URL}</loc>`);
    expect(xml).toContain(`hreflang="en-GB" href="${SITE_URL}/en"`);
    for (const entry of entries) {
      expect(xml).toContain(`<loc>${entry.url}</loc>`);
    }
  });
});
