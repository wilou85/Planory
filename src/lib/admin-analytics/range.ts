export const ANALYTICS_RANGES = ["7d", "30d", "90d"] as const;

export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

export type ParsedAnalyticsRange = {
  range: AnalyticsRange;
  days: number;
  since: Date;
};

const DAYS_BY_RANGE: Record<AnalyticsRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export function parseAnalyticsRange(
  input: unknown,
  now: Date = new Date(),
): ParsedAnalyticsRange {
  const raw = typeof input === "string" ? input : "";
  const range: AnalyticsRange = ANALYTICS_RANGES.includes(raw as AnalyticsRange)
    ? (raw as AnalyticsRange)
    : "30d";
  const days = DAYS_BY_RANGE[range];
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { range, days, since };
}
