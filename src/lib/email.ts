import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { Locale } from "@/lib/i18n";

export type EmailAttachment = {
  filename: string;
  content: Buffer;
};

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  /** Défaut : CONTACT_EMAIL_FROM */
  from?: string;
  attachments?: EmailAttachment[];
};

export type SendEmailResult =
  | { ok: true }
  | {
      ok: false;
      /** Message technique (logs / mode dev) */
      error: string;
      code: "not_configured" | "provider" | "domain" | "sandbox";
    };

function getResendApiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || undefined;
}

export function getContactEmailFrom(): string {
  return process.env.CONTACT_EMAIL_FROM ?? "Planory <onboarding@resend.dev>";
}

/** True si un provider est configuré (aujourd’hui : Resend). */
export function isEmailConfigured(): boolean {
  return Boolean(getResendApiKey());
}

/** En local sans clé API : pas d’envoi, réponses “ok” côté routes. */
export function isEmailDevBypass(): boolean {
  return process.env.NODE_ENV === "development" && !isEmailConfigured();
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

const PROVIDER_FALLBACK = {
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

function classifyProviderError(message: string): "provider" | "domain" | "sandbox" {
  if (/domain.*not verified|verify your domain/i.test(message)) return "domain";
  if (/only send.*own email|testing emails/i.test(message)) return "sandbox";
  return "provider";
}

/** Message utilisateur à partir d’un échec d’envoi (indépendant du provider). */
export function emailErrorMessage(
  result: Extract<SendEmailResult, { ok: false }> | null | undefined,
  fallback: string,
  locale: Locale = "fr",
): string {
  if (!result) return fallback;

  if (process.env.NODE_ENV === "development") {
    return result.error || fallback;
  }

  const copy = PROVIDER_FALLBACK[locale];
  if (result.code === "domain") return copy.domain;
  if (result.code === "sandbox") return copy.sandbox;
  return fallback;
}

/** @deprecated Préférer emailErrorMessage */
export function resendErrorMessage(
  error: { message?: string } | null | undefined,
  fallback: string,
  locale: Locale = "fr",
): string {
  if (!error?.message) return fallback;
  const code = classifyProviderError(error.message);
  return emailErrorMessage({ ok: false, error: error.message, code }, fallback, locale);
}

/**
 * Envoi transactionnel — provider actuel : Resend.
 * Changer d’implémentation ici (Brevo, SES…) sans toucher les routes API.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return {
      ok: false,
      error: "Email provider not configured (RESEND_API_KEY missing).",
      code: "not_configured",
    };
  }

  const to = Array.isArray(input.to) ? input.to : [input.to];
  if (to.length === 0) {
    return { ok: false, error: "No recipients.", code: "provider" };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: input.from ?? getContactEmailFrom(),
    to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
    ...(input.attachments?.length
      ? {
          attachments: input.attachments.map((a) => ({
            filename: a.filename,
            content: a.content,
          })),
        }
      : {}),
  });

  if (error) {
    const message = error.message ?? String(error);
    return {
      ok: false,
      error: message,
      code: classifyProviderError(message),
    };
  }

  return { ok: true };
}
