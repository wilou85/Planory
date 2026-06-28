import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  LEAD_MAGNET_NOTIFICATION_RECIPIENTS,
  formatLeadMagnetTeamEmail,
  formatLeadMagnetUserEmail,
  loadLeadMagnetPdfAttachment,
  validateLeadMagnetForm,
} from "@/lib/lead-magnet";
import { getLeadMagnet, getLeadMagnetFormCopy } from "@/lib/lead-magnets";
import type { Locale } from "@/lib/i18n";
import {
  emailNotConfiguredResponse,
  getContactEmailFrom,
  getResendApiKey,
  isEmailDevBypass,
  resendErrorMessage,
} from "@/lib/email";

function resolveRequestLocale(body: unknown): Locale {
  if (body && typeof body === "object" && (body as Record<string, unknown>).locale === "en") {
    return "en";
  }
  return "fr";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const locale = "fr";
    return NextResponse.json(
      { error: getLeadMagnetFormCopy(locale).api.invalidBody },
      { status: 400 },
    );
  }

  const locale = resolveRequestLocale(body);
  const apiCopy = getLeadMagnetFormCopy(locale).api;

  const result = validateLeadMagnetForm(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: apiCopy.invalidFields, fields: result.errors },
      { status: 400 },
    );
  }

  const magnet = getLeadMagnet(result.data.magnetSlug, result.data.locale ?? "fr");
  if (!magnet) {
    return NextResponse.json({ error: apiCopy.notFound }, { status: 404 });
  }

  if (isEmailDevBypass()) {
    console.info("[lead-magnet] mode dev — RESEND_API_KEY absent, pas d'email envoyé", {
      ...result.data,
      magnet: magnet.slug,
    });
    return NextResponse.json({
      ok: true,
      downloadPath: magnet.downloadPath,
      devBypass: true,
    });
  }

  const apiKey = getResendApiKey();
  if (!apiKey) {
    return emailNotConfiguredResponse(locale);
  }

  const from = getContactEmailFrom();
  const teamEmail = formatLeadMagnetTeamEmail(result.data);
  const userEmail = formatLeadMagnetUserEmail(result.data);
  const pdfAttachment = loadLeadMagnetPdfAttachment(magnet);

  const resend = new Resend(apiKey);

  const userResult = await resend.emails.send({
    from,
    to: [result.data.email],
    replyTo: "contact@planory.net",
    subject: userEmail.subject,
    text: userEmail.text,
    html: userEmail.html,
    ...(pdfAttachment ? { attachments: [pdfAttachment] } : {}),
  });

  if (userResult.error) {
    console.error("[lead-magnet] user email", userResult.error);
    return NextResponse.json(
      {
        error: resendErrorMessage(userResult.error, apiCopy.emailSendFailed, locale),
        downloadPath: magnet.downloadPath,
        emailFailed: true,
      },
      { status: 502 },
    );
  }

  const teamResult = await resend.emails.send({
    from,
    to: [...LEAD_MAGNET_NOTIFICATION_RECIPIENTS],
    replyTo: result.data.email,
    subject: teamEmail.subject,
    text: teamEmail.text,
    html: teamEmail.html,
    ...(pdfAttachment ? { attachments: [pdfAttachment] } : {}),
  });

  if (teamResult.error) {
    console.error("[lead-magnet] team notification", teamResult.error);
  }

  return NextResponse.json({
    ok: true,
    downloadPath: magnet.downloadPath,
    teamNotifyFailed: Boolean(teamResult.error),
  });
}
