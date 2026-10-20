import { describe, it } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import {
  canCollectAnalytics,
  parseConsentValue,
  readStoredConsent,
  writeStoredConsent,
} from "@/lib/analytics/consent";
import { ANALYTICS_CONSENT_STORAGE_KEY } from "@/lib/analytics/types";

describe("analytics consent invariants", () => {
  it("only granted consent authorizes collection", () => {
    assertInvariant(!canCollectAnalytics("unknown"), "unknown must block");
    assertInvariant(!canCollectAnalytics("denied"), "denied must block");
    assertInvariant(canCollectAnalytics("granted"), "granted must allow");
  });

  it("parses only granted/denied as decisive choices", () => {
    assertInvariant(parseConsentValue("granted") === "granted", "granted");
    assertInvariant(parseConsentValue("denied") === "denied", "denied");
    assertInvariant(parseConsentValue("maybe") === "unknown", "maybe");
    assertInvariant(parseConsentValue(null) === "unknown", "null");
  });

  it("persists decisive consent under the Planory key", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    };

    writeStoredConsent(storage, "granted");
    assertInvariant(
      store.get(ANALYTICS_CONSENT_STORAGE_KEY) === "granted",
      "must write granted",
    );
    assertInvariant(readStoredConsent(storage) === "granted", "must read granted");

    writeStoredConsent(storage, "denied");
    assertInvariant(readStoredConsent(storage) === "denied", "must read denied");
  });
});
