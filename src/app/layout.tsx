import type { Metadata, Viewport } from "next";
import { createPageMetadata } from "@/lib/seo";

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

/** Pass-through — html/body live in `src/app/[locale]/layout.tsx`. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
