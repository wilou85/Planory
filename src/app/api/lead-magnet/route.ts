import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  LEAD_MAGNET_NOTIFICATION_RECIPIENTS,
  formatLeadMagnetTeamEmail,
  formatLeadMagnetUserEmail,
  loadLeadMagnetPdfAttachment,
  validateLeadMagnetForm,
} from "@/lib/lead-magnet";
import { getLeadMagnet } from "@/lib/lead-magnets";
import {
  emailNotConfiguredResponse,
  getContactEmailFrom,
  getResendApiKey,
  isEmailDevBypass,
  resendErrorMessage,
} from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const result = validateLeadMagnetForm(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Champs invalides.", fields: result.errors },
      { status: 400 },
    );
  }

  const magnet = getLeadMagnet(result.data.magnetSlug);
  if (!magnet) {
    return NextResponse.json({ error: "Ressource introuvable." }, { status: 404 });
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
    return emailNotConfiguredResponse();
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
        error: resendErrorMessage(
          userResult.error,
          "Impossible d'envoyer l'email. Réessayez plus tard.",
        ),
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
