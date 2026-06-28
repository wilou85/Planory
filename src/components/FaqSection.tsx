"use client";

import { useState } from "react";
import { Plus, CircleHelp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sectionHeadMb, sectionY } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FAQ_ITEMS } from "@/lib/content";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className={sectionHeadMb}
        >
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="flex items-center gap-3 text-3xl font-bold text-white sm:text-4xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sky-400">
              <CircleHelp className="h-5 w-5" aria-hidden />
            </span>
            Questions fréquentes
          </h2>
        </motion.div>

        <div className="space-y-1">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div key={item.question}>
                <button
                  id={buttonId}
                  type="button"
                  className="flex min-h-[48px] w-full items-center justify-between gap-4 py-3.5 text-left transition-colors hover:text-white sm:py-4"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="text-base font-medium text-slate-200 sm:text-lg">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 sm:h-8 sm:w-8 ${
                      isOpen ? "bg-white/5" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4 text-slate-400" aria-hidden />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-slate-400 sm:text-base">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
