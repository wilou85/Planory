"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { tapScale } from "@/components/ui/motion";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "sm";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  showArrow?: boolean;
  external?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-[#050a14] shadow-[0_0_40px_-8px_rgba(255,255,255,0.35)] hover:bg-slate-100 hover:shadow-[0_0_48px_-6px_rgba(255,255,255,0.45)]",
  secondary:
    "border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/10",
  ghost:
    "border border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-[44px] gap-2 px-6 py-3 text-sm",
  sm: "min-h-9 gap-1.5 px-3.5 py-1.5 text-xs shadow-none hover:shadow-none",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "default",
  className = "",
  showArrow = false,
  external = false,
}: ButtonProps) {
  const classes = `inline-flex w-full items-center justify-center rounded-full font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:w-auto ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      {children}
      {showArrow && (
        <motion.span
          className="inline-flex"
          initial={false}
          whileHover={{ x: 3 }}
          transition={{ duration: 0.15 }}
        >
          <ArrowRight className={`shrink-0 ${size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}`} aria-hidden />
        </motion.span>
      )}
    </>
  );

  if (external) {
    return (
      <motion.a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        whileTap={tapScale}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.15 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      className={className.includes("w-full") ? "w-full sm:w-auto" : "inline-flex"}
      whileTap={tapScale}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
    >
      <Link href={href} className={classes}>
        {content}
      </Link>
    </motion.div>
  );
}
