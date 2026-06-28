/** 15 critères d'auto-diagnostic Excel vs logiciel — alignés sur le PDF */
export type ExcelDiagnosticCriterion = {
  id: string;
  category: string;
  label: string;
  weight: number;
};

export const EXCEL_DIAGNOSTIC_CRITERIA: ExcelDiagnosticCriterion[] = [
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

export const EXCEL_DIAGNOSTIC_MAX_SCORE = EXCEL_DIAGNOSTIC_CRITERIA.reduce(
  (sum, c) => sum + c.weight,
  0,
);

export type ExcelDiagnosticZone = "green" | "orange" | "red";

export function scoreExcelDiagnostic(checkedIds: Set<string>): {
  score: number;
  maxScore: number;
  percentage: number;
  zone: ExcelDiagnosticZone;
  message: string;
} {
  const score = EXCEL_DIAGNOSTIC_CRITERIA.filter((c) => checkedIds.has(c.id)).reduce(
    (sum, c) => sum + c.weight,
    0,
  );
  const maxScore = EXCEL_DIAGNOSTIC_MAX_SCORE;
  const percentage = Math.round((score / maxScore) * 100);

  let zone: ExcelDiagnosticZone;
  let message: string;

  if (percentage <= 25) {
    zone = "green";
    message =
      "Zone verte : Excel peut encore suffire pour votre contexte actuel. Surveillez l'évolution des effectifs et des contraintes.";
  } else if (percentage <= 55) {
    zone = "orange";
    message =
      "Zone orange : des signaux d'alerte apparaissent. Anticipez un passage logiciel avant que le tableur ne devienne un risque opérationnel.";
  } else {
    zone = "red";
    message =
      "Zone rouge : Excel atteint probablement ses limites. Un logiciel de planification avec moteur de contraintes réduirait risques et temps passé.";
  }

  return { score, maxScore, percentage, zone, message };
}
