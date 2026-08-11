import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Locale } from "@/lib/i18n";
import type { LeadMagnetDiagnosticSummary } from "@/lib/lead-magnet";
import {
  getExcelDiagnosticCriteria,
  getExcelDiagnosticZoneLabels,
  type ExcelDiagnosticZone,
} from "@/lib/lead-magnets/content";

const PAGE = { width: 595.28, height: 841.89 } as const;
const MARGIN = 50;
const FOOTER = "Planory — planory.net · contact@planory.net";

const COPY = {
  fr: {
    brand: "Planory — planory.net",
    title: "Grille d'auto-diagnostic",
    subtitle: "Excel vs logiciel de planning 24/7",
    intro: "Voici vos réponses et l'interprétation de votre score.",
    answers: "Vos réponses",
    interpretation: "Votre interprétation",
    scoreLine: (score: number, max: number, pct: number) =>
      `${score} / ${max} pts (${pct} %)`,
    legend: "Échelle de lecture",
    zones: [
      "0-25 % : Zone verte — Excel peut suffire pour l'instant.",
      "26-55 % : Zone orange — Anticipez un passage logiciel.",
      "56-100 % : Zone rouge — Excel atteint probablement ses limites.",
    ],
    outro:
      "Planory génère des propositions de planning conformes en moins de 2 minutes avec SKYNET. Échangez 20 min : contact@planory.net",
    pt: "pt",
    pts: "pts",
    checked: "Oui",
    unchecked: "Non",
  },
  en: {
    brand: "Planory — planory.net",
    title: "Self-assessment grid",
    subtitle: "Excel vs 24/7 scheduling software",
    intro: "Here are your answers and your score interpretation.",
    answers: "Your answers",
    interpretation: "Your interpretation",
    scoreLine: (score: number, max: number, pct: number) =>
      `${score} / ${max} pts (${pct} %)`,
    legend: "Score scale",
    zones: [
      "0-25%: Green zone — Excel may still be enough for now.",
      "26-55%: Amber zone — Plan a move to scheduling software.",
      "56-100%: Red zone — Excel is likely reaching its limits.",
    ],
    outro:
      "Planory generates compliant schedule proposals in under 2 minutes with SKYNET. Book 20 min: contact@planory.net",
    pt: "pt",
    pts: "pts",
    checked: "Yes",
    unchecked: "No",
  },
} as const;

function pdfText(value: string): string {
  return value
    .replace(/→/g, "->")
    .replace(/×/g, "x")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .replace(/…/g, "...")
    .replace(/•/g, "-")
    .replace(/’/g, "'")
    .replace(/'/g, "'")
    .replace(/«/g, "\"")
    .replace(/»/g, "\"")
    .replace(/é/g, "e")
    .replace(/è/g, "e")
    .replace(/ê/g, "e")
    .replace(/ë/g, "e")
    .replace(/à/g, "a")
    .replace(/â/g, "a")
    .replace(/ù/g, "u")
    .replace(/û/g, "u")
    .replace(/ô/g, "o")
    .replace(/î/g, "i")
    .replace(/ï/g, "i")
    .replace(/ç/g, "c")
    .replace(/É/g, "E")
    .replace(/È/g, "E")
    .replace(/À/g, "A")
    .replace(/Ç/g, "C");
}

/** Keep accents that WinAnsi/Helvetica supports; strip the rest safely via encode try. */
function safePdfText(value: string, font: PDFFont, size: number): string {
  const normalized = value
    .replace(/→/g, "->")
    .replace(/×/g, "x")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .replace(/…/g, "...")
    .replace(/•/g, "-")
    .replace(/’/g, "'")
    .replace(/‘/g, "'")
    .replace(/«/g, '"')
    .replace(/»/g, '"');
  try {
    font.widthOfTextAtSize(normalized, size);
    return normalized;
  } catch {
    return pdfText(normalized);
  }
}

type Ctx = {
  doc: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  fontBold: PDFFont;
  y: number;
  margin: number;
  width: number;
  height: number;
};

function wrapText(text: string, maxWidth: number, fontSize: number, font: PDFFont): string[] {
  const safe = safePdfText(text, font, fontSize);
  const words = safe.split(/\s+/);
  const lines: string[] = [];
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

function ensureSpace(ctx: Ctx, needed: number) {
  if (ctx.y - needed < 55) {
    ctx.page = ctx.doc.addPage([PAGE.width, PAGE.height]);
    ctx.y = ctx.height - 50;
  }
}

function drawLines(
  ctx: Ctx,
  lines: string[],
  fontSize: number,
  opts?: { bold?: boolean; color?: ReturnType<typeof rgb>; x?: number },
) {
  const font = opts?.bold ? ctx.fontBold : ctx.font;
  const color = opts?.color ?? rgb(0.1, 0.1, 0.15);
  const x = opts?.x ?? ctx.margin;

  for (const line of lines) {
    ensureSpace(ctx, fontSize + 8);
    ctx.page.drawText(safePdfText(line, font, fontSize), {
      x,
      y: ctx.y,
      size: fontSize,
      font,
      color,
    });
    ctx.y -= fontSize + 6;
  }
}

function drawParagraph(ctx: Ctx, text: string, fontSize = 11) {
  const maxWidth = ctx.width - ctx.margin * 2;
  drawLines(ctx, wrapText(text, maxWidth, fontSize, ctx.font), fontSize);
  ctx.y -= 4;
}

function resolveZoneKey(zoneLabel: string, locale: Locale): ExcelDiagnosticZone {
  const labels = getExcelDiagnosticZoneLabels(locale);
  if (zoneLabel === labels.green) return "green";
  if (zoneLabel === labels.red) return "red";
  return "orange";
}

function zoneAccent(zone: ExcelDiagnosticZone) {
  if (zone === "green") return rgb(0.06, 0.55, 0.4);
  if (zone === "red") return rgb(0.75, 0.2, 0.2);
  return rgb(0.85, 0.55, 0.1);
}

/**
 * PDF personnalisé : critères cochés/non cochés + carte d'interprétation (score / zone).
 */
export async function buildPersonalizedExcelDiagnosticPdf(
  diagnostic: LeadMagnetDiagnosticSummary,
  locale: Locale = "fr",
): Promise<Uint8Array> {
  const copy = COPY[locale];
  const criteria = getExcelDiagnosticCriteria(locale);
  const checked = new Set(diagnostic.checkedIds ?? []);
  // Fallback if only labels were sent
  if (checked.size === 0 && diagnostic.checkedLabels?.length) {
    for (const c of criteria) {
      if (diagnostic.checkedLabels.includes(c.label)) checked.add(c.id);
    }
  }

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([PAGE.width, PAGE.height]);
  const ctx: Ctx = {
    doc,
    page,
    font,
    fontBold,
    y: PAGE.height - 50,
    margin: MARGIN,
    width: PAGE.width,
    height: PAGE.height,
  };

  drawLines(ctx, [copy.brand], 9, { color: rgb(0.4, 0.4, 0.45) });
  ctx.y -= 4;
  drawLines(ctx, [copy.title], 18, { bold: true });
  drawLines(ctx, [copy.subtitle], 13, { bold: true });
  ctx.y -= 4;
  drawParagraph(ctx, copy.intro, 11);

  // Interpretation card first (matches on-page result prominence)
  const zoneKey = resolveZoneKey(diagnostic.zone, locale);
  const accent = zoneAccent(zoneKey);
  const maxWidth = ctx.width - ctx.margin * 2;
  const interpLines = wrapText(diagnostic.message, maxWidth - 24, 10, ctx.font);
  const cardHeight = 28 + 22 + 14 + interpLines.length * 14 + 20;
  ensureSpace(ctx, cardHeight + 16);

  const cardY = ctx.y - cardHeight + 8;
  ctx.page.drawRectangle({
    x: ctx.margin,
    y: cardY,
    width: maxWidth,
    height: cardHeight,
    color: rgb(0.97, 0.96, 0.93),
    borderColor: accent,
    borderWidth: 1.5,
  });

  let textY = ctx.y - 8;
  ctx.page.drawText(safePdfText(diagnostic.zone || copy.interpretation, fontBold, 12), {
    x: ctx.margin + 12,
    y: textY,
    size: 12,
    font: fontBold,
    color: accent,
  });
  textY -= 20;
  ctx.page.drawText(
    safePdfText(
      copy.scoreLine(diagnostic.score, diagnostic.maxScore, diagnostic.percentage),
      fontBold,
      16,
    ),
    {
      x: ctx.margin + 12,
      y: textY,
      size: 16,
      font: fontBold,
      color: rgb(0.08, 0.08, 0.12),
    },
  );
  textY -= 18;
  for (const line of interpLines) {
    ctx.page.drawText(safePdfText(line, font, 10), {
      x: ctx.margin + 12,
      y: textY,
      size: 10,
      font,
      color: rgb(0.2, 0.2, 0.25),
    });
    textY -= 14;
  }
  ctx.y = cardY - 16;

  drawLines(ctx, [copy.answers], 13, { bold: true });
  ctx.y -= 2;

  const byCategory = new Map<string, typeof criteria>();
  for (const c of criteria) {
    const list = byCategory.get(c.category) ?? [];
    list.push(c);
    byCategory.set(c.category, list);
  }

  for (const [category, items] of byCategory) {
    ctx.y -= 4;
    drawLines(ctx, [category], 11, { bold: true, color: rgb(0.35, 0.35, 0.4) });
    for (const item of items) {
      const mark = checked.has(item.id) ? "[x]" : "[ ]";
      const status = checked.has(item.id) ? copy.checked : copy.unchecked;
      const suffix = item.weight > 1 ? copy.pts : copy.pt;
      const line = `${mark} ${item.label} (${item.weight} ${suffix}) — ${status}`;
      const lines = wrapText(line, maxWidth - 8, 10, ctx.font);
      drawLines(ctx, lines, 10, {
        color: checked.has(item.id) ? rgb(0.08, 0.08, 0.12) : rgb(0.4, 0.4, 0.45),
      });
    }
  }

  ctx.y -= 8;
  drawLines(ctx, [copy.legend], 12, { bold: true });
  for (const zone of copy.zones) {
    drawLines(ctx, wrapText(`- ${zone}`, maxWidth - 8, 10, ctx.font), 10);
  }
  ctx.y -= 8;
  drawParagraph(ctx, copy.outro, 10);

  ctx.page.drawText(safePdfText(FOOTER, ctx.font, 8), {
    x: ctx.margin,
    y: 28,
    size: 8,
    font: ctx.font,
    color: rgb(0.45, 0.45, 0.5),
  });

  return ctx.doc.save();
}

export function pdfBytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}
