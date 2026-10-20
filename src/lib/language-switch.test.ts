import { describe, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import { getLanguageSwitchHref } from "@/lib/language-switch";
import { LOCALES } from "@/lib/i18n";

/** Raw usePathname() values: dev (public) and prerendered prod (internal /fr rewrite). */
const RAW_PATHNAMES = [
  "/",
  "/fr",
  "/faq",
  "/fr/faq",
  "/contact",
  "/fr/contact",
  "/ressources/planning-hospitalier",
  "/fr/ressources/planning-hospitalier",
  "/en",
  "/en/faq",
  "/en/ressources/planning-hospitalier",
] as const;

const CASES = RAW_PATHNAMES.flatMap((pathname) =>
  LOCALES.map((locale) => ({ pathname, target: locale.code })),
);

describe("getLanguageSwitchHref", () => {
  describe("invariants", () => {
    it("never links to the internal /fr rewrite or the /en/fr trap (indexing 404s)", () => {
      assertInvariantForEach(
        CASES,
        ({ pathname, target }) => {
          const href = getLanguageSwitchHref(target, pathname);
          return !/^\/fr(\/|$)/.test(href) && !/^\/en\/fr(\/|$)/.test(href);
        },
        ({ pathname, target }) =>
          `${target} link from ${pathname} -> ${getLanguageSwitchHref(target, pathname)}`,
      );
    });

    it("internal and public pathnames of the same page yield the same links", () => {
      assertInvariantForEach(
        CASES.filter(({ pathname }) => pathname.startsWith("/fr")),
        ({ pathname, target }) =>
          getLanguageSwitchHref(target, pathname) ===
          getLanguageSwitchHref(target, pathname.replace(/^\/fr/, "") || "/"),
        ({ pathname, target }) => `${target} link differs between ${pathname} and its public URL`,
      );
    });
  });

  it("maps the prerendered French FAQ to /faq and /en/faq", () => {
    assertInvariant(getLanguageSwitchHref("fr", "/fr/faq") === "/faq", "fr link");
    assertInvariant(getLanguageSwitchHref("en", "/fr/faq") === "/en/faq", "en link");
    assertInvariant(getLanguageSwitchHref("en", "/fr") === "/en", "en home link");
  });
});
