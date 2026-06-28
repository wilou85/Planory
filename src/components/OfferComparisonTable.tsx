"use client";

import { OFFER_COMPARISON } from "@/lib/content";

type OfferTier = (typeof OFFER_COMPARISON.tiers)[number];

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

function formatCellValue(included: boolean | string): string {
  if (typeof included === "string") return included;
  return included ? "Inclus" : "Non inclus";
}

export function OfferComparisonTable() {
  const tiers = OFFER_COMPARISON.tiers;

  return (
    <section aria-labelledby="offer-compare-heading" className="mt-8">
      <h3 id="offer-compare-heading" className="text-lg font-bold text-white sm:text-xl">
        Comparer les offres
      </h3>

      {/* Mobile / tablette étroite : cartes empilées */}
      <div className="mt-4 space-y-4 md:hidden">
        {tiers.map((tier) => (
          <article
            key={tier}
            className="rounded-2xl border border-white/10 bg-[#0c1220]/40 p-4"
          >
            <h4 className="text-base font-semibold text-white">{tier}</h4>
            <ul className="mt-3 space-y-2">
              {OFFER_COMPARISON.rows.map((row) => (
                <li
                  key={row.feature}
                  className="flex items-start justify-between gap-3 rounded-lg bg-white/[0.02] px-2 py-2.5 text-sm"
                >
                  <span className="min-w-0 flex-1 text-slate-300">{row.feature}</span>
                  <span className="shrink-0 text-right font-medium text-slate-200">
                    {typeof row.values[tier as OfferTier] === "boolean" ? (
                      <Cell included={row.values[tier as OfferTier]} />
                    ) : (
                      formatCellValue(row.values[tier as OfferTier])
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* Desktop : tableau scrollable si besoin */}
      <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#0c1220]/40 md:block">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Comparatif des offres Planory Autonome, Accompagné et Mission critique
          </caption>
          <thead>
            <tr>
              <th scope="col" className="px-4 py-3 font-medium text-slate-400">
                Inclus
              </th>
              {tiers.map((tier) => (
                <th
                  key={tier}
                  scope="col"
                  className="px-4 py-3 font-semibold text-slate-200"
                >
                  {tier}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OFFER_COMPARISON.rows.map((row) => (
              <tr key={row.feature} className="even:bg-white/[0.02]">
                <th scope="row" className="px-4 py-3 font-normal text-slate-300">
                  {row.feature}
                </th>
                {tiers.map((tier) => (
                  <td key={tier} className="px-4 py-3">
                    <Cell included={row.values[tier as OfferTier]} />
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
