import type { ResourceArticle } from "@/lib/resources";

export const planningHospitalier: ResourceArticle = {
  slug: "planning-hospitalier",
  path: "/en/ressources/planning-hospitalier",
  title: "Hospital scheduling: standby shifts, 12-hour rotations, and service continuity",
  description:
    "Organize a compliant hospital schedule: 12-hour rotations, standby shifts, on-call duties, weekend fairness, and scheduling software for healthcare facilities.",
  readTime: "9 min",
  publishedAt: "2026-06-27",
  keywords: [
    "hospital scheduling",
    "hospital shift planning",
    "medical scheduling",
    "standby shift planning",
    "hospital rotation scheduling",
    "hospital scheduling software",
    "12-hour hospital scheduling",
  ],
  relatedLinks: [
    { href: "/en/secteurs/hopital", label: "Planory hospital scheduling" },
    { href: "/en/ressources/planning-medical", label: "Medical scheduling" },
    { href: "/en/ressources/planning-12h-hopital", label: "12-hour hospital scheduling" },
    { href: "/en/ressources/gestion-astreintes", label: "On-call management" },
    { href: "/en/produit", label: "Workforce scheduling software" },
  ],
  sections: [
    {
      type: "p",
      text: "Hospital scheduling is one of the most demanding: service continuity, multiple qualifications, 12-hour rotations, and on-call duties unfold over long horizons. Dedicated hospital scheduling software avoids costly errors from a poorly managed spreadsheet.",
    },
    {
      type: "h2",
      text: "Medical scheduling and hospital planning: shared challenges",
    },
    {
      type: "p",
      text: "Medical scheduling organizes standby shifts by specialty and qualification; hospital planning covers all departments in a facility. In both cases, standby schedules must guarantee continuity of care, fairness of nights and weekends, and compliance with regulatory rest periods — requirements that spreadsheets do not verify automatically.",
    },
    {
      type: "h2",
      text: "Specifics of hospital rotation scheduling",
    },
    {
      type: "p",
      text: "Hospital departments often alternate day/night in 12-hour blocks, with strict regulatory rest between two periods. Hospital rotation scheduling must guarantee coverage by qualification (RN, nursing assistant, physician) while respecting industry agreements and internal facility rules.",
    },
    {
      type: "h2",
      text: "12-hour scheduling in a hospital setting",
    },
    {
      type: "ul",
      items: [
        "Day/night alternation with minimum rest between two 12-hour shifts.",
        "Fairness across weekends and public holidays.",
        "Continuity of care: minimum staffing per unit.",
        "Last-minute replacement management (emergency, operating room).",
        "Traceability for audits and internal reviews.",
      ],
    },
    {
      type: "h2",
      text: "Standby shifts, on-call duties, and permanent coverage",
    },
    {
      type: "p",
      text: "Emergency, operating room, long-term care: each department has its own coverage rules. Medical or paramedical on-call duties are added to fixed rotations. A reliable hospital schedule models these statuses separately and recalculates compliance with every change.",
    },
    {
      type: "h2",
      text: "Hospital scheduling software: key criteria",
    },
    {
      type: "ul",
      items: [
        "Configuration by department, qualification, and shift type.",
        "Generation compliant with legal rest and internal agreements.",
        "Automatic fairness across nights and weekends.",
        "Draft → manager validation → team publication workflow.",
        "Coexistence with the hospital HRIS (without replacing it).",
      ],
    },
    {
      type: "h2",
      text: "How to build hospital rotations without Excel",
    },
    {
      type: "p",
      text: "Building a hospital department schedule cell by cell takes hours and exposes you to missed rest periods or qualifications. Planory, via SKYNET, generates a compliant proposal in under 2 minutes; nurse managers review, adjust, and publish. AI proposes, you validate.",
    },
    {
      type: "h3",
      text: "Common use cases",
    },
    {
      type: "ul",
      items: [
        "Emergency department — 24/7 coverage by qualification.",
        "Operating room — rooms and specialized teams.",
        "Long-term care — regular rotations and night on-call duties.",
        "Multi-site hospital networks — harmonized rules, site-level autonomy.",
      ],
    },
    {
      type: "cta",
      text: "Are you managing a complex hospital schedule?",
      href: "/en/contact",
      label: "Discover Planory for healthcare",
    },
  ],
};
