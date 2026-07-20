import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { HospitalSectorContent } from "@/components/HospitalSectorContent";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { getHospitalSector } from "@/lib/get-content";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  customFaqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const BASE_PATH = "/secteurs/hopital";

const TITLE: Record<Locale, string> = {
  fr: "Planning hospitalier, planning médical & planning hôpital | Planory",
  en: "Hospital scheduling, medical rostering & on-call planning | Planory",
};

const DESCRIPTION: Record<Locale, string> = {
  fr:
    "Logiciel de planning hospitalier et planning médical avec IA : gardes, planning de garde, planning roulement hospitalier, astreintes 12h et réglementation FPH.",
  en:
    "Hospital and medical scheduling software with AI: on-call duties, hospital rotation planning, 12-hour shifts and public healthcare compliance.",
};

const KEYWORDS: Record<Locale, string[]> = {
  fr: [
    "planning hospitalier",
    "planning hopital",
    "planning médical",
    "planning de garde",
    "planning roulement hospitalier",
    "logiciel planning hospitalier",
    "réglementation planning fonction publique hospitalière",
    "planning en 12 heures en milieu hospitalier",
  ],
  en: [
    "hospital scheduling",
    "medical scheduling",
    "on-call planning",
    "hospital rotation planning",
    "healthcare workforce scheduling",
    "12-hour hospital shifts",
  ],
};

const SECTORS_LABEL: Record<Locale, string> = { fr: "Secteurs", en: "Sectors" };
const LABEL: Record<Locale, string> = { fr: "Planning hospitalier", en: "Hospital scheduling" };

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

export default async function HopitalPage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const secteursPath = localizePath("/secteurs", locale);
  const webPage = webPageJsonLd(path);
  const faq = getHospitalSector(locale).faq;

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
          customFaqJsonLd(faq, `${SITE_URL}${path}#faq`),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <HospitalSectorContent locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
