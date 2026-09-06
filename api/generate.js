/* =============================================================
   NameSpark Baby — POST /api/generate
   -------------------------------------------------------------
   Génération de prénoms côté serveur. Remplace la génération locale
   qui obligeait le navigateur à télécharger tout data.js (362 Ko
   transférés aujourd'hui, ~2 Mo une fois la base à 60k prénoms).

   L'ÉTAT DE SESSION RESTE CÔTÉ CLIENT :
     _genDepth, _genShown, _genFilSig ne migrent pas ici. Le client
     les gère comme avant et envoie `depth` + `exclude` à chaque appel.
     La fonction reste donc totalement sans état.

   La logique de sélection vit dans lib/ranking.js, partagée et
   verrouillée par tools/parity-check.js (parité stricte avec le
   code client historique, à graine aléatoire égale).
   ============================================================= */
import fs from "fs";
import path from "path";
import { generate } from "../lib/ranking.js";

/* ---------- Chargement du catalogue (une fois par instance) ----------
   Lecture au niveau module : payée au cold start, puis réutilisée par
   toutes les invocations chaudes de la même instance. */
const DATA_DIR = path.join(process.cwd(), "data");
const INDEX = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "names-index.json"), "utf8"));
const DETAIL = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "names-detail.json"), "utf8"));

/* ---------- Validation stricte : listes blanches ---------- */
const GENDERS = new Set(["boy", "girl", "mixte"]);
const ORIGINS = new Set(INDEX.map((n) => n.origin));
const STYLES = new Set(["classique", "moderne", "rare", "elegant", "court", "poetique"]);
const MEANINGS = new Set(["force", "courage", "sagesse", "lumiere", "nature", "liberte", "foi",
  "amour", "paix", "victoire", "joie", "beaute", "espoir", "noblesse", "grace", "prosperite"]);
const LENGTHS = new Set(["court", "moyen", "long"]);

/* Le nombre de résultats n'est PAS pilotable par le client : c'est la
   protection contre l'extraction de la base par un paramètre détourné. */
const LIMIT = 20;
const MAX_EXCLUDE = 1000;
const MAX_NAME_LEN = 60;

function pickEnum(value, allowed) {
  return typeof value === "string" && allowed.has(value) ? value : "";
}

function sanitizeFilters(raw) {
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

/* ---------- Mise en forme de la réponse ----------
   On ne renvoie que ce dont nameCardHTML() a besoin. popularityTier et
   meaningTags restent internes : ils ne servent pas à l'affichage. */
function toCard(n) {
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
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const filters = sanitizeFilters(body.filters);
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
    return res.status(200).json({ names: names.map(toCard), reset });
  } catch (err) {
    console.error("[generate]", err);
    return res.status(500).json({ error: "generation_failed" });
  }
}
