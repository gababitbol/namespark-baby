/* =============================================================
   NameSpark Baby — Fonction serveur unique, multi-modes
   -------------------------------------------------------------
   URLs publiques (via "rewrites" dans vercel.json — un rewrite ne
   crée PAS de fonction serverless supplémentaire) :

     POST /api/generate  → mode "generate"  : génération de prénoms
     POST /api/names     → mode "hydrate"   : name[] -> objets complets
     GET  /api/search    → mode "search"    : autocomplétion

   POURQUOI UNE SEULE FONCTION : le plan Hobby de Vercel plafonne à
   12 fonctions serverless par déploiement, et le projet y est déjà.
   Une 13e fait échouer le build SILENCIEUSEMENT (404, aucune erreur
   visible). Effet de bord bénéfique : un seul cold start partagé par
   les trois modes, et le catalogue chargé une seule fois par instance.

   L'ÉTAT DE SESSION RESTE CÔTÉ CLIENT : _genDepth, _genShown et
   _genFilSig ne migrent pas ici. Le client les gère comme aujourd'hui
   et envoie `depth` + `exclude`. La fonction est sans état.

   CONTRAINTE DE PLATEFORME À NE PAS OUBLIER : sans package.json,
   Vercel compile les fonctions /api d'ESM vers CommonJS. La méta-URL
   de module n'a aucun équivalent CommonJS — sa seule présence dans le
   fichier, même dans une branche jamais exécutée, casse le chargement
   (« Failed to load the ES module »). Les chemins passent donc
   exclusivement par process.cwd() (= /var/task en production).
   ============================================================= */
import fs from "fs";
import path from "path";
import { generate, getSimilar } from "./_ranking.js";

/* Catalogue : chargé une fois par instance (payé au cold start), puis
   réutilisé par toutes les invocations chaudes. Vit sous api/_data/,
   que Vercel ne sert pas publiquement (vérifié — 404). */
function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "api", "_data", file), "utf8"));
}

let _cat = null;
function catalogue() {
  if (!_cat) {
    const INDEX = loadJson("names-index.json");
    const BY_NAME = new Map();
    for (const n of INDEX) if (!BY_NAME.has(n.name)) BY_NAME.set(n.name, n);
    _cat = {
      INDEX,
      BY_NAME,
      DETAIL: loadJson("names-detail.json"),
      ORIGINS: new Set(INDEX.map((n) => n.origin)),
    };
  }
  return _cat;
}

/* ---------- Validation stricte : listes blanches ---------- */
const GENDERS = new Set(["boy", "girl", "mixte"]);
const STYLES = new Set(["classique", "moderne", "rare", "elegant", "court", "poetique"]);
const MEANINGS = new Set(["force", "courage", "sagesse", "lumiere", "nature", "liberte", "foi",
  "amour", "paix", "victoire", "joie", "beaute", "espoir", "noblesse", "grace", "prosperite"]);
const LENGTHS = new Set(["court", "moyen", "long"]);

/* Aucune de ces limites n'est pilotable par le client : c'est la
   protection contre l'extraction de la base par un paramètre détourné. */
const LIMIT = 20;          // résultats de génération
const SEARCH_LIMIT = 10;   // suggestions d'autocomplétion
const HYDRATE_MAX = 300;   // noms hydratés par appel
const SIMILAR_LIMIT = 6;
const MAX_EXCLUDE = 1000;
const MAX_NAME_LEN = 60;
const MAX_Q_LEN = 30;

const pickEnum = (v, allowed) => (typeof v === "string" && allowed.has(v) ? v : "");
const pickLang = (v) => (v === "en" ? "en" : "fr");

/* Normalisation identique à sigSearch() d'app.js : insensible à la
   casse et aux accents (on retire les diacritiques combinants). */
const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

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

/* Carte de résultat : strictement ce dont nameCardHTML() a besoin.
   popularityTier et meaningTags restent internes — ils ne servent pas
   à l'affichage d'une carte. */
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

/* Fiche détaillée (section Signification) : la carte + ce que
   renderSigDetail() affiche en plus. */
function toDetail(n, DETAIL) {
  const d = DETAIL[n.name] || {};
  const card = toCard(n, DETAIL);
  card.meaningTags = n.meaningTags || [];
  if (d.variants) card.variants = d.variants;
  if (d.pronunciation) card.pronunciation = d.pronunciation;
  return card;
}

/* ---------- Modes ---------- */

function modeGenerate(body, cat) {
  const { INDEX, DETAIL, ORIGINS } = cat;
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
  return { names: names.map((n) => toCard(n, DETAIL)), reset };
}

function modeHydrate(body, cat) {
  const { BY_NAME, DETAIL, INDEX } = cat;
  const raw = Array.isArray(body.names) ? body.names.slice(0, HYDRATE_MAX) : [];
  const wantDetail = body.detail === true || body.detail === 1 || body.detail === "1";

  const out = [];
  for (const v of raw) {
    if (typeof v !== "string" || !v || v.length > MAX_NAME_LEN) continue;
    const n = BY_NAME.get(v);
    if (n) out.push(wantDetail ? toDetail(n, DETAIL) : toCard(n, DETAIL));
  }

  const result = { names: out };
  /* Prénoms similaires : la fiche Signification a besoin de la fiche
     ET de ses voisins en un seul aller-retour. */
  if (wantDetail && typeof body.similarFor === "string" && body.similarFor.length <= MAX_NAME_LEN) {
    result.similar = getSimilar(INDEX, body.similarFor, SIMILAR_LIMIT).map((n) => ({
      name: n.name, slug: n.slug, hasPage: n.hasPage,
    }));
  }
  return result;
}

function modeSearch(query, cat) {
  const { INDEX, DETAIL } = cat;
  const rawQ = typeof query.q === "string" ? query.q : "";
  /* On retire les caractères de contrôle avant tout traitement. */
  const q = rawQ.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_Q_LEN);
  const lang = pickLang(query.lang);
  const nq = normalize(q);
  if (!nq) return { results: [] };

  /* Même ordre de pertinence qu'aujourd'hui côté client : les prénoms
     qui COMMENCENT par la requête d'abord, puis ceux qui la contiennent. */
  const starts = [], contains = [];
  const seen = new Set();
  for (const n of INDEX) {
    if (seen.has(n.name)) continue;
    if (n.norm.startsWith(nq)) { seen.add(n.name); starts.push(n); }
    else if (contains.length < SEARCH_LIMIT && n.norm.includes(nq)) { seen.add(n.name); contains.push(n); }
    if (starts.length >= SEARCH_LIMIT) break;
  }
  const picked = starts.concat(contains).slice(0, SEARCH_LIMIT);

  /* Payload volontairement minimal : une seule langue, pas de `why`,
     pas de `style`. */
  return {
    results: picked.map((n) => {
      const d = DETAIL[n.name] || {};
      const m = d.meaning || {};
      return {
        name: n.name,
        slug: n.slug,
        hasPage: n.hasPage,
        origin: n.origin,
        meaning: m[lang] || m.fr || "",
      };
    }),
  };
}

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  /* Le mode vient du rewrite (?mode=...) ; à défaut on le déduit de la
     forme de la requête, pour rester robuste si un rewrite ne
     propageait pas ses paramètres. */
  const query = req.query || {};
  let mode = typeof query.mode === "string" ? query.mode : "";

  let body = {};
  if (req.method === "POST") {
    try {
      if (typeof req.body === "string") body = req.body ? JSON.parse(req.body) : {};
      else if (req.body && typeof req.body === "object") body = req.body;
    } catch {
      return res.status(400).json({ error: "invalid_json" });
    }
    if (!mode && typeof body.mode === "string") mode = body.mode;
    if (!mode) mode = Array.isArray(body.names) ? "hydrate" : "generate";
  } else if (!mode) {
    mode = "search";
  }

  const allowed = { generate: "POST", hydrate: "POST", search: "GET" };
  if (!allowed[mode]) return res.status(400).json({ error: "unknown_mode" });
  if (req.method !== allowed[mode]) {
    res.setHeader("Allow", allowed[mode]);
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const cat = catalogue();
    let payload;
    if (mode === "generate") payload = modeGenerate(body, cat);
    else if (mode === "hydrate") payload = modeHydrate(body, cat);
    else payload = modeSearch(query, cat);

    /* La recherche est idempotente et publique : un court cache CDN
       absorbe les rafales de frappe. Génération et hydratation restent
       non mises en cache. */
    res.setHeader("Cache-Control", mode === "search"
      ? "public, max-age=60, s-maxage=300"
      : "no-store");
    return res.status(200).json(payload);
  } catch (err) {
    console.error("[api]", mode, err);
    return res.status(500).json({ error: "request_failed" });
  }
}
