"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_TOPICS } from "@/lib/content";
import { CONTACT_TOPIC_ICONS } from "@/lib/icons";
import { sectionY } from "@/components/ui/section";

type ContactSectionProps = {
  /** Page /contact : titre h1 et padding page */
  standalone?: boolean;
};

export function ContactSection({ standalone = false }: ContactSectionProps) {
  const Heading = standalone ? "h1" : "h2";

  return (
    <section
      id="contact"
      className={`relative ${standalone ? "py-14 sm:py-20 lg:py-24" : sectionY}`}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-[#0c1220]/80 px-4 py-6 shadow-2xl backdrop-blur-sm sm:rounded-3xl sm:px-10 sm:py-10"
        >
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs text-slate-300">
              <MessageCircle className="h-3.5 w-3.5 text-sky-400" aria-hidden />
              Un premier échange, sans prérequis
            </span>
            <Heading className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Parlons de votre contexte
            </Heading>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              20 minutes pour couvrir vos contraintes clés, évaluer la faisabilité, et définir le
              niveau d&apos;accompagnement adapté.
            </p>

            <ul className="mt-5 grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:gap-y-2">
              {CONTACT_TOPICS.map((topic, i) => {
                const TopicIcon = CONTACT_TOPIC_ICONS[i];
                return (
                  <li key={topic} className="flex items-center gap-2 text-sm text-slate-300">
                    <TopicIcon className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
                    {topic}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-8">
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
