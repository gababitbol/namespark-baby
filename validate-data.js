#!/usr/bin/env node
/* =============================================================
   validate-data.js — Validation stricte de data.js
   Usage : node validate-data.js
   Sortie : code 0 si OK, code 1 si au moins une ERREUR.
   Voir docs/schema-prenoms.md pour les règles.
   ============================================================= */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "data.js");
const src = fs.readFileSync(file, "utf8");
const g = {};
eval(src.replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;

const GENDERS = ["boy", "girl", "mixte"];
const LENGTHS = ["court", "moyen", "long"];
const STYLES = ["classique", "moderne", "rare", "elegant", "court", "poetique"];
const TAGS = ["force", "courage", "sagesse", "lumiere", "nature", "liberte", "foi", "amour", "paix", "victoire"];
const ORIGINS = ["hebreu", "francais", "anglais", "arabe", "italien", "espagnol", "grec", "latin", "nordique", "irlandais", "japonais", "slave", "sanskrit", "persan", "africain", "portugais", "coreen", "chinois", "gallois", "basque", "armenien", "georgien"];

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const errors = [];
const warns = [];
const seen = new Map();

NAMES.forEach((n, i) => {
  const id = n && n.name ? `"${n.name}"` : `#${i}`;
  const E = (m) => errors.push(`${id}: ${m}`);
  const W = (m) => warns.push(`${id}: ${m}`);

  // Champs requis
  if (!n.name) return E("name manquant");
  const k = norm(n.name);
  if (seen.has(k)) E(`doublon de ${seen.get(k)}`); else seen.set(k, id);

  if (!GENDERS.includes(n.gender)) E(`gender invalide: ${n.gender}`);
  if (!ORIGINS.includes(n.origin)) E(`origin invalide: ${n.origin}`);
  if (!LENGTHS.includes(n.length)) E(`length invalide: ${n.length}`);

  // style
  if (!Array.isArray(n.style) || n.style.length < 1 || n.style.length > 3) E(`style doit avoir 1 à 3 valeurs`);
  else {
    n.style.forEach((s) => { if (!STYLES.includes(s)) E(`style invalide: ${s}`); });
    if (new Set(n.style).size !== n.style.length) E(`style avec doublon: ${JSON.stringify(n.style)}`);
  }

  // meaningTags
  if (!Array.isArray(n.meaningTags) || n.meaningTags.length < 1 || n.meaningTags.length > 3) E(`meaningTags doit avoir 1 à 3 valeurs`);
  else {
    n.meaningTags.forEach((t) => { if (!TAGS.includes(t)) E(`tag invalide: ${t}`); });
    if (new Set(n.meaningTags).size !== n.meaningTags.length) E(`tag dupliqué: ${JSON.stringify(n.meaningTags)}`);
  }

  // meaning / why
  if (!n.meaning || !n.meaning.fr || !n.meaning.en) E(`meaning.fr/en requis`);
  else if (n.meaning.fr.trim().length < 2) E(`meaning.fr trop court`);
  if (!n.why || !n.why.fr || !n.why.en) E(`why.fr/en requis`);
  else if (n.why.fr.trim().length < 8) W(`why.fr très court`);

  // Champs optionnels
  if (n.variants !== undefined && !Array.isArray(n.variants)) E(`variants doit être un tableau`);
  if (n.pronunciation !== undefined && typeof n.pronunciation !== "string") E(`pronunciation doit être une chaîne`);
  if (n.info !== undefined && (!n.info.fr || !n.info.en)) E(`info doit avoir fr+en`);

  // Qualité (warnings)
  const L = norm(n.name).replace(/[^a-z]/g, "").length;
  const expect = L <= 4 ? "court" : L <= 6 ? "moyen" : "long";
  if (n.length !== expect && Math.abs(["court", "moyen", "long"].indexOf(n.length) - ["court", "moyen", "long"].indexOf(expect)) > 1) {
    W(`length=${n.length} mais ${L} lettres (attendu ~${expect})`);
  }
});

// Diversité des significations
const mc = {};
NAMES.forEach((n) => { if (n.meaning && n.meaning.fr) { const m = norm(n.meaning.fr.trim()); mc[m] = (mc[m] || 0) + 1; } });
const cap = Math.max(8, Math.ceil(NAMES.length * 0.02));
Object.entries(mc).filter(([, v]) => v > cap).sort((a, b) => b[1] - a[1])
  .forEach(([m, v]) => warns.push(`signification trop répétée (${v}×, max ${cap}): "${m}"`));

// Rapport
console.log(`\nValidé : ${NAMES.length} prénoms`);
console.log(`ERREURS : ${errors.length}`);
errors.slice(0, 100).forEach((e) => console.log("  ✗ " + e));
if (errors.length > 100) console.log(`  ... +${errors.length - 100} autres`);
console.log(`AVERTISSEMENTS : ${warns.length}`);
warns.slice(0, 40).forEach((w) => console.log("  ⚠ " + w));
if (warns.length > 40) console.log(`  ... +${warns.length - 40} autres`);

process.exit(errors.length ? 1 : 0);
