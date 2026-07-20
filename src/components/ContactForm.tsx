"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useLocale } from "@/components/LanguageSwitcher";
import type { ContactFormFieldErrors } from "@/lib/contact";
import { getContactFormCopy } from "@/lib/get-content";
import { localizePath } from "@/lib/i18n";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-[#050a14] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20";

const labelClassName = "mb-1.5 block text-left text-sm font-medium text-slate-300";

type ContactFormProps = {
  className?: string;
};

export function ContactForm({ className = "" }: ContactFormProps) {
  const locale = useLocale();
  const copy = getContactFormCopy(locale);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFormFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          gdprConsent,
          locale,
          companyWebsite,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        fields?: ContactFormFieldErrors;
      };

      if (!response.ok) {
        if (payload.fields) setFieldErrors(payload.fields);
        setFormError(payload.error ?? copy.formErrorGeneric);
        setStatus("idle");
        return;
      }

      setStatus("success");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setGdprConsent(false);
    } catch {
      setFormError(copy.networkError);
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
        <p className="mt-4 text-lg font-semibold text-white">{copy.successTitle}</p>
        <p className="mt-2 text-sm text-slate-400">{copy.successMessage}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          {copy.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative space-y-4 text-left ${className}`}
      noValidate
    >
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-companyWebsite">Company website</label>
        <input
          id="contact-companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-firstName" className={labelClassName}>
            {copy.firstNameLabel} <span className="text-sky-400">*</span>
          </label>
          <input
            id="contact-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.firstName)}
            aria-describedby={fieldErrors.firstName ? "contact-firstName-error" : undefined}
          />
          {fieldErrors.firstName && (
            <p id="contact-firstName-error" className="mt-1 text-xs text-red-400">
              {fieldErrors.firstName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-lastName" className={labelClassName}>
            {copy.lastNameLabel} <span className="text-sky-400">*</span>
          </label>
          <input
            id="contact-lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.lastName)}
            aria-describedby={fieldErrors.lastName ? "contact-lastName-error" : undefined}
          />
          {fieldErrors.lastName && (
            <p id="contact-lastName-error" className="mt-1 text-xs text-red-400">
              {fieldErrors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClassName}>
          {copy.emailLabel} <span className="text-sky-400">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
        />
        {fieldErrors.email && (
          <p id="contact-email-error" className="mt-1 text-xs text-red-400">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClassName}>
          {copy.phoneLabel}{" "}
          <span className="font-normal text-slate-500">{copy.phoneOptional}</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={copy.phonePlaceholder}
          className={inputClassName}
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
        />
        {fieldErrors.phone && (
          <p id="contact-phone-error" className="mt-1 text-xs text-red-400">
            {fieldErrors.phone}
          </p>
        )}
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
            aria-invalid={Boolean(fieldErrors.gdprConsent)}
            aria-describedby={fieldErrors.gdprConsent ? "contact-gdpr-error" : undefined}
          />
          <span className="text-sm leading-relaxed text-slate-400">
            {copy.gdprConsent}{" "}
            <Link
              href={localizePath("/confidentialite", locale)}
              className="text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
            >
              {copy.privacyLinkLabel}
            </Link>
            . <span className="text-sky-400">*</span>
          </span>
        </label>
        {fieldErrors.gdprConsent && (
          <p id="contact-gdpr-error" className="mt-2 text-xs text-red-400">
            {fieldErrors.gdprConsent}
          </p>
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
            {copy.submitting}
          </>
        ) : (
          <>
            {copy.submit}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
