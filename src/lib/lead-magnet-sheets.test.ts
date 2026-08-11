import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("appendLeadMagnetToSheet", () => {
  it("skips when webhook URL is missing", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "");
    const { appendLeadMagnetToSheet } = await import("@/lib/lead-magnet-sheets");

    const result = await appendLeadMagnetToSheet({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      role: "planificateur",
      sector: "hopital",
      gdprConsent: true,
      magnetSlug: "grille-excel-vs-logiciel",
      locale: "fr",
    });

    expect(result).toEqual({ ok: false, skipped: true, reason: "not_configured" });
  });
});
