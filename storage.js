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

/* Écriture locale immédiate + sync Supabase en arrière-plan */
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

    _sb.from("users")
      .upsert(payload, { onConflict: "email" })
      .select("id")
      .then(({ data, error }) => {
        if (!error && data?.[0]?.id && !user.id) {
          /* Stocke l'UUID Supabase pour les prochains appels */
          _write(KEYS.user, { ...user, id: data[0].id });
        }
      })
      .catch(console.warn);
  }
}

/* Recherche cross-appareil : cache local d'abord, puis Supabase avec timeout 4s */
async function findUserByEmail(email) {
  const local = getUser();
  if (local && local.email === email) return local;

  if (_sb) {
    try {
      const query = _sb.from("users").select("*").eq("email", email).maybeSingle();
      const timeout = new Promise((resolve) => setTimeout(() => resolve({ data: null, error: "timeout" }), 4000));
      const { data, error } = await Promise.race([query, timeout]);
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

  /* Persistance Supabase — fire-and-forget pour ne pas bloquer l'UI.
     Le cache local (ci-dessus) est la source de vérité immédiate.
     Supabase se synchronise en arrière-plan sans bloquer l'overlay.
     Enveloppé en try/catch pour éviter toute propagation d'erreur. */
  if (_sb) {
    try {
      const creatorId = getUser()?.id || null;
      _sb.from("decisions").insert({
        id, creator_id: creatorId, mode: decision.mode,
        surname: decision.surname, items: decision.items, created_at: now,
      }).then(({ error }) => {
        if (error) { console.warn("[NameSpark] createDecision:", error); return; }
        _sb.from("participants").insert({
          id: pid, decision_id: id, role: "creator",
          name: creatorName || null, email: creatorEmail || null, joined_at: now,
        }).then(({ error: e2 }) => {
          if (e2) console.warn("[NameSpark] createParticipant:", e2);
        }).catch(console.warn);
      }).catch(console.warn);
    } catch (e) {
      console.warn("[NameSpark] createDecision (sync error):", e);
    }
  }

  return { decision, participantId: pid };
}

/* Lit une décision — depuis Supabase (cross-appareil) puis met à jour le cache */
async function getDecision(id) {
  if (!id) return null;

  if (_sb) {
    const [decRes, partRes, voteRes] = await Promise.all([
      _sb.from("decisions").select("*").eq("id", id).maybeSingle(),
      _sb.from("participants").select("*").eq("decision_id", id),
      _sb.from("votes").select("*").eq("decision_id", id),
    ]);

    if (!decRes.error && decRes.data) {
      const decision = _reconstructDecision(
        decRes.data, partRes.data || [], voteRes.data || []
      );
      const all = _allDecisions();
      all[id] = decision;
      _saveDecisions(all);
      return decision;
    }
    /* Décision introuvable en Supabase */
    return null;
  }

  /* Fallback cache local (mode offline) */
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

/* Rejoint une décision — get-or-create du participant pour CET appareil */
async function joinDecision(decisionId, opts = {}) {
  const existing = getMyParticipantId(decisionId);
  if (existing) return existing;
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

  /* Supabase upsert (insert ou update si déjà voté) */
  if (_sb) {
    const { error } = await _sb.from("votes").upsert({
      decision_id:    decisionId,
      participant_id: participantId,
      name,
      reaction,
      voted_at: new Date().toISOString(),
    }, { onConflict: "decision_id,participant_id,name" });
    if (error) console.warn("[NameSpark] saveVote:", error);
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

/* Upsert d'un lead — sync local + Supabase fire-and-forget */
function registerLead(email, firstName, favoritesCount = 0, bumpSession = false) {
  if (!email || email.trim().toLowerCase() === "admin") return;
  const all = _read(KEYS.leads, []);
  const now = new Date().toISOString();
  let u = all.find((x) => x.email === email);
  if (!u) {
    u = { email, firstName: firstName || null, createdAt: now, lastSeen: now, favorites: favoritesCount, sessions: 0 };
    all.push(u);
  } else {
    if (firstName) u.firstName = firstName;
    u.lastSeen = now;
    u.favorites = Math.max(u.favorites || 0, favoritesCount || 0);
  }
  if (bumpSession) u.sessions = (u.sessions || 0) + 1;
  _write(KEYS.leads, all);

  /* Supabase fire-and-forget */
  if (_sb) {
    _sb.from("leads").upsert({
      email:      u.email,
      first_name: u.firstName,
      favorites:  u.favorites,
      sessions:   u.sessions,
      last_seen:  now,
    }, { onConflict: "email" }).catch(console.warn);
  }
}

function getLeads()       { return _read(KEYS.leads, []); }
function getAllDecisions() { return Object.values(_allDecisions()); }

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
    addParticipant, joinDecision, getMyParticipantId, saveVote, getVotes,
    computeMatches, computeRanking,
    addNotification, getNotifications, markNotificationRead, clearNotifications,
    registerLead, getLeads, getAllDecisions, adminLogin, hasAdminSession, clearAdminSession,
    uid,
  };
}
