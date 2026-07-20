import {
  CANONICAL_CITATIONS,
  CANONICAL_CITATIONS_EN,
  CITATION_SUPPORT,
  getArticleCitation,
  getArticleCitationEn,
  type CitationVariant,
} from "@/lib/geo";

type GeoDefinitionProps = {
  /** Variante page (home, product, hospital…) */
  variant?: CitationVariant;
  /** Citation canonique d'un guide /ressources/[slug] */
  articleSlug?: string;
  /** Citation EN (page /en) */
  locale?: "fr" | "en";
  /** Sous-variante EN : home, healthcare, airport, industry… */
  enVariant?: "home" | "healthcare" | "airport" | "industry" | "sectors" | "faq";
  className?: string;
  /** Afficher le texte de support sous la citation (ex. référence pilote) */
  showSupport?: boolean;
};

function resolveCitation(props: GeoDefinitionProps): {
  canonical: string;
  support?: string;
  id: string;
} {
  const { variant, articleSlug, locale = "fr", enVariant = "home" } = props;
  const enSupport = "Live pilot: Paris-Orly Airport. Contact: contact@planory.net";

  if (articleSlug) {
    if (locale === "en") {
      const citation = getArticleCitationEn(articleSlug);
      if (citation) {
        return {
          canonical: citation,
          support: enSupport,
          id: `planory-definition-article-en-${articleSlug}`,
        };
      }
    } else {
      const citation = getArticleCitation(articleSlug);
      if (citation) {
        return {
          canonical: citation,
          support: "Planory — logiciel français de planification 24/7, moteur IA SKYNET.",
          id: `planory-definition-article-${articleSlug}`,
        };
      }
    }
  }

  if (variant) {
    const canonical =
      locale === "en" && variant in CANONICAL_CITATIONS_EN
        ? CANONICAL_CITATIONS_EN[variant as keyof typeof CANONICAL_CITATIONS_EN]
        : CANONICAL_CITATIONS[variant];
    const support =
      locale === "en"
        ? variant === "home"
          ? enSupport
          : undefined
        : CITATION_SUPPORT[variant];
    return {
      canonical,
      support,
      id: `planory-definition-${locale === "en" ? `en-${variant}` : variant}`,
    };
  }

  if (locale === "en") {
    return {
      canonical: CANONICAL_CITATIONS_EN[enVariant],
      support: enVariant === "home" ? enSupport : undefined,
      id: `planory-definition-en-${enVariant}`,
    };
  }

  return {
    canonical: CANONICAL_CITATIONS.home,
    support: CITATION_SUPPORT.home,
    id: "planory-definition-home",
  };
}

/**
 * Définition canonique intégrée au flux éditorial — sans encadré marketing.
 * Phrase optimisée pour reprise mot pour mot par les moteurs génératifs.
 */
export function GeoDefinition(props: GeoDefinitionProps) {
  const { className = "", showSupport = true } = props;
  const { canonical, support, id } = resolveCitation(props);

  return (
    <section
      data-geo="definition"
      data-geo-locale={props.locale ?? "fr"}
      className={className}
      aria-label={props.locale === "en" ? "About Planory" : "Définition Planory"}
    >
      <p
        id={id}
        data-geo="citation-canonical"
        className="text-base leading-relaxed text-slate-300 sm:text-lg"
      >
        {canonical}
      </p>
      {showSupport && support && (
        <p data-geo="citation-support" className="mt-3 text-sm leading-relaxed text-slate-500">
          {support}
        </p>
      )}
    </section>
  );
}

/** Vérifie qu'un slug article a une citation GEO définie */
export function hasArticleGeoCitation(slug: string): boolean {
  return getArticleCitation(slug) !== undefined;
}

/** @deprecated Utiliser GeoDefinition */
export { GeoDefinition as CitationBlock };
