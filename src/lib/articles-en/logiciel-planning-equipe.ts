import type { ResourceArticle } from "@/lib/resources";

export const logicielPlanningEquipe: ResourceArticle = {
  slug: "logiciel-planning-equipe",
  path: "/en/ressources/logiciel-planning-equipe",
  title: "Team scheduling software: how to choose for a 24/7 environment",
  description:
    "Practical criteria for choosing team scheduling software: business constraints, shift patterns, on-call duties, and scheduler control.",
  readTime: "8 min",
  publishedAt: "2026-06-27",
  keywords: [
    "team scheduling software",
    "workforce scheduling software",
    "shift planning software",
    "schedule management",
    "workforce management software",
    "24/7 scheduling",
  ],
  relatedLinks: [
    { href: "/en/produit", label: "Planory modules" },
    { href: "/en/ressources/planning-social", label: "Workforce scheduling" },
    { href: "/en/faq", label: "Planory vs. time tracking FAQ" },
  ],
  sections: [
    {
      type: "p",
      text: "Team scheduling software is not just about displaying time slots: it must absorb your business rules, HR constraints, and labor regulations, then produce usable schedules. For 24/7 teams, the bar is even higher.",
    },
    {
      type: "h2",
      text: "What good software must cover",
    },
    {
      type: "ul",
      items: [
        "Employee master data: qualifications, entitlements, unavailability.",
        "Complex shift patterns: 3×8, 2×12, 12-hour, alternating cycles.",
        "On-call duties and mid-period reinforcements.",
        "Measurable fairness across weekends, nights, and public holidays.",
        "Draft → validation → publication workflow.",
      ],
    },
    {
      type: "h2",
      text: "Team scheduling software vs. HRIS",
    },
    {
      type: "p",
      text: "An HRIS covers overall HR management — absences, payroll, reviews. It is not designed to optimize hospital or industrial shift patterns. Team scheduling software focuses on compliant generation and operational adjustment. The two coexist: the HR master data feeds the schedule.",
    },
    {
      type: "h2",
      text: "Selection criteria for a regulated environment",
    },
    {
      type: "h3",
      text: "Automatic compliance",
    },
    {
      type: "p",
      text: "The software must reject or correct assignments that violate legal rest periods, maximum hours, or required qualifications — before publication, not after the fact.",
    },
    {
      type: "h3",
      text: "Human control",
    },
    {
      type: "p",
      text: "The tool speeds up generation; the scheduler keeps the final decision. Be wary of black-box solutions with no review step or change history.",
    },
    {
      type: "h3",
      text: "Sector adaptability",
    },
    {
      type: "p",
      text: "Hospital, airport, continuous manufacturing, or retail: constraints differ. Configuration by department, role, and shift type is essential.",
    },
    {
      type: "h2",
      text: "Where AI delivers measurable value",
    },
    {
      type: "p",
      text: "On a 24/7 schedule, the number of possible combinations explodes. An optimization engine — like SKYNET at Planory — proposes a compliant solution in under 2 minutes instead of several hours of manual spreadsheet work.",
    },
    {
      type: "cta",
      text: "In an RFP or project scoping phase?",
      href: "/en/contact",
      label: "Talk to Planory",
    },
  ],
};
