import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { StickyContactBar } from "@/components/StickyContactBar";
import { MobileNavDrawer } from "@/components/nav/MobileNavDrawer";
import { NavDrawerProvider } from "@/components/nav/NavDrawerContext";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

type SiteShellProps = {
  children: React.ReactNode;
  currentPath?: string;
  breadcrumbs?: { name: string; path: string }[];
  /** landing = nav complète ; content = sans tab bar (articles, pages longues) */
  layout?: "landing" | "content";
};

export function SiteShell({
  children,
  currentPath = "/",
  breadcrumbs,
  layout = "landing",
}: SiteShellProps) {
  const isContent = layout === "content";

  return (
    <NavDrawerProvider>
      <Header />
      <Breadcrumbs currentPath={currentPath} trail={breadcrumbs} />
      <main
        id="main-content"
        className={
          isContent
            ? "pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-0"
            : "pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0"
        }
      >
        {children}
      </main>
      <Footer compactMobile={isContent} />
      {!isContent && <MobileTabBar />}
      <StickyContactBar hasTabBar={!isContent} />
      <MobileNavDrawer />
    </NavDrawerProvider>
  );
}
