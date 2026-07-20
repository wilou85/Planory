import type { Metadata } from "next";
import { getFaqItems } from "@/lib/get-content";
import { EN_SITE, getLocaleFromPath, localizePath, stripLocalePrefix, type Locale } from "@/lib/i18n";
import { getLeadMagnet, LEAD_MAGNETS, TOOLS_HUB_PATH } from "@/lib/lead-magnets";
import { getArticleUpdatedAt, getResourceArticle, RESOURCE_ARTICLES } from "@/lib/resources";
import {
  ORGANIZATION,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_PAGES,
  SITE_REGION,
  SITE_TAGLINE,
  SITE_URL,
  getSitePage,
  getBrandSameAs,
} from "@/lib/site";

type PageMetaInput = {
  path: string;
  title?: string;
  description?: string;
  keywords?: string[];
};

/** Titres/descriptions EN pour WebPage JSON-LD (pages sans entrée SITE_PAGES EN) */
const EN_WEB_PAGE_META: Record<string, { title: string; description: string }> = {
  "/": { title: EN_SITE.title, description: EN_SITE.description },
  "/produit": {
    title: "Team scheduling software, HR planning & social scheduling | Planory",
    description:
      "Workforce scheduling software for 24/7 teams: HR planning, shift scheduling, personal schedule management and SKYNET optimisation.",
  },
  "/secteurs": {
    title: "Hospital, airport, industry & retail scheduling | Planory",
    description:
      "Hospital scheduling, on-call duties, 3×8 industrial rotations, retail staffing and 24/7 airport planning. Concrete use cases by sector with Planory.",
  },
  "/secteurs/hopital": {
    title: "Hospital scheduling, medical rostering & on-call planning | Planory",
    description:
      "Hospital and medical scheduling software with AI: on-call duties, hospital rotation planning, 12-hour shifts and public healthcare compliance.",
  },
  "/secteurs/aeroport": {
    title: "Airport & ATC scheduling software with AI | Planory",
    description:
      "Airport workforce scheduling: 24/7 shifts, statutory rest, critical posts, handovers and incident cover. Orly pilot — SKYNET AI.",
  },
  "/secteurs/industrie": {
    title: "Industrial scheduling: 3×8 & 2×12 rotations with AI | Planory",
    description:
      "Industrial workforce scheduling software: 3×8 and 2×12 rotations, absence cover, hour balances and compliance. SKYNET for continuous industry.",
  },
  "/ressources": {
    title: "Scheduling guides & team planning | Planory",
    description: "Practical guides on team scheduling, on-call duties and 24/7 shift patterns.",
  },
  "/ressources/outils": {
    title: "Free tools — grids and scheduling templates | Planory",
    description:
      "Free Planory tools: Excel vs software self-assessment grids, templates and checklists to scope a 24/7 team scheduling project.",
  },
  "/offre": {
    title: "Planory pricing: Self-serve, Supported, Mission-critical",
    description:
      "Three engagement levels to deploy Planory: self-serve, supported with a dedicated contact, or mission-critical for regulated 24/7 environments.",
  },
  "/faq": {
    title: "Planory FAQ: scheduling, on-call, SKYNET and deployment",
    description:
      "Answers on HR planning, on-call duties, SKYNET, workforce scheduling, deployment and HRIS integration.",
  },
  "/contact": {
    title: "Contact Planory — Demo request and inquiry",
    description:
      "Contact Planory for a 20-minute call about your 24/7 team scheduling context. Contact form — quick response.",
  },
  "/mentions-legales": {
    title: "Legal notice | Planory",
    description:
      "Planory legal notice: publisher, hosting provider, contact and intellectual property.",
  },
  "/confidentialite": {
    title: "Privacy policy | Planory",
    description:
      "Planory privacy policy: data collected via forms, purposes, retention and GDPR rights.",
  },
};

const EN_NAV_LABELS: Record<string, string> = {
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

function buildHreflangAlternates(path: string) {
  const basePath = stripLocalePrefix(path);
  const frPath = basePath === "/" ? "/" : basePath;
  const enPath = localizePath(basePath, "en");
  const frUrl = frPath === "/" ? SITE_URL : `${SITE_URL}${frPath}`;
  return {
    "fr-FR": frUrl,
    "en-GB": `${SITE_URL}${enPath}`,
    "x-default": frUrl,
  };
}

/** Public helper for pages that override metadata.alternates */
export function getHreflangLanguages(path: string) {
  return buildHreflangAlternates(path);
}

function resolvePageLanguage(path: string): Locale {
  return getLocaleFromPath(path);
}

function buildDefaultKeywords(locale: Locale): string[] {
  if (locale === "en") {
    return [
      "Planory",
      "workforce scheduling software",
      "team scheduling",
      "SKYNET",
      "24/7 scheduling",
      "healthcare workforce scheduling",
    ];
  }
  return [
    "Planory",
    "planning IA",
    "planification équipes",
    "logiciel planning France",
    "SKYNET",
  ];
}

export function createPageMetadata({
  path,
  title,
  description,
  keywords = [],
}: PageMetaInput): Metadata {
  const locale = resolvePageLanguage(path);
  const basePath = stripLocalePrefix(path);
  const page = getSitePage(basePath);
  const enMeta = locale === "en" ? EN_WEB_PAGE_META[basePath] : undefined;
  const pageTitle = title ?? enMeta?.title ?? page?.title ?? SITE_NAME;
  const pageDescription =
    description ?? enMeta?.description ?? page?.description ?? SITE_DESCRIPTION;
  const url = `${SITE_URL}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...buildDefaultKeywords(locale), ...keywords],
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(path),
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_GB" : SITE_LOCALE,
      alternateLocale: locale === "en" ? ["fr_FR"] : ["en_GB"],
      type: "website",
      images: [
        {
          url: "/og-planory.png",
          width: 1200,
          height: 630,
          alt:
            locale === "en"
              ? "Planory — 24/7 workforce scheduling software with SKYNET AI"
              : "Planory — logiciel de planning d'équipes 24/7 avec IA SKYNET",
        },
        {
          url: "/planory-logo.png",
          width: 512,
          height: 512,
          alt: "Logo Planory",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ["/og-planory.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: "/planory-logo.png", type: "image/png" }],
      apple: [{ url: "/planory-logo.png", type: "image/png" }],
    },
    other: {
      "geo.region": SITE_REGION,
      "geo.placename": "France",
      "content-language": locale === "en" ? "en-GB" : SITE_LANGUAGE,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORGANIZATION.name,
    url: ORGANIZATION.url,
    email: ORGANIZATION.email,
    description: ORGANIZATION.description,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/planory-logo.png`,
      width: 512,
      height: 512,
    },
    areaServed: ORGANIZATION.areaServed.map((area) => ({
      "@type": "Country",
      name: area,
    })),
    knowsAbout: ORGANIZATION.knowsAbout,
    ...(getBrandSameAs().length > 0 ? { sameAs: [...getBrandSameAs()] } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: [SITE_LANGUAGE, "en-GB"],
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "ContactAction",
      target: `mailto:${ORGANIZATION.email}`,
      name: "Prendre contact avec Planory",
    },
  };
}

/** Liste des pages principales — aide Google à comprendre la structure (sitelinks) */
export function siteNavigationJsonLd() {
  const frNav = SITE_PAGES.filter((p) => p.path !== "/").map((page) => ({
    "@type": "SiteNavigationElement",
    name: page.label,
    description: page.snippet,
    url: `${SITE_URL}${page.path}`,
  }));

  const enNav = SITE_PAGES.filter((p) => p.path !== "/" && p.path !== "/en").map((page) => ({
    "@type": "SiteNavigationElement",
    name: EN_NAV_LABELS[page.path] ?? page.label,
    description: page.snippet,
    url: `${SITE_URL}${localizePath(page.path, "en")}`,
    inLanguage: "en-GB",
  }));

  return [...frNav, ...enNav];
}

export function mainPagesItemListJsonLd() {
  return {
    "@type": "ItemList",
    name: "Sections principales Planory",
    itemListElement: SITE_PAGES.filter((p) => p.path !== "/").map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.label,
      description: page.snippet,
      url: `${SITE_URL}${page.path}`,
    })),
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: ORGANIZATION.description,
    url: SITE_URL,
    inLanguage: [SITE_LANGUAGE, "en-GB"],
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/contact`,
      availability: "https://schema.org/InStock",
      description: "Devis sur mesure — contactez Planory pour une recommandation adaptée",
      areaServed: { "@type": "Country", name: "France" },
    },
    featureList: [
      "Gestion RH intégrée",
      "Planning équipes et ressources",
      "Moteur IA SKYNET",
      "Conformité règles métier et légales",
      "Planification 24/7 réglementée",
    ],
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

function resolveWebPageMeta(path: string): {
  title: string;
  description: string;
  inLanguage: string;
} | null {
  const locale = resolvePageLanguage(path);
  const basePath = stripLocalePrefix(path);
  const inLanguage = locale === "en" ? "en-GB" : SITE_LANGUAGE;

  if (basePath.startsWith("/ressources/") && basePath !== "/ressources/outils") {
    const slug = basePath.split("/").pop();
    if (!slug) return null;
    const article = getResourceArticle(slug, locale);
    if (!article) return null;
    return {
      title: `${article.title} | Planory`,
      description: article.description,
      inLanguage,
    };
  }

  if (basePath.startsWith("/ressources/outils/")) {
    const slug = basePath.split("/").pop();
    if (!slug) return null;
    const magnet = getLeadMagnet(slug, locale);
    if (!magnet) return null;
    return {
      title: magnet.title,
      description: magnet.description,
      inLanguage,
    };
  }

  const page = getSitePage(basePath);
  if (page) {
    const enMeta = locale === "en" ? EN_WEB_PAGE_META[basePath] : undefined;
    return {
      title: enMeta?.title ?? page.title,
      description: enMeta?.description ?? page.description,
      inLanguage,
    };
  }

  if (basePath === "/ressources/outils") {
    const meta = EN_WEB_PAGE_META["/ressources/outils"];
    if (locale === "en" && meta) {
      return { ...meta, inLanguage };
    }
    return {
      title: "Outils gratuits — grilles et modèles planification | Planory",
      description:
        "Outils gratuits Planory : grilles d'auto-diagnostic Excel vs logiciel, modèles et checklists pour cadrer un projet de planification d'équipes 24/7.",
      inLanguage,
    };
  }

  return null;
}

export function webPageJsonLd(path: string) {
  const meta = resolveWebPageMeta(path);
  if (!meta) return null;

  return {
    "@type": "WebPage",
    "@id": `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name: meta.title,
    description: meta.description,
    inLanguage: meta.inLanguage,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#software` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-planory.png`,
      width: 1200,
      height: 630,
    },
  };
}

export function faqPageJsonLd(locale: Locale = "fr") {
  const path = locale === "en" ? "/en/faq" : "/faq";
  return customFaqJsonLd(getFaqItems(locale), `${SITE_URL}${path}#faqpage`);
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function articleJsonLd(
  article: {
    path: string;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt: string;
  },
  locale: Locale = "fr",
) {
  return {
    "@type": "Article",
    "@id": `${SITE_URL}${article.path}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: locale === "en" ? "en-GB" : SITE_LANGUAGE,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@id": `${SITE_URL}${article.path}#webpage` },
  };
}

export function resourceArticlesItemListJsonLd() {
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/ressources#article-list`,
    name: "Guides planification et planning équipes — Planory",
    numberOfItems: RESOURCE_ARTICLES.length,
    itemListElement: RESOURCE_ARTICLES.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      description: article.description,
      url: `${SITE_URL}${article.path}`,
    })),
  };
}

export function toolsItemListJsonLd(locale: Locale = "fr") {
  const hubPath = localizePath(TOOLS_HUB_PATH, locale);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "en" ? "Free Planory tools" : "Outils gratuits Planory",
    url: `${SITE_URL}${hubPath}`,
    numberOfItems: LEAD_MAGNETS.length,
    itemListElement: LEAD_MAGNETS.map((base, index) => {
      const magnet = getLeadMagnet(base.slug, locale)!;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: magnet.title,
        url: `${SITE_URL}${localizePath(magnet.path, locale)}`,
      };
    }),
  };
}

export function customFaqJsonLd(
  items: readonly { question: string; answer: string }[],
  id: string,
) {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function globalGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      websiteJsonLd(),
      softwareApplicationJsonLd(),
      mainPagesItemListJsonLd(),
      ...siteNavigationJsonLd(),
    ],
  };
}

export const defaultKeywords = [
  "planning augmenté IA",
  "logiciel planification France",
  "gestion RH planning",
  "astreintes hôpital",
  "planning aéroport 24/7",
  SITE_TAGLINE,
];
