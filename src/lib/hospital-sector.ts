export const HOSPITAL_SECTOR = {
  hero: {
    label: "Secteur hospitalier",
    pilotNote: "Pilote en cours — Centre Hospitalier de Versailles",
    title: "Planning hospitalier, planning médical et planning hôpital avec IA",
    intro:
      "Planory organise le planning roulement hospitalier, les gardes et la continuité de service en respectant la réglementation du travail de nuit et l'équité des week-ends. SKYNET génère une proposition en moins de 2 minutes ; vos cadres de santé valident et publient. Les astreintes (disponibilité) se gèrent dans le planning — manuellement via le statut dédié, ou comme activité au statut standard. Un pilote est également en cours au Centre Hospitalier de Versailles.",
  },
  medicalPlanning: {
    title: "Planning médical, planning hôpital et planning de garde",
    intro:
      "Que vous organisiez un planning médical par spécialité, un planning hôpital multi-services ou des plannings de garde et de permanence, les mêmes exigences reviennent : couverture par qualification, repos réglementaires et équité mesurable.",
    items: [
      {
        title: "Planning médical par qualification",
        text: "IDE, AS, médecins, internes — chaque garde exige la bonne compétence. Le planning médical doit bloquer les affectations non conformes avant publication.",
      },
      {
        title: "Planning hôpital multi-services",
        text: "Urgences, bloc, EHPAD, soins intensifs : règles de couverture distinctes, harmonisées au niveau de l'établissement.",
      },
      {
        title: "Planning de garde et permanences",
        text: "Gardes de nuit et permanences de jour entrent dans la génération SKYNET. Les astreintes (disponibilité à domicile ou sur site) passent par le statut dédié géré manuellement — utile pour arbitrer l’équité — ou par une activité au statut standard si vous les modélisez ainsi.",
      },
    ],
  },
  fph: {
    title: "Réglementation du planning en fonction publique hospitalière",
    text: "Les établissements publics de santé sont soumis à des règles spécifiques : durée du travail, repos entre gardes, organisation des astreintes et traçabilité des plannings. Planory encode la réglementation planning fonction publique hospitalière dans vos paramètres métier — SKYNET vérifie la conformité à chaque génération, avec un audit trail pour les contrôles internes.",
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
      question: "Planory convient-il au planning médical et au planning hôpital ?",
      answer:
        "Oui. Planory modélise les gardes et permanences par qualification et par service — que vous organisiez un planning médical spécialisé ou un planning hôpital multi-unités. Les astreintes (disponibilité) se gèrent manuellement via le statut dédié, ou comme activité au statut standard.",
    },
    {
      question: "Comment Planory traite-t-il les astreintes ?",
      answer:
        "Les astreintes (disponibilité) ne sont pas générées par SKYNET stricto sensu. Statut dédié « astreinte » en saisie manuelle pour arbitrer la répartition ; ou activité nommée (ex. « garde astreinte ») au statut standard, alors eligible à la génération. L’intégration du statut « astreinte » au générateur pourra venir plus tard.",
    },
    {
      question: "Existe-t-il une référence pilote en milieu hospitalier ?",
      answer:
        "Oui. Un pilote est en cours au Centre Hospitalier de Versailles. Il illustre le positionnement de Planory sur des plannings hospitaliers complexes — sans remplacer votre SIRH.",
    },
    {
      question: "Planory remplace-t-il le SIRH hospitalier ?",
      answer:
        "Non. Planory se concentre sur la planification complexe. Il peut coexister avec votre SIRH et, selon le contexte, s'y intégrer pour synchroniser le référentiel agents.",
    },
  ],
} as const;
