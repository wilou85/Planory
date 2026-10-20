import { SignJWT, importPKCS8 } from "jose";
import { parseAnalyticsRange, type AnalyticsRange } from "@/lib/admin-analytics/range";

export type SearchConsoleConfig = {
  /** Property as shown in Search Console: `sc-domain:planory.net` or `https://www.planory.net/`. */
  siteUrl: string;
  clientEmail: string;
  privateKey: string;
};

export type SearchMetrics = { clicks: number; impressions: number; ctr: number; position: number };
export type SearchRow = SearchMetrics & { key: string };

export type SearchConsoleSummary =
  | { configured: false }
  | {
      configured: true;
      range: AnalyticsRange;
      startDate: string;
      endDate: string;
      totals: SearchMetrics;
      previous: SearchMetrics;
      queries: SearchRow[];
      pages: SearchRow[];
      series: { day: string; clicks: number; impressions: number }[];
    };

type Deps = {
  config?: SearchConsoleConfig | null;
  fetchImpl?: typeof fetch;
  now?: Date;
};

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_MS = 30 * 60 * 1000;

let cachedToken: { value: string; expiresAt: number } | null = null;
const summaryCache = new Map<string, { expiresAt: number; value: SearchConsoleSummary }>();

export function clearSearchConsoleCache() {
  cachedToken = null;
  summaryCache.clear();
}

export function readSearchConsoleConfig(
  env: Record<string, string | undefined> = process.env,
): SearchConsoleConfig | null {
  const siteUrl = env.GSC_SITE_URL?.trim();
  const clientEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!siteUrl || !clientEmail || !privateKey) return null;
  return { siteUrl, clientEmail, privateKey: `${privateKey}\n` };
}

async function getAccessToken(config: SearchConsoleConfig, fetchImpl: typeof fetch, now: Date) {
  if (cachedToken && cachedToken.expiresAt > now.getTime() + 60_000) return cachedToken.value;

  const key = await importPKCS8(config.privateKey, "RS256");
  const assertion = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(config.clientEmail)
    .setAudience(TOKEN_URL)
    .setIssuedAt(Math.floor(now.getTime() / 1000))
    .setExpirationTime(Math.floor(now.getTime() / 1000) + 3600)
    .sign(key);

  const response = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  });
  const body = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };
  if (!response.ok || !body.access_token) {
    throw new Error(`Google OAuth: ${body.error_description ?? response.status}`);
  }
  cachedToken = {
    value: body.access_token,
    expiresAt: now.getTime() + (body.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

function clampMetrics(row: Record<string, unknown>): SearchMetrics {
  const num = (value: unknown) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  return {
    clicks: num(row.clicks),
    impressions: num(row.impressions),
    ctr: Math.min(1, num(row.ctr)),
    position: num(row.position),
  };
}

function publicPath(page: string): string {
  try {
    return new URL(page).pathname || "/";
  } catch {
    return page;
  }
}

export async function fetchSearchConsoleSummary(
  rangeInput: unknown,
  deps: Deps = {},
): Promise<SearchConsoleSummary> {
  const config = deps.config === undefined ? readSearchConsoleConfig() : deps.config;
  if (!config) return { configured: false };

  const fetchImpl = deps.fetchImpl ?? fetch;
  const now = deps.now ?? new Date();
  const { range, days } = parseAnalyticsRange(rangeInput, now);

  const today = Date.parse(isoDay(now));
  const end = new Date(today - DAY_MS);
  const start = new Date(end.getTime() - (days - 1) * DAY_MS);
  const previousEnd = new Date(start.getTime() - DAY_MS);
  const previousStart = new Date(previousEnd.getTime() - (days - 1) * DAY_MS);

  const cacheKey = `${config.siteUrl}|${range}|${isoDay(end)}`;
  const cached = summaryCache.get(cacheKey);
  if (cached && cached.expiresAt > now.getTime()) return cached.value;

  const token = await getAccessToken(config, fetchImpl, now);
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    config.siteUrl,
  )}/searchAnalytics/query`;

  const search = async (from: Date, to: Date, dimension?: string, rowLimit = 10) => {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: isoDay(from),
        endDate: isoDay(to),
        dataState: "all",
        ...(dimension ? { dimensions: [dimension], rowLimit } : {}),
      }),
    });
    const body = (await response.json().catch(() => ({}))) as {
      rows?: Record<string, unknown>[];
      error?: { message?: string };
    };
    if (!response.ok) {
      throw new Error(`Search Console: ${body.error?.message ?? response.status}`);
    }
    return body.rows ?? [];
  };

  const toRows = (rows: Record<string, unknown>[], mapKey = (key: string) => key) =>
    rows.map((row) => ({
      key: mapKey(String((row.keys as unknown[] | undefined)?.[0] ?? "")),
      ...clampMetrics(row),
    }));

  const [totals, previous, queries, pages, series] = await Promise.all([
    search(start, end),
    search(previousStart, previousEnd),
    search(start, end, "query"),
    search(start, end, "page"),
    search(start, end, "date", days),
  ]);

  const value: SearchConsoleSummary = {
    configured: true,
    range,
    startDate: isoDay(start),
    endDate: isoDay(end),
    totals: clampMetrics(totals[0] ?? {}),
    previous: clampMetrics(previous[0] ?? {}),
    queries: toRows(queries),
    pages: toRows(pages, publicPath),
    series: toRows(series).map(({ key, clicks, impressions }) => ({ day: key, clicks, impressions })),
  };
  summaryCache.set(cacheKey, { expiresAt: now.getTime() + CACHE_TTL_MS, value });
  return value;
}
