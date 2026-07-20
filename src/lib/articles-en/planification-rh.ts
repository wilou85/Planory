import type { ResourceArticle } from "@/lib/resources";

export const planificationRh: ResourceArticle = {
  slug: "planification-rh",
  path: "/en/ressources/planification-rh",
  title: "HR planning: connecting employee data to operational schedules",
  description:
    "HR planning and team scheduling: how to unify staff, qualifications, and constraints for compliant schedules in 24/7 environments.",
  readTime: "7 min",
  publishedAt: "2026-06-27",
  keywords: [
    "HR planning",
    "workforce planning",
    "HR planning software",
    "HR planning tools",
  ],
  relatedLinks: [
    { href: "/en/produit", label: "Planory HR planning" },
    { href: "/en/ressources/planning-social", label: "Workforce scheduling" },
    { href: "/en/ressources/annualisation-temps-travail", label: "Annualised working hours" },
    { href: "/en/ressources/logiciel-planning-equipe", label: "Team scheduling software" },
  ],
  sections: [
    {
      type: "p",
      text: "HR planning means anticipating skill and staffing needs, then translating those needs into operational schedules. In 24/7 organizations, the employee master data — contracts, qualifications, entitlements — is the foundation without which no reliable schedule is possible.",
    },
    {
      type: "h2",
      text: "HR planning: strategic or operational?",
    },
    {
      type: "p",
      text: "We often distinguish strategic HR planning (target headcount, hiring, training) from operational planning (who is on which role tomorrow morning). Planory focuses on the second layer: turning an up-to-date HR master data into publishable, compliant, and fair schedules.",
    },
    {
      type: "h2",
      text: "Essential data in the master record",
    },
    {
      type: "ul",
      items: [
        "Employees and contracts (full-time, part-time, alternating schedules).",
        "Qualifications and certifications per role.",
        "Unavailability, leave, and individual constraints.",
        "Collective agreements and internal rules (rest, night premiums).",
        "Organizational units and departments to cover.",
      ],
    },
    {
      type: "h2",
      text: "HR planning tools: what to avoid",
    },
    {
      type: "p",
      text: "Multiplying Excel files between HR and schedulers creates diverging versions and silent errors. An HR planning tool integrated with the scheduling engine removes this friction: an absence update immediately affects generation.",
    },
    {
      type: "h2",
      text: "HR planning → scheduling → publication chain",
    },
    {
      type: "p",
      text: "The ideal flow: (1) up-to-date HR master data, (2) configured business rules, (3) generation of a compliant proposal, (4) scheduler review, (5) publication to teams. Planory covers steps 1 through 5 in a French web application, with the SKYNET AI engine at step 3.",
    },
    {
      type: "h3",
      text: "HRIS integration",
    },
    {
      type: "p",
      text: "Planory includes a built-in HR master data module. Depending on your context, synchronization with your existing HRIS can be considered at deployment — without replacing your payroll or absence management tool.",
    },
    {
      type: "cta",
      text: "Are you unifying HR planning and operational scheduling?",
      href: "/en/contact",
      label: "Talk to a Planory expert",
    },
  ],
};
