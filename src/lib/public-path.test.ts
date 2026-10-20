import { describe, expect, it } from "vitest";
import { toPublicPathname } from "@/lib/public-path";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";

const INTERNAL_FR_SAMPLES = [
  "/fr",
  "/fr/",
  "/fr/faq",
  "/fr/ressources/planning-hospitalier",
  "/fr/en",
] as const;

const PUBLIC_SAMPLES = [
  "/",
  "/faq",
  "/ressources/planning-hospitalier",
  "/en",
  "/en/faq",
  "/france",
  "/fromage",
] as const;

describe("toPublicPathname", () => {
  describe("invariants", () => {
    it("never exposes the internal /fr rewrite as a public path", () => {
      assertInvariantForEach(
        INTERNAL_FR_SAMPLES,
        (input) => {
          const out = toPublicPathname(input);
          return out !== "/fr" && !out.startsWith("/fr/");
        },
        (input) => `must strip internal /fr from ${input}`,
      );
    });

    it("is idempotent on already-public paths", () => {
      assertInvariantForEach(
        PUBLIC_SAMPLES,
        (input) => toPublicPathname(input) === input,
        (input) => `public path must stay unchanged: ${input}`,
      );
    });

    it("always returns a path starting with /", () => {
      const samples = [...INTERNAL_FR_SAMPLES, ...PUBLIC_SAMPLES, ""];
      assertInvariantForEach(
        samples,
        (input) => toPublicPathname(input).startsWith("/"),
        (input) => `result must be absolute path for ${JSON.stringify(input)}`,
      );
    });

    it("never doubles the English locale prefix", () => {
      const out = toPublicPathname("/fr/ressources/planning-hospitalier");
      assertInvariant(
        !out.includes("/en/fr/") && !out.startsWith("/en/fr"),
        "must not produce /en/fr/… language-switcher traps",
      );
    });
  });

  it("maps internal French home and FAQ to public URLs", () => {
    expect(toPublicPathname("/fr")).toBe("/");
    expect(toPublicPathname("/fr/faq")).toBe("/faq");
  });
});
