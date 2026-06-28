import type { ResourceArticle } from "@/lib/resources";

export const planningHospitalier: ResourceArticle = {
  slug: "planning-hospitalier",
  path: "/ressources/planning-hospitalier",
  title: "Planning hospitalier : gardes, roulements 12h et continuité de service",
  description:
    "Organiser un planning hospitalier conforme : roulements 12h, gardes, astreintes, équité des week-ends et logiciel de planning pour établissements de santé.",
  readTime: "9 min",
  publishedAt: "2026-06-27",
  keywords: [
    "planning hospitalier",
    "planning hopital",
    "planning médical",
    "planning de garde",
    "planning roulement hospitalier",
    "logiciel planning hospitalier",
    "planning en 12 heures en milieu hospitalier",
  ],
  relatedLinks: [
    { href: "/secteurs/hopital", label: "Planning hospitalier Planory" },
    { href: "/ressources/planning-medical", label: "Planning médical" },
    { href: "/ressources/planning-12h-hopital", label: "Planning 12h hôpital" },
    { href: "/ressources/gestion-astreintes", label: "Gestion des astreintes" },
    { href: "/produit", label: "Logiciel de gestion de planning" },
  ],
  sections: [
    {
      type: "p",
      text: "Le planning hospitalier est l'un des plus exigeants : continuité de service, qualifications multiples, roulements 12h et astreintes s'enchaînent sur des horizons longs. Un logiciel planning hospitalier dédié évite les erreurs coûteuses d'un tableur mal maîtrisé.",
    },
    {
      type: "h2",
      text: "Planning médical et planning hôpital : enjeux communs",
    },
    {
      type: "p",
      text: "Le planning médical organise les gardes par spécialité et qualification ; le planning hôpital couvre l'ensemble des services d'un établissement. Dans les deux cas, les plannings de garde doivent garantir la continuité des soins, l'équité des nuits et week-ends, et le respect des repos réglementaires — des exigences que les tableurs ne vérifient pas automatiquement.",
    },
    {
      type: "h2",
      text: "Spécificités du planning roulement hospitalier",
    },
    {
      type: "p",
      text: "Les services hospitaliers alternent souvent jour/nuit en 12 heures, avec des repos réglementaires stricts entre deux périodes. Le planning roulement hospitalier doit garantir la couverture par qualification (IDE, AS, médecin) tout en respectant les accords de branche et les règles internes de l'établissement.",
    },
    {
      type: "h2",
      text: "Planning en 12 heures en milieu hospitalier",
    },
    {
      type: "ul",
      items: [
        "Alternance jour/nuit avec repos minimum entre deux 12h.",
        "Équité sur les week-ends et jours fériés.",
        "Continuité des soins : effectif minimal par unité.",
        "Gestion des remplacements de dernière minute (urgences, bloc).",
        "Traçabilité pour les audits et les contrôles internes.",
      ],
    },
    {
      type: "h2",
      text: "Gardes, astreintes et permanences",
    },
    {
      type: "p",
      text: "Urgences, bloc opératoire, EHPAD : chaque service a ses propres règles de couverture. Les astreintes médicales ou paramédicales s'ajoutent aux roulements fixes. Un planning hospitalier fiable modélise ces statuts séparément et recalcule la conformité à chaque modification.",
    },
    {
      type: "h2",
      text: "Logiciel planning hospitalier : critères clés",
    },
    {
      type: "ul",
      items: [
        "Paramétrage par service, qualification et type de garde.",
        "Génération conforme aux repos légaux et accords internes.",
        "Équité automatique sur nuits et week-ends.",
        "Workflow brouillon → validation cadre → publication équipes.",
        "Coexistence avec le SIRH hospitalier (sans le remplacer).",
      ],
    },
    {
      type: "h2",
      text: "Comment faire des roulements planning hospitalier sans Excel",
    },
    {
      type: "p",
      text: "Construire cellule par cellule un planning service hospitalier prend des heures et expose à des oublis de repos ou de qualifications. Planory, via SKYNET, génère une proposition conforme en moins de 2 minutes ; les cadres de santé relisent, ajustent et publient. L'IA propose, vous validez.",
    },
    {
      type: "h3",
      text: "Cas d'usage fréquents",
    },
    {
      type: "ul",
      items: [
        "Service d'urgences — couverture 24/7 par qualification.",
        "Bloc opératoire — salles et équipes spécialisées.",
        "EHPAD — roulements réguliers et astreintes de nuit.",
        "Centres hospitaliers multi-sites — règles harmonisées, autonomie par site.",
      ],
    },
    {
      type: "cta",
      text: "Vous pilotez un planning hospitalier complexe ?",
      href: "/contact",
      label: "Découvrir Planory pour la santé",
    },
  ],
};
