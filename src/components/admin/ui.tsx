import { percentChange } from "@/lib/admin-analytics/labels";

export function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits }).format(value);
}

export function formatPercent(ratio: number, digits = 1): string {
  return `${formatNumber(ratio * 100, digits)} %`;
}

export function Card({
  title,
  hint,
  children,
  className = "",
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-white/10 bg-[#0c1220] p-4 ${className}`}>
      <h2 className="text-sm font-medium text-slate-200">{title}</h2>
      {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-16 pt-2 text-lg font-semibold text-white">
      {children}
    </h2>
  );
}

export function Delta({
  current,
  previous,
  invert = false,
}: {
  current: number;
  previous: number;
  /** For metrics where lower is better (e.g. search position). */
  invert?: boolean;
}) {
  const change = percentChange(current, previous);
  if (change === null) {
    return <span className="text-xs text-slate-500">pas de point de comparaison</span>;
  }
  const better = invert ? change < 0 : change > 0;
  const color = change === 0 ? "text-slate-400" : better ? "text-emerald-400" : "text-rose-400";
  return (
    <span className={`text-xs ${color}`}>
      {change > 0 ? "+" : ""}
      {formatNumber(change)} % vs période précédente
    </span>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  delta,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0c1220] p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {delta ? <p className="mt-1">{delta}</p> : null}
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function Empty({ children = "Pas encore de données sur la période." }: { children?: React.ReactNode }) {
  return <p className="text-sm text-slate-500">{children}</p>;
}

export function BarList({
  rows,
  format = (value) => formatNumber(value),
}: {
  rows: { key: string; label: string; value: number; detail?: string }[];
  format?: (value: number) => string;
}) {
  if (rows.length === 0) return <Empty />;
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <ul className="space-y-1.5 text-sm">
      {rows.map((row) => (
        <li key={row.key} className="relative overflow-hidden rounded-md px-2 py-1.5">
          <div
            className="absolute inset-y-0 left-0 rounded-md bg-sky-500/15"
            style={{ width: `${(row.value / max) * 100}%` }}
            aria-hidden
          />
          <div className="relative flex items-baseline justify-between gap-3">
            <span className="truncate text-slate-200" title={row.label}>
              {row.label}
            </span>
            <span className="shrink-0 text-white">
              {format(row.value)}
              {row.detail ? <span className="ml-2 text-xs text-slate-400">{row.detail}</span> : null}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: { label: string; align?: "right" }[];
  rows: { key: string; cells: React.ReactNode[] }[];
}) {
  if (rows.length === 0) return <Empty />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            {columns.map((column) => (
              <th
                key={column.label}
                className={`pb-2 font-medium ${column.align === "right" ? "text-right" : ""}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, index) => (
                <td
                  key={columns[index]?.label ?? index}
                  className={`py-1.5 ${
                    columns[index]?.align === "right" ? "text-right text-white" : "text-slate-200"
                  } ${index === 0 ? "max-w-[18rem] truncate" : "whitespace-nowrap pl-3"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
