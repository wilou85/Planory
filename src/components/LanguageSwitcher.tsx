"use client";

import Link from "next/link";
import { FlagIcon } from "@/components/flags/FlagIcon";
import { usePublicPathname } from "@/components/usePublicPathname";
import { LOCALES, getLocaleFromPath, type Locale } from "@/lib/i18n";
import { getLanguageSwitchHref } from "@/lib/language-switch";

type LanguageSwitcherProps = {
  className?: string;
  /**
   * Header mobile : une seule pastille vers l’autre langue (ex. EN si FR),
   * pour laisser la place au wordmark + Contact.
   */
  compact?: boolean;
};

export function LanguageSwitcher({
  className = "",
  compact = false,
}: LanguageSwitcherProps) {
  const pathname = usePublicPathname();
  const current = getLocaleFromPath(pathname);

  if (compact) {
    const other = LOCALES.find((locale) => locale.code !== current) ?? LOCALES[0];
    const href = getLanguageSwitchHref(other.code, pathname);
    return (
      <Link
        href={href}
        hrefLang={other.htmlLang}
        title={other.label}
        aria-label={
          current === "en" ? `Switch to ${other.label}` : `Passer en ${other.label}`
        }
        className={`inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-white ring-1 ring-white/15 transition-colors hover:bg-white/15 sm:min-h-10 sm:px-3 ${className}`}
      >
        {other.code}
        <span className="sr-only">{other.label}</span>
      </Link>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 backdrop-blur-sm ${className}`}
      role="group"
      aria-label={current === "en" ? "Choose language" : "Choisir la langue"}
    >
      {LOCALES.map((locale) => {
        const isActive = current === locale.code;
        const href = getLanguageSwitchHref(locale.code, pathname);
        return (
          <Link
            key={locale.code}
            href={href}
            hrefLang={locale.htmlLang}
            aria-current={isActive ? "true" : undefined}
            title={locale.label}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium uppercase tracking-wide transition-colors sm:gap-2 sm:px-3.5 ${
              isActive
                ? "bg-white/15 text-white ring-1 ring-white/20"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FlagIcon code={locale.flagCode} />
            <span>{locale.code}</span>
            <span className="sr-only">{locale.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function useLocale(): Locale {
  return getLocaleFromPath(usePublicPathname());
}
