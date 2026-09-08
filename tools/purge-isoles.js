/* =============================================================
   PURGE 3 — isolés validés un par un par l'utilisateur.
   -------------------------------------------------------------
   Liste NOMMÉE explicitement, pas de critère automatique : chaque
   entrée a été arbitrée individuellement après vérification externe.

   Les 7 isolés conservés reçoivent un MARQUEUR D'AUDIT (auditNote)
   sans que leur origine ni leur signification soient modifiées —
   ce sera l'objet de l'audit des origines.

   Mêmes garanties que les purges 1 et 2 : sauvegarde horodatée,
   fichier de restauration avec les lignes source exactes, simulation
   par défaut, refus d'exécution si les comptes ne correspondent pas.

   Usage : node tools/purge-isoles.js [--apply]
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const APPLY = process.argv.includes("--apply");
const DATA = path.join(ROOT, "data.js");

/* Validés SUPPRIMER après vérification externe */
const TO_DELETE = [
  "Abbal", "Adenzio", "Alibardesco", "Alkeh", "Allidis", "Aloga", "Alphuswith",
  "Abinori", "Alcinia", "Aldua", "Alluka", "Allitt", "Allron", "Alast",
  "Alhraud", "Almenith", "Alounia", "Adnesa", "Halor",
];

/* Conservés, avec la raison — reçoivent un marqueur d'audit.
   On ne touche NI à l'origine NI à la signification ici. */
const TO_FLAG = {
  "Alinor":   "conserve-purge3: variante medievale attestee d'Alienor/Eleanor. Origine et sens a revoir.",
  "Aelinor":  "conserve-purge3: forme anglo-normande attestee d'Eleanor. Origine et sens a revoir.",
  "Allertus": "conserve-purge3: latinisation attestee d'Adalbert. ORIGINE PROBABLEMENT FAUSSE (slave -> germanique).",
  "Abashi":   "conserve-purge3: atteste comme nom est-africain. Origine arabe a verifier.",
  "Alosia":   "conserve-purge3: proche d'Aloisia (feminin latin de Louis). A verifier.",
  "Almodis":  "conserve-purge2: atteste historiquement (Almodis de La Marche, +1071). Origine latin a verifier.",
  "Adha":     "incertain-purge3: mot arabe reel (Aid al-Adha). ORIGINE PROBABLEMENT FAUSSE (irlandais -> arabe).",
  "Alid":     "incertain-purge3: forme courte scandinave d'Adelheid, rare mais portee. A verifier.",
};

const deleteSet = new Set(TO_DELETE);
const flagSet = new Set(Object.keys(TO_FLAG));

console.log("=== PÉRIMÈTRE ===");
console.log(`  à supprimer (liste nommée) : ${TO_DELETE.length}`);
console.log(`  à marquer pour audit       : ${flagSet.size}`);
const overlap = TO_DELETE.filter((n) => flagSet.has(n));
console.log(`  chevauchement suppression/conservation : ${overlap.length} (doit être 0)`);
if (overlap.length) { console.error("ERREUR : un nom figure dans les deux listes. Abandon."); process.exit(1); }

const lines = fs.readFileSync(DATA, "utf8").split("\n");
const nameOf = (line) => {
  const m = line.match(/^ {2}\{ name: "((?:[^"\\]|\\.)*)"/);
  return m ? m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\") : null;
};

const kept = [];
const removed = [];
let flagged = 0, seen = 0;
for (const line of lines) {
  const nm = nameOf(line);
  if (nm === null) { kept.push(line); continue; }
  seen++;
  if (deleteSet.has(nm)) { removed.push({ name: nm, line }); continue; }
  if (flagSet.has(nm)) {
    /* Marqueur inséré en fin d'objet, sans toucher aux autres champs.
       Idempotent : on retire d'abord un auditNote éventuel. */
    const clean = line.replace(/, auditNote: "[^"]*"/g, "");
    const note = TO_FLAG[nm].replace(/"/g, "'");
    kept.push(clean.replace(/ \},\s*$/, `, auditNote: "${note}" },`));
    flagged++;
    continue;
  }
  kept.push(line);
}

console.log("\n=== CORRESPONDANCE ===");
console.log(`  entrées dans data.js : ${seen}`);
console.log(`  suppressions attendues : ${TO_DELETE.length} | trouvées : ${removed.length}`);
console.log(`  marquages attendus     : ${flagSet.size} | appliqués : ${flagged}`);
const missingDel = TO_DELETE.filter((n) => !removed.some((r) => r.name === n));
const missingFlag = [...flagSet].filter((n) => !lines.some((l) => nameOf(l) === n));
if (missingDel.length) { console.error(`ERREUR : introuvables (suppression) : ${missingDel.join(", ")}`); process.exit(1); }
if (missingFlag.length) { console.error(`ERREUR : introuvables (marquage) : ${missingFlag.join(", ")}`); process.exit(1); }
if (removed.length !== TO_DELETE.length || flagged !== flagSet.size) {
  console.error("ERREUR : comptes non conformes. Abandon."); process.exit(1);
}

if (!APPLY) { console.log("\n  SIMULATION — rien écrit. Relancer avec --apply."); process.exit(0); }

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(path.join(ROOT, "backups"), { recursive: true });
const backup = path.join(ROOT, "backups", `data.pre-purge-isoles.${stamp}.js`);
fs.copyFileSync(DATA, backup);
console.log(`\n  sauvegarde  -> backups/${path.basename(backup)}`);

const restore = {
  purgedAt: new Date().toISOString(),
  backup: path.basename(backup),
  criterion: "Liste nommée, arbitrée individuellement après vérification externe.",
  count: removed.length,
  entries: removed.map((r) => ({ name: r.name, sourceLine: r.line })),
  flagged: TO_FLAG,
};
const restorePath = path.join(ROOT, "backups", `restauration-isoles.${stamp}.json`);
fs.writeFileSync(restorePath, JSON.stringify(restore, null, 1));
console.log(`  restauration-> backups/${path.basename(restorePath)}`);

fs.writeFileSync(DATA, kept.join("\n"));
console.log(`  data.js : ${seen} -> ${seen - removed.length} entrées`);

const g = {};
eval(fs.readFileSync(DATA, "utf8").replace(/const NAMES =/, "g.NAMES ="));
console.log(`  relecture : ${g.NAMES.length} prénoms, syntaxe valide`);
console.log(`  supprimés encore présents : ${g.NAMES.filter((n) => deleteSet.has(n.name)).length} (doit être 0)`);
const marked = g.NAMES.filter((n) => n.auditNote);
console.log(`  entrées portant un marqueur d'audit : ${marked.length} / ${flagSet.size}`);
marked.forEach((n) => console.log(`    ${n.name.padEnd(11)} ${n.origin.padEnd(11)} "${n.meaning.fr}"  → ${n.auditNote.slice(0, 60)}…`));
