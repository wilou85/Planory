"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { TechnicalMetrics } from "@/components/analytics/TechnicalMetrics";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { canCollectAnalytics } from "@/lib/analytics/consent";
import {
  useAnalyticsConsent,
  useIsClient,
} from "@/lib/analytics/consent-store";
import { toPublicPathname } from "@/lib/public-path";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = toPublicPathname(usePathname() || "/");
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isClient = useIsClient();
  const consent = useAnalyticsConsent();
  const pageEnteredAt = useRef(0);
  const maxScroll = useRef(0);

  useEffect(() => {
    if (!isClient || isAdmin) return;
    if (!canCollectAnalytics(consent)) return;

    pageEnteredAt.current = Date.now();
    maxScroll.current = 0;
    void trackAnalyticsEvent("pageview", { path: pathname });

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) return;
      const depth = Math.min(100, Math.round((doc.scrollTop / total) * 100));
      if (depth > maxScroll.current) maxScroll.current = depth;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      const seconds = Math.round((Date.now() - pageEnteredAt.current) / 1000);
      if (seconds > 0) {
        void trackAnalyticsEvent("page_time", {
          path: pathname,
          payload: { seconds },
        });
      }
      if (maxScroll.current > 0) {
        void trackAnalyticsEvent("scroll_depth", {
          path: pathname,
          payload: { depth: maxScroll.current },
        });
      }
    };
  }, [consent, pathname, isAdmin, isClient]);

  return (
    <>
      {children}
      {isAdmin ? null : (
        <>
          <CookieConsent />
          <TechnicalMetrics />
        </>
      )}
    </>
  );
}
