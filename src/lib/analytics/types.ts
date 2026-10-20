export const ANALYTICS_EVENT_TYPES = [
  "pageview",
  "page_time",
  "scroll_depth",
  "click",
  "rage_click",
  "dead_click",
  "cta_click",
  "funnel_step",
  "form_start",
  "form_submit",
  "form_error",
  "web_vital",
  "js_error",
  "session_end",
  "feedback",
  "returning_visit",
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export type AnalyticsConsent = "unknown" | "granted" | "denied";

export type AnalyticsDevice = "mobile" | "tablet" | "desktop" | "unknown";

export type AnalyticsEventInput = {
  sessionId: string;
  visitorId?: string | null;
  type: string;
  path?: string | null;
  locale?: string | null;
  device?: string | null;
  payload?: Record<string, unknown> | null;
};

export type AnalyticsEvent = {
  sessionId: string;
  visitorId: string | null;
  type: AnalyticsEventType;
  path: string | null;
  locale: string | null;
  device: AnalyticsDevice;
  payload: Record<string, unknown>;
};

/** Keys that must never appear in analytics payloads (PII / lead fields). */
export const ANALYTICS_FORBIDDEN_PAYLOAD_KEYS = [
  "email",
  "firstName",
  "lastName",
  "phone",
  "password",
  "gdprConsent",
] as const;

export const ANALYTICS_CONSENT_STORAGE_KEY = "planory_analytics_consent";
export const ANALYTICS_SESSION_STORAGE_KEY = "planory_analytics_session";
export const ANALYTICS_VISITOR_STORAGE_KEY = "planory_analytics_visitor";
