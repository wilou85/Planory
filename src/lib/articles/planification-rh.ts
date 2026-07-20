import type { ResourceArticle } from "@/lib/resources";

export const planificationRh: ResourceArticle = {
  slug: "planification-rh",
  path: "/ressources/planification-rh",
  title: "Planification RH : relier référentiel agents et planning opérationnel",
  description:
    "Planification RH et planning d'équipes : comment unifier agents, qualifications et contraintes pour des plannings conformes en environnement 24/7.",
  readTime: "7 min",
  publishedAt: "2026-06-27",
  keywords: [
    "planification rh",
    "planification des rh",
    "logiciel planification rh",
    "outils de planification rh",
  ],
  relatedLinks: [
    { href: "/produit", label: "Planification RH Planory" },
    { href: "/ressources/planning-social", label: "Planning social" },
    { href: "/ressources/annualisation-temps-travail", label: "Annualisation du temps de travail" },
    { href: "/ressources/logiciel-planning-equipe", label: "Logiciel planning équipe" },
  ],
  sections: [
    {
      type: "p",
      text: "La planification RH consiste à anticiper les besoins en compétences et en effectifs, puis à traduire ces besoins en plannings opérationnels. Dans les organisations 24/7, le référentiel agents — contrats, qualifications, droits — est la base sans laquelle aucun planning fiable n'est possible.",
    },
    {
      type: "h2",
      text: "Planification RH : stratégique ou opérationnelle ?",
    },
    {
      type: "p",
      text: "On distingue souvent la planification stratégique RH (effectifs cibles, recrutement, formation) de la planification opérationnelle (qui est présent demain matin sur quel poste). Planory se concentre sur cette seconde couche : transformer un référentiel RH à jour en plannings publiables, conformes et équitables.",
    },
    {
      type: "h2",
      text: "Les données indispensables dans le référentiel",
    },
    {
      type: "ul",
      items: [
        "Agents et contrats (temps plein, partiel, alternance).",
        "Qualifications et habilitations par poste.",
        "Indisponibilités, congés et contraintes individuelles.",
        "Règles collectives et accords internes (repos, primes de nuit).",
        "Unités organisationnelles et services à couvrir.",
      ],
    },
    {
      type: "h2",
      text: "Outils de planification RH : ce qu'il faut éviter",
    },
    {
      type: "p",
      text: "Multiplier les fichiers Excel entre RH et planificateurs crée des versions divergentes et des erreurs silencieuses. Un outil de planification RH intégré au moteur de planning supprime cette friction : une modification d'absence se répercute immédiatement sur la génération.",
    },
    {
      type: "h2",
      text: "Chaîne planification RH → planning → publication",
    },
    {
      type: "p",
      text: "Le flux idéal : (1) référentiel RH à jour, (2) règles métier paramétrées, (3) génération d'une proposition conforme, (4) relecture planificateur, (5) publication aux équipes. Planory couvre les étapes 1 à 5 dans une application web française, avec le moteur IA SKYNET à l'étape 3.",
    },
    {
      type: "h3",
      text: "Intégration SIRH",
    },
    {
      type: "p",
      text: "Planory dispose d'un référentiel RH intégré. Selon votre contexte, une synchronisation avec votre SIRH existant peut être envisagée au déploiement — sans remplacer votre outil de paie ou de gestion des absences.",
    },
    {
      type: "cta",
      text: "Vous unifiez planification RH et planning opérationnel ?",
      href: "/contact",
      label: "Parler à un expert Planory",
    },
  ],
};
