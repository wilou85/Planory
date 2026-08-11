import { describe, expect, it } from "vitest";
import { validateLeadMagnetForm } from "@/lib/lead-magnet";

describe("validateLeadMagnetForm", () => {
  it("accepts a complete lead magnet payload", () => {
    const result = validateLeadMagnetForm({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      role: "planificateur",
      sector: "hopital",
      gdprConsent: true,
      magnetSlug: "grille-excel-vs-logiciel",
      locale: "fr",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.email).toBe("ada@example.com");
  });
});
