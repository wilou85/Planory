export const CONTACT_SOURCES = [
  "header",
  "hero",
  "mobile_menu",
  "sticky_bar",
  "contact_section",
  "contact_section_email",
  "footer_email",
  "offer",
  "resources_hub",
  "article",
  "sector_hospital",
] as const;

export type ContactSource = (typeof CONTACT_SOURCES)[number] | `sector_${string}`;

export function contactClickPayload(source: ContactSource) {
  return { funnel: "contact", cta: "contact_mailto", source } as const;
}

type FormErrorDetail =
  | { stage: "validation"; fields: string }
  | { stage: "server"; status: number }
  | { stage: "network" };

/** Field names only: the submitted values may contain personal data. */
export function describeFormError(
  status: number | null,
  fieldErrors: Record<string, unknown> | undefined,
): FormErrorDetail {
  if (status === null) return { stage: "network" };
  const fields = Object.keys(fieldErrors ?? {});
  if (fields.length > 0) return { stage: "validation", fields: fields.join(",") };
  return { stage: "server", status };
}

export function leadMagnetPayload(magnetSlug: string, detail: FormErrorDetail | object = {}) {
  return { ...detail, funnel: "lead_magnet", magnetSlug } as const;
}
