import { NextResponse } from "next/server";
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

function getBrevoApiKey(): string | undefined {
  const key = process.env.BREVO_API_KEY?.trim();
  return key || undefined;
}

export function getContactEmailFrom(): string {
  return process.env.CONTACT_EMAIL_FROM ?? "Planory <noreply@planory.net>";
}

/** True si Brevo est configuré. */
export function isEmailConfigured(): boolean {
  return Boolean(getBrevoApiKey());
}

/** En local sans clé API : pas d’envoi, réponses “ok” côté routes. */
export function isEmailDevBypass(): boolean {
  return process.env.NODE_ENV === "development" && !isEmailConfigured();
}

const EMAIL_NOT_CONFIGURED = {
  fr: {
    dev: "Service email non configuré : ajoutez BREVO_API_KEY dans .env (voir .env.example).",
    prod: "Service email temporairement indisponible. Écrivez à contact@planory.net.",
  },
  en: {
    dev: "Email service not configured: add BREVO_API_KEY to .env (see .env.example).",
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
  if (/domain.*not verified|verify your domain|sender.*not valid|unrecognised|unrecognized/i.test(message)) {
    return "domain";
  }
  if (/only send.*own email|testing emails|sandbox/i.test(message)) return "sandbox";
  return "provider";
}

/** Message utilisateur à partir d’un échec d’envoi. */
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

function parseFromAddress(from: string): { name?: string; email: string } {
  const match = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    const name = match[1]?.trim();
    const email = match[2]?.trim();
    if (email) return name ? { name, email } : { email };
  }
  return { email: from.trim() };
}

async function sendViaBrevo(
  input: SendEmailInput,
  apiKey: string,
  to: string[],
): Promise<SendEmailResult> {
  const sender = parseFromAddress(input.from ?? getContactEmailFrom());
  const payload: Record<string, unknown> = {
    sender,
    to: to.map((email) => ({ email })),
    subject: input.subject,
    textContent: input.text,
    htmlContent: input.html,
  };
  if (input.replyTo) {
    payload.replyTo = { email: input.replyTo };
  }
  if (input.attachments?.length) {
    payload.attachment = input.attachments.map((a) => ({
      name: a.filename,
      content: a.content.toString("base64"),
    }));
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = `Brevo HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* keep status message */
    }
    return {
      ok: false,
      error: message,
      code: classifyProviderError(message),
    };
  }

  return { ok: true };
}

/** Envoi transactionnel via Brevo (`BREVO_API_KEY`). */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    return {
      ok: false,
      error: "Email provider not configured (BREVO_API_KEY missing).",
      code: "not_configured",
    };
  }

  const to = Array.isArray(input.to) ? input.to : [input.to];
  if (to.length === 0) {
    return { ok: false, error: "No recipients.", code: "provider" };
  }

  return sendViaBrevo(input, apiKey, to);
}
