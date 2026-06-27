export type ArticleSection =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "cta"; text: string; href: string; label: string };

export type ResourceArticle = {
  slug: string;
  path: string;
  title: string;
  description: string;
  readTime: string;
  publishedAt: string;
  keywords: string[];
  sections: ArticleSection[];
};

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    slug: "planning-excel-vs-logiciel",
    path: "/ressources/planning-excel-vs-logiciel",
    title: "Planning Excel vs logiciel : quand passer à l'IA ?",
    description:
      "Excel atteint vite ses limites sur les plannings 24/7. Critères de choix, comparaison et bonnes pratiques pour passer à un logiciel de planning d'équipes.",
    readTime: "8 min",
    publishedAt: "2026-06-27",
    keywords: [
      "planning excel",
      "logiciel planning équipe",
      "planning 24/7",
      "optimisation planning",
    ],
    sections: [
      {
        type: "p",
        text: "Excel reste l'outil le plus répandu pour construire un planning d'équipe. Pour une dizaine de personnes et un horizon de deux semaines, il suffit souvent. Dès que les contraintes se multiplient — roulements 3×8, astreintes, repos réglementaires, qualifications par poste — le tableur devient un goulot d'étranglement coûteux en temps et en risques.",
      },
      {
        type: "h2",
        text: "Les limites d'Excel sur les plannings complexes",
      },
      {
        type: "ul",
        items: [
          "Pas de moteur de contraintes : chaque règle (repos minimum, équité, qualifications) doit être vérifiée manuellement.",
          "Erreurs silencieuses : une formule mal copiée peut violer la réglementation sans alerte.",
          "Temps de calcul : un planning hospitalier ou industriel 24/7 peut prendre plusieurs heures à ajuster.",
          "Absence de workflow : pas de brouillon → validation → publication structuré.",
          "Collaboration limitée : versions multiples, conflits de fichiers, historique fragile.",
        ],
      },
      {
        type: "h2",
        text: "Quand passer à un logiciel de planning ?",
      },
      {
        type: "p",
        text: "Le passage à un logiciel devient pertinent dès que l'un de ces signaux apparaît :",
      },
      {
        type: "ul",
        items: [
          "Plus de 30 agents ou ressources à planifier sur un horizon supérieur à 4 semaines.",
          "Environnement 24/7 : hôpital, aéroport, industrie continue, contact center.",
          "Astreintes, gardes ou roulements alternés (12h, 3×8, 2×12).",
          "Obligation d'équité mesurable (week-ends, nuits, jours fériés).",
          "Audit ou conformité réglementaire exigée (repos, durée maximale, qualifications).",
        ],
      },
      {
        type: "h2",
        text: "Excel vs logiciel : comparaison",
      },
      {
        type: "h3",
        text: "Génération et conformité",
      },
      {
        type: "p",
        text: "Excel ne génère rien : vous construisez cellule par cellule. Un logiciel comme Planory, via le moteur SKYNET, produit une proposition conforme à 100 % de vos règles métier et légales en moins de 2 minutes. Vous relisez, ajustez et publiez — l'IA propose, vous décidez.",
      },
      {
        type: "h3",
        text: "Gestion des astreintes et renforts",
      },
      {
        type: "p",
        text: "Les astreintes, échanges et renforts en cours de période sont difficiles à gérer dans un tableur sans tout recalculer. Planory intègre ces mouvements en temps réel tout en respectant les contraintes cumulées.",
      },
      {
        type: "h3",
        text: "Planification RH intégrée",
      },
      {
        type: "p",
        text: "Un SIRH couvre absences et paie, pas l'optimisation de roulements. Planory combine référentiel RH (agents, qualifications, droits) et moteur de planification — une chaîne unique du référentiel à la publication.",
      },
      {
        type: "h2",
        text: "Excel vs Planory vs Holy-Dis (Timesquare)",
      },
      {
        type: "p",
        text: "Le comparatif structuré ci-dessus oppose Excel, Planory et Holy-Dis Timesquare — acteur WFM établi en France. Planory se distingue par SKYNET ; Holy-Dis par sa notoriété et ses études de cas retail.",
      },
      {
        type: "h2",
        text: "Excel vs SIRH vs Planory : comparatif par type d'outil",
      },
      {
        type: "h2",
        text: "Critères pour choisir un logiciel",
      },
      {
        type: "ul",
        items: [
          "Respect automatique des règles métier et légales (repos, durée, qualifications).",
          "Équité mesurable sur week-ends, nuits et astreintes.",
          "Workflow brouillon → validation → publication.",
          "Adaptabilité à votre secteur (hôpital, industrie, aéroport, commerce).",
          "Contrôle humain : l'outil propose, le planificateur valide.",
        ],
      },
      {
        type: "h2",
        text: "Conclusion",
      },
      {
        type: "p",
        text: "Excel reste utile pour des plannings simples et ponctuels. Dès que la complexité opérationnelle augmente, un logiciel de planning d'équipes avec moteur de contraintes devient un investissement rentable — en temps gagné, en conformité et en sérénité pour vos planificateurs.",
      },
      {
        type: "cta",
        text: "Vous hésitez entre Excel et un logiciel pour votre contexte ?",
        href: "mailto:contact@planory.net",
        label: "Échanger 20 minutes avec Planory",
      },
    ],
  },
];

export const HOSPITAL_SECTOR = {
  hero: {
    label: "Secteur hospitalier",
    title: "Logiciel de planning hospitalier avec IA",
    intro:
      "Planory planifie gardes, astreintes et roulements hospitaliers en respectant la réglementation du travail de nuit, l'équité des week-ends et la continuité des services. SKYNET génère une proposition en moins de 2 minutes ; vos cadres de santé valident et publient.",
  },
  challenges: {
    title: "Les défis du planning hospitalier",
    intro:
      "Les établissements de santé font face à des contraintes uniques que les tableurs ou SIRH généralistes ne couvrent pas.",
    items: [
      {
        title: "Roulements 12h et gardes",
        text: "Cycles jour/nuit, alternance et repos minimum entre deux périodes de travail — chaque violation expose l'établissement.",
      },
      {
        title: "Astreintes et permanences",
        text: "Rotation équitable, couverture par qualification (IDE, AS, médecin) et gestion des remplacements de dernière minute.",
      },
      {
        title: "Équité week-ends et nuits",
        text: "Répartition mesurable sur la période : personne ne doit cumuler les gardes difficiles sans compensation.",
      },
      {
        title: "Continuité de service",
        text: "Urgences, bloc opératoire, EHPAD — chaque service a ses propres règles de couverture minimale.",
      },
    ],
  },
  features: {
    title: "Ce que Planory apporte aux établissements de santé",
    items: [
      "Génération SKYNET conforme aux repos légaux et accords internes",
      "Paramétrage par service, qualification et type de garde",
      "Équité automatique sur week-ends, nuits et jours fériés",
      "Gestion des échanges et renforts sans repartir de zéro",
      "Workflow brouillon → validation cadre → publication équipes",
      "Audit trail des modifications et des règles appliquées",
    ],
  },
  useCases: {
    title: "Cas d'usage",
    items: [
      {
        title: "Service d'urgences",
        text: "Couverture 24/7 par qualification, roulements courts et gestion des pics d'affluence.",
      },
      {
        title: "Bloc opératoire",
        text: "Planification des salles et des équipes avec contraintes de spécialité.",
      },
      {
        title: "EHPAD et soins de suite",
        text: "Roulements réguliers, astreintes de nuit et polyvalence entre unités.",
      },
      {
        title: "Centres hospitaliers multi-sites",
        text: "Harmonisation des règles tout en conservant l'autonomie par établissement.",
      },
    ],
  },
  faq: [
    {
      question: "Planory gère-t-il les roulements hospitaliers en 12 heures ?",
      answer:
        "Oui. Les cycles 12h (jour/nuit) sont paramétrables avec repos réglementaires, alternance et équité. SKYNET génère une proposition conforme que vos cadres peuvent ajuster avant publication.",
    },
    {
      question: "Comment Planory traite-t-il les astreintes ?",
      answer:
        "Les astreintes sont des contraintes de première classe : rotation, repos minimum, équité entre agents et couverture par qualification sont intégrés à la génération.",
    },
    {
      question: "Planory remplace-t-il le SIRH hospitalier ?",
      answer:
        "Non. Planory se concentre sur la planification complexe. Il peut coexister avec votre SIRH et, selon le contexte, s'y intégrer pour synchroniser le référentiel agents.",
    },
  ],
} as const;

export function getResourceArticle(slug: string) {
  return RESOURCE_ARTICLES.find((a) => a.slug === slug);
}
