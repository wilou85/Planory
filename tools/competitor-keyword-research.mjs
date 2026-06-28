/**
 * Analyse SEO concurrentielle via DataForSEO Labs
 * Concurrents : Horoquartz, Asys, Kelio, Octime
 * Usage: npm run seo:competitors
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
  {
    domain: "horoquartz.com",
    label: "Horoquartz",
    url: "https://www.horoquartz.com/",
    markets: ["fr"],
    productLines: ["eTemptation (GTA & planning)", "Protecsys (sécurité)"],
  },
  {
    domain: "asys.fr",
    label: "Asys",
    url: "https://www.asys.fr/",
    markets: ["fr"],
    productLines: ["Chronos", "So'Horsys"],
  },
  {
    domain: "kelio.com",
    label: "Kelio",
    url: "https://www.kelio.com/",
    markets: ["fr", "en_us"],
    productLines: ["Kelio HRIS", "Planning", "Contrôle d'accès", "Matériel badgeuse"],
  },
  {
    domain: "octime.com",
    label: "Octime",
    url: "https://www.octime.com/",
    markets: ["fr"],
    productLines: ["Octime (GTA & planning)"],
  },
];

const PLANORY_SEEDS = [
  "logiciel planning équipe",
  "planification RH",
  "planning social",
  "planning 24/7",
  "gestion astreintes",
  "planning hospitalier",
  "logiciel planning IA",
  "gestion de planning",
  "optimisation planning",
  "workforce scheduling software",
  "healthcare workforce scheduling software",
];

const PLANORY_RELEVANCE =
  /planning|planification|horaire|plannings|quart|astreinte|garde|roulement|shift|schedule|roster|workforce|time management|planning équipe|planning personnel|planning industrie|planning hôpital|planning hospital|24.?7|optimisation planning|logiciel planning|gestion plannings|feuille de temps|pointage|WFM|workforce management|GTA|gestion des temps|gestion du temps|badgeuse|pointeuse|planning social/i;

const EXCLUDE =
  /^(horoquartz|asys|kelio|octime|etemptation|chronos|protecsys|lucca|holy.?dis|timesquare)\b|stage|emploi|recrutement|carri[eè]re|gratuit pdf|template excel|crack|login|connexion|wiki|mot de passe/i;

/** Notes éditoriales de référence (structure site observée) */
const EDITORIAL_BASELINE = {
  horoquartz: {
    pillars: [
      "Hub produit : Gestion des temps, Gestion de planning, Suivi d'activités, Sûreté-sécurité",
      "Pages expertises métiers (agro, banque, collectivités, industrie, transport…)",
      "Contenu : actualités, webinars, guides pratiques, livres blancs",
      "Social proof : 5 000 clients, témoignages marque (Alstom, Cdiscount…)",
      "Double offre logiciel + matériel (badgeuses, contrôle d'accès)",
    ],
    seoPatterns: [
      "Architecture silo par intention (temps / planning / activités / sécurité)",
      "Longue traîne via blog et ressources « Pour vous guider »",
      "Pages secteur pour capter requêtes métier",
    ],
  },
  asys: {
    pillars: [
      "Pilier GTA + planification (Chronos) avec pages fonctionnalités détaillées",
      "Secteurs : Santé, CHR, Industrie, Retail, Collectivités, Coop agricoles",
      "Ressources : blog, webinars, guides/ebooks, veille légale, modèles CDC",
      "FAQ structurée + preuve presse (Les Echos, planification hospitalière IA)",
      "Intégrations SIRH/paie mises en avant (100+ connecteurs)",
    ],
    seoPatterns: [
      "Landing catégorie « logiciel RH / GTA » + sous-pages par feature",
      "Autorité santé/hôpital (Chronos planning médical)",
      "Lead magnets : guides, démo, webinars",
    ],
  },
  kelio: {
    pillars: [
      "Suite HRIS : Workforce management, HR admin, Talent, Access control",
      "Hardware + software (badgeuses, lecteurs) — contenu produit riche",
      "Multilingue (FR, EN, DE, ES, NL, PT…)",
      "FAQ longue sur homepage (schema-friendly)",
      "Social proof internationale (20 000 clients, logos enterprise)",
    ],
    seoPatterns: [
      "Pages features granulaires (planning, absences, pointage, remote…)",
      "Contenu EN fort (workforce management, time and attendance)",
      "Blog + ressources par pays/marché",
    ],
  },
  octime: {
    pillars: [
      "Éditeur français GTA & planning (PME à ETI)",
      "Modules temps, planning, absences, activités",
      "Références secteur public et privé",
    ],
    seoPatterns: [
      "Pages solutions par taille d'entreprise",
      "Contenu conformité / législation travail",
      "Blog et ressources RH",
    ],
  },
};

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

async function fetchRankedKeywords(domain, marketKey, limit = 400) {
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
          ["keyword_data.keyword_info.search_volume", ">", 10],
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

async function fetchDomainOverview(domain, marketKey) {
  const market = LOCATIONS[marketKey];
  try {
    const { result, cost } = await dataforseoPost(
      "/dataforseo_labs/google/domain_rank_overview/live",
      [
        {
          target: domain,
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
            estimated_paid_traffic_cost: item.estimated_paid_traffic_cost ?? 0,
          }
        : null,
    };
  } catch (e) {
    console.warn(`  domain overview skip ${domain}: ${e.message}`);
    return { cost: 0, organic: null };
  }
}

async function fetchKeywordSuggestions(seed, marketKey, limit = 40) {
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
  if (/hôpital|hospital|a[eé]roport|industrie|commerce|retail|logistique|contact center|24.?7|astreinte|garde|sant[eé]/i.test(k))
    return "/secteurs";
  if (/ressource|guide|blog|excel|astreinte|planning social|planification/i.test(k))
    return "/ressources";
  if (/produit|logiciel|planning|planification|rh|skynet|module|GTA|pointeuse|badgeuse/i.test(k))
    return "/produit";
  return "/";
}

function classifyUrlPath(url) {
  const path = (url || "/").toLowerCase();
  if (/blog|actualit|news|article|magazine|ressource|guide|livre-blanc|webinar|ebook/.test(path))
    return "content";
  if (/secteur|expertise|metier|sante|hospital|industrie|retail|collectiv|agro|transport/.test(path))
    return "sector";
  if (/produit|solution|fonction|planning|gestion|temps|badgeuse|pointeuse|logiciel/.test(path))
    return "product";
  if (/faq|question|aide|support/.test(path)) return "faq";
  if (path === "/" || path.length < 2) return "homepage";
  return "other";
}

function analyzeCompetitorFromData(comp, batches) {
  const baseline = EDITORIAL_BASELINE[comp.label.toLowerCase()] ?? {
    pillars: [],
    seoPatterns: [],
  };
  const keywords = batches.flatMap((b) => b.keywords.map((k) => ({ ...k, market: b.market })));

  const topByVolume = [...keywords].sort((a, b) => b.search_volume - a.search_volume).slice(0, 25);
  const planningKeywords = keywords
    .filter((k) => PLANORY_RELEVANCE.test(k.keyword))
    .sort((a, b) => b.search_volume - a.search_volume)
    .slice(0, 20);

  const intentCounts = {};
  for (const k of keywords) {
    const intent = k.intent || "unknown";
    intentCounts[intent] = (intentCounts[intent] || 0) + 1;
  }

  const urlTypes = {};
  for (const k of keywords.slice(0, 100)) {
    const t = classifyUrlPath(k.url);
    urlTypes[t] = (urlTypes[t] || 0) + 1;
  }

  const topLandingPages = {};
  for (const k of keywords) {
    if (!k.url || k.rank > 15) continue;
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
    .slice(0, 12);

  const inferredStrategy = [];
  if ((urlTypes.content ?? 0) > 5)
    inferredStrategy.push("Fort investissement contenu (blog, guides, webinars) pour la longue traîne");
  if ((urlTypes.sector ?? 0) > 3)
    inferredStrategy.push("Pages secteur / expertises métiers pour requêtes verticalisées");
  if ((urlTypes.product ?? 0) > 8)
    inferredStrategy.push("Architecture produit : landing + sous-pages par fonctionnalité");
  if ((intentCounts.commercial ?? 0) > (intentCounts.informational ?? 0))
    inferredStrategy.push("Mix SEO orienté conversion (intention commerciale dominante)");
  else if ((intentCounts.informational ?? 0) > 10)
    inferredStrategy.push("Mix SEO éditorial (informationnel) + nurturing via ressources");

  const planoryTakeaways = [];
  if (planningKeywords.some((k) => /hôpital|hospital|sant[eé]|medical/.test(k.keyword)))
    planoryTakeaways.push("Santé/hôpital : opportunité contenu planning hospitalier + 12h");
  if (planningKeywords.some((k) => /pointeuse|badgeuse|GTA|gestion des temps/.test(k.keyword)))
    planoryTakeaways.push("GTA/pointage : différencier Planory sur planification avancée 24/7, pas le pointage");
  if (planningKeywords.some((k) => /planning social|planification/.test(k.keyword)))
    planoryTakeaways.push("Cibler planification RH / planning social sur /produit et articles dédiés");
  if (batches.some((b) => b.language === "en"))
    planoryTakeaways.push("Renforcer /en sur workforce scheduling & healthcare scheduling");
  planoryTakeaways.push("SKYNET = angle IA vs optimisation classique (Asys/Kelio/Horoquartz)");

  return {
    domain: comp.domain,
    url: comp.url,
    label: comp.label,
    productLines: comp.productLines,
    editorialBaseline: baseline,
    organicKeywordsSampled: keywords.length,
    intentMix: intentCounts,
    landingPageTypes: urlTypes,
    inferredStrategy,
    topKeywords: topByVolume,
    topPlanningKeywords: planningKeywords,
    topLandingPages: pages,
    planoryTakeaways,
  };
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

function buildStrategiesMarkdown(strategies, summaries) {
  const lines = [
    "# Stratégies SEO concurrentes — Horoquartz, Asys, Kelio, Octime",
    "",
    `Généré le ${new Date().toISOString().slice(0, 10)} via DataForSEO Labs.`,
    "",
  ];

  for (const s of strategies) {
    const overview = summaries.find((o) => o.domain === s.domain);
    lines.push(`## ${s.label} (${s.domain})`);
    lines.push("");
    lines.push(`Site : ${s.url}`);
    lines.push("");
    if (overview?.organic) {
      const o = overview.organic;
      lines.push(
        `**Visibilité organique (aperçu)** : ~${o.count} mots-clés indexés | ETV ~${Math.round(o.etv)} | Top 3 : ${(o.pos_1 ?? 0) + (o.pos_2_3 ?? 0)}`,
      );
      lines.push("");
    }
    lines.push("### Structure éditoriale observée");
    for (const p of s.editorialBaseline.pillars ?? []) lines.push(`- ${p}`);
    lines.push("");
    lines.push("### Patterns SEO (site + données SERP)");
    for (const p of [...(s.editorialBaseline.seoPatterns ?? []), ...s.inferredStrategy])
      lines.push(`- ${p}`);
    lines.push("");
    lines.push("### Top mots-clés planification / GTA (volume)");
    for (const k of s.topPlanningKeywords.slice(0, 8)) {
      lines.push(`- \`${k.keyword}\` — vol. ${k.search_volume} | pos. ${k.rank} | ${k.url}`);
    }
    lines.push("");
    lines.push("### Pages qui rankent le plus (landing)");
    for (const p of s.topLandingPages.slice(0, 6)) {
      lines.push(`- ${p.url} (${p.keywords} kw, vol. cumulé ${p.totalVolume})`);
    }
    lines.push("");
    lines.push("### Enseignements pour Planory");
    for (const t of s.planoryTakeaways) lines.push(`- ${t}`);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  loadEnvFile();
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("=== DataForSEO — Horoquartz, Asys, Kelio, Octime ===\n");

  const allRanked = [];
  const domainOverviews = [];
  let totalCost = 0;

  for (const comp of COMPETITORS) {
    for (const market of comp.markets) {
      console.log(`→ Ranked keywords: ${comp.domain} (${market})…`);
      const data = await fetchRankedKeywords(comp.domain, market);
      totalCost += data.cost ?? 0;
      allRanked.push({ ...data, competitor: comp.label, competitorMeta: comp });
      console.log(`  ${data.keywords.length} mots-clés (index total: ${data.total})\n`);
    }

    console.log(`→ Domain overview: ${comp.domain} (fr)…`);
    const overview = await fetchDomainOverview(comp.domain, "fr");
    totalCost += overview.cost ?? 0;
    domainOverviews.push({ domain: comp.domain, label: comp.label, ...overview });
  }

  const strategies = COMPETITORS.map((comp) => {
    const batches = allRanked.filter((b) => b.domain === comp.domain);
    return analyzeCompetitorFromData(comp, batches);
  });

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
    ...opportunities.slice(0, 10).map((o) => o.keyword),
  ].slice(0, 14);

  const discovery = [];
  const seenDiscovery = new Set(opportunities.map((o) => o.keyword.toLowerCase()));

  for (const seed of topSeeds) {
    for (const market of ["fr", "en_us"]) {
      try {
        const data = await fetchKeywordSuggestions(seed, market, 35);
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
    competitors: COMPETITORS.map((c) => ({ label: c.label, domain: c.domain, url: c.url })),
    api_cost_usd_estimate: totalCost,
    domain_overviews: domainOverviews,
    strategies,
    summary: {
      ranked_batches: allRanked.length,
      planory_relevant_from_competitors: opportunities.length,
      new_discovery_keywords: discovery.length,
      top_opportunity: opportunities[0] ?? null,
    },
    opportunities: opportunities.slice(0, 120),
    discovery: discovery.slice(0, 100),
    all_competitor_ranked_sample: allRanked.map((b) => ({
      domain: b.domain,
      competitor: b.competitor,
      market: b.market,
      top_25: b.keywords.slice(0, 25),
    })),
  };

  writeFileSync(join(OUT_DIR, "competitor-seo-report.json"), JSON.stringify(report, null, 2));

  writeFileSync(
    join(OUT_DIR, "competitor-strategies.md"),
    buildStrategiesMarkdown(strategies, domainOverviews),
  );

  writeFileSync(
    join(OUT_DIR, "planory-opportunities.csv"),
    toCsv(opportunities.slice(0, 200), [
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
    toCsv(discovery.slice(0, 120), [
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

  for (const comp of COMPETITORS) {
    const batch = allRanked.find((b) => b.domain === comp.domain && b.market === "France");
    if (!batch) continue;
    const planning = batch.keywords
      .filter((k) => PLANORY_RELEVANCE.test(k.keyword))
      .sort((a, b) => b.search_volume - a.search_volume)
      .slice(0, 80);
    writeFileSync(
      join(OUT_DIR, `${comp.domain.replace(/\./g, "-")}-planning-keywords.csv`),
      toCsv(planning, [
        "keyword",
        "search_volume",
        "cpc",
        "competition",
        "intent",
        "rank",
        "url",
        "etv",
      ]),
    );
  }

  console.log("\n=== Résultats ===");
  console.log(`Coût API estimé : $${totalCost.toFixed(4)}`);
  console.log(`Opportunités Planory : ${opportunities.length}`);
  console.log(`Nouveaux mots-clés (suggestions) : ${discovery.length}`);
  console.log(`\nFichiers : ${OUT_DIR}/`);
  console.log("  - competitor-seo-report.json");
  console.log("  - competitor-strategies.md");
  console.log("  - planory-opportunities.csv");
  console.log("  - keyword-discovery.csv");
  console.log("  - *-planning-keywords.csv (par concurrent)\n");

  for (const s of strategies) {
    console.log(`\n── ${s.label} ──`);
    for (const line of s.inferredStrategy.slice(0, 4)) console.log(`  • ${line}`);
    if (s.topPlanningKeywords[0]) {
      console.log(
        `  Top planning: ${s.topPlanningKeywords[0].keyword} (vol ${s.topPlanningKeywords[0].search_volume})`,
      );
    }
  }

  if (opportunities.length) {
    console.log("\nTop 10 opportunités Planory :");
    for (const o of opportunities.slice(0, 10)) {
      console.log(
        `  • ${o.keyword} | vol ${o.search_volume} | ${o.competitors} → ${o.planory_page}`,
      );
    }
  }
}

main().catch((err) => {
  console.error("\nErreur:", err.message);
  process.exit(1);
});
