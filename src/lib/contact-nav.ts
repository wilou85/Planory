import { localizePath, type Locale } from "@/lib/i18n";

export const CONTACT_PATH = "/contact";

export function getContactPath(locale: Locale = "fr"): string {
  return localizePath(CONTACT_PATH, locale);
}
