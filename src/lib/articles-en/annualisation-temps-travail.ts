import type { ResourceArticle } from "@/lib/resources";

export const annualisationTempsTravail: ResourceArticle = {
  slug: "annualisation-temps-travail",
  path: "/en/ressources/annualisation-temps-travail",
  title: "Annualised working hours: rules, scheduling and compliance",
  description:
    "Understand annualised working hours: reference period, overtime, rest rules and impact on 24/7 team scheduling.",
  readTime: "8 min",
  publishedAt: "2026-07-20",
  keywords: [
    "annualised working hours",
    "annualization of working time",
    "annualised hours",
    "working time averaging",
    "team scheduling",
    "overtime annualisation",
  ],
  relatedLinks: [
    { href: "/en/ressources/planning-social", label: "Workforce scheduling" },
    { href: "/en/ressources/planification-rh", label: "HR planning" },
    { href: "/en/ressources/travail-nuit-planning-2x8", label: "Night work and 2×8 shifts" },
    { href: "/en/produit", label: "Workforce scheduling software" },
  ],
  sections: [
    {
      type: "p",
      text: "Annualised working hours (sometimes called working-time averaging or annualisation) spread contractual hours over a reference period longer than a week — often a year, sometimes a shorter period set by agreement. The goal is to absorb demand peaks without treating every spike as overtime, while still respecting daily and weekly caps.",
    },
    {
      type: "h2",
      text: "Annualisation vs other working-time schemes",
    },
    {
      type: "p",
      text: "Annualisation organises shifts around an average duration over the reference period. It is not a day-based package: hours still count, daily and weekly rest still apply, and exceeding thresholds may trigger uplift or compensatory rest depending on the agreement. In practice, the published schedule is the proof that distribution remains compliant.",
    },
    {
      type: "h2",
      text: "What schedulers must track day to day",
    },
    {
      type: "ul",
      items: [
        "Average hours over the reference period (often aligned to a full-time weekly average under the local agreement).",
        "Weekly and daily ceilings — annualisation does not allow unconstrained peaking.",
        "Per-employee hour banks: surplus, deficit, and end-of-period overtime settlement.",
        "Minimum rest between shifts, weekends and nights — fairness must stay measurable.",
        "Absences (leave, sickness, training) that affect the annualised balance.",
      ],
    },
    {
      type: "h2",
      text: "Why spreadsheets break under annualisation",
    },
    {
      type: "p",
      text: "On Excel, maintaining an annualised bank for dozens of staff on 24/7 rotations quickly becomes opaque: peaks, cover shifts, on-call duties and absences stack up. A formula error or an unsynced sheet exposes the organisation to non-compliant schedules — and disputes over unpaid hours. Once the reference period stretches beyond a few weeks and multiple statuses coexist, a constraint engine becomes essential.",
    },
    {
      type: "h2",
      text: "Annualisation in 24/7 environments",
    },
    {
      type: "p",
      text: "Hospitals, airports and continuous industry face variable demand (seasonality, peaks, on-call cover) while coverage must stay continuous. Annualisation helps smooth load, but it multiplies the rules to check at every schedule generation. 12-hour, 2×8 or 3×8 patterns must coexist with the hour bank — without sacrificing rest or fairness of nights and weekends.",
    },
    {
      type: "h3",
      text: "Warning signs",
    },
    {
      type: "ul",
      items: [
        "Annualised counters kept outside the operational schedule (separate file, manual updates).",
        "End-of-period mass settlement of overtime that was never anticipated.",
        "Staff regularly above weekly caps “because the year will average it out”.",
        "Difficulty explaining a roster during an audit or HR review.",
      ],
    },
    {
      type: "h2",
      text: "How scheduling software helps",
    },
    {
      type: "p",
      text: "Specialised software links the HR registry, annualisation rules and the published schedule. Planory, via SKYNET, generates a proposal that respects your business and legal constraints; planners review, adjust and publish. AI proposes, you decide — the annualised hour bank no longer lives in a forgotten side spreadsheet.",
    },
    {
      type: "cta",
      text: "Do you annualise working time for 24/7 teams?",
      href: "/en/contact",
      label: "Talk to Planory",
    },
  ],
};
