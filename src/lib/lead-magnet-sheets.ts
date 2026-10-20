import type { LeadMagnetDiagnosticSummary } from "@/lib/lead-magnet";
import type { ValidatedLeadMagnetForm } from "@/lib/lead-magnet";

/**
 * Stub: Google Sheets integration is not configured in this workspace copy.
 * Returns skipped so the lead-magnet API can still return the PDF.
 */
export async function appendLeadMagnetToSheet(
  _data: ValidatedLeadMagnetForm,
  _diagnostic: LeadMagnetDiagnosticSummary | null,
): Promise<{ ok: boolean; skipped?: boolean; error?: unknown }> {
  return { ok: true, skipped: true };
}
