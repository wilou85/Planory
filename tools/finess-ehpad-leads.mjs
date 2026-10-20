/**
 * Génère la base de prospection EHPAD à partir des flux open data FINESS (ANS, data.gouv.fr) :
 *   - « FINESS - Structures » : établissements, gestionnaires (entités juridiques), contacts, GHT
 *   - « FINESS - Activités »  : capacités installées (lits permanents / temporaires, accueil de jour, PASA, UHR)
 *
 * Usage :
 *   npm run leads:ehpad
 *   npm run leads:ehpad -- --region "Île-de-France" --statut commercial --capacite-min 60
 *   npm run leads:ehpad -- --departement 69,01 --statut public --statut associatif
 *   npm run leads:ehpad -- --search korian
 * Sous PowerShell, npm avale le « -- » : écrire  npm run leads:ehpad '--' --region Bretagne
 *
 * Options (répétables ou séparées par des virgules) :
 *   --region <nom|code>        ex. "Bretagne", "ile-de-france", 84
 *   --departement <code>       ex. 69, 2A, 974
 *   --statut <statut>          public | associatif (prive_non_lucratif) | commercial (prive_commercial)
 *   --gestionnaire <texte>     nom de l'entité juridique, ou son n° FINESS / SIREN
 *   --search <texte>           nom de l'établissement ou du gestionnaire (marques de groupe : Korian, DomusVi…)
 *   --capacite-min <n>         lits (permanents + temporaires)
 *   --capacite-max <n>
 *   --out <dossier>            défaut : tools/leads-out
 *   --refresh                  retélécharge les flux même s'ils sont en cache (tools/leads-out/cache)
 */
import { createReadStream, createWriteStream, existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { createGunzip } from "node:zlib";
import { createJsonArrayItemSplitter } from "../src/lib/leads/json-array-stream.ts";
import {
  aggregateByGestionnaire,
  applyCapacities,
  computeEhpadCapacities,
  ehpadLeadsToCsv,
  extractEhpadsFromPmej,
  filterEhpadLeads,
  gestionnairesToCsv,
  indexGhtMembership,
  parseStatutCategorie,
} from "../src/lib/leads/finess-ehpad.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, "leads-out", "cache");
const DATASETS = {
  structures: "finess-structures-1",
  activites: "finess-activites-1",
};
const UTF8_BOM = "\uFEFF";

const { values: args } = parseArgs({
  options: {
    region: { type: "string", multiple: true },
    departement: { type: "string", multiple: true },
    statut: { type: "string", multiple: true },
    gestionnaire: { type: "string" },
    search: { type: "string" },
    "capacite-min": { type: "string" },
    "capacite-max": { type: "string" },
    out: { type: "string", default: join(__dirname, "leads-out") },
    refresh: { type: "boolean", default: false },
  },
});

const splitList = (values) => (values ?? []).flatMap((v) => v.split(",")).map((v) => v.trim()).filter(Boolean);

function parseInteger(name, value) {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`--${name} doit être un entier positif (reçu « ${value} »)`);
  return parsed;
}

function buildFilters() {
  const statuts = splitList(args.statut).map((s) => {
    const parsed = parseStatutCategorie(s);
    if (!parsed) throw new Error(`--statut inconnu « ${s} » (public | associatif | commercial)`);
    return parsed;
  });
  return {
    regions: splitList(args.region),
    departements: splitList(args.departement),
    statuts,
    gestionnaire: args.gestionnaire,
    search: args.search,
    capaciteMin: parseInteger("capacite-min", args["capacite-min"]),
    capaciteMax: parseInteger("capacite-max", args["capacite-max"]),
  };
}

async function latestDailyResource(datasetSlug) {
  const res = await fetch(`https://www.data.gouv.fr/api/1/datasets/${datasetSlug}/`);
  if (!res.ok) throw new Error(`data.gouv.fr ${datasetSlug} : HTTP ${res.status}`);
  const dataset = await res.json();
  const resources = dataset.resources
    .filter((r) => r.title.endsWith(".json.gz"))
    .sort((a, b) => b.last_modified.localeCompare(a.last_modified));
  const resource = resources.find((r) => r.title.includes("journalier")) ?? resources[0];
  if (!resource) throw new Error(`Aucune ressource JSON dans ${datasetSlug}`);
  return { title: resource.title, url: resource.url };
}

async function download(resource, cacheDir) {
  const target = join(cacheDir, resource.title);
  if (existsSync(target) && !args.refresh) {
    console.log(`  cache : ${resource.title}`);
    return target;
  }
  console.log(`  téléchargement : ${resource.title}`);
  const res = await fetch(resource.url);
  if (!res.ok || !res.body) throw new Error(`Téléchargement impossible ${resource.url} : HTTP ${res.status}`);
  const partial = `${target}.part`;
  await pipeline(Readable.fromWeb(res.body), createWriteStream(partial));
  renameSync(partial, target);
  return target;
}

async function streamArrays(file, keys, onItem) {
  const splitters = keys.map((key) => [key, createJsonArrayItemSplitter(key)]);
  const stream = createReadStream(file).pipe(createGunzip());
  stream.setEncoding("utf8");
  for await (const chunk of stream) {
    for (const [key, splitter] of splitters) for (const item of splitter.push(chunk)) onItem(key, item);
  }
  for (const [, splitter] of splitters) splitter.end();
}

function hasEhpad(pmej) {
  return Array.isArray(pmej?.ege) && pmej.ege.some((e) => e?.categorieentiteGeographiqueExercice === "500");
}

function countBy(items, key) {
  const counts = new Map();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

async function main() {
  const filters = buildFilters();
  mkdirSync(CACHE_DIR, { recursive: true });
  mkdirSync(args.out, { recursive: true });

  console.log("1/4 Flux FINESS (data.gouv.fr)");
  const structuresFile = await download(await latestDailyResource(DATASETS.structures), CACHE_DIR);
  const activitesFile = await download(await latestDailyResource(DATASETS.activites), CACHE_DIR);

  console.log("2/4 Lecture des structures (EHPAD, gestionnaires, GHT)");
  const gcc = [];
  const ehpadPmej = [];
  await streamArrays(structuresFile, ["gcc", "pmej"], (key, item) => {
    if (key === "gcc") gcc.push(item);
    else if (hasEhpad(item)) ehpadPmej.push(item);
  });
  const ght = indexGhtMembership(gcc);
  const structures = ehpadPmej.flatMap((pmej) => extractEhpadsFromPmej(pmej, ght));
  const ehpadFiness = new Set(structures.map((l) => l.finess));

  console.log("3/4 Lecture des activités (capacités installées)");
  const capacities = new Map();
  await streamArrays(activitesFile, ["pmej"], (_key, pmej) => {
    for (const [finess, capacity] of computeEhpadCapacities(pmej)) {
      if (ehpadFiness.has(finess)) capacities.set(finess, capacity);
    }
  });

  const allLeads = applyCapacities(structures, capacities);
  const leads = filterEhpadLeads(allLeads, filters).sort(
    (a, b) => a.region.localeCompare(b.region, "fr") || a.departement.localeCompare(b.departement) || b.capacite - a.capacite,
  );
  const gestionnaires = aggregateByGestionnaire(leads);

  console.log("4/4 Écriture des CSV");
  const leadsFile = join(args.out, "ehpad-leads.csv");
  const gestionnairesFile = join(args.out, "ehpad-gestionnaires.csv");
  writeFileSync(leadsFile, UTF8_BOM + ehpadLeadsToCsv(leads), "utf8");
  writeFileSync(gestionnairesFile, UTF8_BOM + gestionnairesToCsv(gestionnaires), "utf8");

  const withoutCapacity = leads.filter((l) => l.capacite === 0).length;
  console.log(`\n${leads.length} EHPAD retenus sur ${allLeads.length} actifs, ${gestionnaires.length} gestionnaires`);
  console.log(`  capacité totale : ${leads.reduce((s, l) => s + l.capacite, 0)} lits (${withoutCapacity} EHPAD sans capacité renseignée)`);
  console.log(`  statuts : ${countBy(leads, (l) => l.statutCategorie).map(([k, v]) => `${k} ${v}`).join(", ")}`);
  console.log(`  avec e-mail : ${leads.filter((l) => l.email).length}, avec téléphone : ${leads.filter((l) => l.telephone).length}`);
  console.log("  top gestionnaires (lits) :");
  for (const g of gestionnaires.slice(0, 10)) console.log(`    ${g.capaciteTotale}\t${g.nbEhpad} EHPAD\t${g.gestionnaireNom}`);
  console.log(`\n→ ${leadsFile}\n→ ${gestionnairesFile}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
