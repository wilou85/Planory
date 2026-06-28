"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { sectionHeadMb, sectionY } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IconBox } from "@/components/ui/IconBox";
import { SECTORS } from "@/lib/content";
import { SECTOR_ICONS } from "@/lib/icons";
export function SectorsSection() {
  return (
    <section id="secteurs" className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`${sectionHeadMb} grid gap-4 lg:grid-cols-2 lg:gap-8`}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel>Secteurs</SectionLabel>
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Des exemples concrets par secteur
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="self-end text-lg leading-relaxed text-slate-400 lg:pb-1"
          >
            Planory s&apos;adapte à la structure de contraintes de chaque secteur —
            réglementaire, opérationnel ou social.
          </motion.p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector, i) => {
            const Icon = SECTOR_ICONS[sector.icon];
            return (
              <motion.article
                key={sector.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.99 }}
                className="group flex flex-col rounded-2xl border border-white/8 bg-[#0c1220]/60 p-5 transition-colors hover:border-white/15 hover:bg-[#0c1220]/90"
              >
                <IconBox
                  icon={Icon}
                  className="mb-4 transition-colors group-hover:border-sky-500/30 group-hover:text-sky-400"
                />
                <h3 className="text-lg font-semibold text-white">{sector.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                  {sector.description}
                </p>
                {"href" in sector && sector.href ? (
                  <Link
                    href={sector.href}
                    className="mt-4 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
                  >
                    En savoir plus →
                  </Link>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  {sector.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#050a14] px-3 py-1 text-xs text-slate-400 ring-1 ring-white/8"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
