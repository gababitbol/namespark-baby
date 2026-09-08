/* =============================================================
   PURGE des entrées « certainement fabriquées ».
   -------------------------------------------------------------
   Sécurité :
     1. sauvegarde horodatée de data.js dans backups/ ;
     2. écriture d'un fichier de RESTAURATION contenant les entrées
        COMPLÈTES supprimées (pas seulement les noms) — la purge est
        donc réversible à l'identique ;
     3. suppression ligne à ligne, en vérifiant que chaque ligne
        correspond bien au prénom attendu ;
     4. refus de s'exécuter si le compte ne tombe pas juste.

   Ne touche QUE le niveau "certain". Les niveaux "tres_probable" et
   "a_revoir" (dont les CJK et les prénoms attestés par Wikidata) sont
   laissés intacts.

   Usage : node tools/purge-fabricated.js --apply
           (sans --apply : simulation, aucune écriture)
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const APPLY = process.argv.includes("--apply");

const classes = JSON.parse(fs.readFileSync(path.join(ROOT, "work", "suspects-classes.json"), "utf8"));
const toDelete = classes.filter((x) => x.level === "certain");
const deleteSet = new Set(toDelete.map((x) => x.name));

console.log(`entrées à supprimer (niveau « certain ») : ${toDelete.length}`);
if (deleteSet.size !== toDelete.length) {
  console.error("ERREUR : doublons de noms dans la liste de suppression. Abandon.");
  process.exit(1);
}

/* Garde-fous : rien d'autre ne doit être touché. */
const protectedLevels = classes.filter((x) => x.level !== "certain");
const overlap = protectedLevels.filter((x) => deleteSet.has(x.name));
if (overlap.length) {
  console.error(`ERREUR : ${overlap.length} entrées protégées figurent aussi dans la liste. Abandon.`);
  process.exit(1);
}
const cjkInList = toDelete.filter((x) => ["chinois", "japonais", "coreen"].includes(x.origin));
const wdInList = toDelete.filter((x) => x.inWikidata === true);
const attestedInList = toDelete.filter((x) => x.officialSources > 0);
console.log(`  contrôle CJK dans la liste              : ${cjkInList.length} (doit être 0)`);
console.log(`  contrôle attestés Wikidata dans la liste: ${wdInList.length} (doit être 0)`);
console.log(`  contrôle attestés registres dans la liste: ${attestedInList.length} (doit être 0)`);
if (cjkInList.length || wdInList.length || attestedInList.length) {
  console.error("ERREUR : un garde-fou a sauté. Abandon.");
  process.exit(1);
}

const DATA = path.join(ROOT, "data.js");
const src = fs.readFileSync(DATA, "utf8");
const lines = src.split("\n");

/* Repérage : chaque entrée occupe une ligne commençant par `  { name: "` */
const nameOf = (line) => {
  const m = line.match(/^ {2}\{ name: "((?:[^"\\]|\\.)*)"/);
  return m ? m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\") : null;
};

const kept = [];
const removedLines = [];
let seen = 0;
for (const line of lines) {
  const nm = nameOf(line);
  if (nm === null) { kept.push(line); continue; }
  seen++;
  if (deleteSet.has(nm)) removedLines.push({ name: nm, line });
  else kept.push(line);
}

console.log(`\n  entrées trouvées dans data.js : ${seen}`);
console.log(`  lignes retirées                : ${removedLines.length}`);
const notFound = [...deleteSet].filter((n) => !removedLines.some((r) => r.name === n));
if (notFound.length) {
  console.error(`ERREUR : ${notFound.length} prénoms à supprimer introuvables dans data.js : ${notFound.slice(0, 5).join(", ")}`);
  process.exit(1);
}
if (removedLines.length !== toDelete.length) {
  console.error(`ERREUR : ${removedLines.length} lignes retirées pour ${toDelete.length} attendues. Abandon.`);
  process.exit(1);
}

if (!APPLY) {
  console.log("\n  SIMULATION — rien n'a été écrit. Relancer avec --apply.");
  process.exit(0);
}

/* 1) sauvegarde */
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.join(ROOT, "backups");
fs.mkdirSync(backupDir, { recursive: true });
const backup = path.join(backupDir, `data.pre-purge-fabriques.${stamp}.js`);
fs.copyFileSync(DATA, backup);
console.log(`\n  sauvegarde  -> backups/${path.basename(backup)}`);

/* 2) fichier de restauration : lignes source EXACTES + métadonnées */
const restore = {
  purgedAt: new Date().toISOString(),
  backup: path.basename(backup),
  criterion: "level=certain (bloc mécanique long, zéro attestation, absent de Wikidata, hors CJK)",
  count: removedLines.length,
  entries: removedLines.map((r) => {
    const meta = toDelete.find((x) => x.name === r.name);
    return { name: r.name, origin: meta.origin, meaning: meta.meaning,
             block: meta.block, reason: meta.reason, sourceLine: r.line };
  }),
};
const restorePath = path.join(ROOT, "backups", `restauration-465-fabriques.${stamp}.json`);
fs.writeFileSync(restorePath, JSON.stringify(restore, null, 1));
console.log(`  restauration-> backups/${path.basename(restorePath)}`);

/* 3) écriture */
fs.writeFileSync(DATA, kept.join("\n"));
console.log(`  data.js mis à jour : ${seen} -> ${seen - removedLines.length} entrées`);

/* 4) relecture de contrôle */
const g = {};
eval(fs.readFileSync(DATA, "utf8").replace(/const NAMES =/, "g.NAMES ="));
console.log(`  relecture : ${g.NAMES.length} prénoms, syntaxe valide`);
const stillThere = g.NAMES.filter((n) => deleteSet.has(n.name));
console.log(`  contrôle final : ${stillThere.length} entrée(s) supprimée(s) encore présente(s) (doit être 0)`);
