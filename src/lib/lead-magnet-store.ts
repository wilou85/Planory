import { createHash } from "node:crypto";
import type { LeadMagnetFormData } from "@/lib/lead-magnets/types";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export type LeadMagnetEmailStatus =
  | "pending"
  | "sent"
  | "failed"
  | "bypassed"
  | "skipped";

export type StoreLeadMagnetInput = {
  data: LeadMagnetFormData;
  emailStatus: LeadMagnetEmailStatus;
  /** IP brute — stockée hashée (SHA-256), jamais en clair. */
  ip?: string | null;
  userAgent?: string | null;
};

export type StoreLeadMagnetResult =
  | { ok: true; id: string }
  | { ok: false; skipped: true; reason: "not_configured" }
  | { ok: false; skipped: false; error: string };

function hashIp(ip: string | null | undefined): string | null {
  if (!ip || ip === "unknown") return null;
  return createHash("sha256").update(ip).digest("hex");
}

/**
 * Persiste un lead marketing dans Supabase.
 * Ne bloque pas l’utilisateur si Supabase n’est pas configuré (dev) :
 * en prod, log d’erreur fort — à surveiller.
 */
export async function storeLeadMagnetSubmission(
  input: StoreLeadMagnetInput,
): Promise<StoreLeadMagnetResult> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[lead-magnet] Supabase non configuré — lead perdu pour le marketing",
        { email: input.data.email, magnet: input.data.magnetSlug },
      );
    } else {
      console.info("[lead-magnet] Supabase absent — lead non persisté (dev)", {
        email: input.data.email,
        magnet: input.data.magnetSlug,
        emailStatus: input.emailStatus,
      });
    }
    return { ok: false, skipped: true, reason: "not_configured" };
  }

  const supabase = getSupabaseAdmin()!;
  const { data: row, error } = await supabase
    .from("lead_magnet_submissions")
    .insert({
      first_name: input.data.firstName,
      last_name: input.data.lastName,
      email: input.data.email.toLowerCase(),
      role: input.data.role,
      sector: input.data.sector,
      magnet_slug: input.data.magnetSlug,
      locale: input.data.locale ?? "fr",
      gdpr_consent: input.data.gdprConsent,
      email_status: input.emailStatus,
      source: "lead-magnet-form",
      user_agent: input.userAgent?.slice(0, 500) ?? null,
      ip_hash: hashIp(input.ip),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[lead-magnet] Supabase insert failed", error.message);
    return { ok: false, skipped: false, error: error.message };
  }

  return { ok: true, id: row.id as string };
}
