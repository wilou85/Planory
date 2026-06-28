import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const PATH = "/en/contact";
const FR_PATH = "/contact";

export const metadata = {
  ...createPageMetadata({
    path: PATH,
    title: "Contact Planory — Demo request and inquiry",
    description:
      "Contact Planory for a 20-minute call about your 24/7 team scheduling context. Contact form — quick response.",
    keywords: ["contact Planory", "scheduling demo", "workforce scheduling software"],
  }),
  alternates: {
    canonical: `${SITE_URL}${PATH}`,
    languages: {
      "fr-FR": `${SITE_URL}${FR_PATH}`,
      "en-GB": `${SITE_URL}${PATH}`,
    },
  },
  openGraph: {
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
  },
};

export default function EnglishContactPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell currentPath={PATH} layout="content">
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "Contact", path: PATH },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ContactSection standalone locale="en" />
      </PageContent>
    </SiteShell>
  );
}
