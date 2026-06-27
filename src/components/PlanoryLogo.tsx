"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type PlanoryLogoProps = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
};

export function PlanoryLogo({
  size = 36,
  showWordmark = true,
  className = "",
}: PlanoryLogoProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex shrink-0 items-center gap-3 ${className}`}
    >
      <motion.span
        whileHover={{ scale: 1.06, rotate: 2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        className="relative"
      >
        <span className="absolute inset-0 rounded-full bg-sky-400/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        <Image
          src="/planory-logo.png"
          alt="Logo Planory"
          width={size}
          height={size}
          className="relative rounded-full object-cover"
          priority
        />
      </motion.span>
      {showWordmark && (
        <span className="flex flex-col justify-center leading-tight">
          <span className="text-base font-semibold text-white">Planory</span>
          <span className="text-[11px] text-slate-400">IA de planification</span>
        </span>
      )}
    </Link>
  );
}
