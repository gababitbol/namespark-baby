/* =============================================================
   NameSpark Baby — Logique de ranking PARTAGÉE (source unique)
   -------------------------------------------------------------
   Ce module contient la logique de sélection des prénoms, extraite
   à l'identique de generateDemo()/shuffleByScore()/pickProgressive()
   d'app.js. Il est utilisé par /api/generate.

   RÈGLE ABSOLUE : ce fichier doit produire EXACTEMENT les mêmes
   résultats que le code client historique, à graine aléatoire égale.
   C'est vérifié mécaniquement par tools/parity-check.js, qui extrait
   les fonctions réellement présentes dans app.js et compare les
   sorties sur des centaines de combinaisons de filtres.

   Toute modification ici doit être accompagnée d'un passage vert du
   harnais de parité (ou d'une mise à jour consciente des deux côtés).
   ============================================================= */

/* popularityTier : "classic" | "established" | "rare" | "very_rare"
   | "unknown_popularity".
   "unknown_popularity" signifie uniquement "pas encore de donnée de
   fréquence fiable" — jamais "rare" ni "bizarre". */
export const TIER_ORDER = ["classic", "established", "rare", "very_rare", "unknown_popularity"];

export const TIER_DISTRIBUTION = {
  0: { classic: 58, established: 34, rare: 5,  very_rare: 0,  unknown_popularity: 3  },
  1: { classic: 37, established: 37, rare: 16, very_rare: 2,  unknown_popularity: 8  },
  2: { classic: 17, established: 30, rare: 30, very_rare: 8,  unknown_popularity: 15 },
  3: { classic: 8,  established: 21, rare: 33, very_rare: 20, unknown_popularity: 18 },
};

/* Mélange à l'intérieur de chaque palier de score (l'ordre relatif
   entre scores différents est préservé). */
export function shuffleByScore(arr, rng = Math.random) {
  const groups = {};
  arr.forEach((item) => { (groups[item.score] = groups[item.score] || []).push(item); });
  const result = [];
  Object.keys(groups).map(Number).sort((a, b) => b - a).forEach((score) => {
    const g = groups[score];
    for (let i = g.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [g[i], g[j]] = [g[j], g[i]];
    }
    result.push(...g);
  });
  return result;
}

/* Sélection pondérée par palier de popularité selon la profondeur. */
export function pickProgressive(pool, limit, depth, rng = Math.random) {
  const d = Math.min(Math.max(depth, 0), 3);
  const dist = TIER_DISTRIBUTION[d];

  const buckets = {};
  TIER_ORDER.forEach((t) => (buckets[t] = []));
  pool.forEach((s) => {
    const tier = TIER_ORDER.includes(s.n.popularityTier) ? s.n.popularityTier : "unknown_popularity";
    buckets[tier].push(s);
  });

  const picked = [];
  /* 1ère passe : jusqu'au quota cible de chaque tier (clampé pour ne
     jamais dépasser `limit` malgré les arrondis indépendants) */
  TIER_ORDER.forEach((t) => {
    const target = Math.min(Math.round((dist[t] / 100) * limit), limit - picked.length);
    picked.push(...buckets[t].splice(0, target));
  });
  /* 2e passe : un tier trop petit pour son quota -> on comble avec les
     tiers voisins (dans l'ordre classic -> ... -> unknown_popularity)
     plutôt que de renvoyer moins de résultats que demandé. */
  let deficit = limit - picked.length;
  if (deficit > 0) {
    for (const t of TIER_ORDER) {
      if (deficit <= 0) break;
      const take = Math.min(deficit, buckets[t].length);
      if (take > 0) picked.push(...buckets[t].splice(0, take));
      deficit -= take;
    }
  }
  /* mélange léger pour ne pas afficher les tiers groupés visuellement */
  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return picked.map((s) => s.n);
}

/* Génération complète. `names` est le catalogue (tableau d'objets).
   Signature volontairement alignée sur generateDemo(f, limit, exclude, depth). */
export function generate(names, f, limit = 20, exclude = null, depth = 0, rng = Math.random) {
  /* Deduplicate by name (le catalogue peut contenir des doublons) */
  const _seen = new Set();
  const scored = names.filter(n => {
    if (_seen.has(n.name)) return false;
    _seen.add(n.name);
    return true;
  }).map((n) => {
    let score = 0;
    let hardFail = false;

    if (f.gender) {
      if (f.gender === "mixte") {
        if (n.gender === "mixte") score += 4; else hardFail = true;
      } else if (n.gender === f.gender) {
        score += 4;
      } else if (n.gender === "mixte") {
        score += 1;
      } else {
        hardFail = true;
      }
    }

    if (f.origin) { if (n.origin === f.origin) score += 4; else hardFail = true; }
    if (f.letter) { if (n.name[0].toLowerCase() === f.letter) score += 3; else hardFail = true; }
    if (f.style && n.style.includes(f.style)) score += 2;
    if (f.meaning && n.meaningTags.includes(f.meaning)) score += 2;
    if (f.length && n.length === f.length) score += 1;

    return { n, score, hardFail };
  });

  let pool = scored
    .filter((s) => !s.hardFail && !(exclude && exclude.has(s.n.name)))
    .sort((a, b) => b.score - a.score);
  pool = shuffleByScore(pool, rng);

  /* Le filtre explicite "style = rare" bascule immédiatement vers une
     distribution orientée rare/very_rare, sans forcer l'utilisateur à
     traverser classic/established d'abord. */
  const effectiveDepth = f.style === "rare" ? Math.max(depth, 2) : depth;
  return pickProgressive(pool, limit, effectiveDepth, rng);
}

/* Prénoms similaires — extrait à l'identique de getSimilarDemo(). */
export function getSimilar(names, name, limit = 6) {
  const ref = names.find((n) => n.name === name);
  if (!ref) return [];
  const _seen2 = new Set([ref.name]);
  return names
    .filter((n) => { if (_seen2.has(n.name)) return false; _seen2.add(n.name); return true; })
    .filter((n) => n.name !== ref.name)
    .map((n) => {
      let score = 0;
      if (n.origin === ref.origin) score += 3;
      score += n.style.filter((s) => ref.style.includes(s)).length * 2;
      if (n.gender === ref.gender) score += 1;
      score += n.meaningTags.filter((m) => ref.meaningTags.includes(m)).length;
      if (n.length === ref.length) score += 1;
      return { n, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.n);
}
