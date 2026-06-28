"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactButton } from "@/components/ContactButton";
import { HeroMockup } from "@/components/HeroMockup";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { fadeUp, staggerContainer } from "@/components/ui/motion";
import { HERO_COPY, localizePath, type Locale } from "@/lib/i18n";

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
        <div className="absolute left-1/2 top-0 h-[420px] w-full max-w-[900px] -translate-x-1/2 rounded-full bg-sky-500/8 blur-[100px] sm:h-[600px] sm:blur-[120px] lg:left-[65%]" />
      </div>

      <div className="relative mx-auto grid w-full min-w-0 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 xl:gap-12 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div variants={staggerContainer} initial={false} animate="visible" className="min-w-0">
          <motion.div
            custom={0}
            variants={fadeUp}
            className="mb-5 flex flex-wrap items-center gap-2 sm:mb-6"
          >
            <LanguageSwitcher />
          </motion.div>

          <h1 className="text-[1.75rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">
            {copy.title}
          </h1>

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
            className="mt-5 flex flex-col gap-3"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
              <ContactButton variant="primary" size="sm" showArrow className="w-full sm:w-auto">
                {copy.ctaPrimary}
              </ContactButton>
              <Button
                href={localizePath(copy.ctaSecondaryHref, locale)}
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
              >
                {copy.ctaSecondary}
              </Button>
            </div>
            <p>
              <Link
                href={localizePath(copy.ctaLeadMagnetHref, locale)}
                className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
              >
                {copy.ctaLeadMagnet}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </p>
          </motion.div>

          <motion.div
            custom={6}
            variants={fadeUp}
            className="mt-6 lg:hidden"
          >
            <HeroMockup compact locale={locale} />
          </motion.div>

          <motion.div
            custom={7}
            variants={fadeUp}
            className="mt-6 pt-0 lg:mt-8"
          >
            <ul className="flex flex-col gap-2.5 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center min-[420px]:gap-x-2 min-[420px]:gap-y-1.5 xl:flex-nowrap xl:gap-x-3">
              {copy.stats.map((stat, i) => (
                <li
                  key={stat.labelDesktop}
                  className="flex min-w-0 max-w-full items-center gap-2 sm:gap-1 xl:shrink-0"
                >
                  {i > 0 && (
                    <span className="hidden min-[420px]:inline text-slate-600" aria-hidden>
                      ·
                    </span>
                  )}
                  <span className="text-sm min-[420px]:text-[0.8125rem] lg:text-base">
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
          <HeroMockup locale={locale} />
        </motion.div>
      </div>
    </section>
  );
}
