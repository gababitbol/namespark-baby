/* =============================================================
   ADMIN PANEL — NameSpark Baby

   Gestion des utilisateurs créés volontairement
   Stockage local (localStorage) en mode démo
   =============================================================
   Note: En production, cela devrait :
   - S'authentifier via un serveur sécurisé
   - Stocker les données dans une base de données
   - Utiliser des hachis de mot de passe + JWT
*/

const ADMIN_USERS_KEY = "namespark_admin_users";
const ADMIN_PASS_KEY = "namespark_admin_pass";
const ADMIN_SESSION_KEY = "namespark_admin_session";

let isAuthenticated = false;
let allUsers = [];
let sortField = null;
let sortAsc = true;

/* ---- AUTH ---- */
function handleAuthSubmit(e) {
  e.preventDefault();
  const password = document.getElementById("adminPassword").value.trim();
  const error = document.getElementById("authError");

  if (!password) {
    error.textContent = "Entrez un mot de passe";
    return;
  }

  /* Première connexion : créer le mot de passe */
  const stored = localStorage.getItem(ADMIN_PASS_KEY);
  if (!stored) {
    localStorage.setItem(ADMIN_PASS_KEY, btoa(password)); // simple encoding, pas du vrai hash
    isAuthenticated = true;
    localStorage.setItem(ADMIN_SESSION_KEY, "1");
    showDashboard();
    return;
  }

  /* Vérifier le mot de passe */
  if (btoa(password) !== stored) {
    error.textContent = "Mot de passe incorrect";
    return;
  }

  isAuthenticated = true;
  localStorage.setItem(ADMIN_SESSION_KEY, "1");
  showDashboard();
}

function handleLogout() {
  isAuthenticated = false;
  localStorage.removeItem(ADMIN_SESSION_KEY);
  document.getElementById("authScreen").classList.remove("admin-hidden");
  document.getElementById("adminDash").classList.add("admin-hidden");
  document.getElementById("adminPassword").value = "";
  document.getElementById("authError").textContent = "";
}

function showDashboard() {
  document.getElementById("authScreen").classList.add("admin-hidden");
  document.getElementById("adminDash").classList.remove("admin-hidden");
  loadUsers();
  renderTable();
}

/* ---- LOAD USERS ---- */
function loadUsers() {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    allUsers = raw ? JSON.parse(raw) : [];
  } catch (_) {
    allUsers = [];
  }
}

/* ---- ADD USER (appelé depuis app.js) ---- */
function registerAdminUser(email, firstName, favoriteCount = 0) {
  if (!email) return;

  loadUsers();

  /* Ne pas enregistrer en doublon */
  if (allUsers.some((u) => u.email === email)) {
    const idx = allUsers.findIndex((u) => u.email === email);
    allUsers[idx].favoriteCount = favoriteCount;
    allUsers[idx].updatedAt = new Date().toISOString();
  } else {
    allUsers.push({
      id:            Date.now(),
      email,
      firstName:     firstName || null,
      createdAt:     new Date().toISOString(),
      favoriteCount: favoriteCount
    });
  }

  try {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(allUsers));
  } catch (_) {}
}

/* ---- UPDATE FAVORITE COUNT ---- */
function updateAdminFavoriteCount(email, count) {
  loadUsers();
  const user = allUsers.find((u) => u.email === email);
  if (user) {
    user.favoriteCount = count;
    try {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(allUsers));
    } catch (_) {}
  }
}

/* ---- RENDER TABLE ---- */
function renderTable() {
  loadUsers();

  /* Mise à jour stats */
  document.getElementById("totalUsers").textContent = allUsers.length;
  document.getElementById("totalFavorites").textContent =
    allUsers.reduce((sum, u) => sum + (u.favoriteCount || 0), 0);
  document.getElementById("activeUsers").textContent =
    allUsers.filter((u) => u.favoriteCount > 0).length;

  /* Filtre recherche */
  const search = document.getElementById("searchBox").value.toLowerCase();
  let filtered = allUsers.filter((u) => u.email.toLowerCase().includes(search));

  /* Tri */
  if (sortField) {
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "createdAt") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortField === "favoriteCount") {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  /* Rendu */
  const tbody = document.getElementById("usersTableBody");
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty"><div class="table-empty-big">—</div>Aucun utilisateur trouvé</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((u) => `
    <tr>
      <td><strong>${escapeHtml(u.email)}</strong></td>
      <td>${u.firstName ? escapeHtml(u.firstName) : "—"}</td>
      <td>${formatDate(u.createdAt)}</td>
      <td><strong>${u.favoriteCount || 0}</strong></td>
    </tr>`).join("");
}

/* ---- SORTING ---- */
document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll("th.sortable");
  headers.forEach((th) => {
    th.addEventListener("click", () => {
      const field = th.dataset.sort;
      if (sortField === field) {
        sortAsc = !sortAsc;
      } else {
        sortField = field;
        sortAsc = true;
      }
      /* Visuel du tri actif */
      headers.forEach((h) => h.classList.remove("active"));
      th.classList.add("active");
      renderTable();
    });
  });

  /* Recherche en temps réel */
  document.getElementById("searchBox").addEventListener("input", renderTable);

  /* Check session */
  if (localStorage.getItem(ADMIN_SESSION_KEY)) {
    isAuthenticated = true;
    showDashboard();
  }
});

/* ---- EXPORT CSV ---- */
function exportCSV() {
  loadUsers();
  let csv = "Email,Prénom,Date d'inscription,Favoris\n";

  allUsers.forEach((u) => {
    const row = [
      `"${u.email.replace(/"/g, '""')}"`,
      `"${(u.firstName || "").replace(/"/g, '""')}"`,
      u.createdAt.split("T")[0],
      u.favoriteCount || 0
    ];
    csv += row.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `namespark-users-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/* ---- HELPERS ---- */
function escapeHtml(text) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function formatDate(isoStr) {
  try {
    return new Date(isoStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (_) {
    return isoStr.split("T")[0];
  }
}
