import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { sectionY } from "@/components/ui/section";

/** Citation canonique home — visible pour SEO et moteurs génératifs */
export function HomeGeoSection() {
  return (
    <section aria-label="À propos de Planory" className={`${sectionY}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <GeoDefinition variant="home" />
      </div>
    </section>
  );
}
