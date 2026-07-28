/**
 * Validation responsive : overflow par viewport + Lighthouse mobile.
 * Usage: node tools/responsive-validate.mjs
 * Prefs: VALIDATE_BASE_URL=http://localhost:3000
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { default as WebSocket } from "ws";

const chromeLauncher = await import("chrome-launcher");
const lighthouseMod = await import("lighthouse");
const lighthouse = lighthouseMod.default ?? lighthouseMod;

const BASE = process.env.VALIDATE_BASE_URL ?? "http://localhost:3000";
const PATHS = ["/", "/produit", "/offre", "/ressources", "/faq"];
/** Pages landing avec MobileTabBar (layout !== content). */
const LANDING_WITH_TABS = new Set(["/", "/produit", "/offre", "/faq"]);
const WIDTHS = [390, 430, 768, 1024, 1440];
const MD = 768;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "tmp");

async function pageEval(port, path, width, height, expression) {
  const targets = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${BASE}${path}`)}`,
    { method: "PUT" },
  ).then((r) => r.json());

  const wsUrl = targets.webSocketDebuggerUrl;
  if (!wsUrl) throw new Error("No webSocketDebuggerUrl");

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.once("open", res);
    ws.once("error", rej);
  });

  let id = 0;
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const msgId = ++id;
      const onMsg = (raw) => {
        const data = JSON.parse(String(raw));
        if (data.id !== msgId) return;
        ws.off("message", onMsg);
        if (data.error) reject(new Error(JSON.stringify(data.error)));
        else resolve(data.result);
      };
      ws.on("message", onMsg);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: width < MD ? 2 : 1,
    mobile: width < MD,
  });
  await send("Page.navigate", { url: `${BASE}${path}` });
  await new Promise((r) => setTimeout(r, 1500));

  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });

  await send("Page.close").catch(() => {});
  ws.close();
  return result.result?.value;
}

const OVERFLOW_EXPR = `(() => {
  const docW = document.documentElement.clientWidth;
  const scrollOverflow = Math.max(0, document.documentElement.scrollWidth - docW);
  const isVisible = (el) => {
    if (!el) return false;
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden" && el.getClientRects().length > 0;
  };
  const burgerVisible = isVisible(document.querySelector('header button[aria-haspopup="dialog"]'));
  const desktopNavVisible = isVisible(document.querySelector("header nav[aria-label]"));
  const tabBarVisible = [...document.querySelectorAll("nav")].some((n) => {
    const s = getComputedStyle(n);
    return (
      s.position === "fixed" &&
      (s.bottom === "0px" || parseFloat(s.bottom) === 0) &&
      isVisible(n)
    );
  });
  const langInHeader = isVisible(
    document.querySelector(
      'header [aria-label*="langue"], header [aria-label*="language"], header [aria-label*="Choose"], header [aria-label*="Choisir"]',
    ),
  );
  return { scrollOverflow, burgerVisible, desktopNavVisible, tabBarVisible, langInHeader };
})()`;

function navIssue(row) {
  if (row.error) return false;
  const expectTabs = LANDING_WITH_TABS.has(row.path);
  if (row.width < MD) {
    if (!row.burgerVisible) return true;
    if (!row.desktopNavVisible === false && row.desktopNavVisible) return true;
    if (row.desktopNavVisible) return true;
    if (expectTabs && !row.tabBarVisible) return true;
    if (!expectTabs && row.tabBarVisible) return true;
    return false;
  }
  // md+ : nav desktop, pas de burger ni tab bar
  if (!row.desktopNavVisible) return true;
  if (row.burgerVisible) return true;
  if (row.tabBarVisible) return true;
  return false;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--disable-gpu", "--no-sandbox"],
  });

  const report = { base: BASE, at: new Date().toISOString(), viewports: [], lighthouse: null };

  try {
    console.log(`Chrome debugging port ${chrome.port}`);
    for (const width of WIDTHS) {
      for (const path of PATHS) {
        try {
          const data = await pageEval(chrome.port, path, width, 900, OVERFLOW_EXPR);
          const row = { width, path, ...data };
          report.viewports.push(row);
          const flag = data.scrollOverflow > 0 ? "OVERFLOW" : "ok";
          console.log(
            `${width}px ${path} overflow=${data.scrollOverflow} [${flag}] burger=${data.burgerVisible} nav=${data.desktopNavVisible} tabs=${data.tabBarVisible} lang=${data.langInHeader}`,
          );
        } catch (err) {
          console.log(`${width}px ${path} ERROR ${err.message}`);
          report.viewports.push({ width, path, error: err.message });
        }
      }
    }
  } finally {
    await chrome.kill();
  }

  console.log("\nRunning Lighthouse mobile on / …");
  const lhChrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--disable-gpu", "--no-sandbox"],
  });
  try {
    const result = await lighthouse(
      `${BASE}/`,
      {
        port: lhChrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
      {
        extends: "lighthouse:default",
        settings: {
          formFactor: "mobile",
          screenEmulation: {
            mobile: true,
            width: 390,
            height: 844,
            deviceScaleFactor: 2,
            disabled: false,
          },
          throttlingMethod: "simulate",
        },
      },
    );

    const cats = result.lhr.categories;
    report.lighthouse = {
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
      audits: {
        viewport: result.lhr.audits.viewport?.score,
        tapTargets: result.lhr.audits["tap-targets"]?.score,
        fontSize: result.lhr.audits["font-size"]?.score,
        colorContrast: result.lhr.audits["color-contrast"]?.score,
      },
    };

    console.log(
      `Lighthouse mobile: perf=${report.lighthouse.performance} a11y=${report.lighthouse.accessibility} bp=${report.lighthouse.bestPractices} seo=${report.lighthouse.seo}`,
    );
    writeFileSync(join(OUT_DIR, "lighthouse-mobile.json"), JSON.stringify(result.lhr, null, 2));
  } finally {
    await lhChrome.kill();
  }

  writeFileSync(join(OUT_DIR, "responsive-validate.json"), JSON.stringify(report, null, 2));
  console.log(`\nWrote ${join(OUT_DIR, "responsive-validate.json")}`);

  const overflows = report.viewports.filter((r) => (r.scrollOverflow ?? 0) > 0);
  const navIssues = report.viewports.filter(navIssue);
  const langIssues = report.viewports.filter((r) => !r.error && !r.langInHeader);

  console.log(`\nOverflow failures: ${overflows.length}`);
  console.log(`Nav breakpoint failures: ${navIssues.length}`);
  for (const n of navIssues.slice(0, 12)) {
    console.log(
      `  nav ${n.width}px ${n.path} burger=${n.burgerVisible} desktopNav=${n.desktopNavVisible} tabs=${n.tabBarVisible}`,
    );
  }
  console.log(`Language switcher missing in header: ${langIssues.length}`);

  process.exit(overflows.length || navIssues.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
