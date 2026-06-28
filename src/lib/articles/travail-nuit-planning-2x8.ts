import type { ResourceArticle } from "@/lib/resources";

export const travailNuitPlanning2x8: ResourceArticle = {
  slug: "travail-nuit-planning-2x8",
  path: "/ressources/travail-nuit-planning-2x8",
  title: "Travail de nuit et horaires en 2×8 : organiser le planning d'équipes",
  description:
    "Horaires de nuit, travail en 2×8 et roulements atypiques : règles à intégrer dans un logiciel de gestion de planning pour rester conforme et équitable.",
  readTime: "8 min",
  publishedAt: "2026-06-28",
  keywords: [
    "horaire travail de nuit",
    "horaire en 2x8",
    "horaires atypiques",
    "travail par roulement",
    "gestion planning",
  ],
  relatedLinks: [
    { href: "/produit", label: "Logiciel de gestion de planning" },
    { href: "/ressources/planification-industrielle", label: "Planification industrielle" },
    { href: "/secteurs/hopital", label: "Planning hospitalier" },
    { href: "/ressources/gestion-astreintes", label: "Gestion des astreintes" },
    { href: "/ressources/planning-social", label: "Planning social" },
  ],
  sections: [
    {
      type: "p",
      text: "Le travail de nuit et les horaires en 2×8 (deux équipes sur huit heures) concernent l'industrie, la santé, la logistique et les services publics. Organiser ces roulements dans un tableur expose à des oublis de repos, d'amplitude ou d'équité — autant de risques sociaux et juridiques.",
    },
    {
      type: "h2",
      text: "Travail de nuit : ce que le planning doit modéliser",
    },
    {
      type: "p",
      text: "Le travail de nuit (généralement entre 21 h et 6 h) impose des règles spécifiques : durée maximale, repos compensateur, surveillance médicale selon les secteurs. Un logiciel de gestion de planning doit intégrer ces contraintes dès la génération — pas seulement les afficher après coup.",
    },
    {
      type: "ul",
      items: [
        "Durée maximale de travail de nuit sur une période glissante.",
        "Repos minimum entre deux périodes de nuit consécutives.",
        "Équité : répartition mesurable des nuits entre agents éligibles.",
        "Alternance jour/nuit avec amplitude horaire respectée.",
        "Prise en compte des accords d'entreprise ou de branche.",
      ],
    },
    {
      type: "h2",
      text: "Horaire en 2×8 : organisation et contraintes",
    },
    {
      type: "p",
      text: "Le 2×8 alterne deux équipes sur des plages de huit heures (souvent 6 h–14 h et 14 h–22 h, parfois avec une troisième équipe de nuit). La gestion des plannings en 2×8 exige une couverture continue sans chevauchement, avec relève claire et repos entre deux postes pour les agents polyvalents.",
    },
    {
      type: "ul",
      items: [
        "Cycles réguliers ou alternés selon l'activité (5×8, 6×8…).",
        "Couverture minimale par qualification sur chaque plage.",
        "Gestion des absences sans rupture de continuité.",
        "Passage progressif jour → nuit pour limiter la fatigue.",
      ],
    },
    {
      type: "h2",
      text: "Horaires atypiques et travail par roulement",
    },
    {
      type: "p",
      text: "Au-delà du 2×8 classique, les horaires atypiques incluent le 3×8, les 12 h et les roulements longs. Travailler en roulement signifie que chaque agent suit un cycle prédéfini — le planning doit garantir que le cycle respecte les repos légaux sur l'horizon complet, pas créneau par créneau.",
    },
    {
      type: "h2",
      text: "Du droit du travail à la planification opérationnelle",
    },
    {
      type: "p",
      text: "Connaître la réglementation ne suffit pas : il faut la traduire en contraintes calculables. Planory, via SKYNET, encode vos règles (nuit, 2×8, repos, équité) et génère une proposition conforme en moins de 2 minutes. Vos planificateurs relisent, ajustent les cas particuliers et publient — l'IA propose, vous validez.",
    },
    {
      type: "h3",
      text: "Secteurs concernés",
    },
    {
      type: "ul",
      items: [
        "Hôpital et EHPAD — roulements 12 h et gardes de nuit.",
        "Industrie continue — 2×8, 3×8 et astreintes maintenance.",
        "Aéroport et transport — plages étendues et pics d'activité.",
        "Commerce et logistique — horaires décalés et renforts.",
      ],
    },
    {
      type: "cta",
      text: "Vous organisez des horaires de nuit ou un 2×8 sur un service 24/7 ?",
      href: "/contact",
      label: "Échanger avec Planory",
    },
  ],
};
