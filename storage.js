/* =============================================================
   COUCHE STORAGE ABSTRAITE — NameSpark Baby

   Isole TOUT le stockage en localStorage.
   Prépare la migration future vers Supabase / backend.

   ⚠️  IMPORTANT : Chaque fonction `save*` / `get*` peut être
   remplacée par un appel API sans toucher à app.js.

   TODO: BACKEND — Remplacer tous les localStorage par des appels
   POST/GET vers /api/storage/[entity] sur Supabase.
   ============================================================= */

/* ========== CLÉS LOCALSTORAGE ========== */
const STORAGE_KEYS = {
  /* Utilisateur actuel */
  USER:             "namespark_v1_user",
  FAVORITES:        "namespark_v1_favorites",
  SURNAME:          "namespark_v1_surname",
  LANG:             "namespark_v1_lang",

  /* Shortlist + Décider ensemble */
  SHORTLIST:        "namespark_v2_shortlist",      // [{ name, id, createdAt }]
  SHORTLIST_ID:     "namespark_v2_shortlist_id",   // UUID unique pour le lien
  VOTES:            "namespark_v2_votes",          // { "shortlistId": { "email": { "name": "yes"|"no"|"maybe" } } }
  INVITATION:       "namespark_v2_invitation",     // { shortlistId, creatorEmail, creatorName, createdAt, familyMode }
  PARTICIPANT:      "namespark_v2_participant",    // { email, name, role: "creator"|"invited"|"family" }
  MATCHS:           "namespark_v2_matchs",         // { shortlistId: ["name1", "name2", ...] }

  /* Notifications simulées */
  NOTIFICATIONS:    "namespark_v2_notifications",  // [{ id, type, text, timestamp, read }]
};

/* ========== PARTICIPANT & SESSION ========== */

/**
 * Définit le participant actuel (role: creator | invited | family)
 * TODO: BACKEND — POST /api/participants avec Supabase auth
 */
function saveParticipant(participant) {
  // { email, name, role: "creator|invited|family", shortlistId }
  try {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANT, JSON.stringify(participant));
  } catch (_) {}
}

function getParticipant() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANT);
    return data ? JSON.parse(data) : null;
  } catch (_) {
    return null;
  }
}

function clearParticipant() {
  localStorage.removeItem(STORAGE_KEYS.PARTICIPANT);
}

/* ========== SHORTLIST (= la sélection actuelle) ========== */

/**
 * Sauvegarde la shortlist (liste de prénoms choisis pour voter)
 * TODO: BACKEND — PUT /api/shortlists/{id} sur Supabase
 */
function saveShortlist(shortlist, shortlistId) {
  // shortlist: [{ name, id: Date.now(), createdAt }]
  try {
    localStorage.setItem(STORAGE_KEYS.SHORTLIST, JSON.stringify(shortlist));
    if (shortlistId) {
      localStorage.setItem(STORAGE_KEYS.SHORTLIST_ID, shortlistId);
    }
  } catch (_) {}
}

function getShortlist() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SHORTLIST);
    return data ? JSON.parse(data) : [];
  } catch (_) {
    return [];
  }
}

function getShortlistId() {
  return localStorage.getItem(STORAGE_KEYS.SHORTLIST_ID) || null;
}

function clearShortlist() {
  localStorage.removeItem(STORAGE_KEYS.SHORTLIST);
  localStorage.removeItem(STORAGE_KEYS.SHORTLIST_ID);
}

/* ========== INVITATION (lien partagé) ========== */

/**
 * Crée + sauvegarde une invitation
 * TODO: BACKEND — POST /api/invitations sur Supabase
 */
function createInvitation(creatorEmail, creatorName, familyMode = false) {
  const shortlistId = generateShortlistId(); // UUID-like
  const invitation = {
    shortlistId,
    creatorEmail,
    creatorName,
    createdAt: new Date().toISOString(),
    familyMode, // true = famille, false = juste conjoint
  };

  try {
    localStorage.setItem(STORAGE_KEYS.INVITATION, JSON.stringify(invitation));
  } catch (_) {}

  return shortlistId;
}

function getInvitation() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVITATION);
    return data ? JSON.parse(data) : null;
  } catch (_) {
    return null;
  }
}

function getInvitationByShortlistId(shortlistId) {
  const inv = getInvitation();
  return inv && inv.shortlistId === shortlistId ? inv : null;
}

function clearInvitation() {
  localStorage.removeItem(STORAGE_KEYS.INVITATION);
}

/* ========== VOTES (réactions : j'aime / je rejette) ========== */

/**
 * Enregistre un vote d'une personne sur un prénom de la shortlist
 * TODO: BACKEND — POST /api/votes sur Supabase
 */
function saveVote(shortlistId, email, prenameName, reaction) {
  // reaction: "yes" | "no" | "maybe"
  try {
    let votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || "{}");

    if (!votes[shortlistId]) votes[shortlistId] = {};
    if (!votes[shortlistId][email]) votes[shortlistId][email] = {};

    votes[shortlistId][email][prenameName] = reaction;
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  } catch (_) {}
}

function getVotes(shortlistId) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VOTES) || "{}";
    const votes = JSON.parse(data);
    return votes[shortlistId] || {};
  } catch (_) {
    return {};
  }
}

function getVotesForParticipant(shortlistId, email) {
  try {
    const votes = getVotes(shortlistId);
    return votes[email] || {};
  } catch (_) {
    return {};
  }
}

function clearVotes(shortlistId) {
  try {
    let votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || "{}");
    delete votes[shortlistId];
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  } catch (_) {}
}

/* ========== MATCHS (prénoms où tout le monde a dit "oui") ========== */

/**
 * Calcule et sauvegarde les matchs (consensus)
 * TODO: BACKEND — POST /api/matchs sur Supabase (ou calcul côté backend)
 */
function calculateAndSaveMatchs(shortlistId) {
  const votes = getVotes(shortlistId);
  const shortlist = getShortlist();

  const matchs = shortlist
    .filter((name) => {
      const allVotes = Object.values(votes).map((v) => v[name.name]);
      // Tous ont dit "yes" ?
      return allVotes.length > 0 && allVotes.every((v) => v === "yes");
    })
    .map((n) => n.name);

  try {
    let allMatchs = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHS) || "{}");
    allMatchs[shortlistId] = matchs;
    localStorage.setItem(STORAGE_KEYS.MATCHS, JSON.stringify(allMatchs));
  } catch (_) {}

  return matchs;
}

function getMatchs(shortlistId) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MATCHS) || "{}";
    const matchs = JSON.parse(data);
    return matchs[shortlistId] || [];
  } catch (_) {
    return [];
  }
}

/* ========== NOTIFICATIONS SIMULÉES ========== */

/**
 * Ajoute une notification (simulée côté front)
 * TODO: BACKEND — POST /api/notifications sur Supabase
 * + prévoir un polling/websocket pour recevoir les vraies notifications
 */
function addNotification(type, text) {
  // type: "partner_voted" | "match_found" | "weeks_left" | "custom"
  const notification = {
    id:        Date.now(),
    type,
    text,
    timestamp: new Date().toISOString(),
    read:      false,
  };

  try {
    let notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]");
    notifs.unshift(notification);
    notifs.splice(20); // garder max 20
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (_) {}

  return notification;
}

function getNotifications() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]";
    return JSON.parse(data);
  } catch (_) {
    return [];
  }
}

function markNotificationAsRead(notificationId) {
  try {
    let notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]");
    const notif = notifs.find((n) => n.id === notificationId);
    if (notif) notif.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (_) {}
}

function clearNotifications() {
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
}

/* ========== LEGACY — Garder compatibilité ========== */

// Favoris (existants)
function saveFavoritesToStorage(favorites) {
  try { localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([...favorites])); } catch (_) {}
}

function getFavoritesFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]");
    return Array.isArray(saved) ? new Set(saved) : new Set();
  } catch (_) { return new Set(); }
}

// Utilisateur
function saveUserToStorage(user) {
  try { localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)); } catch (_) {}
}

function getUserFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (_) { return null; }
}

// Langue
function saveLangToStorage(lang) {
  try { localStorage.setItem(STORAGE_KEYS.LANG, lang); } catch (_) {}
}

function getLangFromStorage() {
  return localStorage.getItem(STORAGE_KEYS.LANG) || "fr";
}

// Nom de famille
function saveSurnameToStorage(surname) {
  try { localStorage.setItem(STORAGE_KEYS.SURNAME, surname); } catch (_) {}
}

function getSurnameFromStorage() {
  return localStorage.getItem(STORAGE_KEYS.SURNAME) || "";
}

/* ========== HELPER — Générer un shortlist ID ========== */

function generateShortlistId() {
  // Format simple : timestamp + random
  return `sl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/* ========== EXPORT ========== */

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    // Participant
    saveParticipant, getParticipant, clearParticipant,
    // Shortlist
    saveShortlist, getShortlist, getShortlistId, clearShortlist,
    // Invitation
    createInvitation, getInvitation, getInvitationByShortlistId, clearInvitation,
    // Votes
    saveVote, getVotes, getVotesForParticipant, clearVotes,
    // Matchs
    calculateAndSaveMatchs, getMatchs,
    // Notifications
    addNotification, getNotifications, markNotificationAsRead, clearNotifications,
    // Legacy
    saveFavoritesToStorage, getFavoritesFromStorage,
    saveUserToStorage, getUserFromStorage,
    saveLangToStorage, getLangFromStorage,
    saveSurnameToStorage, getSurnameFromStorage,
  };
}
