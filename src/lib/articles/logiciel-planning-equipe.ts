import type { ResourceArticle } from "@/lib/resources";

export const logicielPlanningEquipe: ResourceArticle = {
  slug: "logiciel-planning-equipe",
  path: "/ressources/logiciel-planning-equipe",
  title: "Logiciel planning équipe : comment choisir pour un contexte 24/7 ?",
  description:
    "Critères concrets pour choisir un logiciel de planning d'équipes : contraintes métier, roulements, astreintes et contrôle planificateur.",
  readTime: "8 min",
  publishedAt: "2026-06-27",
  keywords: [
    "logiciel planning équipe",
    "logiciel planning d'équipe",
    "logiciel de planning d'équipe",
    "gestion planning",
    "logiciel de gestion de planning",
    "planning 24/7",
  ],
  relatedLinks: [
    { href: "/produit", label: "Modules Planory" },
    { href: "/ressources/planning-social", label: "Planning social" },
    { href: "/faq", label: "FAQ Planory et GTA" },
  ],
  sections: [
    {
      type: "p",
      text: "Un logiciel planning équipe ne se limite pas à afficher des créneaux : il doit absorber vos règles métier, vos contraintes RH et la réglementation du travail, puis proposer des plannings exploitables. Pour les équipes 24/7, le niveau d'exigence monte d'un cran.",
    },
    {
      type: "h2",
      text: "Ce qu'un bon logiciel doit couvrir",
    },
    {
      type: "ul",
      items: [
        "Référentiel agents : qualifications, droits, indisponibilités.",
        "Roulements complexes : 3×8, 2×12, 12h, cycles alternés.",
        "Astreintes et renforts en cours de période.",
        "Équité mesurable sur week-ends, nuits et jours fériés.",
        "Workflow brouillon → validation → publication.",
      ],
    },
    {
      type: "h2",
      text: "Logiciel planning équipe vs SIRH",
    },
    {
      type: "p",
      text: "Un SIRH couvre la gestion RH globale — absences, paie, entretiens. Il n'est pas conçu pour optimiser des roulements hospitaliers ou industriels. Un logiciel de planning d'équipes se concentre sur la génération conforme et l'ajustement opérationnel. Les deux coexistent : le référentiel RH alimente le planning.",
    },
    {
      type: "h2",
      text: "Critères de choix pour un contexte réglementé",
    },
    {
      type: "h3",
      text: "Conformité automatique",
    },
    {
      type: "p",
      text: "Le logiciel doit refuser ou corriger les affectations qui violent repos légaux, durée maximale ou qualifications requises — avant publication, pas après coup.",
    },
    {
      type: "h3",
      text: "Contrôle humain",
    },
    {
      type: "p",
      text: "L'outil accélère la génération ; le planificateur garde la décision finale. Méfiez-vous des solutions « boîte noire » sans relecture ni historique des modifications.",
    },
    {
      type: "h3",
      text: "Adaptabilité sectorielle",
    },
    {
      type: "p",
      text: "Hôpital, aéroport, industrie continue ou commerce : les contraintes ne sont pas les mêmes. Le paramétrage par service, poste et type de garde est indispensable.",
    },
    {
      type: "h2",
      text: "Où l'IA apporte une valeur mesurable",
    },
    {
      type: "p",
      text: "Sur un planning 24/7, le nombre de combinaisons possibles explose. Un moteur d'optimisation — comme SKYNET chez Planory — propose une solution conforme en moins de 2 minutes au lieu de plusieurs heures de travail manuel sur tableur.",
    },
    {
      type: "cta",
      text: "En phase d'appel d'offres ou de cadrage projet ?",
      href: "/contact",
      label: "Échanger avec Planory",
    },
  ],
};
