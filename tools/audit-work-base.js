/* =============================================================
   PHASE 4 — Audit de la base de travail, AVANT tout import.
   Ne modifie rien. Sortie : rapport chiffré sur stdout.
   ============================================================= */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "work");

const base = JSON.parse(fs.readFileSync(path.join(WORK, "base-travail.json"), "utf8"));
const PROD = base.production, NEW = base.candidates;
const ALL = [...PROD, ...NEW];
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();
const pct = (a, b) => (b ? (100 * a / b).toFixed(1) + " %" : "—");
const tally = (arr, f) => arr.reduce((a, x) => { const k = f(x); a[k] = (a[k] || 0) + 1; return a; }, {});
const line = (s) => console.log(s);

line("╔══════════════════════════════════════════════════════════════╗");
line("║  AUDIT DE LA BASE CANDIDATE — AUCUNE MODIFICATION PRODUCTION ║");
line("╚══════════════════════════════════════════════════════════════╝");

/* 1-2 : volumes */
const rawN = JSON.parse(fs.readFileSync(path.join(WORK, "candidates-raw.json"), "utf8")).length;
const cleanN = JSON.parse(fs.readFileSync(path.join(WORK, "candidates-clean.json"), "utf8")).length;
line("\n1-2) VOLUMES");
line(`  candidats bruts (5 sources fusionnées) : ${rawN.toLocaleString("fr")}`);
line(`  après filtres de forme                 : ${cleanN.toLocaleString("fr")}`);
line(`  retenus (>=3 sources indépendantes)    : ${NEW.length.toLocaleString("fr")}`);
line(`  base de production conservée           : ${PROD.length.toLocaleString("fr")}`);
line(`  TOTAL base de travail                  : ${ALL.length.toLocaleString("fr")}`);

/* 3 : par origine */
line("\n3) PAR ORIGINE");
const oCount = tally(PROD.filter((x) => x.origin), (x) => x.origin);
Object.entries(oCount).sort((a, b) => b[1] - a[1]).forEach(([o, n]) => line(`  ${o.padEnd(12)} ${String(n).padStart(5)}`));
line(`  ${"(sans origine)".padEnd(12)} ${String(NEW.length).padStart(5)}  ← nouveaux candidats, origine non déterminée`);

/* 4 : par genre */
line("\n4) PAR GENRE");
line(`  production : ${JSON.stringify(tally(PROD, (x) => x.gender))}`);
line(`  nouveaux   : ${JSON.stringify(tally(NEW, (x) => x.gender))}`);

/* 5 : classement */
line("\n5) CLASSEMENT DE POPULARITÉ");
const tp = tally(PROD, (x) => x.popularityTier), tn = tally(NEW, (x) => x.popularityTier);
["classic", "established", "rare", "very_rare", "unknown_popularity"].forEach((t) =>
  line(`  ${t.padEnd(20)} prod ${String(tp[t] || 0).padStart(5)}   nouveaux ${String(tn[t] || 0).padStart(5)}`));

/* 6 : significations */
line("\n6) SIGNIFICATIONS");
const ms = tally(ALL, (x) => x.meaningStatus);
Object.entries(ms).forEach(([k, n]) => line(`  ${k.padEnd(10)} ${String(n).padStart(6)}  ${pct(n, ALL.length)}`));
line("  → les 'unknown' restent générables, mais sont exclus dès que");
line("    l'utilisateur filtre par signification.");

/* 7 : couverture des combinaisons (production seule : les nouveaux n'ont pas ces axes) */
line("\n7) COUVERTURE DES COMBINAISONS (production, seule à porter origine/style/sens)");
const origins = Object.keys(oCount).sort();
const STYLES = ["classique", "moderne", "rare", "elegant", "court", "poetique"];
const MEANINGS = ["force", "courage", "sagesse", "lumiere", "nature", "liberte", "foi", "amour",
  "paix", "victoire", "joie", "beaute", "espoir", "noblesse", "grace", "prosperite"];
function combo(label, keysA, keysB, matchB) {
  let zero = 0, lt10 = 0, lt20 = 0, total = 0;
  const worst = [];
  for (const a of keysA) for (const b of keysB) {
    const n = PROD.filter((x) => x.origin === a && matchB(x, b)).length;
    total++;
    if (n === 0) zero++; else if (n < 10) lt10++; else if (n < 20) lt20++;
    if (n < 5) worst.push(`${a}×${b}:${n}`);
  }
  line(`  ${label.padEnd(22)} ${String(total).padStart(4)} combinaisons | 0 résultat: ${String(zero).padStart(3)} | <10: ${String(lt10).padStart(3)} | 10-19: ${String(lt20).padStart(3)}`);
  return worst;
}
const w1 = combo("genre × origine", origins, ["boy", "girl", "mixte"], (x, b) => x.gender === b);
const w2 = combo("origine × style", origins, STYLES, (x, b) => (x.style || []).includes(b));
const w3 = combo("origine × longueur", origins, ["court", "moyen", "long"], (x, b) => x.length === b);
const w4 = combo("origine × sens", origins, MEANINGS, (x, b) => (x.meaningTags || []).includes(b));
const letters = "abcdefghijklmnopqrstuvwxyz".split("");
const w5 = combo("origine × lettre", origins, letters, (x, b) => x.name[0].toLowerCase() === b);

/* 8 : plus gros trous */
line("\n8) PLUS GROS TROUS (combinaisons à moins de 5 prénoms)");
line(`  genre × origine    : ${w1.length} — ${w1.slice(0, 6).join(", ") || "aucun"}`);
line(`  origine × style    : ${w2.length} — ${w2.slice(0, 6).join(", ")}`);
line(`  origine × sens     : ${w4.length} — ${w4.slice(0, 6).join(", ")}`);
line(`  origine × lettre   : ${w5.length} — ${w5.slice(0, 6).join(", ")}`);

/* 9 : exemples ajoutés */
line("\n9) EXEMPLES DE NOUVEAUX PRÉNOMS RETENUS (par niveau d'attestation)");
[[5, "5 sources sur 5"], [4, "4 sources"], [3, "3 sources"]].forEach(([s, lab]) => {
  const g = NEW.filter((x) => x.nbSources === s).sort((a, b) => b.totalCount - a.totalCount);
  line(`  ${lab.padEnd(16)} n=${String(g.length).padStart(4)} : ${g.slice(0, 14).map((x) => x.name).join(", ")}`);
  if (g.length > 40) line(`  ${"".padEnd(16)}        …milieu : ${g.slice(Math.floor(g.length / 2), Math.floor(g.length / 2) + 12).map((x) => x.name).join(", ")}`);
});

/* 10 : rejets */
line("\n10) EXEMPLES REJETÉS — voir tools/filter-candidates.js pour le détail chiffré");
line("  concaténation d'état civil : Oliviarose, Isabellarose, Winterrose, Harpergrace");
line("  lettre triplée (saisie)    : Willliam, Melisssa, Mattthew, Jennnifer");
line("  caractère invalide         : 'Vatersname)'  ← fuite d'en-tête du fichier berlinois");
line("  mono-source peu attesté    : Krymson, Keurtys, Juanjesus, Marikate, Cheltzie, Trevathan");
line("  (motif : inventions locales, noms de famille, concaténations — non retenus faute");
line("   d'attestation croisée, mais NON supprimés du fichier candidats-clean.json)");

/* 11 : collisions de slug */
line("\n11) COLLISIONS DE SLUG");
const bySlug = new Map();
ALL.forEach((x) => { if (!bySlug.has(x.slug)) bySlug.set(x.slug, []); bySlug.get(x.slug).push(x.name); });
const col = [...bySlug.entries()].filter(([, v]) => new Set(v).size > 1);
line(`  slugs en collision : ${col.length}`);
col.slice(0, 12).forEach(([s, v]) => line(`    ${s.padEnd(18)} ← ${[...new Set(v)].join(" / ")}`));

/* dédoublonnage : quasi-variantes entre nouveaux et production */
line("\n11b) QUASI-DOUBLONS (distance 1) — À ARBITRER, JAMAIS FUSIONNÉS AUTOMATIQUEMENT");
const prodKeys = PROD.map((x) => norm(x.name));
const idx = new Map();
prodKeys.forEach((p) => { const k = p[0] + "|" + p.length; if (!idx.has(k)) idx.set(k, []); idx.get(k).push(p); });
function lev1(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, d = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++d > 1) return false;
    if (a.length > b.length) i++; else if (a.length < b.length) j++; else { i++; j++; }
  }
  return d + (a.length - i) + (b.length - j) <= 1;
}
let nearN = 0; const nearEx = [];
for (const c of NEW) {
  const k = norm(c.name);
  let hit = null;
  for (const dl of [-1, 0, 1]) {
    for (const p of idx.get(k[0] + "|" + (k.length + dl)) || []) if (lev1(k, p)) { hit = p; break; }
    if (hit) break;
  }
  if (hit) { nearN++; if (nearEx.length < 10) nearEx.push(`${c.name}≈${hit}`); }
}
line(`  nouveaux à distance 1 d'un prénom existant : ${nearN} (${pct(nearN, NEW.length)})`);
line(`  ex : ${nearEx.join(", ")}`);
line("  → ce sont des prénoms DISTINCTS (Patrick/Patrice, Emily/Emile, Robert/Roberto).");
line("    Aucune fusion automatique n'est appliquée.");

/* 12-13 : poids et mémoire */
line("\n12-13) POIDS SERVEUR ET MÉMOIRE");
const idxFields = (x) => ({ name: x.name, norm: norm(x.name), gender: x.gender, origin: x.origin,
  style: x.style, meaningTags: x.meaningTags, length: x.length, popularityTier: x.popularityTier,
  slug: x.slug, hasPage: true });
const simIndex = ALL.map(idxFields);
const simDetail = {};
ALL.forEach((x) => { simDetail[x.name] = { meaning: x.meaning, why: x.why }; });
const iSize = Buffer.byteLength(JSON.stringify(simIndex));
const dSize = Buffer.byteLength(JSON.stringify(simDetail));
line(`  index   : ${(iSize / 1048576).toFixed(2)} Mo pour ${ALL.length.toLocaleString("fr")} prénoms  (${(iSize / ALL.length).toFixed(0)} o/prénom)`);
line(`  détail  : ${(dSize / 1048576).toFixed(2)} Mo`);
[50000, 70000, 100000].forEach((n) => {
  const est = (iSize + dSize) / ALL.length * n / 1048576;
  line(`  extrapolé à ${n.toLocaleString("fr")} : ${est.toFixed(0)} Mo de fichiers`);
});
const before = process.memoryUsage().heapUsed;
const copy = JSON.parse(JSON.stringify(simIndex));
const heap = process.memoryUsage().heapUsed - before;
line(`  heap mesuré pour l'index (${ALL.length.toLocaleString("fr")}) : ${(heap / 1048576).toFixed(1)} Mo  [${copy.length} objets]`);
[50000, 70000, 100000].forEach((n) =>
  line(`  heap extrapolé à ${n.toLocaleString("fr")} : ${(heap / ALL.length * n / 1048576).toFixed(0)} Mo   (limite Vercel : 1024 Mo)`));
