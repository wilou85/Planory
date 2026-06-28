"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const SHOWCASE_ITEMS = [
  {
    src: "/produit-planning-equipe.png",
    alt: "Interface Planory — planning équipe avec roulements, astreintes et codes métier sur un horizon mensuel",
    caption: "Planning équipe — vue mensuelle avec contraintes et codes métier",
  },
  {
    src: "/produit-secteurs-planning.png",
    alt: "Planory — planification 24/7 pour aéroport, hôpital et industrie avec calendrier de roulements",
    caption: "Hôpital, aéroport, industrie — un même moteur de planification",
  },
] as const;

export function ProductShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-2"
    >
      {SHOWCASE_ITEMS.map((item) => (
        <figure
          key={item.src}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]/60 shadow-[0_0_48px_-16px_rgba(56,189,248,0.12)]"
        >
          <div className="relative aspect-[16/10] w-full bg-white/[0.02]">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
              priority
            />
          </div>
          <figcaption className="px-4 py-3 text-xs leading-relaxed text-slate-500 sm:text-sm">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </motion.div>
  );
}
