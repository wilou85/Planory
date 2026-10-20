"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-[#0c1220] px-3 py-2 text-white outline-none focus:border-sky-400";

type LoginResponse = { error?: string; codeRequired?: boolean; message?: string } | null;

export function AdminLoginForm({ nextPath = "/admin" }: { nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeRequired, setCodeRequired] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(withCode: boolean) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withCode ? { email, password, code } : { email, password }),
      });
      if (response.ok) {
        router.replace(nextPath.startsWith("/admin") ? nextPath : "/admin");
        router.refresh();
        return;
      }
      const body = (await response.json().catch(() => null)) as LoginResponse;
      setCode("");
      if (body?.codeRequired) {
        setCodeRequired(true);
        if (body.message) setNotice(body.message);
      }
      if (body?.error) setError(body.error);
      else if (!body?.codeRequired) setError("Connexion impossible");
    } catch {
      setError("Connexion impossible");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit(codeRequired);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="admin-email" className="mb-1 block text-sm text-slate-300">
          E-mail
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          readOnly={codeRequired}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1 block text-sm text-slate-300">
          Mot de passe
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          readOnly={codeRequired}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClassName}
        />
      </div>
      {codeRequired ? (
        <div>
          <label htmlFor="admin-code" className="mb-1 block text-sm text-slate-300">
            Code reçu par e-mail
          </label>
          <input
            id="admin-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={`${inputClassName} tracking-[0.4em]`}
          />
          {notice ? <p className="mt-2 text-sm text-slate-400">{notice}</p> : null}
          <button
            type="button"
            disabled={pending}
            onClick={() => void submit(false)}
            className="mt-2 text-sm text-sky-300 underline-offset-2 hover:underline disabled:opacity-60"
          >
            Renvoyer un code
          </button>
        </div>
      ) : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-sky-500 px-3 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
      >
        {pending ? "Connexion…" : codeRequired ? "Valider le code" : "Se connecter"}
      </button>
    </form>
  );
}
