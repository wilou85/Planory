import type { ResourceArticle } from "@/lib/resources";

export const planningExcelEquipe: ResourceArticle = {
  slug: "planning-excel-equipe",
  path: "/ressources/planning-excel-equipe",
  title: "Planning Excel : limites et passage à un logiciel d'équipes",
  description:
    "Quand Excel ne suffit plus pour un planning d'équipes 24/7 : signaux d'alerte, risques de conformité et bonnes pratiques pour passer à un logiciel.",
  readTime: "6 min",
  publishedAt: "2026-06-27",
  keywords: ["planning excel", "logiciel planning équipe", "planning 24/7", "optimisation planning"],
  relatedLinks: [
    { href: "/produit", label: "Logiciel de gestion de planning" },
    { href: "/ressources/logiciel-planning-equipe", label: "Choisir un logiciel planning équipe" },
    { href: "/faq", label: "FAQ Planory" },
  ],
  sections: [
    {
      type: "p",
      text: "Excel reste l'outil le plus répandu pour construire un planning d'équipe. Pour une dizaine de personnes et un horizon de deux semaines, il suffit souvent. Dès que les contraintes se multiplient — roulements 3×8, astreintes, repos réglementaires — le tableur devient un goulot d'étranglement.",
    },
    {
      type: "h2",
      text: "Les limites d'Excel sur les plannings complexes",
    },
    {
      type: "ul",
      items: [
        "Pas de moteur de contraintes : chaque règle doit être vérifiée manuellement.",
        "Erreurs silencieuses : une formule mal copiée peut violer la réglementation.",
        "Temps de calcul : un planning 24/7 peut prendre plusieurs heures à ajuster.",
        "Absence de workflow brouillon → validation → publication.",
        "Versions multiples et conflits entre fichiers partagés.",
      ],
    },
    {
      type: "h2",
      text: "Quand passer à un logiciel de planning ?",
    },
    {
      type: "p",
      text: "Le passage devient pertinent dès qu'un de ces signaux apparaît :",
    },
    {
      type: "ul",
      items: [
        "Plus de 30 agents planifiés sur plus de 4 semaines.",
        "Environnement 24/7 : hôpital, aéroport, industrie, contact center.",
        "Astreintes, gardes ou roulements alternés (12h, 3×8).",
        "Obligation d'équité mesurable sur week-ends et nuits.",
        "Audit ou conformité réglementaire exigée.",
      ],
    },
    {
      type: "h2",
      text: "Ce qu'apporte un logiciel par rapport à Excel",
    },
    {
      type: "h3",
      text: "Génération et conformité",
    },
    {
      type: "p",
      text: "Excel ne génère rien : vous construisez cellule par cellule. Un logiciel comme Planory, via SKYNET, produit une proposition conforme à vos règles métier et légales en moins de 2 minutes. Vous relisez, ajustez et publiez.",
    },
    {
      type: "h3",
      text: "Planification RH intégrée",
    },
    {
      type: "p",
      text: "Qualifications, indisponibilités et droits individuels alimentent directement la génération — sans export/import entre fichiers.",
    },
    {
      type: "h2",
      text: "Migrer sans tout reprendre from scratch",
    },
    {
      type: "p",
      text: "Conservez vos règles métier documentées dans Excel comme base de paramétrage. Au déploiement, Planory les encode dans le moteur de contraintes — vous ne perdez pas votre expertise, vous la fiabilisez.",
    },
    {
      type: "cta",
      text: "Évaluez votre situation avec notre grille d'auto-diagnostic Excel vs logiciel.",
      href: "/ressources/outils/grille-excel-vs-logiciel",
      label: "Télécharger la grille gratuite",
    },
  ],
};
