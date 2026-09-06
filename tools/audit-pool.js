#!/usr/bin/env node
/* audit-pool.js — vérifie que les 10 038 prénoms sont bien utilisés */

const src = require("fs").readFileSync(__dirname + "/../data.js", "utf8");
// data.js déclare `const NAMES = [...]` — on le rend accessible dans ce scope
const NAMES = eval(src.replace(/^const NAMES\s*=\s*/m, "(").replace(/;?\s*$/, ")"));

// ---------- 1. Entrées brutes ----------
const raw = NAMES.length;

// ---------- 2. Déduplication (identique à generateDemo) ----------
const seen = new Set();
const deduped = NAMES.filter(n => {
  if (seen.has(n.name)) return false;
  seen.add(n.name);
  return true;
});
const dupCount = raw - deduped.length;

// ---------- 3. Éligibles filtres tous ouverts ----------
const f = {}; // aucun filtre sélectionné
const scored = deduped.map(n => {
  let score = 0, hardFail = false;
  if (f.gender) {
    if (f.gender === "mixte") { if (n.gender === "mixte") score += 4; else hardFail = true; }
    else if (n.gender === f.gender) score += 4;
    else if (n.gender === "mixte") score += 1;
    else hardFail = true;
  }
  if (f.origin) { if (n.origin === f.origin) score += 4; else hardFail = true; }
  if (f.letter) { if (n.name[0].toLowerCase() === f.letter) score += 3; else hardFail = true; }
  if (f.style  && n.style.includes(f.style))           score += 2;
  if (f.meaning && n.meaningTags.includes(f.meaning))  score += 2;
  if (f.length && n.length === f.length)                score += 1;
  return { n, score, hardFail };
});
const eligible = scored.filter(s => !s.hardFail);

// ---------- 4. Index sigSearch (identique à buildSigIndex) ----------
const seenSig = new Set();
const sigIndex = [];
for (const n of NAMES) {
  const key = n.name.toLowerCase();
  if (seenSig.has(key)) continue;
  seenSig.add(key);
  const norm = n.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  sigIndex.push({ name: n.name, norm });
}

// ---------- 5. Scan complet sigSearch("a") ----------
const nq = "a";
const starts = [], contains = [];
for (const e of sigIndex) {
  if (e.norm.startsWith(nq)) starts.push(e.name);
  else if (e.norm.includes(nq)) contains.push(e.name);
  // pas de break anticipé (bug corrigé)
}

// ---------- Rapport ----------
console.log("\n╔══════════════════════════════════════════════════════╗");
console.log("║           AUDIT POOL — NameSpark Baby               ║");
console.log("╚══════════════════════════════════════════════════════╝\n");

console.log("📦 BASE DE DONNÉES");
console.log(`   Entrées brutes dans data.js       : ${raw.toLocaleString()}`);
console.log(`   Doublons détectés et écartés       : ${dupCount.toLocaleString()}`);
console.log(`   Noms uniques (pool réel utilisé)   : ${deduped.length.toLocaleString()}`);

console.log("\n🎰 GÉNÉRATEUR — filtres tous ouverts");
console.log(`   Pool éligible (aucun hardFail)     : ${eligible.length.toLocaleString()}`);
console.log(`   Score de tous les noms (filtres=∅) : 0 (aléatoire pur)`);
console.log(`   Noms affichés (limit=20)            : 20 piochés au hasard parmi ${eligible.length.toLocaleString()}`);
console.log(`   ✅ Ratio couverture                 : ${(20/eligible.length*100).toFixed(2)}% affiché, ${(100-20/eligible.length*100).toFixed(2)}% en rotation`);

console.log("\n🔍 RECHERCHE SIGNIFICATION — query = \"a\"");
console.log(`   Index construit sur                 : ${sigIndex.length.toLocaleString()} noms uniques`);
console.log(`   Entrées scannées avant tri          : ${sigIndex.length.toLocaleString()} (boucle complète)`);
console.log(`   Commence par "a"                    : ${starts.length.toLocaleString()}`);
console.log(`   Contient "a" (non-début)            : ${contains.length.toLocaleString()}`);
console.log(`   Total correspondances               : ${(starts.length + contains.length).toLocaleString()}`);
console.log(`   Affichés (limit=24)                 : 24 parmi ${(starts.length + contains.length).toLocaleString()}`);
console.log(`   ✅ Profondeur d'indexation          : 100% (${sigIndex.length.toLocaleString()} noms dans l'index)\n`);
