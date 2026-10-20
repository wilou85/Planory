import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable | Planory",
  robots: { index: false, follow: false },
  alternates: {},
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-6 py-24"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sky-400">404</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Cette page n&apos;existe pas</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-400">
        L&apos;adresse est introuvable. Le contenu a peut-être été déplacé.
      </p>
      <Link href="/" className="mt-8 text-sm font-medium text-sky-300 hover:text-sky-200">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
