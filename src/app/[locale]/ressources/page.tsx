import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { ResourcesHub } from "@/components/ResourcesHub";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { getResourceArticles } from "@/lib/resources";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  resourceArticlesItemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const BASE_PATH = "/ressources";

const TITLE: Record<Locale, string | undefined> = {
  fr: undefined,
  en: "Scheduling guides & team planning | Planory",
};

const DESCRIPTION: Record<Locale, string | undefined> = {
  fr: undefined,
  en: "Practical guides on team scheduling, on-call duties and 24/7 shift patterns.",
};

const KEYWORDS: Record<Locale, string[]> = {
  fr: ["guide planning équipe", "planification RH", "planning excel"],
  en: ["team scheduling guide", "HR planning guide", "workforce scheduling", "on-call planning"],
};

const LABEL: Record<Locale, string> = { fr: "Articles", en: "Blogs" };

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return generateLocaleStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);

  return createPageMetadata({
    path,
    title: TITLE[locale],
    description: DESCRIPTION[locale],
    keywords: KEYWORDS[locale],
  });
}

function resourceArticlesItemListJsonLdFor(locale: Locale, path: string) {
  if (locale === "fr") return resourceArticlesItemListJsonLd();
  const articles = getResourceArticles("en");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}${path}#article-list`,
    name: "Scheduling guides & team planning — Planory",
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      description: article.description,
      url: `${SITE_URL}${article.path}`,
    })),
  };
}

export default async function RessourcesPage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell currentPath={path} layout="content" breadcrumbs={[{ name: LABEL[locale], path }]}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
            { name: LABEL[locale], path },
          ]),
          resourceArticlesItemListJsonLdFor(locale, path),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ResourcesHub locale={locale} />
        <section className="pb-14 pt-10 sm:pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="faq" locale={locale} />
          </div>
        </section>
      </PageContent>
    </SiteShell>
  );
}
