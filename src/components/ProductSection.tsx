"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { sectionStack, sectionY } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IconBox } from "@/components/ui/IconBox";
import { ProductSidebar } from "@/components/ProductSidebar";
import { ProductShowcase } from "@/components/ProductShowcase";
import { getPageUi, getProductBenefits, getProductModules } from "@/lib/get-content";
import { localizePath, type Locale } from "@/lib/i18n";
import { PRODUCT_MODULE_ICONS } from "@/lib/icons";

type ProductSectionProps = {
  locale?: Locale;
};

export function ProductSection({ locale = "fr" }: ProductSectionProps) {
  const ui = getPageUi(locale);
  const benefits = getProductBenefits(locale);
  const modules = getProductModules(locale);

  return (
    <section id="produit" className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${sectionStack} lg:flex-row`}>
          <ProductSidebar locale={locale} />
          <div className="min-w-0 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionLabel>{ui.product.sectionLabel}</SectionLabel>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                {ui.product.heading[0]}
                <br />
                {ui.product.heading[1]}
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-400">
                {ui.product.intro}
              </p>
            </motion.div>

            <ProductShowcase locale={locale} />

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <ul className="space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                        <Check className="h-3 w-3 text-emerald-400" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm text-slate-500">
                  {ui.product.relatedArticles.label}{" "}
                  {ui.product.relatedArticles.links.map((link, i) => (
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative pl-2"
              >
                <div
                  className="absolute left-[1.125rem] top-3 bottom-3 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent"
                  aria-hidden
                />
                <ul className="space-y-6">
                  {modules.map((mod, i) => {
                    const ModIcon = PRODUCT_MODULE_ICONS[mod.id];
                    return (
                      <motion.li
                        key={mod.title}
                        id={mod.id}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        className="relative flex gap-5"
                      >
                        <IconBox
                          icon={ModIcon}
                          size="sm"
                          className="relative z-10 border-white/15 bg-[#0c1220] text-sky-400"
                        />
                        <div className="pt-0.5">
                          <h3 className="text-base font-semibold text-white">{mod.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                            {mod.description}
                          </p>
                          {"details" in mod && mod.details && (
                            <ul className="mt-3 space-y-2 border-l border-white/10 pl-3">
                              {mod.details.map((detail) => (
                                <li key={detail.title}>
                                  <p className="text-xs font-medium text-slate-300">{detail.title}</p>
                                  <p className="text-xs leading-relaxed text-slate-500">{detail.text}</p>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
