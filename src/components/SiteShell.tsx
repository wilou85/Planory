import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { StickyContactBar } from "@/components/StickyContactBar";
import { MobileNavDrawer } from "@/components/nav/MobileNavDrawer";
import { NavDrawerProvider } from "@/components/nav/NavDrawerContext";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getLocaleFromPath, stripLocalePrefix } from "@/lib/i18n";

/** Contact + légales : pas de CTA flottant (page déjà une action / lecture). */
const STICKY_SUPPRESSED_PATHS = new Set([
  "/contact",
  "/mentions-legales",
  "/confidentialite",
]);

function shouldSuppressSticky(path: string): boolean {
  return STICKY_SUPPRESSED_PATHS.has(stripLocalePrefix(path));
}

/**
 * Espace bas pour tabs (~3.5rem) + sticky (~3.75rem au-dessus) + marge.
 * Appliqué au wrapper main+footer pour que le footer ne passe pas sous les barres.
 */
function chromeBottomClass(showTabBar: boolean, showSticky: boolean): string {
  if (showTabBar && showSticky) {
    return "pb-[calc(8.25rem+env(safe-area-inset-bottom))] lg:pb-0";
  }
  if (showTabBar) {
    return "pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0";
  }
  if (showSticky) {
    return "pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-0";
  }
  return "pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:pb-0";
}

type SiteShellProps = {
  children: React.ReactNode;
  currentPath?: string;
  breadcrumbs?: { name: string; path: string }[];
  /** landing = nav complète ; content = sans tab bar (articles, pages longues) */
  layout?: "landing" | "content";
  /** Fil d'Ariane renforcé (articles, guides) */
  breadcrumbVariant?: "default" | "content";
  /** Masque la barre contact flottante (ex. formulaire lead magnet) */
  suppressStickyContact?: boolean;
};

export function SiteShell({
  children,
  currentPath = "/",
  breadcrumbs,
  layout = "landing",
  breadcrumbVariant,
  suppressStickyContact = false,
}: SiteShellProps) {
  const isContent = layout === "content";
  const locale = getLocaleFromPath(currentPath);
  const showTabBar = !isContent;
  const showSticky = !suppressStickyContact && !shouldSuppressSticky(currentPath);

  return (
    <NavDrawerProvider>
      <Header />
      <Breadcrumbs
        currentPath={currentPath}
        trail={breadcrumbs}
        variant={breadcrumbVariant ?? (isContent ? "content" : "default")}
      />
      <div className={chromeBottomClass(showTabBar, showSticky)}>
        <main id="main-content" className="min-w-0 overflow-x-clip">
          {children}
        </main>
        <Footer locale={locale} />
      </div>
      {showTabBar && <MobileTabBar />}
      {showSticky && <StickyContactBar hasTabBar={showTabBar} />}
      <MobileNavDrawer />
    </NavDrawerProvider>
  );
}
