import { NextResponse } from "next/server";

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

export function emailNotConfiguredResponse(): NextResponse {
  const message =
    process.env.NODE_ENV === "development"
      ? "Service email non configuré : ajoutez RESEND_API_KEY dans .env (voir .env.example)."
      : "Service email temporairement indisponible. Écrivez à contact@planory.net.";

  return NextResponse.json({ error: message }, { status: 503 });
}

/** Message utilisateur à partir d'une erreur Resend (domaine, sandbox, etc.) */
export function resendErrorMessage(
  error: ResendErrorLike | null | undefined,
  fallback: string,
): string {
  const msg = error?.message ?? "";
  if (!msg) return fallback;

  if (process.env.NODE_ENV === "development") {
    return msg;
  }

  if (/domain.*not verified|verify your domain/i.test(msg)) {
    return "Envoi email temporairement indisponible (domaine en vérification). Utilisez le téléchargement direct ci-dessous.";
  }

  if (/only send.*own email|testing emails/i.test(msg)) {
    return "Envoi email en cours de configuration. Utilisez le téléchargement direct ci-dessous.";
  }

  return fallback;
}
