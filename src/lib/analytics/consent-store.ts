"use client";

import { useSyncExternalStore } from "react";
import {
  readStoredConsent,
  writeStoredConsent,
} from "@/lib/analytics/consent";
import type { AnalyticsConsent } from "@/lib/analytics/types";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function getClientConsent(): AnalyticsConsent {
  return readStoredConsent(window.localStorage);
}

/** Same on server and during hydration — avoids mismatch with localStorage. */
function getServerConsent(): AnalyticsConsent {
  return "unknown";
}

export function useAnalyticsConsent(): AnalyticsConsent {
  return useSyncExternalStore(subscribe, getClientConsent, getServerConsent);
}

/** false on SSR + first hydration paint; true after client commit. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function setStoredAnalyticsConsent(
  consent: Exclude<AnalyticsConsent, "unknown">,
): void {
  writeStoredConsent(window.localStorage, consent);
  listeners.forEach((listener) => listener());
}
