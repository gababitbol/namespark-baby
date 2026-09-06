/* =============================================================
   NameSpark Baby — POST /api/generate
   -------------------------------------------------------------
   Génération de prénoms côté serveur. Remplace la génération locale
   qui obligeait le navigateur à télécharger tout data.js.

   L'ÉTAT DE SESSION RESTE CÔTÉ CLIENT :
     _genDepth, _genShown, _genFilSig ne migrent pas ici. Le client
     les gère comme avant et envoie `depth` + `exclude` à chaque appel.
     La fonction reste donc totalement sans état.

   La logique de sélection vit dans api/_ranking.js, partagée et
   verrouillée par tools/parity-check.js (parité stricte avec le code
   client historique, à graine aléatoire égale).

   CONTRAINTE DE PLATEFORME À NE PAS OUBLIER :
   ce projet n'a pas de package.json, donc Vercel compile les fonctions
   /api d'ESM vers CommonJS. La méta-URL de module n'a AUCUN équivalent
   CommonJS : sa seule présence dans le fichier, même dans une branche
   jamais exécutée, fait échouer le chargement du module
   (« Failed to load the ES module »). Les chemins se résolvent donc
   exclusivement via process.cwd(), qui vaut /var/task en production.

   Le catalogue est embarqué par functions.includeFiles (vercel.json) et
   vit sous api/_data/ : Vercel ne sert pas publiquement les chemins
   /api/_* (vérifié — 404), il n'est donc pas téléchargeable.
   ============================================================= */
import fs from "fs";
import path from "path";
import { generate } from "./_ranking.js";

/* Chargement du catalogue : une fois par instance, payé au cold start
   puis réutilisé par toutes les invocations chaudes. Paresseux et sous
   try/catch dans le handler, pour qu'une erreur de chemin renvoie un
   500 JSON lisible plutôt qu'un échec d'invocation opaque. */
function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "api", "_data", file), "utf8"));
}

let _cat = null;
function catalogue() {
  if (!_cat) {
    const INDEX = loadJson("names-index.json");
    _cat = { INDEX, DETAIL: loadJson("names-detail.json"), ORIGINS: new Set(INDEX.map((n) => n.origin)) };
  }
  return _cat;
}

/* ---------- Validation stricte : listes blanches ---------- */
const GENDERS = new Set(["boy", "girl", "mixte"]);
const STYLES = new Set(["classique", "moderne", "rare", "elegant", "court", "poetique"]);
const MEANINGS = new Set(["force", "courage", "sagesse", "lumiere", "nature", "liberte", "foi",
  "amour", "paix", "victoire", "joie", "beaute", "espoir", "noblesse", "grace", "prosperite"]);
const LENGTHS = new Set(["court", "moyen", "long"]);

/* Le nombre de résultats n'est PAS pilotable par le client : c'est la
   protection contre l'extraction de la base par un paramètre détourné. */
const LIMIT = 20;
const MAX_EXCLUDE = 1000;
const MAX_NAME_LEN = 60;

const pickEnum = (v, allowed) => (typeof v === "string" && allowed.has(v) ? v : "");

function sanitizeFilters(raw, ORIGINS) {
  const f = raw && typeof raw === "object" ? raw : {};
  const letter = typeof f.letter === "string" ? f.letter.trim().toLowerCase().slice(0, 1) : "";
  return {
    gender:  pickEnum(f.gender, GENDERS),
    origin:  pickEnum(f.origin, ORIGINS),
    style:   pickEnum(f.style, STYLES),
    meaning: pickEnum(f.meaning, MEANINGS),
    length:  pickEnum(f.length, LENGTHS),
    letter:  /^[a-z]$/.test(letter) ? letter : "",
  };
}

function sanitizeExclude(raw) {
  if (!Array.isArray(raw)) return new Set();
  /* Au-delà du plafond on garde les plus RÉCEMMENT vus (fin de liste) :
     ce sont ceux dont la réapparition se remarquerait le plus. */
  const slice = raw.length > MAX_EXCLUDE ? raw.slice(-MAX_EXCLUDE) : raw;
  const out = new Set();
  for (const v of slice) {
    if (typeof v === "string" && v.length > 0 && v.length <= MAX_NAME_LEN) out.add(v);
  }
  return out;
}

/* On ne renvoie que ce dont nameCardHTML() a besoin. popularityTier et
   meaningTags restent internes : ils ne servent pas à l'affichage. */
function toCard(n, DETAIL) {
  const d = DETAIL[n.name] || {};
  return {
    name: n.name,
    gender: n.gender,
    origin: n.origin,
    style: n.style,
    length: n.length,
    slug: n.slug,
    hasPage: n.hasPage,
    meaning: d.meaning || { fr: "", en: "" },
    why: d.why || { fr: "", en: "" },
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const { INDEX, DETAIL, ORIGINS } = catalogue();

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const filters = sanitizeFilters(body.filters, ORIGINS);
    const depth = Math.min(Math.max(Number.isFinite(+body.depth) ? Math.trunc(+body.depth) : 0, 0), 3);
    const exclude = sanitizeExclude(body.exclude);

    let names = generate(INDEX, filters, LIMIT, exclude, depth);
    let reset = false;

    /* Épuisement du pool — comportement identique à l'historique côté
       client (vider les vus, régénérer, prévenir l'utilisateur), mais
       résolu en un seul aller-retour au lieu de deux. Le client reçoit
       reset:true et remet _genShown / _genDepth à zéro + toast. */
    if (names.length === 0 && exclude.size > 0) {
      names = generate(INDEX, filters, LIMIT, null, 0);
      reset = true;
    }

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ names: names.map((n) => toCard(n, DETAIL)), reset });
  } catch (err) {
    console.error("[generate]", err);
    return res.status(500).json({ error: "generation_failed" });
  }
}
