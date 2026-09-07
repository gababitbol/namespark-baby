/* =============================================================
   PHASE 4 (14-15) — Benchmark moteur + test du ranking progressif
   sur la base de travail. Aucune modification de la production.
   Lancer avec --expose-gc pour une mesure mémoire fiable.
   ============================================================= */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const base = JSON.parse(fs.readFileSync(path.join(ROOT, "work", "base-travail.json"), "utf8"));
const ALL = [...base.production, ...base.candidates];

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();
const toIndex = (x) => ({ name: x.name, norm: norm(x.name), gender: x.gender, origin: x.origin || "",
  style: x.style || [], meaningTags: x.meaningTags || [], length: x.length,
  popularityTier: x.popularityTier, slug: x.slug, hasPage: true });

/* ---------- 13) mémoire, mesure fiable ---------- */
function heapOf(makeFn, label) {
  if (global.gc) global.gc();
  const before = process.memoryUsage().heapUsed;
  const held = makeFn();
  if (global.gc) global.gc();
  const after = process.memoryUsage().heapUsed;
  console.log(`  ${label.padEnd(34)} ${((after - before) / 1048576).toFixed(1)} Mo   (${held.length} objets)`);
  return { mb: (after - before) / 1048576, n: held.length };
}
console.log("=== 13) MÉMOIRE (mesure avec GC forcé) ===");
if (!global.gc) console.log("  ⚠️  lancé sans --expose-gc : mesure approximative");
const idx = heapOf(() => ALL.map(toIndex), `index ${ALL.length} prénoms`);
const perName = idx.mb / idx.n;
[50000, 70000, 100000].forEach((n) =>
  console.log(`  extrapolé à ${String(n).padStart(6)} prénoms         ${(perName * n).toFixed(0)} Mo   (limite fonction Vercel : 1024 Mo)`));

/* ---------- 14) benchmark du moteur ---------- */
const { generate } = require("../api/_ranking.js");
console.log("\n=== 14) BENCHMARK MOTEUR ===");
function bench(arr, label) {
  const filters = [
    { gender: "girl", origin: "italien", style: "", meaning: "", length: "", letter: "" },
    { gender: "", origin: "", style: "rare", meaning: "amour", length: "moyen", letter: "" },
    { gender: "boy", origin: "", style: "", meaning: "", length: "", letter: "l" },
    {},
  ];
  generate(arr, filters[0], 20, null, 0);        /* échauffement */
  const runs = 60;
  const t0 = process.hrtime.bigint();
  for (let i = 0; i < runs; i++) generate(arr, filters[i % filters.length], 20, null, i % 4);
  const t1 = process.hrtime.bigint();
  const ms = (Number(t1 - t0) / 1e6) / runs;
  console.log(`  ${label.padEnd(38)} ${ms.toFixed(2)} ms / génération`);
  return ms;
}
const index = ALL.map(toIndex);
const prodOnly = base.production.map(toIndex);
const msProd = bench(prodOnly, `production seule (${prodOnly.length})`);
const msAll = bench(index, `base de travail (${index.length})`);
/* extrapolation en dupliquant */
const x3 = []; for (let i = 0; i < 3; i++) index.forEach((n, j) => x3.push(i === 0 ? n : { ...n, name: n.name + "_" + i }));
bench(x3, `simulation ${x3.length}`);
const x6 = []; for (let i = 0; i < 6; i++) index.forEach((n, j) => x6.push(i === 0 ? n : { ...n, name: n.name + "_" + i }));
bench(x6, `simulation ${x6.length}`);

/* ---------- 15) ranking progressif : scénarios réels ---------- */
console.log("\n=== 15) RANKING PROGRESSIF — 5 générations par scénario ===");
console.log("    (on suit la part de classic+established, qui doit DÉCROÎTRE,");
console.log("     et l'apparition de rare/very_rare, qui doit CROÎTRE)\n");

const SCENARIOS = [
  ["français, garçon",          { gender: "boy", origin: "francais" }],
  ["fille italienne",           { gender: "girl", origin: "italien" }],
  ["arabe mixte",               { gender: "mixte", origin: "arabe" }],
  ["japonais",                  { origin: "japonais" }],
  ["coréen",                    { origin: "coreen" }],
  ["géorgien (peu de données)", { origin: "georgien" }],
  ["Style = Rare",              { style: "rare" }],
  ["lettre L + italien + fille", { gender: "girl", origin: "italien", letter: "l" }],
  ["signification restrictive", { meaning: "victoire", origin: "grec" }],
  ["aucun filtre",              {}],
];

for (const [label, f] of SCENARIOS) {
  const filters = { gender: "", origin: "", style: "", meaning: "", length: "", letter: "", ...f };
  const shown = new Set();
  const rows = [];
  for (let depth = 0; depth <= 4; depth++) {
    const d = Math.min(depth, 3);
    const res = generate(index, filters, 20, shown, d);
    res.forEach((n) => shown.add(n.name));
    const t = res.reduce((a, n) => (a[n.popularityTier] = (a[n.popularityTier] || 0) + 1, a), {});
    const etabli = (t.classic || 0) + (t.established || 0);
    rows.push({ depth, n: res.length, etabli, rare: (t.rare || 0) + (t.very_rare || 0), unk: t.unknown_popularity || 0,
      ex: res.slice(0, 3).map((n) => n.name).join(", ") });
  }
  console.log(`  ${label}`);
  rows.forEach((r) => console.log(
    `    gén.${r.depth}  ${String(r.n).padStart(2)} rés. | établis ${String(r.etabli).padStart(2)} | rares ${String(r.rare).padStart(2)} | sans donnée ${String(r.unk).padStart(2)} | ${r.ex}`));
  console.log(`    total vus sans doublon : ${shown.size}\n`);
}
