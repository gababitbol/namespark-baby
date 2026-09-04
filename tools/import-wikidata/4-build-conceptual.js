const fs = require("fs");
const conceptual = JSON.parse(fs.readFileSync("/tmp/wd_conceptual.json","utf8"));
const g = {};
eval(fs.readFileSync("/Users/gabrielabitbol/VS/namespark-baby/data.js","utf8").replace(/const NAMES =/, "g.NAMES ="));
const existing = new Set(g.NAMES.map(n=>n.name));
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const existingNorm = new Set(g.NAMES.map(n=>norm(n.name)));

const LANG_TO_ORIGIN = {
  "French":"francais","English":"anglais","Spanish":"espagnol","Dutch":"nordique","German":"nordique",
  "Basque":"basque","Ukrainian":"slave","Russian":"slave","Bulgarian":"slave","Hebrew":"hebreu",
  "Arabic":"arabe","Italian":"italien","Irish":"irlandais","Goidelic":"irlandais","Greek":"grec",
  "Ancient Greek":"grec","Latin":"latin","Finnish":"nordique","Old Norse":"nordique",
};

const EXCLUDE = new Set([
  "Baby Boy","Babyboy","SpongeBob","Rebop","Judas","Légalité","Princess","Geronto",
  "Wulfric","Apostol","Kirin","Shahbaz","Neroli","Ofer",
]);

/* Traduction directe concept -> glose FR/EN + tag thematique justifie. */
const CONCEPT_GLOSS = {
  "maxim":       { fr: "Maxime, principe de sagesse", en: "Maxim, wise principle", tags:["sagesse"] },
  "wisdom":      { fr: "Sagesse", en: "Wisdom", tags:["sagesse"] },
  "dawn":        { fr: "Aube", en: "Dawn", tags:["lumiere","nature"] },
  "happiness":   { fr: "Bonheur", en: "Happiness", tags:["joie"] },
  "sunbeam":     { fr: "Rayon de soleil", en: "Sunbeam", tags:["lumiere","nature"] },
  "raspberry":   { fr: "Framboise", en: "Raspberry", tags:["nature"] },
  "wood":        { fr: "Bois, forêt", en: "Wood, forest", tags:["nature"] },
  "sibyl":       { fr: "Sibylle, prophétesse", en: "Sibyl, prophetess", tags:["sagesse"] },
  "twin":        { fr: "Jumeau", en: "Twin", tags:[] },
  "bird":        { fr: "Oiseau", en: "Bird", tags:["nature"] },
  "nightingale": { fr: "Rossignol", en: "Nightingale", tags:["nature"] },
  "love":        { fr: "Amour", en: "Love", tags:["amour"] },
  "pride":       { fr: "Fierté", en: "Pride", tags:["noblesse"] },
  "pearl":       { fr: "Perle", en: "Pearl", tags:["beaute","nature"] },
  "thunder":     { fr: "Tonnerre", en: "Thunder", tags:["force"] },
  "sapphire":    { fr: "Saphir", en: "Sapphire", tags:["beaute"] },
  "world":       { fr: "Monde", en: "World", tags:["nature"] },
  "rain,cloud":  { fr: "Pluie, nuage", en: "Rain, cloud", tags:["nature"] },
  "lion":        { fr: "Lion", en: "Lion", tags:["force","courage"] },
  "flower,fame": { fr: "Fleur, renommée", en: "Flower, fame", tags:["nature","noblesse"] },
  "star":        { fr: "Étoile", en: "Star", tags:["lumiere"] },
  "tree":        { fr: "Arbre", en: "Tree", tags:["nature"] },
  "spring":      { fr: "Source", en: "Spring (water)", tags:["nature"] },
  "autumn":      { fr: "Automne", en: "Autumn", tags:["nature"] },
  "charity":     { fr: "Charité", en: "Charity", tags:["amour","foi"] },
  "destiny":     { fr: "Destinée", en: "Destiny", tags:[] },
  "belief":      { fr: "Croyance, foi", en: "Belief, faith", tags:["foi"] },
  "cherry":      { fr: "Cerise", en: "Cherry", tags:["nature"] },
  "cloud":       { fr: "Nuage", en: "Cloud", tags:["nature"] },
  "lake":        { fr: "Lac", en: "Lake", tags:["nature"] },
  "deer":        { fr: "Cerf, biche", en: "Deer", tags:["nature"] },
  "cherub":      { fr: "Chérubin", en: "Cherub", tags:["foi"] },
};

const out = [], skipped = [];
conceptual.forEach(x => {
  const name = x.labelFr || x.labelEn;
  if (!name || EXCLUDE.has(name)) { skipped.push({name: name||"[sans nom]", reason:"exclu (fiction/inapproprie/absent)"}); return; }
  if (!/^[A-Za-zÀ-ÿ\x27\x2D\x20]+$/.test(name)) { skipped.push({name, reason:"caracteres non latins"}); return; }
  if (existing.has(name) || existingNorm.has(norm(name))) { skipped.push({name, reason:"deja present"}); return; }
  const langs = x.nameLangs;
  const origin = langs.map(l=>LANG_TO_ORIGIN[l]).find(Boolean);
  if (!origin) { skipped.push({name, reason:"langue non mappee: "+langs.join(",")}); return; }
  const conceptKey = x.namedAfter.join(",");
  const gloss = CONCEPT_GLOSS[conceptKey] || CONCEPT_GLOSS[x.namedAfter[0]];
  if (!gloss || !gloss.tags.length) { skipped.push({name, reason:"pas de glose/theme fiable pour: "+conceptKey}); return; }

  const letters = name.replace(/[^A-Za-zÀ-ÿ]/g,"").length;
  const length = letters<=4 ? "court" : letters<=6 ? "moyen" : "long";

  out.push({
    name, gender: x.gender, origin, style: ["moderne","rare"],
    meaningTags: gloss.tags, length,
    meaning: { fr: gloss.fr, en: gloss.en },
    why: { fr: `${name} évoque directement « ${gloss.fr.toLowerCase()} ».`, en: `${name} directly evokes "${gloss.en.toLowerCase()}".` },
  });
});

console.log("Traites:", out.length, " Ecartes:", skipped.length);
fs.writeFileSync("/tmp/wd_conceptual_final.json", JSON.stringify(out, null, 1));
fs.writeFileSync("/tmp/wd_conceptual_skipped.json", JSON.stringify(skipped, null, 1));
out.forEach(n=>console.log(" ", n.name.padEnd(15), n.gender.padEnd(6), n.origin.padEnd(10), n.meaning.fr, n.meaningTags));
