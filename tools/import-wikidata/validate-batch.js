const fs = require("fs");
const batchFile = process.argv[2];
const batch = JSON.parse(fs.readFileSync(batchFile, "utf8"));

const g = {};
eval(fs.readFileSync("/Users/gabrielabitbol/VS/namespark-baby/data.js","utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;

const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const existingExact = new Set(NAMES.map(n=>n.name));
const existingNorm = new Set(NAMES.map(n=>norm(n.name)));

const ORIGINS = new Set(["hebreu","francais","anglais","arabe","italien","espagnol","grec","latin","nordique","irlandais","japonais","slave","sanskrit","persan","africain","portugais","coreen","chinois","gallois","basque","armenien","georgien"]);
const STYLES = new Set(["classique","moderne","rare","elegant","court","poetique"]);
const LENGTHS = new Set(["court","moyen","long"]);
const MEANINGS = new Set(["force","courage","sagesse","lumiere","nature","liberte","foi","amour","paix","victoire","joie","beaute","espoir","noblesse","grace","prosperite"]);
const GENDERS = new Set(["boy","girl","mixte"]);

let errors = [];
let exactDup = [];
let normDup = [];
const seenInBatch = new Map();

batch.forEach((n, i) => {
  const letters = n.name.replace(/[^A-Za-zÀ-ÿ]/g,"").length;
  const expectedLength = letters <= 4 ? "court" : letters <= 6 ? "moyen" : "long";

  if (!GENDERS.has(n.gender)) errors.push(n.name+": genre invalide ("+n.gender+")");
  if (!ORIGINS.has(n.origin)) errors.push(n.name+": origine invalide ("+n.origin+")");
  if (!Array.isArray(n.style) || !n.style.length || n.style.some(s=>!STYLES.has(s))) errors.push(n.name+": style invalide ("+n.style+")");
  if (!Array.isArray(n.meaningTags) || !n.meaningTags.length || n.meaningTags.some(m=>!MEANINGS.has(m))) errors.push(n.name+": meaningTags invalide ("+n.meaningTags+")");
  if (!LENGTHS.has(n.length)) errors.push(n.name+": length invalide ("+n.length+")");
  if (n.length !== expectedLength) errors.push(n.name+": length="+n.length+" mais "+letters+" lettres -> attendu "+expectedLength);
  if (!n.meaning || !n.meaning.fr || !n.meaning.en) errors.push(n.name+": meaning fr/en manquant");
  if (!n.why || !n.why.fr || !n.why.en) errors.push(n.name+": why fr/en manquant");

  if (existingExact.has(n.name)) exactDup.push(n.name+" (deja dans la base, exact)");
  const nk = norm(n.name);
  if (existingNorm.has(nk) && !existingExact.has(n.name)) normDup.push(n.name+" (variante accent/casse d'un nom existant)");

  if (seenInBatch.has(nk)) normDup.push(n.name+" (doublon interne au batch avec "+seenInBatch.get(nk)+")");
  seenInBatch.set(nk, n.name);
});

console.log("=== VALIDATION DU BATCH:", batchFile, "===");
console.log("Entrees:", batch.length);
console.log("Erreurs de schema:", errors.length);
errors.forEach(e=>console.log("  SCHEMA:", e));
console.log("Doublons exacts avec la base:", exactDup.length);
exactDup.forEach(e=>console.log("  EXACT:", e));
console.log("Quasi-doublons (accent/casse, ou internes au batch):", normDup.length);
normDup.forEach(e=>console.log("  QUASI:", e));

if (!errors.length && !exactDup.length && !normDup.length) {
  console.log("\n✅ BATCH PROPRE — pret a inserer");
} else {
  console.log("\n❌ CORRECTIONS NECESSAIRES AVANT INSERTION");
}
