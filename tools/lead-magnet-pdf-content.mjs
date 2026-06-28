/** Contenu partagé pour la génération PDF (tools/generate-lead-magnet-pdfs.mjs) */

export const EXCEL_DIAGNOSTIC_CRITERIA = [
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
