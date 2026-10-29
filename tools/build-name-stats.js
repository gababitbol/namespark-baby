/* =============================================================
   Construit tools/name-stats.json : statistiques de fréquence
   RÉELLES par prénom, à partir des registres officiels déjà
   téléchargés. Sert à enrichir les pages SEO avec du contenu
   factuel et propre à chaque prénom.

   Pourquoi c'est le bon levier : Google refuse d'indexer les pages
   produites en série. Ajouter du texte générique aggraverait le
   problème. Des chiffres vrais, différents pour chaque prénom et
   réellement utiles à un parent, sont l'inverse exact de ça.

   Rien n'est inventé : si un prénom n'apparaît dans aucun registre,
   il n'obtient aucune statistique (et sa page ne sera pas indexable).
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();

/* ---------- INSEE : série annuelle France 1900-2022 ---------- */
console.log("Lecture INSEE…");
const inseeByName = new Map();   // key -> Map(année -> effectif)
{
  const raw = fs.readFileSync("/tmp/insee_nat_extracted/nat2022.csv", "utf8").split("\n").slice(1);
  for (const line of raw) {
    const p = line.split(";");
    if (p.length < 4) continue;
    const [, preusuel, annais, nombre] = p;
    if (!preusuel || preusuel === "_PRENOMS_RARES") continue;
    if (!/^\d{4}$/.test(annais)) continue;          /* "XXXX" = année inconnue */
    const n = parseInt(nombre, 10);
    if (!Number.isFinite(n) || n <= 0) continue;
    const k = norm(preusuel);
    if (!k) continue;
    if (!inseeByName.has(k)) inseeByName.set(k, new Map());
    const m = inseeByName.get(k);
    m.set(annais, (m.get(annais) || 0) + n);
  }
}
console.log(`  ${inseeByName.size} prénoms avec série annuelle`);

/* ---------- SSA : série annuelle USA 1880-2020 ----------
   Source : miroir GitHub hackerb9/ssa-baby-names (alldata.txt),
   copie non modifiée des données SSA, domaine public. */
console.log("Lecture SSA…");
const ssaByName = new Map();
{
  const raw = fs.readFileSync("/tmp/ssa_alldata.txt", "utf8");
  let start = 0;
  while (start < raw.length) {
    let end = raw.indexOf("\n", start);
    if (end === -1) end = raw.length;
    const line = raw.slice(start, end);
    start = end + 1;
    const p = line.split(",");
    if (p.length < 4) continue;
    const n = parseInt(p[2], 10);
    if (!Number.isFinite(n) || n <= 0) continue;
    const year = p[3].trim();
    if (!/^\d{4}$/.test(year)) continue;
    const k = norm(p[0]);
    if (!k) continue;
    if (!ssaByName.has(k)) ssaByName.set(k, new Map());
    const m = ssaByName.get(k);
    m.set(year, (m.get(year) || 0) + n);
  }
}
console.log(`  ${ssaByName.size} prénoms avec série annuelle`);

/* ---------- Présence internationale ----------
   Reprise de work/candidates-raw.json, qui conserve pour chaque
   prénom la liste des registres où il apparaît et les effectifs.
   Évite de retélécharger ONS / Berlin / Irlande. */
const presence = new Map();
{
  const f = path.join(ROOT, "work", "candidates-raw.json");
  if (fs.existsSync(f)) {
    for (const c of JSON.parse(fs.readFileSync(f, "utf8"))) presence.set(c.key, c.sources || {});
    console.log(`Présence internationale : ${presence.size} prénoms`);
  } else {
    console.log("work/candidates-raw.json absent — présence internationale ignorée");
  }
}

/* ---------- Agrégation par prénom de la base ---------- */
const g = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;

function seriesStats(m) {
  if (!m || !m.size) return null;
  let total = 0, peakYear = null, peakCount = 0;
  const years = [...m.keys()].sort();
  for (const [y, c] of m) {
    total += c;
    if (c > peakCount) { peakCount = c; peakYear = y; }
  }
  /* tendance : moyenne des 10 dernières années disponibles vs pic */
  const last = years.slice(-10);
  const recent = last.reduce((a, y) => a + (m.get(y) || 0), 0) / Math.max(1, last.length);
  /* ventilation par décennie : donne à chaque page un tableau de
     chiffres réels, propre au prénom — exactement ce qu'un gabarit
     ne peut pas produire. */
  const decades = {};
  for (const [y, c] of m) {
    const d = Math.floor(+y / 10) * 10;
    decades[d] = (decades[d] || 0) + c;
  }
  return {
    total, peakYear: +peakYear, peakCount,
    firstYear: +years[0], lastYear: +years[years.length - 1],
    nbYears: m.size,
    recentAvg: Math.round(recent),
    decades,
  };
}

const out = {};
let withStats = 0;
for (const n of NAMES) {
  const k = norm(n.name);
  const fr = seriesStats(inseeByName.get(k));
  const us = seriesStats(ssaByName.get(k));
  const src = presence.get(k) || {};
  const uk = src.ons_uk ? src.ons_uk.count : undefined;
  const de = src.berlin ? src.berlin.count : undefined;
  const ie = src.cso_ie ? src.cso_ie.count : undefined;

  if (!fr && !us && uk === undefined && de === undefined && ie === undefined) continue;
  out[n.name] = { fr, us, uk, de, ie };
  withStats++;
}

fs.writeFileSync(path.join(ROOT, "tools", "name-stats.json"), JSON.stringify(out));
const sz = fs.statSync(path.join(ROOT, "tools", "name-stats.json")).size;
console.log(`\nprénoms de la base avec statistiques : ${withStats} / ${NAMES.length}`);
console.log(`écrit -> tools/name-stats.json (${(sz / 1024).toFixed(0)} Ko)`);

/* contrôle visuel */
console.log("\nContrôle :");
for (const nm of ["Gabriel", "Marie", "Sakura", "Zélie", "Lucrezia"]) {
  const s = out[nm];
  if (!s) { console.log(`  ${nm.padEnd(10)} aucune statistique`); continue; }
  const parts = [];
  if (s.fr) parts.push(`FR ${s.fr.total} (pic ${s.fr.peakYear}: ${s.fr.peakCount})`);
  if (s.us) parts.push(`US ${s.us.total} (pic ${s.us.peakYear})`);
  if (s.uk !== undefined) parts.push(`UK ${s.uk}`);
  if (s.ie !== undefined) parts.push(`IE ${s.ie}`);
  if (s.de !== undefined) parts.push(`DE ${s.de}`);
  console.log(`  ${nm.padEnd(10)} ${parts.join(" | ")}`);
}
