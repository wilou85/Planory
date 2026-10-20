"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalyticsRange } from "@/lib/admin-analytics/range";
import {
  emptyAnalyticsSummary,
  type AnalyticsSummary,
} from "@/lib/admin-analytics/summary";
import {
  contactSourceLabel,
  deviceLabel,
  mediumLabel,
  rateWebVital,
  webVitalLabel,
  webVitalUnit,
} from "@/lib/admin-analytics/labels";
import { SearchConsolePanel } from "@/components/admin/SearchConsolePanel";
import { SecurityPanel } from "@/components/admin/SecurityPanel";
import {
  BarList,
  Card,
  DataTable,
  Delta,
  Empty,
  KpiCard,
  SectionTitle,
  formatNumber,
  formatPercent,
} from "@/components/admin/ui";

const RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
];

const SECTIONS = [
  { id: "vue-ensemble", label: "Vue d'ensemble" },
  { id: "acquisition", label: "Acquisition" },
  { id: "conversions", label: "Conversions" },
  { id: "contenu", label: "Contenu" },
  { id: "google", label: "Google" },
  { id: "technique", label: "Technique" },
  { id: "securite", label: "Sécurité" },
];

const RATING_STYLES = {
  good: { color: "text-emerald-400", label: "Bon" },
  "needs-improvement": { color: "text-amber-300", label: "À améliorer" },
  poor: { color: "text-rose-400", label: "Mauvais" },
} as const;

const share = (part: number, total: number) => (total > 0 ? part / total : 0);

function SeriesBars({ series }: { series: AnalyticsSummary["series"] }) {
  if (series.length === 0) return <Empty />;
  const max = Math.max(1, ...series.map((p) => p.pageviews));
  return (
    <div className="flex h-40 items-end gap-1 overflow-x-auto">
      {series.map((point) => (
        <div key={point.day} className="flex min-w-[10px] flex-1 flex-col items-center justify-end">
          <div
            className="w-full rounded-t bg-sky-500/80"
            style={{ height: `${Math.max(4, (point.pageviews / max) * 100)}%` }}
            title={`${point.day} : ${point.pageviews} pages vues, ${point.sessions} sessions`}
          />
        </div>
      ))}
    </div>
  );
}

function Funnel({ steps }: { steps: { label: string; hint: string; value: number }[] }) {
  const top = Math.max(1, steps[0]?.value ?? 0);
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => {
        const previous = index > 0 ? steps[index - 1].value : null;
        return (
          <li key={step.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-slate-200">
                {step.label} <span className="text-xs text-slate-500">— {step.hint}</span>
              </span>
              <span className="shrink-0 text-white">
                {formatNumber(step.value, 0)}
                {previous !== null ? (
                  <span className="ml-2 text-xs text-slate-400">
                    {formatPercent(share(step.value, previous))} de l&apos;étape précédente
                  </span>
                ) : null}
              </span>
            </div>
            <div className="mt-1 h-3 rounded-full bg-white/5">
              <div
                className="h-3 rounded-full bg-sky-500"
                style={{ width: `${Math.max(1, (step.value / top) * 100)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

type LoadResult = { range: AnalyticsRange; error: string | null };

const LOAD_ERROR = "Impossible de charger les statistiques";

export function AdminDashboard({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [result, setResult] = useState<LoadResult | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary>(() => emptyAnalyticsSummary("30d"));

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/analytics/summary?range=${range}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (!response.ok) {
          setResult({ range, error: LOAD_ERROR });
          return;
        }
        setSummary((await response.json()) as AnalyticsSummary);
        setResult({ range, error: null });
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ range, error: LOAD_ERROR });
      });
    return () => controller.abort();
  }, [range, router]);

  const loading = result?.range !== range;
  const error = loading ? null : (result?.error ?? null);
  const { previous, funnels } = summary;
  const lead = funnels.lead_magnet;
  const localeTotal = summary.locales.reduce((sum, row) => sum + row.pageviews, 0);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sky-400">Planory</p>
          <h1 className="text-2xl font-semibold text-white">Tableau de bord</h1>
          <p className="text-sm text-slate-400">{initialEmail}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-white/10 bg-[#0c1220] p-1">
            {RANGES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setRange(item.value)}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  range === item.value ? "bg-sky-500 text-slate-950" : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:border-white/30 hover:text-white"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <nav className="sticky top-0 z-10 -mx-4 flex gap-1 overflow-x-auto border-b border-white/10 bg-[#050a14]/95 px-4 py-2 backdrop-blur">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="shrink-0 rounded-md px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
          >
            {section.label}
          </a>
        ))}
      </nav>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-400">Chargement…</p> : null}
      <p className="text-xs text-slate-500">
        Mesure limitée aux visiteurs ayant accepté la « Mesure d&apos;audience ». Une session se termine après
        30 minutes d&apos;inactivité.
      </p>

      <SectionTitle id="vue-ensemble">Vue d&apos;ensemble</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Visiteurs uniques"
          value={formatNumber(summary.visitors, 0)}
          hint={`dont ${formatNumber(summary.returning_visitors, 0)} déjà venus (plusieurs visites)`}
          delta={<Delta current={summary.visitors} previous={previous.visitors} />}
        />
        <KpiCard
          label="Visites (sessions)"
          value={formatNumber(summary.sessions, 0)}
          delta={<Delta current={summary.sessions} previous={previous.sessions} />}
        />
        <KpiCard
          label="Conversions"
          value={formatNumber(summary.conversions, 0)}
          hint={`${formatPercent(summary.conversion_rate)} des visites · contact ou ressource téléchargée`}
          delta={<Delta current={summary.conversions} previous={previous.conversions} />}
        />
        <KpiCard
          label="Pages vues"
          value={formatNumber(summary.pageviews, 0)}
          delta={<Delta current={summary.pageviews} previous={previous.pageviews} />}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard
          label="Visites engagées"
          value={formatPercent(share(summary.engaged_sessions, summary.sessions))}
          hint="2 pages ou plus, page clé vue, ou conversion"
        />
        <KpiCard label="Temps moyen par page" value={`${formatNumber(summary.avg_page_time_s)} s`} />
        <KpiCard label="Défilement moyen" value={`${formatNumber(summary.avg_scroll_depth)} %`} />
      </div>
      <Card title="Pages vues par jour">
        <SeriesBars series={summary.series} />
      </Card>

      <SectionTitle id="acquisition">Acquisition : d&apos;où viennent les visiteurs</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Sources de trafic" hint="Attribuées à la première page de chaque visite">
          <DataTable
            columns={[
              { label: "Source" },
              { label: "Canal" },
              { label: "Visites", align: "right" },
              { label: "Conversions", align: "right" },
              { label: "Taux", align: "right" },
            ]}
            rows={summary.sources.map((row) => ({
              key: `${row.source}-${row.medium}`,
              cells: [
                row.source === "direct" ? "Direct" : row.source,
                mediumLabel(row.medium),
                formatNumber(row.sessions, 0),
                formatNumber(row.conversions, 0),
                formatPercent(share(row.conversions, row.sessions)),
              ],
            }))}
          />
        </Card>
        <Card title="Pages d'entrée" hint="Première page vue de la visite, et ce qu'elle rapporte">
          <DataTable
            columns={[
              { label: "Page" },
              { label: "Visites", align: "right" },
              { label: "Conversions", align: "right" },
              { label: "Taux", align: "right" },
            ]}
            rows={summary.entry_pages.map((row) => ({
              key: row.path,
              cells: [
                row.path,
                formatNumber(row.sessions, 0),
                formatNumber(row.conversions, 0),
                formatPercent(share(row.conversions, row.sessions)),
              ],
            }))}
          />
        </Card>
      </div>

      <SectionTitle id="conversions">Conversions</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Entonnoir de conversion">
          <Funnel
            steps={[
              { label: "Visites", hint: "toutes les sessions", value: summary.sessions },
              {
                label: "Visites engagées",
                hint: "2 pages ou plus, ou page produit / offre / secteur / contact",
                value: summary.engaged_sessions,
              },
              {
                label: "Conversions",
                hint: "clic « Prendre contact » ou ressource téléchargée",
                value: summary.conversions,
              },
            ]}
          />
        </Card>
        <Card title="Clics « Prendre contact » par bouton" hint="Ouvre la messagerie avec un e-mail pré-rempli">
          <BarList
            rows={summary.contact_sources.map((row) => ({
              key: row.source,
              label: contactSourceLabel(row.source),
              value: row.count,
            }))}
          />
        </Card>
        <Card title="Ressources gratuites (formulaire)">
          <Funnel
            steps={[
              { label: "Formulaire commencé", hint: "premier champ rempli", value: lead.form_start },
              { label: "Formulaire envoyé", hint: "ressource obtenue", value: lead.form_submit },
            ]}
          />
          <p className="mt-3 text-xs text-slate-400">
            {formatNumber(lead.form_error, 0)} erreur(s) de saisie ou d&apos;envoi sur la période.
          </p>
          {lead.magnets.length > 0 ? (
            <div className="mt-4 border-t border-white/5 pt-3">
              <BarList
                rows={lead.magnets.map((magnet) => ({
                  key: magnet.magnetSlug,
                  label: magnet.magnetSlug,
                  value: magnet.form_submit,
                }))}
              />
            </div>
          ) : null}
        </Card>
        <Card title="Intérêt par secteur" hint="Clics sur les cartes secteurs de la page d'accueil">
          <BarList
            rows={funnels.sectors.by_sector.map((row) => ({
              key: row.sector,
              label: row.sector,
              value: row.count,
            }))}
          />
        </Card>
      </div>

      <SectionTitle id="contenu">Contenu et audience</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Pages les plus vues" className="lg:col-span-2">
          <BarList
            rows={summary.top_pages.map((page) => ({
              key: page.path,
              label: page.path,
              value: page.pageviews,
            }))}
          />
        </Card>
        <div className="space-y-4">
          <Card title="Langue du site">
            <BarList
              rows={summary.locales.map((row) => ({
                key: row.locale,
                label: row.locale === "en" ? "Anglais (/en)" : "Français",
                value: row.pageviews,
                detail: formatPercent(share(row.pageviews, localeTotal), 0),
              }))}
            />
          </Card>
          <Card title="Appareils" hint="En nombre de visites">
            <BarList
              rows={summary.devices.map((row) => ({
                key: row.device,
                label: deviceLabel(row.device),
                value: row.count,
              }))}
            />
          </Card>
        </div>
      </div>

      <SectionTitle id="google">Référencement Google (Search Console)</SectionTitle>
      <SearchConsolePanel range={range} />

      <SectionTitle id="technique">Santé technique</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Vitesse ressentie (Core Web Vitals)"
          hint="75e percentile des visites réelles : 3 visiteurs sur 4 ont fait au moins aussi bien"
        >
          {summary.web_vitals.length === 0 ? (
            <Empty />
          ) : (
            <ul className="space-y-2 text-sm">
              {summary.web_vitals.map((vital) => {
                const rating = RATING_STYLES[rateWebVital(vital.name, vital.p75)];
                const unit = webVitalUnit(vital.name);
                return (
                  <li key={vital.name} className="flex items-baseline justify-between gap-3">
                    <span className="text-slate-200">{webVitalLabel(vital.name)}</span>
                    <span className="shrink-0">
                      <span className={rating.color}>
                        {unit === "ms"
                          ? `${formatNumber(vital.p75 / 1000, 2)} s`
                          : formatNumber(vital.p75, 3)}{" "}
                        · {rating.label}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">
                        {formatPercent(vital.good_share, 0)} de bonnes visites · {vital.samples} mesures
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <Card title="Erreurs JavaScript" hint="Bugs rencontrés par les visiteurs dans leur navigateur">
          <DataTable
            columns={[
              { label: "Message" },
              { label: "Page" },
              { label: "Occurrences", align: "right" },
              { label: "Visites", align: "right" },
            ]}
            rows={summary.js_errors.map((row) => ({
              key: row.message,
              cells: [
                <span key="m" title={row.message}>
                  {row.message}
                </span>,
                row.path,
                formatNumber(row.count, 0),
                formatNumber(row.sessions, 0),
              ],
            }))}
          />
        </Card>
      </div>

      <SectionTitle id="securite">Sécurité du compte</SectionTitle>
      <SecurityPanel />
    </div>
  );
}
