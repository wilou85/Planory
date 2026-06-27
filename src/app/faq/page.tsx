import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { FaqSection } from "@/components/FaqSection";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata = createPageMetadata({ path: "/faq" });

export default function FaqPage() {
  const webPage = webPageJsonLd("/faq");

  return (
    <SiteShell currentPath="/faq">
      <JsonLd
        data={[
          faqPageJsonLd(),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <section className="py-14 sm:pb-0">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="faq" />
          </div>
        </section>
        <FaqSection />
        <ContactSection />
      </PageContent>
    </SiteShell>
  );
}
