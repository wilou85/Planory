"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import {
  CompetitorComparisonTable,
  PlanningComparisonTable,
} from "@/components/geo/PlanningComparisonTable";
import { CONTACT_EMAIL } from "@/lib/content";
import { HOSPITAL_SECTOR } from "@/lib/resources";

export function HospitalSectorContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { hero, challenges, features, useCases, faq } = HOSPITAL_SECTOR;

  return (
    <>
      <section className="relative py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>{hero.label}</SectionLabel>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {hero.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">{hero.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`mailto:${CONTACT_EMAIL}`} variant="primary" showArrow external>
              Demander une démo
            </Button>
            <Button href="/produit#planning" variant="secondary">
              Voir le module Planning
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6 lg:px-8">
          <GeoDefinition variant="hospital" />
          <CompetitorComparisonTable id="comparatif-hopital" />
          <PlanningComparisonTable id="comparatif-hopital-sirh" />
        </div>
      </section>

      <section className="border-t border-white/10 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{challenges.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">{challenges.intro}</p>
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

      <section className="border-t border-white/10 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{features.title}</h2>
          <ul className="mt-8 space-y-3">
            {features.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                  <Check className="h-3 w-3 text-emerald-400" aria-hidden />
                </span>
                <span className="text-sm leading-relaxed text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{useCases.title}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {useCases.items.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/8 bg-[#0c1220]/60 p-5"
              >
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Questions fréquentes</h2>
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {faq.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    className="flex min-h-[52px] w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span className="text-base font-medium text-slate-200">{item.question}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }}>
                      <Plus className="h-4 w-4 text-slate-400" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pb-5 text-sm leading-relaxed text-slate-400"
                      >
                        {item.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            <Link href="/ressources/planning-excel-vs-logiciel" className="text-sky-400 hover:text-sky-300">
              Lire aussi : Planning Excel vs logiciel
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
