import type { Locale } from "@/lib/i18n";

/** 15 critères d'auto-diagnostic Excel vs logiciel — alignés sur le PDF */
export type ExcelDiagnosticCriterion = {
  id: string;
  category: string;
  label: string;
  weight: number;
};

const EXCEL_DIAGNOSTIC_CRITERIA_FR: ExcelDiagnosticCriterion[] = [
  { id: "c1", category: "Volume", label: "Plus de 30 agents planifiés", weight: 2 },
  { id: "c2", category: "Volume", label: "Horizon de planning supérieur à 4 semaines", weight: 1 },
  { id: "c3", category: "Complexité", label: "Environnement 24/7 (hôpital, aéroport, industrie…)", weight: 2 },
  { id: "c4", category: "Complexité", label: "Roulements alternés : 12h, 3×8 ou 2×8", weight: 2 },
  { id: "c5", category: "Complexité", label: "Astreintes ou gardes à modéliser", weight: 2 },
  { id: "c6", category: "Conformité", label: "Repos réglementaires vérifiés manuellement", weight: 2 },
  { id: "c7", category: "Conformité", label: "Équité nuits / week-ends à mesurer", weight: 2 },
  { id: "c8", category: "Conformité", label: "Erreur de formule déjà constatée", weight: 3 },
  { id: "c9", category: "Conformité", label: "Audit ou contrôle interne exigé", weight: 2 },
  { id: "c10", category: "Organisation", label: "Plusieurs versions du fichier en circulation", weight: 2 },
  { id: "c11", category: "Organisation", label: "Plus de 4 h par période pour ajuster le planning", weight: 2 },
  { id: "c12", category: "Organisation", label: "Pas de workflow brouillon → validation → publication", weight: 2 },
  { id: "c13", category: "Organisation", label: "Qualifications ou compétences multiples par poste", weight: 1 },
  { id: "c14", category: "Organisation", label: "Indisponibilités gérées dans un fichier séparé", weight: 1 },
  { id: "c15", category: "Organisation", label: "Besoin de simuler plusieurs scénarios rapidement", weight: 2 },
];

const EXCEL_DIAGNOSTIC_CRITERIA_EN: ExcelDiagnosticCriterion[] = [
  { id: "c1", category: "Volume", label: "More than 30 staff to schedule", weight: 2 },
  { id: "c2", category: "Volume", label: "Scheduling horizon longer than 4 weeks", weight: 1 },
  { id: "c3", category: "Complexity", label: "24/7 environment (hospital, airport, industry…)", weight: 2 },
  { id: "c4", category: "Complexity", label: "Rotating shifts: 12h, 3×8 or 2×8 patterns", weight: 2 },
  { id: "c5", category: "Complexity", label: "On-call duties or guard shifts to model", weight: 2 },
  { id: "c6", category: "Compliance", label: "Mandatory rest periods checked manually", weight: 2 },
  { id: "c7", category: "Compliance", label: "Night / weekend fairness to track and measure", weight: 2 },
  { id: "c8", category: "Compliance", label: "Formula error already identified", weight: 3 },
  { id: "c9", category: "Compliance", label: "Audit or internal control required", weight: 2 },
  { id: "c10", category: "Organisation", label: "Multiple file versions in circulation", weight: 2 },
  { id: "c11", category: "Organisation", label: "More than 4 hours per period to adjust the schedule", weight: 2 },
  { id: "c12", category: "Organisation", label: "No draft → validation → publish workflow", weight: 2 },
  { id: "c13", category: "Organisation", label: "Multiple qualifications or skills per post", weight: 1 },
  { id: "c14", category: "Organisation", label: "Unavailability tracked in a separate file", weight: 1 },
  { id: "c15", category: "Organisation", label: "Need to simulate several scenarios quickly", weight: 2 },
];

export const EXCEL_DIAGNOSTIC_CRITERIA = EXCEL_DIAGNOSTIC_CRITERIA_FR;

export const EXCEL_DIAGNOSTIC_MAX_SCORE = EXCEL_DIAGNOSTIC_CRITERIA_FR.reduce(
  (sum, c) => sum + c.weight,
  0,
);

export type ExcelDiagnosticZone = "green" | "orange" | "red";

const ZONE_LABELS = {
  fr: { green: "Zone verte", orange: "Zone orange", red: "Zone rouge" },
  en: { green: "Green zone", orange: "Amber zone", red: "Red zone" },
} as const;

const SCORE_MESSAGES = {
  fr: {
    green:
      "Zone verte : Excel peut encore suffire pour votre contexte actuel. Surveillez l'évolution des effectifs et des contraintes.",
    orange:
      "Zone orange : des signaux d'alerte apparaissent. Anticipez un passage logiciel avant que le tableur ne devienne un risque opérationnel.",
    red: "Zone rouge : Excel atteint probablement ses limites. Un logiciel de planification avec moteur de contraintes réduirait risques et temps passé.",
  },
  en: {
    green:
      "Green zone: Excel may still be enough for your current context. Monitor headcount growth and constraint complexity.",
    orange:
      "Amber zone: warning signs are appearing. Plan a move to scheduling software before the spreadsheet becomes an operational risk.",
    red: "Red zone: Excel is likely reaching its limits. Constraint-based scheduling software would reduce risk and time spent.",
  },
} as const;

export const EXCEL_DIAGNOSTIC_UI = {
  fr: {
    intro:
      "Cochez les critères qui s'appliquent à votre situation. Le score se calcule automatiquement.",
    points: "pt",
    pointsPlural: "pts",
  },
  en: {
    intro: "Check the criteria that apply to your situation. Your score updates automatically.",
    points: "pt",
    pointsPlural: "pts",
  },
} as const;

export function getExcelDiagnosticCriteria(locale: Locale = "fr") {
  return locale === "en" ? EXCEL_DIAGNOSTIC_CRITERIA_EN : EXCEL_DIAGNOSTIC_CRITERIA_FR;
}

export function getExcelDiagnosticUi(locale: Locale = "fr") {
  return EXCEL_DIAGNOSTIC_UI[locale];
}

export function getExcelDiagnosticZoneLabels(locale: Locale = "fr") {
  return ZONE_LABELS[locale];
}

export function scoreExcelDiagnostic(checkedIds: Set<string>, locale: Locale = "fr") {
  const criteria = getExcelDiagnosticCriteria(locale);
  const score = criteria.filter((c) => checkedIds.has(c.id)).reduce((sum, c) => sum + c.weight, 0);
  const maxScore = EXCEL_DIAGNOSTIC_MAX_SCORE;
  const percentage = Math.round((score / maxScore) * 100);

  let zone: ExcelDiagnosticZone;
  if (percentage <= 25) zone = "green";
  else if (percentage <= 55) zone = "orange";
  else zone = "red";

  return {
    score,
    maxScore,
    percentage,
    zone,
    message: SCORE_MESSAGES[locale][zone],
    zoneLabel: ZONE_LABELS[locale][zone],
  };
}
