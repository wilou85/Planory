import { describe, expect, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import {
  EHPAD_CSV_COLUMNS,
  FRENCH_REGIONS,
  aggregateByGestionnaire,
  applyCapacities,
  classifyStatutJuridique,
  computeEhpadCapacities,
  departementFromCommune,
  extractEhpadsFromPmej,
  filterEhpadLeads,
  formatPhone,
  indexGhtMembership,
  matchesEhpadFilters,
  parseStatutCategorie,
  regionFromDepartement,
  toCsv,
  type EhpadLead,
  type EhpadLeadFilters,
  type StatutCategorie,
} from "@/lib/leads/finess-ehpad";

/* ---------- fixtures (shape of the ANS FINESS « Structures » / « Activités » JSON flows) ---------- */

type Ege = Record<string, unknown>;

function ege(numFinessEge: string, overrides: Partial<Ege> = {}, info: Record<string, unknown> = {}): Ege {
  return {
    informationsGeneralesEGE: {
      egeId: `ege-${numFinessEge}`,
      nomEgeLong: `EHPAD ${numFinessEge}`,
      numFinessEge,
      dateOuverture: "2001-01-01",
      dateFermeture: null,
      siret: "26010001100014",
      ...info,
    },
    categorieentiteGeographiqueExercice: "500",
    adresse: [
      {
        usageAdresse: "03",
        ligneQuatre: "10 RUE DE LA COMMUNE 1871",
        cogCommune: "01004",
        codePostal: "01500",
        ligneAcheminement: "AMBERIEU EN BUGEY",
        coordonneesGeographique: { directionLatitude: "45.96", directionLongitude: "5.35" },
      },
    ],
    contact: [{ typeContact: { roleContact: "01" }, telecom: { telephone: "0474461420", courriel: null } }],
    etatObjet: "A",
    ...overrides,
  };
}

function pmej(eges: Ege[], info: Record<string, unknown> = {}) {
  return {
    informationsGeneralesPMEJ: {
      pmSmsseId: "17",
      denominationLonguePmSmsse: "CCAS D'AMBERIEU",
      numFinessPm: "010000339",
      siren: "260100011",
      statutJuridique: "17",
      ...info,
    },
    contact: [{ typeContact: { roleContact: "01" }, telecom: { telephone: "0474000000" } }],
    ege: eges,
  };
}

type Cap = { nombre: string; statutCapacite: string; habilitation?: string | null };

function activity(code: string, mode: string, caps: Cap[], etatObjet = "A") {
  return {
    caracteristiquesGeneriques: { etatObjet },
    nature: {
      codeNature: "AMSR",
      caracteristiquesSpecifiques: {
        typeActiviteAMSR: { activiteSocialeRegulee: code, modeFonctionnement: mode, public: "711" },
      },
    },
    capacite: caps.map((c) => ({
      modeFinancement: null,
      typeLogement: null,
      genre: null,
      habilitation: null,
      uniteMesureCapacite: "02",
      ...c,
    })),
  };
}

const installed = (n: number): Cap => ({ nombre: String(n), statutCapacite: "08" });
const authorised = (n: number): Cap => ({ nombre: String(n), statutCapacite: "09" });
const installedHabilitated = (n: number): Cap => ({ nombre: String(n), statutCapacite: "08", habilitation: "02" });

function lead(overrides: Partial<EhpadLead> = {}): EhpadLead {
  return {
    finess: "010780906",
    nom: "EHPAD TEST",
    adresse: "1 RUE TEST",
    codePostal: "01500",
    commune: "AMBERIEU EN BUGEY",
    codeCommune: "01004",
    departement: "01",
    region: "Auvergne-Rhône-Alpes",
    telephone: "04 74 46 14 20",
    email: "",
    statutCategorie: "public",
    statutJuridiqueCode: "17",
    statutJuridique: "Centre Communal d'Action Sociale",
    gestionnaireNom: "CCAS",
    gestionnaireFiness: "010000339",
    gestionnaireSiren: "260100011",
    gestionnaireTelephone: "",
    ght: "",
    capacite: 80,
    litsPermanents: 76,
    litsTemporaires: 4,
    placesAccueilJour: 6,
    pasa: false,
    uhr: false,
    dateOuverture: "2001-01-01",
    siret: "",
    latitude: "",
    longitude: "",
    ...overrides,
  };
}

/** Minimal RFC 4180 reader used only to check that `toCsv` output round-trips. */
function parseCsv(text: string, separator = ";"): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === separator) {
      row.push(field);
      field = "";
    } else if (ch === "\r" && text[i + 1] === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
    } else field += ch;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const ALL_STATUT_CODES = [
  "000", "01", "02", "03", "04", "05", "06", "07", "08", "10", "11", "12", "13", "14", "15", "16", "17",
  "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "40", "41", "42", "43",
  "44", "45", "46", "47", "48", "49", "50", "51", "52", "60", "61", "62", "63", "64", "65", "66", "70",
  "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "85", "86", "87", "88", "89", "90", "91",
  "93", "95", "100", "101", "102", "103", "104", "105", "106", "107", "110",
];

const METROPOLITAN_DEPARTEMENTS = [
  ...Array.from({ length: 95 }, (_, i) => String(i + 1).padStart(2, "0")).filter((d) => d !== "20"),
  "2A",
  "2B",
];

/* ---------- invariants ---------- */

describe("classifyStatutJuridique", () => {
  describe("invariants", () => {
    it("puts every FINESS legal status in exactly one known category", () => {
      const categories: StatutCategorie[] = ["public", "prive_non_lucratif", "prive_commercial", "autre"];
      assertInvariantForEach(
        ALL_STATUT_CODES,
        (code) => categories.includes(classifyStatutJuridique(code)),
        (code) => `${code} must map to a known category`,
      );
    });

    it("follows the TRE-R400 hierarchy (1000 public, 2100 non-profit, 2200 commercial)", () => {
      for (const code of ["13", "17", "21", "22", "08"]) expect(classifyStatutJuridique(code)).toBe("public");
      for (const code of ["47", "60", "61", "63", "64", "89"]) {
        expect(classifyStatutJuridique(code)).toBe("prive_non_lucratif");
      }
      for (const code of ["72", "73", "75", "95", "105"]) expect(classifyStatutJuridique(code)).toBe("prive_commercial");
      for (const code of ["000", "90", "", "zz"]) expect(classifyStatutJuridique(code)).toBe("autre");
    });
  });
});

describe("parseStatutCategorie", () => {
  it("accepts canonical values and business aliases, rejects the rest", () => {
    expect(parseStatutCategorie("public")).toBe("public");
    expect(parseStatutCategorie("Associatif")).toBe("prive_non_lucratif");
    expect(parseStatutCategorie("non-lucratif")).toBe("prive_non_lucratif");
    expect(parseStatutCategorie("commercial")).toBe("prive_commercial");
    expect(parseStatutCategorie("prive_commercial")).toBe("prive_commercial");
    expect(parseStatutCategorie("hopital")).toBeNull();
  });
});

describe("departementFromCommune / regionFromDepartement", () => {
  describe("invariants", () => {
    it("maps every metropolitan and overseas département to exactly one of the 18 regions", () => {
      assertInvariant(FRENCH_REGIONS.length === 18, "France has 18 regions");
      assertInvariantForEach(
        [...METROPOLITAN_DEPARTEMENTS, "971", "972", "973", "974", "976"],
        (dep) => FRENCH_REGIONS.includes(regionFromDepartement(dep) as (typeof FRENCH_REGIONS)[number]),
        (dep) => `${dep} must map to a region`,
      );
      const covered = new Set(METROPOLITAN_DEPARTEMENTS.concat(["971", "972", "973", "974", "976"]).map(regionFromDepartement));
      assertInvariant(covered.size === 18, "every region must own at least one département");
    });

    it("derives the département from the INSEE commune code, including Corsica and overseas", () => {
      expect(departementFromCommune("01004")).toBe("01");
      expect(departementFromCommune("2A004")).toBe("2A");
      expect(departementFromCommune("97411")).toBe("974");
      expect(departementFromCommune("")).toBe("");
      expect(regionFromDepartement("975")).toBe("");
    });
  });
});

describe("formatPhone", () => {
  it("never loses or reorders digits", () => {
    for (const raw of ["0474461420", "04 74 46 14 20", "+33474461420", "0590123", ""]) {
      const formatted = formatPhone(raw);
      assertInvariant(
        formatted.replace(/\D/g, "") === raw.replace(/\D/g, ""),
        `digits of ${raw} must be preserved`,
      );
    }
    expect(formatPhone("0474461420")).toBe("04 74 46 14 20");
  });
});

describe("extractEhpadsFromPmej", () => {
  describe("invariants", () => {
    const source = pmej([
      ege("010780906"),
      ege("010000001", { categorieentiteGeographiqueExercice: "365" }),
      ege("010000002", { etatObjet: "I" }),
      ege("010000003", {}, { dateFermeture: "2024-01-01" }),
      ege("BAD"),
      ege("2A0000004", {
        adresse: [{ usageAdresse: "03", cogCommune: "2A004", codePostal: "20000", ligneAcheminement: "AJACCIO" }],
      }),
    ]);
    const leads = extractEhpadsFromPmej(source);

    it("only returns open, active EHPAD (category 500) with a valid 9-character FINESS number", () => {
      expect(leads.map((l) => l.finess).sort()).toEqual(["010780906", "2A0000004"]);
      assertInvariantForEach(
        leads,
        (l) => /^[A-Za-z0-9]{9}$/.test(l.finess),
        (l) => `${l.finess} must be a valid FINESS number`,
      );
    });

    it("always carries the operating legal entity (gestionnaire) and its status category", () => {
      assertInvariantForEach(
        leads,
        (l) =>
          l.gestionnaireFiness === "010000339" &&
          l.gestionnaireNom === "CCAS D'AMBERIEU" &&
          l.gestionnaireSiren === "260100011" &&
          l.statutCategorie === "public",
        (l) => `${l.finess} must keep its gestionnaire`,
      );
    });

    it("locates every lead in a département and region consistent with its commune code", () => {
      assertInvariantForEach(
        leads,
        (l) => l.departement === departementFromCommune(l.codeCommune) && l.region === regionFromDepartement(l.departement),
        (l) => `${l.finess} location must be consistent`,
      );
      expect(leads.find((l) => l.finess === "2A0000004")?.region).toBe("Corse");
    });

    it("tags the GHT when the establishment or its legal entity belongs to one", () => {
      const ght = indexGhtMembership([
        { typeGcc: "001", nomGcc: "GHT BRESSE", etatObjet: "A", pmejDuGcc: [{ pmSmsseId: "17" }], egeDuGcc: [] },
        { typeGcc: "001", nomGcc: "GHT FERME", etatObjet: "I", pmejDuGcc: [{ pmSmsseId: "17" }], egeDuGcc: [] },
      ]);
      const tagged = extractEhpadsFromPmej(source, ght);
      assertInvariantForEach(tagged, (l) => l.ght === "GHT BRESSE", (l) => `${l.finess} must be tagged with its active GHT`);
    });

    it("ignores malformed records instead of throwing", () => {
      expect(extractEhpadsFromPmej(null)).toEqual([]);
      expect(extractEhpadsFromPmej({ ege: "nope" })).toEqual([]);
    });
  });
});

describe("computeEhpadCapacities", () => {
  describe("invariants", () => {
    const capacities = computeEhpadCapacities({
      numFiness: "010000339",
      ege: [
        {
          numFinessEge: "010780906",
          activitesExercees: [
            activity("924", "11", [installed(70), installedHabilitated(70), authorised(75)]),
            activity("657", "11", [installed(4)]),
            activity("924", "21", [installed(6)]),
            activity("961", "21", [installed(14)]),
            activity("962", "11", [installed(12)]),
            activity("963", "21", [installed(10)]),
            activity("924", "11", [installed(30)], "I"),
          ],
        },
      ],
    });
    const cap = capacities.get("010780906");

    it("counts only installed, ungranular capacity of active activities", () => {
      expect(cap).toEqual({ litsPermanents: 70, litsTemporaires: 4, placesAccueilJour: 6, pasa: true, uhr: true });
    });

    it("never double-counts PASA / UHR / PFR places, which sit inside existing capacity", () => {
      assertInvariant(cap !== undefined, "capacity must exist");
      assertInvariant(cap.litsPermanents + cap.litsTemporaires + cap.placesAccueilJour === 80, "only 924/657 places count");
    });

    it("never yields negative or non-integer capacities", () => {
      const weird = computeEhpadCapacities({
        ege: [{ numFinessEge: "010780907", activitesExercees: [activity("924", "11", [{ nombre: "abc", statutCapacite: "08" }, { nombre: "-3", statutCapacite: "08" }])] }],
      }).get("010780907");
      assertInvariant(weird !== undefined, "capacity must exist");
      assertInvariantForEach(
        [weird.litsPermanents, weird.litsTemporaires, weird.placesAccueilJour],
        (n) => Number.isInteger(n) && n >= 0,
        (n) => `${n} must be a non-negative integer`,
      );
    });
  });
});

describe("applyCapacities", () => {
  it("sets capacite = permanent + temporary beds and keeps leads without activity at 0", () => {
    const merged = applyCapacities(
      [lead({ finess: "A00000001", capacite: 0, litsPermanents: 0, litsTemporaires: 0, placesAccueilJour: 0 }), lead({ finess: "A00000002" })],
      new Map([["A00000001", { litsPermanents: 50, litsTemporaires: 2, placesAccueilJour: 10, pasa: true, uhr: false }]]),
    );
    expect(merged[0]).toMatchObject({ capacite: 52, placesAccueilJour: 10, pasa: true });
    expect(merged[1]).toMatchObject({ capacite: 0, litsPermanents: 0, litsTemporaires: 0, placesAccueilJour: 0 });
    assertInvariantForEach(merged, (l) => l.capacite === l.litsPermanents + l.litsTemporaires, (l) => `${l.finess} capacite`);
  });
});

describe("filterEhpadLeads", () => {
  const leads: EhpadLead[] = [
    lead({ finess: "A00000001", region: "Île-de-France", departement: "75", statutCategorie: "prive_commercial", gestionnaireNom: "SAS KORIAN LES LILAS", capacite: 120 }),
    lead({ finess: "A00000002", region: "Bretagne", departement: "29", statutCategorie: "prive_non_lucratif", gestionnaireNom: "ASSOCIATION ER", capacite: 60 }),
    lead({ finess: "A00000003", region: "Île-de-France", departement: "92", statutCategorie: "public", gestionnaireNom: "CCAS", nom: "EHPAD DOMUSVI LES PINS", capacite: 85 }),
    lead({ finess: "A00000004", region: "Auvergne-Rhône-Alpes", departement: "01", statutCategorie: "public", gestionnaireNom: "CH BOURG", capacite: 0 }),
    lead({ finess: "A00000004", region: "Auvergne-Rhône-Alpes", departement: "01", statutCategorie: "public", gestionnaireNom: "CH BOURG", capacite: 0 }),
  ];

  const filterSets: EhpadLeadFilters[] = [
    {},
    { regions: ["ile-de-france"] },
    { regions: ["11", "bretagne"] },
    { departements: ["1"] },
    { statuts: ["public"] },
    { statuts: ["prive_commercial", "prive_non_lucratif"] },
    { gestionnaire: "korian" },
    { search: "domusvi" },
    { capaciteMin: 80 },
    { capaciteMax: 80 },
    { capaciteMin: 60, capaciteMax: 100, regions: ["Île-de-France"], statuts: ["public"] },
  ];

  describe("invariants", () => {
    it("returns exactly the deduplicated leads that satisfy every filter", () => {
      for (const filters of filterSets) {
        const result = filterEhpadLeads(leads, filters);
        assertInvariant(
          result.every((l) => matchesEhpadFilters(l, filters)),
          `every result must match ${JSON.stringify(filters)}`,
        );
        const expectedIds = [...new Set(leads.filter((l) => matchesEhpadFilters(l, filters)).map((l) => l.finess))];
        expect(result.map((l) => l.finess)).toEqual(expectedIds);
      }
    });

    it("never outputs the same FINESS number twice", () => {
      const result = filterEhpadLeads(leads, {});
      assertInvariant(new Set(result.map((l) => l.finess)).size === result.length, "FINESS numbers must be unique");
    });

    it("applies each filter with its business meaning", () => {
      const ids = (filters: EhpadLeadFilters) => filterEhpadLeads(leads, filters).map((l) => l.finess);
      expect(ids({ regions: ["ile de france"] })).toEqual(["A00000001", "A00000003"]);
      expect(ids({ departements: ["1"] })).toEqual(["A00000004"]);
      expect(ids({ gestionnaire: "korian" })).toEqual(["A00000001"]);
      expect(ids({ search: "domusvi" })).toEqual(["A00000003"]);
      expect(ids({ capaciteMin: 80, capaciteMax: 100 })).toEqual(["A00000003"]);
    });
  });
});

describe("toCsv", () => {
  describe("invariants", () => {
    it("round-trips any cell content, including separators, quotes and line breaks", () => {
      const rows = [
        ["finess", "nom", "note"],
        ["010780906", 'EHPAD "Les Tilleuls"; aile B', "ligne 1\r\nligne 2"],
        ["2A0000004", "Résidence Île-Rousse", ""],
        ["", "; ; ;", '"'],
      ];
      expect(parseCsv(toCsv(rows))).toEqual(rows);
    });

    it("produces one record per lead with every declared column", () => {
      const header = EHPAD_CSV_COLUMNS.map((c) => c.header);
      const leads = [lead(), lead({ finess: "2A0000004", nom: "A; B", pasa: true })];
      const parsed = parseCsv(toCsv([header, ...leads.map((l) => EHPAD_CSV_COLUMNS.map((c) => c.value(l)))]));
      assertInvariant(parsed.length === leads.length + 1, "header + one line per lead");
      assertInvariantForEach(parsed, (row) => row.length === header.length, (row) => `row ${row[0]} has all columns`);
      expect(parsed[2][header.indexOf("pasa")]).toBe("oui");
    });
  });
});

describe("aggregateByGestionnaire", () => {
  describe("invariants", () => {
    const leads = [
      lead({ finess: "A00000001", gestionnaireFiness: "G1", gestionnaireNom: "GROUPE 1", capacite: 100, region: "Bretagne" }),
      lead({ finess: "A00000002", gestionnaireFiness: "G1", gestionnaireNom: "GROUPE 1", capacite: 50, region: "Normandie" }),
      lead({ finess: "A00000003", gestionnaireFiness: "G2", gestionnaireNom: "GROUPE 2", capacite: 200, region: "Bretagne" }),
    ];
    const groups = aggregateByGestionnaire(leads);

    it("preserves the number of EHPAD and the total capacity", () => {
      assertInvariant(groups.reduce((s, g) => s + g.nbEhpad, 0) === leads.length, "EHPAD count is preserved");
      assertInvariant(
        groups.reduce((s, g) => s + g.capaciteTotale, 0) === leads.reduce((s, l) => s + l.capacite, 0),
        "capacity is preserved",
      );
    });

    it("sorts gestionnaires by total capacity, biggest first, and lists their regions", () => {
      expect(groups.map((g) => g.gestionnaireFiness)).toEqual(["G2", "G1"]);
      expect(groups[1].regions).toEqual(["Bretagne", "Normandie"]);
    });
  });
});
