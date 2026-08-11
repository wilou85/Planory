import type { LeadMagnetFormData } from "@/lib/lead-magnets/types";
import type { LeadMagnetDiagnosticSummary } from "@/lib/lead-magnet";

export type AppendLeadSheetResult =
  | { ok: true }
  | { ok: false; skipped: true; reason: "not_configured" }
  | { ok: false; skipped: false; error: string };

function getSheetsWebhookUrl(): string | undefined {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  return url || undefined;
}

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(getSheetsWebhookUrl());
}

/**
 * Envoie une ligne lead magnet vers un Google Apps Script
 * déployé en Web App (qui append dans la Sheet).
 */
export async function appendLeadMagnetToSheet(
  data: LeadMagnetFormData,
  diagnostic?: LeadMagnetDiagnosticSummary | null,
): Promise<AppendLeadSheetResult> {
  const webhookUrl = getSheetsWebhookUrl();
  if (!webhookUrl) {
    if (process.env.NODE_ENV === "production") {
      console.error("[lead-magnet] GOOGLE_SHEETS_WEBHOOK_URL manquant — lead non stocké");
    } else {
      console.info("[lead-magnet] Google Sheets non configuré — skip (dev)");
    }
    return { ok: false, skipped: true, reason: "not_configured" };
  }

  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim();

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({
        ...(secret ? { secret } : {}),
        createdAt: new Date().toISOString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        sector: data.sector,
        magnetSlug: data.magnetSlug,
        locale: data.locale ?? "fr",
        gdprConsent: data.gdprConsent,
        source: "lead-magnet-form",
        diagnosticScore: diagnostic?.score ?? "",
        diagnosticMaxScore: diagnostic?.maxScore ?? "",
        diagnosticPercentage: diagnostic?.percentage ?? "",
        diagnosticZone: diagnostic?.zone ?? "",
        diagnosticChecked: diagnostic?.checkedLabels?.join(" | ") ?? "",
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[lead-magnet] Google Sheets webhook HTTP", res.status, text.slice(0, 200));
      return { ok: false, skipped: false, error: `Sheets webhook HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[lead-magnet] Google Sheets webhook failed", message);
    return { ok: false, skipped: false, error: message };
  }
}
