import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { StickyContactBar } from "@/components/StickyContactBar";
import { MobileNavDrawer } from "@/components/nav/MobileNavDrawer";
import { NavDrawerProvider } from "@/components/nav/NavDrawerContext";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getLocaleFromPath } from "@/lib/i18n";

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

  return (
    <NavDrawerProvider>
      <Header />
      <Breadcrumbs
        currentPath={currentPath}
        trail={breadcrumbs}
        variant={breadcrumbVariant ?? (isContent ? "content" : "default")}
      />
      <main
        id="main-content"
        className={`min-w-0 overflow-x-clip ${
          isContent
            ? "pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-0"
            : "pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-0"
        }`}
      >
        {children}
      </main>
      <Footer compactMobile={isContent} locale={locale} />
      {!isContent && <MobileTabBar />}
      {!suppressStickyContact && <StickyContactBar hasTabBar={!isContent} />}
      <MobileNavDrawer />
    </NavDrawerProvider>
  );
}
