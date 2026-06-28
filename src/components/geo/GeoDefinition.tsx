import {
  CANONICAL_CITATIONS,
  CANONICAL_CITATIONS_EN,
  CITATION_SUPPORT,
  getArticleCitation,
  type CitationVariant,
} from "@/lib/geo";

type GeoDefinitionProps = {
  /** Variante page (home, product, hospital…) */
  variant?: CitationVariant;
  /** Citation canonique d'un guide /ressources/[slug] */
  articleSlug?: string;
  /** Citation EN (page /en) */
  locale?: "fr" | "en";
  /** Sous-variante EN : home ou healthcare */
  enVariant?: keyof typeof CANONICAL_CITATIONS_EN;
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

  if (locale === "en") {
    return {
      canonical: CANONICAL_CITATIONS_EN[enVariant],
      support: `Live pilot: Paris-Orly Airport. Contact: contact@planory.net`,
      id: `planory-definition-en-${enVariant}`,
    };
  }

  if (articleSlug) {
    const citation = getArticleCitation(articleSlug);
    if (citation) {
      return {
        canonical: citation,
        support: "Planory — logiciel français de planification 24/7, moteur IA SKYNET.",
        id: `planory-definition-article-${articleSlug}`,
      };
    }
  }

  if (variant) {
    return {
      canonical: CANONICAL_CITATIONS[variant],
      support: CITATION_SUPPORT[variant],
      id: `planory-definition-${variant}`,
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
