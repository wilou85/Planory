import { ORGANIZATION } from "@/lib/site";
import { localizePath, type Locale } from "@/lib/i18n";

export const CONTACT_PATH = "/contact";
export const CONTACT_EMAIL = ORGANIZATION.email;

export function getContactPath(locale: Locale = "fr"): string {
  return localizePath(CONTACT_PATH, locale);
}

const MAILTO_COPY = {
  fr: {
    subject: "Demande de contact Planory",
    body: [
      "Bonjour,",
      "",
      "Je souhaite échanger sur Planory pour mon contexte de planification d'équipes.",
      "",
      "Contexte / secteur :",
      "Taille d'équipe approximative :",
      "",
      "Cordialement,",
    ].join("\n"),
  },
  en: {
    subject: "Planory contact request",
    body: [
      "Hello,",
      "",
      "I would like to discuss Planory for my team scheduling context.",
      "",
      "Context / sector:",
      "Approximate team size:",
      "",
      "Best regards,",
    ].join("\n"),
  },
} as const;

/** Ouvre la boîte mail avec sujet + corps préremplis (sans Resend). */
export function getContactMailtoHref(locale: Locale = "fr"): string {
  const copy = MAILTO_COPY[locale];
  const params = new URLSearchParams({
    subject: copy.subject,
    body: copy.body,
  });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}
