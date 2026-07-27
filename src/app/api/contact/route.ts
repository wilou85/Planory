import { NextResponse } from "next/server";
import {
  formatContactEmail,
  isContactHoneypotTripped,
  validateContactForm,
} from "@/lib/contact";
import { getContactFormCopy } from "@/lib/get-content";
import type { Locale } from "@/lib/i18n";
import { getContactFormRecipients } from "@/lib/mail-recipients";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  emailNotConfiguredResponse,
  isEmailConfigured,
  isEmailDevBypass,
  sendEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const locale: Locale =
    body && typeof body === "object" && (body as Record<string, unknown>).locale === "en"
      ? "en"
      : "fr";
  const apiCopy = getContactFormCopy(locale);

  const ip = getClientIp(request);
  const rate = checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rate.ok) {
    return NextResponse.json(
      {
        error:
          locale === "en"
            ? "Too many requests. Please try again later."
            : "Trop de demandes. Réessayez plus tard.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSec) },
      },
    );
  }

  if (isContactHoneypotTripped(body)) {
    return NextResponse.json({ ok: true });
  }

  const result = validateContactForm(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: apiCopy.formErrorGeneric, fields: result.errors },
      { status: 400 },
    );
  }

  if (isEmailDevBypass()) {
    console.info("[contact] mode dev — email provider absent, pas d'email envoyé", result.data);
    return NextResponse.json({ ok: true, devBypass: true });
  }

  if (!isEmailConfigured()) {
    return emailNotConfiguredResponse(locale);
  }

  const recipients = getContactFormRecipients();
  if (recipients.length === 0) {
    console.error("[contact] aucun destinataire configuré");
    return emailNotConfiguredResponse(locale);
  }

  const { subject, text, html } = formatContactEmail(result.data);
  const sent = await sendEmail({
    to: recipients,
    replyTo: result.data.email,
    subject,
    text,
    html,
  });

  if (!sent.ok) {
    console.error("[contact]", sent.error);
    return NextResponse.json(
      {
        error:
          locale === "en"
            ? "Unable to send the message. Please try again later."
            : "Impossible d'envoyer le message. Réessayez plus tard.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
