/**
 * Génère les PDF des lead magnets dans public/downloads/
 * Usage: npm run lead-magnets:pdf
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  EXCEL_DIAGNOSTIC_CRITERIA,
} from "./lead-magnet-pdf-content.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "downloads");

const BRAND = "Planory — planory.net";
const FOOTER = "Document gratuit Planory · contact@planory.net · www.planory.net";

/** StandardFonts Helvetica = WinAnsi — normalise les caracteres non encodables */
function pdfText(value) {
  return value
    .replace(/→/g, "->")
    .replace(/×/g, "x")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .replace(/…/g, "...")
    .replace(/•/g, "-");
}

async function createContext() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  return { doc, page, font, fontBold, y: height - 50, margin: 50, width, height };
}

function wrapText(text, maxWidth, fontSize, font) {
  const safe = pdfText(text);
  const words = safe.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(ctx, lines, fontSize, opts) {
  const font = opts?.bold ? ctx.fontBold : ctx.font;
  const color = opts?.color ?? rgb(0.1, 0.1, 0.15);
  const maxWidth = ctx.width - ctx.margin * 2;

  for (const line of lines) {
    if (ctx.y < 60) {
      ctx.page = ctx.doc.addPage([595.28, 841.89]);
      ctx.y = ctx.height - 50;
    }
    ctx.page.drawText(pdfText(line), { x: ctx.margin, y: ctx.y, size: fontSize, font, color });
    ctx.y -= fontSize + 6;
  }
}

function drawParagraph(ctx, text, fontSize = 11) {
  const maxWidth = ctx.width - ctx.margin * 2;
  const lines = wrapText(text, maxWidth, fontSize, ctx.font);
  drawLines(ctx, lines, fontSize);
  ctx.y -= 4;
}

function drawTitle(ctx, text) {
  drawLines(ctx, [text], 18, { bold: true });
  ctx.y -= 8;
}

function drawHeading(ctx, text) {
  ctx.y -= 6;
  drawLines(ctx, [text], 13, { bold: true });
  ctx.y -= 2;
}

function drawBullet(ctx, text, fontSize = 10) {
  const maxWidth = ctx.width - ctx.margin * 2 - 16;
  const lines = wrapText(text, maxWidth, fontSize, ctx.font);
  lines.forEach((line, i) => {
    if (ctx.y < 60) {
      ctx.page = ctx.doc.addPage([595.28, 841.89]);
      ctx.y = ctx.height - 50;
    }
    if (i === 0) {
      ctx.page.drawText(pdfText("-"), { x: ctx.margin, y: ctx.y, size: fontSize, font: ctx.font });
    }
    ctx.page.drawText(pdfText(line), { x: ctx.margin + 14, y: ctx.y, size: fontSize, font: ctx.font, color: rgb(0.15, 0.15, 0.2) });
    ctx.y -= fontSize + 5;
  });
}

function drawFooter(ctx) {
  ctx.page.drawText(pdfText(FOOTER), {
    x: ctx.margin,
    y: 30,
    size: 8,
    font: ctx.font,
    color: rgb(0.45, 0.45, 0.5),
  });
}

async function buildExcelPdf() {
  const ctx = await createContext();
  drawLines(ctx, [BRAND], 9, { color: rgb(0.4, 0.4, 0.45) });
  ctx.y -= 4;
  drawTitle(ctx, "Grille d'auto-diagnostic");
  drawLines(ctx, ["Excel vs logiciel de planning 24/7"], 14, { bold: true });
  ctx.y -= 6;
  drawParagraph(
    ctx,
    "Cochez chaque critère qui s'applique à votre situation. Additionnez les points (indiqués entre parenthèses) pour obtenir votre score.",
  );

  const byCategory = new Map();
  for (const c of EXCEL_DIAGNOSTIC_CRITERIA) {
    const list = byCategory.get(c.category) ?? [];
    list.push(c);
    byCategory.set(c.category, list);
  }

  for (const [category, items] of byCategory) {
    drawHeading(ctx, category);
    for (const item of items) {
      drawBullet(ctx, `[ ] ${item.label} (${item.weight} pt${item.weight > 1 ? "s" : ""})`);
    }
  }

  drawHeading(ctx, "Interprétation du score");
  drawBullet(ctx, "0–25 % : Zone verte — Excel peut suffire pour l'instant.");
  drawBullet(ctx, "26–55 % : Zone orange — Anticipez un passage logiciel.");
  drawBullet(ctx, "56–100 % : Zone rouge — Excel atteint probablement ses limites.");
  ctx.y -= 8;
  drawParagraph(
    ctx,
    "Planory génère des propositions de planning conformes en moins de 2 minutes avec le moteur IA SKYNET. Échangez 20 min avec nous : contact@planory.net",
    10,
  );
  drawFooter(ctx);
  return ctx.doc.save();
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const files = [["planory-grille-excel-vs-logiciel.pdf", buildExcelPdf]];

  for (const [name, builder] of files) {
    const bytes = await builder();
    writeFileSync(join(OUT_DIR, name), bytes);
    console.log(`✓ ${name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
