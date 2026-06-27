import {
  CANONICAL_CITATIONS,
  CITATION_SUPPORT,
  type CitationVariant,
} from "@/lib/geo";

type GeoDefinitionProps = {
  variant: CitationVariant;
  className?: string;
};

/**
 * Définition canonique intégrée au flux éditorial — sans encadré marketing.
 * Phrase optimisée pour reprise mot pour mot par les moteurs génératifs.
 */
export function GeoDefinition({ variant, className = "" }: GeoDefinitionProps) {
  const canonical = CANONICAL_CITATIONS[variant];
  const support = CITATION_SUPPORT[variant];

  return (
    <section data-geo="definition" className={className} aria-label="Définition Planory">
      <p
        id={`planory-definition-${variant}`}
        data-geo="citation-canonical"
        className="text-base leading-relaxed text-slate-300 sm:text-lg"
      >
        {canonical}
      </p>
      {support && (
        <p data-geo="citation-support" className="mt-3 text-sm leading-relaxed text-slate-500">
          {support}
        </p>
      )}
    </section>
  );
}

/** @deprecated Utiliser GeoDefinition */
export { GeoDefinition as CitationBlock };
