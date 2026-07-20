import type { ResourceArticle } from "@/lib/resources";
import { annualisationTempsTravail } from "./annualisation-temps-travail";
import { gestionAstreintes } from "./gestion-astreintes";
import { logicielPlanningEquipe } from "./logiciel-planning-equipe";
import { planificationRh } from "./planification-rh";
import { planning12hHopital } from "./planning-12h-hopital";
import { planningExcelEquipe } from "./planning-excel-equipe";
import { planningHospitalier } from "./planning-hospitalier";
import { planningSocial } from "./planning-social";
import { planningMedical } from "./planning-medical";
import { planificationIndustrielle } from "./planification-industrielle";
import { travailNuitPlanning2x8 } from "./travail-nuit-planning-2x8";

export const ARTICLES_EN: ResourceArticle[] = [
  planningSocial,
  annualisationTempsTravail,
  logicielPlanningEquipe,
  planificationRh,
  gestionAstreintes,
  planningHospitalier,
  planningMedical,
  planning12hHopital,
  travailNuitPlanning2x8,
  planificationIndustrielle,
  planningExcelEquipe,
];
