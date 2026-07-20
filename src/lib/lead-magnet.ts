import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import {
  getLeadMagnet,
  getLeadMagnetFormCopy,
  getLeadMagnetRoleLabels,
  getLeadMagnetSectorLabels,
} from "@/lib/lead-magnets";
import type { LeadMagnetDefinition } from "@/lib/lead-magnets/types";
import type {
  LeadMagnetFormData,
  LeadMagnetFormFieldErrors,
  LeadMagnetRole,
  LeadMagnetSector,
  LeadMagnetSlug,
} from "@/lib/lead-magnets/types";

export function loadLeadMagnetPdfAttachment(magnet: LeadMagnetDefinition): {
  filename: string;
  content: Buffer;
} | null {
  const relativePath = magnet.downloadPath.replace(/^\//, "");
  const absolutePath = join(process.cwd(), "public", relativePath);
  if (!existsSync(absolutePath)) {
    console.warn("[lead-magnet] PDF introuvable:", absolutePath);
    return null;
  }
  return {
    filename: magnet.downloadFileName,
    content: readFileSync(absolutePath),
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_ROLES = new Set<LeadMagnetRole>([
  "planificateur",
  "cadre-sante",
  "drh",
  "acheteur",
  "direction",
  "autre",
]);

const VALID_SECTORS = new Set<LeadMagnetSector>([
  "hopital",
  "industrie",
  "aeroport",
  "commerce",
  "services-publics",
  "autre",
]);

const VALID_SLUGS = new Set<LeadMagnetSlug>(["grille-excel-vs-logiciel"]);

function resolveLocale(value: unknown): Locale {
  return value === "en" ? "en" : "fr";
}

export function validateLeadMagnetForm(
  input: unknown,
): { ok: true; data: LeadMagnetFormData } | { ok: false; errors: LeadMagnetFormFieldErrors } {
  const locale =
    input && typeof input === "object" && (input as Record<string, unknown>).locale === "en"
      ? "en"
      : "fr";
  const v = getLeadMagnetFormCopy(locale).validation;

  if (!input || typeof input !== "object") {
    return { ok: false, errors: { firstName: v.invalidData } };
  }

  const body = input as Record<string, unknown>;
  const errors: LeadMagnetFormFieldErrors = {};

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const role = body.role as LeadMagnetRole;
  const sector = body.sector as LeadMagnetSector;
  const magnetSlug = body.magnetSlug as LeadMagnetSlug;
  const gdprConsent = body.gdprConsent === true;
  const resolvedLocale = resolveLocale(body.locale);

  if (!firstName) errors.firstName = v.firstNameRequired;
  else if (firstName.length > 80) errors.firstName = v.firstNameTooLong;

  if (!lastName) errors.lastName = v.lastNameRequired;
  else if (lastName.length > 80) errors.lastName = v.lastNameTooLong;

  if (!email) errors.email = v.emailRequired;
  else if (!EMAIL_PATTERN.test(email)) errors.email = v.emailInvalid;

  if (!VALID_ROLES.has(role)) errors.role = v.roleInvalid;
  if (!VALID_SECTORS.has(sector)) errors.sector = v.sectorInvalid;
  if (!VALID_SLUGS.has(magnetSlug)) errors.magnetSlug = v.magnetInvalid;

  if (!gdprConsent) {
    errors.gdprConsent = v.gdprRequired;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      email,
      role,
      sector,
      gdprConsent,
      magnetSlug,
      locale: resolvedLocale,
    },
  };
}

export function formatLeadMagnetTeamEmail(data: LeadMagnetFormData): {
  subject: string;
  text: string;
  html: string;
} {
  const locale = data.locale ?? "fr";
  const magnet = getLeadMagnet(data.magnetSlug, locale)!;
  const roleLabels = getLeadMagnetRoleLabels(locale);
  const sectorLabels = getLeadMagnetSectorLabels(locale);
  const roleLabel = roleLabels[data.role];
  const sectorLabel = sectorLabels[data.sector];

  const subject = `Lead magnet — ${data.email} — ${data.firstName} ${data.lastName}`;
  const text = [
    "Nouveau téléchargement lead magnet Planory",
    "",
    `Langue : ${locale === "en" ? "EN" : "FR"}`,
    `Email du contact : ${data.email}`,
    `Ressource : ${magnet.title}`,
    `Prénom : ${data.firstName}`,
    `Nom : ${data.lastName}`,
    `Email : ${data.email}`,
    `Fonction : ${roleLabel}`,
    `Secteur : ${sectorLabel}`,
    "",
    "Consentement RGPD : oui",
  ].join("\n");

  const html = `
    <h2>Nouveau téléchargement lead magnet</h2>
    <p><strong>Langue :</strong> ${locale === "en" ? "EN" : "FR"}</p>
    <p><strong>Email du contact :</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
    <p><strong>Ressource :</strong> ${escapeHtml(magnet.title)}</p>
    <p><strong>Prénom :</strong> ${escapeHtml(data.firstName)}</p>
    <p><strong>Nom :</strong> ${escapeHtml(data.lastName)}</p>
    <p><strong>Fonction :</strong> ${escapeHtml(roleLabel)}</p>
    <p><strong>Secteur :</strong> ${escapeHtml(sectorLabel)}</p>
    <p><strong>Consentement RGPD :</strong> oui</p>
  `.trim();

  return { subject, text, html };
}

export function formatLeadMagnetUserEmail(data: LeadMagnetFormData): {
  subject: string;
  text: string;
  html: string;
} {
  const locale = data.locale ?? "fr";
  const magnet = getLeadMagnet(data.magnetSlug, locale)!;
  const downloadUrl = `${SITE_URL}${magnet.downloadPath}`;
  const contactUrl = `${SITE_URL}${localizePath("/contact", locale)}`;

  if (locale === "en") {
    const subject = `Your Planory resource: ${magnet.title}`;
    const text = [
      `Hello ${data.firstName},`,
      "",
      "Thank you for your interest in Planory.",
      "",
      `Your PDF is attached to this email: ${magnet.title}`,
      `Backup link: ${downloadUrl}`,
      "",
      magnet.ctaAfterDownload,
      `Contact: ${contactUrl}`,
      "",
      "— The Planory team",
      "contact@planory.net",
    ].join("\n");

    const html = `
      <p>Hello ${escapeHtml(data.firstName)},</p>
      <p>Thank you for your interest in Planory.</p>
      <p><strong>${escapeHtml(magnet.title)}</strong></p>
      <p>The PDF is attached to this email. You can also download it here:</p>
      <p><a href="${downloadUrl}" style="display:inline-block;padding:12px 24px;background:#0ea5e9;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;">Download the resource</a></p>
      <p style="font-size:14px;color:#64748b;">Direct link: <a href="${downloadUrl}">${downloadUrl}</a></p>
      <p>${escapeHtml(magnet.ctaAfterDownload)}</p>
      <p><a href="${contactUrl}">Get in touch with Planory</a></p>
      <p style="margin-top:24px;font-size:14px;color:#64748b;">— The Planory team<br>contact@planory.net</p>
    `.trim();

    return { subject, text, html };
  }

  const subject = `Votre ressource Planory : ${magnet.title}`;
  const text = [
    `Bonjour ${data.firstName},`,
    "",
    "Merci pour votre intérêt pour Planory.",
    "",
    `Votre PDF est joint à cet email : ${magnet.title}`,
    `Lien de secours : ${downloadUrl}`,
    "",
    magnet.ctaAfterDownload,
    `Contact : ${contactUrl}`,
    "",
    "— L'équipe Planory",
    "contact@planory.net",
  ].join("\n");

  const html = `
    <p>Bonjour ${escapeHtml(data.firstName)},</p>
    <p>Merci pour votre intérêt pour Planory.</p>
    <p><strong>${escapeHtml(magnet.title)}</strong></p>
    <p>Le PDF est joint à cet email. Vous pouvez aussi le télécharger ici :</p>
    <p><a href="${downloadUrl}" style="display:inline-block;padding:12px 24px;background:#0ea5e9;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;">Télécharger la ressource</a></p>
    <p style="font-size:14px;color:#64748b;">Lien direct : <a href="${downloadUrl}">${downloadUrl}</a></p>
    <p>${escapeHtml(magnet.ctaAfterDownload)}</p>
    <p><a href="${contactUrl}">Prendre contact avec Planory</a></p>
    <p style="margin-top:24px;font-size:14px;color:#64748b;">— L'équipe Planory<br>contact@planory.net</p>
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
