/* =============================================================================
   NameSpark Baby — COUCHE D'ACCÈS AUX DONNÉES (point d'accès UNIQUE)
   -----------------------------------------------------------------------------
   Toute l'application (app.js, admin.js, …) passe par les FONCTIONS PUBLIQUES
   définies ici. AUCUNE autre partie du code ne doit lire/écrire localStorage
   directement. C'est la garantie qu'on pourra brancher Supabase plus tard sans
   toucher à l'interface utilisateur.

   ── MODÈLE DE DONNÉES (1 source de vérité) ──────────────────────────────────
     selection : string[]                       // prénoms choisis (= favoris)
     user      : { email, firstName, createdAt, surname }
     Decision  : {
       id, createdAt, surname, familyMode,
       items:        string[],                  // prénoms soumis au vote
       participants: { [pid]: { role, name, email, joinedAt } },
       votes:        { [pid]: { [name]: "yes"|"no"|"maybe" } }
     }
     // Les "matchs" ne sont JAMAIS stockés : computeMatches() les dérive.

   ── POUR BRANCHER SUPABASE (plus tard) ──────────────────────────────────────
     Ne remplacer QUE :
       1) les primitives _read/_write/_remove (bloc PERSISTANCE)
       2) le corps des fonctions publiques (par des appels Supabase)
     Les SIGNATURES publiques et la FORME des données ne changent pas.
     Schéma SQL cible : voir docs/unification.md (§ Supabase).
   ============================================================================= */

/* =============================================================================
   ESPACE DE NOMS
   ============================================================================= */
const NS = "namespark.";
const KEYS = {
  user:            NS + "user",
  lang:            NS + "lang",
  surname:         NS + "surname",
  selection:       NS + "selection",
  decisions:       NS + "decisions",          // { [id]: Decision }
  currentDecision: NS + "current_decision",   // id de la décision courante
  myParticipants:  NS + "my_participants",    // { [decisionId]: participantId } (cet appareil)
  savedLists:      NS + "saved_lists",        // listes envoyées par email
  history:         NS + "history",            // historique de générations
  comparisons:     NS + "comparisons",        // historique du comparateur
  notifications:   NS + "notifications",      // notifications (simulées pour l'instant)
  leads:           NS + "leads",              // emails capturés (dashboard admin)
  adminSession:    NS + "admin_session",      // session admin ouverte
};

/* =============================================================
   CONFIG ADMIN
   -------------------------------------------------------------
   ⚠️  Mot de passe admin EN DUR (mode démo). À CHANGER ICI.
   En production : auth serveur + hash + JWT (jamais côté client).
   Accès : sur le site, formulaire email → taper "admin" comme email
   et CE mot de passe comme prénom.
   ============================================================= */
const ADMIN_PASSWORD = "namespark-admin-2026";

/* =============================================================================
   PERSISTANCE bas niveau — LE SEUL endroit qui touche localStorage.
   ⮕ À remplacer par des appels Supabase le jour venu.
   ============================================================================= */
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

/* =============================================================================
   HELPERS
   ============================================================================= */
function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/* Migration unique depuis les anciennes clés (v1/v2) → ne perd pas les données
   des premiers visiteurs. S'exécute une fois au chargement de storage.js. */
function _migrateLegacy() {
  if (localStorage.getItem(KEYS.selection) == null) {
    const oldFav = _read("namespark_v1_favorites", null);
    if (Array.isArray(oldFav)) _write(KEYS.selection, oldFav);
  }
  if (localStorage.getItem(KEYS.user) == null) {
    const oldUser = _read("namespark_v1_user", null);
    if (oldUser && oldUser.email) _write(KEYS.user, oldUser);
  }
  if (localStorage.getItem(KEYS.surname) == null) {
    const s = localStorage.getItem("namespark_v1_surname"); // ancien format : chaîne brute
    if (s) _write(KEYS.surname, s);
  }
  if (localStorage.getItem(KEYS.lang) == null) {
    const l = localStorage.getItem("namespark_v1_lang");    // ancien format : chaîne brute
    if (l === "fr" || l === "en") _write(KEYS.lang, l);
  }
}
try { _migrateLegacy(); } catch (_) {}

/* =============================================================================
   PRÉFÉRENCES (langue, nom de famille)
   ============================================================================= */
function getLang()        { return _read(KEYS.lang, "fr"); }
function saveLang(lang)   { _write(KEYS.lang, lang); }

function getSurname()     { return _read(KEYS.surname, ""); }
function saveSurname(s)   { _write(KEYS.surname, s || ""); }

/* =============================================================================
   UTILISATEUR
   ============================================================================= */
function getUser()        { return _read(KEYS.user, null); }
function setUser(user)    { _write(KEYS.user, user); }
function clearUser()      { _remove(KEYS.user); }

/* Recherche d'un compte existant par email (mono-utilisateur en local ;
   deviendra une vraie requête Supabase). */
function findUserByEmail(email) {
  const u = getUser();
  return u && u.email === email ? u : null;
}

/* =============================================================================
   SÉLECTION — concept UNIQUE (ex-favoris / ex-shortlist)
   ============================================================================= */
function getSelection()        { const s = _read(KEYS.selection, []); return Array.isArray(s) ? s : []; }
function saveSelection(names)  { _write(KEYS.selection, Array.isArray(names) ? [...new Set(names)] : []); }
function addToSelection(name) {
  const s = getSelection();
  if (!s.includes(name)) { s.push(name); saveSelection(s); }
}
function removeFromSelection(name) {
  saveSelection(getSelection().filter((n) => n !== name));
}

/* =============================================================================
   LISTES SAUVEGARDÉES (capture email — futur envoi par email côté serveur)
   ============================================================================= */
function getSavedLists()       { return _read(KEYS.savedLists, []); }
function addSavedList(entry) {
  const all = getSavedLists();
  all.push(entry);
  _write(KEYS.savedLists, all);
}

/* =============================================================================
   HISTORIQUE & COMPARAISONS (fonctions périphériques)
   ============================================================================= */
function getHistory()          { return _read(KEYS.history, []); }
function addHistory(entry) {
  const h = getHistory();
  h.unshift(entry);
  h.splice(20);
  _write(KEYS.history, h);
}

function getComparisons()      { return _read(KEYS.comparisons, []); }
function addComparison(entry) {
  const c = getComparisons();
  c.unshift(entry);
  c.splice(10);
  _write(KEYS.comparisons, c);
}

/* =============================================================================
   DÉCISIONS (session couple) — source de vérité du parcours "Décider ensemble"
   ============================================================================= */

/* --- Accès interne à la table des décisions --- */
function _allDecisions()       { return _read(KEYS.decisions, {}); }
function _saveDecisions(all)   { _write(KEYS.decisions, all); }

/* Crée une décision à partir de la sélection figée (items).
   Le créateur devient le 1er participant.
   mode : "couple" (décider à deux) | "family" (vote famille à N votants)
   → { decision, participantId } */
function createDecision({ creatorName = null, creatorEmail = null, surname = null, mode = "couple", items = [] } = {}) {
  const id  = uid("dec");
  const pid = uid("p");
  const now = new Date().toISOString();

  const decision = {
    id,
    createdAt: now,
    mode:      mode === "family" ? "family" : "couple",
    surname:   surname || null,
    items:     Array.isArray(items) ? [...items] : [],
    participants: {
      [pid]: { role: "creator", name: creatorName, email: creatorEmail, joinedAt: now },
    },
    votes: {},
  };

  const all = _allDecisions();
  all[id] = decision;
  _saveDecisions(all);
  setCurrentDecisionId(id);
  _setMyParticipant(id, pid);

  return { decision, participantId: pid };
}

function getDecision(id) {
  if (!id) return null;
  return _allDecisions()[id] || null;
}

function getCurrentDecisionId()      { return _read(KEYS.currentDecision, null); }
function setCurrentDecisionId(id)    { _write(KEYS.currentDecision, id); }

/* --- Participant de CET appareil pour une décision donnée --- */
function _myParticipants()           { return _read(KEYS.myParticipants, {}); }
function _setMyParticipant(decisionId, pid) {
  const m = _myParticipants();
  m[decisionId] = pid;
  _write(KEYS.myParticipants, m);
}
function getMyParticipantId(decisionId) {
  return _myParticipants()[decisionId] || null;
}

/* Ajoute un participant à une décision (toujours nouveau). → participantId | null */
function addParticipant(decisionId, { role = "partner", name = null, email = null } = {}) {
  const all = _allDecisions();
  const d = all[decisionId];
  if (!d) return null;

  const pid = uid("p");
  d.participants[pid] = { role, name, email, joinedAt: new Date().toISOString() };
  _saveDecisions(all);
  return pid;
}

/* Rejoint une décision (get-or-create du participant pour CET appareil).
   Utilisé par le partenaire qui ouvre ?invite=<id>. → participantId | null */
function joinDecision(decisionId, opts = {}) {
  const existing = getMyParticipantId(decisionId);
  if (existing) return existing;

  const pid = addParticipant(decisionId, opts);
  if (pid) _setMyParticipant(decisionId, pid);
  return pid;
}

/* =============================================================================
   VOTES
   ============================================================================= */
function saveVote(decisionId, participantId, name, reaction) {
  // reaction: "yes" | "no" | "maybe"
  const all = _allDecisions();
  const d = all[decisionId];
  if (!d) return;
  if (!d.votes[participantId]) d.votes[participantId] = {};
  d.votes[participantId][name] = reaction;
  _saveDecisions(all);
}

/* → { [participantId]: { [name]: reaction } } */
function getVotes(decisionId) {
  const d = getDecision(decisionId);
  return d ? d.votes : {};
}

/* =============================================================================
   MATCHS — DÉRIVÉS (jamais stockés). Moteur de matching UNIQUE.
   Règle : un prénom est un match s'il a reçu ≥1 vote et que TOUS les votes
   exprimés sur ce prénom sont "yes".
   ============================================================================= */
function computeMatches(decisionId) {
  const d = getDecision(decisionId);
  if (!d) return [];
  return d.items.filter((name) => {
    const reactions = Object.values(d.votes)
      .map((byName) => byName[name])
      .filter(Boolean);
    return reactions.length > 0 && reactions.every((r) => r === "yes");
  });
}

/* =============================================================
   CLASSEMENT FAMILLE — DÉRIVÉ (jamais stocké). Moteur de scoring UNIQUE.
   Score = ❤️ (yes) ×2 + 🤔 (maybe) ×1 + ❌ (no) ×(−1).
   Renvoie un tableau trié (meilleur d'abord) :
     [{ name, yes, maybe, no, score, voters:{ yes:[noms], maybe:[noms], no:[noms] } }]
   Égalités : plus de "yes", puis moins de "no", puis ordre alphabétique.
   ============================================================= */
function computeRanking(decisionId) {
  const d = getDecision(decisionId);
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
    b.score - a.score ||
    b.yes - a.yes ||
    a.no - b.no ||
    a.name.localeCompare(b.name)
  );
  return rows;
}

/* =============================================================================
   NOTIFICATIONS (simulées côté front pour l'instant)
   ============================================================================= */
function addNotification(type, text) {
  const notif = { id: Date.now(), type, text, timestamp: new Date().toISOString(), read: false };
  const all = _read(KEYS.notifications, []);
  all.unshift(notif);
  all.splice(20);
  _write(KEYS.notifications, all);
  return notif;
}
function getNotifications()          { return _read(KEYS.notifications, []); }
function markNotificationRead(id) {
  const all = _read(KEYS.notifications, []);
  const n = all.find((x) => x.id === id);
  if (n) { n.read = true; _write(KEYS.notifications, all); }
}
function clearNotifications()        { _remove(KEYS.notifications); }

/* =============================================================
   LEADS (emails capturés) + DASHBOARD ADMIN
   Mode démo localStorage. À remplacer par une table `users` + auth
   serveur (RLS Supabase). Voir docs/unification.md.
   ============================================================= */

/* Upsert d'un lead (email capturé). `bumpSession` = +1 session de vote créée. */
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
}
function getLeads() { return _read(KEYS.leads, []); }

/* Toutes les décisions (pour les stats du dashboard) */
function getAllDecisions() { return Object.values(_allDecisions()); }

/* ---- Auth admin (mot de passe fixe, mode démo) ---- */
function adminLogin(password) {
  if (password === ADMIN_PASSWORD) { _write(KEYS.adminSession, "1"); return true; }
  return false;
}
function hasAdminSession()  { return _read(KEYS.adminSession, null) === "1"; }
function clearAdminSession() { _remove(KEYS.adminSession); }

/* =============================================================================
   EXPORT (Node / tests). En navigateur, tout est déjà global.
   ============================================================================= */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getLang, saveLang, getSurname, saveSurname,
    getUser, setUser, clearUser, findUserByEmail,
    getSelection, saveSelection, addToSelection, removeFromSelection,
    getSavedLists, addSavedList,
    getHistory, addHistory, getComparisons, addComparison,
    createDecision, getDecision, getCurrentDecisionId, setCurrentDecisionId,
    addParticipant, joinDecision, getMyParticipantId, saveVote, getVotes, computeMatches, computeRanking,
    addNotification, getNotifications, markNotificationRead, clearNotifications,
    registerLead, getLeads, getAllDecisions, adminLogin, hasAdminSession, clearAdminSession,
    uid,
  };
}
