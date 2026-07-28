import { afterEach, describe, expect, it, vi } from "vitest";
import { __resetSupabaseAdminForTests } from "@/lib/supabase/admin";

afterEach(() => {
  __resetSupabaseAdminForTests();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("storeLeadMagnetSubmission", () => {
  it("skips when Supabase is not configured", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    const { storeLeadMagnetSubmission } = await import("@/lib/lead-magnet-store");

    const result = await storeLeadMagnetSubmission({
      data: {
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        role: "planificateur",
        sector: "hopital",
        gdprConsent: true,
        magnetSlug: "grille-excel-vs-logiciel",
        locale: "fr",
      },
      emailStatus: "failed",
    });

    expect(result).toEqual({ ok: false, skipped: true, reason: "not_configured" });
  });
});
