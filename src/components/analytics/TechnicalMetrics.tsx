"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { createErrorReporter } from "@/lib/analytics/errors";
import { createWebVitalFilter } from "@/lib/analytics/web-vitals";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

const acceptWebVital = createWebVitalFilter();

/** Module-level so the callback reference never changes (Next would report metrics twice). */
const reportWebVital: ReportWebVitalsCallback = (metric) => {
  if (!acceptWebVital(metric)) return;
  void trackAnalyticsEvent("web_vital", {
    payload: { name: metric.name, value: metric.value, rating: metric.rating },
  });
};

const reportError = createErrorReporter();

export function TechnicalMetrics() {
  useReportWebVitals(reportWebVital);

  useEffect(() => {
    const send = (payload: ReturnType<typeof reportError>) => {
      if (payload) void trackAnalyticsEvent("js_error", { payload });
    };
    const onError = (event: ErrorEvent) =>
      send(reportError({ message: event.message, filename: event.filename, lineno: event.lineno }));
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason: unknown = event.reason;
      const message = reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason);
      send(reportError({ message: `Unhandled rejection: ${message}` }));
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
