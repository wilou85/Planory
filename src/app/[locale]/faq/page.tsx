import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { FaqSection } from "@/components/FaqSection";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const BASE_PATH = "/faq";

const TITLE: Record<Locale, string | undefined> = {
  fr: undefined,
  en: "Planory FAQ: scheduling, on-call, SKYNET and deployment",
};

const DESCRIPTION: Record<Locale, string | undefined> = {
  fr: undefined,
  en:
    "Answers on HR planning, on-call duties, SKYNET, workforce scheduling, deployment and HRIS integration.",
};

const KEYWORDS: Record<Locale, string[]> = {
  fr: [],
  en: [
    "workforce scheduling FAQ",
    "SKYNET AI scheduling",
    "on-call planning",
    "scheduling software deployment",
  ],
};

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

export default async function FaqPage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell currentPath={path}>
      <JsonLd
        data={[
          faqPageJsonLd(locale),
          breadcrumbJsonLd([
            { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
            { name: "FAQ", path },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <section className="py-14 sm:pb-0">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="faq" locale={locale} />
          </div>
        </section>
        <FaqSection locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
