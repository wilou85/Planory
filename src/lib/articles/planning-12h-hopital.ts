import type { ResourceArticle } from "@/lib/resources";

export const planning12hHopital: ResourceArticle = {
  slug: "planning-12h-hopital",
  path: "/ressources/planning-12h-hopital",
  title: "Planning en 12 heures en milieu hospitalier : guide pratique",
  description:
    "Organiser un planning en 12 heures en milieu hospitalier : repos légaux, alternance jour/nuit, équité et continuité des soins.",
  readTime: "8 min",
  publishedAt: "2026-06-27",
  keywords: [
    "planning en 12 heures en milieu hospitalier",
    "planning hospitalier",
    "planning médical",
    "planning roulement hospitalier",
    "roulements 12h",
  ],
  relatedLinks: [
    { href: "/secteurs/hopital", label: "Planning hospitalier Planory" },
    { href: "/ressources/planning-hospitalier", label: "Guide planning hospitalier" },
    { href: "/ressources/travail-nuit-planning-2x8", label: "Travail de nuit et 2×8" },
  ],
  sections: [
    {
      type: "p",
      text: "Le planning en 12 heures en milieu hospitalier est l'un des modèles les plus répandus : deux équipes alternent jour et nuit pour couvrir un service 24h/24. Mal construit, il génère des violations de repos, une fatigue accumulée et des tensions sur l'équité des week-ends.",
    },
    {
      type: "h2",
      text: "Pourquoi le 12h en milieu hospitalier ?",
    },
    {
      type: "p",
      text: "Urgences, réanimation, bloc opératoire ou unités de soins intensifs : la continuité des soins impose des plages longues avec relève structurée. Le planning roulement hospitalier en 12h permet de limiter les relais tout en maintenant une couverture stable.",
    },
    {
      type: "h2",
      text: "Contraintes réglementaires à intégrer",
    },
    {
      type: "ul",
      items: [
        "Repos minimum entre deux périodes de 12 heures.",
        "Durée maximale de travail sur la période de référence.",
        "Alternance jour/nuit équitable sur plusieurs semaines.",
        "Couverture par qualification (IDE, AS, médecin, brancardier…).",
        "Respect des accords d'établissement et de branche.",
      ],
    },
    {
      type: "h2",
      text: "Équité des week-ends et des nuits",
    },
    {
      type: "p",
      text: "Un planning en 12 heures en milieu hospitalier doit être mesurable : combien de nuits, de week-ends et de jours fériés chaque agent a-t-il sur le trimestre ? Sans outil dédié, la répartition repose sur la mémoire du planificateur — source de conflits et de contentions.",
    },
    {
      type: "h2",
      text: "Erreurs fréquentes avec Excel",
    },
    {
      type: "ul",
      items: [
        "Oublier un repos minimum après une garde de nuit.",
        "Ne pas recalculer après un remplacement de dernière minute.",
        "Confondre garde, astreinte et permanence dans le même tableau.",
        "Publier une version non validée par le cadre de service.",
      ],
    },
    {
      type: "h2",
      text: "Bonnes pratiques opérationnelles",
    },
    {
      type: "ul",
      items: [
        "Paramétrer les règles par service avant la génération.",
        "Publier en brouillon, faire valider par le cadre, puis diffuser.",
        "Tracer les échanges et renforts dans le même outil.",
        "Mesurer l'équité sur la période, pas seulement sur la semaine.",
      ],
    },
    {
      type: "h2",
      text: "Comment Planory accélère le planning 12h",
    },
    {
      type: "p",
      text: "Planory encode vos règles de planning hospitalier — repos, qualifications, équité — dans le moteur SKYNET. Il génère une proposition conforme en moins de 2 minutes ; vos cadres relisent, ajustent et publient. L'IA propose, vous validez.",
    },
    {
      type: "cta",
      text: "Vous organisez des roulements 12h en milieu hospitalier ?",
      href: "/contact",
      label: "Parler à un expert Planory",
    },
  ],
};
