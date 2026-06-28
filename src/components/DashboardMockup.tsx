"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getMockupCopy, type Locale } from "@/lib/i18n";

const AGENTS = [
  { initials: "MA", name: "Martin A.", role: "CDS", shifts: ["M", "M", "N", "—", "S", "—", "J"] },
  { initials: "LS", name: "Leblanc S.", role: "ICNA", shifts: ["N", "—", "M", "M", "—", "S", "—"] },
  { initials: "PD", name: "Petit D.", role: "CDS", shifts: ["—", "S", "—", "N", "M", "M", "—"] },
  { initials: "CR", name: "Caron R.", role: "ICNA", shifts: ["S", "—", "M", "—", "N", "—", "M"] },
] as const;

const SHIFT_STYLES: Record<string, string> = {
  M: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30",
  N: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
  S: "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30",
  J: "bg-slate-700/50 text-slate-400 ring-1 ring-slate-600/30",
  "—": "bg-transparent text-transparent",
};

const SHIFT_LABELS: Record<string, string> = {
  M: "M 05–14",
  N: "N 22–06",
  S: "S 14–22",
  J: "J",
  "—": "·",
};

const SHIFT_LABELS_COMPACT: Record<string, string> = {
  M: "M",
  N: "N",
  S: "S",
  J: "J",
  "—": "·",
};

type DashboardMockupProps = {
  /** Version réduite pour mobile sous les CTAs */
  compact?: boolean;
  locale?: Locale;
};

function canEnableFloat(compact: boolean) {
  if (typeof window === "undefined") return false;
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !mobile && !reduced && !compact;
}

export function DashboardMockup({ compact = false, locale = "fr" }: DashboardMockupProps) {
  const copy = getMockupCopy(locale);
  const [float, setFloat] = useState(false);
  const agents = compact ? AGENTS.slice(0, 2) : AGENTS;

  useEffect(() => {
    const update = () => setFloat(canEnableFloat(compact));
    update();

    const mobileMq = window.matchMedia("(max-width: 767px)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mobileMq.addEventListener("change", update);
    reducedMq.addEventListener("change", update);
    return () => {
      mobileMq.removeEventListener("change", update);
      reducedMq.removeEventListener("change", update);
    };
  }, [compact]);

  return (
    <motion.div
      className="relative w-full max-w-full"
      animate={float ? { y: [0, -6, 0] } : undefined}
      transition={float ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-500/10 via-transparent to-violet-500/10 blur-2xl" />
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]/80 shadow-2xl backdrop-blur-sm ${compact ? "scale-[0.98]" : ""}`}
      >
        <div className="flex flex-col gap-2 border-b border-white/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <p className="min-w-0 truncate text-[10px] text-slate-400 sm:text-xs">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="sm:hidden">{copy.skynetShort}</span>
            <span className="hidden sm:inline">{copy.skynetLong}</span>
          </p>
          <div className="flex shrink-0 gap-2">
            <span className="rounded-md border border-emerald-500/40 px-2 py-0.5 text-[10px] text-emerald-400">
              {copy.compliant}
            </span>
            <span className="hidden rounded-md border border-sky-500/40 px-2 py-0.5 text-[10px] text-sky-400 sm:inline">
              {copy.draft}
            </span>
          </div>
        </div>

        <div className="-mx-px overflow-x-auto overscroll-x-contain">
          <div className="min-w-[300px] px-3 py-3 sm:min-w-[480px] sm:px-4">
            <div className="mb-2 grid grid-cols-[minmax(88px,1fr)_repeat(7,minmax(28px,1fr))] gap-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-500 sm:grid-cols-[120px_repeat(7,1fr)] sm:gap-1 sm:text-[10px]">
              <span>{copy.agent}</span>
              {copy.days.map((d) => (
                <span key={d} className="text-center">
                  {d}
                </span>
              ))}
            </div>

            {agents.map((agent) => (
              <div
                key={agent.initials}
                className="mb-1 grid grid-cols-[minmax(88px,1fr)_repeat(7,minmax(28px,1fr))] items-center gap-0.5 sm:grid-cols-[120px_repeat(7,1fr)] sm:gap-1"
              >
                <div className="flex min-w-0 items-center gap-1.5 py-1 sm:gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[10px]">
                    {agent.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-medium text-white sm:text-xs">
                      {agent.name}
                    </span>
                    <span className="block truncate text-[9px] text-slate-500 sm:text-[10px]">
                      {agent.role}
                    </span>
                  </span>
                </div>
                {agent.shifts.map((shift, i) => (
                  <div key={i} className="flex justify-center py-0.5">
                    {shift !== "—" ? (
                      <span
                        className={`inline-block rounded px-1 py-0.5 text-[8px] font-medium sm:px-1.5 sm:text-[9px] ${SHIFT_STYLES[shift]}`}
                      >
                        <span className="sm:hidden">{SHIFT_LABELS_COMPACT[shift]}</span>
                        <span className="hidden sm:inline">{SHIFT_LABELS[shift]}</span>
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-700">·</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {!compact && (
          <div className="flex flex-col gap-3 border-t border-white/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] sm:text-[11px]">
              <span>
                <strong className="text-white">98%</strong>{" "}
                <span className="text-slate-500">{copy.equity}</span>
              </span>
              <span>
                <strong className="text-emerald-400">100%</strong>{" "}
                <span className="text-slate-500">{copy.compliance}</span>
              </span>
              <span>
                <strong className="text-white">0</strong>{" "}
                <span className="text-slate-500">{copy.alerts}</span>
              </span>
            </div>
            <button
              type="button"
              className="min-h-[36px] w-full rounded-lg bg-sky-400 px-3 py-1.5 text-xs font-medium text-[#050a14] transition-colors hover:bg-sky-300 sm:w-auto"
            >
              {copy.publish}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
