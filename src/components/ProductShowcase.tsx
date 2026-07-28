"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getPageUi } from "@/lib/get-content";
import type { Locale } from "@/lib/i18n";

type ProductShowcaseProps = {
  locale?: Locale;
};

export function ProductShowcase({ locale = "fr" }: ProductShowcaseProps) {
  const items = getPageUi(locale).productShowcase.items;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      const card = el.querySelector<HTMLElement>("[data-showcase-card]");
      if (!card) return;
      const step = card.offsetWidth + 12; // gap-3
      const index = Math.round(el.scrollLeft / step);
      setActive(Math.min(Math.max(index, 0), items.length - 1));
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [items.length]);

  function scrollToIndex(index: number) {
    const el = scrollerRef.current;
    const card = el?.querySelectorAll<HTMLElement>("[data-showcase-card]")[index];
    card?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }

  return (
    <motion.div
      id="exemple"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="mt-8 scroll-mt-28 sm:mt-10 sm:scroll-mt-32"
    >
      {/* Mobile / tablette : un visuel dominant + swipe */}
      <div className="lg:hidden">
        <div
          ref={scrollerRef}
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={locale === "en" ? "Product screenshots" : "Captures produit"}
        >
          {items.map((item) => (
            <figure
              key={item.src}
              data-showcase-card
              className="w-[88%] max-w-md shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]/60 shadow-[0_0_48px_-16px_rgba(56,189,248,0.12)]"
            >
              <div className="relative aspect-[16/10] w-full bg-white/[0.02]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="88vw"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <figcaption className="px-4 py-3 text-xs leading-relaxed text-slate-500 sm:text-sm">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
        {items.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2" role="tablist">
            {items.map((item, index) => (
              <button
                key={item.src}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-label={`${index + 1} / ${items.length}`}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  active === index ? "w-5 bg-sky-400" : "w-2 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop : grille 2 colonnes */}
      <div className="hidden gap-5 lg:grid lg:grid-cols-2">
        {items.map((item) => (
          <figure
            key={item.src}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]/60 shadow-[0_0_48px_-16px_rgba(56,189,248,0.12)]"
          >
            <div className="relative aspect-[16/10] w-full bg-white/[0.02]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="50vw"
                className="object-cover object-top"
                priority
              />
            </div>
            <figcaption className="px-4 py-3 text-sm leading-relaxed text-slate-500">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </motion.div>
  );
}
