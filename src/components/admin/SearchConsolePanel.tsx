"use client";

import { useEffect, useState } from "react";
import type { AnalyticsRange } from "@/lib/admin-analytics/range";
import type { SearchConsoleSummary, SearchRow } from "@/lib/search-console";
import { Card, DataTable, Delta, Empty, KpiCard, formatNumber, formatPercent } from "@/components/admin/ui";

type State =
  | { range: AnalyticsRange; status: "error"; message: string }
  | { range: AnalyticsRange; status: "done"; data: SearchConsoleSummary };

const searchColumns = (first: string) => [
  { label: first },
  { label: "Clics", align: "right" as const },
  { label: "Impressions", align: "right" as const },
  { label: "CTR", align: "right" as const },
  { label: "Position", align: "right" as const },
];

const toRows = (rows: SearchRow[]) =>
  rows.map((row) => ({
    key: row.key,
    cells: [
      row.key,
      formatNumber(row.clicks, 0),
      formatNumber(row.impressions, 0),
      formatPercent(row.ctr),
      formatNumber(row.position),
    ],
  }));

function SetupInstructions() {
  return (
    <Card title="Search Console non configurée" hint="Les données Google (clics, impressions, requêtes) apparaîtront ici.">
      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-300">
        <li>
          Dans Google Cloud Console, créez un projet puis activez l&apos;API{" "}
          <span className="text-white">Google Search Console API</span>.
        </li>
        <li>Créez un compte de service et téléchargez sa clé au format JSON.</li>
        <li>
          Dans Search Console → Paramètres → Utilisateurs et autorisations, ajoutez l&apos;adresse e-mail du
          compte de service avec l&apos;autorisation <span className="text-white">Restreint</span> (lecture
          seule).
        </li>
        <li>
          Sur le serveur, définissez <code className="text-sky-300">GSC_SITE_URL</code> (
          <code className="text-sky-300">sc-domain:planory.net</code>),{" "}
          <code className="text-sky-300">GOOGLE_SERVICE_ACCOUNT_EMAIL</code> et{" "}
          <code className="text-sky-300">GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY</code> (champ{" "}
          <code>private_key</code> du JSON), puis redémarrez le site.
        </li>
      </ol>
    </Card>
  );
}

export function SearchConsolePanel({ range }: { range: AnalyticsRange }) {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/search-console?range=${range}`, { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as
          | (SearchConsoleSummary & { error?: string })
          | null;
        if (!response.ok || !body) {
          setState({ range, status: "error", message: body?.error ?? "Search Console indisponible" });
          return;
        }
        setState({ range, status: "done", data: body });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ range, status: "error", message: "Search Console indisponible" });
        }
      });
    return () => controller.abort();
  }, [range]);

  if (!state || state.range !== range) return <Empty>Chargement des données Google…</Empty>;
  if (state.status === "error") {
    return <p className="text-sm text-rose-300">Search Console : {state.message}</p>;
  }
  if (!state.data.configured) return <SetupInstructions />;

  const { totals, previous, queries, pages, startDate, endDate } = state.data;
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Du {startDate} au {endDate} (Google publie les données avec 1 à 2 jours de décalage).
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Clics depuis Google"
          value={formatNumber(totals.clicks, 0)}
          delta={<Delta current={totals.clicks} previous={previous.clicks} />}
        />
        <KpiCard
          label="Impressions"
          value={formatNumber(totals.impressions, 0)}
          delta={<Delta current={totals.impressions} previous={previous.impressions} />}
        />
        <KpiCard
          label="Taux de clic (CTR)"
          value={formatPercent(totals.ctr)}
          delta={<Delta current={totals.ctr} previous={previous.ctr} />}
        />
        <KpiCard
          label="Position moyenne"
          value={totals.position ? formatNumber(totals.position) : "—"}
          hint="Plus c'est bas, mieux c'est"
          delta={<Delta current={totals.position} previous={previous.position} invert />}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Requêtes Google" hint="Ce que les internautes ont tapé avant de voir Planory">
          <DataTable columns={searchColumns("Requête")} rows={toRows(queries)} />
        </Card>
        <Card title="Pages dans Google">
          <DataTable columns={searchColumns("Page")} rows={toRows(pages)} />
        </Card>
      </div>
    </div>
  );
}
