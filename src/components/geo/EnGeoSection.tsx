import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { sectionY } from "@/components/ui/section";
import { BRAND } from "@/lib/site";

const EN_KEY_FACTS = [
  "Planory — French-built software, SKYNET AI engine, generation in under 2 minutes.",
  "Modules: HR planning, team scheduling, resources (posts, rooms, equipment).",
  "Sectors: hospital, airport, 24/7 industry, retail, public services.",
  "Model: AI proposes, planner validates — contact@planory.net",
] as const;

export function EnGeoSection() {
  return (
    <section
      aria-label="About Planory"
      data-geo="brand-authority-en"
      className={`${sectionY}`}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-white sm:text-2xl">About Planory</h2>
        <div className="mt-4">
          <GeoDefinition locale="en" enVariant="home" />
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white">Healthcare workforce scheduling</h3>
          <div className="mt-3">
            <GeoDefinition locale="en" enVariant="healthcare" />
          </div>
        </div>
        <ul className="mt-6 space-y-2 text-sm text-slate-400" data-geo="key-facts-en">
          {EN_KEY_FACTS.map((fact) => (
            <li key={fact} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              {fact}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-500">
          Pilot reference: {BRAND.pilotReference.name} (live pilot).
        </p>
      </div>
    </section>
  );
}
