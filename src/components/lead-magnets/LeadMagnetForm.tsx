"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Download, Loader2 } from "lucide-react";
import type { LeadMagnetFormFieldErrors } from "@/lib/lead-magnets/types";
import type { LeadMagnetSlug } from "@/lib/lead-magnets/types";
import {
  LEAD_MAGNET_ROLE_LABELS,
  LEAD_MAGNET_SECTOR_LABELS,
} from "@/lib/lead-magnets";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-[#050a14] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20";

const labelClassName = "mb-1.5 block text-left text-sm font-medium text-slate-300";

type LeadMagnetFormProps = {
  magnetSlug: LeadMagnetSlug;
  downloadPath: string;
  downloadFileName: string;
  submitLabel?: string;
  className?: string;
};

export function LeadMagnetForm({
  magnetSlug,
  downloadPath,
  downloadFileName,
  submitLabel = "Recevoir le PDF",
  className = "",
}: LeadMagnetFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [sector, setSector] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LeadMagnetFormFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [devBypass, setDevBypass] = useState(false);
  const [emailFailed, setEmailFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setStatus("loading");

    try {
      const response = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          role,
          sector,
          gdprConsent,
          magnetSlug,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        fields?: LeadMagnetFormFieldErrors;
        downloadPath?: string;
        devBypass?: boolean;
        emailFailed?: boolean;
      };

      if (!response.ok) {
        if (payload.fields) setFieldErrors(payload.fields);
        if (payload.emailFailed && payload.downloadPath) {
          setEmailFailed(true);
          setDevBypass(false);
          setStatus("success");
          return;
        }
        setFormError(payload.error ?? "Une erreur est survenue.");
        setStatus("idle");
        return;
      }

      setDevBypass(payload.devBypass === true);
      setEmailFailed(false);
      setStatus("success");
    } catch {
      setFormError("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-8 text-center ${className}`}
        role="status"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-white">Ressource prête</p>
        <p className="mt-2 text-sm text-slate-400">
          {devBypass
            ? "Mode local : le PDF est disponible ci-dessous (email non envoyé — configurez RESEND_API_KEY pour la prod)."
            : emailFailed
              ? "L'email n'a pas pu être envoyé (configuration Resend en cours). Téléchargez le PDF directement ci-dessous."
              : "Un email avec le lien de téléchargement vient de vous être envoyé."}
        </p>
        {!devBypass && !emailFailed && (
          <p className="mt-1 text-xs text-slate-500">
            Le téléchargement direct est aussi disponible ci-dessous.
          </p>
        )}
        <a
          href={downloadPath}
          download={downloadFileName}
          className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-medium text-[#050a14] transition-opacity hover:bg-slate-100"
        >
          <Download className="h-4 w-4" aria-hidden />
          Télécharger maintenant
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 text-left ${className}`} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lm-firstName" className={labelClassName}>
            Prénom <span className="text-sky-400">*</span>
          </label>
          <input
            id="lm-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.firstName)}
          />
          {fieldErrors.firstName && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.firstName}</p>
          )}
        </div>
        <div>
          <label htmlFor="lm-lastName" className={labelClassName}>
            Nom <span className="text-sky-400">*</span>
          </label>
          <input
            id="lm-lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.lastName)}
          />
          {fieldErrors.lastName && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="lm-email" className={labelClassName}>
          Email professionnel <span className="text-sky-400">*</span>
        </label>
        <input
          id="lm-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
          aria-invalid={Boolean(fieldErrors.email)}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lm-role" className={labelClassName}>
            Fonction <span className="text-sky-400">*</span>
          </label>
          <select
            id="lm-role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.role)}
          >
            <option value="" disabled>
              Sélectionner…
            </option>
            {Object.entries(LEAD_MAGNET_ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {fieldErrors.role && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.role}</p>
          )}
        </div>
        <div>
          <label htmlFor="lm-sector" className={labelClassName}>
            Secteur <span className="text-sky-400">*</span>
          </label>
          <select
            id="lm-sector"
            name="sector"
            required
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.sector)}
          >
            <option value="" disabled>
              Sélectionner…
            </option>
            {Object.entries(LEAD_MAGNET_SECTOR_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {fieldErrors.sector && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.sector}</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-[#050a14]/60 p-4">
        <label className="flex items-start gap-3 text-left">
          <input
            type="checkbox"
            name="gdprConsent"
            required
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-[#050a14] text-sky-500 focus:ring-sky-500/30"
          />
          <span className="text-sm leading-relaxed text-slate-400">
            J&apos;accepte que Planory traite mes données pour m&apos;envoyer cette ressource
            et, le cas échéant, un suivi commercial, conformément au RGPD.{" "}
            <span className="text-sky-400">*</span>
          </span>
        </label>
        {fieldErrors.gdprConsent && (
          <p className="mt-2 text-xs text-red-400">{fieldErrors.gdprConsent}</p>
        )}
      </div>

      {formError && (
        <p
          className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-medium text-[#050a14] transition-opacity hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Envoi en cours…
          </>
        ) : (
          <>
            {submitLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
