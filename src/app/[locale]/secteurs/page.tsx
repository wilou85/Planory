import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { SectorsSection } from "@/components/SectorsSection";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const BASE_PATH = "/secteurs";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return generateLocaleStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);

  return createPageMetadata({
    path,
    keywords:
      locale === "en"
        ? [
            "hospital scheduling",
            "healthcare workforce scheduling",
            "airport scheduling",
            "industrial shift planning",
            "24/7 team scheduling",
          ]
        : [],
  });
}

export default async function SecteursPage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell currentPath={path}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
            { name: locale === "en" ? "Sectors" : "Secteurs", path },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <section className="py-14 sm:pb-0">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="sectors" locale={locale} showSupport={false} />
          </div>
        </section>
        <SectorsSection locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
