/**
 * Analyse SEO concurrentielle via DataForSEO Labs
 * Usage: node tools/competitor-keyword-research.mjs
 * Env: DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dataforseoPost, LOCATIONS } from "./dataforseo-client.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "tools", "seo-out");

const COMPETITORS = [
  { domain: "lucca.fr", label: "Lucca", markets: ["fr"] },
  { domain: "holydis.com", label: "Holy-Dis", markets: ["fr", "en_us"] },
];

const PLANORY_SEEDS = [
  "logiciel planning équipe",
  "planification RH",
  "planning 24/7",
  "gestion astreintes",
  "planning hospitalier",
  "logiciel planning IA",
  "workforce scheduling software",
  "shift planning software",
];

const PLANORY_RELEVANCE =
  /planning|planification|horaire|plannings|quart|astreinte|garde|roulement|shift|schedule|roster|workforce|time management|planning équipe|planning personnel|planning industrie|planning hôpital|planning hospital|24.?7|optimisation planning|logiciel planning|gestion plannings|feuille de temps|pointage|WFM|workforce management/i;

const EXCLUDE =
  /^(lucca|holy.?dis|timesquare)\b|stage|emploi|recrutement offre|gratuit pdf|template excel|crack|login|connexion|wiki/i;

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

async function fetchRankedKeywords(domain, marketKey, limit = 300) {
  const market = LOCATIONS[marketKey];
  const { result, cost } = await dataforseoPost(
    "/dataforseo_labs/google/ranked_keywords/live",
    [
      {
        target: domain,
        location_code: market.location_code,
        language_code: market.language_code,
        item_types: ["organic"],
        limit,
        order_by: ["keyword_data.keyword_info.search_volume,desc"],
        filters: [
          ["ranked_serp_element.serp_item.rank_group", "<=", 30],
          "and",
          ["keyword_data.keyword_info.search_volume", ">", 20],
        ],
      },
    ],
  );

  const items = result?.[0]?.items ?? [];
  return {
    domain,
    market: market.label,
    language: market.language_code,
    cost,
    total: result?.[0]?.total_count ?? items.length,
    keywords: items.map(normalizeKeyword).filter((k) => k.keyword),
  };
}

async function fetchKeywordSuggestions(seed, marketKey, limit = 50) {
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

function scorePlanoryFit(keyword) {
  if (EXCLUDE.test(keyword)) return 0;
  if (!PLANORY_RELEVANCE.test(keyword)) return 0;
  return 1;
}

function planoryPageHint(keyword) {
  const k = keyword.toLowerCase();
  if (/faq|skynet|sirh|int[eé]gr|d[eé]ploi|comment|qu.?est/i.test(k)) return "/faq";
  if (/offre|prix|tarif|accompagn|autonome|d[eé]mo|contact/i.test(k)) return "/offre";
  if (/hôpital|hospital|a[eé]roport|industrie|commerce|retail|logistique|contact center|24.?7|astreinte|garde/i.test(k))
    return "/secteurs";
  if (/produit|logiciel|planning|planification|rh|ressource|skynet|module/i.test(k))
    return "/produit";
  return "/";
}

function toCsv(rows, columns) {
  const esc = (v) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(","), ...rows.map((r) => columns.map((c) => esc(r[c])).join(","))].join(
    "\n",
  );
}

function buildStrategyNotes() {
  return {
    lucca: {
      url: "https://www.lucca.fr/",
      strategy: [
        "Hub SIRH : 15 logiciels modulaires (Absences, Feuilles de temps, Paie, Talent…)",
        "Pages solutions + suites (Initiale, Conformité, Talent) = 1 intention par URL",
        "Blog + guides pratiques pour la longue traîne informational",
        "Title homepage orienté catégorie : « 15 Logiciels RH et administratifs »",
        "CTA répétés : Essayer / Nous contacter",
        "Maillage marketplace intégrations (300+ solutions)",
      ],
      planoryTakeaways: [
        "Répliquer la logique « 1 module = 1 page » : RH, Planning, Ressources, SKYNET",
        "Guides/blog sur contraintes métier (24/7, astreintes, conformité)",
        "Title catégorie + marque, pas seulement la marque",
      ],
    },
    holydis: {
      url: "https://www.holydis.com/",
      strategy: [
        "Produit Timesquare + pages par secteur (retail, contact center, logistique…)",
        "Positionnement vs Excel planning",
        "Multilingue FR / EN / ES",
        "Social proof : logos clients + témoignages vidéo",
        "Mots-clés WFM / schedule management / time management (EN)",
      ],
      planoryTakeaways: [
        "Pages secteur déjà en place — enrichir avec mots-clés Holy-Dis (planning magasin, WFM)",
        "Angle différenciant IA SKYNET vs optimisation classique",
        "Version EN prioritaire pour mêmes secteurs",
      ],
    },
  };
}

async function main() {
  loadEnvFile();
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("=== DataForSEO — Analyse Lucca & Holy-Dis ===\n");

  const allRanked = [];
  let totalCost = 0;

  for (const comp of COMPETITORS) {
    for (const market of comp.markets) {
      console.log(`→ Ranked keywords: ${comp.domain} (${market})…`);
      const data = await fetchRankedKeywords(comp.domain, market);
      totalCost += data.cost ?? 0;
      allRanked.push({ ...data, competitor: comp.label });
      console.log(`  ${data.keywords.length} mots-clés (total index: ${data.total})\n`);
    }
  }

  const relevant = allRanked.flatMap((batch) =>
    batch.keywords
      .filter((k) => scorePlanoryFit(k.keyword))
      .map((k) => ({
        ...k,
        competitor: batch.competitor,
        domain: batch.domain,
        market: batch.market,
        language: batch.language,
        planory_page: planoryPageHint(k.keyword),
      })),
  );

  relevant.sort((a, b) => b.search_volume - a.search_volume);

  const byKeyword = new Map();
  for (const row of relevant) {
    const key = row.keyword.toLowerCase();
    if (!byKeyword.has(key)) {
      byKeyword.set(key, { ...row, competitors: new Set([row.competitor]) });
    } else {
      byKeyword.get(key).competitors.add(row.competitor);
    }
  }

  const opportunities = [...byKeyword.values()]
    .map((r) => ({
      ...r,
      competitors: [...r.competitors].join(", "),
      competitor_count: r.competitors.size,
    }))
    .sort((a, b) => {
      if (b.competitor_count !== a.competitor_count) return b.competitor_count - a.competitor_count;
      return b.search_volume - a.search_volume;
    });

  console.log("→ Keyword suggestions (seeds Planory + top concurrents)…");
  const topSeeds = [
    ...PLANORY_SEEDS,
    ...opportunities.slice(0, 8).map((o) => o.keyword),
  ].slice(0, 12);

  const discovery = [];
  const seenDiscovery = new Set(opportunities.map((o) => o.keyword.toLowerCase()));

  for (const seed of topSeeds) {
    for (const market of ["fr", "en_us"]) {
      try {
        const data = await fetchKeywordSuggestions(seed, market, 30);
        totalCost += data.cost ?? 0;
        for (const k of data.keywords) {
          if (scorePlanoryFit(k.keyword) && !seenDiscovery.has(k.keyword.toLowerCase())) {
            seenDiscovery.add(k.keyword.toLowerCase());
            discovery.push({
              ...k,
              seed,
              market: LOCATIONS[market].label,
              language: LOCATIONS[market].language_code,
              planory_page: planoryPageHint(k.keyword),
              source: "keyword_suggestions",
            });
          }
        }
      } catch (e) {
        console.warn(`  skip seed "${seed}" (${market}): ${e.message}`);
      }
    }
  }

  discovery.sort((a, b) => b.search_volume - a.search_volume);

  const report = {
    generated_at: new Date().toISOString(),
    api_cost_usd_estimate: totalCost,
    strategy: buildStrategyNotes(),
    summary: {
      ranked_batches: allRanked.length,
      planory_relevant_from_competitors: opportunities.length,
      new_discovery_keywords: discovery.length,
      top_opportunity: opportunities[0] ?? null,
    },
    opportunities: opportunities.slice(0, 100),
    discovery: discovery.slice(0, 80),
    all_competitor_ranked_sample: allRanked.map((b) => ({
      domain: b.domain,
      market: b.market,
      top_20: b.keywords.slice(0, 20),
    })),
  };

  writeFileSync(join(OUT_DIR, "competitor-seo-report.json"), JSON.stringify(report, null, 2));

  writeFileSync(
    join(OUT_DIR, "planory-opportunities.csv"),
    toCsv(opportunities.slice(0, 150), [
      "keyword",
      "search_volume",
      "cpc",
      "competition",
      "intent",
      "rank",
      "competitors",
      "competitor_count",
      "domain",
      "url",
      "planory_page",
      "market",
    ]),
  );

  writeFileSync(
    join(OUT_DIR, "keyword-discovery.csv"),
    toCsv(discovery.slice(0, 100), [
      "keyword",
      "search_volume",
      "cpc",
      "competition",
      "seed",
      "market",
      "planory_page",
      "source",
    ]),
  );

  console.log("\n=== Résultats ===");
  console.log(`Coût API estimé : $${totalCost.toFixed(4)}`);
  console.log(`Opportunités Planory (depuis concurrents) : ${opportunities.length}`);
  console.log(`Nouveaux mots-clés (suggestions) : ${discovery.length}`);
  console.log(`\nFichiers : ${OUT_DIR}/`);
  console.log("  - competitor-seo-report.json");
  console.log("  - planory-opportunities.csv");
  console.log("  - keyword-discovery.csv\n");

  if (opportunities.length) {
    console.log("Top 10 opportunités :");
    for (const o of opportunities.slice(0, 10)) {
      console.log(
        `  • ${o.keyword} | vol ${o.search_volume} | pos ${o.rank} | ${o.competitors} → ${o.planory_page}`,
      );
    }
  }

  if (discovery.length) {
    console.log("\nTop 10 découvertes (hors classement concurrent direct) :");
    for (const d of discovery.slice(0, 10)) {
      console.log(`  • ${d.keyword} | vol ${d.search_volume} | seed: ${d.seed} → ${d.planory_page}`);
    }
  }
}

main().catch((err) => {
  console.error("\nErreur:", err.message);
  process.exit(1);
});
