function parseEmailList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;]/)
    .map((email) => email.trim())
    .filter((email) => email.length > 0 && email.includes("@"));
}

const FALLBACK_LEAD_MAGNET = [
  "william.tran@planory.net",
  "clementdeobaldia@gmail.com",
] as const;

/**
 * Notifications lead magnets.
 * Ordre : LEAD_MAGNET_NOTIFICATION_RECIPIENTS → CONTACT_FORM_RECIPIENTS (legacy) → fallback.
 */
export function getLeadMagnetNotificationRecipients(): string[] {
  const primary = parseEmailList(process.env.LEAD_MAGNET_NOTIFICATION_RECIPIENTS);
  if (primary.length > 0) return primary;

  const legacy = parseEmailList(process.env.CONTACT_FORM_RECIPIENTS);
  if (legacy.length > 0) return legacy;

  return [...FALLBACK_LEAD_MAGNET];
}
