import { getLiveBrandProfiles } from "@/lib/site";
import { sectionY } from "@/components/ui/section";
import type { Locale } from "@/lib/i18n";

type BrandPresenceSectionProps = {
  locale?: Locale;
};

const COPY = {
  fr: {
    heading: "Présence Planory",
    intro: "Profils officiels pour vérifier l'identité de la marque.",
  },
  en: {
    heading: "Planory online",
    intro: "Official profiles to verify the brand identity.",
  },
} as const;

/** Affiche les profils sameAs live (LinkedIn, G2…). Ne rend rien s'il n'y en a pas. */
export function BrandPresenceSection({ locale = "fr" }: BrandPresenceSectionProps) {
  const profiles = getLiveBrandProfiles();
  if (profiles.length === 0) return null;

  const copy = COPY[locale];

  return (
    <section aria-labelledby="brand-presence-heading" className={sectionY}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 id="brand-presence-heading" className="text-xl font-bold text-white sm:text-2xl">
          {copy.heading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">{copy.intro}</p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer me"
                className="text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
              >
                {profile.platform}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
