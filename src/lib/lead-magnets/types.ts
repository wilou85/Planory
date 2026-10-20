export type LeadMagnetSlug = "grille-excel-vs-logiciel";

export type LeadMagnetRole =
  | "planificateur"
  | "cadre-sante"
  | "drh"
  | "acheteur"
  | "direction"
  | "autre";

export type LeadMagnetSector =
  | "hopital"
  | "industrie"
  | "aeroport"
  | "commerce"
  | "services-publics"
  | "autre";

export type LeadMagnetDefinition = {
  slug: LeadMagnetSlug;
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  downloadPath: string;
  downloadFileName: string;
  subtitle: string;
  format: string;
  audience?: string;
  highlights: string[];
  previewSections: { title: string; items: string[] }[];
  ctaAfterDownload?: string;
  relatedArticlePath?: string;
  relatedArticleLabel?: string;
};

export type LeadMagnetFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: LeadMagnetRole;
  sector: LeadMagnetSector;
  magnetSlug: LeadMagnetSlug;
  gdprConsent: true;
  locale: "fr" | "en";
};

export type LeadMagnetFormFieldErrors = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sector: string;
  magnetSlug: string;
  gdprConsent: string;
}>;
