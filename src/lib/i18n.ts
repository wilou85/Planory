/**
 * Locale plumbing + copy chrome (header, hero, sticky bar, nav labels).
 * Contenu marketing pages → `@/lib/get-content`.
 */
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

/** Chemin sans préfixe /en (ex. /en/produit → /produit, /en → /) */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  return pathname;
}

/** Préfixe /en pour les liens internes selon la locale */
export function localizePath(path: string, locale: Locale): string {
  const hashIndex = path.indexOf("#");
  const pathname = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const base = stripLocalePrefix(pathname);
  if (locale === "en") {
    const enPath = base === "/" ? "/en" : `/en${base}`;
    return `${enPath}${hash}`;
  }
  return `${base}${hash}`;
}

export function localePath(targetLocale: Locale, currentPath = "/"): string {
  return localizePath(stripLocalePrefix(currentPath), targetLocale);
}

/** Lien « Voir un exemple » → module Planification RH / HR scheduling */
export const PRODUCT_EXAMPLE_HREF = "/produit#rh";

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
    ctaSecondaryHref: PRODUCT_EXAMPLE_HREF,
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
    ctaSecondaryHref: PRODUCT_EXAMPLE_HREF,
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
      "/ressources": { label: "Blogs", snippet: "Guides on team scheduling, on-call rotation and 24/7 shift patterns." },
      "/offre": { label: "Pricing", snippet: "Self-serve, supported or mission-critical — the right level for your context." },
      "/faq": { label: "FAQ", snippet: "Frequently asked questions about SKYNET, deployment and regulated scheduling." },
    },
  },
} as const;

export function getHomeCopy(locale: Locale) {
  return HOME_COPY[locale];
}

export const HEADER_COPY = {
  fr: {
    tagline: "IA de planification",
    ctaExample: "Voir un exemple",
    ctaExampleHref: PRODUCT_EXAMPLE_HREF,
    ctaContact: "Prendre contact",
    ctaContactShort: "Contact",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    close: "Fermer",
    mainNav: "Navigation principale",
    mobileNav: "Navigation mobile complète",
    menu: "Menu",
    breadcrumbHome: "Accueil",
    breadcrumbLabel: "Fil d'Ariane",
    moreTab: "Plus",
    moreTabTitle: "Articles, Offre, FAQ…",
    mobileNavLabel: "Navigation mobile",
  },
  en: {
    tagline: "Planning AI",
    ctaExample: "See an example",
    ctaExampleHref: PRODUCT_EXAMPLE_HREF,
    ctaContact: "Get in touch",
    ctaContactShort: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    close: "Close",
    mainNav: "Main navigation",
    mobileNav: "Full mobile navigation",
    menu: "Menu",
    breadcrumbHome: "Home",
    breadcrumbLabel: "Breadcrumb",
    moreTab: "More",
    moreTabTitle: "Blogs, Pricing, FAQ…",
    mobileNavLabel: "Mobile navigation",
  },
} as const;

export const STICKY_CONTACT_COPY = {
  fr: {
    primaryShort: "Échanger",
  },
  en: {
    primaryShort: "Talk to us",
  },
} as const;

export const MOCKUP_COPY = {
  fr: {
    skynetShort: "SKYNET — 1m 23s",
    skynetLong: "SKYNET — Proposition générée en 1m 23s",
    compliant: "Conforme",
    draft: "Brouillon",
    agent: "Agent",
    days: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    equity: "Équité",
    compliance: "Conformité",
    alerts: "Alertes",
    publish: "Publier →",
  },
  en: {
    skynetShort: "SKYNET — 1m 23s",
    skynetLong: "SKYNET — Proposal generated in 1m 23s",
    compliant: "Compliant",
    draft: "Draft",
    agent: "Agent",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    equity: "Fairness",
    compliance: "Compliance",
    alerts: "Alerts",
    publish: "Publish →",
  },
} as const;

type NavChild = { label: string; href: string; description: string };
type NavItem =
  | { label: string; href: string; children: readonly NavChild[] }
  | { label: string; href: string };

type DrawerItem = { label: string; href: string; description: string };
type DrawerSection = { title: string; items: readonly DrawerItem[] };

const NAV_BY_LOCALE: Record<Locale, readonly NavItem[]> = {
  fr: [
    {
      label: "Produit",
      href: "/produit",
      children: [
        { label: "Gestion RH", href: "/produit#rh", description: "Agents, droits, qualifications" },
        { label: "Planning", href: "/produit#planning", description: "Cycles, quarts, roulements" },
        { label: "Ressources", href: "/produit#ressources", description: "Postes, salles, équipements" },
        { label: "SKYNET — IA", href: "/produit#skynet", description: "Moteur d'optimisation" },
      ],
    },
    { label: "Secteurs", href: "/secteurs" },
    { label: "Articles", href: "/ressources" },
    { label: "Offre", href: "/offre" },
    { label: "FAQ", href: "/faq" },
  ],
  en: [
    {
      label: "Product",
      href: "/produit",
      children: [
        { label: "HR management", href: "/produit#rh", description: "Staff, rights, qualifications" },
        { label: "Scheduling", href: "/produit#planning", description: "Cycles, shifts, rotations" },
        { label: "Resources", href: "/produit#ressources", description: "Posts, rooms, equipment" },
        { label: "SKYNET — AI", href: "/produit#skynet", description: "Optimisation engine" },
      ],
    },
    { label: "Sectors", href: "/secteurs" },
    { label: "Blogs", href: "/ressources" },
    { label: "Pricing", href: "/offre" },
    { label: "FAQ", href: "/faq" },
  ],
};

const MOBILE_TABS_BY_LOCALE: Record<Locale, readonly { href: string; label: string }[]> = {
  fr: [
    { href: "/", label: "Accueil" },
    { href: "/produit", label: "Produit" },
    { href: "/secteurs", label: "Secteurs" },
  ],
  en: [
    { href: "/en", label: "Home" },
    { href: "/produit", label: "Product" },
    { href: "/secteurs", label: "Sectors" },
  ],
};

const DRAWER_BY_LOCALE: Record<Locale, readonly DrawerSection[]> = {
  fr: [
    {
      title: "Produit",
      items: [
        { label: "Vue d'ensemble", href: "/produit", description: "RH, Planning, SKYNET" },
        { label: "Gestion RH", href: "/produit#rh", description: "Agents, qualifications" },
        { label: "Planning", href: "/produit#planning", description: "Cycles, roulements" },
        { label: "Ressources", href: "/produit#ressources", description: "Postes, salles" },
        { label: "SKYNET — IA", href: "/produit#skynet", description: "Moteur d'optimisation" },
      ],
    },
    {
      title: "Explorer",
      items: [
        { label: "Secteurs", href: "/secteurs", description: "Hôpital, aéroport, industrie" },
        {
          label: "Planning hospitalier",
          href: "/secteurs/hopital",
          description: "Gardes et roulements hospitaliers",
        },
        {
          label: "Planning aéroport",
          href: "/secteurs/aeroport",
          description: "Quarts 24/7 et postes critiques",
        },
        {
          label: "Planification industrielle",
          href: "/secteurs/industrie",
          description: "Roulements 3×8 et 2×12",
        },
        { label: "Articles", href: "/ressources", description: "Guides planification" },
      ],
    },
    {
      title: "Offre & FAQ",
      items: [
        { label: "Offre", href: "/offre", description: "3 niveaux d'engagement" },
        { label: "FAQ", href: "/faq", description: "Questions fréquentes" },
      ],
    },
  ],
  en: [
    {
      title: "Product",
      items: [
        { label: "Overview", href: "/produit", description: "HR, Scheduling, SKYNET" },
        { label: "HR management", href: "/produit#rh", description: "Staff, qualifications" },
        { label: "Scheduling", href: "/produit#planning", description: "Cycles, rotations" },
        { label: "Resources", href: "/produit#ressources", description: "Posts, rooms" },
        { label: "SKYNET — AI", href: "/produit#skynet", description: "Optimisation engine" },
      ],
    },
    {
      title: "Explore",
      items: [
        { label: "Sectors", href: "/secteurs", description: "Hospital, airport, industry" },
        {
          label: "Hospital scheduling",
          href: "/secteurs/hopital",
          description: "On-call and hospital rotations",
        },
        {
          label: "Airport scheduling",
          href: "/secteurs/aeroport",
          description: "24/7 shifts and critical posts",
        },
        {
          label: "Industrial scheduling",
          href: "/secteurs/industrie",
          description: "3×8 and 2×12 rotations",
        },
        { label: "Blogs", href: "/ressources", description: "Scheduling guides" },
      ],
    },
    {
      title: "Pricing & FAQ",
      items: [
        { label: "Pricing", href: "/offre", description: "3 engagement levels" },
        { label: "FAQ", href: "/faq", description: "Frequently asked questions" },
      ],
    },
  ],
};

export function getHeaderCopy(locale: Locale) {
  return HEADER_COPY[locale];
}

export function getStickyContactCopy(locale: Locale) {
  return STICKY_CONTACT_COPY[locale];
}

export function getMockupCopy(locale: Locale) {
  return MOCKUP_COPY[locale];
}

export function getNavItems(locale: Locale) {
  return NAV_BY_LOCALE[locale].map((item) =>
    "children" in item
      ? {
          ...item,
          href: localizePath(item.href, locale),
          children: item.children.map((child) => ({
            ...child,
            href: localizePath(child.href, locale),
          })),
        }
      : { ...item, href: localizePath(item.href, locale) },
  );
}

export function getMobileTabItems(locale: Locale) {
  return MOBILE_TABS_BY_LOCALE[locale].map((tab) => ({
    ...tab,
    href: localizePath(tab.href, locale),
  }));
}

export function getDrawerNavSections(locale: Locale) {
  return DRAWER_BY_LOCALE[locale].map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      href: localizePath(item.href, locale),
    })),
  }));
}

export function homePath(locale: Locale): string {
  return locale === "en" ? "/en" : "/";
}

import { getSitePage } from "@/lib/site";

export function isLocaleHome(pathname: string): boolean {
  return pathname === "/" || pathname === "/en";
}

const EN_PAGE_BREADCRUMB_LABELS: Record<string, string> = {
  "/produit": "Product",
  "/secteurs": "Sectors",
  "/secteurs/hopital": "Hospital scheduling",
  "/secteurs/aeroport": "Airport scheduling",
  "/secteurs/industrie": "Industrial scheduling",
  "/ressources": "Blogs",
  "/offre": "Pricing",
  "/faq": "FAQ",
  "/contact": "Contact",
  "/mentions-legales": "Legal notice",
  "/confidentialite": "Privacy",
};

/** Libellé fil d'Ariane pour une page SITE_PAGES, selon la locale */
export function getSitePageBreadcrumbLabel(basePath: string, locale: Locale): string | undefined {
  const page = getSitePage(basePath);
  if (!page) return undefined;
  if (locale === "en") {
    const enFromHome = HOME_COPY.en.sitePlanLabels[basePath as keyof typeof HOME_COPY.en.sitePlanLabels];
    return EN_PAGE_BREADCRUMB_LABELS[basePath] ?? enFromHome?.label ?? page.label;
  }
  return page.label;
}
