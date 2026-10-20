import { describe, it } from "vitest";
import { assertInvariantForEach } from "@/lib/test/invariants";
import { createPageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/** Pages whose route calls createPageMetadata without an explicit title. */
const PUBLIC_PATHS = [
  "/produit",
  "/secteurs",
  "/secteurs/hopital",
  "/secteurs/aeroport",
  "/secteurs/industrie",
  "/ressources",
  "/ressources/outils",
  "/offre",
  "/faq",
  "/contact",
  "/confidentialite",
  "/en/produit",
  "/en/ressources/outils",
  "/en/contact",
] as const;

describe("createPageMetadata", () => {
  describe("invariants", () => {
    it("every public page gets its own title, never the bare site name", () => {
      assertInvariantForEach(
        PUBLIC_PATHS,
        (path) => createPageMetadata({ path }).title !== SITE_NAME,
        (path) => `${path} falls back to the generic site title`,
      );
    });

    it("every public page gets its own description, never the site-wide default", () => {
      assertInvariantForEach(
        PUBLIC_PATHS,
        (path) => createPageMetadata({ path }).description !== SITE_DESCRIPTION,
        (path) => `${path} falls back to the generic site description`,
      );
    });
  });
});
