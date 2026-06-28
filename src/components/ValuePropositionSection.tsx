"use client";

import { motion } from "framer-motion";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { sectionY } from "@/components/ui/section";
import { getHomeCopy, type Locale } from "@/lib/i18n";

type ValuePropositionSectionProps = {
  locale?: Locale;
};

export function ValuePropositionSection({ locale = "fr" }: ValuePropositionSectionProps) {
  const copy = getHomeCopy(locale).valueProposition;

  return (
    <section
      aria-labelledby="value-proposition-heading"
      className={`relative overflow-hidden ${sectionY}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(56, 189, 248, 0.06) 0%, transparent 45%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>{copy.sectionLabel}</SectionLabel>
          <h2
            id="value-proposition-heading"
            className="text-xl font-bold text-white sm:text-2xl lg:text-3xl"
          >
            {copy.heading}
          </h2>
        </div>

        <div className="mx-auto mt-6 max-w-2xl px-1 text-center sm:px-0">
          {locale === "fr" ? (
            <GeoDefinition
              variant="home"
              showSupport={false}
              className="[&_[data-geo=citation-canonical]]:text-sm sm:[&_[data-geo=citation-canonical]]:text-base lg:[&_[data-geo=citation-canonical]]:text-lg"
            />
          ) : (
            <GeoDefinition
              locale="en"
              enVariant="home"
              showSupport={false}
              className="[&_[data-geo=citation-canonical]]:text-sm sm:[&_[data-geo=citation-canonical]]:text-base lg:[&_[data-geo=citation-canonical]]:text-lg"
            />
          )}
        </div>

        <ol className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5">
          {copy.pillars.map((pillar, i) => (
            <motion.li
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-xl font-bold text-white shadow-[0_0_32px_-8px_rgba(56,189,248,0.5)]"
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-sm font-semibold leading-snug text-sky-300 sm:text-base">
                {pillar.title}
              </h3>
              {pillar.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{pillar.description}</p>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
