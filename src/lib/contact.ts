export const CONTACT_FORM_RECIPIENTS = [
  "clementdeobaldia@gmail.com",
  "william.tran@planory.net",
] as const;

export type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gdprConsent: boolean;
};

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
    return { ok: false, errors: { firstName: "Données invalides." } };
  }

  const body = input as Record<string, unknown>;
  const errors: ContactFormFieldErrors = {};

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const gdprConsent = body.gdprConsent === true;

  if (!firstName) errors.firstName = "Le prénom est requis.";
  else if (firstName.length > 80) errors.firstName = "Prénom trop long.";

  if (!lastName) errors.lastName = "Le nom est requis.";
  else if (lastName.length > 80) errors.lastName = "Nom trop long.";

  if (!email) errors.email = "L'email est requis.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Email invalide.";

  if (!phone) errors.phone = "Le téléphone est requis.";
  else if (!isValidPhone(phone)) errors.phone = "Numéro de téléphone invalide.";

  if (!gdprConsent) {
    errors.gdprConsent = "Vous devez accepter le traitement de vos données.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: { firstName, lastName, email, phone, gdprConsent },
  };
}

export function formatContactEmail(data: ContactFormData): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `Nouveau contact Planory — ${data.firstName} ${data.lastName}`;
  const text = [
    "Nouvelle demande de contact Planory",
    "",
    `Prénom : ${data.firstName}`,
    `Nom : ${data.lastName}`,
    `Email : ${data.email}`,
    `Téléphone : ${data.phone}`,
    "",
    "Consentement RGPD : oui",
  ].join("\n");

  const html = `
    <h2>Nouvelle demande de contact Planory</h2>
    <p><strong>Prénom :</strong> ${escapeHtml(data.firstName)}</p>
    <p><strong>Nom :</strong> ${escapeHtml(data.lastName)}</p>
    <p><strong>Email :</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
    <p><strong>Téléphone :</strong> ${escapeHtml(data.phone)}</p>
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
