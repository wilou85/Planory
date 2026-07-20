import type { ResourceArticle } from "@/lib/resources";

export const planningSocial: ResourceArticle = {
  slug: "planning-social",
  path: "/en/ressources/planning-social",
  title: "Workforce scheduling: what it means and how to organize it",
  description:
    "Workforce scheduling covers shift organization, rest periods, and legal constraints. Best practices for building compliant team schedules.",
  readTime: "7 min",
  publishedAt: "2026-06-27",
  keywords: ["workforce scheduling", "HR planning", "team scheduling", "legal compliance"],
  relatedLinks: [
    { href: "/en/produit", label: "Workforce scheduling software" },
    { href: "/en/ressources/planification-rh", label: "HR planning" },
    { href: "/en/ressources/logiciel-planning-equipe", label: "Team scheduling software" },
    { href: "/en/ressources/annualisation-temps-travail", label: "Annualised working hours" },
  ],
  sections: [
    {
      type: "p",
      text: "Workforce scheduling refers to the set of rules and practices that govern how working time is organized: shifts, rest periods, maximum hours, and fairness across staff. In 24/7 environments — hospitals, airports, manufacturing — it quickly becomes the central document shared between management, schedulers, and teams.",
    },
    {
      type: "h2",
      text: "Workforce scheduling vs. HR planning: what's the difference?",
    },
    {
      type: "p",
      text: "HR planning covers the employee master data (contracts, qualifications, entitlements). Workforce scheduling is its operational expression: who works when, on which role, with what rest periods. An HRIS manages absences and payroll; workforce scheduling ensures that shift patterns comply with labor law and internal agreements.",
    },
    {
      type: "h2",
      text: "The pillars of a solid workforce schedule",
    },
    {
      type: "ul",
      items: [
        "Minimum rest between two work periods (day/night, 12-hour, 3×8).",
        "Maximum working hours and hour counters over the reference period.",
        "Fair distribution of weekends, nights, and public holidays — measurable and traceable.",
        "Qualifications and minimum coverage per role or department.",
        "Validation workflow before publishing to teams.",
      ],
    },
    {
      type: "h2",
      text: "Why Excel reaches its limits",
    },
    {
      type: "p",
      text: "A spreadsheet does not automatically verify cumulative rules: a mis-copied cell can violate a legal rest period without any alert. Once headcount exceeds a few dozen people and shift patterns grow complex, workforce scheduling requires a constraint engine — not just formulas.",
    },
    {
      type: "h2",
      text: "How team scheduling software helps",
    },
    {
      type: "p",
      text: "Specialized software integrates the HR master data, business rules, and labor regulations in a single workflow. Planory, via the SKYNET engine, generates a compliant proposal in under 2 minutes; the scheduler reviews, adjusts, and publishes. AI proposes, you decide — workforce scheduling stays under human control.",
    },
    {
      type: "h3",
      text: "Warning signs",
    },
    {
      type: "ul",
      items: [
        "More than 30 staff scheduled over a horizon longer than 4 weeks.",
        "24/7 shift patterns with on-call duties or standby shifts.",
        "Audit or internal review of schedule compliance.",
        "Recurring conflicts over fairness of weekends or nights.",
      ],
    },
    {
      type: "cta",
      text: "Are you structuring workforce scheduling for a 24/7 department?",
      href: "/en/contact",
      label: "Talk to Planory",
    },
  ],
};
