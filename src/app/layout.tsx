import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { SkipToContent } from "@/components/SkipToContent";
import { createPageMetadata } from "@/lib/seo";
import { globalGraphJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050a14",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.planory.net"),
  ...createPageMetadata({ path: "/" }),
  applicationName: "Planory",
  category: "technology",
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: false,
  },
};

/** Root layout — Next.js 16 requires html/body here (not only under [locale]). */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-full w-full min-w-0 overflow-x-clip bg-[#050a14] font-sans text-white antialiased"
      >
        <SkipToContent />
        <JsonLd data={globalGraphJsonLd()} />
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
