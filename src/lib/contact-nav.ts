import { ORGANIZATION } from "@/lib/site";
import { localizePath, type Locale } from "@/lib/i18n";

export const CONTACT_PATH = "/contact";
export const CONTACT_EMAIL = ORGANIZATION.email;

export function getContactPath(locale: Locale = "fr"): string {
  return localizePath(CONTACT_PATH, locale);
}

const MAILTO_COPY = {
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
} as const;

/** Ouvre la boîte mail avec sujet + corps préremplis. */
export function getContactMailtoHref(locale: Locale = "fr"): string {
  const copy = MAILTO_COPY[locale];
  // encodeURIComponent → %20 (pas +) : Outlook / certains clients mailto ne décodent pas le +.
  const subject = encodeURIComponent(copy.subject);
  const body = encodeURIComponent(copy.body);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
