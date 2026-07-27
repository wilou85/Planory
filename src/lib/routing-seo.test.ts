import { describe, expect, it } from "vitest";
import { formatContactEmail, validateContactForm } from "@/lib/contact";
import {
  getLocaleFromPath,
  localizePath,
  stripLocalePrefix,
} from "@/lib/i18n";
import { getPageSeo } from "@/lib/site";

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

describe("formatContactEmail locale", () => {
  it("tags subject with EN for anglophone leads", () => {
    const result = validateContactForm({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "",
      gdprConsent: true,
      locale: "en",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const email = formatContactEmail(result.data);
    expect(email.subject).toContain("[EN]");
    expect(email.text).toContain("Langue : EN");
  });

  it("tags subject with FR by default", () => {
    const result = validateContactForm({
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      phone: "",
      gdprConsent: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const email = formatContactEmail(result.data);
    expect(email.subject).toContain("[FR]");
  });
});
