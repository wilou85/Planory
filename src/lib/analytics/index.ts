export { trackAnalyticsEvent } from "@/lib/analytics/client";
export {
  canCollectAnalytics,
  parseConsentValue,
  readStoredConsent,
  writeStoredConsent,
} from "@/lib/analytics/consent";
export { parseAnalyticsEvent, isConversionEvent } from "@/lib/analytics/validate";
export type {
  AnalyticsConsent,
  AnalyticsEvent,
  AnalyticsEventType,
} from "@/lib/analytics/types";
