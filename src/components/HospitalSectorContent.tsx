import Link from "next/link";
import { Check } from "lucide-react";
import { ContactButton } from "@/components/ContactButton";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { sectionY } from "@/components/ui/section";
import { getHospitalSector, getPageUi } from "@/lib/get-content";
import { localizePath, type Locale } from "@/lib/i18n";

type HospitalSectorContentProps = {
  locale?: Locale;
};

export function HospitalSectorContent({ locale = "fr" }: HospitalSectorContentProps) {
  const { hero, medicalPlanning, fph, challenges, features, useCases, faq } =
    getHospitalSector(locale);
  const ui = getPageUi(locale).hospital;

  return (
    <>
      <section className={`relative ${sectionY}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-400">
            {hero.label}
          </p>
          {"pilotNote" in hero && typeof hero.pilotNote === "string" && hero.pilotNote ? (
            <p className="mt-2 text-sm font-medium text-sky-300/90">{hero.pilotNote}</p>
          ) : null}
          <h1 className="text-fluid-heading mt-3 font-bold text-white">
            {hero.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{hero.intro}</p>
          <div className="mt-6">
            <ContactButton variant="primary" showArrow analyticsSource="sector_hospital">
              {ui.cta}
            </ContactButton>
          </div>
          <div className="mt-10">
            <GeoDefinition variant="hospital" locale={locale} enVariant="healthcare" />
          </div>
        </div>
      </section>

      <section className={`${sectionY}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">{medicalPlanning.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-400">{medicalPlanning.intro}</p>
          <ul className="mt-8 space-y-6">
            {medicalPlanning.items.map((item) => (
              <li key={item.title}>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${sectionY}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">{fph.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">{fph.text}</p>
        </div>
      </section>

      <section className={`${sectionY}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">{challenges.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-400">{challenges.intro}</p>
          <ul className="mt-8 space-y-6">
            {challenges.items.map((item) => (
              <li key={item.title}>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${sectionY}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">{features.title}</h2>
          <ul className="mt-6 space-y-3">
            {features.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${sectionY}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">{useCases.title}</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {useCases.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-white/8 bg-[#0c1220]/60 p-5"
              >
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-slate-500">
            {ui.relatedLabel}{" "}
            {ui.relatedLinks.map((link, i) => (
              <span key={link.href}>
                {i > 0 && " · "}
                <Link
                  href={localizePath(link.href, locale)}
                  className="text-sky-400 hover:text-sky-300"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </section>

      <section id="faq" className={`${sectionY}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">{ui.faqHeading}</h2>
          <dl className="mt-8 space-y-6">
            {faq.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold text-white">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-400">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
