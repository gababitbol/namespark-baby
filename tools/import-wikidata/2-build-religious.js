const fs = require("fs");
const netNew = JSON.parse(fs.readFileSync("/tmp/wd_religious_netnew.json","utf8"));

const LANG_TO_ORIGIN = {
  "French": "francais", "English": "anglais", "Italian": "italien",
  "Polish": "slave", "Russian": "slave", "Ukrainian": "slave", "Bulgarian": "slave",
  "Serbo-Croatian": "slave", "Bosnian": "slave",
  "Spanish": "espagnol", "Portuguese": "portugais", "Brazilian Portuguese": "portugais",
  "Angolan Portuguese": "portugais", "Mozambican Portuguese": "portugais",
  "Irish": "irlandais", "Basque": "basque", "Arabic": "arabe", "German": "nordique",
  "Dutch": "nordique",
};
const EXCLUDE_LANGS = new Set(["Catalan","Turkish","Aragonese","multiple languages"]);

/* Traductions des titres devotionnels recurrents -> glose francaise/anglaise courte,
   fidele au lien "named after" Wikidata (pas d'interpretation supplementaire). */
const TARGET_GLOSS = {
  "John the Baptist":        { fr: "En l'honneur de saint Jean-Baptiste", en: "In honour of Saint John the Baptist" },
  "Francis Xavier":          { fr: "En l'honneur de saint François-Xavier", en: "In honour of Saint Francis Xavier" },
  "John Chrysostom":         { fr: "En l'honneur de saint Jean Chrysostome", en: "In honour of Saint John Chrysostom" },
  "Our Lady of Graces":      { fr: "Consacrée à Notre-Dame des Grâces", en: "Devoted to Our Lady of Graces" },
  "Our Lady of the Girdle":  { fr: "Consacrée à Notre-Dame de la Ceinture", en: "Devoted to Our Lady of the Girdle" },
  "Our Lady of the Light":   { fr: "Consacrée à Notre-Dame de la Lumière", en: "Devoted to Our Lady of the Light" },
  "St. James the Elder":     { fr: "En l'honneur de saint Jacques le Majeur", en: "In honour of Saint James the Elder" },
  "Immanuel":                { fr: "Dieu avec nous", en: "God with us" },
  "Saint Stephen":           { fr: "En l'honneur de saint Étienne", en: "In honour of Saint Stephen" },
  "Muhammad":                { fr: "En l'honneur du prophète Mahomet", en: "In honour of the Prophet Muhammad" },
  "Francisco":               { fr: "En l'honneur de saint François de Paule", en: "In honour of Saint Francis of Paola" },
  "Saint Nicholas":          { fr: "En l'honneur de saint Nicolas", en: "In honour of Saint Nicholas" },
  "Jesus Christ":            { fr: "Consacré à Jésus-Christ", en: "Devoted to Jesus Christ" },
  "Francis de Sales":        { fr: "En l'honneur de saint François de Sales", en: "In honour of Saint Francis de Sales" },
  "Saint Lie":               { fr: "En l'honneur de saint Lié", en: "In honour of Saint Lié" },
  "Our Lady of the Good Event": { fr: "Consacré au Bon Événement de la Vierge", en: "Devoted to Our Lady of the Good Event" },
  "Virgin of Valvanera":     { fr: "Consacrée à la Vierge de Valvanera", en: "Devoted to the Virgin of Valvanera" },
  "Our Lady of Oblivion":    { fr: "Consacrée à Notre-Dame de l'Oubli", en: "Devoted to Our Lady of Oblivion" },
  "Our Lady of la Vega":     { fr: "Consacrée à Notre-Dame de la Vega", en: "Devoted to Our Lady of la Vega" },
  "Our Lady of Patrocinio":  { fr: "Consacrée à Notre-Dame du Patronage", en: "Devoted to Our Lady of Patronage" },
  "Saint Dominic":           { fr: "En l'honneur de saint Dominique", en: "In honour of Saint Dominic" },
  "Aloysius Gonzaga":        { fr: "En l'honneur de saint Louis de Gonzague", en: "In honour of Saint Aloysius Gonzaga" },
  "Our Lady of Begoña":      { fr: "Consacrée à Notre-Dame de Begoña", en: "Devoted to Our Lady of Begoña" },
  "Our Lady of Altagracia":  { fr: "Consacrée à Notre-Dame de la Haute-Grâce", en: "Devoted to Our Lady of Altagracia" },
  "Our Lady of Constantinople (Madrid)": { fr: "Consacrée à Notre-Dame de Constantinople", en: "Devoted to Our Lady of Constantinople" },
  "Our Lady of Arantzazu":   { fr: "Consacrée à Notre-Dame d'Arantzazu", en: "Devoted to Our Lady of Arantzazu" },
  "Our Lady of Fátima":      { fr: "Consacrée à Notre-Dame de Fátima", en: "Devoted to Our Lady of Fátima" },
  "John of God":             { fr: "En l'honneur de saint Jean de Dieu", en: "In honour of Saint John of God" },
  "Our Lady of the Pillar":  { fr: "Consacrée à Notre-Dame du Pilier", en: "Devoted to Our Lady of the Pillar" },
  "Joseph":                  { fr: "En l'honneur de saint Joseph", en: "In honour of Saint Joseph" },
  "Mary Magdalene":          { fr: "En l'honneur de sainte Marie-Madeleine", en: "In honour of Saint Mary Magdalene" },
  "Mary of Bethany":         { fr: "En l'honneur de sainte Marie de Béthanie", en: "In honour of Saint Mary of Bethany" },
  "Francis of Assisi":       { fr: "En l'honneur de saint François d'Assise", en: "In honour of Saint Francis of Assisi" },
  "Expectation of the Blessed Virgin Mary": { fr: "Consacrée à l'Attente de la Vierge Marie", en: "Devoted to the Expectation of the Virgin Mary" },
  "Our Lady of Sorrows":     { fr: "Consacrée à Notre-Dame des Douleurs", en: "Devoted to Our Lady of Sorrows" },
  "Our Lady of Montserrat":  { fr: "Consacrée à Notre-Dame de Montserrat", en: "Devoted to Our Lady of Montserrat" },
  "Joan of Arc":             { fr: "En l'honneur de Jeanne d'Arc", en: "In honour of Joan of Arc" },
  "Our Lady of Aparecida":   { fr: "Consacrée à Notre-Dame Apparue", en: "Devoted to Our Lady of Aparecida" },
  "Marian apparition":       { fr: "Consacrée à une apparition mariale", en: "Devoted to a Marian apparition" },
  "Immaculate Conception of Mary": { fr: "Consacrée à l'Immaculée Conception", en: "Devoted to the Immaculate Conception" },
  "Our Lady of Peace":       { fr: "Consacrée à Notre-Dame de la Paix", en: "Devoted to Our Lady of Peace" },
  "Ignatius of Loyola":      { fr: "En l'honneur de saint Ignace de Loyola", en: "In honour of Saint Ignatius of Loyola" },
  "Virgin of Fuencisla":     { fr: "Consacrée à la Vierge de la Fuencisla", en: "Devoted to the Virgin of Fuencisla" },
  "Holy Trinity":            { fr: "Consacré à la Sainte Trinité", en: "Devoted to the Holy Trinity" },
  "John the Evangelist":     { fr: "En l'honneur de saint Jean l'Évangéliste", en: "In honour of Saint John the Evangelist" },
  "Our Lady of the Way":     { fr: "Consacrée à Notre-Dame du Chemin", en: "Devoted to Our Lady of the Way" },
};

const STYLE_DEFAULT = ["classique"];

function computeLength(name) {
  const letters = name.replace(/[^A-Za-zÀ-ÿ]/g,"").length;
  return letters<=4 ? "court" : letters<=6 ? "moyen" : "long";
}

const TRIGGERS = {
  espoir: [/\battente\b/i, /esp[ée]rance/i],
  paix: [/\bpaix\b/i],
  grace: [/gr[âa]ce/i],
  lumiere: [/lumi[èe]re/i],
};

const out = [];
const skipped = [];

netNew.forEach(x => {
  const name = x.labelFr || x.labelEn;
  const langs = x.nameLangs.filter(l => !EXCLUDE_LANGS.has(l));
  if (!langs.length) { skipped.push({name, reason: "aucune langue mappable (origine hors des 22 actuelles)"}); return; }
  const origin = LANG_TO_ORIGIN[langs[0]];
  if (!origin) { skipped.push({name, reason: "langue non mappee: "+langs[0]}); return; }

  // Cherche une glose pour au moins une des cibles "named after"
  let gloss = null;
  for (const target of x.namedAfter) {
    if (TARGET_GLOSS[target]) { gloss = TARGET_GLOSS[target]; break; }
  }
  if (!gloss) { skipped.push({name, reason: "pas de glose pour: "+x.namedAfter.join(" | ")}); return; }

  const tags = new Set(["foi"]);
  Object.entries(TRIGGERS).forEach(([theme, patterns]) => {
    if (patterns.some(re => re.test(gloss.fr))) tags.add(theme);
  });

  out.push({
    name,
    gender: x.gender,
    origin,
    style: STYLE_DEFAULT,
    meaningTags: [...tags],
    length: computeLength(name),
    meaning: { fr: gloss.fr, en: gloss.en },
    why: {
      fr: `${name} porte une dévotion religieuse transmise dans la tradition ${origin}.`,
      en: `${name} carries a religious devotion passed down in the ${origin} tradition.`,
    },
    _source: "wikidata-P138-religious",
  });
});

console.log("Traites avec succes:", out.length);
console.log("Ecartes:", skipped.length);
fs.writeFileSync("/tmp/wd_religious_final.json", JSON.stringify(out, null, 1));
fs.writeFileSync("/tmp/wd_religious_skipped.json", JSON.stringify(skipped, null, 1));

console.log("\n=== raisons d'exclusion (comptage) ===");
const reasonCounts = {};
skipped.forEach(s => { const key = s.reason.split(":")[0]; reasonCounts[key] = (reasonCounts[key]||0)+1; });
Object.entries(reasonCounts).forEach(([r,c])=>console.log(" ", r, ":", c));
