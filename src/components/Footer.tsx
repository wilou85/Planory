import Link from "next/link";
import { getPageUi } from "@/lib/get-content";
import { localizePath, type Locale } from "@/lib/i18n";

type FooterProps = {
  compactMobile?: boolean;
  locale?: Locale;
};

export function Footer({ compactMobile = false, locale = "fr" }: FooterProps) {
  const year = new Date().getFullYear();
  const ui = getPageUi(locale);
  const links = [
    { href: localizePath("/faq", locale), label: ui.footer.faqLabel },
    { href: localizePath("/contact", locale), label: ui.footer.contactLabel },
  ];

  return (
    <footer
      className={`py-5 sm:py-6 ${
        compactMobile
          ? "pb-[calc(1rem+env(safe-area-inset-bottom))]"
          : "pb-[calc(4.5rem+env(safe-area-inset-bottom))]"
      } lg:pb-8`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p suppressHydrationWarning>© {year} Planory</p>
          <nav
            aria-label={ui.footer.navAriaLabel}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-end"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-slate-300"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:contact@planory.net"
              className="transition-colors hover:text-slate-300"
            >
              contact@planory.net
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
