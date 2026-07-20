import { ORGANIZATION, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

/** Coordonnées éditeur — compléter SIRET / adresse dès qu'elles sont disponibles. */
export const LEGAL_ENTITY = {
  brandName: SITE_NAME,
  email: ORGANIZATION.email,
  siteUrl: SITE_URL,
  host: {
    name: "Vercel Inc.",
    address: "440 Casey Ave Suite A, Mountain View, CA 94085, United States",
    website: "https://vercel.com",
  },
} as const;

export type LegalDocId = "mentions" | "privacy";

type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type LegalDoc = {
  path: string;
  title: string;
  description: string;
  heading: string;
  updatedLabel: string;
  sections: LegalSection[];
};

const DOCS: Record<Locale, Record<LegalDocId, LegalDoc>> = {
  fr: {
    mentions: {
      path: "/mentions-legales",
      title: "Mentions légales | Planory",
      description:
        "Mentions légales du site Planory : éditeur, hébergeur, contact et propriété intellectuelle.",
      heading: "Mentions légales",
      updatedLabel: "Dernière mise à jour : 20 juillet 2026",
      sections: [
        {
          heading: "1. Éditeur du site",
          paragraphs: [
            `Le site ${LEGAL_ENTITY.siteUrl} est édité sous la marque ${LEGAL_ENTITY.brandName}.`,
            `Contact : ${LEGAL_ENTITY.email}`,
          ],
        },
        {
          heading: "2. Directeur de la publication",
          paragraphs: [
            `Le directeur de la publication est le responsable de la marque ${LEGAL_ENTITY.brandName}, joignable à l'adresse ${LEGAL_ENTITY.email}.`,
          ],
        },
        {
          heading: "3. Hébergement",
          paragraphs: [
            `Le site est hébergé par ${LEGAL_ENTITY.host.name}, ${LEGAL_ENTITY.host.address}.`,
            `Site de l'hébergeur : ${LEGAL_ENTITY.host.website}`,
          ],
        },
        {
          heading: "4. Propriété intellectuelle",
          paragraphs: [
            `L'ensemble des contenus du site (textes, visuels, logos, marques, architecture) est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.`,
            `La marque ${LEGAL_ENTITY.brandName} et le moteur SKYNET désignent des éléments distinctifs de l'offre Planory.`,
          ],
        },
        {
          heading: "5. Limitation de responsabilité",
          paragraphs: [
            "Les informations publiées sur ce site ont une vocation informative. Planory s'efforce d'en assurer l'exactitude, sans garantie d'exhaustivité. L'utilisation des informations se fait sous la seule responsabilité de l'utilisateur.",
          ],
        },
        {
          heading: "6. Contact",
          paragraphs: [
            `Pour toute question relative aux présentes mentions : ${LEGAL_ENTITY.email}`,
          ],
        },
      ],
    },
    privacy: {
      path: "/confidentialite",
      title: "Politique de confidentialité | Planory",
      description:
        "Politique de confidentialité Planory : données collectées via les formulaires, finalités, durée de conservation et droits RGPD.",
      heading: "Politique de confidentialité",
      updatedLabel: "Dernière mise à jour : 20 juillet 2026",
      sections: [
        {
          heading: "1. Responsable du traitement",
          paragraphs: [
            `Le responsable du traitement des données collectées via le site ${LEGAL_ENTITY.siteUrl} est ${LEGAL_ENTITY.brandName}, joignable à ${LEGAL_ENTITY.email}.`,
          ],
        },
        {
          heading: "2. Données collectées",
          paragraphs: [
            "Via le formulaire de contact : prénom, nom, adresse e-mail, numéro de téléphone (facultatif), et le consentement au traitement.",
            "Via les outils / lead magnets : prénom, nom, adresse e-mail, et le consentement associé le cas échéant.",
            "Des données techniques de navigation (journaux serveur, cookies strictement nécessaires au fonctionnement) peuvent être traitées pour assurer la sécurité et la disponibilité du site.",
          ],
        },
        {
          heading: "3. Finalités et base légale",
          paragraphs: [
            "Répondre aux demandes de contact ou de démonstration (intérêt légitime / exécution de mesures précontractuelles, et consentement lorsque requis).",
            "Envoyer les ressources demandées (guides, grilles, PDF) lorsque vous les sollicitez.",
            "Assurer le fonctionnement, la sécurité et l'amélioration du site.",
          ],
        },
        {
          heading: "4. Destinataires",
          paragraphs: [
            "Les données sont destinées aux équipes Planory en charge du suivi commercial et du support.",
            "Des prestataires techniques (hébergement, envoi d'e-mails transactionnels) peuvent traiter des données pour notre compte, dans le respect du RGPD.",
          ],
        },
        {
          heading: "5. Durée de conservation",
          paragraphs: [
            "Les demandes de contact sont conservées pendant une durée maximale de 3 ans à compter du dernier échange, sauf obligation légale contraire.",
            "Les logs techniques sont conservés pour une durée limitée compatible avec les finalités de sécurité.",
          ],
        },
        {
          heading: "6. Vos droits",
          paragraphs: [
            "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité, dans les conditions prévues par la loi.",
            `Pour exercer vos droits : ${LEGAL_ENTITY.email}. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).`,
          ],
        },
        {
          heading: "7. Cookies",
          paragraphs: [
            "Le site utilise des cookies ou technologies similaires nécessaires au fonctionnement (session, sécurité). Aucun cookie publicitaire tiers n'est déployé à ce jour. Si la politique évolue, cette page sera mise à jour.",
          ],
        },
      ],
    },
  },
  en: {
    mentions: {
      path: "/mentions-legales",
      title: "Legal notice | Planory",
      description:
        "Planory legal notice: publisher, hosting provider, contact and intellectual property.",
      heading: "Legal notice",
      updatedLabel: "Last updated: 20 July 2026",
      sections: [
        {
          heading: "1. Publisher",
          paragraphs: [
            `The website ${LEGAL_ENTITY.siteUrl} is published under the ${LEGAL_ENTITY.brandName} brand.`,
            `Contact: ${LEGAL_ENTITY.email}`,
          ],
        },
        {
          heading: "2. Publication director",
          paragraphs: [
            `The publication director is the person responsible for the ${LEGAL_ENTITY.brandName} brand, reachable at ${LEGAL_ENTITY.email}.`,
          ],
        },
        {
          heading: "3. Hosting",
          paragraphs: [
            `The site is hosted by ${LEGAL_ENTITY.host.name}, ${LEGAL_ENTITY.host.address}.`,
            `Host website: ${LEGAL_ENTITY.host.website}`,
          ],
        },
        {
          heading: "4. Intellectual property",
          paragraphs: [
            "All website content (text, visuals, logos, trademarks, structure) is protected by intellectual property law. Unauthorised reproduction is prohibited.",
            `The ${LEGAL_ENTITY.brandName} brand and the SKYNET engine are distinctive elements of the Planory offering.`,
          ],
        },
        {
          heading: "5. Limitation of liability",
          paragraphs: [
            "Information on this site is provided for informational purposes. Planory strives for accuracy without guaranteeing completeness. Use of the information is at the user's sole responsibility.",
          ],
        },
        {
          heading: "6. Contact",
          paragraphs: [
            `For questions about this legal notice: ${LEGAL_ENTITY.email}`,
          ],
        },
      ],
    },
    privacy: {
      path: "/confidentialite",
      title: "Privacy policy | Planory",
      description:
        "Planory privacy policy: data collected via forms, purposes, retention and GDPR rights.",
      heading: "Privacy policy",
      updatedLabel: "Last updated: 20 July 2026",
      sections: [
        {
          heading: "1. Data controller",
          paragraphs: [
            `The controller of personal data collected via ${LEGAL_ENTITY.siteUrl} is ${LEGAL_ENTITY.brandName}, reachable at ${LEGAL_ENTITY.email}.`,
          ],
        },
        {
          heading: "2. Data we collect",
          paragraphs: [
            "Via the contact form: first name, last name, email address, phone number (optional), and processing consent.",
            "Via tools / lead magnets: first name, last name, email address, and associated consent where applicable.",
            "Technical browsing data (server logs, strictly necessary cookies) may be processed to keep the site secure and available.",
          ],
        },
        {
          heading: "3. Purposes and legal bases",
          paragraphs: [
            "Responding to contact or demo requests (legitimate interest / pre-contractual steps, and consent where required).",
            "Sending requested resources (guides, grids, PDFs) when you ask for them.",
            "Operating, securing and improving the website.",
          ],
        },
        {
          heading: "4. Recipients",
          paragraphs: [
            "Data is processed by Planory teams handling sales follow-up and support.",
            "Technical providers (hosting, transactional email) may process data on our behalf in compliance with the GDPR.",
          ],
        },
        {
          heading: "5. Retention",
          paragraphs: [
            "Contact requests are retained for up to 3 years from the last exchange, unless a longer legal obligation applies.",
            "Technical logs are retained for a limited period consistent with security purposes.",
          ],
        },
        {
          heading: "6. Your rights",
          paragraphs: [
            "Under the GDPR you have rights of access, rectification, erasure, restriction, objection and portability, subject to legal conditions.",
            `To exercise your rights: ${LEGAL_ENTITY.email}. You may also lodge a complaint with your supervisory authority (in France: CNIL, www.cnil.fr).`,
          ],
        },
        {
          heading: "7. Cookies",
          paragraphs: [
            "The site uses cookies or similar technologies required for operation (session, security). No third-party advertising cookies are deployed at this time. This page will be updated if that changes.",
          ],
        },
      ],
    },
  },
};

export function getLegalDoc(id: LegalDocId, locale: Locale = "fr"): LegalDoc {
  return DOCS[locale][id];
}
