import type { ResourceArticle } from "@/lib/resources";

export const planningSocial: ResourceArticle = {
  slug: "planning-social",
  path: "/ressources/planning-social",
  title: "Planning social : de quoi parle-t-on et comment l'organiser ?",
  description:
    "Le planning social regroupe l'organisation des horaires, des repos et des contraintes légales. Bonnes pratiques pour structurer un planning d'équipes conforme.",
  readTime: "7 min",
  publishedAt: "2026-06-27",
  keywords: ["planning social", "planification RH", "planning équipes", "conformité légale"],
  relatedLinks: [
    { href: "/produit", label: "Logiciel de gestion de planning" },
    { href: "/ressources/planification-rh", label: "Planification RH" },
    { href: "/ressources/logiciel-planning-equipe", label: "Logiciel planning équipe" },
    { href: "/ressources/annualisation-temps-travail", label: "Annualisation du temps de travail" },
  ],
  sections: [
    {
      type: "p",
      text: "Le planning social désigne l'ensemble des règles et pratiques qui encadrent l'organisation du temps de travail : horaires, repos, durée maximale, équité entre agents. Dans les environnements 24/7 — hôpital, aéroport, industrie — il devient rapidement le document central entre la direction, les planificateurs et les équipes.",
    },
    {
      type: "h2",
      text: "Planning social et planification RH : quelle différence ?",
    },
    {
      type: "p",
      text: "La planification RH couvre le référentiel agents (contrats, qualifications, droits). Le planning social en est la traduction opérationnelle : qui travaille quand, sur quel poste, avec quels repos. Un SIRH gère les absences et la paie ; le planning social garantit que les roulements respectent le droit du travail et les accords internes.",
    },
    {
      type: "h2",
      text: "Les piliers d'un planning social solide",
    },
    {
      type: "ul",
      items: [
        "Repos minimum entre deux périodes de travail (jour/nuit, 12h, 3×8).",
        "Durée maximale de travail et compteur d'heures sur la période.",
        "Équité des week-ends, nuits et jours fériés — mesurable et traçable.",
        "Qualifications et couverture minimale par poste ou service.",
        "Workflow de validation avant publication aux équipes.",
      ],
    },
    {
      type: "h2",
      text: "Pourquoi Excel atteint ses limites",
    },
    {
      type: "p",
      text: "Un tableur ne vérifie pas automatiquement les règles cumulées : une cellule mal copiée peut violer un repos légal sans alerte. Dès que l'effectif dépasse quelques dizaines de personnes et que les roulements se complexifient, le planning social exige un moteur de contraintes — pas seulement des formules.",
    },
    {
      type: "h2",
      text: "Comment un logiciel de planning équipe aide",
    },
    {
      type: "p",
      text: "Un logiciel spécialisé intègre le référentiel RH, les règles métier et la réglementation dans un même flux. Planory, via le moteur SKYNET, génère une proposition conforme en moins de 2 minutes ; le planificateur relit, ajuste et publie. L'IA propose, vous décidez — le planning social reste sous contrôle humain.",
    },
    {
      type: "h3",
      text: "Signaux d'alerte",
    },
    {
      type: "ul",
      items: [
        "Plus de 30 agents planifiés sur un horizon supérieur à 4 semaines.",
        "Roulements 24/7 avec astreintes ou gardes.",
        "Audit ou contrôle interne sur la conformité des plannings.",
        "Conflits récurrents sur l'équité des week-ends ou des nuits.",
      ],
    },
    {
      type: "cta",
      text: "Vous structurez un planning social pour un service 24/7 ?",
      href: "/contact",
      label: "Échanger avec Planory",
    },
  ],
};
