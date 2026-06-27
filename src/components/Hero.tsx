"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { DashboardMockup } from "@/components/DashboardMockup";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { fadeUp, staggerContainer } from "@/components/ui/motion";
import { CONTACT_EMAIL } from "@/lib/content";
import { HERO_COPY, type Locale } from "@/lib/i18n";

type HeroProps = {
  locale?: Locale;
};

export function Hero({ locale = "fr" }: HeroProps) {
  const copy = HERO_COPY[locale];
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setMotionReady(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-[5.25rem] pb-10 sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={
            motionReady
              ? { opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }
              : { opacity: 0.65, scale: 1 }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 h-[420px] w-full max-w-[900px] -translate-x-1/2 rounded-full bg-sky-500/8 blur-[100px] sm:h-[600px] sm:blur-[120px] lg:left-[65%]"
        />
      </div>

      <div className="relative mx-auto grid w-full min-w-0 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 xl:gap-12 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div variants={staggerContainer} initial={false} animate="visible" className="min-w-0">
          <motion.div
            custom={0}
            variants={fadeUp}
            className="mb-5 flex flex-wrap items-center gap-2 sm:mb-6"
          >
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur-sm sm:px-4 sm:text-xs">
              <span className="animate-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span className="truncate">{copy.pilot}</span>
            </span>
            <LanguageSwitcher />
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="text-[1.75rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[3.25rem]"
          >
            {copy.title}
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="mt-2 text-sm font-medium text-sky-400/90 sm:text-base"
          >
            {copy.subtitle}
          </motion.p>

          <motion.p
            custom={3}
            variants={fadeUp}
            className="mt-3 text-sm font-semibold text-white/90 sm:mt-2 sm:text-base"
          >
            {copy.skynetTagline}
          </motion.p>

          <motion.p
            custom={4}
            variants={fadeUp}
            className="mt-2 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            {copy.description}
          </motion.p>

          <motion.div
            custom={5}
            variants={fadeUp}
            className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3"
          >
            <Button href={`mailto:${CONTACT_EMAIL}`} variant="primary" size="sm" showArrow external>
              {copy.ctaPrimary}
            </Button>
            <Button href={copy.ctaSecondaryHref} variant="secondary" size="sm">
              {copy.ctaSecondary}
            </Button>
          </motion.div>

          <motion.div
            custom={6}
            variants={fadeUp}
            className="mt-6 lg:hidden"
          >
            <DashboardMockup compact />
          </motion.div>

          <motion.div
            custom={7}
            variants={fadeUp}
            className="mt-6 border-t border-white/10 pt-5 lg:mt-8"
          >
            <ul className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-1 sm:gap-y-2">
              {copy.stats.map((stat, i) => (
                <li key={stat.labelDesktop} className="flex items-center gap-2.5 sm:gap-1">
                  {i > 0 && (
                    <span className="hidden text-slate-600 sm:inline" aria-hidden>
                      ·
                    </span>
                  )}
                  <span className="text-sm sm:text-base">
                    <span className="font-bold text-white">{stat.value}</span>
                    <span className="text-slate-400">
                      {" "}
                      <span className="sm:hidden">{stat.label}</span>
                      <span className="hidden sm:inline">{stat.labelDesktop}</span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={false}
          animate={motionReady ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="hidden min-w-0 w-full lg:block"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
