import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_PAGES } from "@/lib/site";

type BreadcrumbItem = { name: string; path: string };

type BreadcrumbsProps = {
  currentPath: string;
  trail?: BreadcrumbItem[];
};

export function Breadcrumbs({ currentPath, trail }: BreadcrumbsProps) {
  if (currentPath === "/") return null;

  const items: BreadcrumbItem[] =
    trail ??
    (() => {
      const current = SITE_PAGES.find((p) => p.path === currentPath);
      if (!current) return [];
      return [{ name: current.label, path: current.path }];
    })();

  if (!items.length) return null;

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="site-header-offset mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8"
    >
      <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:text-sm">
        <li>
          <Link href="/" className="transition-colors hover:text-white">
            Accueil
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              <span aria-hidden>
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
              {isLast ? (
                <span aria-current="page" className="font-medium text-slate-300">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-white">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
