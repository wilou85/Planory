/**
 * Google Apps Script — Lead magnets Planory
 *
 * Setup :
 * 1. Créer une Google Sheet (ex. « Planory — Lead magnets »)
 * 2. Extensions → Apps Script → coller ce fichier
 * 3. Déployer → Nouveau déploiement → Type : Application Web
 *    - Exécuter en tant que : Moi
 *    - Qui a accès : Tous
 * 4. Copier l’URL dans GOOGLE_SHEETS_WEBHOOK_URL (.env / variables d’environnement de l’hébergeur)
 * 5. (Optionnel) même secret dans GOOGLE_SHEETS_WEBHOOK_SECRET et SCRIPT_SECRET
 *
 * Les en-têtes sont créés automatiquement sur la ligne 1 si absents.
 */

var SCRIPT_SECRET = ""; // laisser vide ou même valeur que GOOGLE_SHEETS_WEBHOOK_SECRET
var SHEET_NAME = "Leads"; // nom de l’onglet (créé s’il n’existe pas)

var HEADERS = [
  "createdAt",
  "firstName",
  "lastName",
  "email",
  "role",
  "sector",
  "magnetSlug",
  "locale",
  "gdprConsent",
  "source",
  "diagnosticScore",
  "diagnosticMaxScore",
  "diagnosticPercentage",
  "diagnosticZone",
  "diagnosticChecked",
];

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    var data = JSON.parse(raw);

    if (SCRIPT_SECRET && data.secret !== SCRIPT_SECRET) {
      return json_({ ok: false, error: "unauthorized" });
    }

    var sheet = getOrCreateLeadsSheet_();
    ensureHeaders_(sheet);

    sheet.appendRow([
      data.createdAt || new Date().toISOString(),
      data.firstName || "",
      data.lastName || "",
      data.email || "",
      data.role || "",
      data.sector || "",
      data.magnetSlug || "",
      data.locale || "fr",
      data.gdprConsent === true || data.gdprConsent === "true" ? "yes" : "no",
      data.source || "lead-magnet-form",
      data.diagnosticScore || "",
      data.diagnosticMaxScore || "",
      data.diagnosticPercentage || "",
      data.diagnosticZone || "",
      data.diagnosticChecked || "",
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getOrCreateLeadsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

/** Écrit la ligne d’en-têtes si la ligne 1 n’est pas déjà « createdAt ». */
function ensureHeaders_(sheet) {
  var firstCell = String(sheet.getRange(1, 1).getValue() || "").trim();
  if (firstCell === "createdAt") {
    return;
  }

  // Ligne 1 déjà remplie par un lead sans en-têtes → on insère une ligne au-dessus
  if (firstCell !== "") {
    sheet.insertRowBefore(1);
  }

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** Test manuel : ajoute les en-têtes immédiatement (sans nouveau lead). */
function fixHeadersNow() {
  ensureHeaders_(getOrCreateLeadsSheet_());
}

/** Test manuel dans l’éditeur Apps Script */
function testAppend() {
  doPost({
    postData: {
      contents: JSON.stringify({
        secret: SCRIPT_SECRET,
        createdAt: new Date().toISOString(),
        firstName: "Test",
        lastName: "Planory",
        email: "test@example.com",
        role: "planificateur",
        sector: "hopital",
        magnetSlug: "grille-excel-vs-logiciel",
        locale: "fr",
        gdprConsent: true,
        source: "manual-test",
      }),
    },
  });
}
