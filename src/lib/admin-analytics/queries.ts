import { db, getAnalyticsEnvironment } from "@/lib/db";
import { parseAnalyticsRange } from "@/lib/admin-analytics/range";
import {
  normalizeAnalyticsSummary,
  type AnalyticsSummary,
} from "@/lib/admin-analytics/summary";

export type SummaryQuery = (
  text: string,
  params?: unknown[],
) => Promise<{ rows: Record<string, unknown>[] }>;

export type SummaryDeps = {
  query?: SummaryQuery;
  environment?: string;
  now?: Date;
};

type CountRow = { type: string; count: string };

const EVENTS = "public.analytics_events";
const WINDOW = "environment = $1 AND created_at >= $2";
const PREVIOUS_WINDOW = "environment = $1 AND created_at >= $2 AND created_at < $3";

/** A session converts when it opens the contact e-mail or submits a lead-magnet form. */
const IS_CONVERSION = `(
  (type = 'cta_click' AND payload->>'funnel' = 'contact')
  OR (type = 'form_submit' AND payload->>'funnel' = 'lead_magnet')
)`;

const IS_KEY_PAGE = `(type = 'pageview' AND path ~ '^(/en)?/(produit|offre|secteurs|contact)(/|$)')`;

const LOCALE_OF_PATH = `CASE WHEN path = '/en' OR path LIKE '/en/%' THEN 'en' ELSE 'fr' END`;

const sessionsCte = (where: string) => `
  WITH s AS (
    SELECT
      session_id,
      MAX(visitor_id) AS visitor_id,
      COUNT(*) FILTER (WHERE type = 'pageview') AS pageviews,
      bool_or(${IS_KEY_PAGE}) AS key_page,
      bool_or(${IS_CONVERSION}) AS converted
    FROM ${EVENTS}
    WHERE ${where}
    GROUP BY session_id
  )`;

/** Throws on database errors: the route must report them, not show an empty dashboard. */
export async function fetchAnalyticsSummary(
  rangeInput: unknown,
  deps: SummaryDeps = {},
): Promise<AnalyticsSummary> {
  const query = deps.query ?? ((text, params) => db.query(text, params));
  const { range, days, since } = parseAnalyticsRange(rangeInput, deps.now);
  const environment = deps.environment ?? getAnalyticsEnvironment();
  const previousSince = new Date(since.getTime() - days * 24 * 60 * 60 * 1000);
  const params = [environment, since.toISOString()];
  const previousParams = [environment, previousSince.toISOString(), since.toISOString()];
  const rows = async <T>(sql: string, values: unknown[] = params) =>
    (await query(sql, values)).rows as T[];
  const countsByType = (list: CountRow[]) =>
    Object.fromEntries(list.map((row) => [row.type, row.count]));

  const [
    totals,
    sessionTotals,
    previousTotals,
    returning,
    devices,
    locales,
    topPages,
    sources,
    entryPages,
    leadCounts,
    magnets,
    contactCounts,
    contactSources,
    sectorCounts,
    bySector,
    webVitals,
    jsErrors,
    series,
  ] = await Promise.all([
    rows<Record<string, unknown>>(`
      SELECT
        COUNT(*) FILTER (WHERE type = 'pageview')::int AS pageviews,
        AVG(CASE WHEN type = 'page_time' AND jsonb_typeof(payload->'seconds') = 'number'
                 THEN (payload->>'seconds')::double precision END) AS avg_page_time_s,
        AVG(CASE WHEN type = 'scroll_depth' AND jsonb_typeof(payload->'depth') = 'number'
                 THEN (payload->>'depth')::double precision END) AS avg_scroll_depth
      FROM ${EVENTS}
      WHERE ${WINDOW}
    `),
    rows<Record<string, unknown>>(`
      ${sessionsCte(WINDOW)}
      SELECT
        COUNT(*)::int AS sessions,
        COUNT(DISTINCT visitor_id)::int AS visitors,
        COUNT(*) FILTER (WHERE converted)::int AS conversions,
        COUNT(*) FILTER (WHERE converted OR key_page OR pageviews >= 2)::int AS engaged_sessions
      FROM s
    `),
    rows<Record<string, unknown>>(
      `
      ${sessionsCte(PREVIOUS_WINDOW)}
      SELECT
        COUNT(*)::int AS sessions,
        COALESCE(SUM(pageviews), 0)::int AS pageviews,
        COUNT(DISTINCT visitor_id)::int AS visitors,
        COUNT(*) FILTER (WHERE converted)::int AS conversions
      FROM s
    `,
      previousParams,
    ),
    rows<Record<string, unknown>>(`
      SELECT COUNT(*)::int AS returning_visitors
      FROM (
        SELECT visitor_id
        FROM ${EVENTS}
        WHERE environment = $1
          AND visitor_id IN (
            SELECT DISTINCT visitor_id FROM ${EVENTS} WHERE ${WINDOW} AND visitor_id IS NOT NULL
          )
        GROUP BY visitor_id
        HAVING COUNT(DISTINCT session_id) > 1
      ) AS r
    `),
    rows(`
      ${sessionsCte(WINDOW)},
      session_devices AS (
        SELECT DISTINCT ON (session_id) session_id, COALESCE(device, 'unknown') AS device
        FROM ${EVENTS}
        WHERE ${WINDOW}
        ORDER BY session_id, created_at, id
      )
      SELECT device, COUNT(*)::int AS count
      FROM session_devices JOIN s USING (session_id)
      GROUP BY 1
      ORDER BY COUNT(*) DESC, 1
    `),
    rows(`
      SELECT ${LOCALE_OF_PATH} AS locale,
             COUNT(*)::int AS pageviews,
             COUNT(DISTINCT session_id)::int AS sessions
      FROM ${EVENTS}
      WHERE ${WINDOW} AND type = 'pageview'
      GROUP BY 1
      ORDER BY COUNT(*) DESC, 1
    `),
    rows(`
      SELECT COALESCE(path, '/') AS path, COUNT(*)::int AS pageviews
      FROM ${EVENTS}
      WHERE ${WINDOW} AND type = 'pageview'
      GROUP BY 1
      ORDER BY COUNT(*) DESC, 1
      LIMIT 15
    `),
    rows(`
      ${sessionsCte(WINDOW)},
      entries AS (
        SELECT DISTINCT ON (session_id)
          session_id, payload->>'source' AS source, payload->>'medium' AS medium
        FROM ${EVENTS}
        WHERE ${WINDOW} AND type = 'pageview' AND payload->>'entry' = 'true'
        ORDER BY session_id, created_at, id
      )
      SELECT COALESCE(entries.source, 'inconnue') AS source,
             COALESCE(entries.medium, 'inconnu') AS medium,
             COUNT(*)::int AS sessions,
             COUNT(*) FILTER (WHERE s.converted)::int AS conversions
      FROM s LEFT JOIN entries USING (session_id)
      GROUP BY 1, 2
      ORDER BY COUNT(*) DESC, 1, 2
      LIMIT 20
    `),
    rows(`
      ${sessionsCte(WINDOW)},
      firsts AS (
        SELECT DISTINCT ON (session_id) session_id, COALESCE(path, '/') AS path
        FROM ${EVENTS}
        WHERE ${WINDOW} AND type = 'pageview'
        ORDER BY session_id, created_at, id
      )
      SELECT firsts.path,
             COUNT(*)::int AS sessions,
             COUNT(*) FILTER (WHERE s.converted)::int AS conversions
      FROM firsts JOIN s USING (session_id)
      GROUP BY 1
      ORDER BY COUNT(*) DESC, 1
      LIMIT 15
    `),
    rows<CountRow>(`
      SELECT type, COUNT(*)::text AS count
      FROM ${EVENTS}
      WHERE ${WINDOW}
        AND type IN ('form_start', 'form_submit', 'form_error')
        AND payload->>'funnel' = 'lead_magnet'
      GROUP BY type
    `),
    rows(`
      SELECT COALESCE(payload->>'magnetSlug', 'unknown') AS "magnetSlug",
             COUNT(*)::int AS form_submit
      FROM ${EVENTS}
      WHERE ${WINDOW} AND type = 'form_submit' AND payload->>'funnel' = 'lead_magnet'
      GROUP BY 1
      ORDER BY COUNT(*) DESC, 1
      LIMIT 10
    `),
    rows<CountRow>(`
      SELECT type, COUNT(*)::text AS count
      FROM ${EVENTS}
      WHERE ${WINDOW} AND type IN ('cta_click', 'funnel_step') AND payload->>'funnel' = 'contact'
      GROUP BY type
    `),
    rows(`
      SELECT COALESCE(payload->>'source', 'inconnue') AS source, COUNT(*)::int AS count
      FROM ${EVENTS}
      WHERE ${WINDOW} AND type = 'cta_click' AND payload->>'funnel' = 'contact'
      GROUP BY 1
      ORDER BY COUNT(*) DESC, 1
    `),
    rows<CountRow>(`
      SELECT type, COUNT(*)::text AS count
      FROM ${EVENTS}
      WHERE ${WINDOW} AND type IN ('cta_click', 'funnel_step') AND payload->>'funnel' = 'sectors'
      GROUP BY type
    `),
    rows(`
      SELECT COALESCE(payload->>'sector', payload->>'source', 'unknown') AS sector,
             COUNT(*)::int AS count
      FROM ${EVENTS}
      WHERE ${WINDOW} AND type IN ('cta_click', 'funnel_step') AND payload->>'funnel' = 'sectors'
      GROUP BY 1
      ORDER BY COUNT(*) DESC, 1
      LIMIT 15
    `),
    rows(`
      SELECT payload->>'name' AS name,
             percentile_cont(0.75) WITHIN GROUP (ORDER BY (payload->>'value')::double precision) AS p75,
             COUNT(*)::int AS samples,
             AVG(CASE WHEN payload->>'rating' = 'good' THEN 1.0 ELSE 0.0 END)::double precision AS good_share
      FROM ${EVENTS}
      WHERE ${WINDOW}
        AND type = 'web_vital'
        AND jsonb_typeof(payload->'value') = 'number'
        AND payload->>'name' IS NOT NULL
      GROUP BY 1
      ORDER BY 1
    `),
    rows(`
      SELECT COALESCE(payload->>'message', '(sans message)') AS message,
             COUNT(*)::int AS count,
             COUNT(DISTINCT session_id)::int AS sessions,
             mode() WITHIN GROUP (ORDER BY path) AS path
      FROM ${EVENTS}
      WHERE ${WINDOW} AND type = 'js_error'
      GROUP BY 1
      ORDER BY COUNT(*) DESC, 1
      LIMIT 10
    `),
    rows(`
      SELECT
        to_char(date_trunc('day', created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS day,
        COUNT(*) FILTER (WHERE type = 'pageview')::int AS pageviews,
        COUNT(DISTINCT session_id)::int AS sessions
      FROM ${EVENTS}
      WHERE ${WINDOW}
      GROUP BY 1
      ORDER BY 1 ASC
    `),
  ]);

  const lead = countsByType(leadCounts);
  const contact = countsByType(contactCounts);
  const sectors = countsByType(sectorCounts);
  const total = totals[0] ?? {};
  const sessionTotal = sessionTotals[0] ?? {};

  return normalizeAnalyticsSummary({
    range,
    sessions: sessionTotal.sessions,
    pageviews: total.pageviews,
    visitors: sessionTotal.visitors,
    returning_visitors: returning[0]?.returning_visitors,
    engaged_sessions: sessionTotal.engaged_sessions,
    conversions: sessionTotal.conversions,
    avg_page_time_s: total.avg_page_time_s,
    avg_scroll_depth: total.avg_scroll_depth,
    previous: previousTotals[0],
    devices,
    locales,
    top_pages: topPages,
    sources,
    entry_pages: entryPages,
    contact_sources: contactSources,
    funnels: {
      lead_magnet: {
        form_start: lead.form_start,
        form_submit: lead.form_submit,
        form_error: lead.form_error,
        magnets,
      },
      contact: { cta_click: contact.cta_click, funnel_step: contact.funnel_step },
      sectors: { cta_click: sectors.cta_click, funnel_step: sectors.funnel_step, by_sector: bySector },
    },
    web_vitals: webVitals,
    js_errors: jsErrors,
    series,
  });
}
