import { describe, expect, it } from "vitest";
import { assertInvariantForEach } from "@/lib/test/invariants";
import {
  CONTACT_SOURCES,
  contactClickPayload,
  describeFormError,
  leadMagnetPayload,
} from "@/lib/analytics/conversions";
import { parseAnalyticsEvent } from "@/lib/analytics/validate";
import { ANALYTICS_FORBIDDEN_PAYLOAD_KEYS } from "@/lib/analytics/types";

const accepted = (type: string, payload: Record<string, unknown>) =>
  parseAnalyticsEvent({ sessionId: "s", type, payload }).ok;

const hasNoPii = (payload: Record<string, unknown>) =>
  ANALYTICS_FORBIDDEN_PAYLOAD_KEYS.every((key) => !(key in payload));

describe("conversion payloads", () => {
  describe("invariants", () => {
    it("tags every contact click with the contact funnel and its source", () => {
      assertInvariantForEach(
        CONTACT_SOURCES,
        (source) => {
          const payload = contactClickPayload(source);
          return (
            payload.funnel === "contact" &&
            payload.source === source &&
            hasNoPii(payload) &&
            accepted("cta_click", payload)
          );
        },
        (source) => `contact click from ${source} must be a valid contact-funnel event`,
      );
    });

    it("tags every lead-magnet form event with the lead_magnet funnel and the magnet slug", () => {
      const cases = [
        leadMagnetPayload("grille-planning-excel"),
        leadMagnetPayload("grille-planning-excel", describeFormError(400, { email: "x" })),
        leadMagnetPayload("checklist", describeFormError(null, undefined)),
      ];
      assertInvariantForEach(
        cases,
        (payload) =>
          payload.funnel === "lead_magnet" &&
          typeof payload.magnetSlug === "string" &&
          hasNoPii(payload) &&
          accepted("form_error", payload),
        (payload) => `lead-magnet payload must be tagged and PII-free: ${JSON.stringify(payload)}`,
      );
    });

    it("describes form errors by field name only, never by submitted value", () => {
      const detail = describeFormError(400, { email: "bad@example.com", gdprConsent: "required" });
      expect(detail).toEqual({ stage: "validation", fields: "email,gdprConsent" });
      expect(JSON.stringify(detail)).not.toContain("@");
      expect(describeFormError(503, undefined)).toEqual({ stage: "server", status: 503 });
      expect(describeFormError(null, undefined)).toEqual({ stage: "network" });
    });
  });
});
