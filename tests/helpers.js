'use strict';

const { expect } = require('@playwright/test');

const BASE_URL = 'https://namespark.baby';

// ─── Attente utilitaire ──────────────────────────────────────────────────────

/** Attend que #decideOverlay soit ouvert et qu'un step soit actif */
async function waitForDecideStep(page, stepId, timeout = 15_000) {
  await page.waitForSelector('#decideOverlay.open', { timeout });
  // showDecideStep() met display:none sur tous les autres steps
  await page.waitForFunction(
    (id) => {
      const el = document.getElementById(id);
      return el && el.style.display !== 'none' && el.offsetParent !== null;
    },
    stepId,
    { timeout }
  );
}

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * Connexion via la modale d'auth principale (#espaceBtn).
 * Attend que la modale se ferme ET ferme le drawer qui s'ouvre automatiquement.
 */
async function loginViaAuthModal(page, agent) {
  await page.click('#espaceBtn');
  await page.waitForSelector('#authModal.open', { timeout: 8_000 });
  await page.fill('#authEmail', agent.email);
  // Debounce de 1.4s + lookup Supabase
  await page.waitForTimeout(2_500);
  const fnField = page.locator('#authFirstName');
  if (await fnField.isVisible()) {
    await fnField.fill(agent.firstName);
  }
  await page.click('#authSubmit');
  // Attendre la fin de l'opération async (bouton re-enabled → modale fermée)
  await page.waitForFunction(
    () => {
      const modal = document.getElementById('authModal');
      return modal && !modal.classList.contains('open');
    },
    { timeout: 15_000 }
  );
  // Fermer le drawer espace qui s'ouvre automatiquement après auth
  const drawerOpen = await page.locator('#espaceDrawer.open').isVisible().catch(() => false);
  if (drawerOpen) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }
}

/**
 * Connexion via la modale #voteStartModal (déclenchée par "Décider à deux" sans être connecté).
 * Retourne une fois que #decideOverlay est ouvert.
 */
async function loginViaVoteStartModal(page, agent, mode = 'couple') {
  await page.waitForSelector('#voteStartModal.open', { timeout: 10_000 });
  await page.fill('#voteStartEmail', agent.email);
  await page.fill('#voteStartFirstName', agent.firstName);
  await page.click('#voteStartSubmit');
}

// ─── Sélection & prénoms ─────────────────────────────────────────────────────

/**
 * Injecte une liste de prénoms directement dans localStorage,
 * puis recharge la page. Plus rapide et déterministe que cliquer dans le générateur.
 *
 * Attend que #navListeLink soit visible — signal fiable que loadFavorites() +
 * updateEspaceButton() ont été appelés avec favorites.size > 0.
 */
async function seedFavorites(page, names) {
  await page.evaluate(
    (n) => localStorage.setItem('namespark.selection', JSON.stringify(n)),
    names
  );
  await page.reload({ waitUntil: 'load' });
  // Après reload, forcer la mise à jour en mémoire au cas où DOMContentLoaded
  // aurait couru avant que localStorage soit lu (race condition Playwright/JS).
  await page.evaluate((n) => {
    localStorage.setItem('namespark.selection', JSON.stringify(n));
    if (typeof loadFavorites === 'function')  loadFavorites();
    if (typeof renderFavorites === 'function') renderFavorites();
  }, names);
  // Signal fiable : renderFavorites() met le badge count à jour.
  // On vérifie #navListeBadge plutôt que style.display (le parent #navListeWrap
  // reste display:none en CSS même quand style.display="" est retiré).
  await page.waitForFunction(
    (n) => {
      const badge = document.getElementById('navListeBadge');
      return badge && parseInt(badge.textContent, 10) === n;
    },
    names.length,
    { timeout: 15_000 }
  );
}

/**
 * Ouvre l'overlay "Ma sélection" via appel JS direct.
 * #navListeWrap a display:none en CSS même quand il contient des favoris
 * (renderFavorites() met style.display="" qui revient au display:none du CSS),
 * donc page.click('#navListeLink') échoue avec "element not visible".
 * On appelle openSelection() directement, comme le ferait l'app.
 */
async function openSelectionOverlay(page) {
  await page.evaluate(() => openSelection());
  await page.waitForSelector('#selectionOverlay.open', { timeout: 8_000 });
}

// ─── Décision ────────────────────────────────────────────────────────────────

/**
 * Crée une décision COUPLE depuis l'overlay sélection :
 * clique "Décider à deux" → voteStartModal (si non connecté) → retourne l'URL invite.
 */
async function createCoupleDecision(page, agent) {
  await openSelectionOverlay(page);
  await page.click('#openDecideBtn');

  // Peut ouvrir voteStartModal ou directement decideOverlay selon l'état de connexion
  const hasVoteModal = await page.waitForSelector('#voteStartModal.open', { timeout: 5_000 })
    .then(() => true)
    .catch(() => false);

  if (hasVoteModal) {
    await loginViaVoteStartModal(page, agent, 'couple');
  }

  // Attendre le step "decideInvite" et le lien rempli
  await waitForDecideStep(page, 'decideInvite');
  await page.waitForFunction(
    () => {
      const el = document.getElementById('inviteLinkInput');
      return el && el.value.includes('?invite=');
    },
    { timeout: 15_000 }
  );

  return await page.inputValue('#inviteLinkInput');
}

/**
 * Crée une décision FAMILLE depuis l'overlay sélection.
 * Retourne l'URL de vote famille.
 */
async function createFamilyDecision(page, agent) {
  await openSelectionOverlay(page);
  await page.click('#openFamilyBtn');

  const hasVoteModal = await page.waitForSelector('#voteStartModal.open', { timeout: 5_000 })
    .then(() => true)
    .catch(() => false);

  if (hasVoteModal) {
    await loginViaVoteStartModal(page, agent, 'family');
  }

  // familyResults step
  await waitForDecideStep(page, 'familyResults');
  await page.waitForFunction(
    () => {
      const el = document.getElementById('familyLinkInput');
      return el && el.value.includes('?familyVote=');
    },
    { timeout: 15_000 }
  );

  return await page.inputValue('#familyLinkInput');
}

// ─── Vote ────────────────────────────────────────────────────────────────────

/**
 * Vote sur tous les prénoms visibles dans #voteList.
 * `reactions` : tableau de réactions à alterner (ex: ['yes','no','maybe']).
 * Retourne un objet { [name]: reaction } des votes effectués.
 */
async function voteOnAllNames(page, reactions = ['yes', 'maybe', 'no', 'yes', 'yes', 'maybe']) {
  await page.waitForSelector('#voteList .vote-item', { timeout: 15_000 });

  const voteItems = page.locator('#voteList .vote-item');
  const count = await voteItems.count();
  expect(count, 'La liste de vote doit contenir au moins un prénom').toBeGreaterThan(0);

  const cast = {};
  for (let i = 0; i < count; i++) {
    const item = voteItems.nth(i);
    const name = await item.getAttribute('data-vote-name');
    const reaction = reactions[i % reactions.length];
    const btn = item.locator(`[data-react="${reaction}"]`);
    await btn.click();
    await page.waitForTimeout(600); // laisser l'upsert Supabase partir
    cast[name] = reaction;
  }

  return cast;
}

/**
 * Vérifie STRICTEMENT que les boutons "selected" correspondent aux votes attendus.
 * `expectedVotes` : { [name]: reaction }
 * Chaque vote attendu DOIT être restitué dans l'UI — sinon le test échoue.
 * `bugMessage` préfixe le message d'échec pour nommer le bug signalé.
 */
async function verifyVotesSelected(page, expectedVotes, bugMessage = 'Vote non restitué') {
  for (const [name, reaction] of Object.entries(expectedVotes)) {
    const selectedBtn = page.locator(`.vote-item[data-vote-name="${name}"] .vote-btn.selected`);
    await expect(
      selectedBtn,
      `${bugMessage} — aucune réaction sélectionnée sur "${name}" (attendu : ${reaction})`
    ).toBeVisible({ timeout: 10_000 });
    const actualReact = await selectedBtn.getAttribute('data-react');
    expect(actualReact, `${bugMessage} — réaction sur "${name}"`).toBe(reaction);
  }
}

/**
 * Lit la décision directement depuis Supabase via la fonction app getDecision().
 * Retourne { id, items, participants: {pid: {...}}, votes: {pid: {name: reaction}} }
 * → vérité terrain pour les assertions "aucun vote perdu".
 */
async function fetchDecisionFromSupabase(page, decisionId) {
  return page.evaluate(async (id) => {
    const dec = await getDecision(id);
    return dec ? JSON.parse(JSON.stringify(dec)) : null;
  }, decisionId);
}

/**
 * Installe un enregistreur de toasts AVANT la navigation.
 * Les toasts sont éphémères (3,2s) — sans cela, on raterait les messages
 * d'erreur affichés pendant le chargement de la page.
 * Lire ensuite : await page.evaluate(() => window.__nsToasts)
 */
async function installToastRecorder(page) {
  await page.addInitScript(() => {
    window.__nsToasts = [];
    document.addEventListener('DOMContentLoaded', () => {
      const toast = document.getElementById('toast');
      if (!toast) return;
      new MutationObserver(() => {
        if (toast.classList.contains('show') && toast.textContent.trim()) {
          window.__nsToasts.push(toast.textContent.trim());
        }
      }).observe(toast, { attributes: true, attributeFilter: ['class'], childList: true });
    });
  });
}

/**
 * Rejoint une session couple via le lien ?invite=.
 * Remplit l'identification et attend le step vote.
 */
async function joinCoupleVote(page, inviteUrl, agent) {
  await page.goto(inviteUrl);
  await waitForDecideStep(page, 'couplePartnerReg');
  await page.fill('#partnerFirstName', agent.firstName);
  await page.fill('#partnerEmail', agent.email);
  await page.click('#partnerRegSubmit');
  await waitForDecideStep(page, 'decideVote', 20_000);
}

/**
 * Rejoint une session famille via le lien ?familyVote=.
 * Remplit le prénom et attend le step vote.
 */
async function joinFamilyVote(page, familyUrl, agent) {
  await page.goto(familyUrl);
  await waitForDecideStep(page, 'familyName');
  await page.fill('#familyVoterName', agent.firstName);
  await page.click('#familyNameSubmit');
  await waitForDecideStep(page, 'decideVote', 20_000);
}

/**
 * Capture les consoles erreurs pendant une action.
 * Retourne les messages captés.
 */
async function captureConsoleErrors(page, action) {
  const errors = [];
  const handler = (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  };
  page.on('console', handler);
  await action();
  page.off('console', handler);
  return errors;
}

module.exports = {
  BASE_URL,
  waitForDecideStep,
  loginViaAuthModal,
  loginViaVoteStartModal,
  seedFavorites,
  openSelectionOverlay,
  createCoupleDecision,
  createFamilyDecision,
  voteOnAllNames,
  verifyVotesSelected,
  fetchDecisionFromSupabase,
  installToastRecorder,
  joinCoupleVote,
  joinFamilyVote,
  captureConsoleErrors,
};
