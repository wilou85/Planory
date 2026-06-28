import Link from "next/link";
import { Check } from "lucide-react";
import { ContactButton } from "@/components/ContactButton";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { sectionY } from "@/components/ui/section";
import { HOSPITAL_SECTOR } from "@/lib/hospital-sector";

export function HospitalSectorContent() {
  const { hero, medicalPlanning, fph, challenges, features, useCases, faq } = HOSPITAL_SECTOR;

  return (
    <>
      <section className={`relative ${sectionY}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-400">
            {hero.label}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            {hero.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{hero.intro}</p>
          <div className="mt-6">
            <ContactButton variant="primary" showArrow>
              Échanger sur votre planning hospitalier
            </ContactButton>
          </div>
          <div className="mt-10">
            <GeoDefinition variant="hospital" />
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
            Guides associés :{" "}
            <Link href="/ressources/planning-hospitalier" className="text-sky-400 hover:text-sky-300">
              planning hospitalier
            </Link>
            {" · "}
            <Link href="/ressources/planning-medical" className="text-sky-400 hover:text-sky-300">
              planning médical
            </Link>
            {" · "}
            <Link href="/ressources/planning-12h-hopital" className="text-sky-400 hover:text-sky-300">
              planning en 12 heures
            </Link>
            {" · "}
            <Link href="/ressources/gestion-astreintes" className="text-sky-400 hover:text-sky-300">
              gestion des astreintes
            </Link>
            {" · "}
            <Link href="/ressources/travail-nuit-planning-2x8" className="text-sky-400 hover:text-sky-300">
              travail de nuit et 2×8
            </Link>
            {" · "}
            <Link href="/produit" className="text-sky-400 hover:text-sky-300">
              logiciel de gestion de planning
            </Link>
          </p>
        </div>
      </section>

      <section id="faq" className={`${sectionY}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">Questions fréquentes</h2>
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
