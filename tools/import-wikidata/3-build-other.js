const fs = require("fs");
const netNew = JSON.parse(fs.readFileSync("/tmp/wd_other_netnew.json","utf8"));

const LANG_TO_ORIGIN = {
  "French":"francais","English":"anglais","Italian":"italien","Polish":"slave","Russian":"slave",
  "Ukrainian":"slave","Bulgarian":"slave","Serbo-Croatian":"slave","Bosnian":"slave","Spanish":"espagnol",
  "Portuguese":"portugais","Brazilian Portuguese":"portugais","Irish":"irlandais","Basque":"basque",
  "Arabic":"arabe","German":"nordique","Dutch":"nordique","Greek":"grec","Latin":"latin","Hebrew":"hebreu",
  "Hungarian":"slave","Icelandic":"nordique","Swedish":"nordique","Norwegian":"nordique","Danish":"nordique",
};
const EXCLUDE_LANGS = new Set(["Catalan","Turkish","Aragonese","multiple languages"]);

/* Exclusion explicite : personnages de fiction, marques, surnoms politiques
   a forte charge ideologique, figures negatives, ou cible trop ambigue
   pour etre honnetement resumee en une glose courte. */
const EXCLUDE_NAMES = new Set([
  "Tigerlily","Zowie","Robinhood","Galadrielle","Mowgli","Mona-Lisa","Monalisa",
  "Les Paul","Sergeant","George Washington","Vladlen","Melor","Oktyabrina","Kim",
  "Cain","Kain","Brittany","July","November","Sole","Sianna","Balandrán","Kulu",
  "Skrollan","Fetnat","Aaliyah","Setefilla","Ilia","Zoraida","Joseph-Marie","Madita",
  "Douwe","Merope","Rodion","Panteleïmon","Ituriel","Ataúlfo","Tranquilina","Sha\'aban",
  "Aner","Obed","Illán","Antonius","Christian","Tjalve","Tjalfe","Þjálfi",
]);

/* Glose honnete : "en l'honneur de X" quand X est un concept/figure bien identifie,
   sans trancher d'etymologie disputee. Uniquement des figures reelles, documentees,
   au caractere neutre ou positif. */
const TARGET_GLOSS = {
  "August":              { fr: "En l'honneur de l'empereur Auguste", en: "In honour of Emperor Augustus", tags:["noblesse"] },
  "Augustus":             { fr: "En l'honneur de l'empereur Auguste", en: "In honour of Emperor Augustus", tags:["noblesse"] },
  "Apollo":               { fr: "En l'honneur du dieu Apollon", en: "In honour of the god Apollo", tags:["lumiere"] },
  "Sirius":               { fr: "En l'honneur de l'étoile Sirius", en: "In honour of the star Sirius", tags:["lumiere"] },
  "Mark Antony":          { fr: "En l'honneur du général romain Marc Antoine", en: "In honour of the Roman general Mark Antony", tags:["courage"] },
  "John Gualbert":        { fr: "En l'honneur de saint Jean Gualbert", en: "In honour of Saint John Gualbert", tags:["foi"] },
  "Bartholomew the Apostle": { fr: "En l'honneur de l'apôtre saint Barthélemy", en: "In honour of the Apostle Saint Bartholomew", tags:["foi"] },
  "Julia gens":           { fr: "En l'honneur de la gens Julia, illustre famille de la Rome antique", en: "In honour of the Julii, an illustrious family of ancient Rome", tags:["noblesse"] },
  "Gabriel":              { fr: "En l'honneur de l'archange Gabriel", en: "In honour of the Archangel Gabriel", tags:["foi"] },
  "Hyacinth":             { fr: "En l'honneur de saint Hyacinthe", en: "In honour of Saint Hyacinth", tags:["foi"] },
  "Mars":                 { fr: "En l'honneur du dieu Mars", en: "In honour of the god Mars", tags:["courage","force"] },
  "Horace":               { fr: "En l'honneur du poète romain Horace", en: "In honour of the Roman poet Horace", tags:["sagesse"] },
  "Jacob":                { fr: "En l'honneur du patriarche biblique Jacob", en: "In honour of the biblical patriarch Jacob", tags:["foi"] },
  "Obadiah":              { fr: "En l'honneur du prophète biblique Abdias", en: "In honour of the biblical prophet Obadiah", tags:["foi"] },
  "Rhodes":               { fr: "En l'honneur de l'île grecque de Rhodes", en: "In honour of the Greek island of Rhodes", tags:["nature"] },
  "October":              { fr: "Né(e) au mois d'octobre", en: "Born in October", tags:[] },
  "Michael":              { fr: "En l'honneur de l'archange Michel", en: "In honour of the Archangel Michael", tags:["foi","courage"] },
  "Dominic de la Calzada": { fr: "En l'honneur de saint Dominique de la Calzada", en: "In honour of Saint Dominic de la Calzada", tags:["foi"] },
  "Thomas Aquinas":       { fr: "En l'honneur de saint Thomas d'Aquin", en: "In honour of Saint Thomas Aquinas", tags:["sagesse","foi"] },
  "Mammes of Caesarea":   { fr: "En l'honneur de saint Mammès de Césarée", en: "In honour of Saint Mammes of Caesarea", tags:["foi"] },
  "John of Matha":        { fr: "En l'honneur de saint Jean de Matha", en: "In honour of Saint John of Matha", tags:["foi"] },
  "Peter de Regalado":    { fr: "En l'honneur de saint Pierre Regalado", en: "In honour of Saint Peter de Regalado", tags:["foi"] },
  "Peter Claver":         { fr: "En l'honneur de saint Pierre Claver", en: "In honour of Saint Peter Claver", tags:["foi"] },
  "Joseph Calasanz":      { fr: "En l'honneur de saint Joseph de Calasanz", en: "In honour of Saint Joseph Calasanz", tags:["foi","sagesse"] },
  "Dominic of Silos":     { fr: "En l'honneur de saint Dominique de Silos", en: "In honour of Saint Dominic of Silos", tags:["foi"] },
  "Nossa Senhora do Monte": { fr: "Consacrée à Notre-Dame du Mont", en: "Devoted to Our Lady of the Mount", tags:["foi"] },
  "Nativity of Mary":     { fr: "Consacrée à la Nativité de Marie", en: "Devoted to the Nativity of Mary", tags:["foi"] },
  "Achilles":             { fr: "En l'honneur du héros grec Achille", en: "In honour of the Greek hero Achilles", tags:["courage","force"] },
  "Elijah":               { fr: "En l'honneur du prophète biblique Élie", en: "In honour of the biblical prophet Elijah", tags:["foi"] },
  "San Illán":            { fr: "En l'honneur de saint Julien", en: "In honour of Saint Julian", tags:["foi"] },
  "Peter Nolasco":        { fr: "En l'honneur de saint Pierre Nolasque", en: "In honour of Saint Peter Nolasco", tags:["foi"] },
  "Assumption of Mary":   { fr: "Consacrée à l'Assomption de Marie", en: "Devoted to the Assumption of Mary", tags:["foi"] },
  "Marcus Aurelius":      { fr: "En l'honneur de l'empereur philosophe Marc Aurèle", en: "In honour of the philosopher-emperor Marcus Aurelius", tags:["sagesse","noblesse"] },
  "Julius Caesar":        { fr: "En l'honneur de Jules César", en: "In honour of Julius Caesar", tags:["noblesse","force"] },
  "Peter of Alcantara":   { fr: "En l'honneur de saint Pierre d'Alcántara", en: "In honour of Saint Peter of Alcantara", tags:["foi"] },
  "Feast of the Holy Name of Mary": { fr: "Consacrée au Saint Nom de Marie", en: "Devoted to the Holy Name of Mary", tags:["foi"] },
  "Napoleon":             { fr: "En l'honneur de Napoléon Bonaparte", en: "In honour of Napoleon Bonaparte", tags:["noblesse","force"] },
  "Moses":                { fr: "En l'honneur du prophète biblique Moïse", en: "In honour of the biblical prophet Moses", tags:["foi"] },
  "Teresa of Ávila":      { fr: "En l'honneur de sainte Thérèse d'Ávila", en: "In honour of Saint Teresa of Ávila", tags:["foi","sagesse"] },
  "Paul of the Cross":    { fr: "En l'honneur de saint Paul de la Croix", en: "In honour of Saint Paul of the Cross", tags:["foi"] },
  "Daniel":               { fr: "En l'honneur du prophète biblique Daniel", en: "In honour of the biblical prophet Daniel", tags:["foi","sagesse"] },
};

const out = [];
const skipped = [];

netNew.forEach(x => {
  const name = x.labelFr || x.labelEn;
  if (EXCLUDE_NAMES.has(name)) { skipped.push({name, reason: "ecarte volontairement (fiction/politique/ambigu)"}); return; }
  const langs = x.nameLangs.filter(l => !EXCLUDE_LANGS.has(l));
  const origin = LANG_TO_ORIGIN[langs[0]];
  if (!origin) { skipped.push({name, reason: "langue non mappee"}); return; }

  let gloss = null;
  for (const target of x.namedAfter) { if (TARGET_GLOSS[target]) { gloss = TARGET_GLOSS[target]; break; } }
  if (!gloss) { skipped.push({name, reason: "pas de glose fiable pour: "+x.namedAfter.join(" | ")}); return; }
  if (!gloss.tags.length) { skipped.push({name, reason: "aucun theme reellement justifie (ex: simple mois de naissance)"}); return; }

  const letters = name.replace(/[^A-Za-zÀ-ÿ]/g,"").length;
  const length = letters<=4 ? "court" : letters<=6 ? "moyen" : "long";

  out.push({
    name, gender: x.gender, origin,
    style: ["classique"],
    meaningTags: gloss.tags,
    length,
    meaning: { fr: gloss.fr, en: gloss.en },
    why: {
      fr: `${name} rend hommage à une figure marquante de la tradition ${origin}.`,
      en: `${name} pays tribute to a notable figure in the ${origin} tradition.`,
    },
  });
});

console.log("Traites:", out.length);
console.log("Ecartes:", skipped.length);
fs.writeFileSync("/tmp/wd_other_final.json", JSON.stringify(out, null, 1));
fs.writeFileSync("/tmp/wd_other_skipped.json", JSON.stringify(skipped, null, 1));
