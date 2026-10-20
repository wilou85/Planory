"use client";

import { useEffect, useState } from "react";
import type { RecentLogin } from "@/lib/admin-auth/users";
import { Card, DataTable, Empty } from "@/components/admin/ui";

type Security = {
  email: string;
  emailCodes: "resend" | "console" | "off";
  codeTtlMinutes: number;
  recentLogins: RecentLogin[];
};

const REASON_LABELS: Record<string, string> = {
  password: "Échec : mot de passe",
  code: "Échec : code e-mail",
};

function shortUserAgent(userAgent: string | null): string {
  if (!userAgent) return "—";
  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /Firefox\//.test(userAgent)
      ? "Firefox"
      : /Chrome\//.test(userAgent)
        ? "Chrome"
        : /Safari\//.test(userAgent)
          ? "Safari"
          : "Autre";
  const os = /Windows/.test(userAgent)
    ? "Windows"
    : /Android/.test(userAgent)
      ? "Android"
      : /iPhone|iPad/.test(userAgent)
        ? "iOS"
        : /Mac OS X/.test(userAgent)
          ? "macOS"
          : /Linux/.test(userAgent)
            ? "Linux"
            : "";
  return os ? `${browser} · ${os}` : browser;
}

export function SecurityPanel() {
  const [security, setSecurity] = useState<Security | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/security")
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) {
          setError("Impossible de charger les informations de sécurité");
          return;
        }
        setSecurity((await response.json()) as Security);
      })
      .catch(() => active && setError("Impossible de charger les informations de sécurité"));
    return () => {
      active = false;
    };
  }, []);

  if (error && !security) return <p className="text-sm text-rose-300">{error}</p>;
  if (!security) return <Empty>Chargement…</Empty>;

  return (
    <div className="grid gap-4">
      <Card
        title="Double authentification par e-mail"
        hint={`À chaque connexion, après le mot de passe, un code à 6 chiffres valable ${security.codeTtlMinutes} minutes est envoyé à l'adresse du compte. Il ne sert qu'une fois et se bloque après 5 essais.`}
      >
        {security.emailCodes === "resend" ? (
          <p className="text-sm text-emerald-400">
            Active : les codes sont envoyés à {security.email}.
          </p>
        ) : security.emailCodes === "console" ? (
          <p className="text-sm text-amber-300">
            Mode développement : <code className="text-sky-300">RESEND_API_KEY</code> est absente, le code
            s&apos;affiche dans la console du serveur au lieu d&apos;être envoyé.
          </p>
        ) : (
          <p className="text-sm text-rose-300">
            Envoi impossible : ajoutez <code className="text-sky-300">RESEND_API_KEY</code> (et{" "}
            <code className="text-sky-300">CONTACT_EMAIL_FROM</code>) aux variables d&apos;environnement du
            serveur, sinon plus personne ne pourra se connecter.
          </p>
        )}
      </Card>

      <Card title="Dernières connexions">
        <DataTable
          columns={[{ label: "Date" }, { label: "Compte" }, { label: "Résultat" }, { label: "IP" }, { label: "Navigateur" }]}
          rows={security.recentLogins.map((login, index) => ({
            key: `${login.at}-${index}`,
            cells: [
              new Date(login.at).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
              login.email,
              login.success ? (
                <span className="text-emerald-400">Réussie</span>
              ) : (
                <span className="text-rose-300">{REASON_LABELS[login.reason ?? ""] ?? "Échec"}</span>
              ),
              login.ip ?? "—",
              shortUserAgent(login.userAgent),
            ],
          }))}
        />
      </Card>
    </div>
  );
}
