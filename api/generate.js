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

   NOTE D'IMPLÉMENTATION : tout le chargement (module de ranking +
   catalogue JSON) est fait paresseusement DANS le handler, sous
   try/catch. Une erreur de chemin ou de bundling renvoie ainsi un 500
   JSON lisible au lieu d'un FUNCTION_INVOCATION_FAILED opaque.
   ============================================================= */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const BUILD = "gen-6";

const HERE = (() => {
  try { return path.dirname(fileURLToPath(import.meta.url)); } catch { return ""; }
})();

function candidatePaths(file) {
  const out = [];
  if (HERE) {
    out.push(path.join(HERE, "_data", file));
    out.push(path.join(HERE, "..", "api", "_data", file));
  }
  out.push(path.join(process.cwd(), "api", "_data", file));
  out.push(path.join(process.cwd(), "_data", file));
  out.push(path.join("/var/task", "api", "_data", file));
  return out;
}

function loadJson(file) {
  for (const p of candidatePaths(file)) {
    try { if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8")); } catch { /* candidat suivant */ }
  }
  const err = new Error(`Catalogue introuvable : ${file}`);
  err.tried = candidatePaths(file);
  throw err;
}

let _boot = null;
async function boot() {
  if (!_boot) {
    const ranking = await import("./_ranking.js");
    _boot = {
      generate: ranking.generate,
      INDEX: loadJson("names-index.json"),
      DETAIL: loadJson("names-detail.json"),
    };
    _boot.ORIGINS = new Set(_boot.INDEX.map((n) => n.origin));
  }
  return _boot;
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
  /* Sonde de diagnostic : GET ?ping=1 confirme quel build répond, sans
     rien charger. */
  if (req.method === "GET" && req.query && req.query.ping) {
    return res.status(200).json({ build: BUILD, ok: true });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const { generate, INDEX, DETAIL, ORIGINS } = await boot();

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
    return res.status(500).json({
      error: "generation_failed",
      build: BUILD,
      detail: String((err && err.message) || err),
      stack: String((err && err.stack) || "").split("\n").slice(0, 4),
      tried: (err && err.tried) || undefined,
      cwd: process.cwd(),
      here: HERE,
      listing: (() => {
        try {
          return {
            here: HERE ? fs.readdirSync(HERE).slice(0, 30) : null,
            cwd: fs.readdirSync(process.cwd()).slice(0, 30),
          };
        } catch (e) { return String(e); }
      })(),
    });
  }
}
