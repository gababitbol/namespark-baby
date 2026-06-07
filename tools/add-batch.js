#!/usr/bin/env node
/* =============================================================
   add-batch.js — Fusionne un lot de prénoms dans data.js
   Usage : node tools/add-batch.js tools/batches/<fichier>.js
   - Remplit automatiquement: length (nb lettres) + why{fr,en} variés
   - Déduplique (accent-insensible) contre data.js
   - Valide chaque entrée; ABANDON si une entrée est invalide
   - Réécrit data.js (format compact 1 ligne/entrée)
   Format d'un lot (voir tools/batches/_template.js) :
     module.exports = { origin: "japonais", names: [
       { name, gender, fr, en, tags:[...], style:[...] }, ...
     ]};
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data.js");

const GENDERS = ["boy", "girl", "mixte"];
const STYLES = ["classique", "moderne", "rare", "elegant", "court", "poetique"];
const TAGS = ["force", "courage", "sagesse", "lumiere", "nature", "liberte", "foi", "amour", "paix", "victoire", "joie", "beaute", "espoir", "noblesse", "grace", "prosperite"];
const ORIGINS = ["hebreu", "francais", "anglais", "arabe", "italien", "espagnol", "grec", "latin", "nordique", "irlandais", "japonais", "slave", "sanskrit", "persan", "africain", "portugais", "coreen", "chinois", "gallois", "basque", "armenien", "georgien"];

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const letters = (s) => norm(s).replace(/[^a-z]/g, "").length;
const lengthOf = (s) => { const L = letters(s); return L <= 4 ? "court" : L <= 6 ? "moyen" : "long"; };

/* Templates "why" variés (flavour). Choisis de façon déterministe par nom+style. */
const WHY = {
  fr: [
    (n) => `${n} séduit par sa sonorité et son équilibre.`,
    (n) => `Un prénom à la fois doux et affirmé.`,
    (n) => `Porté avec élégance, ${n} traverse les époques.`,
    (n) => `Rare sans être difficile à porter.`,
    (n) => `Chaleureux et facile à prononcer.`,
    (n) => `${n} dégage du caractère et de la douceur.`,
    (n) => `Un choix singulier qui se démarque.`,
    (n) => `Harmonieux et plein de lumière.`,
    (n) => `Une belle musicalité, simple à retenir.`,
    (n) => `Authentique et ancré dans sa culture.`,
    (n) => `${n} allie tradition et modernité.`,
    (n) => `Poétique et délicat à l'oreille.`,
  ],
  en: [
    (n) => `${n} charms with its sound and balance.`,
    (n) => `A name both gentle and assertive.`,
    (n) => `Worn with elegance, ${n} is timeless.`,
    (n) => `Rare yet easy to carry.`,
    (n) => `Warm and easy to pronounce.`,
    (n) => `${n} blends character and softness.`,
    (n) => `A distinctive choice that stands out.`,
    (n) => `Harmonious and full of light.`,
    (n) => `A lovely musicality, easy to remember.`,
    (n) => `Authentic and rooted in its culture.`,
    (n) => `${n} blends tradition and modernity.`,
    (n) => `Poetic and delicate to the ear.`,
  ],
};
const pickWhy = (name, salt) => {
  let h = 0; const s = name + salt;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const i = h % WHY.fr.length;
  return { fr: WHY.fr[i](name), en: WHY.en[i](name) };
};

/* --- Charger data.js --- */
const g = {};
eval(fs.readFileSync(DATA, "utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;
const existing = new Set(NAMES.map((n) => norm(n.name)));

/* --- Charger le lot --- */
const batchPath = process.argv[2];
if (!batchPath) { console.error("Usage: node tools/add-batch.js <lot.js>"); process.exit(2); }
const batch = require(path.resolve(batchPath));
if (!batch.origin || !Array.isArray(batch.names)) { console.error("Lot invalide: { origin, names[] } attendu"); process.exit(2); }
if (!ORIGINS.includes(batch.origin)) { console.error("Origine inconnue: " + batch.origin); process.exit(2); }

const errors = [];
const added = [];
const skipped = [];
const seenInBatch = new Set();

batch.names.forEach((r, i) => {
  const id = r.name ? `"${r.name}"` : `#${i}`;
  if (!r.name) return errors.push(`${id}: name manquant`);
  const k = norm(r.name);
  if (existing.has(k) || seenInBatch.has(k)) { skipped.push(r.name); return; }
  if (!GENDERS.includes(r.gender)) return errors.push(`${id}: gender invalide (${r.gender})`);
  if (!r.fr || !r.en) return errors.push(`${id}: fr/en (signification) requis`);
  const tags = Array.isArray(r.tags) ? r.tags : [];
  if (tags.length < 1 || tags.length > 3) return errors.push(`${id}: tags 1 à 3 requis`);
  const badTag = tags.find((t) => !TAGS.includes(t));
  if (badTag) return errors.push(`${id}: tag invalide (${badTag})`);
  let style = Array.isArray(r.style) && r.style.length ? r.style : ["classique"];
  if (style.length > 3) style = style.slice(0, 3);
  const badStyle = style.find((s) => !STYLES.includes(s));
  if (badStyle) return errors.push(`${id}: style invalide (${badStyle})`);

  const entry = {
    name: r.name, gender: r.gender, origin: batch.origin,
    style: [...new Set(style)], meaningTags: [...new Set(tags)],
    length: lengthOf(r.name),
    meaning: { fr: r.fr, en: r.en },
    why: r.why || pickWhy(r.name, batch.origin),
  };
  if (r.variants) entry.variants = r.variants;
  if (r.pronunciation) entry.pronunciation = r.pronunciation;
  seenInBatch.add(k);
  added.push(entry);
});

if (errors.length) {
  console.error(`\n✗ Lot REFUSÉ — ${errors.length} erreur(s) :`);
  errors.slice(0, 50).forEach((e) => console.error("  " + e));
  process.exit(1);
}

/* --- Sérialiser + réécrire --- */
function ser(n) {
  const o = { name: n.name, gender: n.gender, origin: n.origin, style: n.style, meaningTags: n.meaningTags, length: n.length, meaning: n.meaning, why: n.why };
  if (n.variants) o.variants = n.variants;
  if (n.pronunciation !== undefined) o.pronunciation = n.pronunciation;
  if (n.info !== undefined) o.info = n.info;
  return "{ " + Object.entries(o).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ") + " }";
}
const all = NAMES.concat(added);
const src = fs.readFileSync(DATA, "utf8");
const header = src.slice(0, src.indexOf("const NAMES ="));
fs.writeFileSync(DATA, header + "const NAMES = [\n" + all.map((n) => "  " + ser(n) + ",").join("\n") + "\n];\n");

console.log(`\n✓ Lot "${batch.origin}" fusionné`);
console.log(`  Ajoutés : ${added.length}`);
console.log(`  Ignorés (doublons) : ${skipped.length}${skipped.length ? " → " + skipped.slice(0, 20).join(", ") : ""}`);
console.log(`  Total base : ${NAMES.length} → ${all.length}`);
