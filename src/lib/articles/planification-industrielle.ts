import type { ResourceArticle } from "@/lib/resources";

export const planificationIndustrielle: ResourceArticle = {
  slug: "planification-industrielle",
  path: "/ressources/planification-industrielle",
  title: "Planification industrielle : roulements 3×8, 2×8 et équipes en continu",
  description:
    "Planification industrielle des équipes : roulements 3×8, travail par roulement, astreintes maintenance et logiciel de gestion de planning pour l'industrie continue.",
  readTime: "8 min",
  publishedAt: "2026-06-28",
  keywords: [
    "planification industrielle",
    "gestion planning industriel",
    "travail par roulement",
    "travailler en roulement",
    "roulements 3x8",
    "planning industrie",
  ],
  relatedLinks: [
    { href: "/secteurs", label: "Secteurs Planory" },
    { href: "/ressources/travail-nuit-planning-2x8", label: "Travail de nuit et 2×8" },
    { href: "/ressources/gestion-astreintes", label: "Gestion des astreintes" },
    { href: "/produit", label: "Logiciel de gestion de planning" },
  ],
  sections: [
    {
      type: "p",
      text: "La planification industrielle consiste à organiser les équipes de production, maintenance et logistique sur des cycles continus — souvent 24h/24, 7j/7. Roulements 3×8, 2×8, astreintes techniques et absences imprévues se cumulent : un tableur ne suffit plus dès que les contraintes métier deviennent nombreuses.",
    },
    {
      type: "h2",
      text: "Planification industrielle : enjeux spécifiques",
    },
    {
      type: "ul",
      items: [
        "Couverture des lignes de production sans interruption.",
        "Qualifications machines, habilitations sécurité et polyvalence.",
        "Roulements 3×8 ou 2×8 avec repos légaux entre postes.",
        "Astreintes maintenance et renforts sur pics d'activité.",
        "Compteurs d'heures et équité sur la période glissante.",
      ],
    },
    {
      type: "h2",
      text: "Travailler en roulement : modéliser les cycles",
    },
    {
      type: "p",
      text: "Travailler en roulement signifie suivre un cycle prédéfini — semaine de nuit, semaine de jour, relève entre équipes. Le planning doit vérifier la conformité sur l'horizon complet : repos minimum, amplitude horaire, enchaînement jour/nuit. Une erreur sur une cellule Excel peut passer inaperçue jusqu'à un contrôle ou un incident.",
    },
    {
      type: "h2",
      text: "Roulements 3×8 et 2×8 en industrie",
    },
    {
      type: "p",
      text: "Le 3×8 (matin, après-midi, nuit) est courant en production continue. Le 2×8 couvre deux plages de huit heures avec parfois une équipe de nuit séparée. Dans les deux cas, la gestion des plannings industriels exige une couverture minimale par compétence sur chaque plage — pas seulement un effectif global.",
    },
    {
      type: "ul",
      items: [
        "3×8 : alternance matin / après-midi / nuit avec relève structurée.",
        "2×8 : deux équipes principales + renforts ou astreintes si besoin.",
        "Passage progressif jour → nuit pour limiter la fatigue.",
        "Gestion des arrêts ligne et réaffectation rapide.",
      ],
    },
    {
      type: "h2",
      text: "Astreintes, maintenance et continuité",
    },
    {
      type: "p",
      text: "Au-delà des postes fixes, la planification industrielle intègre des astreintes maintenance, des permanences techniques et des renforts saisonniers. Ces statuts ont des règles de repos et de rotation distinctes — ils doivent être modélisés dès la génération, pas ajoutés manuellement après coup.",
    },
    {
      type: "h2",
      text: "Logiciel de planification industrielle : critères clés",
    },
    {
      type: "ul",
      items: [
        "Paramétrage par site, ligne, poste et habilitation.",
        "Moteur de contraintes : repos, équité, couverture minimale.",
        "Absorption des absences et remplacements sans repartir de zéro.",
        "Workflow validation responsable production / RH.",
        "Complément au GTA : Planory planifie, le logiciel de temps suit.",
      ],
    },
    {
      type: "h2",
      text: "Planory et la planification industrielle 24/7",
    },
    {
      type: "p",
      text: "Planory cible les environnements à contraintes fortes : industrie continue, chimie, agroalimentaire, logistique. SKYNET génère une proposition conforme à vos règles métier en moins de 2 minutes ; vos responsables d'équipe relisent, ajustent et publient. L'IA propose, vous validez.",
    },
    {
      type: "cta",
      text: "Vous pilotez la planification industrielle d'un site 24/7 ?",
      href: "/contact",
      label: "Découvrir Planory",
    },
  ],
};
