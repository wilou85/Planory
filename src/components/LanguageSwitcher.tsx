"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlagIcon } from "@/components/flags/FlagIcon";
import { LOCALES, getLocaleFromPath, type Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const current = getLocaleFromPath(pathname);

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 backdrop-blur-sm ${className}`}
      role="group"
      aria-label="Choisir la langue"
    >
      {LOCALES.map((locale) => {
        const isActive = current === locale.code;
        return (
          <Link
            key={locale.code}
            href={locale.href}
            hrefLang={locale.htmlLang}
            aria-current={isActive ? "true" : undefined}
            title={locale.label}
            className={`inline-flex min-h-[28px] items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors sm:min-h-[30px] sm:gap-2 sm:px-3 sm:text-xs ${
              isActive
                ? "bg-white/15 text-white ring-1 ring-white/20"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FlagIcon code={locale.flagCode} />
            <span className="uppercase tracking-wide">{locale.code}</span>
            <span className="sr-only">{locale.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function useLocale(): Locale {
  const pathname = usePathname();
  return getLocaleFromPath(pathname);
}
