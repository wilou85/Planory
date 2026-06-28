import type { LeadMagnetDefinition } from "./types";

export const TOOLS_HUB_PATH = "/ressources/outils";

export const LEAD_MAGNETS: LeadMagnetDefinition[] = [
  {
    slug: "grille-excel-vs-logiciel",
    path: "/ressources/outils/grille-excel-vs-logiciel",
    title: "Grille d'auto-diagnostic Excel vs logiciel de planning 24/7",
    subtitle: "15 critères pour évaluer si votre tableur atteint ses limites",
    description:
      "Testez votre situation en ligne, puis recevez la grille complète en PDF par email.",
    format: "Test en ligne + PDF",
    audience: "Planificateur, manager industrie, commerce ou hôpital encore sur Excel",
    downloadFileName: "planory-grille-excel-vs-logiciel.pdf",
    downloadPath: "/downloads/planory-grille-excel-vs-logiciel.pdf",
    keywords: [
      "planning excel",
      "logiciel planning équipe",
      "auto-diagnostic planning",
      "passage excel logiciel",
    ],
    relatedArticlePath: "/ressources/planning-excel-equipe",
    relatedArticleLabel: "Article : limites d'Excel pour un planning d'équipes",
    highlights: [],
    previewSections: [
      {
        title: "Volume & complexité",
        items: [
          "Plus de 30 agents planifiés sur plus de 4 semaines",
          "Environnement 24/7 (hôpital, aéroport, industrie, contact center)",
          "Roulements alternés : 12h, 3×8, 2×8 ou gardes",
        ],
      },
      {
        title: "Risques & conformité",
        items: [
          "Astreintes ou gardes avec règles d'équité à respecter",
          "Repos réglementaires vérifiés manuellement dans Excel",
          "Erreurs silencieuses (formules mal copiées) déjà constatées",
        ],
      },
      {
        title: "Organisation & temps",
        items: [
          "Plusieurs versions du fichier en circulation",
          "Plus de 4 h par période pour ajuster le planning",
          "Pas de workflow brouillon → validation → publication",
        ],
      },
    ],
    ctaAfterDownload:
      "Score élevé et vous souhaitez aller plus loin ?",
  },
];

export function getLeadMagnet(slug: string) {
  return LEAD_MAGNETS.find((m) => m.slug === slug);
}

export const LEAD_MAGNET_ROLE_LABELS: Record<
  import("./types").LeadMagnetRole,
  string
> = {
  planificateur: "Planificateur / ordonnanceur",
  "cadre-sante": "Cadre de santé",
  drh: "DRH / RRH",
  acheteur: "Acheteur / chef de projet",
  direction: "Direction / CODIR",
  autre: "Autre",
};

export const LEAD_MAGNET_SECTOR_LABELS: Record<
  import("./types").LeadMagnetSector,
  string
> = {
  hopital: "Hôpital / santé",
  industrie: "Industrie / logistique",
  aeroport: "Aéroport / transport",
  commerce: "Commerce / retail",
  "services-publics": "Services publics",
  autre: "Autre",
};
