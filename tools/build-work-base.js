/* =============================================================
   PHASE 3 — Base de travail (SÉPARÉE DE LA PRODUCTION)
   -------------------------------------------------------------
   Écrit work/base-travail.json. Ne touche NI data.js NI api/_data/.

   Contenu :
     - les 10 262 prénoms de production, avec popularityTier RECALCULÉ
       sur les 5 sources (au lieu de 2) ;
     - les nouveaux candidats retenus, avec tout ce qui est calculable
       mécaniquement, et RIEN d'inventé.

   Ce qui est calculable sans risque : name, slug, gender, length,
   popularityTier, sources, fréquence, évidence.
   Ce qui ne l'est PAS et reste vide : origin, style, meaningTags,
   meaning, why. Aucune source de fréquence ne les fournit, et les
   déduire mécaniquement produirait des faussetés (démontré : la
   propriété P407 de Wikidata donne les langues d'USAGE, pas
   l'étymologie — « Jessica » y est étiquetée arabe).
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "work");
fs.mkdirSync(WORK, { recursive: true });

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const raw = JSON.parse(fs.readFileSync(path.join(WORK, "candidates-raw.json"), "utf8"));
const clean = JSON.parse(fs.readFileSync(path.join(WORK, "candidates-clean.json"), "utf8"));
const evidenceByKey = new Map(raw.map((c) => [c.key, c]));

const g = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g.NAMES ="));
const PROD = g.NAMES;

/* --- Seuil d'entrée des nouveaux candidats ---
   Retenu : attesté dans >= 3 sources indépendantes OU >= 3 sources
   impossible mais >= 20 000 occurrences cumulées sur 2 sources.
   Le multi-source est le meilleur séparateur entre prénom réel et
   invention locale : une invention américaine n'apparaît pas en
   France, en Irlande et à Berlin. */
const MIN_SOURCES = 3;
const selected = clean.filter((c) => c.nbSources >= MIN_SOURCES);

console.log("=== PHASE 3 — Base de travail ===");
console.log(`  production               : ${PROD.length.toLocaleString("fr")}`);
console.log(`  nouveaux retenus (>=${MIN_SOURCES} sources) : ${selected.length.toLocaleString("fr")}`);

/* --- Longueur, comme en production --- */
const lengthOf = (name) => {
  const l = name.replace(/[^\p{L}]/gu, "").length;
  return l <= 4 ? "court" : l <= 6 ? "moyen" : "long";
};

/* --- Classement par percentile ---
   Pour la production : PAR ORIGINE, comme aujourd'hui.
   Pour les nouveaux : ils n'ont pas d'origine, donc on les classe dans
   un groupe « sans origine » à part, avec les mêmes bornes. Les mêler
   au calcul par origine fausserait les percentiles des deux côtés. */
const BOUNDS = [[0.15, "classic"], [0.50, "established"], [0.85, "rare"], [1.01, "very_rare"]];
function assignTiers(items) {
  items.sort((a, b) => b._ev - a._ev);
  const n = items.length;
  items.forEach((it, i) => {
    const pct = n > 1 ? i / (n - 1) : 0;
    it.popularityTier = BOUNDS.find(([b]) => pct < b)[1];
  });
}

/* ---------- 1) Production re-classée sur 5 sources ---------- */
const prodOut = [];
const byOrigin = new Map();
for (const n of PROD) {
  const ev = evidenceByKey.get(norm(n.name));
  const rec = {
    name: n.name,
    slug: slugify(n.name),
    gender: n.gender,
    origin: n.origin,
    style: n.style,
    length: n.length,
    meaningTags: n.meaningTags || [],
    meaning: n.meaning,
    why: n.why,
    meaningStatus: "verified",       /* base curée à la main jusqu'ici */
    popularityTier: "unknown_popularity",
    freqSources: ev ? Object.keys(ev.sources) : [],
    totalCount: ev ? ev.totalCount : null,
    evidence: ev ? ev.evidence : null,
    provenance: "curated",
  };
  if (ev) {
    rec._ev = ev.evidence;
    if (!byOrigin.has(n.origin)) byOrigin.set(n.origin, []);
    byOrigin.get(n.origin).push(rec);
  }
  prodOut.push(rec);
}
byOrigin.forEach((items) => assignTiers(items));
prodOut.forEach((r) => delete r._ev);

/* ---------- 2) Nouveaux candidats ---------- */
const newOut = selected.map((c) => ({
  name: c.name,
  slug: slugify(c.name),
  gender: c.gender,
  origin: null,                    /* NON DÉTERMINÉ — jamais deviné */
  style: [],
  length: lengthOf(c.name),
  meaningTags: [],
  meaning: null,
  why: null,
  meaningStatus: "unknown",        /* exclu des recherches par signification */
  popularityTier: "unknown_popularity",
  freqSources: Object.keys(c.sources),
  totalCount: c.totalCount,
  evidence: c.evidence,
  altSpellings: c.altSpellings,
  nbSources: c.nbSources,
  provenance: "registry",
  _ev: c.evidence,
}));
assignTiers(newOut);
newOut.forEach((r) => delete r._ev);

const base = { generatedAt: new Date().toISOString(), production: prodOut, candidates: newOut };
fs.writeFileSync(path.join(WORK, "base-travail.json"), JSON.stringify(base));
const sz = fs.statSync(path.join(WORK, "base-travail.json")).size;
console.log(`  écrit -> work/base-travail.json (${(sz / 1048576).toFixed(1)} Mo)`);

/* ---------- Contrôles ---------- */
const tally = (arr, f) => arr.reduce((a, x) => (a[f(x)] = (a[f(x)] || 0) + 1, a), {});
console.log("\n  classement production (recalculé 5 sources) :", JSON.stringify(tally(prodOut, (x) => x.popularityTier)));
console.log("  classement nouveaux candidats               :", JSON.stringify(tally(newOut, (x) => x.popularityTier)));
console.log("  genre nouveaux candidats                    :", JSON.stringify(tally(newOut, (x) => x.gender)));
console.log("  statut signification (ensemble)             :",
  JSON.stringify(tally([...prodOut, ...newOut], (x) => x.meaningStatus)));
