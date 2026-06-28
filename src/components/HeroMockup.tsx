"use client";

import dynamic from "next/dynamic";

const DashboardMockup = dynamic(
  () => import("@/components/DashboardMockup").then((mod) => mod.DashboardMockup),
  {
    loading: () => (
      <div
        className="h-44 w-full rounded-2xl border border-white/10 bg-[#0c1220]/40 lg:h-72"
        aria-hidden
      />
    ),
  },
);

type HeroMockupProps = {
  compact?: boolean;
};

export function HeroMockup({ compact = false }: HeroMockupProps) {
  return <DashboardMockup compact={compact} />;
}
