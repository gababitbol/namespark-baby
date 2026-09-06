/* =============================================================
   Génère les artefacts de données consommés par les API serveur.
   -------------------------------------------------------------
   Sortie :
     data/names-index.json   — champs de filtrage / scoring / recherche
     data/names-detail.json  — textes affichés (meaning, why, variants)

   Pourquoi deux fichiers : /api/search ne charge que l'index (endpoint
   le plus sollicité, cold start le plus léger), /api/generate charge
   les deux. À 60k prénoms l'index reste ~4-5 Mo.

   IMPORTANT : l'ordre des entrées de l'index est IDENTIQUE à celui de
   data.js. La déduplication par nom (premier gagnant) et le tri stable
   par score en dépendent — c'est ce qui garantit la parité avec le
   comportement client historique.

   À relancer après toute modification de data.js.
   ============================================================= */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "api", "_data");

/* Doit rester rigoureusement identique à slugify() de build-seo-pages.js
   et à sigSlug() d'app.js — sinon les liens /prenom/<slug> cassent. */
const slugify = (name) => name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* Normalisation de recherche : identique à celle de sigSearch() d'app.js. */
const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const g = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;
console.log("Catalogue source :", NAMES.length, "entrées");

/* Quels slugs possèdent réellement une page statique ?
   build-seo-pages.js écrit la PREMIÈRE entrée d'un slug et ignore les
   suivantes. Lier un « perdant » enverrait vers la fiche d'un autre
   prénom : on marque donc hasPage=false pour eux. */
const slugOwner = new Map();
NAMES.forEach((n) => {
  const s = slugify(n.name);
  if (!slugOwner.has(s)) slugOwner.set(s, n.name);
});

const index = [];
const detail = {};
const seenName = new Set();
let noPage = 0;

for (const n of NAMES) {
  const slug = slugify(n.name);
  const hasPage = slugOwner.get(slug) === n.name;
  if (!hasPage) noPage++;

  index.push({
    name: n.name,
    norm: normalize(n.name),
    gender: n.gender,
    origin: n.origin,
    style: n.style,
    meaningTags: n.meaningTags || [],
    length: n.length,
    popularityTier: n.popularityTier || "unknown_popularity",
    slug,
    hasPage,
  });

  /* detail est indexé par nom ; en cas de doublon de nom, on garde la
     première occurrence, exactement comme la déduplication du scoring. */
  if (!seenName.has(n.name)) {
    seenName.add(n.name);
    const d = { meaning: n.meaning, why: n.why };
    if (n.variants && n.variants.length) d.variants = n.variants;
    if (n.pronunciation) d.pronunciation = n.pronunciation;
    detail[n.name] = d;
  }
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "names-index.json"), JSON.stringify(index));
fs.writeFileSync(path.join(OUT, "names-detail.json"), JSON.stringify(detail));

const kb = (p) => (fs.statSync(path.join(OUT, p)).size / 1024).toFixed(0) + " Ko";
console.log("names-index.json  :", index.length, "entrées,", kb("names-index.json"));
console.log("names-detail.json :", Object.keys(detail).length, "entrées,", kb("names-detail.json"));
console.log("Sans page statique (collision de slug) :", noPage);
