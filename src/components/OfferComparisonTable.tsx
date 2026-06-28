"use client";

import { getOfferComparison, getPageUi } from "@/lib/get-content";
import type { Locale } from "@/lib/i18n";

type OfferComparisonTableProps = {
  locale?: Locale;
};

function Cell({ included }: { included: boolean | string }) {
  if (typeof included === "string") {
    return <span className="text-xs text-slate-400">{included}</span>;
  }
  return (
    <span className={included ? "text-emerald-400" : "text-slate-600"} aria-hidden>
      {included ? "✓" : "—"}
    </span>
  );
}

export function OfferComparisonTable({ locale = "fr" }: OfferComparisonTableProps) {
  const ui = getPageUi(locale).offerCompare;
  const comparison = getOfferComparison(locale);
  const tiers = comparison.tiers;

  function formatCellValue(included: boolean | string): string {
    if (typeof included === "string") return included;
    return included ? ui.includedValue : ui.notIncludedValue;
  }

  function cellValue(row: (typeof comparison.rows)[number], tier: (typeof tiers)[number]) {
    return row.values[tier as keyof typeof row.values];
  }

  return (
    <section aria-labelledby="offer-compare-heading" className="mt-8">
      <h3 id="offer-compare-heading" className="text-lg font-bold text-white sm:text-xl">
        {ui.heading}
      </h3>

      <div className="mt-4 space-y-4 md:hidden">
        {tiers.map((tier) => (
          <article
            key={tier}
            className="rounded-2xl border border-white/10 bg-[#0c1220]/40 p-4"
          >
            <h4 className="text-base font-semibold text-white">{tier}</h4>
            <ul className="mt-3 space-y-2">
              {comparison.rows.map((row) => (
                <li
                  key={row.feature}
                  className="flex items-start justify-between gap-3 rounded-lg bg-white/[0.02] px-2 py-2.5 text-sm"
                >
                  <span className="min-w-0 flex-1 text-slate-300">{row.feature}</span>
                  <span className="shrink-0 text-right font-medium text-slate-200">
                    {typeof cellValue(row, tier) === "boolean" ? (
                      <Cell included={cellValue(row, tier) as boolean} />
                    ) : (
                      formatCellValue(cellValue(row, tier))
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#0c1220]/40 md:block">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <caption className="sr-only">{ui.tableCaption}</caption>
          <thead>
            <tr>
              <th scope="col" className="px-4 py-3 font-medium text-slate-400">
                {ui.includedColumn}
              </th>
              {tiers.map((tier) => (
                <th key={tier} scope="col" className="px-4 py-3 font-semibold text-slate-200">
                  {tier}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.feature} className="even:bg-white/[0.02]">
                <th scope="row" className="px-4 py-3 font-normal text-slate-300">
                  {row.feature}
                </th>
                {tiers.map((tier) => (
                  <td key={tier} className="px-4 py-3">
                    <Cell included={cellValue(row, tier)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
