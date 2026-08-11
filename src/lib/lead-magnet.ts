import type { Locale } from "@/lib/i18n";
import { getLeadMagnetFormCopy } from "@/lib/lead-magnets";
import type {
  LeadMagnetFormData,
  LeadMagnetFormFieldErrors,
  LeadMagnetRole,
  LeadMagnetSector,
  LeadMagnetSlug,
} from "@/lib/lead-magnets/types";

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

export type LeadMagnetDiagnosticSummary = {
  score: number;
  maxScore: number;
  percentage: number;
  zone: string;
  message: string;
  checkedLabels: string[];
};

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
