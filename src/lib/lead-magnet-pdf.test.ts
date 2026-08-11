import { describe, expect, it } from "vitest";
import { buildPersonalizedExcelDiagnosticPdf } from "@/lib/lead-magnet-pdf";

describe("buildPersonalizedExcelDiagnosticPdf", () => {
  it("builds a PDF that includes score interpretation", async () => {
    const bytes = await buildPersonalizedExcelDiagnosticPdf(
      {
        score: 12,
        maxScore: 28,
        percentage: 43,
        zone: "Zone orange",
        message:
          "Zone orange : des signaux d'alerte apparaissent. Anticipez un passage logiciel avant que le tableur ne devienne un risque opérationnel.",
        checkedLabels: ["Plus de 30 agents planifiés"],
        checkedIds: ["c1", "c3", "c8"],
      },
      "fr",
    );

    expect(bytes.byteLength).toBeGreaterThan(1000);
    const head = Buffer.from(bytes.slice(0, 5)).toString("utf8");
    expect(head).toBe("%PDF-");
  });
});
