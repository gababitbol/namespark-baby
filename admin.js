/* =============================================================
   ADMIN DASHBOARD — NameSpark Baby
   -------------------------------------------------------------
   Utilise storage.js comme couche de données (même principe que
   l'app principale). admin.html charge storage.js en premier.

   Auth : vérifiée côté serveur via /api/admin-login (env ADMIN_PASSWORD).
   Le token de session est ensuite gardé en sessionStorage.
   ============================================================= */

"use strict";

/* Le token admin n'est plus codé en dur ici. Il est obtenu du serveur après
   login (/api/admin-login) et lu via getAdminToken() (sessionStorage). */

let sortField = "createdAt";
let sortAsc = false;

/* ---- INIT ---- */
document.addEventListener("DOMContentLoaded", () => {
  if (hasAdminSession()) {
    showDashboard();
  }

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pw  = document.getElementById("loginPassword").value.trim();
    const btn = document.querySelector("#loginForm button[type=submit]") || document.querySelector("#loginForm button");
    const orig = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "…"; }
    let ok = false;
    try { ok = await adminLogin(pw); } catch (_) { ok = false; }
    if (btn) { btn.disabled = false; btn.textContent = orig; }
    if (ok) {
      showDashboard();
    } else {
      document.getElementById("loginError").textContent = "Mot de passe incorrect.";
      document.getElementById("loginPassword").value = "";
      document.getElementById("loginPassword").focus();
    }
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    clearAdminSession();
    document.getElementById("dashboard").classList.add("admin-hidden");
    document.getElementById("loginScreen").classList.remove("admin-hidden");
    document.getElementById("loginPassword").value = "";
  });
  document.getElementById("refreshBtn").addEventListener("click", renderAll);
  document.getElementById("exportBtn").addEventListener("click", exportCSV);
  document.getElementById("leadSearch").addEventListener("input", renderLeads);
  document.getElementById("subscribersSearch").addEventListener("input", renderSubscribers);
  document.getElementById("filterFamily").addEventListener("change", renderSessions);
  document.getElementById("filterCouple").addEventListener("change", renderSessions);

  /* Tri des colonnes du tableau leads */
  document.querySelectorAll("#leadsTable th.sortable").forEach((th) => {
    th.addEventListener("click", () => {
      const field = th.dataset.sort;
      if (sortField === field) {
        sortAsc = !sortAsc;
      } else {
        sortField = field;
        sortAsc = false;
      }
      document.querySelectorAll("#leadsTable th").forEach((h) => {
        h.classList.remove("sort-asc", "sort-desc");
      });
      th.classList.add(sortAsc ? "sort-asc" : "sort-desc");
      renderLeads();
    });
  });
});

function showDashboard() {
  document.getElementById("loginScreen").classList.add("admin-hidden");
  document.getElementById("dashboard").classList.remove("admin-hidden");
  renderAll();
}

/* ---- DONNÉES (cache + sync Supabase) ---- */
let _adminLeads = [];
let _adminDecisions = [];
let _adminNewsletter = [];
let _adminSubscribers = [];

/* ---- RENDER ALL ---- */
async function renderAll() {
  document.getElementById("refreshBtn").textContent = "⏳";
  document.getElementById("refreshBtn").disabled = true;
  try {
    [_adminLeads, _adminDecisions, _adminNewsletter, _adminSubscribers] = await Promise.all([
      fetchAllLeadsAdmin(),
      fetchAllDecisionsAdmin(),
      fetchNewsletterSubscribers(),
      fetchSubscribersFromApi(),
    ]);
  } catch (e) {
    console.warn("[Admin] Supabase fetch failed, using local cache", e);
    _adminLeads = getLeads();
    _adminDecisions = getAllDecisions();
    _adminNewsletter = [];
    _adminSubscribers = [];
  }
  renderStats();
  renderSubscribers();
  renderLeads();
  renderNewsletter();
  renderSessions();
  document.getElementById("refreshBtn").textContent = "🔄 Actualiser";
  document.getElementById("refreshBtn").disabled = false;
}

/* ---- SUBSCRIBERS (API sécurisée service_role) ---- */
async function fetchSubscribersFromApi() {
  try {
    const res = await fetch("/api/subscribers-admin", {
      headers: { "X-Admin-Token": getAdminToken() || "" },
    });
    if (!res.ok) { console.warn("[Admin] subscribers-admin:", res.status); return []; }
    const json = await res.json();
    return Array.isArray(json.subscribers) ? json.subscribers : [];
  } catch (e) {
    console.warn("[Admin] fetchSubscribersFromApi:", e);
    return [];
  }
}

function renderSubscribers() {
  const search = (document.getElementById("subscribersSearch")?.value || "").toLowerCase();
  const subs = _adminSubscribers.filter((s) =>
    (s.email      || "").toLowerCase().includes(search) ||
    (s.first_name || "").toLowerCase().includes(search) ||
    (s.last_name  || "").toLowerCase().includes(search)
  );

  /* Badge total (non filtré) */
  const badge = document.getElementById("subscribersBadge");
  if (badge) {
    const total = _adminSubscribers.length;
    badge.textContent = `${total} inscrit${total !== 1 ? "s" : ""}`;
    badge.style.display = total > 0 ? "" : "none";
  }

  const body = document.getElementById("subscribersBody");
  if (!body) return;

  if (!subs.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">${
      search ? "Aucun résultat pour cette recherche." : "Aucun inscrit pour l'instant."
    }</td></tr>`;
    return;
  }

  body.innerHTML = subs.map((s) => `
    <tr>
      <td class="td-email">${esc(s.email)}</td>
      <td>${s.first_name ? esc(s.first_name) : "<span style='color:var(--ink-soft)'>—</span>"}</td>
      <td>${s.last_name  ? esc(s.last_name)  : "<span style='color:var(--ink-soft)'>—</span>"}</td>
      <td>${fmtDate(s.created_at)}</td>
      <td>${fmtDate(s.updated_at)}</td>
    </tr>`).join("");
}

/* ---- KPIs ---- */
function renderStats() {
  const leads = _adminLeads;
  const decisions = _adminDecisions;
  const couple = decisions.filter((d) => d.mode !== "family");
  const family = decisions.filter((d) => d.mode === "family");

  const totalVotes = decisions.reduce((sum, d) => {
    return sum + Object.values(d.votes).reduce((s, byName) => s + Object.keys(byName).length, 0);
  }, 0);

  const stats = [
    { label: "Inscrits", value: _adminSubscribers.length, sub: "sans doublons, toutes sources" },
    { label: "Emails captés", value: leads.length, sub: `${leads.filter((l) => l.sessions > 0).length} avec vote créé` },
    { label: "Sessions couple", value: couple.length, sub: `${couple.filter((d)=>Object.keys(d.votes).length>=2).length} avec votes partenaire` },
    { label: "Sessions famille", value: family.length, sub: `${family.filter((d)=>Object.keys(d.votes).length>=2).length} avec ≥2 votants` },
    { label: "Votes reçus", value: totalVotes, sub: "total sur toutes sessions" },
    { label: "Prénoms uniques", value: [...new Set(decisions.flatMap((d) => d.items))].length, sub: "dans les sélections" },
  ];

  document.getElementById("statsGrid").innerHTML = stats.map((s) => `
    <div class="stat-card">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      ${s.sub ? `<div class="stat-sub">${s.sub}</div>` : ""}
    </div>`).join("");
}

/* ---- LEADS ---- */
function renderLeads() {
  const search = (document.getElementById("leadSearch").value || "").toLowerCase();
  let leads = _adminLeads.filter((l) =>
    l.email.toLowerCase().includes(search) ||
    (l.firstName || "").toLowerCase().includes(search) ||
    (l.surname || "").toLowerCase().includes(search)
  );

  leads.sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (!av && !bv) return 0;
    if (!av) return 1;
    if (!bv) return -1;
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return sortAsc ? -1 : 1;
    if (av > bv) return sortAsc ? 1 : -1;
    return 0;
  });

  const body = document.getElementById("leadsBody");
  if (!leads.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="7">Aucun email capté pour l'instant.</td></tr>`;
    return;
  }
  body.innerHTML = leads.map((l) => `
    <tr>
      <td class="td-email">${esc(l.email)}</td>
      <td>${l.firstName ? esc(l.firstName) : "—"}</td>
      <td>${l.surname ? esc(l.surname) : "<span style='color:var(--ink-soft)'>—</span>"}</td>
      <td>${fmtDate(l.createdAt)}</td>
      <td>${fmtDate(l.lastSeen)}</td>
      <td>${l.favorites || 0} ❤️</td>
      <td>${l.sessions || 0}</td>
    </tr>`).join("");
}

/* ---- SESSIONS DE VOTE ---- */
function renderSessions() {
  const onlyFamily = document.getElementById("filterFamily").checked;
  const onlyCouple = document.getElementById("filterCouple").checked;

  let decisions = _adminDecisions
    .filter((d) => {
      if (onlyFamily && d.mode !== "family") return false;
      if (onlyCouple && d.mode === "family") return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const wrap = document.getElementById("sessionsList");
  if (!decisions.length) {
    wrap.innerHTML = `<p style="padding:24px;color:var(--ink-soft);text-align:center">Aucune session pour l'instant.</p>`;
    return;
  }

  wrap.innerHTML = decisions.map((d) => {
    const modeLabel = d.mode === "family" ? "Famille" : "Couple";
    const modeCls   = d.mode === "family" ? "td-badge-family" : "td-badge-couple";
    const participants = Object.values(d.participants || {});
    const votes = d.votes || {};
    const hasVotes = Object.keys(votes).length > 0;

    /* Rangs / classement */
    let resultsHTML = "";
    if (d.mode === "family") {
      const rows = computeRanking(d.id);
      if (rows.some((r) => r.yes + r.maybe + r.no > 0)) {
        const medals = ["🥇","🥈","🥉"];
        resultsHTML = `<div style="margin-top:10px">
          ${rows.map((r, i) => `<div style="font-size:.82rem;padding:2px 0">
            ${medals[i]||`#${i+1}`} <strong>${esc(r.name)}</strong>
            — ${r.yes}❤️ ${r.maybe}🤔 ${r.no}❌
            ${r.voters.yes.length ? `<span style="color:var(--ink-soft)">(${r.voters.yes.map(esc).join(", ")})</span>` : ""}
          </div>`).join("")}
        </div>`;
      }
    } else {
      const matches = computeMatches(d.id);
      if (matches.length) {
        resultsHTML = `<div style="margin-top:10px;font-size:.82rem">
          ✅ Matchs : ${matches.map((n) => `<strong>${esc(n)}</strong>`).join(", ")}
        </div>`;
      }
    }

    /* Détail votes par votant */
    const votersHTML = hasVotes ? `
      <div class="session-votes">
        ${Object.entries(votes).map(([pid, byName]) => {
          const p = (d.participants || {})[pid];
          const name = p?.name || p?.email || pid.slice(-6);
          return `<div class="voter-row">
            <span class="voter-name">${esc(name)} <span style="font-size:.7rem;color:var(--ink-soft)">(${p?.role||"?"})</span></span>
            <span class="voter-votes">
              ${Object.entries(byName).map(([n, r]) => `
                <span class="voter-vote voter-vote-${r}">${esc(n)} ${r === "yes" ? "❤️" : r === "maybe" ? "🤔" : "❌"}</span>
              `).join("")}
            </span>
          </div>`;
        }).join("")}
      </div>` : `<p style="font-size:.82rem;color:var(--ink-soft);margin-top:8px">Aucun vote reçu pour l'instant.</p>`;

    return `
      <div class="session-card">
        <div class="session-card-head">
          <span class="td-badge ${modeCls}">${modeLabel}</span>
          <span class="session-id">${d.id}</span>
          <span style="font-size:.8rem;color:var(--ink-soft)">${fmtDate(d.createdAt)}</span>
          ${d.surname ? `<span style="font-size:.8rem">Nom : <strong>${esc(d.surname)}</strong></span>` : ""}
        </div>
        <div class="session-meta">
          ${participants.length} participant${participants.length > 1 ? "s" : ""} ·
          ${(d.items || []).length} prénoms · ${Object.keys(votes).length} votant${Object.keys(votes).length !== 1 ? "s" : ""}
        </div>
        <div class="session-items-list">
          ${(d.items || []).map((n) => `<span class="session-item-pill">${esc(n)}</span>`).join("")}
        </div>
        ${resultsHTML}
        ${votersHTML}
      </div>`;
  }).join("");
}

/* ---- EXPORT CSV ---- */
function exportCSV() {
  const leads = _adminLeads;
  let csv = "Email,Prénom,Nom de famille,Première visite,Dernière activité,Favoris,Sessions vote\n";
  leads.forEach((l) => {
    csv += [
      `"${(l.email     || "").replace(/"/g, '""')}"`,
      `"${(l.firstName || "").replace(/"/g, '""')}"`,
      `"${(l.surname   || "").replace(/"/g, '""')}"`,
      (l.createdAt || "").slice(0, 10),
      (l.lastSeen  || "").slice(0, 10),
      l.favorites || 0,
      l.sessions  || 0,
    ].join(",") + "\n";
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `namespark-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ---- NEWSLETTER ---- */
async function fetchNewsletterSubscribers() {
  if (!_sb) return [];
  const { data, error } = await _sb
    .from("newsletter_subscribers")
    .select("email, first_name, lang, subscribed_at, unsubscribed_at, is_active")
    .order("subscribed_at", { ascending: false });
  if (error || !data) { console.warn("[Admin] newsletter fetch:", error); return []; }
  return data;
}

function renderNewsletter() {
  const subs   = _adminNewsletter;
  const active = subs.filter((s) => s.is_active);
  const unsub  = subs.filter((s) => !s.is_active);

  const statsEl = document.getElementById("newsletterStats");
  if (statsEl) {
    statsEl.innerHTML = `<strong style="color:var(--accent-deep)">${active.length}</strong> actif${active.length > 1 ? "s" : ""}
      &nbsp;·&nbsp; <span style="color:#c05050">${unsub.length}</span> désabonné${unsub.length > 1 ? "s" : ""}`;
  }

  const body = document.getElementById("newsletterBody");
  if (!body) return;

  if (!subs.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">Aucun abonné pour l'instant.</td></tr>`;
    return;
  }

  body.innerHTML = subs.map((s) => {
    const isActive = s.is_active;
    const badge = isActive
      ? `<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:.72rem;font-weight:700;background:#ecfdf5;color:#065f46">Actif</span>`
      : `<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:.72rem;font-weight:700;background:#fef2f2;color:#991b1b">Désabonné</span>`;
    const dateCol = isActive ? fmtDate(s.subscribed_at) : `<span style="color:#c05050">${fmtDate(s.unsubscribed_at)}</span>`;
    return `<tr style="${isActive ? "" : "opacity:.65"}">
      <td class="td-email">${esc(s.email)}</td>
      <td>${s.first_name ? esc(s.first_name) : "—"}</td>
      <td>${s.lang || "fr"}</td>
      <td>${fmtDate(s.subscribed_at)}</td>
      <td>${badge}</td>
    </tr>`;
  }).join("");
}

/* ---- HELPERS ---- */
function esc(text) {
  if (!text) return "";
  return String(text).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
}
function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
  } catch (_) { return iso.slice(0, 10); }
}
