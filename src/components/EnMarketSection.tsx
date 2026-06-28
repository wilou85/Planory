import Link from "next/link";
import { ContactButton } from "@/components/ContactButton";
import { sectionY } from "@/components/ui/section";
import { localizePath } from "@/lib/i18n";

export function EnMarketSection() {
  return (
    <section className={`${sectionY}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Healthcare workforce scheduling software for regulated 24/7 teams
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-400">
          Planory is a French{" "}
          <span className="font-medium text-slate-300">workforce scheduling software</span> built
          for hospitals, airports, industry and public services. The SKYNET AI engine generates
          compliant shift proposals in under 2 minutes — planners review, adjust and publish.
        </p>

        <h3 className="mt-10 text-xl font-semibold text-white">
          Healthcare workforce scheduling software
        </h3>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          Hospitals and care facilities need{" "}
          <span className="font-medium text-slate-300">healthcare workforce scheduling software</span>{" "}
          that handles 12-hour shifts, on-call rotation, weekend equity and regulatory rest periods.
          Planory models medical qualifications, ward coverage and guard duties — then SKYNET
          generates a compliant proposal your clinical managers validate before publication.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Related (French site):{" "}
          <Link href={localizePath("/secteurs/hopital", "en")} className="text-sky-400 hover:text-sky-300">
            hospital scheduling
          </Link>
          {" · "}
          <Link href={localizePath("/ressources/planning-hospitalier", "en")} className="text-sky-400 hover:text-sky-300">
            hospital planning guide
          </Link>
        </p>

        <h3 className="mt-10 text-xl font-semibold text-white">
          Shift planning software for airports and industry
        </h3>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          Beyond healthcare, Planory serves as{" "}
          <span className="font-medium text-slate-300">shift planning software</span> for
          airports, continuous manufacturing and public services. Complex 24/7 rotations, night
          shifts and on-call constraints are encoded as first-class rules — not spreadsheet
          formulas checked after the fact.
        </p>

        <h3 className="mt-10 text-xl font-semibold text-white">
          Why teams choose Planory as workforce scheduling software
        </h3>
        <ul className="mt-4 space-y-3">
          {[
            "AI optimization (SKYNET) with full human control: draft → validation → publication.",
            "Integrated HR planning: skills, qualifications and individual constraints.",
            "Automatic compliance with rest periods and business rules.",
            "Complements your HRIS or time-tracking system — Planory focuses on scheduling, not clocking.",
            "French-built solution — live pilot at Paris-Orly Airport.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-base leading-relaxed text-slate-400">
          Whether you search for{" "}
          <span className="font-medium text-slate-300">healthcare workforce scheduling software</span>{" "}
          or a broader{" "}
          <span className="font-medium text-slate-300">workforce scheduling software</span> for
          complex 24/7 operations, Planory combines operational scheduling with an AI optimization
          engine designed for regulated environments.
        </p>

        <div className="mt-8">
          <ContactButton variant="primary" showArrow>
            Get in touch
          </ContactButton>
        </div>
      </div>
    </section>
  );
}
