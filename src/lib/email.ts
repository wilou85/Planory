import { NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n";

type ResendErrorLike = { message?: string; name?: string };

export function getResendApiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || undefined;
}

export function getContactEmailFrom(): string {
  return process.env.CONTACT_EMAIL_FROM ?? "Planory <onboarding@resend.dev>";
}

export function isEmailDevBypass(): boolean {
  return process.env.NODE_ENV === "development" && !getResendApiKey();
}

const EMAIL_NOT_CONFIGURED = {
  fr: {
    dev: "Service email non configuré : ajoutez RESEND_API_KEY dans .env (voir .env.example).",
    prod: "Service email temporairement indisponible. Écrivez à contact@planory.net.",
  },
  en: {
    dev: "Email service not configured: add RESEND_API_KEY to .env (see .env.example).",
    prod: "Email service temporarily unavailable. Write to contact@planory.net.",
  },
} as const;

export function emailNotConfiguredResponse(locale: Locale = "fr"): NextResponse {
  const copy = EMAIL_NOT_CONFIGURED[locale];
  const message =
    process.env.NODE_ENV === "development" ? copy.dev : copy.prod;

  return NextResponse.json({ error: message }, { status: 503 });
}

const RESEND_FALLBACK = {
  fr: {
    domain:
      "Envoi email temporairement indisponible (domaine en vérification). Utilisez le téléchargement direct ci-dessous.",
    sandbox:
      "Envoi email en cours de configuration. Utilisez le téléchargement direct ci-dessous.",
  },
  en: {
    domain:
      "Email delivery temporarily unavailable (domain verification in progress). Use the direct download below.",
    sandbox: "Email delivery being configured. Use the direct download below.",
  },
} as const;

/** Message utilisateur à partir d'une erreur Resend (domaine, sandbox, etc.) */
export function resendErrorMessage(
  error: ResendErrorLike | null | undefined,
  fallback: string,
  locale: Locale = "fr",
): string {
  const msg = error?.message ?? "";
  if (!msg) return fallback;

  if (process.env.NODE_ENV === "development") {
    return msg;
  }

  const copy = RESEND_FALLBACK[locale];

  if (/domain.*not verified|verify your domain/i.test(msg)) {
    return copy.domain;
  }

  if (/only send.*own email|testing emails/i.test(msg)) {
    return copy.sandbox;
  }

  return fallback;
}
