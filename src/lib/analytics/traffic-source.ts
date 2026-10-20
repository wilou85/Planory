export const TRAFFIC_MEDIUMS = [
  "direct",
  "organic",
  "social",
  "ai",
  "referral",
  "email",
  "paid",
  "campaign",
] as const;

export type TrafficMedium = (typeof TRAFFIC_MEDIUMS)[number];

export type TrafficSource = {
  source: string;
  medium: TrafficMedium;
  campaign?: string;
  referrerHost?: string;
};

const INTERNAL_HOSTS = /(^|\.)planory\.net$|^localhost$|^127\.0\.0\.1$/;

/** Ordered: the first matching pattern wins (gemini.google.com before google). */
const KNOWN_HOSTS: { pattern: RegExp; source: string; medium: TrafficMedium }[] = [
  { pattern: /(^|\.)(chatgpt\.com|chat\.openai\.com)$/, source: "chatgpt", medium: "ai" },
  { pattern: /(^|\.)perplexity\.ai$/, source: "perplexity", medium: "ai" },
  { pattern: /(^|\.)claude\.ai$/, source: "claude", medium: "ai" },
  { pattern: /^gemini\.google\.com$/, source: "gemini", medium: "ai" },
  { pattern: /^copilot\.microsoft\.com$/, source: "copilot", medium: "ai" },
  { pattern: /(^|\.)google\.[a-z.]+$/, source: "google", medium: "organic" },
  { pattern: /(^|\.)bing\.com$/, source: "bing", medium: "organic" },
  { pattern: /(^|\.)duckduckgo\.com$/, source: "duckduckgo", medium: "organic" },
  { pattern: /(^|\.)qwant\.com$/, source: "qwant", medium: "organic" },
  { pattern: /(^|\.)ecosia\.org$/, source: "ecosia", medium: "organic" },
  { pattern: /(^|\.)yahoo\.[a-z.]+$/, source: "yahoo", medium: "organic" },
  { pattern: /(^|\.)(linkedin\.com|lnkd\.in)$/, source: "linkedin", medium: "social" },
  { pattern: /(^|\.)(facebook\.com|fb\.me)$/, source: "facebook", medium: "social" },
  { pattern: /(^|\.)(x\.com|twitter\.com|t\.co)$/, source: "x", medium: "social" },
  { pattern: /(^|\.)youtube\.com$/, source: "youtube", medium: "social" },
];

const UTM_MEDIUMS: { pattern: RegExp; medium: TrafficMedium }[] = [
  { pattern: /^(cpc|ppc|paid|paid[ _-]?\w*|display|cpm)$/, medium: "paid" },
  { pattern: /^(e-?mail|newsletter)$/, medium: "email" },
  { pattern: /^(social|social[ _-]?\w*)$/, medium: "social" },
  { pattern: /^organic$/, medium: "organic" },
  { pattern: /^referral$/, medium: "referral" },
];

function label(value: string | null, max: number): string | undefined {
  const clean = value?.trim().toLowerCase().replace(/[^a-z0-9._ -]/g, "").slice(0, max);
  return clean || undefined;
}

function referrerHostOf(referrer: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return host || undefined;
  } catch {
    return undefined;
  }
}

function classifyUtmMedium(raw: string | undefined): TrafficMedium {
  if (!raw) return "campaign";
  return UTM_MEDIUMS.find(({ pattern }) => pattern.test(raw))?.medium ?? "campaign";
}

export function classifyTrafficSource(input: { referrer: string; search: string }): TrafficSource {
  const params = new URLSearchParams(input.search);
  const host = referrerHostOf(input.referrer);
  const externalHost = host && !INTERNAL_HOSTS.test(host) ? host.slice(0, 60) : undefined;

  const utmSource = label(params.get("utm_source"), 60);
  const utmMedium = label(params.get("utm_medium"), 40);
  const campaign = label(params.get("utm_campaign"), 80);

  if (utmSource || utmMedium) {
    const known = externalHost ? KNOWN_HOSTS.find(({ pattern }) => pattern.test(externalHost)) : undefined;
    return {
      source: utmSource ?? known?.source ?? externalHost ?? "direct",
      medium: classifyUtmMedium(utmMedium),
      ...(campaign ? { campaign } : {}),
      ...(externalHost ? { referrerHost: externalHost } : {}),
    };
  }

  if (!externalHost) return { source: "direct", medium: "direct" };

  const known = KNOWN_HOSTS.find(({ pattern }) => pattern.test(externalHost));
  return known
    ? { source: known.source, medium: known.medium, referrerHost: externalHost }
    : { source: externalHost, medium: "referral", referrerHost: externalHost };
}
