export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.planory.net";

export const SITE_NAME = "Planory";

export const SITE_TAGLINE = "IA de planification";

export const SITE_DESCRIPTION =
  "Planory génère une proposition de planning conforme à vos règles métier, contraintes RH et facteurs humains. Solution française pour équipes 24/7, hôpitaux, aéroports et industrie.";

export const SITE_LOCALE = "fr_FR";

export const SITE_LANGUAGE = "fr-FR";

export const SITE_REGION = "FR";

export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  email: "contact@planory.net",
  description: SITE_DESCRIPTION,
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
  definition:
    "Planory est un logiciel français de planification d'équipes 24/7 avec intelligence artificielle. Il génère des propositions de planning conformes aux règles métier, aux contraintes RH et à la réglementation du travail, pour les hôpitaux, aéroports, industrie continue et commerce.",
  aliases: ["Planory SKYNET", "Planory planning IA", "Planory planification équipes"],
  positioningStatement:
    "Planory se positionne comme alternative IA à Excel et complément spécialisé aux SIRH généralistes, avec un moteur d'optimisation SKYNET. Face à Holy-Dis Timesquare (WFM établi), Planory apporte la génération IA conforme en moins de 2 minutes et un workflow brouillon → validation → publication.",
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
  /** Renseigner les URLs quand profils créés — utilisées dans schema.org et llms.txt */
  sameAs: [] as readonly string[],
  competitorsNamed: [
    {
      name: "Holy-Dis Timesquare",
      url: "https://www.holydis.com/",
      note: "WFM établi, retail et contact center, optimisation classique",
    },
    {
      name: "Lucca",
      url: "https://www.lucca.fr/",
      note: "Suite SIRH modulaire, moins orienté roulements 24/7 complexes",
    },
  ],
  /** Profils à créer pour renforcer l'autorité externe (GEO) */
  externalChannels: [
    { platform: "LinkedIn", purpose: "Page entreprise + fondateurs" },
    { platform: "G2 / Capterra", purpose: "Fiche logiciel planning équipes" },
    { platform: "Presse sectorielle", purpose: "Santé, aéroport, industrie" },
  ],
} as const;

/** Pages principales — structure claire pour sitelinks Google (cf. Search Central) */
export type SitePage = {
  path: string;
  label: string;
  navLabel: string;
  title: string;
  description: string;
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
    title: "Logiciel planning équipes & planification RH | Planory",
    description:
      "Logiciel de planning d'équipes avec planification RH intégrée, gestion des ressources et moteur IA SKYNET. Génération conforme à vos règles métier et légales.",
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
    snippet:
      "Aéroport, hôpital, industrie, commerce, école et services publics — cas d'usage par secteur.",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/secteurs/hopital",
    label: "Planning hospitalier",
    navLabel: "Hôpital",
    title: "Planning hospitalier & gestion astreintes | Planory",
    description:
      "Logiciel de planning hospitalier avec IA : gardes, astreintes, roulements 12h, équité des week-ends et continuité de service. SKYNET génère, vous validez.",
    snippet:
      "Gardes, astreintes et roulements hospitaliers — conformité, équité et continuité de service.",
    changeFrequency: "monthly",
    priority: 0.82,
    sitePlan: false,
  },
  {
    path: "/ressources",
    label: "Ressources",
    navLabel: "Ressources",
    title: "Guides planification & planning équipes | Planory",
    description:
      "Guides pratiques sur la planification d'équipes, les astreintes, les roulements 24/7 et les bonnes pratiques RH.",
    snippet:
      "Guides et articles sur la planification d'équipes, les astreintes et les roulements 24/7.",
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    path: "/offre",
    label: "Offre",
    navLabel: "Offre",
    title: "Offre Planory : Autonome, Accompagné, Mission critique",
    description:
      "Trois niveaux d'engagement pour déployer Planory : autonome, accompagné avec référent dédié, ou mission critique pour environnements réglementés 24/7.",
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
    snippet:
      "Questions fréquentes sur SKYNET, le déploiement et la planification réglementée.",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/en",
    label: "English",
    navLabel: "EN",
    title: "24/7 workforce scheduling software with AI | Planory",
    description:
      "Planory generates compliant team schedules for hospitals, airports, industry and retail. French AI planning software — SKYNET engine.",
    snippet: "Homepage in English — workforce scheduling software with AI.",
    changeFrequency: "weekly",
    priority: 0.85,
    sitePlan: false,
  },
  {
    path: "/ressources/planning-excel-vs-logiciel",
    label: "Excel vs logiciel",
    navLabel: "Excel vs logiciel",
    title: "Planning Excel vs logiciel : quand passer à l'IA ? | Planory",
    description:
      "Excel atteint ses limites sur les plannings 24/7. Critères de choix et bonnes pratiques pour passer à un logiciel de planning d'équipes.",
    snippet:
      "Critères et bonnes pratiques pour passer d'un tableur à un logiciel de planning.",
    changeFrequency: "monthly",
    priority: 0.5,
    sitePlan: false,
  },
] as const;

export const ROUTES = SITE_PAGES;

export function getSitePage(path: string) {
  return SITE_PAGES.find((page) => page.path === path);
}

/** Pages listées dans le plan du site (footer, Découvrir Planory) */
export function getSitePlanPages() {
  return SITE_PAGES.filter((page) => page.path !== "/" && page.sitePlan !== false);
}
