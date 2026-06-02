/* =============================================================
   ADMIN DASHBOARD — NameSpark Baby
   -------------------------------------------------------------
   Utilise storage.js comme couche de données (même principe que
   l'app principale). admin.html charge storage.js en premier.

   Auth : mot de passe fixé dans storage.js (ADMIN_PASSWORD).
   ⚠️  Local uniquement. En production : auth serveur + JWT.
   ============================================================= */

"use strict";

let sortField = "createdAt";
let sortAsc = false;

/* ---- INIT ---- */
document.addEventListener("DOMContentLoaded", () => {
  if (hasAdminSession()) {
    showDashboard();
  }

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const pw = document.getElementById("loginPassword").value.trim();
    if (adminLogin(pw)) {
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

/* ---- RENDER ALL ---- */
function renderAll() {
  renderStats();
  renderLeads();
  renderSessions();
}

/* ---- KPIs ---- */
function renderStats() {
  const leads = getLeads();
  const decisions = getAllDecisions();
  const couple = decisions.filter((d) => d.mode !== "family");
  const family = decisions.filter((d) => d.mode === "family");

  const totalVotes = decisions.reduce((sum, d) => {
    return sum + Object.values(d.votes).reduce((s, byName) => s + Object.keys(byName).length, 0);
  }, 0);

  const stats = [
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
  let leads = getLeads().filter((l) =>
    l.email.toLowerCase().includes(search) ||
    (l.firstName || "").toLowerCase().includes(search)
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
    body.innerHTML = `<tr class="empty-row"><td colspan="6">Aucun email capté pour l'instant.</td></tr>`;
    return;
  }
  body.innerHTML = leads.map((l) => `
    <tr>
      <td class="td-email">${esc(l.email)}</td>
      <td>${l.firstName ? esc(l.firstName) : "—"}</td>
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

  let decisions = getAllDecisions()
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
  const leads = getLeads();
  let csv = "Email,Prénom,Première visite,Dernière activité,Favoris,Sessions vote\n";
  leads.forEach((l) => {
    csv += [
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.firstName || "").replace(/"/g, '""')}"`,
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
