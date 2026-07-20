import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const BASE_PATH = "/contact";

const TITLE: Record<Locale, string> = {
  fr: "Contact Planory — Demande de démo et échange",
  en: "Contact Planory — Demo request and inquiry",
};

const DESCRIPTION: Record<Locale, string> = {
  fr:
    "Contactez Planory pour un échange de 20 minutes sur votre contexte de planification d'équipes 24/7. Formulaire de contact — réponse rapide.",
  en: "Contact Planory for a 20-minute call about your 24/7 team scheduling context. Contact form — quick response.",
};

const KEYWORDS: Record<Locale, string[]> = {
  fr: ["contact Planory", "démo planning", "logiciel planning équipe"],
  en: ["contact Planory", "scheduling demo", "workforce scheduling software"],
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

export default async function ContactPage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(BASE_PATH, locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell currentPath={path} layout="content">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
            { name: "Contact", path },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ContactSection standalone locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
