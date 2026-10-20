/**
 * EHPAD prospect list built from the ANS FINESS open-data flows
 * (« FINESS - Structures » and « FINESS - Activités » on data.gouv.fr).
 * Codes come from the SMT terminologies referenced by the flow JSON schemas.
 */

export type StatutCategorie = "public" | "prive_non_lucratif" | "prive_commercial" | "autre";

export type EhpadLead = {
  finess: string;
  nom: string;
  adresse: string;
  codePostal: string;
  commune: string;
  codeCommune: string;
  departement: string;
  region: string;
  telephone: string;
  email: string;
  statutCategorie: StatutCategorie;
  statutJuridiqueCode: string;
  statutJuridique: string;
  gestionnaireNom: string;
  gestionnaireFiness: string;
  gestionnaireSiren: string;
  gestionnaireTelephone: string;
  ght: string;
  capacite: number;
  litsPermanents: number;
  litsTemporaires: number;
  placesAccueilJour: number;
  pasa: boolean;
  uhr: boolean;
  dateOuverture: string;
  siret: string;
  latitude: string;
  longitude: string;
};

export type EhpadCapacity = Pick<EhpadLead, "litsPermanents" | "litsTemporaires" | "placesAccueilJour" | "pasa" | "uhr">;

export type EhpadLeadFilters = {
  regions?: string[];
  departements?: string[];
  statuts?: StatutCategorie[];
  /** Substring of the legal entity name, or its exact FINESS / SIREN number. */
  gestionnaire?: string;
  /** Substring of the establishment or legal entity name (group brands such as « Korian » live there). */
  search?: string;
  capaciteMin?: number;
  capaciteMax?: number;
};

export type GhtIndex = { byPm: Map<string, string>; byEge: Map<string, string> };

export type GestionnaireSummary = {
  gestionnaireFiness: string;
  gestionnaireNom: string;
  gestionnaireSiren: string;
  statutCategorie: StatutCategorie;
  nbEhpad: number;
  capaciteTotale: number;
  regions: string[];
  departements: string[];
};

/* ---------- referentials ---------- */

/** TRE-R397: « Etablissement d'hébergement pour personnes âgées dépendantes ». */
const EHPAD_CATEGORY = "500";

/** TRE-R401 social activities. PASA (961) and UHR (962) units sit inside the existing beds. */
const ACTIVITY_PERMANENT = "924";
const ACTIVITY_TEMPORARY = "657";
const ACTIVITY_PASA = "961";
const ACTIVITY_UHR = "962";

/** TRE-R404 operating modes. */
const MODE_FULL_TIME = "11";
const MODE_DAY_CARE = "21";

/** TRE-R330: installed capacity. */
const CAPACITY_INSTALLED = "08";

/** TRE-R371: Groupement Hospitalier de Territoire. */
const GCC_TYPE_GHT = "001";

const FINESS_PATTERN = /^[A-Za-z0-9]{9}$/;

/** TRE-R400 leaf codes with their label and level-2 parent (1xxx public, 2100 non-profit, 2200 commercial). */
const STATUTS_JURIDIQUES: Record<string, [label: string, categorie: StatutCategorie]> = {
  "01": ["Etat", "public"],
  "02": ["Département", "public"],
  "03": ["Commune", "public"],
  "04": ["Région", "public"],
  "05": ["Territoire d'Outre Mer", "public"],
  "06": ["Autre Collectivité Territoriale", "public"],
  "07": ["Métropole ou pôle métropolitain", "public"],
  "08": ["Centre Intercommunal d'Action Sociale", "public"],
  "10": ["Etablissement Public National d'Hospitalisation", "public"],
  "11": ["Etablissement Public Départemental d'Hospitalisation", "public"],
  "12": ["Etablissement Public Interdépartemental d'Hospitalisation", "public"],
  "13": ["Etablissement Public Communal d'Hospitalisation", "public"],
  "14": ["Etablissement Public Intercommunal d'Hospitalisation", "public"],
  "15": ["Etablissement Public Régional d'Hospitalisation", "public"],
  "16": ["Syndicat Inter Hospitalier", "public"],
  "17": ["Centre Communal d'Action Sociale", "public"],
  "18": ["Etablissement Social et Médico-Social National", "public"],
  "19": ["Etablissement Social et Médico-Social Départemental", "public"],
  "20": ["Etablissement Social et Médico-Social Interdépartemental", "public"],
  "21": ["Etablissement Social et Médico-Social Communal", "public"],
  "22": ["Etablissement Social et Médico-Social Intercommunal", "public"],
  "23": ["Etablissement Social et Médico-Social Régional", "public"],
  "24": ["Office Public d'H.L.M.", "public"],
  "25": ["Caisse des Ecoles", "public"],
  "26": ["Autre Etablissement Public à Caractère Administratif", "public"],
  "27": ["Etablissement Public à Caractère Industriel ou Commercial", "public"],
  "28": ["Groupement d'Intérêt Public (G.I.P.)", "public"],
  "29": ["Groupement de Coopération Sanitaire public", "public"],
  "30": ["Groupement de Coopération Sociale ou Médico-Sociale public", "public"],
  "40": ["Régime Général de Sécurité Sociale", "prive_non_lucratif"],
  "41": ["Régime Spécial de Sécurité Sociale", "prive_non_lucratif"],
  "42": ["Institution de Prévoyance", "prive_non_lucratif"],
  "43": ["Mutualité Sociale Agricole (M.S.A.)", "prive_non_lucratif"],
  "44": ["Régime Maladie des non Salariés non Agricole", "prive_non_lucratif"],
  "45": ["Régime Vieillesse Particulier", "prive_non_lucratif"],
  "46": ["Autre Régime de Prévoyance Sociale", "prive_non_lucratif"],
  "47": ["Société Mutualiste", "prive_non_lucratif"],
  "48": ["Assurance Mutuelle Agricole", "prive_non_lucratif"],
  "49": ["Autre Organisme Mutualiste", "prive_non_lucratif"],
  "50": ["Comité d'Entreprise ou Comité d'Etablissement", "prive_non_lucratif"],
  "51": ["Syndicat", "prive_non_lucratif"],
  "52": ["Syndicat de Propriétaires", "prive_non_lucratif"],
  "60": ["Association Loi 1901 non Reconnue d'Utilité Publique", "prive_non_lucratif"],
  "61": ["Association Loi 1901 Reconnue d'Utilité Publique", "prive_non_lucratif"],
  "62": ["Association de Droit Local", "prive_non_lucratif"],
  "63": ["Fondation", "prive_non_lucratif"],
  "64": ["Congrégation", "prive_non_lucratif"],
  "65": ["Autre Organisme Privé à But non Lucratif", "prive_non_lucratif"],
  "66": ["Groupement de Coopération Sociale ou Médico-Sociale privé", "prive_non_lucratif"],
  "89": ["Groupement de Coopération Sanitaire Privé", "prive_non_lucratif"],
  "70": ["Personne Physique", "prive_commercial"],
  "71": ["Société en Nom Collectif (S.N.C.)", "prive_commercial"],
  "72": ["Société A Responsabilité Limitée (S.A.R.L.)", "prive_commercial"],
  "73": ["Société Anonyme (S.A.)", "prive_commercial"],
  "74": ["Société Civile", "prive_commercial"],
  "75": ["Autre Société", "prive_commercial"],
  "76": ["Groupement d'Intérêt Economique (G.I.E.)", "prive_commercial"],
  "77": ["Autre Organisme Privé à Caractère Commercial", "prive_commercial"],
  "78": ["Entreprise Unipersonnelle Responsabilité Limitée (E.U.R.L.)", "prive_commercial"],
  "79": ["Société Civile de Moyens (S.C.M.)", "prive_commercial"],
  "80": ["Société Interprofessionnelle Soins Ambulatoires (S.I.S.A.)", "prive_commercial"],
  "85": ["Soc. Exercice Libéral Responsabilité Limitée (S.E.L.A.R.L.)", "prive_commercial"],
  "86": ["Société d'Exercice Libéral à Forme Anonyme (S.E.L.A.F.A.)", "prive_commercial"],
  "87": ["Société Exercice Libéral Commandite par Actions (S.E.L.C.A.)", "prive_commercial"],
  "88": ["Société Civile Professionnelle (S.C.P.)", "prive_commercial"],
  "91": ["Société Exercice Libéral par Actions Simplifiée (S.E.L.A.S.)", "prive_commercial"],
  "93": ["Société en commandite", "prive_commercial"],
  "95": ["Société par Actions Simplifiée (S.A.S.)", "prive_commercial"],
  "100": ["Société d'exercice libéral à responsabilité limitée unipersonnelle (SELURL)", "prive_commercial"],
  "101": ["Société d'exercice libéral par actions simplifiée (SELAS)", "prive_commercial"],
  "102": ["Société d'exercice libéral par actions simplifiée unipersonnelle (SELASU)", "prive_commercial"],
  "103": ["Société en commandite simple (SCS)", "prive_commercial"],
  "104": ["Société en commandite par actions (SCA)", "prive_commercial"],
  "105": ["Société par actions simplifiée (SAS)", "prive_commercial"],
  "106": ["Société anonyme à directoire (SADI)", "prive_commercial"],
  "107": ["Société Anonyme à conseil d'administration (SACA)", "prive_commercial"],
  "110": ["Société en participation (SEP)", "prive_commercial"],
  "90": ["Organisme de Droit Etranger", "autre"],
  "000": ["En cours de vérification", "autre"],
};

const REGION_DEPARTEMENTS: Record<string, { code: string; departements: string[] }> = {
  "Auvergne-Rhône-Alpes": { code: "84", departements: ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"] },
  "Bourgogne-Franche-Comté": { code: "27", departements: ["21", "25", "39", "58", "70", "71", "89", "90"] },
  Bretagne: { code: "53", departements: ["22", "29", "35", "56"] },
  "Centre-Val de Loire": { code: "24", departements: ["18", "28", "36", "37", "41", "45"] },
  Corse: { code: "94", departements: ["2A", "2B"] },
  "Grand Est": { code: "44", departements: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"] },
  "Hauts-de-France": { code: "32", departements: ["02", "59", "60", "62", "80"] },
  "Île-de-France": { code: "11", departements: ["75", "77", "78", "91", "92", "93", "94", "95"] },
  Normandie: { code: "28", departements: ["14", "27", "50", "61", "76"] },
  "Nouvelle-Aquitaine": { code: "75", departements: ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"] },
  Occitanie: { code: "76", departements: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"] },
  "Pays de la Loire": { code: "52", departements: ["44", "49", "53", "72", "85"] },
  "Provence-Alpes-Côte d'Azur": { code: "93", departements: ["04", "05", "06", "13", "83", "84"] },
  Guadeloupe: { code: "01", departements: ["971"] },
  Martinique: { code: "02", departements: ["972"] },
  Guyane: { code: "03", departements: ["973"] },
  "La Réunion": { code: "04", departements: ["974"] },
  Mayotte: { code: "06", departements: ["976"] },
};

export const FRENCH_REGIONS: readonly string[] = Object.keys(REGION_DEPARTEMENTS);

const REGION_BY_DEPARTEMENT = new Map(
  Object.entries(REGION_DEPARTEMENTS).flatMap(([region, { departements }]) => departements.map((d) => [d, region] as const)),
);

const STATUT_ALIASES: Record<string, StatutCategorie> = {
  public: "public",
  prive_non_lucratif: "prive_non_lucratif",
  non_lucratif: "prive_non_lucratif",
  associatif: "prive_non_lucratif",
  prive_commercial: "prive_commercial",
  commercial: "prive_commercial",
  lucratif: "prive_commercial",
};

/* ---------- small helpers ---------- */

type Json = Record<string, unknown>;

const isObject = (value: unknown): value is Json => typeof value === "object" && value !== null && !Array.isArray(value);
const obj = (value: unknown): Json => (isObject(value) ? value : {});
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const text = (value: unknown): string =>
  typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeDepartement(value: string): string {
  const upper = value.trim().toUpperCase();
  return /^\d$/.test(upper) ? `0${upper}` : upper;
}

function toNonNegativeInt(value: unknown): number {
  const parsed = Number.parseInt(text(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function firstTelecom(contacts: unknown, key: "telephone" | "courriel"): string {
  for (const contact of list(contacts)) {
    const value = text(obj(obj(contact).telecom)[key]);
    if (value) return value;
  }
  return "";
}

/* ---------- referential lookups ---------- */

export function classifyStatutJuridique(code: string): StatutCategorie {
  return STATUTS_JURIDIQUES[code.trim()]?.[1] ?? "autre";
}

export function statutJuridiqueLabel(code: string): string {
  return STATUTS_JURIDIQUES[code.trim()]?.[0] ?? "";
}

export function parseStatutCategorie(input: string): StatutCategorie | null {
  return STATUT_ALIASES[normalizeText(input).replace(/ /g, "_")] ?? null;
}

export function departementFromCommune(codeCommune: string): string {
  const code = codeCommune.trim().toUpperCase();
  if (!code) return "";
  return code.startsWith("97") || code.startsWith("98") ? code.slice(0, 3) : code.slice(0, 2);
}

export function regionFromDepartement(departement: string): string {
  return REGION_BY_DEPARTEMENT.get(normalizeDepartement(departement)) ?? "";
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (/^0\d{9}$/.test(digits)) return digits.replace(/(\d{2})(?=\d)/g, "$1 ");
  return raw.trim();
}

/* ---------- FINESS « Structures » ---------- */

export function indexGhtMembership(gccItems: unknown[]): GhtIndex {
  const index: GhtIndex = { byPm: new Map(), byEge: new Map() };
  for (const item of gccItems) {
    const gcc = obj(item);
    const name = text(gcc.nomGcc);
    if (text(gcc.typeGcc) !== GCC_TYPE_GHT || text(gcc.etatObjet) !== "A" || !name) continue;
    for (const member of list(gcc.pmejDuGcc)) {
      const id = text(obj(member).pmSmsseId);
      if (id && !index.byPm.has(id)) index.byPm.set(id, name);
    }
    for (const member of list(gcc.egeDuGcc)) {
      const id = text(obj(member).egeId);
      if (id && !index.byEge.has(id)) index.byEge.set(id, name);
    }
  }
  return index;
}

function pickAddress(addresses: unknown): Json {
  const candidates = list(addresses).filter(isObject);
  return candidates.find((a) => text(a.usageAdresse) === "03") ?? candidates[0] ?? {};
}

function formatStreet(address: Json): string {
  const street =
    text(address.ligneQuatre) ||
    [address.numeroVoie, address.typeVoie, address.libelleVoie].map(text).filter(Boolean).join(" ");
  return [text(address.ligneTrois), street, text(address.lieuDit)].filter(Boolean).join(", ");
}

export function extractEhpadsFromPmej(pmej: unknown, ght?: GhtIndex): EhpadLead[] {
  if (!isObject(pmej)) return [];
  const pm = obj(pmej.informationsGeneralesPMEJ);
  const statutCode = text(pm.statutJuridique);
  const pmGht = ght?.byPm.get(text(pm.pmSmsseId)) ?? "";
  const leads: EhpadLead[] = [];

  for (const item of list(pmej.ege)) {
    const ege = obj(item);
    const info = obj(ege.informationsGeneralesEGE);
    const finess = text(info.numFinessEge);
    if (
      text(ege.categorieentiteGeographiqueExercice) !== EHPAD_CATEGORY ||
      text(ege.etatObjet) !== "A" ||
      text(info.dateFermeture) ||
      !FINESS_PATTERN.test(finess)
    ) {
      continue;
    }

    const address = pickAddress(ege.adresse);
    const codeCommune = text(address.cogCommune);
    const departement = departementFromCommune(codeCommune);
    const coordinates = obj(address.coordonneesGeographique);

    leads.push({
      finess,
      nom: text(info.nomEgeLong) || text(info.nomEgeCourt),
      adresse: formatStreet(address),
      codePostal: text(address.codePostal),
      commune: text(address.ligneAcheminement),
      codeCommune,
      departement,
      region: regionFromDepartement(departement),
      telephone: formatPhone(firstTelecom(ege.contact, "telephone")),
      email: firstTelecom(ege.contact, "courriel"),
      statutCategorie: classifyStatutJuridique(statutCode),
      statutJuridiqueCode: statutCode,
      statutJuridique: statutJuridiqueLabel(statutCode),
      gestionnaireNom: text(pm.denominationLonguePmSmsse) || text(pm.denominationPm),
      gestionnaireFiness: text(pm.numFinessPm),
      gestionnaireSiren: text(pm.siren),
      gestionnaireTelephone: formatPhone(firstTelecom(pmej.contact, "telephone")),
      ght: ght?.byEge.get(text(info.egeId)) ?? pmGht,
      capacite: 0,
      litsPermanents: 0,
      litsTemporaires: 0,
      placesAccueilJour: 0,
      pasa: false,
      uhr: false,
      dateOuverture: text(info.dateOuverture),
      siret: text(info.siret),
      latitude: text(coordinates.directionLatitude),
      longitude: text(coordinates.directionLongitude),
    });
  }
  return leads;
}

/* ---------- FINESS « Activités » ---------- */

/** Installed capacity without any granularity (financing, habilitation, housing type, gender). */
function installedTotalCapacity(capacities: unknown): number {
  let total = 0;
  for (const item of list(capacities)) {
    const capacity = obj(item);
    if (text(capacity.statutCapacite) !== CAPACITY_INSTALLED) continue;
    if (text(capacity.modeFinancement) || text(capacity.habilitation) || text(capacity.typeLogement) || text(capacity.genre)) {
      continue;
    }
    total += toNonNegativeInt(capacity.nombre);
  }
  return total;
}

export function computeEhpadCapacities(activitesPmej: unknown): Map<string, EhpadCapacity> {
  const capacities = new Map<string, EhpadCapacity>();

  for (const item of list(obj(activitesPmej).ege)) {
    const ege = obj(item);
    const finess = text(ege.numFinessEge);
    if (!finess) continue;

    for (const activityItem of list(ege.activitesExercees)) {
      const activity = obj(activityItem);
      if (text(obj(activity.caracteristiquesGeneriques).etatObjet) !== "A") continue;
      const type = obj(obj(obj(activity.nature).caracteristiquesSpecifiques).typeActiviteAMSR);
      const code = text(type.activiteSocialeRegulee);
      const mode = text(type.modeFonctionnement);
      if (![ACTIVITY_PERMANENT, ACTIVITY_TEMPORARY, ACTIVITY_PASA, ACTIVITY_UHR].includes(code)) continue;

      const capacity = capacities.get(finess) ?? {
        litsPermanents: 0,
        litsTemporaires: 0,
        placesAccueilJour: 0,
        pasa: false,
        uhr: false,
      };
      capacities.set(finess, capacity);

      if (code === ACTIVITY_PASA) capacity.pasa = true;
      else if (code === ACTIVITY_UHR) capacity.uhr = true;
      else if (mode === MODE_DAY_CARE) capacity.placesAccueilJour += installedTotalCapacity(activity.capacite);
      else if (mode === MODE_FULL_TIME && code === ACTIVITY_PERMANENT) {
        capacity.litsPermanents += installedTotalCapacity(activity.capacite);
      } else if (mode === MODE_FULL_TIME) capacity.litsTemporaires += installedTotalCapacity(activity.capacite);
    }
  }
  return capacities;
}

export function applyCapacities(leads: EhpadLead[], capacities: Map<string, EhpadCapacity>): EhpadLead[] {
  return leads.map((lead) => {
    const capacity = capacities.get(lead.finess) ?? {
      litsPermanents: 0,
      litsTemporaires: 0,
      placesAccueilJour: 0,
      pasa: false,
      uhr: false,
    };
    return { ...lead, ...capacity, capacite: capacity.litsPermanents + capacity.litsTemporaires };
  });
}

/* ---------- filtering ---------- */

export function matchesEhpadFilters(lead: EhpadLead, filters: EhpadLeadFilters): boolean {
  const { regions, departements, statuts, gestionnaire, search, capaciteMin, capaciteMax } = filters;

  if (regions?.length) {
    const regionCode = REGION_DEPARTEMENTS[lead.region]?.code;
    const regionName = normalizeText(lead.region);
    if (!regions.some((r) => normalizeText(r) === regionName || r.trim() === regionCode)) return false;
  }
  if (departements?.length && !departements.some((d) => normalizeDepartement(d) === lead.departement)) return false;
  if (statuts?.length && !statuts.includes(lead.statutCategorie)) return false;
  if (gestionnaire?.trim()) {
    const query = gestionnaire.trim();
    const byName = normalizeText(lead.gestionnaireNom).includes(normalizeText(query));
    if (!byName && query !== lead.gestionnaireFiness && query !== lead.gestionnaireSiren) return false;
  }
  if (search?.trim() && !normalizeText(`${lead.nom} ${lead.gestionnaireNom}`).includes(normalizeText(search))) {
    return false;
  }
  if (capaciteMin !== undefined && lead.capacite < capaciteMin) return false;
  if (capaciteMax !== undefined && lead.capacite > capaciteMax) return false;
  return true;
}

export function filterEhpadLeads(leads: EhpadLead[], filters: EhpadLeadFilters): EhpadLead[] {
  const seen = new Set<string>();
  const result: EhpadLead[] = [];
  for (const lead of leads) {
    if (seen.has(lead.finess)) continue;
    seen.add(lead.finess);
    if (matchesEhpadFilters(lead, filters)) result.push(lead);
  }
  return result;
}

/* ---------- outputs ---------- */

export function toCsv(rows: string[][], separator = ";"): string {
  const escape = (cell: string) =>
    cell.includes(separator) || /["\r\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
  return rows.map((row) => row.map(escape).join(separator)).join("\r\n") + "\r\n";
}

const yesNo = (value: boolean) => (value ? "oui" : "non");

export const EHPAD_CSV_COLUMNS: { header: string; value: (lead: EhpadLead) => string }[] = [
  { header: "finess_et", value: (l) => l.finess },
  { header: "nom", value: (l) => l.nom },
  { header: "adresse", value: (l) => l.adresse },
  { header: "code_postal", value: (l) => l.codePostal },
  { header: "commune", value: (l) => l.commune },
  { header: "departement", value: (l) => l.departement },
  { header: "region", value: (l) => l.region },
  { header: "telephone", value: (l) => l.telephone },
  { header: "email", value: (l) => l.email },
  { header: "statut", value: (l) => l.statutCategorie },
  { header: "statut_juridique", value: (l) => l.statutJuridique },
  { header: "gestionnaire", value: (l) => l.gestionnaireNom },
  { header: "gestionnaire_finess", value: (l) => l.gestionnaireFiness },
  { header: "gestionnaire_siren", value: (l) => l.gestionnaireSiren },
  { header: "gestionnaire_telephone", value: (l) => l.gestionnaireTelephone },
  { header: "ght", value: (l) => l.ght },
  { header: "capacite", value: (l) => String(l.capacite) },
  { header: "lits_permanents", value: (l) => String(l.litsPermanents) },
  { header: "lits_temporaires", value: (l) => String(l.litsTemporaires) },
  { header: "places_accueil_jour", value: (l) => String(l.placesAccueilJour) },
  { header: "pasa", value: (l) => yesNo(l.pasa) },
  { header: "uhr", value: (l) => yesNo(l.uhr) },
  { header: "date_ouverture", value: (l) => l.dateOuverture },
  { header: "siret", value: (l) => l.siret },
  { header: "latitude", value: (l) => l.latitude },
  { header: "longitude", value: (l) => l.longitude },
  { header: "code_commune", value: (l) => l.codeCommune },
];

export function ehpadLeadsToCsv(leads: EhpadLead[]): string {
  return toCsv([EHPAD_CSV_COLUMNS.map((c) => c.header), ...leads.map((l) => EHPAD_CSV_COLUMNS.map((c) => c.value(l)))]);
}

export function aggregateByGestionnaire(leads: EhpadLead[]): GestionnaireSummary[] {
  const groups = new Map<string, GestionnaireSummary & { regionSet: Set<string>; departementSet: Set<string> }>();

  for (const lead of leads) {
    const key = lead.gestionnaireFiness || lead.gestionnaireNom;
    const group = groups.get(key) ?? {
      gestionnaireFiness: lead.gestionnaireFiness,
      gestionnaireNom: lead.gestionnaireNom,
      gestionnaireSiren: lead.gestionnaireSiren,
      statutCategorie: lead.statutCategorie,
      nbEhpad: 0,
      capaciteTotale: 0,
      regions: [],
      departements: [],
      regionSet: new Set<string>(),
      departementSet: new Set<string>(),
    };
    group.nbEhpad += 1;
    group.capaciteTotale += lead.capacite;
    if (lead.region) group.regionSet.add(lead.region);
    if (lead.departement) group.departementSet.add(lead.departement);
    groups.set(key, group);
  }

  return [...groups.values()]
    .map(({ regionSet, departementSet, ...group }) => ({
      ...group,
      regions: [...regionSet].sort((a, b) => a.localeCompare(b, "fr")),
      departements: [...departementSet].sort(),
    }))
    .sort(
      (a, b) =>
        b.capaciteTotale - a.capaciteTotale ||
        b.nbEhpad - a.nbEhpad ||
        a.gestionnaireNom.localeCompare(b.gestionnaireNom, "fr"),
    );
}

export function gestionnairesToCsv(groups: GestionnaireSummary[]): string {
  return toCsv([
    ["gestionnaire", "gestionnaire_finess", "gestionnaire_siren", "statut", "nb_ehpad", "capacite_totale", "regions", "departements"],
    ...groups.map((g) => [
      g.gestionnaireNom,
      g.gestionnaireFiness,
      g.gestionnaireSiren,
      g.statutCategorie,
      String(g.nbEhpad),
      String(g.capaciteTotale),
      g.regions.join(", "),
      g.departements.join(", "),
    ]),
  ]);
}
