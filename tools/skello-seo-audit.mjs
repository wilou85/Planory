/**
 * Audit SEO Skello (skello.io) via DataForSEO Labs — focus mots-clés utiles Planory.
 * Usage: node tools/skello-seo-audit.mjs
 * Env: DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dataforseoPost, LOCATIONS } from "./dataforseo-client.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "tools", "seo-out");
const DOMAIN = "skello.io";

const PLANORY_RELEVANCE =
  /planning|planification|horaire|plannings|quart|astreinte|garde|roulement|shift|schedule|roster|workforce|time management|planning équipe|planning personnel|optimisation planning|logiciel planning|gestion plannings|feuille de temps|pointage|WFM|workforce management|GTA|gestion des temps|gestion du temps|badgeuse|pointeuse|planning social|contrainte|légal|paie|absence|temps de travail|équipes de terrain|staffing|prévision|forecast|RH|SIRH/i;

const EXCLUDE =
  /^(skello|kelio|lucca|payfit|factorial)\b|stage|emploi|recrutement|carri[eè]re|login|connexion|mot de passe|avis skello|skello avis|prix skello|tarif skello|skello login|application skello|skello app/i;

const PLANORY_SEEDS = [
  "logiciel planning équipe",
  "planification RH",
  "planning social",
  "gestion des temps",
  "logiciel GTA",
  "planning intelligent",
  "gestion contraintes légales planning",
  "workforce scheduling",
  "planning hôpital",
  "gestion astreintes",
];

function loadEnvFile() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

function normalizeKeyword(row) {
  const kd = row.keyword_data ?? {};
  const info = kd.keyword_info ?? {};
  const serp = row.ranked_serp_element?.serp_item ?? {};
  return {
    keyword: kd.keyword ?? "",
    search_volume: info.search_volume ?? 0,
    cpc: info.cpc ?? 0,
    competition: info.competition ?? 0,
    intent: kd.search_intent_info?.main_intent ?? "",
    rank: serp.rank_group ?? serp.rank_absolute ?? 999,
    url: serp.relative_url ?? serp.url ?? "",
    etv: row.ranked_serp_element?.serp_item?.etv ?? 0,
  };
}

async function fetchRankedKeywords(marketKey, limit = 500) {
  const market = LOCATIONS[marketKey];
  const { result, cost } = await dataforseoPost(
    "/dataforseo_labs/google/ranked_keywords/live",
    [
      {
        target: DOMAIN,
        location_code: market.location_code,
        language_code: market.language_code,
        item_types: ["organic"],
        limit,
        order_by: ["keyword_data.keyword_info.search_volume,desc"],
        filters: [
          ["ranked_serp_element.serp_item.rank_group", "<=", 50],
          "and",
          ["keyword_data.keyword_info.search_volume", ">", 10],
        ],
      },
    ],
  );
  const items = result?.[0]?.items ?? [];
  return {
    market: market.label,
    language: market.language_code,
    cost,
    total: result?.[0]?.total_count ?? items.length,
    keywords: items.map(normalizeKeyword).filter((k) => k.keyword),
  };
}

async function fetchDomainOverview(marketKey) {
  const market = LOCATIONS[marketKey];
  try {
    const { result, cost } = await dataforseoPost(
      "/dataforseo_labs/google/domain_rank_overview/live",
      [
        {
          target: DOMAIN,
          location_code: market.location_code,
          language_code: market.language_code,
        },
      ],
    );
    const item = result?.[0]?.items?.[0]?.metrics?.organic ?? null;
    return {
      cost,
      organic: item
        ? {
            pos_1: item.pos_1 ?? 0,
            pos_2_3: item.pos_2_3 ?? 0,
            pos_4_10: item.pos_4_10 ?? 0,
            pos_11_20: item.pos_11_20 ?? 0,
            pos_21_30: item.pos_21_30 ?? 0,
            etv: item.etv ?? 0,
            count: item.count ?? 0,
          }
        : null,
    };
  } catch (e) {
    console.warn(`overview skip: ${e.message}`);
    return { cost: 0, organic: null };
  }
}

async function fetchKeywordSuggestions(seed, marketKey, limit = 30) {
  const market = LOCATIONS[marketKey];
  const { result, cost } = await dataforseoPost(
    "/dataforseo_labs/google/keyword_suggestions/live",
    [
      {
        keyword: seed,
        location_code: market.location_code,
        language_code: market.language_code,
        include_clickstream_data: false,
        limit,
        order_by: ["keyword_info.search_volume,desc"],
      },
    ],
  );
  const items = result?.[0]?.items ?? [];
  return {
    seed,
    cost,
    keywords: items.map((item) => ({
      keyword: item.keyword ?? "",
      search_volume: item.keyword_info?.search_volume ?? 0,
      cpc: item.keyword_info?.cpc ?? 0,
      competition: item.keyword_info?.competition ?? 0,
    })),
  };
}

function planoryPageHint(keyword) {
  const k = keyword.toLowerCase();
  if (/hôpital|hospital|a[eé]roport|industrie|commerce|retail|24.?7|astreinte|garde|sant[eé]/i.test(k))
    return "/secteurs";
  if (/guide|blog|excel|astreinte|planning social|planification|amplitude|congé|rtt/i.test(k))
    return "/ressources";
  if (/offre|prix|tarif|d[eé]mo|contact/i.test(k)) return "/offre";
  if (/faq|sirh|int[eé]gr|d[eé]ploi/i.test(k)) return "/faq";
  if (/produit|logiciel|planning|planification|rh|gta|pointeuse|badgeuse|contrainte/i.test(k))
    return "/produit";
  return "/";
}

function classifyUrlPath(url) {
  const path = (url || "/").toLowerCase();
  if (/blog|actualit|news|article|magazine|ressource|guide|livre-blanc|webinar|ebook|centre-d-aide|help/.test(path))
    return "content";
  if (/secteur|expertise|metier|sante|hospital|industrie|retail|h[oô]tel|restaurant|commerce|pharmacie|construction/.test(path))
    return "sector";
  if (/produit|solution|fonction|planning|gestion|temps|badgeuse|pointeuse|logiciel|paie|absence/.test(path))
    return "product";
  if (/pricing|offre|tarif|prix/.test(path)) return "pricing";
  if (path === "/" || path.length < 2) return "homepage";
  return "other";
}

function opportunityScore(k) {
  // High volume, mid competition, Planory-fit, Skello not own-brand
  const vol = Math.log10((k.search_volume || 1) + 1);
  const easy = 1 - Math.min(k.competition ?? 0.5, 1);
  const rankGap = k.rank > 10 ? 1.2 : k.rank > 3 ? 0.8 : 0.4;
  return vol * (0.5 + easy) * rankGap * (k.cpc > 0.5 ? 1.15 : 1);
}

loadEnvFile();
mkdirSync(OUT_DIR, { recursive: true });

console.log("=== Audit SEO Skello (skello.io) — DataForSEO ===\n");

let totalCost = 0;
const overview = await fetchDomainOverview("fr");
totalCost += overview.cost || 0;
console.log("Overview FR:", overview.organic);

const ranked = await fetchRankedKeywords("fr", 500);
totalCost += ranked.cost || 0;
console.log(`Ranked keywords FR: ${ranked.keywords.length} (total_count≈${ranked.total}, cost=${ranked.cost})`);

const relevant = ranked.keywords
  .filter((k) => PLANORY_RELEVANCE.test(k.keyword) && !EXCLUDE.test(k.keyword))
  .map((k) => ({ ...k, page_hint: planoryPageHint(k.keyword), score: opportunityScore(k) }))
  .sort((a, b) => b.score - a.score);

const branded = ranked.keywords.filter((k) => /skello/i.test(k.keyword));
const nonBranded = ranked.keywords.filter((k) => !/skello/i.test(k.keyword));

const intentCounts = {};
for (const k of ranked.keywords) {
  const intent = k.intent || "unknown";
  intentCounts[intent] = (intentCounts[intent] || 0) + 1;
}

const urlTypes = {};
for (const k of ranked.keywords.slice(0, 150)) {
  const t = classifyUrlPath(k.url);
  urlTypes[t] = (urlTypes[t] || 0) + 1;
}

const topLandingPages = {};
for (const k of ranked.keywords) {
  if (!k.url || k.rank > 20) continue;
  const key = k.url.split("?")[0];
  if (!topLandingPages[key]) {
    topLandingPages[key] = { url: key, keywords: 0, totalVolume: 0, bestRank: 999 };
  }
  topLandingPages[key].keywords += 1;
  topLandingPages[key].totalVolume += k.search_volume;
  topLandingPages[key].bestRank = Math.min(topLandingPages[key].bestRank, k.rank);
}
const pages = Object.values(topLandingPages)
  .sort((a, b) => b.totalVolume - a.totalVolume)
  .slice(0, 15);

const suggestions = [];
for (const seed of PLANORY_SEEDS) {
  try {
    const s = await fetchKeywordSuggestions(seed, "fr", 25);
    totalCost += s.cost || 0;
    suggestions.push(s);
    console.log(`  suggestions « ${seed} »: ${s.keywords.length}`);
  } catch (e) {
    console.warn(`  suggestions fail « ${seed} »: ${e.message}`);
  }
}

const suggestionPool = suggestions
  .flatMap((s) => s.keywords.map((k) => ({ ...k, seed: s.seed })))
  .filter((k) => k.keyword && PLANORY_RELEVANCE.test(k.keyword) && !EXCLUDE.test(k.keyword));

const skelloKwSet = new Set(ranked.keywords.map((k) => k.keyword.toLowerCase()));
const whiteSpace = suggestionPool
  .filter((k) => !skelloKwSet.has(k.keyword.toLowerCase()))
  .sort((a, b) => b.search_volume - a.search_volume);

// Deduplicate white space
const seen = new Set();
const whiteSpaceDedup = [];
for (const k of whiteSpace) {
  const key = k.keyword.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  whiteSpaceDedup.push({ ...k, page_hint: planoryPageHint(k.keyword) });
}

const report = {
  generated_at: new Date().toISOString(),
  source: "DataForSEO Labs",
  domain: DOMAIN,
  url: "https://www.skello.io/",
  market: "France",
  total_cost_usd_approx: totalCost,
  overview: overview.organic,
  ranked_sample_size: ranked.keywords.length,
  ranked_total_count: ranked.total,
  branded_count: branded.length,
  non_branded_count: nonBranded.length,
  intent_counts: intentCounts,
  url_type_mix_top150: urlTypes,
  top_landing_pages: pages,
  top_by_volume: [...ranked.keywords]
    .sort((a, b) => b.search_volume - a.search_volume)
    .slice(0, 30),
  planory_relevant_opportunities: relevant.slice(0, 40),
  whitespace_vs_skello: whiteSpaceDedup.slice(0, 40),
  editorial_notes: {
    positioning:
      "Skello = SIRH / GTA terrain (CHR, retail, pharma…) — planning + pointage + paie + admin RH + IA",
    vs_planory:
      "Planory = planification réglementée 24/7 (hôpital, aéroport, industrie) avec IA SKYNET — pas un SIRH complet ni badgeuse",
    steal_patterns: [
      "Silos fonctionnalités granulaires (planning, contraintes légales, temps, absences)",
      "Pages secteur CHR/retail/pharma — Planory doit mirroir hôpital/aéroport/industrie",
      "Lead magnets + simulateur + blog + témoignages volume",
      "CTA démo + essai gratuit 14j — Planory a échange 20 min, pas d'essai self-serve",
    ],
  },
};

writeFileSync(join(OUT_DIR, "skello-seo-audit.json"), JSON.stringify(report, null, 2), "utf8");

const md = [];
md.push(`# Audit SEO Skello (skello.io) — opportunité Planory`);
md.push(`\nGénéré le ${report.generated_at.slice(0, 10)} via DataForSEO Labs (FR).\n`);
md.push(`## Visibilité organique (aperçu)`);
if (overview.organic) {
  const o = overview.organic;
  md.push(
    `- ~${o.count} mots-clés | ETV ~${Math.round(o.etv)} | Top1: ${o.pos_1} | Top2-3: ${o.pos_2_3} | Top4-10: ${o.pos_4_10}`,
  );
} else {
  md.push(`- Overview indisponible`);
}
md.push(`\nBranded / non-branded (échantillon): ${branded.length} / ${nonBranded.length}`);
md.push(`\n## Mix d'intentions (échantillon ranked)`);
for (const [k, v] of Object.entries(intentCounts).sort((a, b) => b[1] - a[1])) {
  md.push(`- ${k}: ${v}`);
}
md.push(`\n## Pages qui rankent le plus`);
for (const p of pages.slice(0, 10)) {
  md.push(`- \`${p.url}\` — ${p.keywords} kw, vol. cumulé ${p.totalVolume}, best #${p.bestRank}`);
}
md.push(`\n## Opportunités pertinentes Planory (Skello ranke déjà)`);
for (const k of relevant.slice(0, 25)) {
  md.push(
    `- \`${k.keyword}\` — vol. ${k.search_volume} | pos. ${k.rank} | CPC ${k.cpc} | → ${k.page_hint} | ${k.url}`,
  );
}
md.push(`\n## White space (suggestions seeds Planory, Skello absente de l'échantillon)`);
for (const k of whiteSpaceDedup.slice(0, 25)) {
  md.push(
    `- \`${k.keyword}\` — vol. ${k.search_volume} | CPC ${k.cpc} | seed « ${k.seed} » | → ${k.page_hint}`,
  );
}
md.push(`\n## Enseignements pour Planory`);
md.push(`- Skello capte GTA / pointage / paie / CHR-retail — **ne pas concurrencer sur badgeuse/paie**.`);
md.push(`- Voler les patterns : silos feature + secteurs + contenu conformité légale.`);
md.push(`- Cibler niches où Skello est faible : hôpital 24/7, astreintes, aéroport, optimisation IA réglementée.`);
md.push(`- Coût API run ≈ $${totalCost.toFixed(4)}`);

writeFileSync(join(OUT_DIR, "skello-seo-audit.md"), md.join("\n"), "utf8");
console.log(`\nWrote ${join(OUT_DIR, "skello-seo-audit.json")}`);
console.log(`Wrote ${join(OUT_DIR, "skello-seo-audit.md")}`);
console.log(`Approx API cost: $${totalCost.toFixed(4)}`);
