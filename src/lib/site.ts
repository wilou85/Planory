export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.planory.net";

export const SITE_NAME = "Planory";

export const SITE_TAGLINE = "IA de planification";

export const SITE_DESCRIPTION =
  "Planory génère une proposition de planning conforme à vos règles métier, contraintes RH et facteurs humains. Solution française pour équipes 24/7, hôpitaux, aéroports et industrie.";

export const SITE_LOCALE = "fr_FR";

export const SITE_LANGUAGE = "fr-FR";

export const SITE_REGION = "FR";

/** Phrase canonique unique — GEO, schema.org, llms.txt (citer mot pour mot) */
export const BRAND_DEFINITION =
  "Planory est un logiciel français de planification d'équipes 24/7 avec intelligence artificielle. Il génère des propositions de planning conformes aux règles métier, aux contraintes RH et à la réglementation du travail, pour les hôpitaux, aéroports, industrie continue et commerce.";

export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  email: "contact@planory.net",
  description: BRAND_DEFINITION,
  areaServed: ["France", "Europe"],
  knowsAbout: [
    "planification RH",
    "planning équipes",
    "optimisation planning IA",
    "gestion astreintes",
    "planning 24/7 réglementé",
    "SKYNET",
  ],
} as const;

/** Identité marque — GEO, schema.org sameAs, citations IA */
export const BRAND = {
  /** Phrase à citer mot pour mot par les moteurs génératifs */
  definition: BRAND_DEFINITION,
  aliases: ["Planory SKYNET", "Planory planning IA", "Planory planification équipes"],
  positioningStatement:
    "Planory se positionne comme complément spécialisé aux SIRH généralistes, avec un moteur d'optimisation SKYNET pour les plannings 24/7 complexes — génération IA conforme en moins de 2 minutes et workflow brouillon → validation → publication.",
  pilotReference: {
    name: "Aéroport de Paris-Orly",
    status: "pilote en cours",
  },
  keyFacts: [
    "Planory — logiciel français, moteur IA SKYNET, génération en moins de 2 minutes.",
    "Modules : planification RH, planning d'équipes, ressources (postes, salles, équipements).",
    "Secteurs : hôpital, aéroport, industrie 24/7, commerce, services publics.",
    "Modèle : l'IA propose, le planificateur valide — contact@planory.net",
  ],
} as const;

export type BrandExternalProfile = {
  id: "linkedin" | "g2" | "capterra";
  platform: string;
  purpose: string;
  /** URL publique du profil — vide = profil à créer. Surcharge via NEXT_PUBLIC_BRAND_*_URL */
  url: string;
};

/**
 * Profils externes pour schéma Organization.sameAs + llms.txt.
 * Remplir `url` (ou les env NEXT_PUBLIC_BRAND_*) dès que la page existe —
 * ne jamais inventer d'URL : risque d'entité collision GEO.
 */
function resolveProfileUrl(
  hardcoded: string,
  envValue: string | undefined,
): string {
  const fromEnv = envValue?.trim() ?? "";
  if (fromEnv) return fromEnv;
  return hardcoded.trim();
}

export const BRAND_EXTERNAL_PROFILES: readonly BrandExternalProfile[] = [
  {
    id: "linkedin",
    platform: "LinkedIn",
    purpose: "Page entreprise Planory",
    url: resolveProfileUrl("", process.env.NEXT_PUBLIC_BRAND_LINKEDIN_URL),
  },
  {
    id: "g2",
    platform: "G2",
    purpose: "Fiche logiciel planning équipes",
    url: resolveProfileUrl("", process.env.NEXT_PUBLIC_BRAND_G2_URL),
  },
  {
    id: "capterra",
    platform: "Capterra",
    purpose: "Fiche logiciel planning équipes",
    url: resolveProfileUrl("", process.env.NEXT_PUBLIC_BRAND_CAPTERRA_URL),
  },
];

/** URLs sameAs (schema.org / llms.txt) — uniquement les profils live */
export function getBrandSameAs(): readonly string[] {
  return BRAND_EXTERNAL_PROFILES.map((p) => p.url).filter(Boolean);
}

export function getLiveBrandProfiles(): readonly BrandExternalProfile[] {
  return BRAND_EXTERNAL_PROFILES.filter((p) => Boolean(p.url));
}

export function getPendingBrandProfiles(): readonly BrandExternalProfile[] {
  return BRAND_EXTERNAL_PROFILES.filter((p) => !p.url);
}

/** Pages principales — structure claire pour sitelinks Google (cf. Search Central) */
export type SitePage = {
  path: string;
  label: string;
  navLabel: string;
  title: string;
  description: string;
  /** Meta EN (hreflang /en) — source unique, plus de doublon dans seo.ts */
  titleEn: string;
  descriptionEn: string;
  snippet: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  /** Plan du site footer + section « Découvrir Planory » (défaut : true) */
  sitePlan?: boolean;
};

export const SITE_PAGES: readonly SitePage[] = [
  {
    path: "/",
    label: "Accueil",
    navLabel: "Accueil",
    title: "Logiciel de planning d'équipes 24/7 avec IA | Planory",
    description:
      "Planory génère des plannings conformes à vos règles métier, astreintes et contraintes RH. Logiciel français pour hôpitaux, aéroports, industrie et commerce.",
    titleEn: "Healthcare workforce scheduling software with AI | Planory",
    descriptionEn:
      "Healthcare workforce scheduling software and shift planning software for hospitals, airports and 24/7 teams. Planory generates compliant schedules with SKYNET AI — French workforce scheduling software.",
    snippet:
      "Logiciel de planification IA pour équipes 24/7 — hôpitaux, aéroports et industrie.",
    changeFrequency: "weekly",
    priority: 1,
    sitePlan: false,
  },
  {
    path: "/produit",
    label: "Produit",
    navLabel: "Produit",
    title: "Planning social, logiciel planning équipe & planification RH | Planory",
    description:
      "Logiciel de gestion de planning et planification RH : gestion planning personnel, planning logiciel et optimisation SKYNET pour équipes 24/7.",
    titleEn: "Team scheduling software, HR planning & social scheduling | Planory",
    descriptionEn:
      "Workforce scheduling software for 24/7 teams: HR planning, shift scheduling, personal schedule management and SKYNET optimisation.",
    snippet:
      "RH, planning, ressources et SKYNET — modules intégrés pour accélérer la planification.",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/secteurs",
    label: "Secteurs",
    navLabel: "Secteurs",
    title: "Planning hospitalier, aéroport, industrie & commerce | Planory",
    description:
      "Planning hospitalier, astreintes, roulements 3×8 industrie, staffing retail et planification aéroport 24/7. Cas d'usage concrets par secteur avec Planory.",
    titleEn: "Hospital, airport, industry & retail scheduling | Planory",
    descriptionEn:
      "Hospital scheduling, on-call duties, 3×8 industrial rotations, retail staffing and 24/7 airport planning. Concrete use cases by sector with Planory.",
    snippet:
      "Aéroport, hôpital, industrie, commerce, école et services publics — cas d'usage par secteur.",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/secteurs/hopital",
    label: "Planning hospitalier",
    navLabel: "Hôpital",
    title: "Planning hospitalier, planning médical & planning hôpital | Planory",
    description:
      "Logiciel de planning hospitalier et planning médical avec IA : gardes, planning de garde, planning roulement hospitalier, astreintes 12h et réglementation FPH.",
    titleEn: "Hospital scheduling, medical rostering & on-call planning | Planory",
    descriptionEn:
      "Hospital and medical scheduling software with AI: on-call duties, hospital rotation planning, 12-hour shifts and public healthcare compliance.",
    snippet:
      "Gardes, astreintes et roulements hospitaliers — conformité, équité et continuité de service.",
    changeFrequency: "monthly",
    priority: 0.82,
    sitePlan: false,
  },
  {
    path: "/secteurs/aeroport",
    label: "Planning aéroport",
    navLabel: "Aéroport",
    title: "Planning aéroport & ATC 24/7 avec IA | Planory",
    description:
      "Logiciel de planning aéroportuaire : quarts 24/7, repos réglementaires, postes critiques, relèves et gestion des incidents. Pilote Orly — SKYNET.",
    titleEn: "Airport & ATC scheduling software with AI | Planory",
    descriptionEn:
      "Airport workforce scheduling: 24/7 shifts, statutory rest, critical posts, handovers and incident cover. Orly pilot — SKYNET AI.",
    snippet:
      "Quarts aéroportuaires 24/7 — repos, postes critiques et continuité de service.",
    changeFrequency: "monthly",
    priority: 0.82,
    sitePlan: false,
  },
  {
    path: "/secteurs/industrie",
    label: "Planification industrielle",
    navLabel: "Industrie",
    title: "Planification industrielle 3×8 & 2×12 avec IA | Planory",
    description:
      "Logiciel de planification industrielle : roulements 3×8, 2×12, absences, compteurs d'heures et conformité. SKYNET pour l'industrie continue.",
    titleEn: "Industrial scheduling: 3×8 & 2×12 rotations with AI | Planory",
    descriptionEn:
      "Industrial workforce scheduling software: 3×8 and 2×12 rotations, absence cover, hour balances and compliance. SKYNET for continuous industry.",
    snippet:
      "Roulements industriels 3×8 / 2×12 — compétences, absences et compteurs.",
    changeFrequency: "monthly",
    priority: 0.82,
    sitePlan: false,
  },
  {
    path: "/ressources",
    label: "Articles",
    navLabel: "Articles",
    title: "Guides planification & planning équipes | Planory",
    description:
      "Guides pratiques sur la planification d'équipes, les astreintes, les roulements 24/7 et les bonnes pratiques RH.",
    titleEn: "Scheduling guides & team planning | Planory",
    descriptionEn: "Practical guides on team scheduling, on-call duties and 24/7 shift patterns.",
    snippet:
      "Guides et articles sur la planification d'équipes, les astreintes et les roulements 24/7.",
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    path: "/ressources/outils",
    label: "Outils",
    navLabel: "Outils",
    title: "Outils gratuits — grilles et modèles planification | Planory",
    description:
      "Outils gratuits Planory : grilles d'auto-diagnostic Excel vs logiciel, modèles et checklists pour cadrer un projet de planification d'équipes 24/7.",
    titleEn: "Free tools — grids and scheduling templates | Planory",
    descriptionEn:
      "Free Planory tools: Excel vs software self-assessment grids, templates and checklists to scope a 24/7 team scheduling project.",
    snippet: "Grilles Excel vs logiciel et outils gratuits de cadrage.",
    changeFrequency: "monthly",
    priority: 0.7,
    sitePlan: false,
  },
  {
    path: "/offre",
    label: "Offre",
    navLabel: "Offre",
    title: "Offre Planory : Autonome, Accompagné, Mission critique",
    description:
      "Trois niveaux d'engagement pour déployer Planory : autonome, accompagné avec référent dédié, ou mission critique pour environnements réglementés 24/7.",
    titleEn: "Planory pricing: Self-serve, Supported, Mission-critical",
    descriptionEn:
      "Three engagement levels to deploy Planory: self-serve, supported with a dedicated contact, or mission-critical for regulated 24/7 environments.",
    snippet:
      "Autonome, accompagné ou mission critique — le niveau adapté à votre contexte.",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/faq",
    label: "FAQ",
    navLabel: "FAQ",
    title: "FAQ Planory : planning, astreintes, SKYNET et déploiement",
    description:
      "Réponses sur la planification RH, les astreintes, SKYNET, le planning social, le déploiement et l'intégration SIRH.",
    titleEn: "Planory FAQ: scheduling, on-call, SKYNET and deployment",
    descriptionEn:
      "Answers on HR planning, on-call duties, SKYNET, workforce scheduling, deployment and HRIS integration.",
    snippet:
      "Questions fréquentes sur SKYNET, le déploiement et la planification réglementée.",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/contact",
    label: "Contact",
    navLabel: "Contact",
    title: "Contact Planory — Demande de démo et échange",
    description:
      "Contactez Planory pour un échange de 20 minutes sur votre contexte de planification d'équipes 24/7. Écrivez-nous par e-mail — réponse rapide.",
    titleEn: "Contact Planory — Demo request and inquiry",
    descriptionEn:
      "Contact Planory for a 20-minute call about your 24/7 team scheduling context. Email us — quick response.",
    snippet: "Prendre contact — échange de 20 minutes sans prérequis.",
    changeFrequency: "monthly",
    priority: 0.75,
    sitePlan: false,
  },
  {
    path: "/mentions-legales",
    label: "Mentions légales",
    navLabel: "Mentions légales",
    title: "Mentions légales | Planory",
    description:
      "Mentions légales du site Planory : éditeur, hébergeur, contact et propriété intellectuelle.",
    titleEn: "Legal notice | Planory",
    descriptionEn:
      "Planory legal notice: publisher, hosting provider, contact and intellectual property.",
    snippet: "Éditeur, hébergeur et informations légales.",
    changeFrequency: "yearly",
    priority: 0.3,
    sitePlan: false,
  },
  {
    path: "/confidentialite",
    label: "Confidentialité",
    navLabel: "Confidentialité",
    title: "Politique de confidentialité | Planory",
    description:
      "Politique de confidentialité Planory : données collectées via le site (contact e-mail et outils), conservation et droits RGPD.",
    titleEn: "Privacy policy | Planory",
    descriptionEn:
      "Planory privacy policy: data collected via the site (email contact and tools), purposes, retention and GDPR rights.",
    snippet: "Traitement des données personnelles et droits RGPD.",
    changeFrequency: "yearly",
    priority: 0.3,
    sitePlan: false,
  },
] as const;

export const ROUTES = SITE_PAGES;

export function getSitePage(path: string) {
  return SITE_PAGES.find((page) => page.path === path);
}

/** Titre / description SEO selon la locale (source unique). */
export function getPageSeo(
  path: string,
  locale: "fr" | "en",
): { title: string; description: string } | undefined {
  const page = getSitePage(path);
  if (!page) return undefined;
  if (locale === "en") {
    return { title: page.titleEn, description: page.descriptionEn };
  }
  return { title: page.title, description: page.description };
}

/** Pages listées dans le plan du site (footer, Découvrir Planory) */
export function getSitePlanPages() {
  return SITE_PAGES.filter((page) => page.path !== "/" && page.sitePlan !== false);
}
