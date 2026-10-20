import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  type AnalyticsConsent,
} from "@/lib/analytics/types";

export function parseConsentValue(raw: string | null | undefined): AnalyticsConsent {
  if (raw === "granted" || raw === "denied") return raw;
  return "unknown";
}

export function canCollectAnalytics(consent: AnalyticsConsent): boolean {
  return consent === "granted";
}

export function readStoredConsent(
  storage: Pick<Storage, "getItem"> | null | undefined,
): AnalyticsConsent {
  if (!storage) return "unknown";
  try {
    return parseConsentValue(storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY));
  } catch {
    return "unknown";
  }
}

export function writeStoredConsent(
  storage: Pick<Storage, "setItem"> | null | undefined,
  consent: Exclude<AnalyticsConsent, "unknown">,
): void {
  if (!storage) return;
  storage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
}
