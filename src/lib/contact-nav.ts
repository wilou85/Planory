import { localizePath, type Locale } from "@/lib/i18n";
import { getContactEmail } from "@/lib/get-content";

export const CONTACT_PATH = "/contact";

/** Re-export for footer / mailto CTAs */
export const CONTACT_EMAIL = getContactEmail();

const MAILTO_TEMPLATE: Record<Locale, { subject: string; body: string }> = {
  fr: {
    subject: "Prise de contact — Planory",
    body: [
      "Bonjour,",
      "",
      "Je souhaite prendre contact au sujet de Planory.",
      "",
      "Contexte :",
      "- Secteur :",
      "- Organisation (équipes / sites) :",
      "- Nb d’agents :",
      "- Horizon :",
      "- 2–3 contraintes clés :",
      "- Objectif principal (temps gagné / conformité / équité / autre) :",
      "",
      "Disponibilités pour un premier échange (20 min) :",
      "-",
      "-",
      "",
      "Merci,",
    ].join("\n"),
  },
  en: {
    subject: "Contact request — Planory",
    body: [
      "Hello,",
      "",
      "I would like to get in touch about Planory.",
      "",
      "Context:",
      "- Sector:",
      "- Organisation (teams / sites):",
      "- Number of staff:",
      "- Planning horizon:",
      "- 2–3 key constraints:",
      "- Main goal (time saved / compliance / fairness / other):",
      "",
      "Availability for a first call (20 min):",
      "-",
      "-",
      "",
      "Thank you,",
    ].join("\n"),
  },
};

export function getContactPath(locale: Locale = "fr"): string {
  return localizePath(CONTACT_PATH, locale);
}

export function getContactMailtoHref(locale: Locale = "fr"): string {
  const { subject, body } = MAILTO_TEMPLATE[locale];
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
