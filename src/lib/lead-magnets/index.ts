import type { Locale } from "@/lib/i18n";
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
    ctaAfterDownload: "Score élevé et vous souhaitez aller plus loin ?",
  },
];

const LEAD_MAGNET_EN: Partial<LeadMagnetDefinition> & { slug: LeadMagnetDefinition["slug"] } = {
  slug: "grille-excel-vs-logiciel",
  title: "Excel vs 24/7 scheduling software — self-assessment grid",
  subtitle: "15 criteria to assess whether your spreadsheet is reaching its limits",
  description: "Test your situation online, then receive the full PDF grid by email.",
  format: "Online test + PDF",
  audience: "Scheduler, operations manager or hospital lead still on Excel",
  downloadFileName: "planory-excel-vs-scheduling-software.pdf",
  downloadPath: "/downloads/planory-excel-vs-scheduling-software.pdf",
  keywords: [
    "excel scheduling",
    "workforce scheduling software",
    "scheduling self-assessment",
    "excel to software",
  ],
  relatedArticleLabel: "Article: Excel limitations for team scheduling",
  previewSections: [
    {
      title: "Volume & complexity",
      items: [
        "More than 30 staff scheduled over 4+ weeks",
        "24/7 environment (hospital, airport, industry, contact center)",
        "Rotating shifts: 12h, 3×8, 2×8 or on-call",
      ],
    },
    {
      title: "Risk & compliance",
      items: [
        "On-call or guard shifts with fairness rules to respect",
        "Mandatory rest periods checked manually in Excel",
        "Silent errors (bad formula copies) already identified",
      ],
    },
    {
      title: "Organisation & time",
      items: [
        "Multiple file versions in circulation",
        "More than 4 hours per period to adjust the schedule",
        "No draft → validation → publish workflow",
      ],
    },
  ],
  ctaAfterDownload: "High score and want to go further?",
};

export const LEAD_MAGNET_ROLE_LABELS = {
  fr: {
    planificateur: "Planificateur / ordonnanceur",
    "cadre-sante": "Cadre de santé",
    drh: "DRH / RRH",
    acheteur: "Acheteur / chef de projet",
    direction: "Direction / CODIR",
    autre: "Autre",
  },
  en: {
    planificateur: "Scheduler / planner",
    "cadre-sante": "Healthcare manager",
    drh: "HR director / manager",
    acheteur: "Procurement / project lead",
    direction: "Executive / leadership",
    autre: "Other",
  },
} as const;

export const LEAD_MAGNET_SECTOR_LABELS = {
  fr: {
    hopital: "Hôpital / santé",
    industrie: "Industrie / logistique",
    aeroport: "Aéroport / transport",
    commerce: "Commerce / retail",
    "services-publics": "Services publics",
    autre: "Autre",
  },
  en: {
    hopital: "Hospital / healthcare",
    industrie: "Industry / logistics",
    aeroport: "Airport / transport",
    commerce: "Retail",
    "services-publics": "Public services",
    autre: "Other",
  },
} as const;

export const LEAD_MAGNET_FORM_COPY = {
  fr: {
    firstNameLabel: "Prénom",
    lastNameLabel: "Nom",
    emailLabel: "Email professionnel",
    roleLabel: "Fonction",
    sectorLabel: "Secteur",
    selectPlaceholder: "Sélectionner…",
    gdprConsent:
      "J'accepte que Planory traite mes données pour m'envoyer cette ressource et, le cas échéant, un suivi commercial, conformément au RGPD.",
    submitLoading: "Préparation…",
    receivePdf: "Recevoir le PDF",
    successTitle: "Ressource prête",
    successDownload: "Le PDF est prêt. Téléchargez-le ci-dessous.",
    downloadNow: "Télécharger le PDF",
    formErrorGeneric: "Une erreur est survenue.",
    networkError: "Connexion impossible. Vérifiez votre réseau et réessayez.",
    api: {
      invalidBody: "Corps de requête invalide.",
      invalidFields: "Champs invalides.",
      notFound: "Ressource introuvable.",
      emailSendFailed: "Impossible d'envoyer l'email. Réessayez plus tard.",
    },
    validation: {
      invalidData: "Données invalides.",
      firstNameRequired: "Le prénom est requis.",
      firstNameTooLong: "Prénom trop long.",
      lastNameRequired: "Le nom est requis.",
      lastNameTooLong: "Nom trop long.",
      emailRequired: "L'email est requis.",
      emailInvalid: "Email invalide.",
      roleInvalid: "Fonction invalide.",
      sectorInvalid: "Secteur invalide.",
      magnetInvalid: "Ressource invalide.",
      gdprRequired: "Vous devez accepter le traitement de vos données.",
    },
  },
  en: {
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    emailLabel: "Work email",
    roleLabel: "Role",
    sectorLabel: "Sector",
    selectPlaceholder: "Select…",
    gdprConsent:
      "I agree that Planory may process my data to send this resource and, where relevant, follow up commercially, in accordance with GDPR.",
    submitLoading: "Preparing…",
    receivePdf: "Receive the PDF",
    successTitle: "Your resource is ready",
    successDownload: "Your PDF is ready. Download it below.",
    downloadNow: "Download the PDF",
    formErrorGeneric: "Something went wrong.",
    networkError: "Unable to connect. Check your network and try again.",
    api: {
      invalidBody: "Invalid request body.",
      invalidFields: "Invalid fields.",
      notFound: "Resource not found.",
      emailSendFailed: "Unable to send the email. Please try again later.",
    },
    validation: {
      invalidData: "Invalid data.",
      firstNameRequired: "First name is required.",
      firstNameTooLong: "First name is too long.",
      lastNameRequired: "Last name is required.",
      lastNameTooLong: "Last name is too long.",
      emailRequired: "Email is required.",
      emailInvalid: "Invalid email address.",
      roleInvalid: "Invalid role.",
      sectorInvalid: "Invalid sector.",
      magnetInvalid: "Invalid resource.",
      gdprRequired: "You must accept data processing.",
    },
  },
} as const;

export const LEAD_MAGNET_LANDING_COPY = {
  fr: {
    badge: "Ressource gratuite",
    step1Title: "1. Votre score (gratuit, sans email)",
    step1Intro:
      "Cochez ce qui correspond à votre situation. Le score s'affiche en direct.",
    step2Title: "2. Recevoir la grille PDF",
    step2Intro:
      "Même contenu, version imprimable à télécharger — pour une réunion ou un dossier interne.",
    submitPdf: "Recevoir la grille PDF",
    receivePdf: "Recevoir le PDF",
    receivePdfHint: "Téléchargement direct. Pas de téléphone requis.",
    contentHeading: "Contenu",
  },
  en: {
    badge: "Free resource",
    step1Title: "1. Your score (free, no email)",
    step1Intro: "Check what applies to your situation. Your score updates live.",
    step2Title: "2. Get the PDF grid",
    step2Intro:
      "Same content, printable version to download — for a meeting or internal file.",
    submitPdf: "Receive the PDF grid",
    receivePdf: "Receive the PDF",
    receivePdfHint: "Direct download. No phone number required.",
    contentHeading: "Contents",
  },
} as const;

export function getLeadMagnet(slug: string, locale: Locale = "fr") {
  const base = LEAD_MAGNETS.find((m) => m.slug === slug);
  if (!base) return undefined;
  if (locale === "fr") return base;
  if (slug === "grille-excel-vs-logiciel") {
    return { ...base, ...LEAD_MAGNET_EN };
  }
  return base;
}

export function getLeadMagnetRoleLabels(locale: Locale = "fr") {
  return LEAD_MAGNET_ROLE_LABELS[locale];
}

export function getLeadMagnetSectorLabels(locale: Locale = "fr") {
  return LEAD_MAGNET_SECTOR_LABELS[locale];
}

export function getLeadMagnetFormCopy(locale: Locale = "fr") {
  return LEAD_MAGNET_FORM_COPY[locale];
}

export function getLeadMagnetLandingCopy(locale: Locale = "fr") {
  return LEAD_MAGNET_LANDING_COPY[locale];
}
