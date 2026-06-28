import type { ResourceArticle } from "@/lib/resources";

export const planningExcelEquipe: ResourceArticle = {
  slug: "planning-excel-equipe",
  path: "/en/ressources/planning-excel-equipe",
  title: "Excel scheduling: limits and moving to team software",
  description:
    "When Excel is no longer enough for 24/7 team scheduling: warning signs, compliance risks, and best practices for switching to software.",
  readTime: "6 min",
  publishedAt: "2026-06-27",
  keywords: ["Excel scheduling", "team scheduling software", "24/7 scheduling", "schedule optimization"],
  relatedLinks: [
    { href: "/en/produit", label: "Workforce scheduling software" },
    { href: "/en/ressources/logiciel-planning-equipe", label: "Choosing team scheduling software" },
    { href: "/en/faq", label: "Planory FAQ" },
  ],
  sections: [
    {
      type: "p",
      text: "Excel remains the most widely used tool for building team schedules. For a dozen people and a two-week horizon, it is often sufficient. Once constraints multiply — 3×8 rotations, on-call duties, regulatory rest — the spreadsheet becomes a bottleneck.",
    },
    {
      type: "h2",
      text: "Excel limits on complex schedules",
    },
    {
      type: "ul",
      items: [
        "No constraint engine: every rule must be checked manually.",
        "Silent errors: a mis-copied formula can violate regulations.",
        "Calculation time: a 24/7 schedule can take hours to adjust.",
        "No draft → validation → publication workflow.",
        "Multiple versions and conflicts between shared files.",
      ],
    },
    {
      type: "h2",
      text: "When to switch to scheduling software?",
    },
    {
      type: "p",
      text: "The switch becomes relevant as soon as one of these signals appears:",
    },
    {
      type: "ul",
      items: [
        "More than 30 staff scheduled over more than 4 weeks.",
        "24/7 environment: hospital, airport, manufacturing, contact center.",
        "On-call duties, standby shifts, or alternating rotations (12-hour, 3×8).",
        "Requirement for measurable fairness across weekends and nights.",
        "Audit or regulatory compliance required.",
      ],
    },
    {
      type: "h2",
      text: "What software delivers compared to Excel",
    },
    {
      type: "h3",
      text: "Generation and compliance",
    },
    {
      type: "p",
      text: "Excel generates nothing: you build cell by cell. Software like Planory, via SKYNET, produces a proposal compliant with your business and legal rules in under 2 minutes. You review, adjust, and publish.",
    },
    {
      type: "h3",
      text: "Integrated HR planning",
    },
    {
      type: "p",
      text: "Qualifications, unavailability, and individual entitlements feed directly into generation — without export/import between files.",
    },
    {
      type: "h2",
      text: "Migrating without starting from scratch",
    },
    {
      type: "p",
      text: "Keep your business rules documented in Excel as a configuration baseline. At deployment, Planory encodes them in the constraint engine — you do not lose your expertise, you make it reliable.",
    },
    {
      type: "cta",
      text: "Assess your situation with our Excel vs. software self-assessment grid.",
      href: "/en/ressources/outils/grille-excel-vs-logiciel",
      label: "Download the free grid",
    },
  ],
};
