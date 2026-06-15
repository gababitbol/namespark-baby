/* =============================================================================
   NameSpark Baby — COUCHE D'ACCÈS AUX DONNÉES (point d'accès UNIQUE)
   -----------------------------------------------------------------------------
   Architecture hybride localStorage + Supabase :

   • Fonctions SYNC  → localStorage (préférences, historique, cache local)
   • Fonctions ASYNC → Supabase    (decisions, votes, participants, users, leads)

   Supabase est la source de vérité cross-appareil.
   localStorage est le cache local : réponse UI instantanée + fallback offline.

   Pour migrer vers un autre backend : ne modifier QUE ce fichier.
   app.js ne touche jamais le stockage directement.
   ============================================================================= */

/* ── 1. SUPABASE CLIENT ──────────────────────────────────────────────────────
   La clé `anon` est publique par conception Supabase.
   Sécurité = Row Level Security côté base de données.
   ─────────────────────────────────────────────────────────────────────────── */
const SUPABASE_URL      = "https://agpyqijxzcwesphoxlww.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncHlxaWp4emN3ZXNwaG94bHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzODc1NjEsImV4cCI6MjA5NTk2MzU2MX0.ON0iYa_2iCXvTN_vOBBW1rBrBZS4CWvy1b9UNMaOcNI";

const _sb = (() => {
  try {
    const { createClient } = window.supabase || {};
    if (!createClient) {
      console.warn("[NameSpark] Supabase SDK absent — mode localStorage seul.");
      return null;
    }
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn("[NameSpark] Supabase init échoué :", e);
    return null;
  }
})();

/* ── 2. ESPACE DE NOMS ───────────────────────────────────────────────────── */
const NS = "namespark.";
const KEYS = {
  user:            NS + "user",
  lang:            NS + "lang",
  surname:         NS + "surname",
  selection:       NS + "selection",
  decisions:       NS + "decisions",
  currentDecision: NS + "current_decision",
  myParticipants:  NS + "my_participants",
  savedLists:      NS + "saved_lists",
  history:         NS + "history",
  comparisons:     NS + "comparisons",
  notifications:   NS + "notifications",
  leads:           NS + "leads",
  adminSession:    NS + "admin_session",
};

/* ── 3. CONFIG ADMIN ─────────────────────────────────────────────────────── */
const ADMIN_PASSWORD = "namespark-admin-2026";

/* ── 4. PERSISTANCE BAS NIVEAU — localStorage (cache + fallback offline) ─── */
function _read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (_) { return fallback; }
}
function _write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
}
function _remove(key) {
  try { localStorage.removeItem(key); } catch (_) {}
}

/* ── 5. HELPERS ──────────────────────────────────────────────────────────── */
function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/* Migration unique depuis les anciennes clés (v1/v2) */
function _migrateLegacy() {
  if (localStorage.getItem(KEYS.selection) == null) {
    const old = _read("namespark_v1_favorites", null);
    if (Array.isArray(old)) _write(KEYS.selection, old);
  }
  if (localStorage.getItem(KEYS.user) == null) {
    const old = _read("namespark_v1_user", null);
    if (old && old.email) _write(KEYS.user, old);
  }
  if (localStorage.getItem(KEYS.surname) == null) {
    const s = localStorage.getItem("namespark_v1_surname");
    if (s) _write(KEYS.surname, s);
  }
  if (localStorage.getItem(KEYS.lang) == null) {
    const l = localStorage.getItem("namespark_v1_lang");
    if (l === "fr" || l === "en") _write(KEYS.lang, l);
  }
}
try { _migrateLegacy(); } catch (_) {}

/* ── 6. PRÉFÉRENCES — sync ───────────────────────────────────────────────── */
function getLang()        { return _read(KEYS.lang, "fr"); }
function saveLang(lang)   { _write(KEYS.lang, lang); }
function getSurname()     { return _read(KEYS.surname, ""); }
function saveSurname(s)   { _write(KEYS.surname, s || ""); }

/* ── 7. UTILISATEUR ──────────────────────────────────────────────────────── */

/* Lecture synchrone du cache local */
function getUser()   { return _read(KEYS.user, null); }
function clearUser() { _remove(KEYS.user); }

/* Écriture locale immédiate + sync Supabase en arrière-plan.
   Utilise async IIFE car .catch() n'existe PAS directement sur les
   query builders Supabase JS v2 récents (depuis postgrest-js 1.9+). */
function setUser(user) {
  _write(KEYS.user, user);
  if (_sb && user?.email) {
    const payload = {
      email:      user.email,
      first_name: user.firstName || null,
      surname:    user.surname   || null,
      last_seen:  new Date().toISOString(),
    };
    if (user.id) payload.id = user.id;

    (async () => {
      try {
        const { data, error } = await _sb
          .from("users")
          .upsert(payload, { onConflict: "email" })
          .select("id");
        if (!error && data?.[0]?.id && !user.id) {
          _write(KEYS.user, { ...user, id: data[0].id });
        }
      } catch (e) { console.warn("[NameSpark] setUser:", e); }
      /* Dual-write vers subscribers pour avoir first_name + last_name dans le panel admin */
      try {
        await _sb.from("subscribers").upsert(
          { email: user.email, first_name: user.firstName || null, last_name: user.surname || null, consent_terms: true },
          { onConflict: "email" }
        );
      } catch (e) { console.warn("[NameSpark] setUser→subscribers:", e); }
    })();
  }
}

/* Recherche cross-appareil : cache local d'abord, puis Supabase avec timeout 4s.
   Important : queryPromise.catch() évite un UnhandledPromiseRejection si le réseau
   répond APRÈS la fin du race (ce qui peut corrompre l'état dans certains navigateurs). */
async function findUserByEmail(email) {
  const local = getUser();
  if (local && local.email === email) return local;

  if (_sb) {
    try {
      /* Pas de .catch() sur le query builder — Supabase JS v2 récent ne l'a plus.
         On enveloppe dans Promise.resolve() pour avoir un vrai Promise. */
      const queryPromise = Promise.resolve(_sb.from("users").select("*").eq("email", email).maybeSingle());
      const timeout = new Promise((resolve) => setTimeout(() => resolve({ data: null, error: "timeout" }), 4000));
      const { data, error } = await Promise.race([queryPromise, timeout]);
      if (!error && data) {
        const user = {
          id:        data.id,
          email:     data.email,
          firstName: data.first_name,
          surname:   data.surname,
          createdAt: data.created_at,
        };
        _write(KEYS.user, user);
        return user;
      }
    } catch (_) {
      /* Réseau indisponible ou timeout — fallback local */
    }
  }
  return null;
}

/* ── 8. SÉLECTION — sync ─────────────────────────────────────────────────── */
function getSelection()       { const s = _read(KEYS.selection, []); return Array.isArray(s) ? s : []; }
function saveSelection(names) { _write(KEYS.selection, Array.isArray(names) ? [...new Set(names)] : []); }
function addToSelection(name) {
  const s = getSelection();
  if (!s.includes(name)) { s.push(name); saveSelection(s); }
}
function removeFromSelection(name) {
  saveSelection(getSelection().filter((n) => n !== name));
}

/* ── 9. LISTES / HISTORIQUE / COMPARAISONS — sync ────────────────────────── */
function getSavedLists()       { return _read(KEYS.savedLists, []); }
function addSavedList(entry)   { const a = getSavedLists(); a.push(entry); _write(KEYS.savedLists, a); }

function getHistory()          { return _read(KEYS.history, []); }
function addHistory(entry)     { const h = getHistory(); h.unshift(entry); h.splice(20); _write(KEYS.history, h); }

function getComparisons()      { return _read(KEYS.comparisons, []); }
function addComparison(entry)  { const c = getComparisons(); c.unshift(entry); c.splice(10); _write(KEYS.comparisons, c); }

/* ── 10. DÉCISIONS ────────────────────────────────────────────────────────── */

/* Cache local */
function _allDecisions()       { return _read(KEYS.decisions, {}); }
function _saveDecisions(all)   { _write(KEYS.decisions, all); }

/* Reconstruit un objet Decision (format front) depuis les lignes Supabase */
function _reconstructDecision(dec, participants, votes) {
  const p = {};
  for (const row of (participants || [])) {
    p[row.id] = { role: row.role, name: row.name, email: row.email, joinedAt: row.joined_at };
  }
  const v = {};
  for (const row of (votes || [])) {
    if (!v[row.participant_id]) v[row.participant_id] = {};
    v[row.participant_id][row.name] = row.reaction;
  }
  return {
    id:           dec.id,
    createdAt:    dec.created_at,
    mode:         dec.mode,
    surname:      dec.surname,
    items:        dec.items || [],
    participants: p,
    votes:        v,
    status:       dec.status || 'open',
  };
}

/* Crée une décision — cache local immédiat + Supabase */
async function createDecision({ creatorName = null, creatorEmail = null, surname = null, mode = "couple", items = [] } = {}) {
  const id  = uid("dec");
  const pid = uid("p");
  const now = new Date().toISOString();

  const decision = {
    id,
    createdAt:    now,
    mode:         mode === "family" ? "family" : "couple",
    surname:      surname || null,
    items:        Array.isArray(items) ? [...items] : [],
    participants: { [pid]: { role: "creator", name: creatorName, email: creatorEmail, joinedAt: now } },
    votes:        {},
  };

  /* Cache local immédiat — UI réactive sans attendre Supabase */
  const all = _allDecisions();
  all[id] = decision;
  _saveDecisions(all);
  setCurrentDecisionId(id);
  _setMyParticipant(id, pid);

  /* Persistance Supabase — async IIFE fire-and-forget.
     Pas de .catch() sur les query builders (Supabase JS v2 récent ne l'a plus).
     On utilise await + try/catch à l'intérieur d'une IIFE async. */
  if (_sb) {
    (async () => {
      try {
        const creatorId = getUser()?.id || null;
        const { error: e1 } = await _sb.from("decisions").insert({
          id, creator_id: creatorId, mode: decision.mode,
          surname: decision.surname, items: decision.items, created_at: now,
        });
        if (e1) { console.warn("[NameSpark] createDecision:", e1); return; }
        const { error: e2 } = await _sb.from("participants").insert({
          id: pid, decision_id: id, role: "creator",
          name: creatorName || null, email: creatorEmail || null, joined_at: now,
        });
        if (e2) console.warn("[NameSpark] createParticipant:", e2);
      } catch (e) {
        console.warn("[NameSpark] createDecision (async):", e);
      }
    })();
  }

  return { decision, participantId: pid };
}

/* Lit une décision — depuis Supabase (cross-appareil) puis met à jour le cache.
   Toujours enveloppé en try/catch. Si Supabase échoue ou retourne null,
   on retombe sur le cache local pour ne jamais bloquer l'UI. */
async function getDecision(id) {
  if (!id) return null;

  if (_sb) {
    try {
      const [decRes, partRes, voteRes] = await Promise.all([
        Promise.resolve(_sb.from("decisions").select("*").eq("id", id).maybeSingle()),
        Promise.resolve(_sb.from("participants").select("*").eq("decision_id", id)),
        Promise.resolve(_sb.from("votes").select("*").eq("decision_id", id)),
      ]);

      if (decRes.error) console.warn("[NameSpark] getDecision (decisions):", decRes.error);
      if (partRes.error) console.warn("[NameSpark] getDecision (participants):", partRes.error);
      if (voteRes.error) console.warn("[NameSpark] getDecision (votes):", voteRes.error);

      if (!decRes.error && decRes.data) {
        const decision = _reconstructDecision(
          decRes.data, partRes.data || [], voteRes.data || []
        );
        console.log("[NameSpark] getDecision OK — votes:", Object.keys(decision.votes).length, "participants");
        const all = _allDecisions();
        all[id] = decision;
        _saveDecisions(all);
        return decision;
      }
      /* Décision trouvée dans Supabase mais data null, ou erreur → fallback cache */
      console.warn("[NameSpark] getDecision: pas de data Supabase, fallback cache");
    } catch (e) {
      console.warn("[NameSpark] getDecision exception:", e?.message || e);
      /* Pas de return ici → fallback cache ci-dessous */
    }
  }

  /* Fallback cache local (mode offline ou Supabase indisponible) */
  return _allDecisions()[id] || null;
}

/* Lecture synchrone du cache local uniquement (pour computeMatches / computeRanking).
   Contrat : getDecision(id) doit avoir été appelé au préalable dans le même flux. */
function _getDecisionFromCache(id) {
  if (!id) return null;
  return _allDecisions()[id] || null;
}

function getCurrentDecisionId()   { return _read(KEYS.currentDecision, null); }
function setCurrentDecisionId(id) { _write(KEYS.currentDecision, id); }

function _myParticipants()                  { return _read(KEYS.myParticipants, {}); }
function _setMyParticipant(decisionId, pid) {
  const m = _myParticipants(); m[decisionId] = pid; _write(KEYS.myParticipants, m);
}
function getMyParticipantId(decisionId)     { return _myParticipants()[decisionId] || null; }

/* Ajoute un participant à une décision */
async function addParticipant(decisionId, { role = "partner", name = null, email = null } = {}) {
  const pid = uid("p");
  const now = new Date().toISOString();

  /* Cache local */
  const all = _allDecisions();
  if (all[decisionId]) {
    all[decisionId].participants[pid] = { role, name, email, joinedAt: now };
    _saveDecisions(all);
  }

  /* Supabase */
  if (_sb) {
    const { error } = await _sb.from("participants").insert({
      id: pid, decision_id: decisionId, role,
      name: name || null, email: email || null, joined_at: now,
    });
    if (error) console.warn("[NameSpark] addParticipant:", error);
  }

  return pid;
}

/* Met à jour l'email d'un participant existant (ex: créateur sans email au départ) */
async function updateParticipantEmail(participantId, email) {
  /* Cache local */
  const all = _allDecisions();
  for (const did of Object.keys(all)) {
    if (all[did].participants?.[participantId]) {
      all[did].participants[participantId].email = email;
      _saveDecisions(all);
      break;
    }
  }
  /* Supabase */
  if (_sb) {
    const { error } = await _sb.from("participants")
      .update({ email })
      .eq("id", participantId);
    if (error) console.warn("[NameSpark] updateParticipantEmail:", error);
  }
}

/* Rejoint une décision — get-or-create du participant pour CET appareil.
   Si un email est fourni et qu'un participant avec cet email existe déjà
   dans la décision (ex : même utilisateur, nouvel appareil ou nouvelle
   session), on récupère son participantId existant plutôt que d'en créer
   un nouveau — ses votes précédents sont ainsi ré-associés. */
async function joinDecision(decisionId, opts = {}) {
  /* 1. Vérification localStorage (même appareil/session) */
  const existing = getMyParticipantId(decisionId);
  if (existing) return existing;

  /* 2. Lookup par email dans le cache de la décision
        (décision déjà fetchée par l'appelant via getDecision) */
  if (opts.email) {
    const cached = _getDecisionFromCache(decisionId);
    if (cached?.participants) {
      const matchEntry = Object.entries(cached.participants).find(
        ([, p]) => p.email && p.email.toLowerCase() === opts.email.toLowerCase()
      );
      if (matchEntry) {
        const pid = matchEntry[0];
        _setMyParticipant(decisionId, pid);
        return pid;
      }
    }
  }

  /* 3. Pas trouvé → créer un nouveau participant */
  const pid = await addParticipant(decisionId, opts);
  if (pid) _setMyParticipant(decisionId, pid);
  return pid;
}

/* ── 11. VOTES ────────────────────────────────────────────────────────────── */

/* Enregistre un vote — cache local immédiat + Supabase upsert */
async function saveVote(decisionId, participantId, name, reaction) {
  /* Cache local immédiat */
  const all = _allDecisions();
  if (all[decisionId]) {
    if (!all[decisionId].votes[participantId]) all[decisionId].votes[participantId] = {};
    all[decisionId].votes[participantId][name] = reaction;
    _saveDecisions(all);
  }

  /* Supabase upsert (insert ou update si déjà voté).
     Résilience : la 1re tentative peut échouer si la ligne `participants`
     n'est pas encore visible (latence de réplication → violation de clé
     étrangère). On réessaie avec un court backoff pour ne perdre aucun vote. */
  if (_sb) {
    const payload = {
      decision_id:    decisionId,
      participant_id: participantId,
      name,
      reaction,
      voted_at: new Date().toISOString(),
    };
    const MAX_TRIES = 4;
    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
      const { error } = await _sb.from("votes")
        .upsert(payload, { onConflict: "decision_id,participant_id,name" });
      if (!error) break;
      const isFkRace = error.code === "23503" || /foreign key/i.test(error.message || "");
      if (isFkRace && attempt < MAX_TRIES) {
        await new Promise((r) => setTimeout(r, 300 * attempt)); /* 300, 600, 900ms */
        continue;
      }
      console.warn("[NameSpark] saveVote (tentative " + attempt + "):", error);
      break;
    }
  }
}

/* Clôture une décision — Supabase + cache local */
async function closeDecision(decisionId) {
  if (!_sb) throw new Error("[NameSpark] Supabase requis pour clôturer");
  const { error } = await _sb.from("decisions")
    .update({ status: "closed" })
    .eq("id", decisionId);
  if (error) throw error;
  const all = _allDecisions();
  if (all[decisionId]) {
    all[decisionId].status = "closed";
    _saveDecisions(all);
  }
}

/* Retourne les votes depuis le cache (mis à jour par getDecision) */
function getVotes(decisionId) {
  const d = _getDecisionFromCache(decisionId);
  return d ? d.votes : {};
}

/* ── 12. MATCHS / CLASSEMENT — sync (lisent le cache local) ─────────────── */

/* Un prénom est un match si TOUS les votes exprimés sont "yes" et ≥ 1 vote.
   Nécessite que getDecision() ait été appelé avant pour peupler le cache. */
function computeMatches(decisionId) {
  const d = _getDecisionFromCache(decisionId);
  if (!d) return [];
  return d.items.filter((name) => {
    const reactions = Object.values(d.votes)
      .map((byName) => byName[name])
      .filter(Boolean);
    return reactions.length > 0 && reactions.every((r) => r === "yes");
  });
}

/* Score famille : ❤️ ×2 + 🤔 ×1 + ❌ ×(−1), trié décroissant */
function computeRanking(decisionId) {
  const d = _getDecisionFromCache(decisionId);
  if (!d) return [];

  const nameOf = (pid) => {
    const p = d.participants[pid];
    return (p && p.name) ? p.name : "?";
  };

  const rows = d.items.map((name) => {
    const voters = { yes: [], maybe: [], no: [] };
    Object.entries(d.votes).forEach(([pid, byName]) => {
      const r = byName[name];
      if (r === "yes" || r === "maybe" || r === "no") voters[r].push(nameOf(pid));
    });
    const yes = voters.yes.length, maybe = voters.maybe.length, no = voters.no.length;
    return { name, yes, maybe, no, score: yes * 2 + maybe - no, voters };
  });

  rows.sort((a, b) =>
    b.score - a.score || b.yes - a.yes || a.no - b.no || a.name.localeCompare(b.name)
  );
  return rows;
}

/* ── 13. NOTIFICATIONS — sync ─────────────────────────────────────────────── */
function addNotification(type, text) {
  const notif = { id: Date.now(), type, text, timestamp: new Date().toISOString(), read: false };
  const all = _read(KEYS.notifications, []);
  all.unshift(notif); all.splice(20);
  _write(KEYS.notifications, all);
  return notif;
}
function getNotifications()        { return _read(KEYS.notifications, []); }
function markNotificationRead(id)  {
  const all = _read(KEYS.notifications, []);
  const n = all.find((x) => x.id === id);
  if (n) { n.read = true; _write(KEYS.notifications, all); }
}
function clearNotifications()      { _remove(KEYS.notifications); }

/* ── 14. LEADS + ADMIN ────────────────────────────────────────────────────── */

/* Upsert d'un lead — sync local + Supabase fire-and-forget.
   Le nom de famille est lu depuis le cache local (getSurname) si non passé
   explicitement, car il est déjà enregistré lors de la génération de prénoms.
   Migration Supabase requise : ALTER TABLE leads ADD COLUMN IF NOT EXISTS surname TEXT; */
function registerLead(email, firstName, favoritesCount = 0, bumpSession = false) {
  if (!email || email.trim().toLowerCase() === "admin") return;
  const all = _read(KEYS.leads, []);
  const now = new Date().toISOString();
  /* Récupère le nom de famille depuis le cache local s'il existe */
  const cachedSurname = getSurname() || null;
  let u = all.find((x) => x.email === email);
  if (!u) {
    u = { email, firstName: firstName || null, surname: cachedSurname, createdAt: now, lastSeen: now, favorites: favoritesCount, sessions: 0 };
    all.push(u);
  } else {
    if (firstName) u.firstName = firstName;
    if (cachedSurname && !u.surname) u.surname = cachedSurname;
    u.lastSeen = now;
    u.favorites = Math.max(u.favorites || 0, favoritesCount || 0);
  }
  if (bumpSession) u.sessions = (u.sessions || 0) + 1;
  _write(KEYS.leads, all);

  /* Supabase fire-and-forget — async IIFE car .catch() absent sur Supabase JS v2 récent */
  if (_sb) {
    (async () => {
      try {
        const payload = {
          email:      u.email,
          first_name: u.firstName,
          favorites:  u.favorites,
          sessions:   u.sessions,
          last_seen:  now,
        };
        if (u.surname) payload.surname = u.surname;
        await _sb.from("leads").upsert(payload, { onConflict: "email" });
      } catch (e) { console.warn("[NameSpark] registerLead:", e); }
      /* Dual-write vers subscribers (source de vérité admin, sans doublons) */
      try {
        await _sb.from("subscribers").upsert(
          { email: u.email, first_name: u.firstName || null, last_name: u.surname || null, consent_terms: true },
          { onConflict: "email" }
        );
      } catch (e) { console.warn("[NameSpark] registerLead→subscribers:", e); }
    })();
  }
}

function getLeads()       { return _read(KEYS.leads, []); }
function getAllDecisions() { return Object.values(_allDecisions()); }

/* Versions Supabase pour l'admin (données complètes, cross-appareils) */
async function fetchAllLeadsAdmin() {
  if (!_sb) return getLeads();
  const { data, error } = await _sb.from("leads").select("*").order("last_seen", { ascending: false });
  if (error || !data) { console.warn("[Admin] fetchAllLeadsAdmin:", error); return getLeads(); }
  return data.map((r) => ({
    email: r.email, firstName: r.first_name, surname: r.surname || null,
    createdAt: r.created_at, lastSeen: r.last_seen,
    favorites: r.favorites || 0, sessions: r.sessions || 0,
  }));
}

async function fetchAllDecisionsAdmin() {
  if (!_sb) return getAllDecisions();
  const { data: decisions, error: dErr } = await _sb.from("decisions").select("*").order("created_at", { ascending: false });
  if (dErr || !decisions) { console.warn("[Admin] fetchAllDecisionsAdmin:", dErr); return getAllDecisions(); }

  /* PostgREST coupe à 1 000 lignes sans range explicite — spécifier le plafond */
  const decisionIds = decisions.map((d) => d.id);
  const { data: participants } = await _sb.from("participants").select("*")
    .in("decision_id", decisionIds).range(0, 4999);
  const { data: votes } = await _sb.from("votes").select("*")
    .in("decision_id", decisionIds).range(0, 19999);

  return decisions.map((d) => {
    const parts = (participants || []).filter((p) => p.decision_id === d.id);
    const partMap = {};
    parts.forEach((p) => { partMap[p.id] = { role: p.role, name: p.name, email: p.email, joinedAt: p.joined_at }; });

    const votesMap = {};
    (votes || []).filter((v) => v.decision_id === d.id).forEach((v) => {
      if (!votesMap[v.participant_id]) votesMap[v.participant_id] = {};
      votesMap[v.participant_id][v.name] = v.reaction;
    });

    return {
      id: d.id, mode: d.mode, surname: d.surname,
      items: d.items || [], createdAt: d.created_at,
      participants: partMap, votes: votesMap,
    };
  });
}

/* Auth admin (mot de passe fixe, V1) */
function adminLogin(password)  {
  if (password === ADMIN_PASSWORD) { _write(KEYS.adminSession, "1"); return true; }
  return false;
}
function hasAdminSession()     { return _read(KEYS.adminSession, null) === "1"; }
function clearAdminSession()   { _remove(KEYS.adminSession); }

/* ── 15. EXPORT (Node / tests) ───────────────────────────────────────────── */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getLang, saveLang, getSurname, saveSurname,
    getUser, setUser, clearUser, findUserByEmail,
    getSelection, saveSelection, addToSelection, removeFromSelection,
    getSavedLists, addSavedList, getHistory, addHistory, getComparisons, addComparison,
    createDecision, getDecision, getCurrentDecisionId, setCurrentDecisionId,
    addParticipant, updateParticipantEmail, joinDecision, getMyParticipantId, saveVote, closeDecision, getVotes,
    fetchAllLeadsAdmin, fetchAllDecisionsAdmin,
    computeMatches, computeRanking,
    addNotification, getNotifications, markNotificationRead, clearNotifications,
    registerLead, getLeads, getAllDecisions, adminLogin, hasAdminSession, clearAdminSession,
    uid,
  };
}
