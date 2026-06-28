import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL } from "@/lib/site";
import {
  getLeadMagnet,
  LEAD_MAGNET_ROLE_LABELS,
  LEAD_MAGNET_SECTOR_LABELS,
} from "@/lib/lead-magnets";
import type { LeadMagnetDefinition } from "@/lib/lead-magnets/types";
import type {
  LeadMagnetFormData,
  LeadMagnetFormFieldErrors,
  LeadMagnetRole,
  LeadMagnetSector,
  LeadMagnetSlug,
} from "@/lib/lead-magnets/types";

/** Notification interne à chaque téléchargement lead magnet */
export const LEAD_MAGNET_NOTIFICATION_RECIPIENTS = [
  "william.tran@planory.net",
  "clementdeobaldia@gmail.com",
] as const;

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

export function validateLeadMagnetForm(
  input: unknown,
): { ok: true; data: LeadMagnetFormData } | { ok: false; errors: LeadMagnetFormFieldErrors } {
  if (!input || typeof input !== "object") {
    return { ok: false, errors: { firstName: "Données invalides." } };
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

  if (!firstName) errors.firstName = "Le prénom est requis.";
  else if (firstName.length > 80) errors.firstName = "Prénom trop long.";

  if (!lastName) errors.lastName = "Le nom est requis.";
  else if (lastName.length > 80) errors.lastName = "Nom trop long.";

  if (!email) errors.email = "L'email est requis.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Email invalide.";

  if (!VALID_ROLES.has(role)) errors.role = "Fonction invalide.";
  if (!VALID_SECTORS.has(sector)) errors.sector = "Secteur invalide.";
  if (!VALID_SLUGS.has(magnetSlug)) errors.magnetSlug = "Ressource invalide.";

  if (!gdprConsent) {
    errors.gdprConsent = "Vous devez accepter le traitement de vos données.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: { firstName, lastName, email, role, sector, gdprConsent, magnetSlug },
  };
}

export function formatLeadMagnetTeamEmail(data: LeadMagnetFormData): {
  subject: string;
  text: string;
  html: string;
} {
  const magnet = getLeadMagnet(data.magnetSlug)!;
  const roleLabel = LEAD_MAGNET_ROLE_LABELS[data.role];
  const sectorLabel = LEAD_MAGNET_SECTOR_LABELS[data.sector];

  const subject = `Lead magnet — ${data.email} — ${data.firstName} ${data.lastName}`;
  const text = [
    "Nouveau téléchargement lead magnet Planory",
    "",
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
  const magnet = getLeadMagnet(data.magnetSlug)!;
  const downloadUrl = `${SITE_URL}${magnet.downloadPath}`;
  const contactUrl = `${SITE_URL}/contact`;

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
