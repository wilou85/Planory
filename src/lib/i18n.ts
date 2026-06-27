export type Locale = "fr" | "en";

export const LOCALES: {
  code: Locale;
  label: string;
  flagCode: "fr" | "gb";
  href: string;
  htmlLang: string;
  ogLocale: string;
}[] = [
  {
    code: "fr",
    label: "Français",
    flagCode: "fr",
    href: "/",
    htmlLang: "fr",
    ogLocale: "fr_FR",
  },
  {
    code: "en",
    label: "English",
    flagCode: "gb",
    href: "/en",
    htmlLang: "en",
    ogLocale: "en_GB",
  },
];

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

export function localePath(locale: Locale, frPath = "/"): string {
  if (locale === "en") return "/en";
  return frPath === "/en" ? "/" : frPath;
}

export const HERO_COPY = {
  fr: {
    pilot: "Pilote en cours — Aéroport de Paris-Orly",
    title: "Générez un planning conforme en moins de 2 minutes",
    subtitle: "Logiciel de planification d'équipes 24/7",
    skynetTagline: "SKYNET propose — vos planificateurs valident.",
    description:
      "Planory respecte vos règles métier, contraintes RH et facteurs humains. Vous révisez, ajustez et publiez.",
    ctaPrimary: "Prendre contact",
    ctaSecondary: "Voir un exemple de planning",
    ctaSecondaryHref: "/produit#planning",
    stats: [
      { value: "< 2 min", label: "génération", labelDesktop: "pour générer un planning" },
      { value: "100%", label: "conformité", labelDesktop: "règles métier respectées" },
      { value: "France", label: "solution FR", labelDesktop: "solution française 24/7" },
    ],
  },
  en: {
    pilot: "Live pilot — Paris-Orly Airport",
    title: "Generate a compliant schedule in under 2 minutes",
    subtitle: "24/7 team planning software",
    skynetTagline: "SKYNET proposes — your planners validate.",
    description:
      "Planory respects your business rules, HR constraints and human factors. You review, adjust and publish.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "See a scheduling example",
    ctaSecondaryHref: "/produit#planning",
    stats: [
      { value: "< 2 min", label: "generation", labelDesktop: "to generate a schedule" },
      { value: "100%", label: "compliance", labelDesktop: "business rules met" },
      { value: "France", label: "French-built", labelDesktop: "French 24/7 scheduling" },
    ],
  },
} as const;

export const EN_SITE = {
  title: "24/7 workforce scheduling software with AI | Planory",
  description:
    "Planory generates compliant team schedules for hospitals, airports, industry and retail. French AI planning software — SKYNET engine.",
} as const;
