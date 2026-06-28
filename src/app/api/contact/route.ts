import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  CONTACT_FORM_RECIPIENTS,
  formatContactEmail,
  validateContactForm,
} from "@/lib/contact";
import { getContactFormCopy } from "@/lib/get-content";
import type { Locale } from "@/lib/i18n";
import {
  emailNotConfiguredResponse,
  getContactEmailFrom,
  getResendApiKey,
  isEmailDevBypass,
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

  const result = validateContactForm(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: apiCopy.formErrorGeneric, fields: result.errors },
      { status: 400 },
    );
  }

  if (isEmailDevBypass()) {
    console.info("[contact] mode dev — RESEND_API_KEY absent, pas d'email envoyé", result.data);
    return NextResponse.json({ ok: true, devBypass: true });
  }

  const apiKey = getResendApiKey();
  if (!apiKey) {
    return emailNotConfiguredResponse(locale);
  }

  const from = getContactEmailFrom();
  const { subject, text, html } = formatContactEmail(result.data);

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [...CONTACT_FORM_RECIPIENTS],
    replyTo: result.data.email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[contact]", error);
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
