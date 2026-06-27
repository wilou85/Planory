import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { ResourceArticle } from "@/lib/resources";

type ResourceArticleContentProps = {
  article: ResourceArticle;
};

export function ResourceArticleContent({ article }: ResourceArticleContentProps) {
  return (
    <article className="relative py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Guide · {article.readTime}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{article.description}</p>
        </header>

        <div className="prose-planory mt-10 space-y-6">
          {article.sections.map((section, index) => {
            switch (section.type) {
              case "h2":
                return (
                  <h2
                    key={index}
                    className="pt-4 text-2xl font-bold text-white first:pt-0"
                  >
                    {section.text}
                  </h2>
                );
              case "h3":
                return (
                  <h3 key={index} className="text-lg font-semibold text-white">
                    {section.text}
                  </h3>
                );
              case "p":
                return (
                  <p key={index} className="text-base leading-relaxed text-slate-400">
                    {section.text}
                  </p>
                );
              case "ul":
                return (
                  <ul key={index} className="space-y-2 pl-1">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-base leading-relaxed text-slate-400"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              case "cta":
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-6 text-center"
                  >
                    <p className="text-base text-slate-300">{section.text}</p>
                    <div className="mt-4">
                      <Button href={section.href} variant="primary" showArrow external>
                        {section.label}
                      </Button>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        <footer className="mt-12 border-t border-white/10 pt-8">
          <p className="text-sm text-slate-500">
            <Link href="/ressources" className="text-sky-400 hover:text-sky-300">
              ← Tous les guides
            </Link>
            {" · "}
            <Link href="/secteurs/hopital" className="text-sky-400 hover:text-sky-300">
              Planning hospitalier
            </Link>
            {" · "}
            <Link href="/produit" className="text-sky-400 hover:text-sky-300">
              Produit Planory
            </Link>
          </p>
        </footer>
      </div>
    </article>
  );
}
