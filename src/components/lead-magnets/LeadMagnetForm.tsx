"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Download, Loader2 } from "lucide-react";
import type { LeadMagnetFormFieldErrors } from "@/lib/lead-magnets/types";
import type { LeadMagnetSlug } from "@/lib/lead-magnets/types";
import {
  getLeadMagnetFormCopy,
  getLeadMagnetRoleLabels,
  getLeadMagnetSectorLabels,
} from "@/lib/lead-magnets";
import { validateLeadMagnetForm } from "@/lib/lead-magnet";
import type { LeadMagnetDiagnosticSummary } from "@/lib/lead-magnet";
import type { Locale } from "@/lib/i18n";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-[#050a14] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20";

const labelClassName = "mb-1.5 block text-left text-sm font-medium text-slate-300";

type LeadMagnetFormProps = {
  magnetSlug: LeadMagnetSlug;
  downloadPath: string;
  downloadFileName: string;
  submitLabel?: string;
  className?: string;
  locale?: Locale;
  diagnostic?: LeadMagnetDiagnosticSummary | null;
};

function diagnosticFingerprint(diagnostic: LeadMagnetDiagnosticSummary | null | undefined) {
  if (!diagnostic) return "";
  const ids = [...(diagnostic.checkedIds ?? [])].sort().join(",");
  return `${diagnostic.score}:${diagnostic.maxScore}:${diagnostic.percentage}:${ids}`;
}

function triggerPdfDownloadFromUrl(downloadPath: string, downloadFileName: string) {
  const link = document.createElement("a");
  link.href = downloadPath;
  link.download = downloadFileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function triggerPdfDownloadFromBase64(base64: string, downloadFileName: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  triggerPdfDownloadFromUrl(url, downloadFileName);
  return url;
}

export function LeadMagnetForm({
  magnetSlug,
  downloadPath,
  downloadFileName,
  submitLabel,
  className = "",
  locale = "fr",
  diagnostic = null,
}: LeadMagnetFormProps) {
  const copy = getLeadMagnetFormCopy(locale);
  const roleLabels = getLeadMagnetRoleLabels(locale);
  const sectorLabels = getLeadMagnetSectorLabels(locale);
  const resolvedSubmitLabel = submitLabel ?? copy.receivePdf;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [sector, setSector] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LeadMagnetFormFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null);
  const pdfDiagnosticKeyRef = useRef<string | null>(null);

  // Changement du questionnaire après génération → invalider le PDF prêt.
  useEffect(() => {
    if (status !== "success" || pdfDiagnosticKeyRef.current === null) return;
    if (diagnosticFingerprint(diagnostic) === pdfDiagnosticKeyRef.current) return;

    setPdfObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    pdfDiagnosticKeyRef.current = null;
    setStatus("idle");
    setFormError(null);
  }, [diagnostic, status]);

  useEffect(() => {
    return () => {
      if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
    };
  }, [pdfObjectUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setStatus("loading");

    const payload = {
      firstName,
      lastName,
      email,
      role,
      sector,
      gdprConsent,
      magnetSlug,
      locale,
    };

    const local = validateLeadMagnetForm(payload);
    if (!local.ok) {
      setFieldErrors(local.errors);
      setFormError(copy.formErrorGeneric);
      setStatus("idle");
      return;
    }

    try {
      const response = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          diagnostic: diagnostic ?? undefined,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        fields?: LeadMagnetFormFieldErrors;
        pdfBase64?: string | null;
        downloadFileName?: string;
      };

      if (!response.ok) {
        if (data.fields) setFieldErrors(data.fields);
        setFormError(data.error ?? copy.formErrorGeneric);
        setStatus("idle");
        return;
      }

      const fileName = data.downloadFileName || downloadFileName;
      setPdfObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      if (data.pdfBase64) {
        const url = triggerPdfDownloadFromBase64(data.pdfBase64, fileName);
        setPdfObjectUrl(url);
      } else {
        triggerPdfDownloadFromUrl(downloadPath, fileName);
      }
      pdfDiagnosticKeyRef.current = diagnosticFingerprint(diagnostic);
      setStatus("success");
    } catch {
      triggerPdfDownloadFromUrl(downloadPath, downloadFileName);
      pdfDiagnosticKeyRef.current = diagnosticFingerprint(diagnostic);
      setStatus("success");
    }
  }

  if (status === "success") {
    const href = pdfObjectUrl ?? downloadPath;
    return (
      <div
        className={`rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-8 text-center ${className}`}
        role="status"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-white">{copy.successTitle}</p>
        <p className="mt-2 text-sm text-slate-400">{copy.successDownload}</p>
        <a
          href={href}
          download={downloadFileName}
          className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-medium text-[#050a14] transition-opacity hover:bg-slate-100"
        >
          <Download className="h-4 w-4" aria-hidden />
          {copy.downloadNow}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 text-left ${className}`} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lm-firstName" className={labelClassName}>
            {copy.firstNameLabel} <span className="text-sky-400">*</span>
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
            {copy.lastNameLabel} <span className="text-sky-400">*</span>
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
          {copy.emailLabel} <span className="text-sky-400">*</span>
        </label>
        <input
          id="lm-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
          aria-invalid={Boolean(fieldErrors.email)}
        />
        {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lm-role" className={labelClassName}>
            {copy.roleLabel} <span className="text-sky-400">*</span>
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
            <option value="">{copy.selectPlaceholder}</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {fieldErrors.role && <p className="mt-1 text-xs text-red-400">{fieldErrors.role}</p>}
        </div>
        <div>
          <label htmlFor="lm-sector" className={labelClassName}>
            {copy.sectorLabel} <span className="text-sky-400">*</span>
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
            <option value="">{copy.selectPlaceholder}</option>
            {Object.entries(sectorLabels).map(([value, label]) => (
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

      <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-400">
        <input
          type="checkbox"
          checked={gdprConsent}
          onChange={(e) => setGdprConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-[#050a14] text-sky-500"
          aria-invalid={Boolean(fieldErrors.gdprConsent)}
        />
        <span>{copy.gdprConsent}</span>
      </label>
      {fieldErrors.gdprConsent && (
        <p className="text-xs text-red-400">{fieldErrors.gdprConsent}</p>
      )}

      {formError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-medium text-[#050a14] transition-opacity hover:bg-slate-100 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <ArrowRight className="h-4 w-4" aria-hidden />
        )}
        {resolvedSubmitLabel}
      </button>
    </form>
  );
}
