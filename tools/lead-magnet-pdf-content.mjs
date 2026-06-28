/** Contenu partagé pour la génération PDF (tools/generate-lead-magnet-pdfs.mjs) */

export const EXCEL_DIAGNOSTIC_CRITERIA_FR = [
  { category: "Volume", label: "Plus de 30 agents planifiés", weight: 2 },
  { category: "Volume", label: "Horizon de planning supérieur à 4 semaines", weight: 1 },
  { category: "Complexité", label: "Environnement 24/7 (hôpital, aéroport, industrie…)", weight: 2 },
  { category: "Complexité", label: "Roulements alternés : 12h, 3×8 ou 2×8", weight: 2 },
  { category: "Complexité", label: "Astreintes ou gardes à modéliser", weight: 2 },
  { category: "Conformité", label: "Repos réglementaires vérifiés manuellement", weight: 2 },
  { category: "Conformité", label: "Équité nuits / week-ends à mesurer", weight: 2 },
  { category: "Conformité", label: "Erreur de formule déjà constatée", weight: 3 },
  { category: "Conformité", label: "Audit ou contrôle interne exigé", weight: 2 },
  { category: "Organisation", label: "Plusieurs versions du fichier en circulation", weight: 2 },
  { category: "Organisation", label: "Plus de 4 h par période pour ajuster le planning", weight: 2 },
  { category: "Organisation", label: "Pas de workflow brouillon → validation → publication", weight: 2 },
  { category: "Organisation", label: "Qualifications ou compétences multiples par poste", weight: 1 },
  { category: "Organisation", label: "Indisponibilités gérées dans un fichier séparé", weight: 1 },
  { category: "Organisation", label: "Besoin de simuler plusieurs scénarios rapidement", weight: 2 },
];

export const EXCEL_DIAGNOSTIC_CRITERIA_EN = [
  { category: "Volume", label: "More than 30 staff to schedule", weight: 2 },
  { category: "Volume", label: "Scheduling horizon longer than 4 weeks", weight: 1 },
  { category: "Complexity", label: "24/7 environment (hospital, airport, industry…)", weight: 2 },
  { category: "Complexity", label: "Rotating shifts: 12h, 3×8 or 2×8 patterns", weight: 2 },
  { category: "Complexity", label: "On-call duties or guard shifts to model", weight: 2 },
  { category: "Compliance", label: "Mandatory rest periods checked manually", weight: 2 },
  { category: "Compliance", label: "Night / weekend fairness to track and measure", weight: 2 },
  { category: "Compliance", label: "Formula error already identified", weight: 3 },
  { category: "Compliance", label: "Audit or internal control required", weight: 2 },
  { category: "Organisation", label: "Multiple file versions in circulation", weight: 2 },
  { category: "Organisation", label: "More than 4 hours per period to adjust the schedule", weight: 2 },
  { category: "Organisation", label: "No draft → validation → publish workflow", weight: 2 },
  { category: "Organisation", label: "Multiple qualifications or skills per post", weight: 1 },
  { category: "Organisation", label: "Unavailability tracked in a separate file", weight: 1 },
  { category: "Organisation", label: "Need to simulate several scenarios quickly", weight: 2 },
];

/** @deprecated use EXCEL_DIAGNOSTIC_CRITERIA_FR */
export const EXCEL_DIAGNOSTIC_CRITERIA = EXCEL_DIAGNOSTIC_CRITERIA_FR;

export const EXCEL_PDF_COPY = {
  fr: {
    title: "Grille d'auto-diagnostic",
    subtitle: "Excel vs logiciel de planning 24/7",
    intro:
      "Cochez chaque critère qui s'applique à votre situation. Additionnez les points (indiqués entre parenthèses) pour obtenir votre score.",
    interpretation: "Interprétation du score",
    zones: [
      "0–25 % : Zone verte — Excel peut suffire pour l'instant.",
      "26–55 % : Zone orange — Anticipez un passage logiciel.",
      "56–100 % : Zone rouge — Excel atteint probablement ses limites.",
    ],
    outro:
      "Planory génère des propositions de planning conformes en moins de 2 minutes avec le moteur IA SKYNET. Échangez 20 min avec nous : contact@planory.net",
    pt: "pt",
    pts: "pts",
  },
  en: {
    title: "Self-assessment grid",
    subtitle: "Excel vs 24/7 scheduling software",
    intro:
      "Check each criterion that applies to your situation. Add up the points (shown in brackets) to get your score.",
    interpretation: "Score interpretation",
    zones: [
      "0–25%: Green zone — Excel may still be enough for now.",
      "26–55%: Amber zone — Plan a move to scheduling software.",
      "56–100%: Red zone — Excel is likely reaching its limits.",
    ],
    outro:
      "Planory generates compliant schedule proposals in under 2 minutes with the SKYNET AI engine. Book a 20-min call: contact@planory.net",
    pt: "pt",
    pts: "pts",
  },
};
