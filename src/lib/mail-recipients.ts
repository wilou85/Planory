function parseEmailList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;]/)
    .map((email) => email.trim())
    .filter((email) => email.length > 0 && email.includes("@"));
}

const FALLBACK_CONTACT = [
  "clementdeobaldia@gmail.com",
  "william.tran@planory.net",
] as const;

const FALLBACK_LEAD_MAGNET = [
  "william.tran@planory.net",
  "clementdeobaldia@gmail.com",
] as const;

/** Destinataires formulaire contact — `CONTACT_FORM_RECIPIENTS=a@x.com,b@y.com` */
export function getContactFormRecipients(): string[] {
  const fromEnv = parseEmailList(process.env.CONTACT_FORM_RECIPIENTS);
  return fromEnv.length > 0 ? fromEnv : [...FALLBACK_CONTACT];
}

/** Notifications lead magnets — `LEAD_MAGNET_NOTIFICATION_RECIPIENTS=...` */
export function getLeadMagnetNotificationRecipients(): string[] {
  const fromEnv = parseEmailList(process.env.LEAD_MAGNET_NOTIFICATION_RECIPIENTS);
  if (fromEnv.length > 0) return fromEnv;
  const contactEnv = parseEmailList(process.env.CONTACT_FORM_RECIPIENTS);
  return contactEnv.length > 0 ? contactEnv : [...FALLBACK_LEAD_MAGNET];
}
