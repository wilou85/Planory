import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ProductSection } from "@/components/ProductSection";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const BASE_PATH = "/produit";

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
            "workforce scheduling software",
            "team scheduling software",
            "HR planning",
            "shift planning software",
            "scheduling software",
            "workforce scheduling",
            "AI scheduling",
          ]
        : [
            "planning social",
            "logiciel planning équipe",
            "planification RH",
            "gestion planning",
            "gestion des plannings",
            "planning logiciel",
            "logiciel de gestion de planning",
            "logiciel optimisation planning",
            "gestion planning personnel",
            "planning IA",
          ],
  });
}

export default async function ProduitPage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell currentPath={path}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
            { name: locale === "en" ? "Product" : "Produit", path },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ProductSection locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
