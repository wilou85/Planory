export const INDUSTRY_SECTOR = {
  hero: {
    label: "Secteur industriel",
    title: "Planification industrielle : roulements 3×8, 2×12 et IA SKYNET",
    intro:
      "Planory organise les roulements industriels (3×8, 2×8, 2×12), absorbe les absences et suit les compteurs d'heures tout en respectant repos et équité. SKYNET génère une proposition conforme en moins de 2 minutes ; vos planificateurs valident et publient.",
  },
  domain: {
    title: "Cycles, compétences et couverture d'atelier",
    intro:
      "L'industrie continue exige une couverture par compétence (conduite, maintenance, qualité) sur des horizons longs — avec des aléas quotidiens que Excel ne sécurise pas.",
    items: [
      {
        title: "Roulements 3×8 et 2×12",
        text: "Cycles matin / après-midi / nuit ou 2×12 : alternance, repos minimum et plafonds sont vérifiés à chaque génération.",
      },
      {
        title: "Couverture par compétence",
        text: "Chaque poste machine ou ligne exige la bonne qualification. Les affectations non conformes sont bloquées avant publication.",
      },
      {
        title: "Absences et renforts",
        text: "Maladie, formation, congés : réaffecter sans casser le cycle ni la conformité cumulative.",
      },
    ],
  },
  regulation: {
    title: "Compteurs, annualisation et conformité",
    text: "Les sites industriels cumulent souvent modulation ou annualisation, travail de nuit et astreintes maintenance. Planory encode les règles métier et légales pour les roulements générés ; les astreintes (disponibilité) se gèrent manuellement via le statut dédié ou comme activité au statut standard.",
  },
  challenges: {
    title: "Les défis de la planification industrielle",
    intro:
      "Production continue, maintenance planifiée et imprévus : le planning doit rester robuste et lisible pour les équipes.",
    items: [
      {
        title: "Compteurs d'heures",
        text: "Suivre surplus / déficit sur la période de référence sans fichier parallèle oublié.",
      },
      {
        title: "Équité des nuits",
        text: "Répartition mesurable des créneaux de nuit et week-ends — clé pour la rétention.",
      },
      {
        title: "Astreintes maintenance",
        text: "Rotation équitable, repos et couverture des compétences critiques.",
      },
      {
        title: "Multi-ateliers / multi-sites",
        text: "Harmoniser les règles tout en respectant les spécificités de chaque ligne ou usine.",
      },
    ],
  },
  features: {
    title: "Ce que Planory apporte à l'industrie",
    items: [
      "Génération SKYNET conforme aux cycles et repos réglementaires",
      "Paramétrage par atelier, compétence et type de roulement",
      "Équité automatique sur nuits, week-ends et fériés",
      "Absorption des absences sans reconstruire le planning",
      "Workflow brouillon → validation → publication équipes",
      "Audit trail des contraintes appliquées",
    ],
  },
  useCases: {
    title: "Cas d'usage",
    items: [
      {
        title: "Production continue",
        text: "Roulements 3×8, couverture minimale par poste et pics de charge.",
      },
      {
        title: "Maintenance industrielle",
        text: "Astreintes, interventions planifiées et compétences rares.",
      },
      {
        title: "Ateliers multi-compétences",
        text: "Polyvalence contrôlée : qui peut tenir quel poste, quand.",
      },
      {
        title: "Groupes multi-sites",
        text: "Règles partagées, autonomie locale, reporting d'équité.",
      },
    ],
  },
  faq: [
    {
      question: "Planory gère-t-il les roulements 3×8 et 2×12 ?",
      answer:
        "Oui. Les cycles industriels sont paramétrables avec repos, alternance et équité. SKYNET propose une solution conforme que vos planificateurs ajustent avant publication.",
    },
    {
      question: "Peut-on suivre les compteurs d'heures / l'annualisation ?",
      answer:
        "Planory intègre les contraintes de durée et de répartition dans la génération. Pour une lecture détaillée de l'annualisation, voir aussi notre guide dédié.",
    },
    {
      question: "Comment sont gérées les absences de dernière minute ?",
      answer:
        "Les renforts et échanges s'appuient sur une proposition déjà contrainte : vous réaffectez sans repartir d'un tableur vide.",
    },
    {
      question: "Planory remplace-t-il l'ERP ?",
      answer:
        "Planory porte la GTA côté planification d'équipes 24/7 (roulements, astreintes, conformité SKYNET). Il ne remplace pas un ERP de production : les deux se complètent. Selon le contexte, le pointage et la paie peuvent rester dans un outil existant ou être cadrés en déploiement.",
    },
  ],
} as const;
