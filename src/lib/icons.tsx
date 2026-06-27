import {
  BadgeCheck,
  BookOpen,
  Box,
  Building2,
  CalendarDays,
  CircleHelp,
  Factory,
  FileSpreadsheet,
  FileText,
  Globe,
  GraduationCap,
  Handshake,
  Landmark,
  Languages,
  Layers,
  ListChecks,
  MapPin,
  Plane,
  Rocket,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Target,
  Timer,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ProductModuleId = "rh" | "planning" | "ressources" | "skynet";

export const PRODUCT_MODULE_ICONS: Record<ProductModuleId, LucideIcon> = {
  rh: Users,
  planning: CalendarDays,
  ressources: Box,
  skynet: Sparkles,
};

export const HERO_STAT_ICONS = [Timer, ShieldCheck, Layers] as const;

export const OFFER_TIER_ICONS = {
  Autonome: Rocket,
  Accompagné: Handshake,
  "Mission critique": Shield,
} as const;

export type SectorIconKey =
  | "plane"
  | "hospital"
  | "factory"
  | "shopping"
  | "school"
  | "landmark";

export const SECTOR_ICONS: Record<SectorIconKey, LucideIcon> = {
  plane: Plane,
  hospital: Building2,
  factory: Factory,
  shopping: ShoppingCart,
  school: GraduationCap,
  landmark: Landmark,
};

export const PAGE_ICONS: Record<string, LucideIcon> = {
  "/produit": Layers,
  "/secteurs": MapPin,
  "/secteurs/hopital": Building2,
  "/ressources": BookOpen,
  "/ressources/planning-excel-vs-logiciel": FileSpreadsheet,
  "/offre": BadgeCheck,
  "/faq": CircleHelp,
  "/en": Globe,
};

export const NAV_CHILD_ICONS: Record<string, LucideIcon> = {
  "/produit#rh": Users,
  "/produit#planning": CalendarDays,
  "/produit#ressources": Box,
  "/produit#skynet": Sparkles,
  "/offre": BadgeCheck,
  "/faq": CircleHelp,
};

export const TOP_NAV_ICONS: Record<string, LucideIcon> = {
  "/produit": Layers,
  "/secteurs": MapPin,
  "/ressources": BookOpen,
  "/offre": BadgeCheck,
  "/faq": CircleHelp,
};

export const CONTACT_TOPIC_ICONS = [Building2, Target, Handshake, ListChecks] as const;

export const RESOURCE_ARTICLE_ICONS: Record<string, LucideIcon> = {
  "planning-excel-vs-logiciel": FileSpreadsheet,
};

export function getNavItemIcon(href: string): LucideIcon {
  if (href === "/") return Languages;
  if (NAV_CHILD_ICONS[href]) return NAV_CHILD_ICONS[href];
  if (PAGE_ICONS[href]) return PAGE_ICONS[href];
  const base = href.split("#")[0];
  return PAGE_ICONS[base] ?? FileText;
}

export function getPageIcon(path: string): LucideIcon {
  return PAGE_ICONS[path] ?? FileText;
}
