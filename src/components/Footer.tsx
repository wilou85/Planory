import Link from "next/link";
import { getPageUi } from "@/lib/get-content";
import { CONTACT_EMAIL } from "@/lib/contact-nav";
import { localizePath, type Locale } from "@/lib/i18n";
import { getLiveBrandProfiles } from "@/lib/site";

type FooterProps = {
  locale?: Locale;
};

export function Footer({ locale = "fr" }: FooterProps) {
  const year = new Date().getFullYear();
  const ui = getPageUi(locale);
  const profiles = getLiveBrandProfiles();
  const links = [
    { href: localizePath("/faq", locale), label: ui.footer.faqLabel },
    { href: localizePath("/contact", locale), label: ui.footer.contactLabel },
    { href: localizePath("/mentions-legales", locale), label: ui.footer.legalLabel },
    { href: localizePath("/confidentialite", locale), label: ui.footer.privacyLabel },
  ];

  return (
    <footer className="py-5 sm:py-6 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-400 sm:flex-row">
          <p suppressHydrationWarning>© {year} Planory</p>
          <nav
            aria-label={ui.footer.navAriaLabel}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[44px] items-center transition-colors hover:text-slate-300 md:min-h-0"
              >
                {link.label}
              </Link>
            ))}
            {profiles.map((profile) => (
              <a
                key={profile.id}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer me"
                className="inline-flex min-h-[44px] items-center transition-colors hover:text-slate-300 md:min-h-0"
              >
                {profile.platform}
              </a>
            ))}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex min-h-[44px] items-center transition-colors hover:text-slate-300 md:min-h-0"
            >
              {CONTACT_EMAIL}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

