import { DocumentLocale } from "@/components/DocumentLocale";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";

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
    <>
      <DocumentLocale locale={locale} />
      {children}
    </>
  );
}
