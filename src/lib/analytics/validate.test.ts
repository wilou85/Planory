import { describe, expect, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import {
  ANALYTICS_EVENT_TYPES,
  ANALYTICS_FORBIDDEN_PAYLOAD_KEYS,
} from "@/lib/analytics/types";
import { isConversionEvent, parseAnalyticsEvent } from "@/lib/analytics/validate";

const validBase = {
  sessionId: "sess_abc",
  type: "pageview",
  path: "/offre",
  locale: "fr",
  device: "desktop",
  payload: { referrer: "direct" },
};

describe("parseAnalyticsEvent invariants", () => {
  it("accepts every allowlisted event type with a sessionId and a valid payload", () => {
    const measures: Record<string, Record<string, unknown>> = {
      page_time: { seconds: 12 },
      scroll_depth: { depth: 60 },
      web_vital: { name: "LCP", value: 1800, rating: "good" },
      js_error: { message: "TypeError: x is undefined" },
    };
    assertInvariantForEach(
      [...ANALYTICS_EVENT_TYPES],
      (type) =>
        parseAnalyticsEvent({ ...validBase, type, payload: measures[type] ?? validBase.payload }).ok,
      (type) => `${type} must be accepted`,
    );
  });

  it("rejects events without a non-empty sessionId", () => {
    for (const sessionId of ["", "   ", null, undefined, 12]) {
      const result = parseAnalyticsEvent({ ...validBase, sessionId });
      assertInvariant(!result.ok, `sessionId=${JSON.stringify(sessionId)} must fail`);
    }
  });

  it("rejects unknown event types", () => {
    const result = parseAnalyticsEvent({ ...validBase, type: "heat_map_fake" });
    assertInvariant(!result.ok, "unknown type must fail");
  });

  it("never accepts PII keys in the payload", () => {
    assertInvariantForEach(
      [...ANALYTICS_FORBIDDEN_PAYLOAD_KEYS],
      (key) => {
        const result = parseAnalyticsEvent({
          ...validBase,
          type: "form_submit",
          payload: { [key]: "secret", magnetSlug: "grille-excel-vs-logiciel" },
        });
        return !result.ok;
      },
      (key) => `PII key ${key} must be rejected`,
    );
  });

  it("keeps conversion metadata without PII", () => {
    const result = parseAnalyticsEvent({
      ...validBase,
      type: "form_submit",
      payload: {
        funnel: "lead_magnet",
        magnetSlug: "grille-excel-vs-logiciel",
        sector: "hopital",
      },
    });
    assertInvariant(result.ok, "conversion metadata must be allowed");
    if (result.ok) {
      expect(result.event.payload).toEqual({
        funnel: "lead_magnet",
        magnetSlug: "grille-excel-vs-logiciel",
        sector: "hopital",
      });
    }
  });
});

describe("parseAnalyticsEvent numeric measure invariants", () => {
  const measures = [
    { type: "page_time", key: "seconds", valid: [0, 1, 12.5, 86_400], invalid: [-1, 86_401] },
    { type: "scroll_depth", key: "depth", valid: [0, 50, 100], invalid: [-1, 101] },
  ] as const;
  const notNumbers = ["abc", "10", null, true, {}, [], Number.NaN, Number.POSITIVE_INFINITY];

  it("accepts page_time / scroll_depth only with a finite in-range number", () => {
    for (const { type, key, valid, invalid } of measures) {
      assertInvariantForEach(
        [...valid],
        (value) => parseAnalyticsEvent({ ...validBase, type, payload: { [key]: value } }).ok,
        (value) => `${type}.${key}=${value} must be accepted`,
      );
      assertInvariantForEach(
        [...invalid, ...notNumbers],
        (value) => !parseAnalyticsEvent({ ...validBase, type, payload: { [key]: value } }).ok,
        (value) => `${type}.${key}=${JSON.stringify(value)} must be rejected`,
      );
      assertInvariant(
        !parseAnalyticsEvent({ ...validBase, type, payload: {} }).ok,
        `${type} without ${key} must be rejected`,
      );
    }
  });
});

describe("parseAnalyticsEvent technical event invariants", () => {
  const parse = (type: string, payload: Record<string, unknown>) =>
    parseAnalyticsEvent({ ...validBase, type, payload });

  it("only stores known web vitals with a finite non-negative value", () => {
    assertInvariantForEach(
      [
        { name: "LCP", value: 2400 },
        { name: "INP", value: 120 },
        { name: "CLS", value: 0.04 },
        { name: "FCP", value: 900 },
        { name: "TTFB", value: 300 },
      ],
      (payload) => parse("web_vital", payload).ok,
      (payload) => `${payload.name} must be accepted`,
    );
    assertInvariantForEach(
      [
        { name: "LCP", value: -1 },
        { name: "LCP", value: "1800" },
        { name: "LCP", value: Number.POSITIVE_INFINITY },
        { name: "FID", value: 10 },
        { value: 10 },
      ],
      (payload) => !parse("web_vital", payload).ok,
      (payload) => `${JSON.stringify(payload)} must be rejected`,
    );
  });

  it("stores JS error messages bounded and scrubbed of e-mails and URL queries", () => {
    const result = parse("js_error", {
      message: `Failed to fetch https://www.planory.net/api?token=abc for jean.dupont@example.com ${"x".repeat(500)}`,
      line: 12,
    });
    assertInvariant(result.ok, "a js_error with a message must be accepted");
    if (!result.ok) return;
    const message = String(result.event.payload.message);
    assertInvariant(message.length <= 200, "message must be truncated to 200 chars");
    assertInvariant(!message.includes("@") && !message.includes("token=abc"), "message must be scrubbed");
    expect(message.startsWith("Failed to fetch https://www.planory.net/api for [email]")).toBe(true);

    assertInvariantForEach(
      [{}, { message: "" }, { message: 42 }],
      (payload) => !parse("js_error", payload).ok,
      (payload) => `${JSON.stringify(payload)} must be rejected`,
    );
  });
});

describe("isConversionEvent invariants", () => {
  it("marks funnel and CTA outcomes as conversions", () => {
    assertInvariant(isConversionEvent("form_submit"), "form_submit");
    assertInvariant(isConversionEvent("cta_click"), "cta_click");
    assertInvariant(isConversionEvent("funnel_step"), "funnel_step");
    assertInvariant(!isConversionEvent("pageview"), "pageview is not a conversion");
  });
});
