import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { SectorLandingContent } from "@/components/SectorLandingContent";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { getIndustrySector, getPageUi } from "@/lib/get-content";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  customFaqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const BASE_PATH = "/secteurs/industrie";

const TITLE: Record<Locale, string> = {
  fr: "Planification industrielle 3×8 & 2×12 avec IA | Planory",
  en: "Industrial scheduling: 3×8 & 2×12 rotations with AI | Planory",
};

const DESCRIPTION: Record<Locale, string> = {
  fr:
    "Logiciel de planification industrielle : roulements 3×8, 2×12, absences, compteurs d'heures et conformité. SKYNET pour l'industrie continue.",
  en:
    "Industrial workforce scheduling software: 3×8 and 2×12 rotations, absence cover, hour balances and compliance. SKYNET for continuous industry.",
};

const KEYWORDS: Record<Locale, string[]> = {
  fr: [
    "planification industrielle",
    "planning industriel",
    "roulement 3x8",
    "planning 2x12",
    "logiciel planning industrie",
    "planning ateliers",
  ],
  en: [
    "industrial scheduling software",
    "3x8 shift planning",
    "2x12 rotation planning",
    "manufacturing workforce scheduling",
    "continuous industry rostering",
  ],
};

const SECTORS_LABEL: Record<Locale, string> = { fr: "Secteurs", en: "Sectors" };
const LABEL: Record<Locale, string> = {
  fr: "Planification industrielle",
  en: "Industrial scheduling",
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

export default async function IndustriePage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const secteursPath = localizePath("/secteurs", locale);
  const webPage = webPageJsonLd(path);
  const data = getIndustrySector(locale);
  const ui = getPageUi(locale).industry;

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
          geoVariant="industry"
          enVariant="industry"
        />
      </PageContent>
    </SiteShell>
  );
}
