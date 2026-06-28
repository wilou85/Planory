import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/content";
import { BRAND, SITE_NAME, SITE_URL } from "@/lib/site";

export function BrandPresenceSection() {
  const externalLinks = BRAND.sameAs.filter(Boolean);

  return (
    <section
      aria-labelledby="brand-presence-heading"
      data-geo="brand-authority"
      className="py-14 sm:py-16"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 id="brand-presence-heading" className="text-xl font-bold text-white sm:text-2xl">
          {SITE_NAME} — marque et références
        </h2>

        <p
          data-geo="brand-positioning"
          className="mt-4 text-base leading-relaxed text-slate-400"
        >
          {BRAND.definition}
        </p>

        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-300">Référence pilote</dt>
            <dd className="mt-1 text-slate-400">
              {BRAND.pilotReference.name} — {BRAND.pilotReference.status}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-300">Site officiel</dt>
            <dd className="mt-1">
              <Link href="/" className="text-sky-400 hover:text-sky-300">
                {SITE_URL}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-300">Contact</dt>
            <dd className="mt-1">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-400 hover:text-sky-300">
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
          {externalLinks.length > 0 && (
            <div>
              <dt className="font-medium text-slate-300">Profils officiels</dt>
              <dd className="mt-1 flex flex-wrap gap-3">
                {externalLinks.map((url) => (
                  <a
                    key={url}
                    href={url}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="text-sky-400 hover:text-sky-300"
                  >
                    {new URL(url).hostname}
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
