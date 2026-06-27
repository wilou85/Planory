"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { sectionHeadMb, sectionY } from "@/components/ui/section";
import { CONTACT_EMAIL, OFFERS } from "@/lib/content";
import { OfferComparisonTable } from "@/components/OfferComparisonTable";
import { IconBox } from "@/components/ui/IconBox";
import { OFFER_TIER_ICONS } from "@/lib/icons";

export function OfferSection() {
  return (
    <section id="offre" className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`${sectionHeadMb} grid gap-4 lg:grid-cols-2 lg:gap-8`}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel>Offre</SectionLabel>
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Trois niveaux d&apos;engagement
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="self-end text-lg leading-relaxed text-slate-400 lg:pb-1"
          >
            Pas de grille tarifaire publique : chaque déploiement est unique. Nous recommandons
            le niveau adapté à votre contexte lors du premier échange.
          </motion.p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {OFFERS.map((offer, i) => {
            const TierIcon = OFFER_TIER_ICONS[offer.tier];
            return (
            <motion.article
              key={offer.tier}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ y: -3, scale: offer.highlighted ? 1.02 : 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`group relative flex flex-col rounded-2xl border p-4 transition-all sm:p-6 ${
                offer.highlighted
                  ? "border-white/20 bg-[#0c1220] shadow-[0_0_60px_-12px_rgba(56,189,248,0.15)]"
                  : "border-white/8 bg-[#0c1220]/60 hover:border-white/15"
              }`}
            >
              {"badge" in offer && offer.badge && (
                <span className="absolute -top-3 right-6 rounded-full bg-sky-400 px-3 py-1 text-xs font-semibold text-[#050a14]">
                  {offer.badge}
                </span>
              )}
              <IconBox
                icon={TierIcon}
                size="sm"
                className="mb-4 text-sky-400 group-hover:border-sky-500/30"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                {offer.tier}
              </p>
              <h3 className="mt-3 text-xl font-bold text-white">{offer.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{offer.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  href={`mailto:${CONTACT_EMAIL}?subject=Planory%20—%20${encodeURIComponent(offer.tier)}`}
                  variant={offer.highlighted ? "primary" : "ghost"}
                  showArrow
                  external
                  className="w-full"
                >
                  {offer.cta}
                </Button>
              </div>
            </motion.article>
          );
          })}
        </div>
        <OfferComparisonTable />
      </div>
    </section>
  );
}
