/* =============================================================
   PHASE 2 — Qualité avant quantité
   -------------------------------------------------------------
   Applique des règles de rejet EXPLICITES et comptabilisées sur la
   base candidate, puis attribue un popularityTier.

   Principe directeur : on ne rejette que sur des critères vérifiables
   (forme, artefact d'enregistrement, absence d'attestation), jamais
   sur un jugement de goût. Un prénom rare mais authentique est
   conservé — il apparaîtra plus profondément dans l'exploration.

   Rappel de sémantique, volontairement rappelé ici car c'est
   l'erreur la plus facile à commettre :
     unknown_popularity = "pas de donnée de fréquence fiable"
     Ce n'est NI rare, NI bizarre. Un prénom absent d'INSEE/SSA/ONS
     n'est jamais classé `rare` de ce seul fait.
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "work");

const candidates = JSON.parse(fs.readFileSync(path.join(WORK, "candidates-new.json"), "utf8"));
const g = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g.NAMES ="));
const PROD = g.NAMES;

/* Lexique de référence : prénoms solidement attestés, utilisé pour
   repérer les concaténations d'enregistrement (« Oliviarose »). */
const strong = new Set();
candidates.filter((c) => c.totalCount >= 3000).forEach((c) => strong.add(c.name.toLowerCase()));
PROD.forEach((n) => strong.add(n.name.toLowerCase()));

const rejects = {};
function reject(rule, c, why) {
  (rejects[rule] = rejects[rule] || { n: 0, why, ex: [] }).n++;
  if (rejects[rule].ex.length < 12) rejects[rule].ex.push(c.name);
  return true;
}

/* --- Règles de forme --- */
const RE_ALLOWED = /^[\p{L}][\p{L}'\- ]*[\p{L}]$/u;

function isConcatArtifact(c) {
  /* Concaténation d'enregistrement : deux prénoms forts collés SANS
     séparateur. On exige que le prénom lui-même soit peu attesté —
     sinon « Alexander » (alex+ander) serait faussement rejeté. */
  if (c.totalCount >= 3000) return false;
  const n = c.name.toLowerCase();
  if (/[\s'-]/.test(n)) return false;      /* les composés à trait d'union sont traités à part */
  if (n.length < 10) return false;
  for (let i = 4; i <= n.length - 4; i++) {
    if (strong.has(n.slice(0, i)) && strong.has(n.slice(i))) return true;
  }
  return false;
}

const kept = [];
for (const c of candidates) {
  const nm = c.name;

  if (nm.length < 2)            { reject("trop_court", c, "moins de 2 lettres"); continue; }
  if (nm.length > 20)           { reject("trop_long", c, "plus de 20 caractères — presque toujours un artefact"); continue; }
  if (!RE_ALLOWED.test(nm))     { reject("caracteres_invalides", c, "chiffres, ponctuation ou caractère inattendu"); continue; }
  if (/(.)\1\1/.test(nm.toLowerCase())) { reject("lettre_triplee", c, "trois fois la même lettre — saisie erronée"); continue; }
  if (isConcatArtifact(c))      { reject("concatenation", c, "deux prénoms collés sans séparateur à l'état civil"); continue; }

  c.isCompound = /[\s-]/.test(nm);          /* composé légitime, conservé mais marqué */
  kept.push(c);
}

console.log("=== PHASE 2 — filtres de forme ===");
console.log(`  candidats en entrée : ${candidates.length.toLocaleString("fr")}`);
let totalRej = 0;
for (const [rule, r] of Object.entries(rejects).sort((a, b) => b[1].n - a[1].n)) {
  totalRej += r.n;
  console.log(`  ${rule.padEnd(22)} -${String(r.n).padStart(6)}  ${r.why}`);
  console.log(`     ex: ${r.ex.slice(0, 8).join(", ")}`);
}
console.log(`  ${"TOTAL rejeté".padEnd(22)} -${String(totalRej).padStart(6)}`);
console.log(`  restants            : ${kept.length.toLocaleString("fr")} (dont ${kept.filter((k) => k.isCompound).length.toLocaleString("fr")} composés à trait d'union/espace)`);

fs.writeFileSync(path.join(WORK, "candidates-clean.json"), JSON.stringify(kept));

/* --- Seuils d'attestation --- */
console.log("\n=== Attestation : que reste-t-il à chaque seuil ? ===");
console.log("  seuil        total   multi-pays   ≥3 sources");
for (const t of [25, 50, 100, 250, 500, 1000, 2000, 5000]) {
  const grp = kept.filter((c) => c.totalCount >= t);
  const m = grp.filter((c) => c.nbSources > 1).length;
  const m3 = grp.filter((c) => c.nbSources >= 3).length;
  console.log(`  >=${String(t).padStart(5)}  ${String(grp.length).padStart(7)}   ${String(m).padStart(8)}   ${String(m3).padStart(9)}`);
}

module.exports = { kept };
