import type { ResourceArticle } from "@/lib/resources";

export const planningMedical: ResourceArticle = {
  slug: "planning-medical",
  path: "/en/ressources/planning-medical",
  title: "Medical scheduling: standby shifts, qualifications, and care team organization",
  description:
    "Organize a compliant medical schedule: standby shifts by specialty, staff qualification tracking, night shift fairness, and software adapted to healthcare facilities.",
  readTime: "9 min",
  publishedAt: "2026-06-28",
  keywords: [
    "medical scheduling",
    "medical staff scheduling",
    "physician scheduling",
    "standby shift planning",
    "scheduling software",
    "medical scheduling software",
  ],
  relatedLinks: [
    { href: "/en/secteurs/hopital", label: "Planory for healthcare" },
    { href: "/en/ressources/planning-hospitalier", label: "Hospital scheduling" },
    { href: "/en/ressources/planning-12h-hopital", label: "12-hour scheduling" },
    { href: "/en/ressources/gestion-astreintes", label: "On-call management" },
  ],
  sections: [
    {
      type: "p",
      text: "Medical scheduling covers the organization of standby shifts, on-call duties, and rotations for physicians, residents, and paramedical teams. Unlike a simple administrative timetable, it must guarantee continuity of care, the right qualification on each role, and compliance with labor law — often over horizons longer than a month.",
    },
    {
      type: "h2",
      text: "Medical scheduling: what does it involve?",
    },
    {
      type: "p",
      text: "We speak of medical scheduling whenever caregiver assignments depend on clinical skills: ICU nurse, operating room assistant, on-call physician, specialty resident. Staff qualification tracking — linking each employee to their certification and department — is a baseline requirement: a non-compliant assignment exposes the facility clinically and legally.",
    },
    {
      type: "h2",
      text: "Specifics compared to administrative scheduling",
    },
    {
      type: "ul",
      items: [
        "Coverage by qualification and specialty, not just headcount.",
        "Medical and paramedical standby shifts with distinct statuses (standby, on-call, permanent coverage).",
        "12-hour rotations or long cycles with strict regulatory rest.",
        "Fairness of nights, weekends, and public holidays — measurable over the period.",
        "Last-minute replacements without breaking continuity.",
      ],
    },
    {
      type: "h2",
      text: "Medical scheduling on Excel: common mistakes",
    },
    {
      type: "p",
      text: "Many facilities still build medical schedules on spreadsheets. Limits appear quickly: missed rest between two standby shifts, unverified qualifications, fairness impossible to demonstrate during an audit. Once twenty or more staff and multiple shift statuses are involved, a constraint engine becomes essential.",
    },
    {
      type: "h2",
      text: "Scheduling software: criteria for a medical context",
    },
    {
      type: "ul",
      items: [
        "Configuration by department, specialty, and shift type.",
        "Automatic verification of legal rest and internal agreements.",
        "Fairness calculated across nights, weekends, and on-call duties.",
        "Draft → nurse manager validation → publication workflow.",
        "Coexistence with the hospital HRIS (without replacing it).",
      ],
    },
    {
      type: "h2",
      text: "Medical scheduling and AI: what SKYNET delivers",
    },
    {
      type: "p",
      text: "On a department with dense constraints, the number of possible combinations explodes. Planory, via SKYNET, encodes your medical and regulatory rules then generates a compliant proposal in under 2 minutes. Managers review, adjust edge cases, and publish — AI proposes, you validate.",
    },
    {
      type: "h3",
      text: "Departments concerned",
    },
    {
      type: "ul",
      items: [
        "Emergency and ICU — 24/7 coverage by qualification.",
        "Operating room — rooms and specialized teams.",
        "Medicine and surgery — rotations and night standby shifts.",
        "Long-term care and rehabilitation — versatility and on-call duties.",
      ],
    },
    {
      type: "cta",
      text: "Are you organizing a complex medical schedule?",
      href: "/en/contact",
      label: "Talk to Planory",
    },
  ],
};
