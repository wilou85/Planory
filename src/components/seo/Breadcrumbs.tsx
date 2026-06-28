import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getHeaderCopy,
  getLocaleFromPath,
  getSitePageBreadcrumbLabel,
  homePath,
  isLocaleHome,
  stripLocalePrefix,
} from "@/lib/i18n";
import { getSitePage } from "@/lib/site";

type BreadcrumbItem = { name: string; path: string };

type BreadcrumbsProps = {
  currentPath: string;
  trail?: BreadcrumbItem[];
  /** Pages contenu long (articles) : fil d'Ariane plus visible */
  variant?: "default" | "content";
};

function normalizeTrail(trail: BreadcrumbItem[]): BreadcrumbItem[] {
  if (trail.length > 0 && (trail[0].path === "/" || trail[0].path === "/en")) {
    return trail.slice(1);
  }
  return trail;
}

export function Breadcrumbs({ currentPath, trail, variant = "default" }: BreadcrumbsProps) {
  if (isLocaleHome(currentPath)) return null;

  const locale = getLocaleFromPath(currentPath);
  const copy = getHeaderCopy(locale);
  const items: BreadcrumbItem[] = normalizeTrail(
    trail ??
      (() => {
        const basePath = stripLocalePrefix(currentPath);
        const label = getSitePageBreadcrumbLabel(basePath, locale);
        if (!label || !getSitePage(basePath)) return [];
        return [{ name: label, path: currentPath }];
      })(),
  );

  if (!items.length) return null;

  const isContent = variant === "content";

  return (
    <nav
      aria-label={copy.breadcrumbLabel}
      className={`site-header-offset mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
        isContent ? "pb-3" : "pb-2"
      }`}
    >
      <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:text-sm">
        <li>
          <Link href={homePath(locale)} className="transition-colors hover:text-white">
            {copy.breadcrumbHome}
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex min-w-0 items-center gap-1">
              <span aria-hidden>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </span>
              {isLast ? (
                <span
                  aria-current="page"
                  className={`font-medium text-slate-300 ${isContent ? "line-clamp-2 sm:line-clamp-1" : ""}`}
                  title={item.name}
                >
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
