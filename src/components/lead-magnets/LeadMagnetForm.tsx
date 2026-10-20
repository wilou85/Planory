"use client";

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Download, Loader2 } from "lucide-react";
import type { LeadMagnetFormFieldErrors } from "@/lib/lead-magnets/types";
import type { LeadMagnetSlug } from "@/lib/lead-magnets/types";
import {
  getLeadMagnetFormCopy,
  getLeadMagnetRoleLabels,
  getLeadMagnetSectorLabels,
} from "@/lib/lead-magnets";
import type { Locale } from "@/lib/i18n";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { describeFormError, leadMagnetPayload } from "@/lib/analytics/conversions";

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
  /** Optional diagnostic payload from the online checklist (ignored by PDF POST if unused). */
  diagnostic?: unknown;
};

export function LeadMagnetForm({
  magnetSlug,
  downloadPath,
  downloadFileName,
  submitLabel,
  className = "",
  locale = "fr",
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
  const [devBypass, setDevBypass] = useState(false);
  const [emailFailed, setEmailFailed] = useState(false);
  const started = useRef(false);

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
          locale,
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
          track("form_submit");
          setEmailFailed(true);
          setDevBypass(false);
          setStatus("success");
          return;
        }
        track("form_error", describeFormError(response.status, payload.fields));
        setFormError(payload.error ?? copy.formErrorGeneric);
        setStatus("idle");
        return;
      }

      track("form_submit");
      setDevBypass(payload.devBypass === true);
      setEmailFailed(false);
      setStatus("success");
    } catch {
      track("form_error", describeFormError(null, undefined));
      setFormError(copy.networkError);
      setStatus("idle");
    }
  }

  function track(type: "form_start" | "form_submit" | "form_error", detail?: object) {
    void trackAnalyticsEvent(type, { payload: leadMagnetPayload(magnetSlug, detail) });
  }

  function handleFirstFocus() {
    if (started.current) return;
    started.current = true;
    track("form_start");
  }

  if (status === "success") {
    return (
      <div
        className={`rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-8 text-center ${className}`}
        role="status"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-white">{copy.successTitle}</p>
        <p className="mt-2 text-sm text-slate-400">
          {devBypass
            ? copy.successDevBypass
            : emailFailed
              ? copy.successEmailFailed
              : copy.successEmailSent}
        </p>
        {!devBypass && !emailFailed && (
          <p className="mt-1 text-xs text-slate-500">{copy.successEmailHint}</p>
        )}
        <a
          href={downloadPath}
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
    <form
      onSubmit={handleSubmit}
      onFocus={handleFirstFocus}
      className={`space-y-4 text-left ${className}`}
      noValidate
    >
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
            <option value="" disabled>
              {copy.selectPlaceholder}
            </option>
            {Object.entries(roleLabels).map(([value, label]) => (
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
            <option value="" disabled>
              {copy.selectPlaceholder}
            </option>
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

      <div className="rounded-lg border border-white/8 bg-[#050a14]/60 p-4">
        <label className="flex min-h-[44px] items-start gap-3 text-left">
          <input
            type="checkbox"
            name="gdprConsent"
            required
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            className="mt-2.5 h-5 w-5 shrink-0 rounded border-white/20 bg-[#050a14] text-sky-500 focus:ring-sky-500/30"
          />
          <span className="text-sm leading-relaxed text-slate-400">
            {copy.gdprConsent} <span className="text-sky-400">*</span>
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
            {copy.submitLoading}
          </>
        ) : (
          <>
            {resolvedSubmitLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
