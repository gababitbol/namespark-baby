/* =============================================================
   AUDIT DE LA LISTE DE SUSPECTS — classement en 3 niveaux.
   Ne supprime RIEN. Écrit work/suspects-classes.json.
   -------------------------------------------------------------
   Principe : une entrée n'est déclarée fabriquée que si PLUSIEURS
   signaux indépendants convergent. L'absence des registres modernes
   n'est JAMAIS un motif à elle seule — beaucoup de prénoms anciens,
   régionaux ou cultuels réels n'y figurent pas.

   Leçon d'une première version trop laxiste : une « série » de 4 à 6
   entrées partageant 4 lettres ne prouve rien, car les vrais prénoms
   se groupent aussi alphabétiquement (Chrysogonas / Chrysomalis /
   Chrysothemis, Abdelaziz / Abdelmoumin, Archambaud / Archimbaud).
   Elle avait classé « certainement fabriqué » des prénoms réels :
   Chanhee (찬희), Chrysothemis, Abdelmoumin, Alinor.

   Ce qui distingue vraiment un bloc généré :
     - il est LONG (8 entrées et plus, souvent 30 à 50) ;
     - le préfixe commun est LONG (5 lettres et plus) ;
     - les membres ne diffèrent que par une terminaison très courte
       (ratio de queue faible) — « Alighilsonunkl », « Alighilsonunkla » ;
     - aucun membre n'est attesté nulle part ;
     - les significations sont recopiées d'un gabarit minuscule.

   Signaux :
     S1 aucune attestation dans les 5 registres officiels
     S2 absent de Wikidata en tant que prénom (signal d'EXISTENCE ;
        bon en positif, faible en négatif — le typage Wikidata est
        incomplet : Hippokrates et Konstantijn n'y sont pas typés)
     S3 appartient à un bloc mécanique (définition durcie ci-dessus)
     S4 signification « gabarit » : partagée par >=20 prénoms dont
        moins de 10 % sont attestés
   ============================================================= */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "work");

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();

const g = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g.NAMES ="));
const N = g.NAMES;

const raw = JSON.parse(fs.readFileSync(path.join(WORK, "candidates-raw.json"), "utf8"));
const evByKey = new Map(raw.map((c) => [c.key, c]));
const wd = JSON.parse(fs.readFileSync(path.join(WORK, "wikidata-existence.json"), "utf8"));

/* ---- Construction des blocs contigus ---- */
const blocks = [];
let cur = [];
for (let i = 0; i < N.length; i++) {
  const a = N[i], b = N[i + 1];
  cur.push(a);
  const linked = b && a.origin === b.origin && norm(a.name).slice(0, 4) === norm(b.name).slice(0, 4);
  if (!linked) { if (cur.length >= 4) blocks.push(cur); cur = []; }
}
if (cur.length >= 4) blocks.push(cur);

const blockOf = new Map();
blocks.forEach((members, i) => {
  let p = norm(members[0].name);
  for (const x of members) {
    const q = norm(x.name);
    let k = 0; while (k < p.length && k < q.length && p[k] === q[k]) k++;
    p = p.slice(0, k);
  }
  const attested = members.filter((x) => evByKey.has(norm(x.name))).length;
  const tailRatio = members.reduce((a, x) => {
    const L = norm(x.name).length;
    return a + (L - p.length) / L;
  }, 0) / members.length;

  /* Bloc MÉCANIQUE : les quatre conditions ensemble. */
  const mechanical = members.length >= 8 && p.length >= 5 &&
                     attested / members.length < 0.05 && tailRatio < 0.45;

  const info = { id: i + 1, prefix: p, size: members.length, attested,
                 tailRatio: +tailRatio.toFixed(2), mechanical,
                 sample: members.slice(0, 5).map((x) => x.name) };
  members.forEach((x) => blockOf.set(x.name, info));
});

/* ---- Significations gabarit ---- */
const byMeaning = new Map();
N.forEach((n) => {
  const m = n.meaning.fr.trim();
  if (!byMeaning.has(m)) byMeaning.set(m, []);
  byMeaning.get(m).push(n);
});
const templated = new Map();
byMeaning.forEach((arr, m) => {
  if (arr.length < 20) return;
  const a = arr.filter((x) => evByKey.has(norm(x.name))).length;
  if (a / arr.length < 0.10) templated.set(m, { count: arr.length, attested: a });
});

/* ---- Classement ---- */
const out = [];
for (const n of N) {
  const key = norm(n.name);
  const ev = evByKey.get(key);
  const nbSources = ev ? Object.keys(ev.sources).length : 0;
  if (nbSources > 0) continue;

  const inWd = n.name in wd ? wd[n.name] : null;
  const blk = blockOf.get(n.name) || null;
  const tmpl = templated.get(n.meaning.fr.trim()) || null;

  const signals = ["S1 aucune attestation officielle"];
  if (inWd === false) signals.push("S2 absent de Wikidata");
  if (inWd === true) signals.push("S2* PRÉSENT dans Wikidata — présomption de prénom réel");
  if (blk) signals.push(`S3 bloc « ${blk.prefix}… » ${blk.size} entrées, queue ${blk.tailRatio}, ${blk.attested} attesté(s)${blk.mechanical ? " — MÉCANIQUE" : " (bloc faible, non probant)"}`);
  if (tmpl) signals.push(`S4 signification gabarit « ${n.meaning.fr} » (×${tmpl.count}, ${tmpl.attested} attesté(s))`);

  /* Les prénoms chinois, japonais et coréens sont MORPHOLOGIQUEMENT
     compositionnels : une syllabe partagée suivie d'un second morphème
     distinct (Changming, Changwei, Changsheng — 明/伟/生). Cela imite
     exactement la signature d'un bloc généré, et le test structurel ne
     peut pas les distinguer. On ne les déclare donc JAMAIS certains :
     ils demandent l'œil d'un locuteur. */
  const cjk = n.origin === "chinois" || n.origin === "japonais" || n.origin === "coreen";

  let level, confidence, reason;
  if (inWd === true) {
    level = "a_revoir";
    confidence = "ne pas supprimer";
    reason = "Wikidata connaît ce prénom : présomption de réalité.";
  } else if (cjk) {
    level = "a_revoir";
    confidence = "ne pas supprimer sans relecture par un locuteur";
    reason = "Origine CJK : la composition par syllabes partagées imite la signature d'un bloc généré. Le test structurel ne conclut pas.";
  } else if (blk && blk.mechanical && tmpl) {
    level = "certain";
    confidence = "très élevée";
    reason = "Bloc mécanique long ET signification recopiée d'un gabarit, aucune attestation.";
  } else if (blk && blk.mechanical) {
    level = "certain";
    confidence = "élevée";
    reason = "Bloc mécanique long (préfixe long, terminaisons permutées, zéro attestation).";
  } else if (tmpl && blk) {
    level = "tres_probable";
    confidence = "moyenne-haute";
    reason = "Signification gabarit + voisinage alphabétique, mais bloc trop court pour conclure seul.";
  } else if (tmpl) {
    level = "tres_probable";
    confidence = "moyenne";
    reason = "Signification recopiée d'un gabarit très peu attesté.";
  } else {
    level = "a_revoir";
    confidence = "insuffisante pour supprimer";
    reason = "Absent des registres modernes, mais aucun signal de fabrication — peut être un prénom ancien, régional ou cultuel.";
  }

  out.push({
    name: n.name, origin: n.origin, gender: n.gender, meaning: n.meaning.fr,
    officialSources: nbSources, inWikidata: inWd,
    block: blk ? { id: blk.id, prefix: blk.prefix, size: blk.size, tailRatio: blk.tailRatio,
                   mechanical: blk.mechanical, sample: blk.sample } : null,
    detectedBy: signals, level, confidence, reason,
  });
}

fs.writeFileSync(path.join(WORK, "suspects-classes.json"), JSON.stringify(out, null, 1));

const by = (l) => out.filter((x) => x.level === l);
console.log("=== CLASSEMENT (aucune suppression) ===");
console.log(`  non attestés examinés      : ${out.length}`);
console.log(`  certainement fabriqué      : ${by("certain").length}`);
console.log(`  très probablement fabriqué : ${by("tres_probable").length}`);
console.log(`  à revoir manuellement      : ${by("a_revoir").length}`);
console.log(`     dont présents dans Wikidata (protégés) : ${out.filter((x) => x.inWikidata === true).length}`);
console.log(`\n  blocs mécaniques retenus : ${blocks.filter((b) => blockOf.get(b[0].name).mechanical).length} / ${blocks.length} blocs contigus`);
console.log(`  écrit -> work/suspects-classes.json`);
