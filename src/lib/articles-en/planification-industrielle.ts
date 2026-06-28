import type { ResourceArticle } from "@/lib/resources";

export const planificationIndustrielle: ResourceArticle = {
  slug: "planification-industrielle",
  path: "/en/ressources/planification-industrielle",
  title: "Industrial planning: 3×8, 2×8 rotations and continuous teams",
  description:
    "Industrial team planning: 3×8 rotations, rotating shift work, maintenance on-call duties, and workforce scheduling software for continuous manufacturing.",
  readTime: "8 min",
  publishedAt: "2026-06-28",
  keywords: [
    "industrial planning",
    "industrial schedule management",
    "rotating shift work",
    "shift rotation",
    "3×8 rotations",
    "manufacturing scheduling",
  ],
  relatedLinks: [
    { href: "/en/secteurs", label: "Planory sectors" },
    { href: "/en/ressources/travail-nuit-planning-2x8", label: "Night work and 2×8 shifts" },
    { href: "/en/ressources/gestion-astreintes", label: "On-call management" },
    { href: "/en/produit", label: "Workforce scheduling software" },
  ],
  sections: [
    {
      type: "p",
      text: "Industrial planning means organizing production, maintenance, and logistics teams on continuous cycles — often 24/7. 3×8 and 2×8 rotations, technical on-call duties, and unexpected absences stack up: a spreadsheet is no longer enough once business constraints multiply.",
    },
    {
      type: "h2",
      text: "Industrial planning: specific challenges",
    },
    {
      type: "ul",
      items: [
        "Production line coverage without interruption.",
        "Machine qualifications, safety certifications, and versatility.",
        "3×8 or 2×8 rotations with legal rest between shifts.",
        "Maintenance on-call duties and reinforcements during activity peaks.",
        "Hour counters and fairness over the rolling period.",
      ],
    },
    {
      type: "h2",
      text: "Rotating shift work: modeling cycles",
    },
    {
      type: "p",
      text: "Rotating shift work means following a predefined cycle — night week, day week, handover between teams. The schedule must verify compliance over the full horizon: minimum rest, working time limits, day/night sequencing. An error in an Excel cell can go unnoticed until an audit or incident.",
    },
    {
      type: "h2",
      text: "3×8 and 2×8 rotations in manufacturing",
    },
    {
      type: "p",
      text: "The 3×8 model (morning, afternoon, night) is common in continuous production. The 2×8 covers two eight-hour blocks, sometimes with a separate night team. In both cases, industrial schedule management requires minimum coverage by skill on each shift — not just overall headcount.",
    },
    {
      type: "ul",
      items: [
        "3×8: morning / afternoon / night alternation with structured handovers.",
        "2×8: two main teams + reinforcements or on-call duties as needed.",
        "Gradual day → night transition to limit fatigue.",
        "Line stoppage management and rapid reassignment.",
      ],
    },
    {
      type: "h2",
      text: "On-call duties, maintenance, and continuity",
    },
    {
      type: "p",
      text: "Beyond fixed shifts, industrial planning integrates maintenance on-call duties, technical standby coverage, and seasonal reinforcements. These statuses have distinct rest and rotation rules — they must be modeled at generation, not added manually afterward.",
    },
    {
      type: "h2",
      text: "Industrial planning software: key criteria",
    },
    {
      type: "ul",
      items: [
        "Configuration by site, line, role, and certification.",
        "Constraint engine: rest, fairness, minimum coverage.",
        "Absorption of absences and replacements without starting from scratch.",
        "Production manager / HR validation workflow.",
        "Complement to time tracking: Planory plans, the time system tracks.",
      ],
    },
    {
      type: "h2",
      text: "Planory and 24/7 industrial planning",
    },
    {
      type: "p",
      text: "Planory targets high-constraint environments: continuous manufacturing, chemicals, food processing, logistics. SKYNET generates a proposal compliant with your business rules in under 2 minutes; your team leads review, adjust, and publish. AI proposes, you validate.",
    },
    {
      type: "cta",
      text: "Are you managing industrial planning for a 24/7 site?",
      href: "/en/contact",
      label: "Discover Planory",
    },
  ],
};
