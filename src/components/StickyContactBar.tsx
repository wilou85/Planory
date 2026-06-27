"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Mail, MessageSquare } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/content";

const SECTORS = [
  "Hôpital",
  "Aéroport / ATC",
  "Industrie",
  "Commerce",
  "Services publics",
  "Autre",
];

type StickyContactBarProps = {
  hasTabBar?: boolean;
};

export function StickyContactBar({ hasTabBar = true }: StickyContactBarProps) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [sector, setSector] = useState(SECTORS[0]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = [
      `Secteur : ${sector}`,
      email ? `Email : ${email}` : "",
      "",
      message || "Bonjour, je souhaite échanger sur Planory.",
    ]
      .filter(Boolean)
      .join("\n");
    const subject = encodeURIComponent("Planory — demande de contact");
    const mailBody = encodeURIComponent(body);
    const mailEmail = encodeURIComponent(email);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${mailBody}${mailEmail ? `&reply-to=${mailEmail}` : ""}`;
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 z-40 px-3 lg:hidden"
      style={{
        bottom: hasTabBar
          ? "calc(3.75rem + env(safe-area-inset-bottom, 0px))"
          : "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mx-auto max-w-lg rounded-2xl border border-white/15 bg-[#0c1220]/95 shadow-2xl backdrop-blur-xl">
        {expanded ? (
          <form onSubmit={handleSubmit} className="space-y-3 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-white">Échanger 20 min</p>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Réduire
              </button>
            </div>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#050a14] px-3 py-2.5 text-sm text-white"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="email"
              required
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#050a14] px-3 py-2.5 text-sm text-white placeholder:text-slate-500"
            />
            <textarea
              rows={2}
              placeholder="Votre contexte (optionnel)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-lg border border-white/10 bg-[#050a14] px-3 py-2.5 text-sm text-white placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-medium text-[#050a14]"
            >
              <MessageSquare className="h-4 w-4" aria-hidden />
              Envoyer
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 p-2">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-white text-sm font-medium text-[#050a14]"
            >
              <MessageSquare className="h-4 w-4" aria-hidden />
              Échanger 20 min
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-4 text-xs font-medium text-white"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden />
              Email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
