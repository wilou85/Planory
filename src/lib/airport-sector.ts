export const AIRPORT_SECTOR = {
  hero: {
    label: "Secteur aéroportuaire",
    title: "Planning aéroport et ATC : quarts 24/7 réglementés avec IA",
    intro:
      "Planory planifie les quarts aéroportuaires et les postes critiques (ops, sureté, handling, ATC côté organisation) en respectant les repos réglementaires, les relèves et la continuité de service. SKYNET génère une proposition en moins de 2 minutes ; vos planificateurs valident et publient. Référence pilote : Aéroport de Paris-Orly.",
  },
  domain: {
    title: "Quarts, relèves et postes critiques",
    intro:
      "Un aéroport cumule des contraintes que les tableurs absorbent mal : amplitude 24/7, qualifications par poste, incidents et remplacements de dernière minute, sans rompre les chaînes de relève.",
    items: [
      {
        title: "Quarts robustes 24/7",
        text: "Couverture continue des postes ops, sureté et handling avec repos minimum entre deux périodes et plafonds horaires contrôlés dès la génération.",
      },
      {
        title: "Relèves et handovers",
        text: "Les chevauchements de relève et la continuité d'information opérationnelle sont traités comme des contraintes de planning, pas comme des notes Excel.",
      },
      {
        title: "Postes critiques et qualifications",
        text: "Chaque créneau exige la bonne habilitation. Les affectations non conformes sont bloquées avant publication.",
      },
    ],
  },
  regulation: {
    title: "Repos réglementaires et traçabilité",
    text: "Les organisations aéroportuaires doivent démontrer le respect des temps de repos, des amplitudes et des règles métier internes. Planory encode ces paramètres ; SKYNET les vérifie à chaque génération, avec un audit trail exploitable en contrôle interne.",
  },
  challenges: {
    title: "Les défis du planning aéroportuaire",
    intro:
      "Pics de trafic, aléas météo, absences et renforts : le planning doit rester conforme tout en absorbant l'imprévu.",
    items: [
      {
        title: "Incidents et renforts",
        text: "Remplacements rapides sans repartir d'une feuille blanche, en conservant qualifications et repos.",
      },
      {
        title: "Équité des nuits et week-ends",
        text: "Répartition mesurable des créneaux difficiles — essentielle pour la rétention et le climat social.",
      },
      {
        title: "Multi-équipes / multi-postes",
        text: "Ops, sureté, handling et supports partagent parfois des viviers : le moteur doit gérer les priorités de couverture.",
      },
      {
        title: "Horizons longs",
        text: "Préparer plusieurs semaines tout en réagissant au jour J — sans perdre la conformité cumulative.",
      },
    ],
  },
  features: {
    title: "Ce que Planory apporte aux aéroports",
    items: [
      "Génération SKYNET conforme aux repos et règles métier aéroportuaires",
      "Paramétrage par poste, qualification et type de quart",
      "Équité automatique sur nuits, week-ends et jours fériés",
      "Gestion des échanges et renforts sans repartir de zéro",
      "Workflow brouillon → validation → publication équipes",
      "Audit trail des règles appliquées — utile en environnement réglementé",
    ],
  },
  useCases: {
    title: "Cas d'usage",
    items: [
      {
        title: "Opérations piste / terminal",
        text: "Couverture 24/7, pics saisonniers et continuité des relèves.",
      },
      {
        title: "Sûreté aéroportuaire",
        text: "Postes critiques, habilitations et rotation équitable des créneaux sensibles.",
      },
      {
        title: "Handling et assistance",
        text: "Amplitude variable selon le programme de vols, absences et renforts.",
      },
      {
        title: "Organisations multi-sites",
        text: "Harmoniser les règles tout en gardant l'autonomie par plateforme.",
      },
    ],
  },
  faq: [
    {
      question: "Planory est-il adapté au planning aéroportuaire 24/7 ?",
      answer:
        "Oui. Planory cible les environnements réglementés à couverture continue : quarts, repos, qualifications et équité sont des contraintes de première classe dans SKYNET.",
    },
    {
      question: "Que signifie la référence pilote Orly ?",
      answer:
        "Un pilote est en cours à l'Aéroport de Paris-Orly. Il illustre le positionnement de Planory sur des plannings aéroportuaires complexes — sans remplacer votre SIRH ou GTA.",
    },
    {
      question: "Planory gère-t-il les incidents et remplacements ?",
      answer:
        "Oui. Les échanges et renforts se font sur une proposition déjà conforme : vous ajustez sans reconstruire le planning depuis un tableur.",
    },
    {
      question: "Planory remplace-t-il le SIRH ou la badgeuse ?",
      answer:
        "Non. Planory se concentre sur la planification opérationnelle. Il complète un SIRH / GTA : l'IA propose, le planificateur valide.",
    },
  ],
} as const;
