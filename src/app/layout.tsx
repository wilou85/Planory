import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, globalGraphJsonLd } from "@/lib/seo";
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-[#050a14]"
        >
          Aller au contenu
        </a>
        <JsonLd data={globalGraphJsonLd()} />
        {children}
      </body>
    </html>
  );
}
