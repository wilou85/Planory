import { WEB_VITAL_NAMES } from "@/lib/analytics/validate";

type ReportedMetric = { name: string; value: number; navigationId?: string };

/**
 * `useReportWebVitals` never unregisters its listeners, so every remount (and React
 * StrictMode in dev) adds another one reporting the same measure.
 */
export function createWebVitalFilter() {
  const sent = new Set<string>();
  return (metric: ReportedMetric): boolean => {
    if (!(WEB_VITAL_NAMES as readonly string[]).includes(metric.name)) return false;
    const key = `${metric.name}|${metric.navigationId ?? ""}|${metric.value}`;
    if (sent.has(key)) return false;
    sent.add(key);
    return true;
  };
}
