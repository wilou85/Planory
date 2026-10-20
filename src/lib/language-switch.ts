import { localePath, type Locale } from "@/lib/i18n";
import { toPublicPathname } from "@/lib/public-path";

export function getLanguageSwitchHref(target: Locale, rawPathname: string): string {
  return localePath(target, toPublicPathname(rawPathname));
}
