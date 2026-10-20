import {
  canCollectAnalytics,
  readStoredConsent,
} from "@/lib/analytics/consent";
import { createAnalyticsId, detectDevice } from "@/lib/analytics/ids";
import { resolveSession, type ResolvedSession } from "@/lib/analytics/session";
import { classifyTrafficSource } from "@/lib/analytics/traffic-source";
import {
  ANALYTICS_SESSION_STORAGE_KEY,
  ANALYTICS_VISITOR_STORAGE_KEY,
  type AnalyticsEventType,
} from "@/lib/analytics/types";

type TrackPayload = Record<string, unknown>;

type TrackOptions = {
  path?: string;
  locale?: string;
  payload?: TrackPayload;
  /** Bypass storage read — used by tests. */
  consent?: ReturnType<typeof readStoredConsent>;
  fetchImpl?: typeof fetch;
  storage?: Storage | null;
  now?: number;
  referrer?: string;
  search?: string;
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readOrCreateId(
  storage: Storage | null,
  key: string,
  prefix: string,
): string {
  if (!storage) return createAnalyticsId(prefix);
  try {
    const existing = storage.getItem(key);
    if (existing) return existing;
    const id = createAnalyticsId(prefix);
    storage.setItem(key, id);
    return id;
  } catch {
    return createAnalyticsId(prefix);
  }
}

function touchSession(storage: Storage | null, now: number): ResolvedSession {
  let raw: string | null = null;
  try {
    raw = storage?.getItem(ANALYTICS_SESSION_STORAGE_KEY) ?? null;
  } catch {
    raw = null;
  }
  const session = resolveSession(raw, now, () => createAnalyticsId("sess"));
  try {
    storage?.setItem(ANALYTICS_SESSION_STORAGE_KEY, session.stored);
  } catch {
    // Storage full or blocked: the session simply won't survive a reload.
  }
  return session;
}

export function getAnalyticsVisitorId(storage: Storage | null = getStorage()): string {
  return readOrCreateId(storage, ANALYTICS_VISITOR_STORAGE_KEY, "vis");
}

/**
 * Fire-and-forget analytics event. No-op unless consent is granted.
 * Never throws to callers.
 */
export async function trackAnalyticsEvent(
  type: AnalyticsEventType,
  options: TrackOptions = {},
): Promise<boolean> {
  const storage = options.storage === undefined ? getStorage() : options.storage;
  const consent = options.consent ?? readStoredConsent(storage);
  if (!canCollectAnalytics(consent)) return false;

  const fetchImpl = options.fetchImpl ?? (typeof fetch !== "undefined" ? fetch : undefined);
  if (!fetchImpl) return false;

  const path =
    options.path ??
    (typeof window !== "undefined" ? window.location.pathname : null);
  const locale =
    options.locale ??
    (typeof document !== "undefined" ? document.documentElement.lang : null);
  const device =
    typeof navigator !== "undefined"
      ? detectDevice(navigator.userAgent)
      : "unknown";

  const session = touchSession(storage, options.now ?? Date.now());
  const payload =
    type === "pageview" && session.isNew
      ? {
          ...options.payload,
          entry: true,
          ...classifyTrafficSource({
            referrer: options.referrer ?? (typeof document !== "undefined" ? document.referrer : ""),
            search: options.search ?? (typeof window !== "undefined" ? window.location.search : ""),
          }),
        }
      : (options.payload ?? {});

  try {
    const response = await fetchImpl("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session.id,
        visitorId: getAnalyticsVisitorId(storage),
        type,
        path,
        locale,
        device,
        payload,
      }),
      keepalive: true,
    });
    return response.ok || response.status === 204;
  } catch {
    return false;
  }
}
