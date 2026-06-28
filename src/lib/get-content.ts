import type { Locale } from "./i18n";
import * as FR from "./content";
import * as EN from "./content-en";
import { HOSPITAL_SECTOR } from "./hospital-sector";

const PAGE_UI_FR = {
  product: {
    sectionLabel: "Produit",
    heading: ["Logiciel planning équipe,", "planification RH & planning social"] as const,
    intro:
      "Planory est un logiciel de gestion des plannings du personnel en environnement 24/7. Que vous cherchiez un planning logiciel pour structurer vos roulements ou un logiciel d'optimisation de planning, SKYNET encode vos contraintes métier et légales puis propose une solution conforme — vos planificateurs gardent la main sur la validation et la publication.",
    relatedArticles: {
      label: "Articles associés :",
      links: [
        { href: "/ressources/logiciel-planning-equipe", label: "logiciel planning équipe" },
        { href: "/ressources/planning-social", label: "planning social" },
        { href: "/ressources/travail-nuit-planning-2x8", label: "travail de nuit et 2×8" },
        { href: "/faq", label: "FAQ Planory vs GTA" },
      ],
    },
  },
  sectors: {
    sectionLabel: "Secteurs",
    heading: "Des exemples concrets par secteur",
    intro:
      "Planory s'adapte à la structure de contraintes de chaque secteur — réglementaire, opérationnel ou social.",
    learnMore: "En savoir plus →",
  },
  offer: {
    sectionLabel: "Offre",
    heading: "Trois niveaux d'engagement",
    intro:
      "Pas de grille tarifaire publique : chaque déploiement est unique. Nous recommandons le niveau adapté à votre contexte lors du premier échange.",
  },
  faq: {
    sectionLabel: "FAQ",
    heading: "Questions fréquentes",
  },
  contact: {
    badge: "Un premier échange, sans prérequis",
    heading: "Parlons de votre contexte",
    intro:
      "20 minutes pour couvrir vos contraintes clés, évaluer la faisabilité, et définir le niveau d'accompagnement adapté.",
  },
  resources: {
    sectionLabel: "Articles",
    heading: "Guides planification & planning équipes",
    intro:
      "Articles pratiques sur la planification d'équipes, les astreintes et les roulements 24/7.",
    readTimeSuffix: "de lecture",
    emptyMessage: "De nouveaux guides seront publiés prochainement.",
    emptyCta: "Nous contacter",
  },
  footer: {
    navAriaLabel: "Liens footer",
    faqLabel: "FAQ",
    contactLabel: "Contact",
  },
  layout: {
    skipToContent: "Aller au contenu",
  },
  productShowcase: {
    items: [
      {
        src: "/produit-planning-equipe.png",
        alt: "Interface Planory — planning équipe avec roulements, astreintes et codes métier sur un horizon mensuel",
        caption: "Planning équipe — vue mensuelle avec contraintes et codes métier",
      },
      {
        src: "/produit-secteurs-planning.png",
        alt: "Planory — planification 24/7 pour aéroport, hôpital et industrie avec calendrier de roulements",
        caption: "Hôpital, aéroport, industrie — un même moteur de planification",
      },
    ],
  },
  offerCompare: {
    heading: "Comparer les offres",
    includedColumn: "Inclus",
    includedValue: "Inclus",
    notIncludedValue: "Non inclus",
    tableCaption:
      "Comparatif des offres Planory Autonome, Accompagné et Mission critique",
  },
  productSidebar: {
    label: "Modules",
    navAriaLabel: "Modules produit",
  },
  hospital: {
    cta: "Échanger sur votre planning hospitalier",
    relatedLabel: "Guides associés :",
    faqHeading: "Questions fréquentes",
    relatedLinks: [
      { href: "/ressources/planning-hospitalier", label: "planning hospitalier" },
      { href: "/ressources/planning-medical", label: "planning médical" },
      { href: "/ressources/planning-12h-hopital", label: "planning en 12 heures" },
      { href: "/ressources/gestion-astreintes", label: "gestion des astreintes" },
      { href: "/ressources/travail-nuit-planning-2x8", label: "travail de nuit et 2×8" },
      { href: "/produit", label: "logiciel de gestion de planning" },
    ],
  },
  resourcesArticle: {
    guidePrefix: "Guide ·",
    published: "Publié le",
    updated: "Mis à jour le",
    seeAlso: "Voir aussi :",
    allGuides: "← Tous les guides",
    sectors: "Secteurs",
    product: "Produit Planory",
  },
} as const;

export const CONTACT_FORM_COPY = {
  fr: {
    firstNameLabel: "Prénom",
    lastNameLabel: "Nom",
    emailLabel: "Email",
    phoneLabel: "Téléphone",
    phonePlaceholder: "06 12 34 56 78",
    gdprConsent:
      "J'accepte que Planory traite mes données (nom, prénom, email, téléphone) afin de répondre à ma demande de contact, conformément au RGPD.",
    submit: "Envoyer ma demande",
    submitting: "Envoi en cours…",
    successTitle: "Message envoyé",
    successMessage: "Nous vous recontacterons rapidement à l'adresse indiquée.",
    sendAnother: "Envoyer un autre message",
    formErrorGeneric: "Une erreur est survenue.",
    networkError: "Connexion impossible. Vérifiez votre réseau et réessayez.",
    validation: {
      invalidData: "Données invalides.",
      firstNameRequired: "Le prénom est requis.",
      firstNameTooLong: "Prénom trop long.",
      lastNameRequired: "Le nom est requis.",
      lastNameTooLong: "Nom trop long.",
      emailRequired: "L'email est requis.",
      emailInvalid: "Email invalide.",
      phoneRequired: "Le téléphone est requis.",
      phoneInvalid: "Numéro de téléphone invalide.",
      gdprRequired: "Vous devez accepter le traitement de vos données.",
    },
  },
  en: {
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    phonePlaceholder: "+44 7700 900123",
    gdprConsent:
      "I agree that Planory may process my data (name, email, phone) to respond to my contact request, in accordance with GDPR.",
    submit: "Send my request",
    submitting: "Sending…",
    successTitle: "Message sent",
    successMessage: "We will get back to you shortly at the address provided.",
    sendAnother: "Send another message",
    formErrorGeneric: "Something went wrong.",
    networkError: "Unable to connect. Check your network and try again.",
    validation: {
      invalidData: "Invalid data.",
      firstNameRequired: "First name is required.",
      firstNameTooLong: "First name is too long.",
      lastNameRequired: "Last name is required.",
      lastNameTooLong: "Last name is too long.",
      emailRequired: "Email is required.",
      emailInvalid: "Invalid email address.",
      phoneRequired: "Phone number is required.",
      phoneInvalid: "Invalid phone number.",
      gdprRequired: "You must accept data processing.",
    },
  },
} as const;

export function getProductBenefits(locale: Locale) {
  return locale === "en" ? EN.PRODUCT_BENEFITS : FR.PRODUCT_BENEFITS;
}

export function getProductModules(locale: Locale) {
  return locale === "en" ? EN.PRODUCT_MODULES : FR.PRODUCT_MODULES;
}

export function getSectors(locale: Locale) {
  return locale === "en" ? EN.SECTORS : FR.SECTORS;
}

export function getOffers(locale: Locale) {
  return locale === "en" ? EN.OFFERS : FR.OFFERS;
}

export function getOfferComparison(locale: Locale) {
  return locale === "en" ? EN.OFFER_COMPARISON : FR.OFFER_COMPARISON;
}

export function getFaqItems(locale: Locale) {
  return locale === "en" ? EN.FAQ_ITEMS : FR.FAQ_ITEMS;
}

export function getContactTopics(locale: Locale) {
  return locale === "en" ? EN.CONTACT_TOPICS : FR.CONTACT_TOPICS;
}

export function getHospitalSector(locale: Locale) {
  return locale === "en" ? EN.HOSPITAL_SECTOR_EN : HOSPITAL_SECTOR;
}

export function getPageUi(locale: Locale) {
  return locale === "en" ? EN.PAGE_UI : PAGE_UI_FR;
}

export function getContactFormCopy(locale: Locale) {
  return CONTACT_FORM_COPY[locale];
}
