/* =============================================================
   Contrôle d'EXISTENCE externe (Wikidata), par lots.
   -------------------------------------------------------------
   But : distinguer un prénom réel mais absent des registres modernes
   (Themistocles, Penthesilea, Chrysanthos…) d'une chaîne fabriquée
   (Aligirrin, Abilalkaminah…).

   ⚠️ On n'utilise PAS Wikidata pour l'origine : la propriété P407 y
   désigne les langues d'USAGE, pas l'étymologie (Jessica y est
   étiquetée arabe). Ici on ne demande qu'une chose : « un élément
   "prénom" portant ce libellé existe-t-il ? ». C'est un signal
   d'existence, rien de plus.

   Écrit work/wikidata-existence.json : { nom: true/false }
   ============================================================= */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "work");

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();

const g = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g.NAMES ="));
const raw = JSON.parse(fs.readFileSync(path.join(WORK, "candidates-raw.json"), "utf8"));
const attested = new Set(raw.map((c) => c.key));

/* On ne teste que les prénoms sans attestation dans les registres. */
const toCheck = g.NAMES.filter((n) => !attested.has(norm(n.name))).map((n) => n.name);
console.log(`prénoms à vérifier (non attestés dans les 5 registres) : ${toCheck.length}`);

const OUT = path.join(WORK, "wikidata-existence.json");
const found = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const remaining = toCheck.filter((n) => !(n in found));
console.log(`déjà vérifiés : ${Object.keys(found).length} | restants : ${remaining.length}`);

const BATCH = 120;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function queryBatch(names) {
  /* Littéraux balisés par langue : lecture d'index, ~0,6 s par lot.
     (Le filtre STR(?l)=?s, lui, force un balayage complet et expire.) */
  const LANGS = ["en", "fr", "de", "es", "it", "el", "nl", "pt"];
  const values = names.flatMap((n) => LANGS.map((l) => JSON.stringify(n) + "@" + l)).join(" ");
  const q = `SELECT DISTINCT ?s WHERE { VALUES ?s { ${values} } ?item wdt:P31/wdt:P279* wd:Q202444 ; rdfs:label ?s . }`;
  /* POST obligatoire : en GET, 150 noms x 8 langues dépassent 18 000
     caractères d'URL et le service rejette la requête. */
  const res = await fetch("https://query.wikidata.org/sparql", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/sparql-results+json",
      "User-Agent": "NameSparkResearch/1.0 (data quality audit)",
    },
    body: new URLSearchParams({ query: q, format: "json" }),
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const d = await res.json();
  return new Set(d.results.bindings.map((b) => b.s.value));
}

(async () => {
  for (let i = 0; i < remaining.length; i += BATCH) {
    const slice = remaining.slice(i, i + BATCH);
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        const hits = await queryBatch(slice);
        slice.forEach((n) => { found[n] = hits.has(n); });
        ok = true;
        const nb = slice.filter((n) => found[n]).length;
        console.log(`  lot ${String(i / BATCH + 1).padStart(3)} (${slice.length}) : ${nb} existent dans Wikidata`);
      } catch (e) {
        console.log(`  lot ${i / BATCH + 1} tentative ${attempt} échouée : ${e.message}`);
        await sleep(8000);
      }
    }
    if (!ok) slice.forEach((n) => { found[n] = null; }); /* null = indéterminé */
    fs.writeFileSync(OUT, JSON.stringify(found));
    await sleep(1200);
  }
  const yes = Object.values(found).filter((v) => v === true).length;
  const no = Object.values(found).filter((v) => v === false).length;
  const unk = Object.values(found).filter((v) => v === null).length;
  console.log(`\nRÉSULTAT : existent ${yes} | absents ${no} | indéterminés ${unk}`);
})();
