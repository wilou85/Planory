import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { SectorLandingContent } from "@/components/SectorLandingContent";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { getAirportSector, getPageUi } from "@/lib/get-content";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  customFaqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const BASE_PATH = "/secteurs/aeroport";

const KEYWORDS: Record<Locale, string[]> = {
  fr: [
    "planning aéroport",
    "planning aéroportuaire",
    "planning ATC",
    "vacations aéroport",
    "planification aéroport 24/7",
    "logiciel planning aéroport",
  ],
  en: [
    "airport scheduling software",
    "ATC scheduling",
    "airport shift planning",
    "24/7 airport workforce",
    "airport rostering",
  ],
};

const SECTORS_LABEL: Record<Locale, string> = { fr: "Secteurs", en: "Sectors" };
const LABEL: Record<Locale, string> = { fr: "Planning aéroport", en: "Airport scheduling" };

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return generateLocaleStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);

  return createPageMetadata({
    path,
    keywords: KEYWORDS[locale],
  });
}

export default async function AeroportPage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const secteursPath = localizePath("/secteurs", locale);
  const webPage = webPageJsonLd(path);
  const data = getAirportSector(locale);
  const ui = getPageUi(locale).airport;

  const trail = [
    { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
    { name: SECTORS_LABEL[locale], path: secteursPath },
    { name: LABEL[locale], path },
  ];

  return (
    <SiteShell currentPath={path} layout="content" breadcrumbs={trail.slice(1)}>
      <JsonLd
        data={[
          breadcrumbJsonLd(trail),
          customFaqJsonLd(data.faq, `${SITE_URL}${path}#faq`),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <SectorLandingContent
          locale={locale}
          data={data}
          ui={ui}
          geoVariant="airport"
          enVariant="airport"
        />
      </PageContent>
    </SiteShell>
  );
}
