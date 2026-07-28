import { describe, expect, it } from "vitest";
import {
  getAirportSector,
  getContactTopics,
  getFaqItems,
  getHospitalSector,
  getIndustrySector,
  getOffers,
  getPageUi,
  getProductBenefits,
  getProductModules,
  getSectors,
} from "@/lib/get-content";
import { LANDING_GEO_FAQ_QUESTIONS } from "@/lib/geo";

describe("FR/EN content parity", () => {
  it("keeps the same product module ids and detail counts", () => {
    const fr = getProductModules("fr");
    const en = getProductModules("en");

    expect(en.map((m) => m.id)).toEqual(fr.map((m) => m.id));
    expect(en.map((m) => m.details.length)).toEqual(fr.map((m) => m.details.length));
  });

  it("keeps the same number of global FAQ items (order = locale key)", () => {
    const fr = getFaqItems("fr");
    const en = getFaqItems("en");

    expect(en).toHaveLength(fr.length);
    for (let i = 0; i < fr.length; i++) {
      expect(fr[i]?.question.trim().length).toBeGreaterThan(0);
      expect(en[i]?.question.trim().length).toBeGreaterThan(0);
      expect(fr[i]?.answer.trim().length).toBeGreaterThan(0);
      expect(en[i]?.answer.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps GEO landing FAQ questions present in FR FAQ", () => {
    const frQuestions = new Set(getFaqItems("fr").map((item) => item.question));
    for (const question of LANDING_GEO_FAQ_QUESTIONS) {
      expect(frQuestions.has(question)).toBe(true);
    }
  });

  it("keeps sector list shape (icon + href when present)", () => {
    const fr = getSectors("fr");
    const en = getSectors("en");

    expect(en).toHaveLength(fr.length);
    expect(en.map((s) => s.icon)).toEqual(fr.map((s) => s.icon));
    expect(en.map((s) => ("href" in s ? s.href : null))).toEqual(
      fr.map((s) => ("href" in s ? s.href : null)),
    );
  });

  it("keeps benefits, offers and contact topics counts", () => {
    expect(getProductBenefits("en")).toHaveLength(getProductBenefits("fr").length);
    expect(getOffers("en")).toHaveLength(getOffers("fr").length);
    expect(getContactTopics("en")).toHaveLength(getContactTopics("fr").length);
  });

  it("keeps sector landing FAQ counts", () => {
    expect(getHospitalSector("en").faq).toHaveLength(getHospitalSector("fr").faq.length);
    expect(getAirportSector("en").faq).toHaveLength(getAirportSector("fr").faq.length);
    expect(getIndustrySector("en").faq).toHaveLength(getIndustrySector("fr").faq.length);
  });

  it("keeps product showcase item counts", () => {
    expect(getPageUi("en").productShowcase.items).toHaveLength(
      getPageUi("fr").productShowcase.items.length,
    );
  });
});
