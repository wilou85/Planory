import type { ResourceArticle } from "@/lib/resources";

export const annualisationTempsTravail: ResourceArticle = {
  slug: "annualisation-temps-travail",
  path: "/ressources/annualisation-temps-travail",
  title: "Annualisation du temps de travail : règles, planning et conformité",
  description:
    "Comprendre l'annualisation du temps de travail : période de référence, heures supplémentaires, repos et impact sur le planning d'équipes 24/7.",
  readTime: "8 min",
  publishedAt: "2026-07-20",
  keywords: [
    "annualisation du temps de travail",
    "annualisation temps de travail",
    "modulation du temps de travail",
    "durée du travail annualisée",
    "planning équipes",
    "heures supplémentaires annualisation",
  ],
  relatedLinks: [
    { href: "/ressources/planning-social", label: "Planning social" },
    { href: "/ressources/planification-rh", label: "Planification RH" },
    { href: "/ressources/travail-nuit-planning-2x8", label: "Travail de nuit et 2×8" },
    { href: "/produit", label: "Logiciel de gestion de planning" },
  ],
  sections: [
    {
      type: "p",
      text: "L'annualisation du temps de travail permet de répartir la durée du travail sur une période de référence plus longue que la semaine — souvent l'année, parfois une période plus courte définie par accord. L'objectif : absorber les variations d'activité sans recourir systématiquement aux heures supplémentaires, tout en respectant les plafonds légaux et conventionnels.",
    },
    {
      type: "h2",
      text: "Annualisation, modulation, forfait : ne pas confondre",
    },
    {
      type: "p",
      text: "L'annualisation (ou modulation) organise les horaires autour d'une durée moyenne sur la période de référence. Ce n'est pas un forfait jours : les heures restent comptées, les repos journaliers et hebdomadaires s'appliquent, et le dépassement des seuils peut ouvrir droit à majoration ou repos compensateur selon l'accord. En pratique, le planning devient le document qui prouve que la répartition reste conforme.",
    },
    {
      type: "h2",
      text: "Ce que le planificateur doit suivre au quotidien",
    },
    {
      type: "ul",
      items: [
        "La durée moyenne sur la période de référence (souvent 35 h / semaine en moyenne annuelle, selon l'accord).",
        "Les plafonds hebdomadaires et quotidiens : même en annualisation, on ne peut pas « lisser » n'importe comment.",
        "Le compteur d'heures par agent : surplus, déficit, bascule en heures supplémentaires en fin de période.",
        "Les repos minimum entre deux postes, les week-ends et les nuits — l'équité reste mesurable.",
        "Les absences (CP, maladie, formation) qui impactent le décompte annualisé.",
      ],
    },
    {
      type: "h2",
      text: "Pourquoi l'annualisation casse les tableurs",
    },
    {
      type: "p",
      text: "Sur Excel, suivre un compteur annualisé pour des dizaines d'agents en roulement 24/7 devient vite opaque : pics d'activité, remplacements, astreintes et absences se cumulent. Une erreur de formule ou une feuille non synchronisée expose l'établissement à un planning non conforme — et à des litiges sur le paiement des heures. Dès que la période de référence dépasse quelques semaines et que plusieurs statuts coexistent, un moteur de contraintes devient indispensable.",
    },
    {
      type: "h2",
      text: "Annualisation et environnements 24/7",
    },
    {
      type: "p",
      text: "Hôpital, aéroport, industrie continue : l'activité varie (saisonnalité, pics, gardes) alors que la couverture doit rester continue. L'annualisation aide à lisser les charges, mais elle multiplie les règles à vérifier à chaque génération de planning. Les roulements 12 h, 2×8 ou 3×8 doivent cohabiter avec le compteur annualisé — sans sacrifier les repos ni l'équité des nuits et week-ends.",
    },
    {
      type: "h3",
      text: "Signaux d'alerte",
    },
    {
      type: "ul",
      items: [
        "Compteurs annualisés tenus hors du planning opérationnel (fichier séparé, mise à jour manuelle).",
        "Fin de période : régularisation massive d'heures supplémentaires non anticipée.",
        "Agents régulièrement au-dessus des plafonds hebdomadaires « parce que l'année lissera ».",
        "Difficulté à expliquer un planning lors d'un contrôle ou d'un entretien RH.",
      ],
    },
    {
      type: "h2",
      text: "Comment un logiciel de planning aide",
    },
    {
      type: "p",
      text: "Un logiciel spécialisé relie le référentiel RH, les règles d'annualisation et le planning publié. Planory, via SKYNET, génère une proposition qui respecte vos contraintes métier et légales ; le planificateur relit, ajuste et publie. L'IA propose, vous décidez — le compteur annualisé ne reste plus un fichier parallèle oublié.",
    },
    {
      type: "cta",
      text: "Vous annualisez le temps de travail sur des équipes 24/7 ?",
      href: "/contact",
      label: "Échanger avec Planory",
    },
  ],
};
