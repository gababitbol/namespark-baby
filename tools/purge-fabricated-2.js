/* =============================================================
   PURGE 2 — familles « très probablement fabriquées ».
   -------------------------------------------------------------
   Périmètre : les entrées de niveau `tres_probable` appartenant à une
   FAMILLE d'au moins 2 membres (même origine + même préfixe de 4
   lettres). Les 26 ISOLÉS sont explicitement épargnés : ce sont eux
   qui peuvent cacher des prénoms réels (Almodis, Alinor, Aelinor,
   Allertus…) et ils seront arbitrés un par un.

   Mêmes garanties que la première purge :
     sauvegarde horodatée, fichier de restauration avec les lignes
     source exactes, simulation par défaut, et refus d'exécution si le
     compte attendu ne correspond pas au compte trouvé.

   Usage : node tools/purge-fabricated-2.js [--apply]
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const APPLY = process.argv.includes("--apply");
const norm4 = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "").slice(0, 4);

const classes = JSON.parse(fs.readFileSync(path.join(ROOT, "work", "suspects-classes.json"), "utf8"));
const tp = classes.filter((x) => x.level === "tres_probable");

/* Regroupement en familles (origine + préfixe de 4 lettres) */
const fam = new Map();
tp.forEach((x) => {
  const k = x.origin + "|" + norm4(x.name);
  if (!fam.has(k)) fam.set(k, []);
  fam.get(k).push(x);
});

const families = [...fam.entries()].map(([k, members]) => ({
  key: k, origin: k.split("|")[0], prefix: k.split("|")[1], members,
}));
const toPurge = families.filter((f) => f.members.length >= 2);
const isolated = families.filter((f) => f.members.length === 1);

/* ÉPARGNÉS NOMMÉMENT — biais de conservation demandé.
   Almodis est attesté historiquement (Almodis de La Marche, comtesse
   de Barcelone, † 1071) et reste employé en onomastique occitane et
   catalane. Le test Wikidata ne le rattrape pas car la comtesse y est
   libellée « Almodis de La Marche » et non « Almodis ». Il se trouve
   dans une famille de 3, mais l'attestation historique prime. */
const SPARED = new Set(["Almodis"]);

const toDelete = toPurge.flatMap((f) => f.members).filter((x) => !SPARED.has(x.name));
const deleteSet = new Set(toDelete.map((x) => x.name));

console.log("=== PÉRIMÈTRE ===");
console.log(`  niveau « très probable »        : ${tp.length}`);
console.log(`  familles de >=2 membres         : ${toPurge.length}  (${toDelete.length} prénoms) → À SUPPRIMER`);
console.log(`  isolés (1 membre)               : ${isolated.length} → ÉPARGNÉS`);
console.log(`  épargnés nommément (attestation historique) : ${SPARED.size} — ${[...SPARED].join(", ")}`);
console.log(`  contrôle : ${toDelete.length} + ${isolated.length} + ${SPARED.size} = ${toDelete.length + isolated.length + SPARED.size} (doit valoir ${tp.length})`);
if (toDelete.length + isolated.length + SPARED.size !== tp.length) { console.error("ERREUR de partition. Abandon."); process.exit(1); }

/* Garde-fous : rien hors du périmètre */
const wd = toDelete.filter((x) => x.inWikidata === true);
const att = toDelete.filter((x) => x.officialSources > 0);
const cjk = toDelete.filter((x) => ["chinois", "japonais", "coreen"].includes(x.origin));
const wrongLevel = toDelete.filter((x) => x.level !== "tres_probable");
console.log(`\n  garde-fous — attestés Wikidata : ${wd.length} | attestés registres : ${att.length} | CJK : ${cjk.length} | mauvais niveau : ${wrongLevel.length}  (tous doivent valoir 0)`);
if (wd.length || att.length || cjk.length || wrongLevel.length) { console.error("ERREUR : garde-fou déclenché. Abandon."); process.exit(1); }

/* Les 26 isolés ne doivent JAMAIS figurer dans la liste */
const isolatedNames = new Set(isolated.map((f) => f.members[0].name));
const leaked = [...deleteSet].filter((n) => isolatedNames.has(n));
console.log(`  isolés présents par erreur dans la liste : ${leaked.length} (doit être 0)`);
if (leaked.length) { console.error("ERREUR : un isolé allait être supprimé. Abandon."); process.exit(1); }

console.log("\n=== FAMILLES SUPPRIMÉES ===");
toPurge.sort((a, b) => b.members.length - a.members.length).forEach((f) =>
  console.log(`  [${f.origin.padEnd(10)}] «${f.prefix}» ×${String(f.members.length).padStart(3)}  ${f.members.slice(0, 4).map((m) => m.name).join(", ")}`));

/* ---- Repérage dans data.js ---- */
const DATA = path.join(ROOT, "data.js");
const lines = fs.readFileSync(DATA, "utf8").split("\n");
const nameOf = (line) => {
  const m = line.match(/^ {2}\{ name: "((?:[^"\\]|\\.)*)"/);
  return m ? m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\") : null;
};

const kept = [];
const removed = [];
let seen = 0;
for (const line of lines) {
  const nm = nameOf(line);
  if (nm === null) { kept.push(line); continue; }
  seen++;
  if (deleteSet.has(nm)) removed.push({ name: nm, line });
  else kept.push(line);
}

console.log(`\n=== CORRESPONDANCE ===`);
console.log(`  entrées dans data.js : ${seen}`);
console.log(`  attendues            : ${toDelete.length}`);
console.log(`  trouvées             : ${removed.length}`);
const missing = [...deleteSet].filter((n) => !removed.some((r) => r.name === n));
if (missing.length) { console.error(`ERREUR : ${missing.length} introuvables : ${missing.slice(0, 5).join(", ")}`); process.exit(1); }
if (removed.length !== toDelete.length) { console.error("ERREUR : compte différent. Abandon."); process.exit(1); }

if (!APPLY) { console.log("\n  SIMULATION — rien écrit. Relancer avec --apply."); process.exit(0); }

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(path.join(ROOT, "backups"), { recursive: true });
const backup = path.join(ROOT, "backups", `data.pre-purge-familles.${stamp}.js`);
fs.copyFileSync(DATA, backup);
console.log(`\n  sauvegarde  -> backups/${path.basename(backup)}`);

const restore = {
  purgedAt: new Date().toISOString(),
  backup: path.basename(backup),
  criterion: "level=tres_probable ET famille (origine + préfixe 4 lettres) d'au moins 2 membres. Les 26 isolés sont épargnés.",
  count: removed.length,
  families: toPurge.map((f) => ({ origin: f.origin, prefix: f.prefix, size: f.members.length,
                                  names: f.members.map((m) => m.name) })),
  spared: isolated.map((f) => ({ name: f.members[0].name, origin: f.members[0].origin, meaning: f.members[0].meaning })),
  sparedByName: [...SPARED],
  entries: removed.map((r) => {
    const meta = toDelete.find((x) => x.name === r.name);
    return { name: r.name, origin: meta.origin, meaning: meta.meaning, reason: meta.reason, sourceLine: r.line };
  }),
};
const restorePath = path.join(ROOT, "backups", `restauration-familles.${stamp}.json`);
fs.writeFileSync(restorePath, JSON.stringify(restore, null, 1));
console.log(`  restauration-> backups/${path.basename(restorePath)}`);

fs.writeFileSync(DATA, kept.join("\n"));
console.log(`  data.js : ${seen} -> ${seen - removed.length} entrées`);

const g = {};
eval(fs.readFileSync(DATA, "utf8").replace(/const NAMES =/, "g.NAMES ="));
console.log(`  relecture : ${g.NAMES.length} prénoms, syntaxe valide`);
console.log(`  contrôle : ${g.NAMES.filter((n) => deleteSet.has(n.name)).length} supprimé(s) encore présent(s) (doit être 0)`);
console.log(`  contrôle : ${g.NAMES.filter((n) => isolatedNames.has(n.name)).length} / ${isolated.length} isolés toujours présents (doit valoir ${isolated.length})`);
