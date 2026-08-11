import { NextResponse } from "next/server";
import {
  validateLeadMagnetForm,
  type LeadMagnetDiagnosticSummary,
} from "@/lib/lead-magnet";
import { appendLeadMagnetToSheet } from "@/lib/lead-magnet-sheets";
import { getLeadMagnet, getLeadMagnetFormCopy } from "@/lib/lead-magnets";
import type { Locale } from "@/lib/i18n";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function resolveRequestLocale(body: unknown): Locale {
  if (body && typeof body === "object" && (body as Record<string, unknown>).locale === "en") {
    return "en";
  }
  return "fr";
}

function parseDiagnostic(body: unknown): LeadMagnetDiagnosticSummary | null {
  if (!body || typeof body !== "object") return null;
  const diagnostic = (body as Record<string, unknown>).diagnostic;
  if (!diagnostic || typeof diagnostic !== "object") return null;
  const d = diagnostic as Record<string, unknown>;
  if (typeof d.score !== "number" || typeof d.maxScore !== "number") return null;
  return {
    score: d.score,
    maxScore: d.maxScore,
    percentage: typeof d.percentage === "number" ? d.percentage : 0,
    zone: typeof d.zone === "string" ? d.zone : "",
    message: typeof d.message === "string" ? d.message : "",
    checkedLabels: Array.isArray(d.checkedLabels)
      ? d.checkedLabels.filter((x): x is string => typeof x === "string")
      : [],
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: getLeadMagnetFormCopy("fr").api.invalidBody },
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

  const diagnostic = parseDiagnostic(body);
  const sheet = await appendLeadMagnetToSheet(result.data, diagnostic);
  if (!sheet.ok && !sheet.skipped) {
    console.error("[lead-magnet] sheets append failed", sheet.error);
  }

  return NextResponse.json({
    ok: true,
    downloadPath: magnet.downloadPath,
    sheetsStored: sheet.ok,
    sheetsSkipped: !sheet.ok && sheet.skipped === true,
  });
}
