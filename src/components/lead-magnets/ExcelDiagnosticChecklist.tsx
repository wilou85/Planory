"use client";

import { useMemo, useState } from "react";
import {
  EXCEL_DIAGNOSTIC_CRITERIA,
  scoreExcelDiagnostic,
} from "@/lib/lead-magnets/content";

const ZONE_STYLES = {
  green: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    label: "Zone verte",
  },
  orange: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    label: "Zone orange",
  },
  red: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    text: "text-red-300",
    label: "Zone rouge",
  },
} as const;

export function ExcelDiagnosticChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const result = useMemo(() => scoreExcelDiagnostic(checked), [checked]);

  const byCategory = useMemo(() => {
    const map = new Map<string, typeof EXCEL_DIAGNOSTIC_CRITERIA>();
    for (const c of EXCEL_DIAGNOSTIC_CRITERIA) {
      const list = map.get(c.category) ?? [];
      list.push(c);
      map.set(c.category, list);
    }
    return map;
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const zoneStyle = ZONE_STYLES[result.zone];

  return (
    <div className="space-y-6" data-lead-magnet="excel-diagnostic">
      <p className="text-sm text-slate-400">
        Cochez les critères qui s&apos;appliquent à votre situation. Le score se calcule
        automatiquement.
      </p>

      {Array.from(byCategory.entries()).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {category}
          </h3>
          <ul className="mt-3 space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/6 bg-[#050a14]/40 px-3 py-2.5 transition-colors hover:border-white/12">
                  <input
                    type="checkbox"
                    checked={checked.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-[#050a14] text-sky-500"
                  />
                  <span className="text-sm leading-relaxed text-slate-300">
                    {item.label}
                    <span className="ml-1 text-xs text-slate-500">
                      ({item.weight} pt{item.weight > 1 ? "s" : ""})
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div
        className={`rounded-xl border p-5 ${zoneStyle.border} ${zoneStyle.bg}`}
        role="status"
        aria-live="polite"
      >
        <p className={`text-sm font-semibold ${zoneStyle.text}`}>{zoneStyle.label}</p>
        <p className="mt-1 text-2xl font-bold text-white">
          {result.score} / {result.maxScore} pts ({result.percentage} %)
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{result.message}</p>
      </div>
    </div>
  );
}
