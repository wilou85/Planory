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

export type LeadMagnetFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: LeadMagnetRole;
  sector: LeadMagnetSector;
  gdprConsent: boolean;
  magnetSlug: LeadMagnetSlug;
};

export type LeadMagnetFormFieldErrors = Partial<
  Record<keyof LeadMagnetFormData, string>
>;

export type LeadMagnetDefinition = {
  slug: LeadMagnetSlug;
  path: string;
  title: string;
  subtitle: string;
  description: string;
  format: string;
  audience: string;
  downloadFileName: string;
  downloadPath: string;
  keywords: string[];
  /** Article ou page liée pour maillage interne */
  relatedArticlePath?: string;
  relatedArticleLabel?: string;
  highlights: string[];
  previewSections: { title: string; items: string[] }[];
  ctaAfterDownload: string;
};
