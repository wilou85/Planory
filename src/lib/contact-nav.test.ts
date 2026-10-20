import { describe, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import { CONTACT_EMAIL, getContactMailtoHref, getContactPath } from "@/lib/contact-nav";

const LOCALES = ["fr", "en"] as const;

function parseMailto(href: string) {
  const [target, query = ""] = href.slice("mailto:".length).split("?");
  const params = new URLSearchParams(query.replace(/\+/g, "%2B"));
  return { target, subject: params.get("subject") ?? "", body: params.get("body") ?? "" };
}

describe("contact CTA", () => {
  describe("invariants", () => {
    it("primary contact CTA is always a prefilled mailto to the contact address", () => {
      assertInvariantForEach(
        LOCALES,
        (locale) => {
          const href = getContactMailtoHref(locale);
          const { target, subject, body } = parseMailto(href);
          return (
            href.startsWith("mailto:") &&
            target === CONTACT_EMAIL &&
            subject.includes("Planory") &&
            body.length > 0
          );
        },
        (locale) => `getContactMailtoHref(${locale}) must be a prefilled mailto`,
      );
    });

    it("mailto query never contains raw spaces or line breaks (RFC 6068 encoding)", () => {
      assertInvariantForEach(
        LOCALES,
        (locale) => !/[\s]/.test(getContactMailtoHref(locale)),
        (locale) => `getContactMailtoHref(${locale}) must be percent-encoded`,
      );
    });

    it("contact page path stays an in-app route (footer link)", () => {
      assertInvariantForEach(
        LOCALES,
        (locale) => {
          const path = getContactPath(locale);
          return !path.startsWith("mailto:") && path.endsWith("/contact");
        },
        (locale) => `getContactPath(${locale}) must be an in-app contact path`,
      );
    });
  });

  it("matches the live planory.net template (fr)", () => {
    const { subject, body } = parseMailto(getContactMailtoHref("fr"));
    assertInvariant(subject === "Prise de contact — Planory", `fr subject: ${subject}`);
    assertInvariant(
      body ===
        "Bonjour,\n\nJe souhaite prendre contact au sujet de Planory.\n\nContexte :\n- Secteur :\n- Organisation (équipes / sites) :\n- Nb d’agents :\n- Horizon :\n- 2–3 contraintes clés :\n- Objectif principal (temps gagné / conformité / équité / autre) :\n\nDisponibilités pour un premier échange (20 min) :\n-\n-\n\nMerci,",
      `fr body: ${body}`,
    );
  });

  it("matches the live planory.net template (en)", () => {
    const { subject, body } = parseMailto(getContactMailtoHref("en"));
    assertInvariant(subject === "Contact request — Planory", `en subject: ${subject}`);
    assertInvariant(
      body ===
        "Hello,\n\nI would like to get in touch about Planory.\n\nContext:\n- Sector:\n- Organisation (teams / sites):\n- Number of staff:\n- Planning horizon:\n- 2–3 key constraints:\n- Main goal (time saved / compliance / fairness / other):\n\nAvailability for a first call (20 min):\n-\n-\n\nThank you,",
      `en body: ${body}`,
    );
  });
});
