import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  CONTACT_FORM_RECIPIENTS,
  formatContactEmail,
  validateContactForm,
} from "@/lib/contact";
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
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const result = validateContactForm(body);
  if (!result.ok) {
    return NextResponse.json({ error: "Champs invalides.", fields: result.errors }, { status: 400 });
  }

  if (isEmailDevBypass()) {
    console.info("[contact] mode dev — RESEND_API_KEY absent, pas d'email envoyé", result.data);
    return NextResponse.json({ ok: true, devBypass: true });
  }

  const apiKey = getResendApiKey();
  if (!apiKey) {
    return emailNotConfiguredResponse();
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
      { error: "Impossible d'envoyer le message. Réessayez plus tard." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
