import { getContactFormCopy } from "@/lib/get-content";
import type { Locale } from "@/lib/i18n";

export type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gdprConsent: boolean;
  locale: Locale;
};

/** Honeypot rempli → bot ; succès silencieux sans envoi. */
export function isContactHoneypotTripped(input: unknown): boolean {
  if (!input || typeof input !== "object") return false;
  const honey = (input as Record<string, unknown>).companyWebsite;
  return typeof honey === "string" && honey.trim().length > 0;
}

export type ContactFormFieldErrors = Partial<
  Record<keyof ContactFormData, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(phone: string): string {
  return phone.replace(/[\s.\-()+]/g, "");
}

function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^\+?\d{6,15}$/.test(normalized);
}

export function validateContactForm(
  input: unknown,
): { ok: true; data: ContactFormData } | { ok: false; errors: ContactFormFieldErrors } {
  if (!input || typeof input !== "object") {
    const locale: Locale = "fr";
    return { ok: false, errors: { firstName: getContactFormCopy(locale).validation.invalidData } };
  }

  const body = input as Record<string, unknown>;
  const locale: Locale = body.locale === "en" ? "en" : "fr";
  const v = getContactFormCopy(locale).validation;
  const errors: ContactFormFieldErrors = {};

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const gdprConsent = body.gdprConsent === true;

  if (!firstName) errors.firstName = v.firstNameRequired;
  else if (firstName.length > 80) errors.firstName = v.firstNameTooLong;

  if (!lastName) errors.lastName = v.lastNameRequired;
  else if (lastName.length > 80) errors.lastName = v.lastNameTooLong;

  if (!email) errors.email = v.emailRequired;
  else if (!EMAIL_PATTERN.test(email)) errors.email = v.emailInvalid;

  if (phone && !isValidPhone(phone)) errors.phone = v.phoneInvalid;

  if (!gdprConsent) {
    errors.gdprConsent = v.gdprRequired;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: { firstName, lastName, email, phone, gdprConsent, locale },
  };
}

export function formatContactEmail(data: ContactFormData): {
  subject: string;
  text: string;
  html: string;
} {
  const phoneDisplay = data.phone || "—";
  const langTag = data.locale === "en" ? "EN" : "FR";
  const subject = `Nouveau contact Planory [${langTag}] — ${data.firstName} ${data.lastName}`;
  const text = [
    "Nouvelle demande de contact Planory",
    "",
    `Langue : ${langTag}`,
    `Prénom : ${data.firstName}`,
    `Nom : ${data.lastName}`,
    `Email : ${data.email}`,
    `Téléphone : ${phoneDisplay}`,
    "",
    "Consentement RGPD : oui",
  ].join("\n");

  const html = `
    <h2>Nouvelle demande de contact Planory</h2>
    <p><strong>Langue :</strong> ${langTag}</p>
    <p><strong>Prénom :</strong> ${escapeHtml(data.firstName)}</p>
    <p><strong>Nom :</strong> ${escapeHtml(data.lastName)}</p>
    <p><strong>Email :</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
    <p><strong>Téléphone :</strong> ${escapeHtml(phoneDisplay)}</p>
    <p><strong>Consentement RGPD :</strong> oui</p>
  `.trim();

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
