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

export function getContactEmail() {
  return FR.CONTACT_EMAIL;
}
