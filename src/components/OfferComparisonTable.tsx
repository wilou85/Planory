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

export function OfferComparisonTable() {
  const tiers = OFFER_COMPARISON.tiers;

  return (
    <section aria-labelledby="offer-compare-heading" className="mt-8 hidden sm:block">
      <h3 id="offer-compare-heading" className="text-lg font-bold text-white sm:text-xl">
        Comparer les offres
      </h3>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#0c1220]/40">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Comparatif des offres Planory Autonome, Accompagné et Mission critique
          </caption>
          <thead>
            <tr className="border-b border-white/10">
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
              <tr key={row.feature} className="border-b border-white/5 last:border-0">
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
