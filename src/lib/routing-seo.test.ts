import { describe, expect, it } from "vitest";
import { getContactMailtoHref, CONTACT_EMAIL } from "@/lib/contact-nav";
import {
  getLocaleFromPath,
  localizePath,
  stripLocalePrefix,
} from "@/lib/i18n";
import { getPageSeo, SITE_PAGES, SITE_URL } from "@/lib/site";
import sitemap from "@/app/sitemap";

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
  it("builds a prefilled mailto for FR and EN", () => {
    const fr = getContactMailtoHref("fr");
    const en = getContactMailtoHref("en");
    expect(fr.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);
    expect(en.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);

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
    const entries = sitemap();
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
});
