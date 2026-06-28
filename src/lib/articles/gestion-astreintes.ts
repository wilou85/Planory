import type { ResourceArticle } from "@/lib/resources";

export const gestionAstreintes: ResourceArticle = {
  slug: "gestion-astreintes",
  path: "/ressources/gestion-astreintes",
  title: "Gestion des astreintes : guide pratique",
  description:
    "Guide pratique sur les astreintes et le code du travail : couverture par qualification, repos minimum, équité entre agents et continuité de service.",
  readTime: "7 min",
  publishedAt: "2026-06-27",
  keywords: ["gestion des astreintes", "astreintes", "astreinte code du travail", "astreintes travail", "gardes", "planning 24/7"],
  relatedLinks: [
    { href: "/secteurs/hopital", label: "Planning hospitalier" },
    { href: "/ressources/travail-nuit-planning-2x8", label: "Travail de nuit et 2×8" },
    { href: "/produit", label: "Modules Planory" },
  ],
  sections: [
    {
      type: "p",
      text: "La gestion des astreintes concerne toute organisation qui doit garantir une disponibilité hors plage standard — hôpitaux, aéroports, industrie, services publics. Mal paramétrée, elle génère des conflits, des non-conformités et une fatigue accumulée.",
    },
    {
      type: "h2",
      text: "Astreinte, garde, permanence : clarifier les statuts",
    },
    {
      type: "p",
      text: "Selon les conventions et accords, astreinte (disponibilité à domicile ou sur site), garde (présence effective) et permanence (couverture continue) n'emportent pas les mêmes droits ni les mêmes repos. Le planning doit modéliser chaque statut avec ses règles propres.",
    },
    {
      type: "h2",
      text: "Les contraintes à intégrer dès la génération",
    },
    {
      type: "ul",
      items: [
        "Rotation équitable entre agents éligibles sur la période.",
        "Repos minimum après une astreinte ou une intervention.",
        "Couverture par qualification (IDE, médecin, technicien habilité…).",
        "Limite du nombre d'astreintes consécutives ou mensuelles.",
        "Gestion des remplacements et échanges sans repartir de zéro.",
      ],
    },
    {
      type: "h2",
      text: "Astreintes et code du travail",
    },
    {
      type: "p",
      text: "Le code du travail encadre les astreintes : période durant laquelle le salarié doit rester disponible pour intervenir, sans être à disposition permanente sur le lieu de travail. Les astreintes travail impliquent une rémunération ou une compensation, un repos minimum après intervention et parfois une limite du nombre d'astreintes sur une période.",
    },
    {
      type: "ul",
      items: [
        "Définir clairement la plage d'astreinte et le délai d'intervention attendu.",
        "Respecter le repos minimum après une intervention de nuit ou de week-end.",
        "Documenter la répartition pour démontrer l'équité entre agents.",
        "Intégrer les accords d'entreprise ou de branche (santé, industrie, services publics).",
      ],
    },
    {
      type: "p",
      text: "Connaître la réglementation ne suffit pas : le planning doit refuser les affectations qui la violent. Planory encode ces règles dans SKYNET — voir aussi notre guide sur le travail de nuit et les horaires en 2×8 pour les contraintes associées aux gardes.",
    },
    {
      type: "h2",
      text: "Équité mesurable",
    },
    {
      type: "p",
      text: "L'équité ne se résume pas à « tourner » : il faut pouvoir démontrer, sur 3 ou 6 mois, que la répartition des astreintes difficiles (nuits, week-ends, fériés) est équilibrée. Un tableur peine à produire cette traçabilité ; un logiciel de planning la calcule en continu.",
    },
    {
      type: "h2",
      text: "Astreintes et renforts en cours de période",
    },
    {
      type: "p",
      text: "Un agent tombe malade, un pic d'activité impose un renfort : le planning doit absorber le changement tout en respectant les contraintes cumulées. Planory traite astreintes et renforts comme des contraintes de première classe, recalculées en temps réel avant validation.",
    },
    {
      type: "h2",
      text: "Bonnes pratiques opérationnelles",
    },
    {
      type: "ul",
      items: [
        "Publier le planning en brouillon avant diffusion officielle.",
        "Documenter les règles appliquées pour chaque période.",
        "Prévoir un canal d'échange formalisé (remplacement, permutation).",
        "Mesurer la charge cumulée, pas seulement le nombre de créneaux.",
      ],
    },
    {
      type: "cta",
      text: "Vous structurez la gestion des astreintes pour un service critique ?",
      href: "/contact",
      label: "Échanger 20 minutes avec Planory",
    },
  ],
};
