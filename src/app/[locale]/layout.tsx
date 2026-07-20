import { Inter } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { SkipToContent } from "@/components/SkipToContent";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { globalGraphJsonLd } from "@/lib/seo";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return generateLocaleStaticParams();
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = parseLocaleParam((await params).locale);

  return (
    <html lang={locale} className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-full w-full min-w-0 overflow-x-clip bg-[#050a14] font-sans text-white antialiased"
      >
        <SkipToContent />
        <JsonLd data={globalGraphJsonLd()} />
        {children}
      </body>
    </html>
  );
}
