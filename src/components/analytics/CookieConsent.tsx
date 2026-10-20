"use client";

import Link from "next/link";
import {
  setStoredAnalyticsConsent,
  useAnalyticsConsent,
  useIsClient,
} from "@/lib/analytics/consent-store";
import type { AnalyticsConsent } from "@/lib/analytics/types";
import { useLocale } from "@/components/LanguageSwitcher";
import { localizePath } from "@/lib/i18n";

type CookieConsentProps = {
  onConsentChange?: (consent: AnalyticsConsent) => void;
};

const COPY = {
  fr: {
    title: "Mesure d’audience",
    body:
      "Nous utilisons des cookies analytiques internes pour comprendre les parcours (pages, CTA, formulaires). Aucune publicité tierce.",
    accept: "Accepter",
    decline: "Refuser",
    privacy: "Confidentialité",
  },
  en: {
    title: "Audience measurement",
    body:
      "We use first-party analytics cookies to understand journeys (pages, CTAs, forms). No third-party ads.",
    accept: "Accept",
    decline: "Decline",
    privacy: "Privacy",
  },
} as const;

export function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const locale = useLocale();
  const copy = COPY[locale] ?? COPY.fr;
  const isClient = useIsClient();
  const consent = useAnalyticsConsent();

  // Render nothing until after hydration so localStorage never diverges from SSR HTML.
  if (!isClient) return null;
  if (consent === "granted" || consent === "denied") return null;

  function choose(next: "granted" | "denied") {
    setStoredAnalyticsConsent(next);
    onConsentChange?.(next);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={copy.title}
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
      style={{ paddingBottom: "calc(1rem + var(--safe-bottom))" }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/10 bg-[#0c1220]/95 p-4 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{copy.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            {copy.body}{" "}
            <Link
              href={localizePath("/confidentialite", locale)}
              className="text-sky-400 hover:text-sky-300"
            >
              {copy.privacy}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="min-h-10 rounded-full border border-white/15 px-4 text-sm text-slate-300 hover:bg-white/5"
          >
            {copy.decline}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="min-h-10 rounded-full bg-white px-4 text-sm font-medium text-[#050a14] hover:bg-slate-100"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
