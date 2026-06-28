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
  Mail,
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
import { stripLocalePrefix } from "@/lib/i18n";

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
  "/offre": BadgeCheck,
  "/faq": CircleHelp,
  "/contact": Mail,
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
  "planning-social": Users,
  "logiciel-planning-equipe": CalendarDays,
  "planification-rh": Users,
  "gestion-astreintes": ShieldCheck,
  "planning-hospitalier": Building2,
  "planning-12h-hopital": Building2,
  "planning-excel-equipe": FileSpreadsheet,
};

export function getNavItemIcon(href: string): LucideIcon {
  const path = stripLocalePrefix(href.split("#")[0]);
  const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
  const full = `${path}${hash}`;
  if (NAV_CHILD_ICONS[full]) return NAV_CHILD_ICONS[full];
  if (PAGE_ICONS[path]) return PAGE_ICONS[path];
  if (path === "/") return Languages;
  return FileText;
}

export function getPageIcon(path: string): LucideIcon {
  const base = stripLocalePrefix(path);
  return PAGE_ICONS[base] ?? FileText;
}
