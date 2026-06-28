import type { ResourceArticle } from "@/lib/resources";

export const travailNuitPlanning2x8: ResourceArticle = {
  slug: "travail-nuit-planning-2x8",
  path: "/en/ressources/travail-nuit-planning-2x8",
  title: "Night work and 2×8 shifts: organizing team schedules",
  description:
    "Night shifts, 2×8 schedules, and atypical hours: rules to integrate in workforce scheduling software to stay compliant and fair.",
  readTime: "8 min",
  publishedAt: "2026-06-28",
  keywords: [
    "night shift hours",
    "2×8 shift schedule",
    "atypical working hours",
    "rotating shift work",
    "schedule management",
  ],
  relatedLinks: [
    { href: "/en/produit", label: "Workforce scheduling software" },
    { href: "/en/ressources/planification-industrielle", label: "Industrial planning" },
    { href: "/en/secteurs/hopital", label: "Hospital scheduling" },
    { href: "/en/ressources/gestion-astreintes", label: "On-call management" },
    { href: "/en/ressources/planning-social", label: "Workforce scheduling" },
  ],
  sections: [
    {
      type: "p",
      text: "Night work and 2×8 schedules (two teams on eight-hour shifts) apply to manufacturing, healthcare, logistics, and public services. Organizing these rotations in a spreadsheet exposes you to missed rest periods, working time limits, or fairness gaps — all social and legal risks.",
    },
    {
      type: "h2",
      text: "Night work: what the schedule must model",
    },
    {
      type: "p",
      text: "Night work (generally between 9 p.m. and 6 a.m.) imposes specific rules: maximum duration, compensatory rest, medical monitoring in some sectors. Workforce scheduling software must integrate these constraints at generation — not just display them afterward.",
    },
    {
      type: "ul",
      items: [
        "Maximum night working hours over a rolling period.",
        "Minimum rest between two consecutive night periods.",
        "Fairness: measurable distribution of nights among eligible staff.",
        "Day/night alternation with working time limits respected.",
        "Incorporation of company or industry agreements.",
      ],
    },
    {
      type: "h2",
      text: "2×8 schedules: organization and constraints",
    },
    {
      type: "p",
      text: "The 2×8 model alternates two teams on eight-hour blocks (often 6 a.m.–2 p.m. and 2 p.m.–10 p.m., sometimes with a third night team). Managing 2×8 schedules requires continuous coverage without overlap, clear handovers, and rest between shifts for versatile staff.",
    },
    {
      type: "ul",
      items: [
        "Regular or alternating cycles depending on activity (5×8, 6×8…).",
        "Minimum coverage by qualification on each shift.",
        "Absence management without breaking continuity.",
        "Gradual day → night transition to limit fatigue.",
      ],
    },
    {
      type: "h2",
      text: "Atypical hours and rotating shift work",
    },
    {
      type: "p",
      text: "Beyond classic 2×8, atypical hours include 3×8, 12-hour, and long rotation cycles. Rotating shift work means each employee follows a predefined cycle — the schedule must ensure the cycle complies with legal rest over the full horizon, not slot by slot.",
    },
    {
      type: "h2",
      text: "From labor law to operational planning",
    },
    {
      type: "p",
      text: "Knowing the regulations is not enough: they must be translated into calculable constraints. Planory, via SKYNET, encodes your rules (night, 2×8, rest, fairness) and generates a compliant proposal in under 2 minutes. Your schedulers review, adjust edge cases, and publish — AI proposes, you validate.",
    },
    {
      type: "h3",
      text: "Sectors concerned",
    },
    {
      type: "ul",
      items: [
        "Hospital and long-term care — 12-hour rotations and night standby shifts.",
        "Continuous manufacturing — 2×8, 3×8, and maintenance on-call duties.",
        "Airport and transport — extended shifts and activity peaks.",
        "Retail and logistics — staggered hours and reinforcements.",
      ],
    },
    {
      type: "cta",
      text: "Are you organizing night shifts or a 2×8 schedule on a 24/7 service?",
      href: "/en/contact",
      label: "Talk to Planory",
    },
  ],
};
