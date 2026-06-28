import type { ResourceArticle } from "@/lib/resources";

export const planningMedical: ResourceArticle = {
  slug: "planning-medical",
  path: "/ressources/planning-medical",
  title: "Planning médical : gardes, qualifications et organisation des équipes soignantes",
  description:
    "Organiser un planning médical conforme : gardes par spécialité, planning médical identification, équité des nuits et logiciel adapté aux établissements de santé.",
  readTime: "9 min",
  publishedAt: "2026-06-28",
  keywords: [
    "planning médical",
    "planning médical identification",
    "mon planning medical",
    "planning de garde",
    "planning logiciel",
    "logiciel planning médical",
  ],
  relatedLinks: [
    { href: "/secteurs/hopital", label: "Planory pour la santé" },
    { href: "/ressources/planning-hospitalier", label: "Planning hospitalier" },
    { href: "/ressources/planning-12h-hopital", label: "Planning 12h" },
    { href: "/ressources/gestion-astreintes", label: "Gestion des astreintes" },
  ],
  sections: [
    {
      type: "p",
      text: "Le planning médical regroupe l'organisation des gardes, astreintes et roulements des médecins, internes et équipes paramédicales. Contrairement à un simple emploi du temps administratif, il doit garantir la continuité des soins, la bonne qualification sur chaque poste et le respect du code du travail — sur des horizons souvent supérieurs à un mois.",
    },
    {
      type: "h2",
      text: "Planning médical : de quoi parle-t-on ?",
    },
    {
      type: "p",
      text: "On parle de planning médical dès lors que l'affectation des soignants dépend de compétences cliniques : IDE en réanimation, AS en bloc, médecins de garde, internes de spécialité. Le planning médical identification — associer chaque agent à sa qualification et à son service — est une exigence de base : une affectation non conforme expose l'établissement cliniquement et juridiquement.",
    },
    {
      type: "h2",
      text: "Spécificités par rapport au planning administratif",
    },
    {
      type: "ul",
      items: [
        "Couverture par qualification et spécialité, pas seulement par effectif.",
        "Gardes médicales et paramédicales avec statuts distincts (garde, astreinte, permanence).",
        "Roulements 12h ou cycles longs avec repos réglementaires stricts.",
        "Équité des nuits, week-ends et jours fériés — mesurable sur la période.",
        "Remplacements de dernière minute sans rupture de continuité.",
      ],
    },
    {
      type: "h2",
      text: "Mon planning médical : les erreurs fréquentes sur Excel",
    },
    {
      type: "p",
      text: "Beaucoup d'établissements construisent encore mon planning medical sur tableur. Les limites apparaissent vite : oubli de repos entre deux gardes, qualification non vérifiée, équité impossible à démontrer lors d'un audit. Dès qu'une vingtaine d'agents et plusieurs statuts de garde entrent en jeu, un moteur de contraintes devient indispensable.",
    },
    {
      type: "h2",
      text: "Planning logiciel : critères pour un contexte médical",
    },
    {
      type: "ul",
      items: [
        "Paramétrage par service, spécialité et type de garde.",
        "Vérification automatique des repos légaux et accords internes.",
        "Équité calculée sur nuits, week-ends et astreintes.",
        "Workflow brouillon → validation cadre de santé → publication.",
        "Coexistence avec le SIRH hospitalier (sans le remplacer).",
      ],
    },
    {
      type: "h2",
      text: "Planning médical et IA : ce que SKYNET apporte",
    },
    {
      type: "p",
      text: "Sur un service aux contraintes denses, le nombre de combinaisons possibles explose. Planory, via SKYNET, encode vos règles médicales et réglementaires puis génère une proposition conforme en moins de 2 minutes. Les cadres relisent, ajustent les cas particuliers et publient — l'IA propose, vous validez.",
    },
    {
      type: "h3",
      text: "Services concernés",
    },
    {
      type: "ul",
      items: [
        "Urgences et réanimation — couverture 24/7 par qualification.",
        "Bloc opératoire — salles et équipes spécialisées.",
        "Médecine et chirurgie — roulements et gardes de nuit.",
        "EHPAD et SSR — polyvalence et astreintes.",
      ],
    },
    {
      type: "cta",
      text: "Vous organisez un planning médical complexe ?",
      href: "/contact",
      label: "Échanger avec Planory",
    },
  ],
};
