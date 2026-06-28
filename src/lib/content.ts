export const CONTACT_EMAIL = "contact@planory.net";

import { getDrawerNavSections, getMobileTabItems, getNavItems } from "@/lib/i18n";

export const NAV_ITEMS = getNavItems("fr");
export const MOBILE_TAB_ITEMS = getMobileTabItems("fr");
export const DRAWER_NAV_SECTIONS = getDrawerNavSections("fr");

export const HERO_STATS = [
  { value: "< 2 min", label: "Génération", labelDesktop: "pour générer un planning" },
  { value: "100%", label: "Conformité", labelDesktop: "règles métier respectées" },
  { value: "3 niveaux", label: "Accompagnement", labelDesktop: "d'accompagnement" },
] as const;

/** Valeur différenciante — landing */
export const VALUE_PILLARS = [
  {
    title: "Interface ergonomique et intuitive",
    description: null,
  },
  {
    title: "Une solution évolutive",
    description: "Conçue pour intégrer de nouvelles règles et cas d'usage.",
  },
  {
    title: "Une solution pensée pour des environnements critiques",
    description: "Fiabilité et robustesse au cœur du produit.",
  },
  {
    title: "Outil SaaS ouvert",
    description: "Possibilité de s'interfacer en API avec les outils du marché.",
  },
] as const;

export const PRODUCT_BENEFITS = [
  "Moins d'incohérences entre disponibilités et règles",
  "Résultat plus fiable par application amont des contraintes",
  "Publication maîtrisée du brouillon à la validation",
  "Gestion planning personnel : qualifications, repos, équité et couverture par poste.",
  "Gestion des plannings sur horizons longs (semaines à trimestre).",
  "Complément à votre SIRH ou GTA — Planory se concentre sur la planification, pas le pointage.",
  "Échanges, astreintes, renforts gérés en temps réel",
] as const;

export const PRODUCT_MODULES = [
  {
    id: "rh",
    abbr: "RH",
    title: "Planification RH",
    description:
      "Agents, droits, qualifications, unités organisationnelles. Le référentiel central dont tout dépend.",
    details: [
      {
        title: "Référentiel agents et qualifications",
        text: "Chaque agent est rattaché à ses droits, qualifications et unités organisationnelles — base de toute génération de planning.",
      },
      {
        title: "Contraintes individuelles intégrées",
        text: "Indisponibilités, préférences et règles spécifiques sont prises en compte dès la proposition SKYNET.",
      },
      {
        title: "Compatible avec votre SIRH",
        text: "Planory dispose d'un référentiel RH intégré ; une intégration avec votre SIRH existant peut être envisagée au déploiement.",
      },
    ],
  },
  {
    id: "planning",
    abbr: "Pl",
    title: "Planning d'équipes",
    description:
      "Cycles, quarts, roulements. Généré par SKYNET, revu par vos planificateurs, publié en un clic.",
    details: [
      {
        title: "Génération automatique conforme",
        text: "SKYNET produit une proposition respectant repos réglementaires, astreintes, qualifications par poste et cycles 3×8 ou 2×12.",
      },
      {
        title: "Échanges et renforts en temps réel",
        text: "Gestion des remplacements, astreintes et renforts sans repartir d'une feuille vierge.",
      },
      {
        title: "Du brouillon à la publication",
        text: "Workflow maîtrisé : proposition IA, relecture planificateur, ajustements, validation et publication aux équipes.",
      },
    ],
  },
  {
    id: "ressources",
    abbr: "Re",
    title: "Ressources",
    description:
      "Postes, salles, équipements. Chaque ressource est planifiée et auditée au même titre qu'un agent.",
    details: [
      {
        title: "Postes et salles planifiés",
        text: "Blocs opératoires, salles de cours, postes de travail — chaque ressource suit les mêmes règles de couverture.",
      },
      {
        title: "Détection des conflits",
        text: "Les chevauchements et sous-effectifs sont signalés avant publication.",
      },
    ],
  },
  {
    id: "skynet",
    abbr: "SK",
    title: "SKYNET — IA",
    description:
      "Le moteur d'optimisation. Génère une proposition respectant 100% de vos règles métier et légales, intégrant fatigue, équité et contraintes individuelles.",
    details: [
      {
        title: "100 % des règles respectées",
        text: "Repos légaux, durée maximale, équité des week-ends et nuits — SKYNET n' propose que des plannings conformes.",
      },
      {
        title: "Équité et fatigue intégrées",
        text: "Répartition équitable des gardes et prise en compte de la charge cumulée sur la période.",
      },
      {
        title: "L'IA propose, vous décidez",
        text: "SKYNET accélère la génération ; vos planificateurs gardent le contrôle total avant publication.",
      },
    ],
  },
] as const;

export const SECTORS = [
  {
    icon: "plane" as const,
    title: "Aéroport / ATC",
    description:
      "Quarts robustes, règles de repos réglementaires, gestion des incidents et relèves de quart.",
    tags: ["24/7", "Réglementé", "Postes critiques"],
  },
  {
    icon: "hospital" as const,
    title: "Hôpital",
    href: "/secteurs/hopital",
    description:
      "Planning hospitalier et planning roulement hospitalier : gardes, astreintes 12h, équité des week-ends et continuité de service.",
    tags: ["Astreintes", "Équité", "Continuité"],
  },
  {
    icon: "factory" as const,
    title: "Industrie",
    href: "/ressources/planification-industrielle",
    description:
      "Roulements 3×8, 2×12, absorption des absences, suivi des compteurs d'heures.",
    tags: ["Cycles", "Compteurs", "Robuste"],
  },
  {
    icon: "shopping" as const,
    title: "Commerce",
    description:
      "Staffing sur pics d'activité, contrats temps partiels, publication rapide.",
    tags: ["Pics", "Opérationnel", "Rapide"],
  },
  {
    icon: "school" as const,
    title: "École",
    description:
      "Emplois du temps, réservation de salles, détection et résolution de conflits.",
    tags: ["Salles", "Conflits", "Lisible"],
  },
  {
    icon: "landmark" as const,
    title: "Services publics",
    description:
      "Équipes multi-sites, gestion des astreintes, continuité de service.",
    tags: ["Multi-sites", "Astreintes", "Continuité"],
  },
] as const;

export const OFFERS = [
  {
    tier: "Autonome",
    title: "Vous pilotez seul.",
    description:
      "Accès complet à la plateforme : vous configurez vos règles et générez vos plannings sans accompagnement dédié.",
    features: [
      "Accès aux modules RH, Planning, Ressources",
      "SKYNET — moteur de génération IA",
      "Formation initiale (2 h)",
      "Support e-mail standard",
      "Onboarding guidé",
    ],
    cta: "Demander un accès",
    highlighted: false,
  },
  {
    tier: "Accompagné",
    title: "On avance ensemble.",
    description:
      "Un référent Planory travaille avec vos planificateurs pendant la mise en place et les premiers cycles.",
    features: [
      "Tout ce qui est dans Autonome",
      "Référent dédié (suivi hebdomadaire)",
      "Intégration RH et paramétrage métier",
      "Formation avancée de l'équipe",
      "SLA prioritaire",
    ],
    cta: "Prendre contact",
    highlighted: true,
    badge: "Recommandé",
  },
  {
    tier: "Mission critique",
    title: "Zéro tolérance à l'erreur.",
    description:
      "Pour les environnements réglementés, 24/7 et multi-sites avec pilotage continu.",
    features: [
      "Tout ce qui est dans Accompagné",
      "Paramétrage réglementaire sur mesure",
      "Tests de conformité documentés",
      "SLA garanti < 2 h",
      "Accompagnement pilote inclus",
    ],
    cta: "Discuter du projet",
    highlighted: false,
  },
] as const;

export const OFFER_COMPARISON = {
  tiers: ["Autonome", "Accompagné", "Mission critique"] as const,
  rows: [
    {
      feature: "Modules RH, Planning, Ressources",
      values: { Autonome: true, Accompagné: true, "Mission critique": true },
    },
    {
      feature: "Moteur IA SKYNET",
      values: { Autonome: true, Accompagné: true, "Mission critique": true },
    },
    {
      feature: "Formation initiale",
      values: { Autonome: "2 h", Accompagné: "Avancée", "Mission critique": "Avancée" },
    },
    {
      feature: "Référent dédié",
      values: { Autonome: false, Accompagné: true, "Mission critique": true },
    },
    {
      feature: "Paramétrage réglementaire sur mesure",
      values: { Autonome: false, Accompagné: false, "Mission critique": true },
    },
    {
      feature: "SLA garanti",
      values: { Autonome: false, Accompagné: "Prioritaire", "Mission critique": "< 2 h" },
    },
    {
      feature: "Accompagnement pilote",
      values: { Autonome: false, Accompagné: false, "Mission critique": true },
    },
  ],
} as const;

export const FAQ_ITEMS = [
  {
    question: "Faut-il préparer des données avant le premier échange ?",
    answer:
      "Non. Un premier échange de 20 minutes suffit pour couvrir votre secteur, vos volumes et 2–3 contraintes clés. Si vous disposez déjà d'un horizon de planning (2–4 semaines), cela accélère la suite — mais ce n'est pas obligatoire.",
  },
  {
    question: "Qu'est-ce que SKYNET exactement ?",
    answer:
      "SKYNET est le moteur d'optimisation IA de Planory. Il génère une proposition de planning conforme à vos règles métier et légales, en intégrant équité, fatigue et contraintes individuelles. Vous relisez, ajustez et publiez — l'IA propose, vous décidez.",
  },
  {
    question: "Planory fonctionne-t-il sur des environnements 24/7 réglementés ?",
    answer:
      "Oui. Planory est conçu pour les contextes à contraintes fortes : aéroport, hôpital, industrie continue, services publics. Les règles de repos, astreintes et postes critiques sont paramétrables et auditables.",
  },
  {
    question: "Est-ce que Planory s'intègre à mon SIRH existant ?",
    answer:
      "Planory dispose d'un référentiel RH intégré. Selon votre contexte, une intégration avec votre SIRH peut être envisagée lors du déploiement — c'est un point couvert lors du premier échange.",
  },
  {
    question: "Combien de temps prend le déploiement ?",
    answer:
      "Le délai dépend du niveau d'accompagnement et de la complexité de vos règles. En mode Autonome, vous pouvez démarrer rapidement après la formation initiale. En mode Accompagné ou Mission critique, un calendrier est défini avec votre référent.",
  },
  {
    question: "Quel est le modèle tarifaire ?",
    answer:
      "Planory ne publie pas de grille tarifaire : chaque déploiement est unique (volumes, secteur, niveau d'accompagnement). Contactez-nous pour une recommandation adaptée à votre contexte.",
  },
  {
    question: "Quelle différence entre un logiciel de planning et un SIRH ?",
    answer:
      "Un SIRH gère les absences, la paie et les talents. Planory se concentre sur la génération de plannings complexes 24/7 : roulements, astreintes, équité et conformité réglementaire. Les deux peuvent coexister — Planory peut s'intégrer à votre SIRH existant.",
  },
  {
    question: "Planory remplace-t-il un logiciel GTA ?",
    answer:
      "Non. Un logiciel GTA (gestion des temps et activités) gère le pointage, les absences et les éléments variables de paie. Planory se concentre sur la planification complexe 24/7 : roulements, astreintes, équité et génération conforme via SKYNET. Les deux se complètent — Planory peut coexister avec votre GTA ou SIRH existant sans remplacer le suivi des temps.",
  },
  {
    question: "Comment gérer les astreintes avec Planory ?",
    answer:
      "Les astreintes sont paramétrées comme contraintes dans SKYNET : rotation, repos minimum entre gardes, équité entre agents et couverture par qualification. Le moteur génère une proposition conforme ; vos cadres valident avant publication.",
  },
  {
    question: "Planory remplace-t-il Excel pour les plannings ?",
    answer:
      "Oui, pour les environnements 24/7 à contraintes multiples. SKYNET génère en moins de 2 minutes ce qu'Excel met des heures à calculer manuellement — sans risque d'erreur sur les repos ou l'équité. Voir notre guide Excel vs logiciel pour les critères de passage.",
  },
  {
    question: "Qu'est-ce que le planning social ?",
    answer:
      "Le planning social désigne la planification des effectifs en tenant compte des contraintes sociales, légales et des accords d'entreprise : durée du travail, repos, équité des horaires. Planory intègre ces règles dès la génération SKYNET.",
  },
  {
    question: "Comment organiser un planning hospitalier en 12 heures ?",
    answer:
      "Planory paramètre les cycles 12h (jour/nuit) avec repos réglementaires, alternance et équité automatique. SKYNET propose un roulement conforme ; les cadres de santé relisent, ajustent les cas particuliers et publient.",
  },
  {
    question: "Planory est-il adapté au commerce et au retail ?",
    answer:
      "Oui. Planory gère le staffing sur pics d'activité, les contrats temps partiels, la polyvalence et la publication rapide aux équipes magasin — avec les mêmes garanties de conformité que pour les environnements 24/7.",
  },
] as const;

export const CONTACT_TOPICS = [
  "Votre secteur et vos problématiques",
  "Faisabilité et risques",
  "Niveau d'accompagnement",
  "Prochaines étapes",
] as const;
