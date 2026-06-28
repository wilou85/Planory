import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/lib/content";
import { getArticleUpdatedAt, RESOURCE_ARTICLES } from "@/lib/resources";
import {
  ORGANIZATION,
  BRAND,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_PAGES,
  SITE_REGION,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";

type PageMetaInput = {
  path: string;
  title?: string;
  description?: string;
  keywords?: string[];
};

export function createPageMetadata({
  path,
  title,
  description,
  keywords = [],
}: PageMetaInput): Metadata {
  const page = SITE_PAGES.find((p) => p.path === path);
  const pageTitle = title ?? page?.title ?? SITE_NAME;
  const pageDescription = description ?? page?.description ?? SITE_DESCRIPTION;
  const url = `${SITE_URL}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "Planory",
      "planning IA",
      "planification équipes",
      "logiciel planning France",
      "SKYNET",
      ...keywords,
    ],
    alternates: {
      canonical: url,
      languages: {
        [SITE_LANGUAGE]: path === "/" ? SITE_URL : url,
        "en-GB": `${SITE_URL}/en`,
        ...(path === "/en" ? { "fr-FR": SITE_URL } : {}),
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "website",
      images: [
        {
          url: "/og-planory.png",
          width: 1200,
          height: 630,
          alt: "Planory — logiciel de planning d'équipes 24/7 avec IA SKYNET",
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
      "content-language": SITE_LANGUAGE,
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
    ...(BRAND.sameAs.length > 0 ? { sameAs: [...BRAND.sameAs] } : {}),
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
    inLanguage: SITE_LANGUAGE,
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
  return SITE_PAGES.filter((p) => p.path !== "/").map((page) => ({
    "@type": "SiteNavigationElement",
    name: page.label,
    description: page.snippet,
    url: `${SITE_URL}${page.path}`,
  }));
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
    inLanguage: SITE_LANGUAGE,
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

export function webPageJsonLd(path: string) {
  const page = SITE_PAGES.find((p) => p.path === path);
  if (!page) return null;

  return {
    "@type": "WebPage",
    "@id": `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name: page.title,
    description: page.description,
    inLanguage: SITE_LANGUAGE,
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

export function faqPageJsonLd() {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faqpage`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
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

export function articleJsonLd(article: {
  path: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
}) {
  return {
    "@type": "Article",
    "@id": `${SITE_URL}${article.path}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: SITE_LANGUAGE,
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
