/**
 * Premier appel API DataForSEO — vérifie login + compte.
 * Usage: node tools/dataforseo-test.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(ROOT, ".env");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const login = process.env.DATAFORSEO_LOGIN;
const password = process.env.DATAFORSEO_PASSWORD;

if (!login || !password) {
  console.error("Missing DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD in .env");
  process.exit(1);
}

const auth = Buffer.from(`${login}:${password}`).toString("base64");

console.log("1) GET /v3/user — vérifie les identifiants…");
const userRes = await fetch("https://api.dataforseo.com/v3/user", {
  headers: { Authorization: `Basic ${auth}` },
});
const userJson = await userRes.json();
console.log(`   HTTP ${userRes.status} | status_code ${userJson.status_code} | ${userJson.status_message}`);

if (userJson.status_code === 20000) {
  const info = userJson.tasks?.[0]?.result?.[0];
  if (info) {
    console.log(`   Login: ${info.login}`);
    console.log(`   Balance: $${info.money?.balance ?? "?"}`);
  }
}

console.log("\n2) POST /v3/serp/google/organic/live/regular — premier appel SERP (exemple doc)…");
const serpRes = await fetch(
  "https://api.dataforseo.com/v3/serp/google/organic/live/regular",
  {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        keyword: "planning équipe",
        location_code: 2250,
        language_code: "fr",
        device: "desktop",
        os: "windows",
      },
    ]),
  },
);
const serpJson = await serpRes.json();
const task = serpJson.tasks?.[0];
console.log(`   HTTP ${serpRes.status} | status_code ${task?.status_code ?? serpJson.status_code}`);
console.log(`   ${task?.status_message ?? serpJson.status_message}`);
if (task?.cost != null) console.log(`   Coût: $${task.cost}`);

if (task?.status_code === 20000) {
  const items = task.result?.[0]?.items ?? [];
  console.log(`   Résultats organiques: ${items.length}`);
  for (const item of items.slice(0, 3)) {
    if (item.type === "organic") {
      console.log(`   • #${item.rank_group} ${item.title?.slice(0, 60)}`);
    }
  }
  console.log("\n✓ Compte OK — vous pouvez lancer: npm run seo:competitors");
} else if (serpJson.status_code === 40104 || task?.status_code === 40104) {
  console.log("\n✗ Compte non vérifié. Allez sur https://app.dataforseo.com/ et complétez la vérification.");
  process.exit(1);
} else {
  process.exit(1);
}
