import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { FaqSection } from "@/components/FaqSection";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { getFaqItems } from "@/lib/get-content";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  customFaqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const PATH = "/en/faq";
const FR_PATH = "/faq";

export const metadata = {
  ...createPageMetadata({
    path: PATH,
    title: "Planory FAQ: scheduling, on-call, SKYNET and deployment",
    description:
      "Answers on HR planning, on-call duties, SKYNET, workforce scheduling, deployment and HRIS integration.",
    keywords: [
      "workforce scheduling FAQ",
      "SKYNET AI scheduling",
      "on-call planning",
      "scheduling software deployment",
    ],
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

export default function EnglishFaqPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell currentPath={PATH}>
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          customFaqJsonLd(getFaqItems("en"), `${SITE_URL}${PATH}#faqpage`),
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "FAQ", path: PATH },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <section className="py-14 sm:pb-0">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="faq" locale="en" />
          </div>
        </section>
        <FaqSection locale="en" />
      </PageContent>
    </SiteShell>
  );
}
