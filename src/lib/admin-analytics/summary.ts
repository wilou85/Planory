import type { AnalyticsRange } from "@/lib/admin-analytics/range";

export const ANALYTICS_SUMMARY_PII_KEYS = [
  "email",
  "firstName",
  "lastName",
  "phone",
  "password",
  "gdprConsent",
] as const;

export type DeviceBreakdown = { device: string; count: number };
export type TopPage = { path: string; pageviews: number };
export type SeriesPoint = { day: string; pageviews: number; sessions: number };
export type PeriodTotals = { sessions: number; pageviews: number; visitors: number; conversions: number };
export type LocaleBreakdown = { locale: string; pageviews: number; sessions: number };
export type SourceBreakdown = { source: string; medium: string; sessions: number; conversions: number };
export type EntryPage = { path: string; sessions: number; conversions: number };
export type WebVitalSummary = { name: string; p75: number; samples: number; good_share: number };
export type JsErrorSummary = { message: string; count: number; sessions: number; path: string };

export type AnalyticsSummary = {
  range: AnalyticsRange;
  sessions: number;
  pageviews: number;
  visitors: number;
  returning_visitors: number;
  engaged_sessions: number;
  conversions: number;
  conversion_rate: number;
  avg_page_time_s: number;
  avg_scroll_depth: number;
  previous: PeriodTotals;
  devices: DeviceBreakdown[];
  locales: LocaleBreakdown[];
  top_pages: TopPage[];
  sources: SourceBreakdown[];
  entry_pages: EntryPage[];
  contact_sources: { source: string; count: number }[];
  funnels: {
    lead_magnet: {
      form_start: number;
      form_submit: number;
      form_error: number;
      magnets: { magnetSlug: string; form_submit: number }[];
    };
    contact: { cta_click: number; funnel_step: number };
    sectors: {
      cta_click: number;
      funnel_step: number;
      by_sector: { sector: string; count: number }[];
    };
  };
  web_vitals: WebVitalSummary[];
  js_errors: JsErrorSummary[];
  series: SeriesPoint[];
};

function toFiniteNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function mapRows<T>(value: unknown, map: (row: Record<string, unknown>) => T): T[] {
  return Array.isArray(value) ? value.map((row) => map(asRecord(row))) : [];
}

export function emptyAnalyticsSummary(range: AnalyticsRange): AnalyticsSummary {
  return {
    range,
    sessions: 0,
    pageviews: 0,
    visitors: 0,
    returning_visitors: 0,
    engaged_sessions: 0,
    conversions: 0,
    conversion_rate: 0,
    avg_page_time_s: 0,
    avg_scroll_depth: 0,
    previous: { sessions: 0, pageviews: 0, visitors: 0, conversions: 0 },
    devices: [],
    locales: [],
    top_pages: [],
    sources: [],
    entry_pages: [],
    contact_sources: [],
    funnels: {
      lead_magnet: { form_start: 0, form_submit: 0, form_error: 0, magnets: [] },
      contact: { cta_click: 0, funnel_step: 0 },
      sectors: { cta_click: 0, funnel_step: 0, by_sector: [] },
    },
    web_vitals: [],
    js_errors: [],
    series: [],
  };
}

export function normalizeAnalyticsSummary(input: unknown): AnalyticsSummary {
  const raw = asRecord(input);
  const range =
    raw.range === "7d" || raw.range === "30d" || raw.range === "90d" ? raw.range : "30d";
  const base = emptyAnalyticsSummary(range);

  const funnelsRaw = asRecord(raw.funnels);
  const lead = asRecord(funnelsRaw.lead_magnet);
  const contact = asRecord(funnelsRaw.contact);
  const sectors = asRecord(funnelsRaw.sectors);
  const previous = asRecord(raw.previous);

  const sessions = toFiniteNumber(raw.sessions);
  const conversions = toFiniteNumber(raw.conversions);

  return {
    ...base,
    sessions,
    pageviews: toFiniteNumber(raw.pageviews),
    visitors: toFiniteNumber(raw.visitors),
    returning_visitors: toFiniteNumber(raw.returning_visitors),
    engaged_sessions: toFiniteNumber(raw.engaged_sessions),
    conversions,
    conversion_rate: sessions > 0 ? Math.min(1, conversions / sessions) : 0,
    avg_page_time_s: toFiniteNumber(raw.avg_page_time_s),
    avg_scroll_depth: toFiniteNumber(raw.avg_scroll_depth),
    previous: {
      sessions: toFiniteNumber(previous.sessions),
      pageviews: toFiniteNumber(previous.pageviews),
      visitors: toFiniteNumber(previous.visitors),
      conversions: toFiniteNumber(previous.conversions),
    },
    devices: mapRows(raw.devices, (r) => ({
      device: toString(r.device, "unknown"),
      count: toFiniteNumber(r.count),
    })).filter((d) => d.count > 0),
    locales: mapRows(raw.locales, (r) => ({
      locale: toString(r.locale, "fr"),
      pageviews: toFiniteNumber(r.pageviews),
      sessions: toFiniteNumber(r.sessions),
    })),
    top_pages: mapRows(raw.top_pages, (r) => ({
      path: toString(r.path, "/"),
      pageviews: toFiniteNumber(r.pageviews),
    })),
    sources: mapRows(raw.sources, (r) => ({
      source: toString(r.source, "inconnue"),
      medium: toString(r.medium, "inconnu"),
      sessions: toFiniteNumber(r.sessions),
      conversions: toFiniteNumber(r.conversions),
    })),
    entry_pages: mapRows(raw.entry_pages, (r) => ({
      path: toString(r.path, "/"),
      sessions: toFiniteNumber(r.sessions),
      conversions: toFiniteNumber(r.conversions),
    })),
    contact_sources: mapRows(raw.contact_sources, (r) => ({
      source: toString(r.source, "inconnue"),
      count: toFiniteNumber(r.count),
    })),
    funnels: {
      lead_magnet: {
        form_start: toFiniteNumber(lead.form_start),
        form_submit: toFiniteNumber(lead.form_submit),
        form_error: toFiniteNumber(lead.form_error),
        magnets: mapRows(lead.magnets, (r) => ({
          magnetSlug: toString(r.magnetSlug, "unknown"),
          form_submit: toFiniteNumber(r.form_submit),
        })),
      },
      contact: {
        cta_click: toFiniteNumber(contact.cta_click),
        funnel_step: toFiniteNumber(contact.funnel_step),
      },
      sectors: {
        cta_click: toFiniteNumber(sectors.cta_click),
        funnel_step: toFiniteNumber(sectors.funnel_step),
        by_sector: mapRows(sectors.by_sector, (r) => ({
          sector: toString(r.sector, "unknown"),
          count: toFiniteNumber(r.count),
        })),
      },
    },
    web_vitals: mapRows(raw.web_vitals, (r) => ({
      name: toString(r.name, "?"),
      p75: toFiniteNumber(r.p75),
      samples: toFiniteNumber(r.samples),
      good_share: Math.min(1, toFiniteNumber(r.good_share)),
    })),
    js_errors: mapRows(raw.js_errors, (r) => ({
      message: toString(r.message, "(sans message)"),
      count: toFiniteNumber(r.count),
      sessions: toFiniteNumber(r.sessions),
      path: toString(r.path, "/"),
    })),
    series: mapRows(raw.series, (r) => ({
      day: toString(r.day),
      pageviews: toFiniteNumber(r.pageviews),
      sessions: toFiniteNumber(r.sessions),
    })),
  };
}
