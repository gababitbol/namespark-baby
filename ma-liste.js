/* =============================================================
   NameSpark Baby — Ma liste (page dédiée)
   -------------------------------------------------------------
   Script autonome pour ma-liste.html.
   Ne dépend pas de app.js.
   Lit les favoris depuis localStorage (même clé que app.js).

   ⚠️  Aucune clé API. Aucun appel réseau.
       La sauvegarde est locale (localStorage) en attendant
       le backend sécurisé — voir saveToBackend() plus bas.
   ============================================================= */

/* =============================================================
   1) CONSTANTES & CLÉS LOCALSTORAGE
   ============================================================= */
const FAV_KEY   = "namespark_v1_favorites";
const SURNAME_KEY = "namespark_v1_surname";
const LANG_KEY  = "namespark_v1_lang";
const SAVED_KEY = "namespark_v1_saved_lists";

/* =============================================================
   2) TRADUCTIONS (i18n — sous-ensemble pour cette page)
   ============================================================= */
const I18N = {
  fr: {
    page_title:     "Ma liste — NameSpark Baby",
    eyebrow:        "Votre sélection",
    liste_title:    "Votre sélection de prénoms",
    liste_subtitle: "Retrouvez tous les prénoms que vous avez sauvegardés.",
    liste_count:    (n) => `${n} prénom${n > 1 ? "s" : ""} sauvegardé${n > 1 ? "s" : ""}`,
    save_btn:       "📩 Sauvegarder ma liste",
    back_btn:       "← Retour au générateur",
    empty_title:    "Votre liste est vide",
    empty_sub:      "Retournez au générateur pour ajouter des prénoms à vos favoris.",
    empty_cta:      "← Aller au générateur",
    /* modal */
    modal_title:    "Sauvegarder ma liste",
    modal_desc:     "Recevez votre sélection par email et retrouvez-la plus tard.",
    field_fname:    "Prénom (optionnel)",
    field_email:    "Adresse email",
    submit_btn:     "Recevoir ma liste",
    /* succès */
    success_title:  "Votre sélection a été sauvegardée.",
    success_sub:    "Vous recevrez bientôt un email avec votre liste de prénoms.",
    success_close:  "Fermer",
    /* erreurs */
    error_email:    "Veuillez renseigner une adresse email valide.",
    /* cartes */
    card_meaning:   "Signification",
    card_why:       "Pourquoi ce prénom fonctionne",
    card_remove:    "Retirer",
    fav_remove_tip: "Retirer des favoris",
    compat_label:   "Harmonie avec",
    /* origines */
    origins: { hebreu:"Hébreu", francais:"Français", anglais:"Anglais", arabe:"Arabe",
               italien:"Italien", espagnol:"Espagnol", grec:"Grec", latin:"Latin" },
    styles: { classique:"Classique", moderne:"Moderne", rare:"Rare",
              elegant:"Élégant", court:"Court", poetique:"Poétique" },
    gender: { boy:"Garçon", girl:"Fille", mixte:"Mixte" }
  },
  en: {
    page_title:     "My list — NameSpark Baby",
    eyebrow:        "Your selection",
    liste_title:    "Your name selection",
    liste_subtitle: "Find all the names you have saved.",
    liste_count:    (n) => `${n} name${n > 1 ? "s" : ""} saved`,
    save_btn:       "📩 Save my list",
    back_btn:       "← Back to generator",
    empty_title:    "Your list is empty",
    empty_sub:      "Go back to the generator to add names to your favourites.",
    empty_cta:      "← Go to generator",
    /* modal */
    modal_title:    "Save my list",
    modal_desc:     "Receive your selection by email and find it again later.",
    field_fname:    "First name (optional)",
    field_email:    "Email address",
    submit_btn:     "Receive my list",
    /* success */
    success_title:  "Your selection has been saved.",
    success_sub:    "You will soon receive an email with your list of names.",
    success_close:  "Close",
    /* errors */
    error_email:    "Please enter a valid email address.",
    /* cards */
    card_meaning:   "Meaning",
    card_why:       "Why this name works",
    card_remove:    "Remove",
    fav_remove_tip: "Remove from favourites",
    compat_label:   "Harmony with",
    origins: { hebreu:"Hebrew", francais:"French", anglais:"English", arabe:"Arabic",
               italien:"Italian", espagnol:"Spanish", grec:"Greek", latin:"Latin" },
    styles: { classique:"Classic", moderne:"Modern", rare:"Rare",
              elegant:"Elegant", court:"Short", poetique:"Poetic" },
    gender: { boy:"Boy", girl:"Girl", mixte:"Unisex" }
  }
};

/* =============================================================
   3) ÉTAT
   ============================================================= */
let lang     = "fr";
let favorites = new Set();
let surname  = "";

/* =============================================================
   4) i18n
   ============================================================= */
function t(key) {
  const val = I18N[lang][key];
  return val !== undefined ? val : (I18N.fr[key] ?? key);
}

function applyLang(next) {
  lang = next;
  document.documentElement.lang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.querySelectorAll("#langSwitch button").forEach((b) =>
    b.classList.toggle("active", b.dataset.lang === lang)
  );
  document.title = t("page_title");
  renderPage();
}

/* =============================================================
   5) CHARGEMENT DEPUIS LOCALSTORAGE / URL
   ============================================================= */
function loadAll() {
  /* Langue : URL > localStorage > fr */
  const p = new URLSearchParams(location.search);
  const savedLang = p.get("lang") || localStorage.getItem(LANG_KEY) || "fr";
  lang = ["fr", "en"].includes(savedLang) ? savedLang : "fr";
  document.documentElement.lang = lang;
  document.querySelectorAll("#langSwitch button").forEach((b) =>
    b.classList.toggle("active", b.dataset.lang === lang)
  );

  /* Nom de famille : URL > localStorage */
  surname = p.get("surname") || localStorage.getItem(SURNAME_KEY) || "";

  /* Favoris depuis URL (partage) ou localStorage */
  if (p.get("share")) {
    const names = p.get("share").split(",");
    names.forEach((name) => {
      const trimmed = name.trim();
      if (trimmed && window.NAMES.some((n) => n.name === trimmed)) favorites.add(trimmed);
    });
    saveFavorites();
  } else {
    try {
      const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      if (Array.isArray(saved)) saved.forEach((n) => favorites.add(n));
    } catch (_) {}
  }
}

function saveFavorites() {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...favorites])); } catch (_) {}
}

/* =============================================================
   6) SCORE DE COMPATIBILITÉ (copie de app.js)
   ============================================================= */
function compatibilityScore(firstName, sur) {
  if (!sur || !firstName) return null;
  const norm  = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const syl   = (s) => Math.max(1, (norm(s).match(/[aeiouy]+/g) || []).length);
  const fn = norm(firstName), sn = norm(sur);
  const fnS = syl(firstName), snS = syl(sur);
  let sc = 4;
  if (firstName.length + sur.length >= 8 && firstName.length + sur.length <= 18) sc += 1;
  if (fn[0] !== sn[0]) sc += 1;
  if (fnS + snS >= 4 && fnS + snS <= 6) sc += 1;
  if (Math.abs(fnS - snS) <= 1) sc += 0.5;
  if (fn[fn.length - 1] !== sn[0]) sc += 1;
  if (fn[fn.length - 1] !== sn[sn.length - 1]) sc += 0.5;
  return Math.round(Math.min(10, Math.max(5, sc)));
}

/* =============================================================
   7) RENDU DES CARTES
   ============================================================= */
function cardHTML(n, index) {
  const meaning     = n.meaning[lang] || n.meaning.fr;
  const why         = n.why[lang]     || n.why.fr;
  const originLabel = t("origins")[n.origin] || n.origin;
  const styleLabels = n.style.map((s) => t("styles")[s] || s).join(" · ");
  const genderLabel = t("gender")[n.gender] || n.gender;
  const score       = surname ? compatibilityScore(n.name, surname) : null;

  const scoreHTML = score !== null ? `
    <div class="compat-wrap">
      <span class="compat-label">${t("compat_label")} ${surname}</span>
      <div class="compat-bar-outer">
        <div class="compat-bar-inner" style="width:${score * 10}%"></div>
      </div>
      <span class="compat-num">${score}<small>/10</small></span>
    </div>` : "";

  return `
    <article class="name-card" style="opacity:1;transform:none;animation:none;animation-delay:${index * 55}ms">
      <div class="top">
        <h4>${n.name}</h4>
        <div class="top-actions">
          <span class="badge ${n.gender}">${genderLabel}</span>
          <button class="btn-heart faved" data-heart="${n.name}" title="${t("fav_remove_tip")}" aria-label="${t("fav_remove_tip")}">❤️</button>
        </div>
      </div>
      ${surname ? `<div class="fullname">${n.name} ${surname}</div>` : ""}
      ${scoreHTML}
      <div class="meta-row">
        <span class="meta-tag">${originLabel}</span>
        <span class="meta-tag">${styleLabels}</span>
      </div>
      <dl>
        <dt>${t("card_meaning")}</dt><dd>${meaning}</dd>
        <dt>${t("card_why")}</dt><dd class="why">${why}</dd>
      </dl>
      <div class="card-foot">
        <button class="btn-remove-fav" data-remove="${n.name}">${t("card_remove")}</button>
      </div>
    </article>`;
}

/* =============================================================
   8) RENDU DE LA PAGE
   ============================================================= */
function renderPage() {
  /* Titre & compte */
  document.title = t("page_title");
  document.getElementById("listeEyebrow").textContent  = t("eyebrow");
  document.getElementById("listeTitle").textContent    = t("liste_title");
  document.getElementById("listeSubtitle").textContent = t("liste_subtitle");
  document.getElementById("saveBtnTop").textContent    = t("save_btn");
  document.getElementById("backBtn").textContent       = t("back_btn");

  const wrap = document.getElementById("listeResults");
  const countEl = document.getElementById("listeCount");
  const saveBtnTop = document.getElementById("saveBtnTop");

  if (favorites.size === 0) {
    saveBtnTop.style.display = "none";
    countEl.textContent = "";
    wrap.innerHTML = `
      <div class="liste-empty">
        <div class="empty-icon">📋</div>
        <h2>${t("empty_title")}</h2>
        <p>${t("empty_sub")}</p>
        <a href="index.html#generateur" class="btn btn-primary">${t("empty_cta")}</a>
      </div>`;
    return;
  }

  saveBtnTop.style.display = "";
  const list = [...favorites]
    .map((name) => window.NAMES.find((n) => n.name === name))
    .filter(Boolean);

  /* Tri par score décroissant si nom de famille disponible */
  if (surname) {
    list.sort((a, b) => {
      const sa = compatibilityScore(a.name, surname) || 0;
      const sb = compatibilityScore(b.name, surname) || 0;
      return sb - sa;
    });
  }

  countEl.textContent = typeof t("liste_count") === "function"
    ? t("liste_count")(list.length)
    : t("liste_count");

  /* Animation d'apparition légère (re-trigger via remplacement) */
  wrap.innerHTML = list.map((n, i) => cardHTML(n, i)).join("");

  /* Appliquer un délai d'animation progressif */
  wrap.querySelectorAll(".name-card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(12px)";
    card.style.transition = "opacity .45s ease, transform .45s ease";
    card.style.transitionDelay = `${i * 55}ms`;
    /* Déclenche le reflow pour que la transition s'applique */
    requestAnimationFrame(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    });
  });

  /* Boutons cœur */
  wrap.querySelectorAll("[data-heart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.heart;
      favorites.delete(name);
      saveFavorites();
      renderPage();
    });
  });

  /* Boutons retirer */
  wrap.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.remove;
      favorites.delete(name);
      saveFavorites();
      renderPage();
    });
  });
}

/* =============================================================
   9) MODAL SAUVEGARDER MA LISTE
   ============================================================= */
function openSaveModal() {
  if (favorites.size === 0) { showToast(t("empty_sub")); return; }
  resetSaveModal();
  document.getElementById("saveModal").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("saveEmail").focus(), 220);
}

function closeSaveModal() {
  document.getElementById("saveModal").classList.remove("open");
  document.body.style.overflow = "";
}

function resetSaveModal() {
  document.getElementById("saveForm").style.display = "";
  document.getElementById("saveSuccess").style.display = "none";
  document.getElementById("saveEmail").value = "";
  document.getElementById("saveFirstName").value = "";
  document.getElementById("saveEmail").classList.remove("field-error");
  document.getElementById("emailErrorMsg").classList.remove("visible");
  /* Mettre à jour les textes selon la langue */
  document.getElementById("saveModalTitle").textContent = t("modal_title");
  document.getElementById("saveModalDesc").textContent  = t("modal_desc");
  document.getElementById("saveFnLabel").textContent    = t("field_fname");
  document.getElementById("saveEmailLabel").textContent = t("field_email");
  document.getElementById("saveSubmitBtn").textContent  = t("submit_btn");
}

function handleSaveSubmit(e) {
  e.preventDefault();
  const email     = document.getElementById("saveEmail").value.trim();
  const firstName = document.getElementById("saveFirstName").value.trim();

  /* Validation email */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    document.getElementById("saveEmail").classList.add("field-error");
    document.getElementById("emailErrorMsg").textContent = t("error_email");
    document.getElementById("emailErrorMsg").classList.add("visible");
    document.getElementById("saveEmail").focus();
    return;
  }

  /* Désactiver le bouton pendant la "sauvegarde" */
  const btn = document.getElementById("saveSubmitBtn");
  btn.disabled = true;
  btn.textContent = "…";

  /* Simuler un délai (future API call) */
  setTimeout(() => {
    saveToStorage(firstName, email);
    showSuccessState(firstName);
    btn.disabled = false;
  }, 680);
}

function showSuccessState(firstName) {
  document.getElementById("saveForm").style.display = "none";
  const success = document.getElementById("saveSuccess");
  success.style.display = "";
  document.getElementById("successTitle").textContent = t("success_title");
  document.getElementById("successSub").textContent   = t("success_sub");
  document.getElementById("successCloseBtn").textContent = t("success_close");
}

/* =============================================================
   10) SAUVEGARDE LOCALE (prête pour backend)
   -------------------------------------------------------------
   ⚠️  STRUCTURE PRÊTE POUR L'INTÉGRATION BACKEND

   Quand le backend sera disponible, remplacer le bloc
   localStorage ci-dessous par :

     await fetch("/api/save-list", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(entry)
     });

   Le serveur enverra alors la liste par email à l'utilisateur.
   La clé API (Resend, Brevo, SendGrid…) restera côté serveur.
   ============================================================= */
function saveToStorage(firstName, email) {
  const entry = {
    id:        Date.now(),
    createdAt: new Date().toISOString(),
    firstName: firstName || null,
    email,
    names:     [...favorites],
    surname:   surname || null,
    lang
  };

  try {
    const existing = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    existing.push(entry);
    localStorage.setItem(SAVED_KEY, JSON.stringify(existing));
    console.info("[NameSpark Baby] Liste sauvegardée localement :", entry);
  } catch (_) {}
}

/* =============================================================
   11) TOAST
   ============================================================= */
let _toastTimer;
function showToast(msg, duration = 3000) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("show"), duration);
}

/* =============================================================
   12) BURGER MOBILE
   Même comportement que index.html — toggle .open sur #navLinks.
   ============================================================= */
function initBurger() {
  const burger = document.getElementById("burger");
  const links  = document.getElementById("navLinks");
  if (!burger || !links) return;
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  /* Fermer le menu au clic sur un lien */
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

/* =============================================================
   13) INIT
   ============================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadAll();

  /* Langue */
  document.getElementById("langSwitch").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn && btn.dataset.lang) applyLang(btn.dataset.lang);
  });

  /* Boutons sauvegarder */
  document.getElementById("saveBtnTop").addEventListener("click", openSaveModal);
  document.getElementById("closeSaveModal").addEventListener("click", closeSaveModal);
  document.getElementById("saveModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeSaveModal();
  });
  document.getElementById("saveForm").addEventListener("submit", handleSaveSubmit);
  document.getElementById("successCloseBtn").addEventListener("click", closeSaveModal);

  /* Validation email en direct */
  document.getElementById("saveEmail").addEventListener("input", () => {
    document.getElementById("saveEmail").classList.remove("field-error");
    document.getElementById("emailErrorMsg").classList.remove("visible");
  });

  /* Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSaveModal();
  });

  initBurger();
  renderPage();
  document.title = t("page_title");
});
