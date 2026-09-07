/* =============================================================
   PHASE 1/3 — Construction de la base CANDIDATE (hors production)
   -------------------------------------------------------------
   Fusionne les sources de fréquence officielles téléchargées, calcule
   une évidence croisée par prénom, et écrit une base de travail
   séparée dans work/. NE TOUCHE NI data.js NI api/_data/.

   Sources (voir le rapport de phase 1 pour licences et limites) :
     insee   France   1900-2022, Licence Ouverte 2.0 (Etalab)
     ssa     USA      1880-2020, domaine public
     ons_uk  R.-U.    2024 seulement, OGL v3.0
     berlin  Berlin   2012-2023, CC BY 3.0 DE
     cso_ie  Irlande  1964-2025, données publiques CSO

   Chaque source apporte : nom, genre, effectif cumulé, nb d'années.
   AUCUNE n'apporte de signification, d'origine ni de style — c'est la
   contrainte centrale traitée en phase 2.
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "work");
fs.mkdirSync(OUT, { recursive: true });

/* Dénominateurs : total d'occurrences captées par source, pour
   normaliser des pays de tailles très différentes. */
const SOURCES = [
  { id: "insee",  file: "/tmp/insee_processed_clean.json" },
  { id: "ssa",    file: "/tmp/ssa_processed.json" },
  { id: "ons_uk", file: "/tmp/ons_processed.json" },
  { id: "berlin", file: "/tmp/berlin_processed.json" },
  { id: "cso_ie", file: "/tmp/ireland_processed.json" },
];

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();

/* Casse propre : "jean-luc" -> "Jean-Luc", "mary ann" -> "Mary Ann" */
function titleCase(s) {
  return s.toLowerCase().replace(/(^|[\s'\-])([\p{L}])/gu, (m, sep, c) => sep + c.toUpperCase());
}

console.log("=== Chargement des sources ===");
const loaded = {};
const totals = {};
for (const s of SOURCES) {
  if (!fs.existsSync(s.file)) { console.log(`  ${s.id.padEnd(8)} ABSENT (${s.file})`); continue; }
  const rows = JSON.parse(fs.readFileSync(s.file, "utf8"));
  loaded[s.id] = rows;
  totals[s.id] = rows.reduce((a, r) => a + (r.totalCount || 0), 0);
  console.log(`  ${s.id.padEnd(8)} ${String(rows.length).padStart(7)} entrées   total occurrences ${totals[s.id].toLocaleString("fr")}`);
}

console.log("\n=== Fusion par prénom (clé = forme normalisée) ===");
/* On regroupe sur la forme normalisée (sans accents ni casse) mais on
   CONSERVE toutes les graphies rencontrées : deux graphies distinctes
   ne sont jamais fusionnées d'autorité, c'est tranché plus tard. */
const merged = new Map();

for (const [sid, rows] of Object.entries(loaded)) {
  for (const r of rows) {
    const raw = (r.name || "").trim();
    if (!raw) continue;
    const key = norm(raw);
    if (!key) continue;
    if (!merged.has(key)) merged.set(key, { key, spellings: new Map(), sources: {}, genders: {} });
    const e = merged.get(key);
    const disp = titleCase(raw);
    e.spellings.set(disp, (e.spellings.get(disp) || 0) + (r.totalCount || 0));
    if (!e.sources[sid]) e.sources[sid] = { count: 0, years: 0 };
    e.sources[sid].count += r.totalCount || 0;
    e.sources[sid].years = Math.max(e.sources[sid].years, r.years || 0);
    if (r.gender) e.genders[r.gender] = (e.genders[r.gender] || 0) + (r.totalCount || 0);
  }
}
console.log(`  prénoms uniques (forme normalisée) : ${merged.size.toLocaleString("fr")}`);

console.log("\n=== Évidence croisée ===");
/* Même formule que la production (tools/compute-popularity-tiers.js) :
   log de la part de naissances cumulée, + années distinctes, + bonus
   multi-source. Le log est indispensable : la popularité des prénoms
   suit une loi de puissance. */
const FREQ_SCALE = 100000, YEAR_WEIGHT = 0.05, MULTISOURCE_BONUS = 2;

const candidates = [];
for (const e of merged.values()) {
  let share = 0, years = 0, nb = 0;
  for (const [sid, v] of Object.entries(e.sources)) {
    if (!totals[sid]) continue;
    share += v.count / totals[sid];
    years += v.years;
    nb++;
  }
  const evidence = Math.log(1 + share * FREQ_SCALE) + years * YEAR_WEIGHT + (nb > 1 ? MULTISOURCE_BONUS : 0);

  /* Graphie retenue = la plus attestée. Les autres sont conservées. */
  const spellings = [...e.spellings.entries()].sort((a, b) => b[1] - a[1]);
  const name = spellings[0][0];

  const g = e.genders;
  const boy = g.boy || 0, girl = g.girl || 0, mixte = g.mixte || 0;
  let gender;
  const tot = boy + girl + mixte;
  if (mixte > 0 && mixte >= tot * 0.5) gender = "mixte";
  else if (boy > 0 && girl > 0) {
    const ratio = Math.min(boy, girl) / Math.max(boy, girl);
    gender = ratio > 0.15 ? "mixte" : (boy > girl ? "boy" : "girl");
  } else gender = boy > 0 ? "boy" : girl > 0 ? "girl" : "mixte";

  candidates.push({
    key: e.key,
    name,
    altSpellings: spellings.slice(1).map((x) => x[0]),
    gender,
    evidence,
    totalCount: Object.values(e.sources).reduce((a, v) => a + v.count, 0),
    years,
    nbSources: nb,
    sources: e.sources,
  });
}

candidates.sort((a, b) => b.evidence - a.evidence);
fs.writeFileSync(path.join(OUT, "candidates-raw.json"), JSON.stringify(candidates));
console.log(`  candidats bruts : ${candidates.length.toLocaleString("fr")}`);
console.log(`  multi-sources   : ${candidates.filter((c) => c.nbSources > 1).length.toLocaleString("fr")}`);
console.log(`  écrit -> work/candidates-raw.json (${(fs.statSync(path.join(OUT, "candidates-raw.json")).size / 1048576).toFixed(1)} Mo)`);

console.log("\n=== Seuils d'occurrences cumulées ===");
for (const t of [1, 5, 10, 25, 50, 100, 250]) {
  const n = candidates.filter((c) => c.totalCount >= t).length;
  console.log(`  >= ${String(t).padStart(4)} : ${String(n).padStart(7)} prénoms`);
}

console.log("\n=== Recoupement avec la base de production ===");
const g2 = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g2.NAMES ="));
const prodKeys = new Set(g2.NAMES.map((n) => norm(n.name)));
const already = candidates.filter((c) => prodKeys.has(c.key));
const isNew = candidates.filter((c) => !prodKeys.has(c.key));
console.log(`  base de production          : ${g2.NAMES.length.toLocaleString("fr")} prénoms`);
console.log(`  déjà présents (→ meilleur classement) : ${already.length.toLocaleString("fr")}`);
console.log(`  NOUVEAUX candidats          : ${isNew.length.toLocaleString("fr")}`);
console.log(`  prod SANS aucune évidence   : ${g2.NAMES.filter((n) => !merged.has(norm(n.name))).length.toLocaleString("fr")}`);

fs.writeFileSync(path.join(OUT, "candidates-new.json"), JSON.stringify(isNew));
console.log(`\n  écrit -> work/candidates-new.json`);
