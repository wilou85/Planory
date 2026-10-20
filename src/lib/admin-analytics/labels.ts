const CONTACT_SOURCE_LABELS: Record<string, string> = {
  header: "En-tête (bouton « Prendre contact »)",
  hero: "Bloc d'accueil",
  mobile_menu: "Menu mobile",
  sticky_bar: "Barre fixe mobile",
  contact_section: "Page contact (bouton)",
  contact_section_email: "Page contact (adresse e-mail)",
  footer_email: "Pied de page (adresse e-mail)",
  offer: "Page offre",
  resources_hub: "Page ressources",
  article: "Fin d'article",
  sector_hospital: "Page secteur hôpital",
};

const MEDIUM_LABELS: Record<string, string> = {
  direct: "Accès direct",
  organic: "Recherche naturelle",
  social: "Réseaux sociaux",
  ai: "Assistants IA",
  referral: "Sites référents",
  email: "E-mail",
  paid: "Publicité",
  campaign: "Campagne",
};

const DEVICE_LABELS: Record<string, string> = {
  desktop: "Ordinateur",
  mobile: "Mobile",
  tablet: "Tablette",
  unknown: "Inconnu",
};

const WEB_VITALS: Record<string, { label: string; good: number; poor: number; unit: "ms" | "" }> = {
  LCP: { label: "Affichage du contenu principal (LCP)", good: 2500, poor: 4000, unit: "ms" },
  INP: { label: "Réactivité aux clics (INP)", good: 200, poor: 500, unit: "ms" },
  CLS: { label: "Stabilité visuelle (CLS)", good: 0.1, poor: 0.25, unit: "" },
  FCP: { label: "Premier affichage (FCP)", good: 1800, poor: 3000, unit: "ms" },
  TTFB: { label: "Réponse du serveur (TTFB)", good: 800, poor: 1800, unit: "ms" },
};

export function contactSourceLabel(source: string): string {
  if (CONTACT_SOURCE_LABELS[source]) return CONTACT_SOURCE_LABELS[source];
  if (source.startsWith("sector_")) return `Page secteur (${source.slice("sector_".length)})`;
  return source;
}

export const mediumLabel = (medium: string) => MEDIUM_LABELS[medium] ?? medium;
export const deviceLabel = (device: string) => DEVICE_LABELS[device] ?? device;
export const webVitalLabel = (name: string) => WEB_VITALS[name]?.label ?? name;
export const webVitalUnit = (name: string) => WEB_VITALS[name]?.unit ?? "";

export type WebVitalRating = "good" | "needs-improvement" | "poor";

export function rateWebVital(name: string, value: number): WebVitalRating {
  const thresholds = WEB_VITALS[name];
  if (!thresholds || value <= thresholds.good) return "good";
  return value <= thresholds.poor ? "needs-improvement" : "poor";
}

/** Null when there is no previous value to compare with (a % of zero is meaningless). */
export function percentChange(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
