/**
 * API locale unique pour le contenu marketing (FR/EN).
 * Sources : `content/fr.ts`, `content/en.ts` (+ secteurs dédiés).
 * Chemins / chrome UI : `@/lib/i18n`.
 */
import { HOSPITAL_SECTOR } from "./hospital-sector";
import { AIRPORT_SECTOR } from "./airport-sector";
import { INDUSTRY_SECTOR } from "./industry-sector";
import * as FR from "./content/fr";
import * as EN from "./content/en";
import type { Locale } from "./i18n";

export const CONTACT_FORM_COPY = {
  fr: {
    firstNameLabel: "Prénom",
    lastNameLabel: "Nom",
    emailLabel: "Email",
    phoneLabel: "Téléphone",
    phoneOptional: "(facultatif)",
    phonePlaceholder: "06 12 34 56 78",
    gdprConsent:
      "J'accepte que Planory traite mes données (nom, prénom, email, et téléphone le cas échéant) afin de répondre à ma demande de contact, conformément au RGPD.",
    privacyLinkLabel: "Politique de confidentialité",
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
      phoneInvalid: "Numéro de téléphone invalide.",
      gdprRequired: "Vous devez accepter le traitement de vos données.",
    },
  },
  en: {
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    phoneOptional: "(optional)",
    phonePlaceholder: "+44 7700 900123",
    gdprConsent:
      "I agree that Planory may process my data (name, email, and phone if provided) to respond to my contact request, in accordance with GDPR.",
    privacyLinkLabel: "Privacy policy",
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

export function getAirportSector(locale: Locale) {
  return locale === "en" ? EN.AIRPORT_SECTOR_EN : AIRPORT_SECTOR;
}

export function getIndustrySector(locale: Locale) {
  return locale === "en" ? EN.INDUSTRY_SECTOR_EN : INDUSTRY_SECTOR;
}

export function getPageUi(locale: Locale) {
  return locale === "en" ? EN.PAGE_UI : FR.PAGE_UI;
}

export function getContactFormCopy(locale: Locale) {
  return CONTACT_FORM_COPY[locale];
}

export function getContactEmail() {
  return FR.CONTACT_EMAIL;
}
