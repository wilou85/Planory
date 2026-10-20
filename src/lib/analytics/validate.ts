import {
  ANALYTICS_EVENT_TYPES,
  ANALYTICS_FORBIDDEN_PAYLOAD_KEYS,
  type AnalyticsDevice,
  type AnalyticsEvent,
  type AnalyticsEventInput,
  type AnalyticsEventType,
} from "@/lib/analytics/types";

const ALLOWED = new Set<string>(ANALYTICS_EVENT_TYPES);
const FORBIDDEN = new Set<string>(ANALYTICS_FORBIDDEN_PAYLOAD_KEYS);

/** Measures averaged by the admin dashboard: anything else would skew or break the KPI. */
const NUMERIC_MEASURES: Partial<
  Record<AnalyticsEventType, { key: string; min: number; max: number }>
> = {
  page_time: { key: "seconds", min: 0, max: 86_400 },
  scroll_depth: { key: "depth", min: 0, max: 100 },
  web_vital: { key: "value", min: 0, max: 600_000 },
};

export const WEB_VITAL_NAMES = ["LCP", "INP", "CLS", "FCP", "TTFB"] as const;

const JS_ERROR_MESSAGE_MAX = 200;

/** Error messages can echo URLs or user input: keep them short and strip what could identify someone. */
export function scrubErrorMessage(message: string): string {
  return message
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "[email]")
    .replace(/(https?:\/\/[^\s?#]+)[?#]\S*/g, "$1")
    .slice(0, JS_ERROR_MESSAGE_MAX);
}

function hasValidMeasure(type: AnalyticsEventType, payload: Record<string, unknown>): boolean {
  if (type === "web_vital" && !(WEB_VITAL_NAMES as readonly unknown[]).includes(payload.name)) {
    return false;
  }
  const rule = NUMERIC_MEASURES[type];
  if (!rule) return true;
  const value = payload[rule.key];
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= rule.min &&
    value <= rule.max
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeDevice(value: string | null | undefined): AnalyticsDevice {
  if (value === "mobile" || value === "tablet" || value === "desktop") return value;
  return "unknown";
}

function sanitizePayload(
  payload: Record<string, unknown> | null | undefined,
): { ok: true; payload: Record<string, unknown> } | { ok: false; error: string } {
  if (payload == null) return { ok: true, payload: {} };
  if (!isPlainObject(payload)) {
    return { ok: false, error: "payload must be a plain object" };
  }

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (FORBIDDEN.has(key)) {
      return { ok: false, error: `payload must not include PII key: ${key}` };
    }
    clean[key] = value;
  }
  return { ok: true, payload: clean };
}

export function parseAnalyticsEvent(
  input: unknown,
): { ok: true; event: AnalyticsEvent } | { ok: false; error: string } {
  if (!isPlainObject(input)) {
    return { ok: false, error: "Invalid analytics event" };
  }

  const body = input as AnalyticsEventInput;

  if (typeof body.sessionId !== "string" || body.sessionId.trim().length === 0) {
    return { ok: false, error: "sessionId is required" };
  }

  if (typeof body.type !== "string" || !ALLOWED.has(body.type)) {
    return { ok: false, error: "Invalid analytics event type" };
  }

  if (
    body.path != null &&
    typeof body.path !== "string"
  ) {
    return { ok: false, error: "path must be a string" };
  }

  if (
    body.locale != null &&
    typeof body.locale !== "string"
  ) {
    return { ok: false, error: "locale must be a string" };
  }

  if (
    body.visitorId != null &&
    typeof body.visitorId !== "string"
  ) {
    return { ok: false, error: "visitorId must be a string" };
  }

  const payloadResult = sanitizePayload(
    body.payload === undefined ? {} : (body.payload as Record<string, unknown> | null),
  );
  if (!payloadResult.ok) return payloadResult;

  const type = body.type as AnalyticsEventType;
  if (!hasValidMeasure(type, payloadResult.payload)) {
    return { ok: false, error: `${type} requires a numeric measure within range` };
  }

  if (type === "js_error") {
    const message = payloadResult.payload.message;
    if (typeof message !== "string" || !message.trim()) {
      return { ok: false, error: "js_error requires a message" };
    }
    payloadResult.payload.message = scrubErrorMessage(message);
  }

  return {
    ok: true,
    event: {
      sessionId: body.sessionId.trim(),
      visitorId: body.visitorId?.trim() || null,
      type,
      path: body.path ?? null,
      locale: body.locale ?? null,
      device: normalizeDevice(body.device ?? null),
      payload: payloadResult.payload,
    },
  };
}

export function isConversionEvent(type: AnalyticsEventType): boolean {
  return (
    type === "form_submit" ||
    type === "cta_click" ||
    type === "funnel_step"
  );
}
