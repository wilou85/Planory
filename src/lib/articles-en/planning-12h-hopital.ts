import type { ResourceArticle } from "@/lib/resources";

export const planning12hHopital: ResourceArticle = {
  slug: "planning-12h-hopital",
  path: "/en/ressources/planning-12h-hopital",
  title: "12-hour hospital scheduling: a practical guide",
  description:
    "Organize 12-hour hospital schedules: legal rest periods, day/night alternation, fairness, and continuity of care.",
  readTime: "8 min",
  publishedAt: "2026-06-27",
  keywords: [
    "12-hour hospital scheduling",
    "hospital scheduling",
    "medical scheduling",
    "hospital rotation scheduling",
    "12-hour rotations",
  ],
  relatedLinks: [
    { href: "/en/secteurs/hopital", label: "Planory hospital scheduling" },
    { href: "/en/ressources/planning-hospitalier", label: "Hospital scheduling guide" },
    { href: "/en/ressources/travail-nuit-planning-2x8", label: "Night work and 2×8 shifts" },
  ],
  sections: [
    {
      type: "p",
      text: "12-hour hospital scheduling is one of the most common models: two teams alternate day and night to cover a department around the clock. Poorly built, it leads to rest violations, accumulated fatigue, and tensions over weekend fairness.",
    },
    {
      type: "h2",
      text: "Why 12-hour shifts in a hospital setting?",
    },
    {
      type: "p",
      text: "Emergency, ICU, operating room, or intensive care units: continuity of care requires long shifts with structured handovers. Hospital rotation scheduling in 12-hour blocks limits turnover while maintaining stable coverage.",
    },
    {
      type: "h2",
      text: "Regulatory constraints to integrate",
    },
    {
      type: "ul",
      items: [
        "Minimum rest between two 12-hour periods.",
        "Maximum working hours over the reference period.",
        "Fair day/night alternation over several weeks.",
        "Coverage by qualification (RN, nursing assistant, physician, orderly…).",
        "Compliance with facility and industry agreements.",
      ],
    },
    {
      type: "h2",
      text: "Fairness of weekends and nights",
    },
    {
      type: "p",
      text: "A 12-hour hospital schedule must be measurable: how many nights, weekends, and public holidays does each employee have over the quarter? Without dedicated software, distribution relies on the scheduler's memory — a source of conflicts and grievances.",
    },
    {
      type: "h2",
      text: "Common Excel mistakes",
    },
    {
      type: "ul",
      items: [
        "Forgetting minimum rest after a night shift.",
        "Not recalculating after a last-minute replacement.",
        "Mixing standby, on-call, and permanent coverage in the same spreadsheet.",
        "Publishing a version not validated by the department manager.",
      ],
    },
    {
      type: "h2",
      text: "Operational best practices",
    },
    {
      type: "ul",
      items: [
        "Configure rules by department before generation.",
        "Publish as a draft, have the manager validate, then distribute.",
        "Track swaps and reinforcements in the same tool.",
        "Measure fairness over the period, not just the week.",
      ],
    },
    {
      type: "h2",
      text: "How Planory accelerates 12-hour scheduling",
    },
    {
      type: "p",
      text: "Planory encodes your hospital scheduling rules — rest, qualifications, fairness — in the SKYNET engine. It generates a compliant proposal in under 2 minutes; your managers review, adjust, and publish. AI proposes, you validate.",
    },
    {
      type: "cta",
      text: "Are you organizing 12-hour rotations in a hospital setting?",
      href: "/en/contact",
      label: "Talk to a Planory expert",
    },
  ],
};
