import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { LegalDocument } from "@/components/LegalDocument";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const BASE_PATH = "/confidentialite";
const LABEL: Record<Locale, string> = { fr: "Confidentialité", en: "Privacy" };

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return generateLocaleStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);

  return createPageMetadata({ path });
}

export default async function ConfidentialitePage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell currentPath={path} layout="content">
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
        <LegalDocument id="privacy" locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
