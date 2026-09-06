/* =============================================================
   Harnais de parité client ↔ serveur
   -------------------------------------------------------------
   Objectif : prouver mécaniquement que lib/ranking.js (utilisé par
   /api/generate) produit EXACTEMENT les mêmes résultats que le code
   de génération réellement présent dans app.js.

   Méthode :
   - on extrait par analyse de source les fonctions generateDemo,
     shuffleByScore, pickProgressive + les constantes TIER_* telles
     qu'elles existent aujourd'hui dans app.js (pas une copie figée :
     le vrai fichier expédié en production) ;
   - on les évalue dans un bac à sable Node avec NAMES injecté ;
   - on remplace Math.random par un PRNG à graine fixe, remis à la
     même graine avant chaque exécution des deux côtés ;
   - on compare nom par nom, dans l'ordre, sur des centaines de
     combinaisons de filtres × profondeurs.

   Toute divergence = régression. Sortie non nulle -> bloque la suite.
   ============================================================= */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as server from "../lib/ranking.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/* ---------- 1) Charger le catalogue ---------- */
const g = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;

/* ---------- 2) Extraire les fonctions réelles d'app.js ---------- */
const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

/* Extrait `function <name>(...) { ... }` en comptant les accolades,
   pour récupérer le corps exact tel qu'il est expédié. */
function extractFunction(src, name) {
  const start = src.indexOf(`function ${name}(`);
  if (start === -1) throw new Error(`Fonction introuvable dans app.js : ${name}`);
  let i = src.indexOf("{", start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  throw new Error(`Accolades non équilibrées pour ${name}`);
}

/* Extrait `const <name> = ...;` jusqu'au point-virgule de fin de bloc. */
function extractConst(src, name) {
  const start = src.indexOf(`const ${name} =`);
  if (start === -1) throw new Error(`Constante introuvable dans app.js : ${name}`);
  let i = src.indexOf("=", start);
  let depth = 0, started = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === "{" || c === "[") { depth++; started = true; }
    else if (c === "}" || c === "]") depth--;
    else if (c === ";" && (!started || depth === 0)) return src.slice(start, i + 1);
  }
  throw new Error(`Fin de déclaration introuvable pour ${name}`);
}

const clientSrc = [
  extractConst(appSrc, "TIER_ORDER"),
  extractConst(appSrc, "TIER_DISTRIBUTION"),
  extractFunction(appSrc, "shuffleByScore"),
  extractFunction(appSrc, "pickProgressive"),
  extractFunction(appSrc, "generateDemo"),
  extractFunction(appSrc, "getSimilarDemo"),
  "({ generateDemo, getSimilarDemo })",
].join("\n\n");

/* Bac à sable : NAMES est la seule dépendance externe de ces fonctions. */
const client = (function () {
  // eslint-disable-next-line no-unused-vars
  const NAMES_LOCAL = NAMES;
  return eval(clientSrc.replace(/\bNAMES\b/g, "NAMES_LOCAL"));
})();

/* ---------- 3) PRNG déterministe (mulberry32) ---------- */
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- 4) Matrice de combinaisons ---------- */
const ORIGINS = ["", ...new Set(NAMES.map(n => n.origin))];
const STYLES = ["", "classique", "moderne", "rare", "elegant", "court", "poetique"];
const MEANINGS = ["", "force", "amour", "lumiere", "victoire", "espoir", "paix"];
const GENDERS = ["", "boy", "girl", "mixte"];
const LENGTHS = ["", "court", "moyen", "long"];
const LETTERS = ["", "a", "l", "z", "k"];

const cases = [];
/* a) chaque origine × chaque profondeur */
ORIGINS.forEach(origin => [0, 1, 2, 3].forEach(depth =>
  cases.push({ f: { gender: "", origin, style: "", meaning: "", length: "", letter: "" }, depth })));
/* b) chaque style (dont "rare", cas spécial) × profondeur */
STYLES.forEach(style => [0, 1, 2, 3].forEach(depth =>
  cases.push({ f: { gender: "", origin: "", style, meaning: "", length: "", letter: "" }, depth })));
/* c) significations, genres, longueurs, lettres */
MEANINGS.forEach(meaning => cases.push({ f: { gender: "", origin: "", style: "", meaning, length: "", letter: "" }, depth: 1 }));
GENDERS.forEach(gender => cases.push({ f: { gender, origin: "", style: "", meaning: "", length: "", letter: "" }, depth: 2 }));
LENGTHS.forEach(length => cases.push({ f: { gender: "", origin: "", style: "", meaning: "", length, letter: "" }, depth: 0 }));
LETTERS.forEach(letter => cases.push({ f: { gender: "", origin: "", style: "", meaning: "", length: "", letter }, depth: 3 }));
/* d) combinaisons multi-filtres serrées */
["hebreu", "italien", "japonais", "chinois", "basque", "francais", "anglais"].forEach(origin =>
  ["boy", "girl"].forEach(gender =>
    ["a", "l", "m"].forEach(letter =>
      [0, 2, 3].forEach(depth =>
        cases.push({ f: { gender, origin, style: "", meaning: "", length: "", letter }, depth })))));
/* e) cas limites connus : pool minuscule, pool vide, style rare + profondeur */
cases.push({ f: { gender: "", origin: "hebreu", style: "", meaning: "", length: "", letter: "f" }, depth: 0 });
cases.push({ f: { gender: "boy", origin: "hebreu", style: "", meaning: "", length: "", letter: "f" }, depth: 0 });
cases.push({ f: { gender: "girl", origin: "italien", style: "", meaning: "", length: "", letter: "l" }, depth: 1 });
[0, 1, 2, 3].forEach(depth =>
  cases.push({ f: { gender: "girl", origin: "", style: "rare", meaning: "amour", length: "moyen", letter: "" }, depth }));

/* f) avec une liste d'exclusion non vide (simule une 2e/3e génération) */
const withExclude = [];
[["francais", 1], ["anglais", 2], ["arabe", 3], ["chinois", 2], ["", 1]].forEach(([origin, depth]) => {
  const f = { gender: "", origin, style: "", meaning: "", length: "", letter: "" };
  const seed = 4242;
  const first = server.generate(NAMES, f, 20, null, 0, makeRng(seed));
  withExclude.push({ f, depth, exclude: new Set(first.map(n => n.name)) });
});

/* ---------- 5) Comparaison ---------- */
let pass = 0, fail = 0;
const failures = [];

function compare(label, f, depth, exclude) {
  /* Même graine des deux côtés : toute différence d'algorithme ou
     d'ordre de consommation de l'aléatoire produit une divergence. */
  const SEED = 123456789;

  const origRandom = Math.random;
  Math.random = makeRng(SEED);
  const clientOut = client.generateDemo(f, 20, exclude || null, depth).map(n => n.name);
  Math.random = origRandom;

  const serverOut = server.generate(NAMES, f, 20, exclude || null, depth, makeRng(SEED)).map(n => n.name);

  const same = clientOut.length === serverOut.length &&
               clientOut.every((n, i) => n === serverOut[i]);
  if (same) { pass++; return; }
  fail++;
  if (failures.length < 5) {
    failures.push({ label, client: clientOut.slice(0, 6), server: serverOut.slice(0, 6),
                    clientLen: clientOut.length, serverLen: serverOut.length });
  }
}

console.log("=== HARNAIS DE PARITÉ app.js ↔ lib/ranking.js ===");
console.log("Catalogue :", NAMES.length, "prénoms");
console.log("Cas de test :", cases.length + withExclude.length);
console.log("");

cases.forEach((c, i) => compare(`case#${i} ${JSON.stringify(c.f)} d=${c.depth}`, c.f, c.depth, null));
withExclude.forEach((c, i) => compare(`excl#${i} ${JSON.stringify(c.f)} d=${c.depth}`, c.f, c.depth, c.exclude));

/* ---------- 6) Parité de getSimilar ---------- */
let simPass = 0, simFail = 0;
["Marie", "Léo", "Sakura", "Yuki", "Aðalbjörn", "Fruma", "Lucrezia", "Emma", "Mohamed", "Zélie"].forEach(name => {
  const c = client.getSimilarDemo(name, 6).map(n => n.name);
  const s = server.getSimilar(NAMES, name, 6).map(n => n.name);
  if (c.length === s.length && c.every((n, i) => n === s[i])) simPass++;
  else { simFail++; failures.push({ label: `getSimilar(${name})`, client: c, server: s }); }
});

console.log("Génération   :", pass, "identiques /", pass + fail);
console.log("getSimilar   :", simPass, "identiques /", simPass + simFail);
console.log("");

/* ---------- 7) Parité catalogue complet ↔ index serveur allégé ----------
   /api/generate tourne sur names-index.json (sans meaning/why). Ce
   sous-ensemble doit produire EXACTEMENT la même sélection, sinon
   l'allègement du payload introduirait une régression silencieuse. */
let idxPass = 0, idxFail = 0;
const idxPath = path.join(ROOT, "data", "names-index.json");
if (fs.existsSync(idxPath)) {
  const INDEX = JSON.parse(fs.readFileSync(idxPath, "utf8"));
  if (INDEX.length !== NAMES.length) {
    idxFail++;
    failures.push({ label: "index: nombre d'entrées", client: [String(NAMES.length)], server: [String(INDEX.length)] });
  }
  cases.forEach((c) => {
    const SEED = 987654321;
    const full = server.generate(NAMES, c.f, 20, null, c.depth, makeRng(SEED)).map(n => n.name);
    const idx  = server.generate(INDEX, c.f, 20, null, c.depth, makeRng(SEED)).map(n => n.name);
    if (full.length === idx.length && full.every((n, i) => n === idx[i])) idxPass++;
    else {
      idxFail++;
      if (failures.length < 8) failures.push({ label: `index ${JSON.stringify(c.f)} d=${c.depth}`, client: full.slice(0, 6), server: idx.slice(0, 6) });
    }
  });
  console.log("Index serveur:", idxPass, "identiques /", idxPass + idxFail);
} else {
  console.log("Index serveur: (data/names-index.json absent — lancer tools/build-server-data.js)");
}
console.log("");

if (fail || simFail || idxFail) {
  console.log("!!! DIVERGENCES DÉTECTÉES !!!");
  failures.forEach(f => {
    console.log("  " + f.label);
    console.log("    client:", f.client, f.clientLen !== undefined ? `(${f.clientLen})` : "");
    console.log("    serveur:", f.server, f.serverLen !== undefined ? `(${f.serverLen})` : "");
  });
  process.exit(1);
}

console.log("✅ PARITÉ STRICTE CONFIRMÉE — aucune divergence.");
