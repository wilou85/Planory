"use client";

import { motion } from "framer-motion";
import { slideInLeft } from "@/components/ui/motion";

type SectionLabelProps = {
  children: React.ReactNode;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={slideInLeft}
      className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:mb-4"
    >
      {children}
    </motion.p>
  );
}
