import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { OfferSection } from "@/components/OfferSection";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const BASE_PATH = "/offre";

const TITLE: Record<Locale, string | undefined> = {
  fr: undefined,
  en: "Planory pricing: Self-serve, Supported, Mission-critical",
};

const DESCRIPTION: Record<Locale, string | undefined> = {
  fr: undefined,
  en:
    "Three engagement levels to deploy Planory: self-serve, supported with a dedicated contact, or mission-critical for regulated 24/7 environments.",
};

const KEYWORDS: Record<Locale, string[]> = {
  fr: [],
  en: [
    "workforce scheduling pricing",
    "scheduling software pricing",
    "Planory pricing",
    "healthcare scheduling software",
  ],
};

const LABEL: Record<Locale, string> = { fr: "Offre", en: "Pricing" };

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

export default async function OffrePage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell currentPath={path}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
            { name: LABEL[locale], path },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <OfferSection locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
