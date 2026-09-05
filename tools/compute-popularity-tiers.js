/* Calcule un champ popularityTier ("classic" | "established" | "rare" |
 * "very_rare" | "unknown_popularity") pour chaque entrée de data.js, à
 * partir des seules sources de fréquence réelles dont on dispose aujourd'hui
 * (INSEE France, SSA États-Unis).
 *
 * Un prénom sans correspondance dans AUCUNE source -> "unknown_popularity".
 * Ce statut ne doit jamais être interprété comme "rare" : il signifie
 * seulement qu'on n'a pas encore de donnée de fréquence fiable.
 *
 * Les percentiles sont calculés PAR ORIGINE, uniquement parmi les prénoms
 * de cette origine qui ont une évidence réelle (jamais en absolu global) —
 * pour ne pas pénaliser une petite origine (ex: gallois) face à une grosse
 * (ex: francais).
 */
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data.js");
const BACKUP_DIR = path.join(__dirname, "..", "backups");

function normalize(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();
}

console.log("=== 1) Chargement des sources traitées ===");
const insee = JSON.parse(fs.readFileSync("/tmp/insee_processed_clean.json", "utf8"));
const ssa = JSON.parse(fs.readFileSync("/tmp/ssa_processed.json", "utf8"));

const inseeMap = new Map();
insee.forEach(r => inseeMap.set(normalize(r.name), r.totalCount));
const ssaMap = new Map();
ssa.forEach(r => ssaMap.set(normalize(r.name), r.totalCount));

const totalBirthsInsee = insee.reduce((s, r) => s + r.totalCount, 0);
const totalBirthsSsa = ssa.reduce((s, r) => s + r.totalCount, 0);
console.log("INSEE:", insee.length, "noms uniques, total captures:", totalBirthsInsee);
console.log("SSA:", ssa.length, "noms uniques, total captures:", totalBirthsSsa);

console.log("\n=== 2) Comptage des années distinctes (raw files) ===");
const inseeYears = new Map(); // normName -> Set(annee)
const inseeRaw = fs.readFileSync("/tmp/insee_nat_extracted/nat2022.csv", "utf8").split("\n").slice(1);
inseeRaw.forEach(line => {
  const parts = line.split(";");
  if (parts.length < 4) return;
  const [, preusuel, annais, nombre] = parts;
  if (!preusuel || preusuel === "_PRENOMS_RARES") return;
  const n = parseInt(nombre, 10);
  if (!Number.isFinite(n) || n <= 0) return;
  const key = normalize(preusuel);
  if (!inseeYears.has(key)) inseeYears.set(key, new Set());
  inseeYears.get(key).add(annais);
});
console.log("INSEE: annees distinctes calculees pour", inseeYears.size, "noms");

const ssaYears = new Map();
const ssaDir = "/tmp/ssa_extracted";
const ssaFiles = fs.readdirSync(ssaDir).filter(f => /^yob\d{4}\.txt$/.test(f));
ssaFiles.forEach(f => {
  const year = f.match(/\d{4}/)[0];
  const content = fs.readFileSync(path.join(ssaDir, f), "utf8");
  content.split("\n").forEach(line => {
    const [name, , count] = line.split(",");
    if (!name || !count) return;
    const n = parseInt(count, 10);
    if (!Number.isFinite(n) || n <= 0) return;
    const key = normalize(name);
    if (!ssaYears.has(key)) ssaYears.set(key, new Set());
    ssaYears.get(key).add(year);
  });
});
console.log("SSA: annees distinctes calculees pour", ssaYears.size, "noms");

console.log("\n=== 3) Chargement de data.js ===");
const g = {};
eval(fs.readFileSync(DATA_PATH, "utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;
console.log("Prenoms dans la base:", NAMES.length);

console.log("\n=== 4) Calcul de l'evidenceScore par prenom ===");
const FREQ_SCALE = 100000;
const YEAR_WEIGHT = 0.05;
const MULTISOURCE_BONUS = 2;

function computeEvidence(name) {
  const key = normalize(name);
  const inseeCount = inseeMap.get(key);
  const ssaCount = ssaMap.get(key);
  if (inseeCount === undefined && ssaCount === undefined) return null;

  let share = 0;
  let years = 0;
  let nbSources = 0;
  if (inseeCount !== undefined) {
    share += inseeCount / totalBirthsInsee;
    years += (inseeYears.get(key) || new Set()).size;
    nbSources++;
  }
  if (ssaCount !== undefined) {
    share += ssaCount / totalBirthsSsa;
    years += (ssaYears.get(key) || new Set()).size;
    nbSources++;
  }
  const freqTerm = Math.log(1 + share * FREQ_SCALE);
  const yearsTerm = years * YEAR_WEIGHT;
  const sourceTerm = nbSources > 1 ? MULTISOURCE_BONUS : 0;
  return freqTerm + yearsTerm + sourceTerm;
}

const withEvidence = []; // { entry, origin, score }
let noEvidenceCount = 0;
NAMES.forEach(n => {
  const score = computeEvidence(n.name);
  if (score === null) {
    n._tier = "unknown_popularity";
    noEvidenceCount++;
  } else {
    withEvidence.push({ entry: n, score });
  }
});
console.log("Avec evidence reelle:", withEvidence.length);
console.log("Sans evidence (-> unknown_popularity):", noEvidenceCount);

console.log("\n=== 5) Percentile PAR ORIGINE parmi les prenoms avec evidence ===");
const byOrigin = new Map();
withEvidence.forEach(item => {
  const o = item.entry.origin;
  if (!byOrigin.has(o)) byOrigin.set(o, []);
  byOrigin.get(o).push(item);
});

byOrigin.forEach((items, origin) => {
  items.sort((a, b) => b.score - a.score);
  const total = items.length;
  items.forEach((item, i) => {
    const pct = total > 1 ? i / (total - 1) : 0;
    let tier;
    if (pct < 0.15) tier = "classic";
    else if (pct < 0.50) tier = "established";
    else if (pct < 0.85) tier = "rare";
    else tier = "very_rare";
    item.entry._tier = tier;
  });
});

console.log("Origines avec au moins une evidence:", byOrigin.size, "/ 22");

console.log("\n=== 6) Verification sur echantillon connu ===");
["Marie", "Jean", "Pierre", "Firmin", "Zelie", "Alliance", "Gonthier", "Napoleon", "Alfonse"].forEach(sample => {
  const found = NAMES.find(n => normalize(n.name) === normalize(sample));
  if (found) console.log(" ", found.name.padEnd(12), "->", found._tier);
  else console.log(" ", sample, "-> absent de la base");
});

console.log("\n=== 7) Repartition finale des tiers ===");
const tally = {};
NAMES.forEach(n => { tally[n._tier] = (tally[n._tier] || 0) + 1; });
console.log(tally);

console.log("\n=== 8) Backup puis ecriture dans data.js ===");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(BACKUP_DIR, { recursive: true });
fs.copyFileSync(DATA_PATH, path.join(BACKUP_DIR, `data.pre-popularity-tiers.${stamp}.js`));
console.log("Backup ecrit dans backups/data.pre-popularity-tiers." + stamp + ".js");

const rawLines = fs.readFileSync(DATA_PATH, "utf8").split("\n");
let idx = 0;
const newLines = rawLines.map(line => {
  if (!line.startsWith("  { name: \"")) return line;
  const tier = NAMES[idx]._tier;
  idx++;
  return line.replace(", style: [", `, popularityTier: "${tier}", style: [`);
});
if (idx !== NAMES.length) {
  console.error("ERREUR: nombre de lignes objet (" + idx + ") != nombre de prenoms (" + NAMES.length + "). Abandon, rien n'est ecrit.");
  process.exit(1);
}
fs.writeFileSync(DATA_PATH, newLines.join("\n"));
console.log("data.js mis a jour avec popularityTier sur", idx, "entrees.");
