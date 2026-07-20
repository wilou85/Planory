import { notFound } from "next/navigation";
import { localizePath, type Locale } from "@/lib/i18n";

/** `generateStaticParams` commun à toutes les routes sous `[locale]`. */
export function generateLocaleStaticParams(): { locale: Locale }[] {
  return [{ locale: "fr" }, { locale: "en" }];
}

/** Valide le segment `[locale]` — 404 si ni `fr` ni `en`. */
export function parseLocaleParam(raw: string): Locale {
  if (raw === "fr" || raw === "en") return raw;
  notFound();
}

/** Résout et valide `params.locale` (Promise Next.js 15+). */
export async function resolveLocale(
  params: Promise<{ locale: string }> | { locale: string },
): Promise<Locale> {
  const { locale } = await params;
  return parseLocaleParam(locale);
}

/** Alias de `localizePath` — chemin public selon la locale. */
export function localePath(base: string, locale: Locale): string {
  return localizePath(base, locale);
}
