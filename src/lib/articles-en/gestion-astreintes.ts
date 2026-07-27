import type { ResourceArticle } from "@/lib/resources";

export const gestionAstreintes: ResourceArticle = {
  slug: "gestion-astreintes",
  path: "/en/ressources/gestion-astreintes",
  title: "On-call management: a practical guide",
  description:
    "Practical guide to on-call duties and labor law: coverage by qualification, minimum rest, fairness across staff, and service continuity.",
  readTime: "7 min",
  publishedAt: "2026-06-27",
  keywords: ["on-call management", "on-call duties", "on-call labor law", "on-call work", "standby shifts", "24/7 scheduling"],
  relatedLinks: [
    { href: "/en/secteurs/hopital", label: "Hospital scheduling" },
    { href: "/en/ressources/travail-nuit-planning-2x8", label: "Night work and 2×8 shifts" },
    { href: "/en/produit", label: "Planory modules" },
  ],
  sections: [
    {
      type: "p",
      text: "On-call management applies to any organization that must guarantee availability outside standard hours — hospitals, airports, manufacturing, public services. Poorly configured, it leads to conflicts, non-compliance, and accumulated fatigue.",
    },
    {
      type: "h2",
      text: "On-call, standby, and permanent coverage: clarifying statuses",
    },
    {
      type: "p",
      text: "Depending on agreements, on-call (availability at home or on site), standby (active presence), and permanent coverage (continuous staffing) do not carry the same rights or rest rules. The schedule must model each status with its own rules.",
    },
    {
      type: "h2",
      text: "Constraints to keep in the schedule",
    },
    {
      type: "ul",
      items: [
        "Fair rotation among eligible staff over the period.",
        "Minimum rest after on-call duty or intervention.",
        "Coverage by qualification (nurse, physician, certified technician…).",
        "Limit on consecutive or monthly on-call assignments.",
        "Replacement and swap management without starting from scratch.",
      ],
    },
    {
      type: "h2",
      text: "On-call duties and labor law",
    },
    {
      type: "p",
      text: "Labor law governs on-call duties: a period during which the employee must remain available to intervene, without being permanently at the workplace. On-call work involves compensation, minimum rest after intervention, and sometimes a limit on the number of on-call periods over a given timeframe.",
    },
    {
      type: "ul",
      items: [
        "Clearly define the on-call window and expected response time.",
        "Respect minimum rest after a night or weekend intervention.",
        "Document the distribution to demonstrate fairness across staff.",
        "Incorporate company or industry agreements (healthcare, manufacturing, public services).",
      ],
    },
    {
      type: "p",
      text: "Knowing the regulations is not enough: the schedule must make them operational. In Planory, guard shifts and scheduled activities go through SKYNET; on-call availability is managed manually via the dedicated status — to balance fairness — or as a standard-status activity. See also our guide on night work and 2×8 shifts.",
    },
    {
      type: "h2",
      text: "Measurable fairness",
    },
    {
      type: "p",
      text: "Fairness is not just about taking turns: you must be able to demonstrate, over 3 or 6 months, that difficult on-call assignments (nights, weekends, holidays) are evenly distributed. A spreadsheet struggles to produce this traceability; scheduling software calculates it continuously.",
    },
    {
      type: "h2",
      text: "On-call duties and mid-period reinforcements",
    },
    {
      type: "p",
      text: "An employee falls ill, a surge in activity requires backup: the schedule must absorb the change while respecting cumulative constraints. In Planory, replacements and reinforcements adjust on the existing proposal; dedicated on-call status slots stay manually balanced, while a standard-status “on-call duty” activity can be regenerated like other slots.",
    },
    {
      type: "h2",
      text: "Operational best practices",
    },
    {
      type: "ul",
      items: [
        "Publish the schedule as a draft before official distribution.",
        "Document the rules applied for each period.",
        "Provide a formal channel for swaps (replacement, shift exchange).",
        "Measure cumulative workload, not just the number of slots.",
      ],
    },
    {
      type: "cta",
      text: "Are you structuring on-call management for a critical service?",
      href: "/en/contact",
      label: "20-minute call with Planory",
    },
  ],
};
