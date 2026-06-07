#!/usr/bin/env node
/* =============================================================
   add-bulk.js — Ingestion HAUT DÉBIT de prénoms dans data.js
   Usage : node tools/add-bulk.js tools/bulk/<fichier>.js
   Format ultra-compact (1 ligne/prénom) :
     module.exports = { origin: "grec", data: `
       Nom;genre;sens FR;sens EN
       ...
     `};
   genre = b|g|m  (boy|girl|mixte)
   - tags  : DÉRIVÉS automatiquement du sens EN (carte de mots-clés)
   - style : auto (variété déterministe + court si nom bref)
   - length, why : auto
   Déduplique, valide chaque entrée, fusionne, et SIGNALE les lignes
   sans tag dérivé (à corriger manuellement = "erreurs détectées").
   ============================================================= */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data.js");

const STYLES_POOL = ["classique", "moderne", "rare", "elegant", "poetique"];
const TAGS = ["force", "courage", "sagesse", "lumiere", "nature", "liberte", "foi", "amour", "paix", "victoire", "joie", "beaute", "espoir", "noblesse", "grace", "prosperite"];
const GMAP = { b: "boy", g: "girl", m: "mixte" };

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const letters = (s) => norm(s).replace(/[^a-z]/g, "").length;
const lengthOf = (s) => { const L = letters(s); return L <= 4 ? "court" : L <= 6 ? "moyen" : "long"; };

/* Carte mots-clés EN -> tag (un mot peut mapper plusieurs concepts). */
const KW = [
  [/\b(light|bright|shining|radian|sun|moon|star|dawn|luminous|glow|ray|aurora)\w*/, "lumiere"],
  [/\b(strong|strength|might|mighty|iron|rock|stone|lion|wolf|bear|warrior|warlike|fortress|firm|steadfast|powerful|power|dragon|phoenix)\w*/, "force"],
  [/\b(life|lively|alive|vital|living|youth|youthful|young)\w*/, "joie"],
  [/\b(amber|jewel|gem|pearl|ruby|jade|opal|coral|gold)\w*/, "beaute"],
  [/\b(brave|courage|valian|valor|valour|bold|fearless|hero|heroic|fierce)\w*/, "courage"],
  [/\b(wis|wisdom|sage|prudent|clever|learned|knowledge|intellig|insight|thought|counsel)\w*/, "sagesse"],
  [/\b(flower|blossom|tree|forest|sea|ocean|river|wave|sky|cloud|wind|snow|rain|earth|field|meadow|bird|garden|leaf|maple|rose|lily|olive|herb|coral|mountain|moss|fern|water|dew|spring|stream|wood|deer|gazelle|swallow|dove|raven|eagle|wild|nature|petal|orchid|jasmine|tulip|pearl?-?of?-?sea)\w*/, "nature"],
  [/\b(free|freedom|liber|independ|wind|eagle|wander)\w*/, "liberte"],
  [/\b(god|godly|divine|holy|sacred|faith|blessed|devout|devoted|grace of god|saint|heaven|angel|pious|gift of god|christ|believ|prayer)\w*/, "foi"],
  [/\b(love|belove|beloved|dear|heart|cherish|affection|darling|sweethear)\w*/, "amour"],
  [/\b(peace|peaceful|calm|serene|tranquil|dove|quiet|gentle peace)\w*/, "paix"],
  [/\b(victor|victory|conquer|triumph|win|champion)\w*/, "victoire"],
  [/\b(joy|joyful|happy|happiness|cheer|merry|glad|bliss|delight|rejoice)\w*/, "joie"],
  [/\b(beaut|beautiful|fair|pretty|lovely|graceful beauty|jewel|gem|ruby|gold|golden|elegan|charming|comely|handsome|splendid|radiant beauty|jade|coral)\w*/, "beaute"],
  [/\b(hope|hopeful|promise|expectation|dawn|new beginning|rebirth|reborn|future)\w*/, "espoir"],
  [/\b(noble|nobility|king|queen|prince|princess|royal|lord|lady|ruler|reign|crown|majesty|chief|highborn|distinguished)\w*/, "noblesse"],
  [/\b(grace|gracious|gentle|kind|tender|mercy|merciful|pure|purity|favou?r|sweet|delicate|blessing)\w*/, "grace"],
  [/\b(prosper|wealth|rich|riches|fortune|fortunate|abundan|thriv|treasure|success|flourish|plenty|estate|home|household|house)\w*/, "prosperite"],
  // métiers / rôles
  [/\b(guardian|keeper|steward|protector|protect|ruler|reign|shepherd|warden|defender)\w*/, "noblesse"],
  [/\b(worker|craftsman|smith|farmer|grower|driver|builder|maker|soldier|oarsman|hunter)\w*/, "force"],
  // lieux / nature géographique
  [/\b(town|land|field|hill|valley|ford|crossing|brook|stream|meadow|forest|wood|moor|heath|island|shore|dale|glen|grove|farm)\w*/, "nature"],
  // patronymes / origine
  [/\b(son of|daughter of|descendant|of the|from)\b/, "foi"],
];

function deriveTags(en) {
  const s = " " + en.toLowerCase() + " ";
  const found = [];
  for (const [re, tag] of KW) { if (re.test(s) && !found.includes(tag)) found.push(tag); if (found.length === 3) break; }
  return found;
}
function autoStyle(name) {
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const out = [STYLES_POOL[h % STYLES_POOL.length]];
  if (letters(name) <= 4 && !out.includes("court")) out.push("court");
  else { const second = STYLES_POOL[(h >>> 3) % STYLES_POOL.length]; if (second !== out[0]) out.push(second); }
  return out.slice(0, 3);
}
const WHY_FR = ["séduit par sa sonorité et son équilibre.", "à la fois doux et affirmé.", "élégant et facile à porter.", "rare sans être difficile à porter.", "chaleureux et facile à prononcer.", "plein de caractère et de douceur.", "singulier et marquant.", "harmonieux et lumineux.", "musical et simple à retenir.", "authentique et ancré dans sa culture.", "entre tradition et modernité.", "poétique et délicat."];
const WHY_EN = ["charms with its sound and balance.", "both gentle and assertive.", "elegant and easy to carry.", "rare yet easy to wear.", "warm and easy to pronounce.", "full of character and softness.", "distinctive and memorable.", "harmonious and bright.", "musical and easy to remember.", "authentic and rooted in its culture.", "between tradition and modernity.", "poetic and delicate."];
function autoWhy(name) {
  let h = 0; const s = name + "w"; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const i = h % WHY_FR.length;
  return { fr: `${name} ${WHY_FR[i]}`, en: `${name} ${WHY_EN[i]}` };
}

/* --- Charger data.js --- */
const g = {};
eval(fs.readFileSync(DATA, "utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;
const existing = new Set(NAMES.map((n) => norm(n.name)));

const bulkPath = process.argv[2];
if (!bulkPath) { console.error("Usage: node tools/add-bulk.js <bulk.js>"); process.exit(2); }
const bulk = require(path.resolve(bulkPath));
const origin = bulk.origin;

const added = [], skipped = [], noTag = [], malformed = [];
const seen = new Set();
bulk.data.split("\n").map((l) => l.trim()).filter(Boolean).forEach((line) => {
  const p = line.split(";").map((x) => x.trim());
  if (p.length < 4) return malformed.push(line);
  const [name, gAbbr, fr, en] = p;
  const gender = GMAP[gAbbr];
  if (!name || !gender || !fr || !en) return malformed.push(line);
  const k = norm(name);
  if (existing.has(k) || seen.has(k)) { skipped.push(name); return; }
  let tags = deriveTags(en + " " + fr);
  if (!tags.length) { // fallback varié (déterministe) plutôt que tout en "grace"
    noTag.push(name);
    let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    tags = [["noblesse", "grace", "sagesse", "force", "nature"][h % 5]];
  }
  seen.add(k);
  added.push({ name, gender, origin, style: autoStyle(name), meaningTags: tags, length: lengthOf(name), meaning: { fr, en }, why: autoWhy(name) });
});

function ser(n) {
  const o = { name: n.name, gender: n.gender, origin: n.origin, style: n.style, meaningTags: n.meaningTags, length: n.length, meaning: n.meaning, why: n.why };
  if (n.variants) o.variants = n.variants;
  return "{ " + Object.entries(o).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ") + " }";
}
const all = NAMES.concat(added);
const src = fs.readFileSync(DATA, "utf8");
const header = src.slice(0, src.indexOf("const NAMES ="));
fs.writeFileSync(DATA, header + "const NAMES = [\n" + all.map((n) => "  " + ser(n) + ",").join("\n") + "\n];\n");

console.log(`[${origin}] +${added.length} | doublons ${skipped.length} | sans-tag(fallback grace) ${noTag.length}${noTag.length ? " → " + noTag.slice(0, 30).join(", ") : ""}${malformed.length ? " | MALFORMÉ " + malformed.length : ""}`);
console.log(`  Total: ${NAMES.length} → ${all.length}`);
