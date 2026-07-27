import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { DiscoverPlanory } from "@/components/seo/DiscoverPlanory";
import { BrandPresenceSection } from "@/components/geo/BrandPresenceSection";
import { Hero } from "@/components/Hero";
import { ValuePropositionSection } from "@/components/ValuePropositionSection";
import { HomeLeadMagnetSection } from "@/components/HomeLeadMagnetSection";
import type { Locale } from "@/lib/i18n";
import { homePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return generateLocaleStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const locale = parseLocaleParam((await params).locale);
  const path = homePath(locale);
  const url = `${SITE_URL}${path}`;

  return {
    ...createPageMetadata({
      path,
      keywords:
        locale === "en"
          ? [
              "healthcare workforce scheduling software",
              "workforce scheduling software",
              "shift planning software",
              "hospital workforce scheduling",
              "AI scheduling",
              "24/7 team scheduling",
            ]
          : undefined,
    }),
    alternates: {
      canonical: locale === "en" ? url : SITE_URL,
      languages: {
        "fr-FR": SITE_URL,
        "en-GB": `${SITE_URL}/en`,
        "x-default": SITE_URL,
      },
    },
  };
}

export default async function Home({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = homePath(locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell currentPath={path}>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: locale === "en" ? "Home" : "Accueil", path }]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <Hero locale={locale} />
      <HomeLeadMagnetSection locale={locale} />
      <ValuePropositionSection locale={locale} />
      <DiscoverPlanory locale={locale} />
      <BrandPresenceSection locale={locale} />
    </SiteShell>
  );
}
