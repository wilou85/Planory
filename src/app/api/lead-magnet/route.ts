import { NextResponse } from "next/server";
import {
  formatLeadMagnetTeamEmail,
  formatLeadMagnetUserEmail,
  loadLeadMagnetPdfAttachment,
  validateLeadMagnetForm,
} from "@/lib/lead-magnet";
import {
  storeLeadMagnetSubmission,
  type LeadMagnetEmailStatus,
} from "@/lib/lead-magnet-store";
import { getLeadMagnet, getLeadMagnetFormCopy } from "@/lib/lead-magnets";
import type { LeadMagnetFormData } from "@/lib/lead-magnets/types";
import type { Locale } from "@/lib/i18n";
import { getLeadMagnetNotificationRecipients } from "@/lib/mail-recipients";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  emailErrorMessage,
  emailNotConfiguredResponse,
  isEmailConfigured,
  isEmailDevBypass,
  sendEmail,
} from "@/lib/email";

function resolveRequestLocale(body: unknown): Locale {
  if (body && typeof body === "object" && (body as Record<string, unknown>).locale === "en") {
    return "en";
  }
  return "fr";
}

async function persistLead(opts: {
  data: LeadMagnetFormData;
  emailStatus: LeadMagnetEmailStatus;
  ip: string;
  request: Request;
}) {
  await storeLeadMagnetSubmission({
    data: opts.data,
    emailStatus: opts.emailStatus,
    ip: opts.ip,
    userAgent: opts.request.headers.get("user-agent"),
  });
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

  const ip = getClientIp(request);
  const rate = await checkRateLimit(`lead-magnet:${ip}`, { limit: 8, windowMs: 15 * 60 * 1000 });
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
    await persistLead({
      data: result.data,
      emailStatus: "bypassed",
      ip,
      request,
    });
    console.info("[lead-magnet] mode dev — email provider absent, pas d'email envoyé", {
      ...result.data,
      magnet: magnet.slug,
    });
    return NextResponse.json({
      ok: true,
      downloadPath: magnet.downloadPath,
      devBypass: true,
    });
  }

  if (!isEmailConfigured()) {
    await persistLead({
      data: result.data,
      emailStatus: "skipped",
      ip,
      request,
    });
    return emailNotConfiguredResponse(locale);
  }

  const teamEmail = formatLeadMagnetTeamEmail(result.data);
  const userEmail = formatLeadMagnetUserEmail(result.data);
  const pdfAttachment = loadLeadMagnetPdfAttachment(magnet);
  const attachments = pdfAttachment ? [pdfAttachment] : undefined;

  const userSent = await sendEmail({
    to: result.data.email,
    replyTo: "contact@planory.net",
    subject: userEmail.subject,
    text: userEmail.text,
    html: userEmail.html,
    attachments,
  });

  if (!userSent.ok) {
    console.error("[lead-magnet] user email", userSent.error);
    await persistLead({
      data: result.data,
      emailStatus: "failed",
      ip,
      request,
    });
    return NextResponse.json(
      {
        error: emailErrorMessage(userSent, apiCopy.emailSendFailed, locale),
        downloadPath: magnet.downloadPath,
        emailFailed: true,
      },
      { status: 502 },
    );
  }

  const teamSent = await sendEmail({
    to: getLeadMagnetNotificationRecipients(),
    replyTo: result.data.email,
    subject: teamEmail.subject,
    text: teamEmail.text,
    html: teamEmail.html,
    attachments,
  });

  if (!teamSent.ok) {
    console.error("[lead-magnet] team notification", teamSent.error);
  }

  await persistLead({
    data: result.data,
    emailStatus: "sent",
    ip,
    request,
  });

  return NextResponse.json({
    ok: true,
    downloadPath: magnet.downloadPath,
    teamNotifyFailed: !teamSent.ok,
  });
}
