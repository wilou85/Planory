import {
  COMPARISON_CAPTION,
  COMPETITOR_COMPARISON,
  COMPETITOR_COMPARISON_CAPTION,
  COMPETITOR_COMPARISON_FOOTNOTE,
  EXCEL_PLANORY_HOLYDIS_COLUMNS,
  EXCEL_SIRH_PLANORY_COLUMNS,
  PLANNING_COMPARISON,
  COMPARISON_FOOTNOTE,
  formatComparisonCell,
  type ComparisonCell,
  type ComparisonColumn,
  type ComparisonRowGeneric,
} from "@/lib/geo";

type ComparisonTableProps = {
  id?: string;
  title: string;
  intro: string;
  caption: string;
  footnote: string;
  columns: ComparisonColumn[];
  rows: ComparisonRowGeneric[];
  className?: string;
};

function CellBadge({ value }: { value: ComparisonCell }) {
  const label = formatComparisonCell(value);
  const styles =
    value === "yes"
      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
      : value === "partial"
        ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
        : value === "no"
          ? "bg-slate-500/10 text-slate-500 ring-slate-500/20"
          : "bg-white/5 text-slate-300 ring-white/10";

  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${styles}`}
    >
      {label}
    </span>
  );
}

function ComparisonTable({
  id = "comparatif",
  title,
  intro,
  caption,
  footnote,
  columns,
  rows,
  className = "",
}: ComparisonTableProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      data-geo="comparison"
      className={className}
    >
      <h2 id={`${id}-heading`} className="text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">{intro}</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0c1220]/60">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th scope="col" className="px-4 py-3 font-semibold text-slate-300">
                Critère
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 font-semibold ${col.highlight ? "text-sky-300" : "text-slate-300"}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.criterion} className="border-b border-white/5 last:border-0">
                <th scope="row" className="px-4 py-3 font-medium text-slate-200">
                  {row.criterion}
                </th>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <CellBadge value={row.cells[col.key] ?? "—"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p data-geo="comparison-footnote" className="mt-4 text-sm leading-relaxed text-slate-500">
        {footnote}
      </p>
    </section>
  );
}

type PlanningComparisonTableProps = {
  className?: string;
  id?: string;
};

export function CompetitorComparisonTable({
  className = "",
  id = "comparatif-excel-planory-holydis",
}: PlanningComparisonTableProps) {
  return (
    <ComparisonTable
      id={id}
      title="Excel vs Planory vs Holy-Dis (Timesquare)"
      intro="Comparatif des solutions de planification d'équipes en France — tableur, logiciel IA émergent et WFM établi."
      caption={COMPETITOR_COMPARISON_CAPTION}
      footnote={COMPETITOR_COMPARISON_FOOTNOTE}
      columns={EXCEL_PLANORY_HOLYDIS_COLUMNS}
      rows={COMPETITOR_COMPARISON}
      className={className}
    />
  );
}

export function PlanningComparisonTable({
  className = "",
  id = "comparatif-excel-sirh-planory",
}: PlanningComparisonTableProps) {
  return (
    <ComparisonTable
      id={id}
      title="Excel vs SIRH vs Planory"
      intro="Comparatif par type d'outil — tableur, suite RH generaliste et logiciel de planification 24/7."
      caption={COMPARISON_CAPTION}
      footnote={COMPARISON_FOOTNOTE}
      columns={EXCEL_SIRH_PLANORY_COLUMNS}
      rows={PLANNING_COMPARISON}
      className={className}
    />
  );
}
