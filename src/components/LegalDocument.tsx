import { sectionY } from "@/components/ui/section";
import { getLegalDoc, type LegalDocId } from "@/lib/legal";
import type { Locale } from "@/lib/i18n";

type LegalDocumentProps = {
  id: LegalDocId;
  locale?: Locale;
};

export function LegalDocument({ id, locale = "fr" }: LegalDocumentProps) {
  const doc = getLegalDoc(id, locale);

  return (
    <section className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{doc.heading}</h1>
        <p className="mt-3 text-sm text-slate-500">{doc.updatedLabel}</p>
        <div className="mt-10 space-y-10">
          {doc.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-white">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-slate-400">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
