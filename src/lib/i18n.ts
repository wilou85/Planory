export type Locale = "fr" | "en";

export const LOCALES: {
  code: Locale;
  label: string;
  flagCode: "fr" | "gb";
  href: string;
  htmlLang: string;
  ogLocale: string;
}[] = [
  {
    code: "fr",
    label: "Français",
    flagCode: "fr",
    href: "/",
    htmlLang: "fr",
    ogLocale: "fr_FR",
  },
  {
    code: "en",
    label: "English",
    flagCode: "gb",
    href: "/en",
    htmlLang: "en",
    ogLocale: "en_GB",
  },
];

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

export function localePath(locale: Locale, frPath = "/"): string {
  if (locale === "en") return "/en";
  return frPath === "/en" ? "/" : frPath;
}

export const HERO_COPY = {
  fr: {
    pilot: "Pilote en cours — Aéroport de Paris-Orly",
    title: "Générez un planning conforme en moins de 2 minutes",
    subtitle: "Logiciel de planification d'équipes 24/7",
    skynetTagline: "SKYNET propose — vos planificateurs valident.",
    description:
      "Planory respecte vos règles métier, contraintes RH et facteurs humains. Vous révisez, ajustez et publiez.",
    ctaPrimary: "Prendre contact",
    ctaSecondary: "Voir un exemple de planning",
    ctaSecondaryHref: "/produit#planning",
    ctaLeadMagnet: "Encore sur Excel ? Questionnaire en 2 min",
    ctaLeadMagnetHref: "/ressources/outils/grille-excel-vs-logiciel",
    stats: [
      { value: "< 2 min", label: "génération", labelDesktop: "pour générer un planning" },
      { value: "100%", label: "conformité", labelDesktop: "règles métier respectées" },
      { value: "France", label: "solution FR", labelDesktop: "solution française 24/7" },
    ],
  },
  en: {
    pilot: "Live pilot — Paris-Orly Airport",
    title: "Generate a compliant schedule in under 2 minutes",
    subtitle: "24/7 team planning software",
    skynetTagline: "SKYNET proposes — your planners validate.",
    description:
      "Planory respects your business rules, HR constraints and human factors. You review, adjust and publish.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "See a scheduling example",
    ctaSecondaryHref: "/produit#planning",
    ctaLeadMagnet: "Still on Excel? 2-min questionnaire",
    ctaLeadMagnetHref: "/ressources/outils/grille-excel-vs-logiciel",
    stats: [
      { value: "< 2 min", label: "generation", labelDesktop: "to generate a schedule" },
      { value: "100%", label: "compliance", labelDesktop: "business rules met" },
      { value: "France", label: "French-built", labelDesktop: "French 24/7 scheduling" },
    ],
  },
} as const;

export const EN_SITE = {
  title: "Healthcare workforce scheduling software with AI | Planory",
  description:
    "Healthcare workforce scheduling software and shift planning software for hospitals, airports and 24/7 teams. Planory generates compliant schedules with SKYNET AI — French workforce scheduling software.",
} as const;

export const HOME_COPY = {
  fr: {
    leadMagnet: {
      sectionLabel: "Outil gratuit",
      title: "Encore sur Excel ? Questionnaire en 2 minutes",
      badge: "Gratuit",
      subtitle:
        "15 critères pour évaluer si votre tableur atteint ses limites",
      descriptionSuffix:
        "Score immédiat sans email, puis recevez la grille complète en PDF si vous le souhaitez.",
      formatNote: "sans téléphone obligatoire",
      format: "Test en ligne + PDF",
      cta: "Lancer le questionnaire",
      articleLink: "Lire l'article sur les limites d'Excel",
      articleHref: "/ressources/planning-excel-equipe",
    },
    valueProposition: {
      sectionLabel: "Valeur différenciante",
      heading: "Ce qui distingue Planory",
      pillars: [
        { title: "Interface ergonomique et intuitive", description: null },
        {
          title: "Une solution évolutive",
          description: "Conçue pour intégrer de nouvelles règles et cas d'usage.",
        },
        {
          title: "Une solution pensée pour des environnements critiques",
          description: "Fiabilité et robustesse au cœur du produit.",
        },
        {
          title: "Outil SaaS ouvert",
          description: "Possibilité de s'interfacer en API avec les outils du marché.",
        },
      ],
    },
    discover: {
      heading: "Découvrir Planory",
      intro:
        "Planory accélère la planification sans remplacer l'expertise. L'IA propose, vous décidez.",
      subintro:
        "Planning augmenté par l'IA — solution française pour la planification d'équipes et de ressources en environnement réglementé.",
    },
    sitePlanLabels: {
      "/produit": { label: "Produit", snippet: "RH, planning, ressources et SKYNET — modules intégrés pour accélérer la planification." },
      "/secteurs": { label: "Secteurs", snippet: "Aéroport, hôpital, industrie, commerce, école et services publics — cas d'usage par secteur." },
      "/ressources": { label: "Articles", snippet: "Guides et articles sur la planification d'équipes, les astreintes et les roulements 24/7." },
      "/offre": { label: "Offre", snippet: "Autonome, accompagné ou mission critique — le niveau adapté à votre contexte." },
      "/faq": { label: "FAQ", snippet: "Questions fréquentes sur SKYNET, le déploiement et la planification réglementée." },
    },
  },
  en: {
    leadMagnet: {
      sectionLabel: "Free tool",
      title: "Still on Excel? 2-minute questionnaire",
      badge: "Free",
      subtitle: "15 criteria to assess whether your spreadsheet is reaching its limits",
      descriptionSuffix:
        "Instant score without email, then receive the full PDF grid if you wish.",
      formatNote: "no phone number required",
      format: "Online test + PDF",
      cta: "Start the questionnaire",
      articleLink: "Read about Excel limitations for team scheduling",
      articleHref: "/ressources/planning-excel-equipe",
    },
    valueProposition: {
      sectionLabel: "Differentiators",
      heading: "What sets Planory apart",
      pillars: [
        { title: "Ergonomic and intuitive interface", description: null },
        {
          title: "An evolving solution",
          description: "Designed to integrate new rules and use cases.",
        },
        {
          title: "Built for critical environments",
          description: "Reliability and robustness at the core of the product.",
        },
        {
          title: "Open SaaS platform",
          description: "API integration with your existing HR and ops tools.",
        },
      ],
    },
    discover: {
      heading: "Explore Planory",
      intro:
        "Planory accelerates scheduling without replacing your expertise. AI proposes, you decide.",
      subintro:
        "AI-augmented scheduling — French-built software for team and resource planning in regulated 24/7 environments.",
    },
    sitePlanLabels: {
      "/produit": { label: "Product", snippet: "HR, scheduling, resources and SKYNET — integrated modules to speed up planning." },
      "/secteurs": { label: "Sectors", snippet: "Airport, hospital, industry, retail, schools and public services — use cases by sector." },
      "/ressources": { label: "Resources", snippet: "Guides on team scheduling, on-call rotation and 24/7 shift patterns." },
      "/offre": { label: "Pricing", snippet: "Self-serve, supported or mission-critical — the right level for your context." },
      "/faq": { label: "FAQ", snippet: "Frequently asked questions about SKYNET, deployment and regulated scheduling." },
    },
  },
} as const;

export function getHomeCopy(locale: Locale) {
  return HOME_COPY[locale];
}
