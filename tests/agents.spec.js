'use strict';

/**
 * NameSpark Baby — Tests multi-agents
 *
 * Principe : un test qui passe alors qu'il y a un vrai problème est pire
 * qu'un test qui échoue. Les comportements anormaux du site produisent des
 * tests ROUGES avec un message "Bug : …" explicite — jamais des verts qui mentent.
 *
 * Architecture :
 *   • Agents fictifs (fixtures.js) + 8 votants parallèles générés
 *   • Scénarios en describe.serial (ordre garanti, état partagé)
 *     1. Couple    : Sophie crée → Thomas vote → double-vote → revisit STRICT
 *     2. Famille   : Marie crée → 5 votants → intégrité Supabase → créatrice STRICT
 *     3. Auth      : reconnexion email connu + inscription email inconnu
 *     4. Double-vote : Élodie — upsert + persistance STRICTE
 *     5. Sécurité  : Alex sans code / code invalide / email invalide
 *     6. Parallèle : 8 agents votent simultanément — aucun vote perdu
 *
 * Chaque agent utilise un browserContext isolé → localStorage propre.
 * NB serial : un test rouge saute les suivants du bloc → les tests stricts
 * susceptibles d'échouer sont placés en FIN de bloc.
 */

const { test, expect } = require('@playwright/test');
const { AGENTS, PARALLEL_VOTERS, TEST_SELECTION } = require('./fixtures');
const {
  waitForDecideStep,
  loginViaAuthModal,
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
} = require('./helpers');

// ── Helpers d'accès aux agents ────────────────────────────────────────────────
const agent = (id) => AGENTS.find((a) => a.id === id);

// ── État partagé entre les tests sériels ─────────────────────────────────────
const coupleState     = { inviteUrl: null, votes: null, thomasPid: null };
const familyState     = { voteUrl: null, voters: {} };
const doubleVoteState = { inviteUrl: null, pid: null, targetName: null };
const parallelState   = { voteUrl: null, voters: [] };

// =============================================================================
// SCÉNARIO 1 — Vote COUPLE (Sophie créatrice, Thomas partenaire)
// =============================================================================
test.describe.serial('🥂 Scénario couple — Sophie & Thomas', () => {

  // ── 1.1 Sophie crée la décision ─────────────────────────────────────────────
  test('[Sophie] S\'inscrit et crée une décision couple', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    // Naviguer et pré-charger les favoris (seedFavorites fait goto+reload+wait)
    await page.goto('/');
    await seedFavorites(page, TEST_SELECTION);

    // Créer la décision couple → récupère le lien invite
    coupleState.inviteUrl = await createCoupleDecision(page, agent('sophie'));

    expect(coupleState.inviteUrl, 'Le lien d\'invitation couple doit exister').toMatch(/\?invite=/);
    console.log(`\n  📎 Lien couple : ${coupleState.inviteUrl}`);

    await ctx.close();
  });

  // ── 1.2 Thomas s'identifie et vote ──────────────────────────────────────────
  test('[Thomas] Rejoint via lien et vote sur tous les prénoms', async ({ browser }) => {
    expect(coupleState.inviteUrl, 'Prérequis : le lien doit exister').toBeTruthy();

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureConsoleErrors(page, async () => {

      await joinCoupleVote(page, coupleState.inviteUrl, agent('thomas'));

      // Vote : oui sur les 3 premiers, peut-être, non, peut-être
      coupleState.votes = await voteOnAllNames(page, ['yes', 'yes', 'yes', 'maybe', 'no', 'maybe']);

    });

    // Capturer le participantId de Thomas → vérité terrain pour le test revisit
    coupleState.thomasPid = await page.evaluate(() => decideState.participantId);
    expect(coupleState.thomasPid, 'Thomas doit avoir un participantId').toBeTruthy();

    expect(Object.keys(coupleState.votes).length, 'Doit avoir voté sur au moins 1 prénom').toBeGreaterThan(0);
    const networkErrors = errors.filter((e) => !/favicon|analytics|plausible/i.test(e));
    expect(networkErrors, 'Aucune erreur console critique').toHaveLength(0);

    await ctx.close();
  });

  // ── 1.3 Thomas tente de voter deux fois (double vote) ───────────────────────
  test('[Thomas] Tente de voter deux fois sur le même prénom — upsert attendu, pas d\'erreur', async ({ browser }) => {
    expect(coupleState.inviteUrl).toBeTruthy();

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await joinCoupleVote(page, coupleState.inviteUrl, agent('thomas'));
    await page.waitForTimeout(2_000); // attendre le pré-chargement Supabase

    const firstItem = page.locator('#voteList .vote-item').first();
    const yesBtn    = firstItem.locator('[data-react="yes"]');
    const noBtn     = firstItem.locator('[data-react="no"]');
    const maybeBtn  = firstItem.locator('[data-react="maybe"]');

    // — Vote 1 : ❤️ oui
    await yesBtn.click();
    await page.waitForTimeout(800);
    await expect(yesBtn, 'Après vote 1 → "yes" doit être selected').toHaveClass(/selected/);
    await expect(noBtn, 'Après vote 1 → "no" ne doit PAS être selected').not.toHaveClass(/selected/);

    // — Vote 2 : ❌ non sur le MÊME prénom (upsert Supabase → pas de doublon)
    await noBtn.click();
    await page.waitForTimeout(800);
    await expect(noBtn,  'Après re-vote → "no" doit être selected').toHaveClass(/selected/);
    await expect(yesBtn, 'Après re-vote → "yes" ne doit PLUS être selected').not.toHaveClass(/selected/);

    // — Vote 3 : même réaction encore (idempotent)
    await noBtn.click();
    await page.waitForTimeout(800);
    await expect(noBtn,   'Idempotent → "no" reste selected').toHaveClass(/selected/);
    await expect(maybeBtn,'Idempotent → "maybe" non selected').not.toHaveClass(/selected/);

    // Aucun toast d'erreur visible
    const errorToast = page.locator('[class*="toast"]').filter({ hasText: /erreur|error|failed/i });
    await expect(errorToast, 'Aucun toast d\'erreur ne doit apparaître').toHaveCount(0);

    // Aucune erreur console critique
    const criticalErrors = consoleErrors.filter((e) => !/favicon|analytics|plausible/i.test(e));
    expect(criticalErrors, 'Pas d\'erreur JS lors du double vote').toHaveLength(0);

    await ctx.close();
  });

  // ── 1.4 Sophie consulte les résultats ───────────────────────────────────────
  test('[Sophie] Rouvre sa décision et voit les votes de Thomas', async ({ browser }) => {
    expect(coupleState.inviteUrl).toBeTruthy();

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto('/');
    await seedFavorites(page, TEST_SELECTION);

    // Se reconnecter en tant que Sophie
    await loginViaAuthModal(page, agent('sophie'));
    // Fermer le drawer espace si ouvert
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Extraire le decisionId du lien invite
    const url    = new URL(coupleState.inviteUrl);
    const decId  = url.searchParams.get('invite');
    expect(decId, 'decisionId doit être présent dans le lien').toBeTruthy();

    // Naviguer directement vers la décision (simule "Reprendre" depuis le drawer)
    await page.goto(`/?invite=${decId}&lang=fr`);

    // Sophie est créatrice : elle passe par couplePartnerReg ou directement
    // selon si son participantId est en localStorage (nouveau contexte → non)
    const hasPartnerReg = await page.waitForSelector('#couplePartnerReg', { timeout: 8_000 })
      .then(() => true)
      .catch(() => false);

    if (hasPartnerReg) {
      // Sophie se réidentifie
      await page.fill('#partnerFirstName', agent('sophie').firstName);
      await page.fill('#partnerEmail', agent('sophie').email);
      await page.click('#partnerRegSubmit');
    }

    // Attendre le step vote
    await waitForDecideStep(page, 'decideVote', 15_000);
    await page.waitForTimeout(4_000); // Supabase

    // Vérifier que la liste de vote a des prénoms
    const items = await page.locator('#voteList .vote-item').count();
    expect(items, 'Sophie voit la liste des prénoms à voter').toBeGreaterThan(0);

    // Sophie doit pouvoir accéder aux résultats
    const seeMatchsBtn = page.locator('#seeMatchsBtn');
    await expect(seeMatchsBtn, 'Le bouton "Voir les résultats" doit être visible').toBeVisible();
    await seeMatchsBtn.click();
    await waitForDecideStep(page, 'decideResults', 10_000);
    const matchGrid = page.locator('#decideMatchsGrid');
    await expect(matchGrid, 'La grille des résultats doit s\'afficher').toBeVisible();

    await ctx.close();
  });

  // ── 1.5 STRICT : Thomas revient — ses votes DOIVENT être rechargés ──────────
  // Placé en fin de bloc : son échec ne saute aucun autre test du scénario.
  test('[Thomas] Revient via le lien — ses votes doivent être rechargés depuis Supabase', async ({ browser }) => {
    expect(coupleState.inviteUrl).toBeTruthy();
    expect(coupleState.votes).toBeTruthy();
    expect(coupleState.thomasPid).toBeTruthy();

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    // Nouveau contexte = nouvel appareil : Thomas se réidentifie avec le MÊME email
    await joinCoupleVote(page, coupleState.inviteUrl, agent('thomas'));
    await page.waitForTimeout(6_000); // laisser largement le temps à getDecision

    // Vérité terrain : ses votes du test 1.2 existent bien dans Supabase
    const decId = new URL(coupleState.inviteUrl).searchParams.get('invite');
    const decision = await fetchDecisionFromSupabase(page, decId);
    const stored = decision?.votes?.[coupleState.thomasPid] || {};
    expect(
      Object.keys(stored).length,
      'Prérequis : les votes de Thomas (1.2) doivent exister dans Supabase'
    ).toBeGreaterThan(0);

    // STRICT : l'UI doit restituer les votes de Thomas tels qu'ils sont dans
    // Supabase. On compare l'UI à la vérité terrain (stored), pas à coupleState.votes
    // qui peut être périmé si un test précédent a modifié certains votes.
    const selectedCount = await page.locator('#voteList .vote-btn.selected').count();
    expect(selectedCount, 'Bug : votes non rechargés depuis Supabase').toBeGreaterThan(0);
    await verifyVotesSelected(page, stored, 'Bug : votes non rechargés depuis Supabase');

    await ctx.close();
  });

});

// =============================================================================
// SCÉNARIO 2 — Vote FAMILLE (Marie créatrice, 5 membres de la famille)
// =============================================================================
test.describe.serial('👨‍👩‍👧 Scénario famille — Marie + 5 membres', () => {

  const familyVoters = ['madeleine', 'laurent', 'lucie', 'rene', 'papy'].map((id) => agent(id));

  // ── 2.1 Marie crée la décision famille ──────────────────────────────────────
  test('[Marie] S\'inscrit et crée une décision famille', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto('/');
    await seedFavorites(page, TEST_SELECTION);

    familyState.voteUrl = await createFamilyDecision(page, agent('marie'));

    expect(familyState.voteUrl, 'Le lien famille doit exister').toMatch(/\?familyVote=/);
    console.log(`\n  📎 Lien famille : ${familyState.voteUrl}`);

    await ctx.close();
  });

  // ── 2.2-2.6 Chaque membre de la famille vote (en série) ─────────────────────
  for (const voter of familyVoters) {
    test(`[${voter.firstName}] (${voter.role}) — Rejoint et vote`, async ({ browser }) => {
      expect(familyState.voteUrl, `Prérequis pour ${voter.firstName}`).toBeTruthy();

      const ctx  = await browser.newContext();
      const page = await ctx.newPage();

      await joinFamilyVote(page, familyState.voteUrl, voter);

      // Chaque membre vote avec une combinaison différente
      const reactionSets = {
        madeleine : ['yes', 'yes', 'maybe', 'yes', 'maybe', 'yes'],
        laurent   : ['maybe', 'yes', 'no', 'yes', 'yes', 'maybe'],
        lucie     : ['no', 'maybe', 'yes', 'no', 'yes', 'yes'],
        rene      : ['yes', 'no', 'yes', 'maybe', 'no', 'yes'],
        papy      : ['yes', 'yes', 'yes', 'maybe', 'yes', 'no'],
      };
      const reactions = reactionSets[voter.id] || ['yes', 'maybe', 'no'];

      const votes = await voteOnAllNames(page, reactions);
      expect(Object.keys(votes).length, `${voter.firstName} doit avoir voté`).toBeGreaterThan(0);

      // Capturer le participantId → vérification d'intégrité en 2.7
      const pid = await page.evaluate(() => decideState.participantId);
      expect(pid, `${voter.firstName} doit avoir un participantId`).toBeTruthy();
      familyState.voters[voter.id] = { firstName: voter.firstName, pid, votes };

      // STRICT : "J'ai terminé" doit mener à l'écran de remerciement
      const doneBtn = page.locator('#seeMatchsBtn');
      await expect(doneBtn, `${voter.firstName} doit voir le bouton "J'ai terminé"`).toBeVisible();
      await doneBtn.click();
      await waitForDecideStep(page, 'familyThanks', 10_000);

      await ctx.close();
    });
  }

  // ── 2.7 Intégrité : aucun vote famille ne doit être perdu dans Supabase ─────
  test('[Vérification] Tous les votes de la famille sont enregistrés — aucun perdu', async ({ browser }) => {
    const captured = Object.values(familyState.voters);
    expect(captured.length, 'Les 5 votants doivent avoir été capturés').toBe(5);

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });
    await page.waitForTimeout(3_000); // laisser les derniers upserts se propager

    const decId    = new URL(familyState.voteUrl).searchParams.get('familyVote');
    const decision = await fetchDecisionFromSupabase(page, decId);
    expect(decision, 'La décision famille doit être lisible depuis Supabase').toBeTruthy();

    const lost = [];
    for (const voter of captured) {
      const recorded = (decision.votes && decision.votes[voter.pid]) || {};
      for (const [name, reaction] of Object.entries(voter.votes)) {
        if (recorded[name] !== reaction) {
          lost.push(`${voter.firstName} → "${name}" : attendu "${reaction}", trouvé "${recorded[name] ?? 'ABSENT'}"`);
        }
      }
    }
    expect(lost, `Bug : ${lost.length} vote(s) famille perdu(s) ou altéré(s) dans Supabase`).toEqual([]);
    console.log(`\n  ✅ ${captured.length} votants × ${TEST_SELECTION.length} votes vérifiés dans Supabase — aucun perdu`);

    await ctx.close();
  });

  // ── 2.8 STRICT : Marie (créatrice) rouvre son lien — doit voir ses résultats ─
  // Placé en fin de bloc : son échec ne saute aucun autre test du scénario.
  test('[Marie] Rouvre son lien — doit être reconnue créatrice et voir les résultats', async ({ browser }) => {
    expect(familyState.voteUrl).toBeTruthy();

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto('/');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });

    // Marie se reconnecte avec son email (compte existant)
    await loginViaAuthModal(page, agent('marie'));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Elle rouvre SA décision via SON lien
    const decId = new URL(familyState.voteUrl).searchParams.get('familyVote');
    await page.goto(`/?familyVote=${decId}&lang=fr`);
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });
    // STRICT : connectée avec l'email de la créatrice, elle doit retrouver
    // l'écran de résultats (familyResults) — pas l'écran votant (familyName).
    const onResults = await waitForDecideStep(page, 'familyResults', 20_000)
      .then(() => true)
      .catch(() => false);
    expect(
      onResults,
      'Bug : la créatrice n\'est pas reconnue sur son propre lien — elle tombe sur l\'écran votant au lieu de ses résultats (identité non rechargée depuis Supabase)'
    ).toBe(true);

    await ctx.close();
  });

});

// =============================================================================
// SCÉNARIO 3 — Reconnexion (email connu → mode "bon retour")
// =============================================================================
test.describe.serial('🔑 Scénario auth — Reconnexion email connu', () => {

  test('[Sophie-retour] Rouvre la modale → email connu détecté, prénom masqué', async ({ browser }) => {
    const sophieRetour = agent('sophie-retour');

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto('/');
    // Signal d'app prête : #espaceBtn est interactif après init complète
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });

    // Ouvrir la modale
    await page.click('#espaceBtn');
    await page.waitForSelector('#authModal.open', { timeout: 8_000 });

    // Saisir l'email déjà connu de Sophie (compte créé au scénario 1)
    await page.fill('#authEmail', sophieRetour.email);

    // STRICT : le lookup Supabase doit détecter le compte existant
    const statusEl = page.locator('#authEmailStatus');
    await expect(
      statusEl,
      'Bug : email existant non détecté — le lookup Supabase ne trouve pas le compte de Sophie'
    ).toHaveClass(/auth-found/, { timeout: 12_000 });
    console.log('\n  ✅ Détection email existant : OK ("', (await statusEl.textContent()).trim(), '")');

    // Soumettre pour vérifier la connexion
    await page.click('#authSubmit');
    await page.waitForSelector('#authModal.open', { state: 'hidden', timeout: 10_000 });
    // Drawer espace doit s'ouvrir
    await page.waitForSelector('#espaceDrawer.open, #espaceDrawer', { timeout: 6_000 });

    await ctx.close();
  });

  test('[Nouveau user] Inscription avec email inconnu → prénom requis', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto('/');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });

    await page.click('#espaceBtn');
    await page.waitForSelector('#authModal.open');

    const newEmail = `ns-test-nouveau-${Date.now()}@yopmail.com`;
    await page.fill('#authEmail', newEmail);
    await page.waitForTimeout(3_500); // debounce + Supabase lookup

    // Email inconnu → mode "inscription" → champ prénom visible
    const fnField = page.locator('#authFirstName');
    const fnVisible = await fnField.isVisible().catch(() => false);
    console.log(`\n  Champ prénom visible pour email inconnu : ${fnVisible}`);

    // Soumission (prénom est optionnel — le code n'empêche pas sans prénom)
    if (fnVisible) await fnField.fill('Nouveau');
    await page.click('#authSubmit');
    // Attendre que l'opération async se termine (bouton re-enabled + modale fermée)
    await page.waitForFunction(
      () => {
        const modal = document.getElementById('authModal');
        return modal && !modal.classList.contains('open');
      },
      { timeout: 15_000 }
    );
    // Fermer le drawer qui s'ouvre automatiquement
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Vérifier que l'utilisateur est maintenant connecté (currentUser défini dans le JS)
    const isLoggedIn = await page.evaluate(() => typeof currentUser !== 'undefined' && currentUser !== null);
    expect(isLoggedIn, 'currentUser défini dans l\'app après inscription').toBe(true);

    await ctx.close();
  });

});

// =============================================================================
// SCÉNARIO 4 — Double vote ISOLÉ (Élodie, cas de test pur)
// =============================================================================
test.describe.serial('🔁 Scénario double vote — Élodie', () => {

  test('[Élodie] Crée une décision pour tester le double vote', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto('/');
    await seedFavorites(page, ['Emma', 'Léa', 'Sofia']);

    doubleVoteState.inviteUrl = await createCoupleDecision(page, agent('elodie'));
    expect(doubleVoteState.inviteUrl).toMatch(/\?invite=/);

    await ctx.close();
  });

  test('[Élodie] Vote oui sur "Emma", revote non → réaction changée (upsert)', async ({ browser }) => {
    expect(doubleVoteState.inviteUrl).toBeTruthy();

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

    // Élodie se connecte en tant que partenaire
    await joinCoupleVote(page, doubleVoteState.inviteUrl, agent('elodie'));
    await page.waitForSelector('#voteList .vote-item', { timeout: 15_000 });

    // Cible : le prénom "Emma" (premier dans TEST_SELECTION)
    const emmaItem = page.locator('.vote-item[data-vote-name="Emma"]');
    const hasEmma  = await emmaItem.isVisible().catch(() => false);

    // Fallback : prendre le premier item si Emma pas présent
    const target = hasEmma ? emmaItem : page.locator('.vote-item').first();
    doubleVoteState.targetName = await target.getAttribute('data-vote-name');
    const targetName = doubleVoteState.targetName;

    const yesBtn   = target.locator('[data-react="yes"]');
    const noBtn    = target.locator('[data-react="no"]');
    const maybeBtn = target.locator('[data-react="maybe"]');

    // ── Cycle 1 : vote oui ──────────────────────────────────────────────
    await yesBtn.click();
    await page.waitForTimeout(1_000);
    await expect(yesBtn).toHaveClass(/selected/);
    await expect(noBtn).not.toHaveClass(/selected/);
    console.log(`\n  Vote 1 sur "${targetName}" : ❤️ OUI — sélectionné`);

    // ── Cycle 2 : re-vote non (même prénom) ─────────────────────────────
    await noBtn.click();
    await page.waitForTimeout(1_000);
    await expect(noBtn).toHaveClass(/selected/);
    await expect(yesBtn).not.toHaveClass(/selected/);
    console.log(`  Vote 2 sur "${targetName}" : ❌ NON — réaction changée (upsert OK)`);

    // ── Cycle 3 : re-vote non encore (idempotent) ────────────────────────
    await noBtn.click();
    await page.waitForTimeout(800);
    await expect(noBtn).toHaveClass(/selected/);
    console.log(`  Vote 3 sur "${targetName}" : ❌ NON encore — idempotent, pas d'erreur`);

    // ── Cycle 4 : retour à peut-être ────────────────────────────────────
    await maybeBtn.click();
    await page.waitForTimeout(800);
    await expect(maybeBtn).toHaveClass(/selected/);
    await expect(noBtn).not.toHaveClass(/selected/);
    console.log(`  Vote 4 sur "${targetName}" : 🤔 PEUT-ÊTRE — changement libre confirmé`);

    // Capturer le participantId → vérification stricte de persistance en 4.3
    doubleVoteState.pid = await page.evaluate(() => decideState.participantId);
    expect(doubleVoteState.pid, 'Élodie doit avoir un participantId').toBeTruthy();

    // Vérifier l'absence totale d'erreur
    const criticalErrors = errors.filter((e) => !/favicon|analytics|plausible/i.test(e));
    expect(criticalErrors, 'Aucune erreur JS lors des changements de vote').toHaveLength(0);

    const errorToast = page.locator('[class*="toast"]').filter({ hasText: /erreur|error|failed/i });
    await expect(errorToast, 'Aucun toast d\'erreur').toHaveCount(0);

    await ctx.close();
  });

  // STRICT : le dernier vote doit être persisté dans Supabase, sans tolérance.
  test('[Élodie] Recharge la page — le dernier vote (🤔) doit être persisté et restitué', async ({ browser }) => {
    expect(doubleVoteState.inviteUrl).toBeTruthy();
    expect(doubleVoteState.pid).toBeTruthy();
    expect(doubleVoteState.targetName).toBeTruthy();

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await joinCoupleVote(page, doubleVoteState.inviteUrl, agent('elodie'));
    await page.waitForSelector('#voteList .vote-item', { timeout: 15_000 });
    await page.waitForTimeout(6_000); // laisser largement le temps à Supabase

    // STRICT 1 — écriture : la dernière réaction (maybe) doit être dans Supabase
    const decId    = new URL(doubleVoteState.inviteUrl).searchParams.get('invite');
    const decision = await fetchDecisionFromSupabase(page, decId);
    const storedReaction = decision?.votes?.[doubleVoteState.pid]?.[doubleVoteState.targetName];
    expect(
      storedReaction,
      `Bug : persistance Supabase non fiable — dernière réaction sur "${doubleVoteState.targetName}" attendue "maybe"`
    ).toBe('maybe');

    // STRICT 2 — lecture : l'UI doit restituer ce vote au rechargement
    const target = page.locator(`.vote-item[data-vote-name="${doubleVoteState.targetName}"]`);
    const selectedBtn = target.locator('.vote-btn.selected');
    await expect(
      selectedBtn,
      'Bug : votes non rechargés depuis Supabase — aucune réaction restituée au rechargement'
    ).toBeVisible({ timeout: 10_000 });
    const reaction = await selectedBtn.getAttribute('data-react');
    expect(reaction, 'Bug : persistance Supabase non fiable — mauvaise réaction restituée').toBe('maybe');

    await ctx.close();
  });

});

// =============================================================================
// SCÉNARIO 5 — Sécurité & validation (Alex + entrées invalides)
// =============================================================================
test.describe('🛡️ Scénario sécurité — accès et entrées invalides', () => {

  // ── 5.1 Alex sans code famille → aucune interface de vote ───────────────────
  test('[Alex] Invité sans code famille — ne peut pas accéder au vote', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    // Alex arrive sur le site sans aucun lien d'invitation
    await page.goto('/');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });

    await expect(
      page.locator('#decideOverlay'),
      'Bug : overlay de vote ouvert sans invitation'
    ).not.toHaveClass(/open/);
    expect(
      await page.locator('#voteList .vote-item').count(),
      'Bug : interface de vote accessible sans code famille'
    ).toBe(0);

    // Tentative directe : paramètre familyVote vide
    await page.goto('/?familyVote=&lang=fr');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });

    await expect(
      page.locator('#decideOverlay'),
      'Bug : overlay de vote ouvert avec un code famille vide'
    ).not.toHaveClass(/open/);
    expect(
      await page.locator('#voteList .vote-item').count(),
      'Bug : interface de vote accessible avec un code famille vide'
    ).toBe(0);

    console.log('\n  ✅ Alex sans code : aucune interface de vote accessible');
    await ctx.close();
  });

  // ── 5.2 Code famille incorrect → message d'erreur ───────────────────────────
  test('[Alex] Code famille incorrect → message d\'erreur affiché, vote bloqué', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    // Les toasts durent 3,2s — enregistreur installé AVANT la navigation
    await installToastRecorder(page);

    await page.goto('/?familyVote=dec_code_inexistant_42&lang=fr');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });
    await page.waitForTimeout(5_000); // laisser getDecision échouer côté Supabase

    // STRICT : un message d'erreur doit avoir été affiché
    const toasts = await page.evaluate(() => window.__nsToasts);
    console.log(`\n  Toasts captés : ${JSON.stringify(toasts)}`);
    expect(
      toasts.join(' | '),
      'Bug : aucun message d\'erreur affiché pour un code famille invalide'
    ).toMatch(/introuvable|expir|impossible de charger|not.*found|expired|unable to load/i);

    // STRICT : l'interface de vote ne doit PAS s'ouvrir
    await expect(
      page.locator('#decideOverlay'),
      'Bug : overlay de vote ouvert malgré un code famille invalide'
    ).not.toHaveClass(/open/);
    expect(
      await page.locator('#voteList .vote-item').count(),
      'Bug : prénoms votables affichés malgré un code famille invalide'
    ).toBe(0);

    await ctx.close();
  });

  // ── 5.3 Email invalide → inscription refusée avec message d'erreur ──────────
  test('[Email invalide] Inscription refusée avec message d\'erreur', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto('/');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });

    await page.click('#espaceBtn');
    await page.waitForSelector('#authModal.open', { timeout: 8_000 });

    const invalidEmails = ['pas-un-email', 'manque@undomaine'];
    for (const bad of invalidEmails) {
      await page.fill('#authEmail', bad);
      await page.click('#authSubmit');

      // STRICT : message d'erreur visible et non vide
      const emailError = page.locator('#authEmailError');
      await expect(
        emailError,
        `Bug : aucun message d'erreur affiché pour l'email invalide "${bad}"`
      ).toHaveClass(/visible/, { timeout: 5_000 });
      const errText = (await emailError.textContent()).trim();
      expect(errText.length, `Le message d'erreur pour "${bad}" ne doit pas être vide`).toBeGreaterThan(0);

      // STRICT : la modale reste ouverte — l'inscription est bloquée
      await expect(
        page.locator('#authModal'),
        `Bug : modale fermée malgré l'email invalide "${bad}"`
      ).toHaveClass(/open/);
      console.log(`\n  ✅ "${bad}" refusé : "${errText}"`);
    }

    // STRICT : aucun utilisateur ne doit avoir été créé
    const isLoggedIn = await page.evaluate(() => typeof currentUser !== 'undefined' && currentUser !== null);
    expect(isLoggedIn, 'Bug : inscription acceptée avec un email invalide').toBe(false);

    await ctx.close();
  });

});

// =============================================================================
// SCÉNARIO 6 — 8 agents votent EN PARALLÈLE (aucun vote ne doit se perdre)
// =============================================================================
test.describe.serial('⚡ Scénario parallèle — 8 votants simultanés', () => {

  // ── 6.1 Nadia crée la décision famille ──────────────────────────────────────
  test('[Nadia] Crée une décision famille pour le test parallèle', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto('/');
    await seedFavorites(page, TEST_SELECTION);

    parallelState.voteUrl = await createFamilyDecision(page, agent('nadia'));
    expect(parallelState.voteUrl, 'Le lien famille doit exister').toMatch(/\?familyVote=/);
    console.log(`\n  📎 Lien parallèle : ${parallelState.voteUrl}`);

    await ctx.close();
  });

  // ── 6.2 Les 8 agents votent simultanément ───────────────────────────────────
  test('[8 agents] Votent simultanément sur la même décision', async ({ browser }) => {
    expect(parallelState.voteUrl).toBeTruthy();

    // Réactions déterministes différentes par votant (rotation yes/maybe/no)
    const reactionsFor = (i) => TEST_SELECTION.map((_, j) => ['yes', 'maybe', 'no'][(i + j) % 3]);

    const results = await Promise.all(PARALLEL_VOTERS.map(async (voter, i) => {
      const ctx  = await browser.newContext();
      const page = await ctx.newPage();
      try {
        await joinFamilyVote(page, parallelState.voteUrl, voter);
        const votes = await voteOnAllNames(page, reactionsFor(i));
        const pid   = await page.evaluate(() => decideState.participantId);
        return { firstName: voter.firstName, pid, votes };
      } finally {
        await ctx.close();
      }
    }));

    for (const r of results) {
      expect(r.pid, `${r.firstName} doit avoir un participantId`).toBeTruthy();
      expect(
        Object.keys(r.votes).length,
        `${r.firstName} doit avoir voté sur les ${TEST_SELECTION.length} prénoms`
      ).toBe(TEST_SELECTION.length);
    }
    parallelState.voters = results;
    console.log(`\n  ⚡ ${results.length} agents ont voté en parallèle (${results.length * TEST_SELECTION.length} votes émis)`);
  });

  // ── 6.3 STRICT : aucun vote perdu ────────────────────────────────────────────
  test('[Vérification] Aucun des 48 votes parallèles n\'est perdu dans Supabase', async ({ browser }) => {
    expect(parallelState.voters.length, 'Les 8 votants doivent avoir été capturés').toBe(8);

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });
    await page.waitForTimeout(3_000); // laisser les derniers upserts se propager

    const decId    = new URL(parallelState.voteUrl).searchParams.get('familyVote');
    const decision = await fetchDecisionFromSupabase(page, decId);
    expect(decision, 'La décision doit être lisible depuis Supabase').toBeTruthy();

    const lost = [];
    for (const voter of parallelState.voters) {
      const recorded = (decision.votes && decision.votes[voter.pid]) || {};
      for (const [name, reaction] of Object.entries(voter.votes)) {
        if (recorded[name] !== reaction) {
          lost.push(`${voter.firstName} → "${name}" : attendu "${reaction}", trouvé "${recorded[name] ?? 'ABSENT'}"`);
        }
      }
    }
    expect(lost, `Bug : ${lost.length} vote(s) perdu(s) en écriture parallèle`).toEqual([]);

    const total = parallelState.voters.length * TEST_SELECTION.length;
    console.log(`\n  ✅ ${total}/${total} votes parallèles vérifiés dans Supabase — aucun perdu`);

    await ctx.close();
  });

});

// =============================================================================
// SCÉNARIO 7 — CAS LIMITES (décision supprimée / clôturée / lien invalide)
// =============================================================================
const edgeState = { voteUrl: null, decisionId: null };

test.describe.serial('🧨 Scénario cas limites — décisions mortes', () => {

  // ── 7.1 Décision supprimée → message d'erreur clair, pas de crash ───────────
  test('[Suzanne] Ouvre le lien d\'une décision supprimée → message d\'erreur, pas de page blanche', async ({ browser }) => {
    // Étape A : créer une vraie décision famille
    const ctxA  = await browser.newContext();
    const pageA = await ctxA.newPage();
    await pageA.goto('/');
    await seedFavorites(pageA, TEST_SELECTION);
    edgeState.voteUrl = await createFamilyDecision(pageA, {
      firstName: 'Suzanne', email: 'ns-test-suzanne@yopmail.com',
    });
    edgeState.decisionId = new URL(edgeState.voteUrl).searchParams.get('familyVote');
    await ctxA.close();

    // Étape B : simuler la suppression.
    // NB vérifié hors test : la clé anon ne PEUT PAS supprimer de ligne
    // (RLS sans policy DELETE — c'est une bonne chose côté sécurité).
    // On simule donc la suppression en réécrivant l'id de la décision dans
    // toutes les requêtes Supabase de ce contexte : le serveur répond
    // authentiquement "aucune ligne", exactement comme après un vrai DELETE.
    const ctxB = await browser.newContext();
    await ctxB.route('**/rest/v1/**', (route) => {
      const url = route.request().url();
      if (url.includes(edgeState.decisionId)) {
        route.continue({ url: url.replaceAll(edgeState.decisionId, 'dec_supprimee_simulee_0') });
      } else {
        route.continue();
      }
    });

    const pageB = await ctxB.newPage();
    const pageErrors = [];
    pageB.on('pageerror', (err) => pageErrors.push(err.message));
    await installToastRecorder(pageB);

    await pageB.goto(`/?familyVote=${edgeState.decisionId}&lang=fr`);
    await pageB.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });
    await pageB.waitForTimeout(5_000); // laisser getDecision échouer + toast partir

    // STRICT : un message d'erreur clair doit avoir été affiché
    const toasts = await pageB.evaluate(() => window.__nsToasts);
    console.log(`\n  Toasts captés (décision supprimée) : ${JSON.stringify(toasts)}`);
    expect(
      toasts.join(' | '),
      'Bug : aucun message d\'erreur affiché pour une décision supprimée'
    ).toMatch(/introuvable|expir|impossible de charger|not.*found|expired|unable to load/i);

    // STRICT : pas de page blanche — l'app reste utilisable
    await expect(
      pageB.locator('#loadingScreen'),
      'Bug : l\'app reste bloquée sur l\'écran de chargement'
    ).not.toHaveClass(/visible/);
    await expect(
      pageB.locator('#decideOverlay'),
      'Bug : overlay de vote ouvert sur une décision supprimée'
    ).not.toHaveClass(/open/);

    // STRICT : pas de crash JS silencieux
    expect(pageErrors, `Bug : exception(s) JS non gérée(s) : ${pageErrors.join(' · ')}`).toEqual([]);

    await ctxB.close();
  });

  // ── 7.2 Lien d'invitation invalide → "introuvable ou expiré" ────────────────
  test('[Lien invalide] /?familyVote=CODE_QUI_NEXISTE_PAS → message clair, app non bloquée', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    await installToastRecorder(page);

    await page.goto('/?familyVote=CODE_QUI_NEXISTE_PAS&lang=fr');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });
    await page.waitForTimeout(5_000);

    // STRICT : message "introuvable ou expiré"
    const toasts = await page.evaluate(() => window.__nsToasts);
    console.log(`\n  Toasts captés (code invalide) : ${JSON.stringify(toasts)}`);
    expect(
      toasts.join(' | '),
      'Bug : aucun message "introuvable ou expiré" pour un code invalide'
    ).toMatch(/introuvable|expir|not.*found|expired/i);

    // STRICT : l'app ne reste pas bloquée
    await expect(
      page.locator('#loadingScreen'),
      'Bug : app bloquée sur l\'écran de chargement avec un code invalide'
    ).not.toHaveClass(/visible/);
    await expect(page.locator('#decideOverlay')).not.toHaveClass(/open/);
    expect(pageErrors, `Bug : exception(s) JS : ${pageErrors.join(' · ')}`).toEqual([]);

    await ctx.close();
  });

  // ── 7.3 Décision clôturée → le vote doit être bloqué ────────────────────────
  // Rouge attendu : la colonne "status" n'existe pas dans Supabase.
  // Placé en FIN de bloc sériel pour ne faire sauter aucun autre test.
  test('[Clôture] Vote sur une décision clôturée → doit être bloqué', async ({ browser }) => {
    expect(edgeState.decisionId, 'Prérequis : décision du test 7.1').toBeTruthy();

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });

    // Tenter de clôturer la décision dans Supabase
    const updateError = await page.evaluate(async (id) => {
      const { error } = await _sb.from('decisions').update({ status: 'closed' }).eq('id', id);
      return error ? (error.message || JSON.stringify(error)) : null;
    }, edgeState.decisionId);

    // STRICT : si la clôture est impossible, c'est que la fonctionnalité
    // n'existe pas — un vote sur une décision "fermée" ne peut donc JAMAIS
    // être bloqué. Test rouge assumé jusqu'à ce que la colonne existe.
    expect(
      updateError,
      `Bug : impossible de clôturer une décision — ${updateError}. ` +
      'La table "decisions" n\'a pas de colonne "status" : l\'app n\'a aucun mécanisme de clôture, ' +
      'donc un vote sur une décision censée être fermée passe toujours.'
    ).toBeNull();

    // Si la clôture a fonctionné (colonne ajoutée plus tard) : vérifier le blocage
    const ctxVoter  = await browser.newContext();
    const pageVoter = await ctxVoter.newPage();
    await installToastRecorder(pageVoter);
    await joinFamilyVote(pageVoter, edgeState.voteUrl, { firstName: 'Tardif' });

    const firstBtn = pageVoter.locator('#voteList .vote-item').first().locator('[data-react="yes"]');
    await firstBtn.click();
    await pageVoter.waitForTimeout(2_000);

    const pid = await pageVoter.evaluate(() => decideState.participantId);
    const voteLanded = await pageVoter.evaluate(async ({ id, p }) => {
      const { data } = await _sb.from('votes').select('name')
        .eq('decision_id', id).eq('participant_id', p);
      return (data || []).length;
    }, { id: edgeState.decisionId, p: pid });

    expect(voteLanded, 'Bug : vote accepté sur une décision clôturée').toBe(0);

    await ctxVoter.close();
    await ctx.close();
  });

  // ── 7.4 Créateur clôture via bouton UI → votant bloqué (UI + Supabase) ──────
  test('[Clôture UI] Créateur clôture → votant voit UI désactivée + Supabase bloque', async ({ browser }) => {
    // Créer une décision fraîche (contexte créateur propre)
    const ctxCreator = await browser.newContext();
    const pageCreator = await ctxCreator.newPage();
    await pageCreator.goto('/');
    await seedFavorites(pageCreator, TEST_SELECTION);
    const voteUrl    = await createFamilyDecision(pageCreator, { firstName: 'ClaudeCloture', email: 'ns-test-claude-cloture@yopmail.com' });
    const decisionId = new URL(voteUrl).searchParams.get('familyVote');
    expect(decisionId, 'Prérequis : decisionId créé').toBeTruthy();

    // Le créateur est déjà sur familyResults après createFamilyDecision
    // Le bouton "Clôturer" doit être visible
    const closeBtn = pageCreator.locator('#closeVoteBtn');
    await expect(
      closeBtn,
      'Bug : bouton "Clôturer le vote" absent pour le créateur sur familyResults'
    ).toBeVisible();

    // Clôturer (dialog confirm accepté automatiquement)
    pageCreator.once('dialog', (dialog) => dialog.accept());
    await closeBtn.click();
    await pageCreator.waitForTimeout(2_000);

    // Vérifier le statut dans Supabase
    const statusAfter = await pageCreator.evaluate(async (id) => {
      const { data } = await _sb.from('decisions').select('status').eq('id', id).maybeSingle();
      return data?.status ?? null;
    }, decisionId);
    expect(statusAfter, 'Bug : statut Supabase non "closed" après clic Clôturer').toBe('closed');
    await ctxCreator.close();

    // Votant : ouvre le lien → saisit son prénom → arrive sur decideVote
    const ctxVoter  = await browser.newContext();
    const pageVoter = await ctxVoter.newPage();
    await pageVoter.goto(voteUrl);
    await pageVoter.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });
    await waitForDecideStep(pageVoter, 'familyName');
    await pageVoter.fill('#familyVoterName', 'VotantBloq');
    await pageVoter.click('#familyNameSubmit');
    await waitForDecideStep(pageVoter, 'decideVote');

    // UI : bandeau "vote terminé" visible
    await expect(
      pageVoter.locator('#voteClosedBanner'),
      'Bug : bandeau "Ce vote est terminé" absent sur décision clôturée'
    ).toBeVisible();

    // UI : tous les boutons de vote marqués comme clôturés (data-closed) + sans écouteurs
    const allBtns  = pageVoter.locator('#voteList .vote-btn');
    const btnCount = await allBtns.count();
    expect(btnCount, 'Bug : aucun bouton de vote dans voteList').toBeGreaterThan(0);
    for (let i = 0; i < btnCount; i++) {
      await expect(
        allBtns.nth(i),
        `Bug : bouton de vote [${i}] sans marqueur "data-closed" alors que le vote est clôturé`
      ).toHaveAttribute('data-closed', 'true');
    }

    // Supabase : bypass UI → insert direct → doit être bloqué par le trigger
    const pid = await pageVoter.evaluate(() => decideState.participantId);
    expect(pid, 'Bug : participantId absent après saisie du prénom').toBeTruthy();

    const bypassError = await pageVoter.evaluate(async ({ decisionId, participantId }) => {
      const firstItem = document.querySelector('#voteList .vote-item')?.dataset.voteName;
      if (!firstItem) return 'ERR: aucun item dans voteList';
      const { error } = await _sb.from('votes').upsert({
        decision_id:    decisionId,
        participant_id: participantId,
        name:           firstItem,
        reaction:       'yes',
        voted_at:       new Date().toISOString(),
      }, { onConflict: 'decision_id,participant_id,name' });
      return error ? (error.message || JSON.stringify(error)) : null;
    }, { decisionId, participantId: pid });

    expect(
      bypassError,
      'Bug : vote accepté côté Supabase sur une décision clôturée. ' +
      'Le trigger de blocage est absent ou inactif. ' +
      'Blocage visuel seul insuffisant : un attaquant peut voter via console.'
    ).toBeTruthy();

    // Double-vérif : aucun vote dans la base pour ce participant
    const voteLanded = await pageVoter.evaluate(async ({ id, p }) => {
      const { data } = await _sb.from('votes').select('name').eq('decision_id', id).eq('participant_id', p);
      return (data || []).length;
    }, { id: decisionId, p: pid });
    expect(voteLanded, 'Bug : vote enregistré malgré la clôture').toBe(0);

    await ctxVoter.close();
  });

});

// =============================================================================
// SCÉNARIO 8 — COMPATIBILITÉ MOBILE (iPhone 14 + Galaxy S21)
// =============================================================================
const MOBILE_DEVICES = [
  {
    name: 'iPhone 14',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  },
  {
    name: 'Galaxy S21',
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  },
];

function newMobileContext(browser, device) {
  return browser.newContext({
    viewport:          device.viewport,
    deviceScaleFactor: device.deviceScaleFactor,
    userAgent:         device.userAgent,
    isMobile:          true,
    hasTouch:          true,
  });
}

/**
 * Audit STRICT des éléments interactifs sur mobile :
 * visibles, taille minimale 24×24px (WCAG 2.5.8), dans le viewport horizontal.
 * Retourne la liste des problèmes (vide = OK).
 */
async function auditTapTargets(page, targets, minSize = 24) {
  const vp = page.viewportSize();
  const issues = [];
  for (const { sel, label } of targets) {
    const loc = page.locator(sel).first();
    if (!(await loc.isVisible().catch(() => false))) {
      issues.push(`${label} (${sel}) : non visible`);
      continue;
    }
    const box = await loc.boundingBox();
    if (!box) { issues.push(`${label} (${sel}) : pas de boundingBox`); continue; }
    if (box.width < minSize || box.height < minSize) {
      issues.push(`${label} (${sel}) : cible tactile trop petite (${Math.round(box.width)}×${Math.round(box.height)}px < ${minSize}px)`);
    }
    if (box.x < -1 || box.x + box.width > vp.width + 1) {
      issues.push(`${label} (${sel}) : déborde du viewport (x=${Math.round(box.x)}, largeur=${Math.round(box.width)}, viewport=${vp.width})`);
    }
  }
  return issues;
}

/** Vérifie qu'il n'y a pas de scroll horizontal parasite */
async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    overflow.scrollWidth,
    `Bug mobile (${label}) : débordement horizontal — scrollWidth=${overflow.scrollWidth}px > viewport=${overflow.clientWidth}px`
  ).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

test.describe('📱 Scénario mobile — iPhone 14 & Galaxy S21', () => {

  for (const device of MOBILE_DEVICES) {

    // ── 8.x Sophie crée un vote famille sur mobile ─────────────────────────────
    test(`[${device.name}] Sophie crée un vote famille — boutons cliquables, overlay fermable`, async ({ browser }) => {
      const ctx  = await newMobileContext(browser, device);
      const page = await ctx.newPage();

      await page.goto('/');
      await seedFavorites(page, TEST_SELECTION);
      await assertNoHorizontalOverflow(page, `${device.name} accueil`);

      // Audit des cibles tactiles de l'overlay sélection
      await openSelectionOverlay(page);
      const selIssues = await auditTapTargets(page, [
        { sel: '#openDecideBtn',  label: 'Bouton "Décider à deux"' },
        { sel: '#openFamilyBtn',  label: 'Bouton "Vote famille"' },
        { sel: '#closeSelection', label: 'Fermeture sélection' },
      ]);
      expect(selIssues, `Bug mobile (${device.name}) : ${selIssues.join(' · ')}`).toEqual([]);

      // Créer la décision famille (flow complet UI)
      await page.click('#openFamilyBtn');
      const hasVoteModal = await page.waitForSelector('#voteStartModal.open', { timeout: 5_000 })
        .then(() => true).catch(() => false);
      if (hasVoteModal) {
        const modalIssues = await auditTapTargets(page, [
          { sel: '#voteStartEmail',     label: 'Champ email' },
          { sel: '#voteStartFirstName', label: 'Champ prénom' },
          { sel: '#voteStartSubmit',    label: 'Bouton valider' },
        ]);
        expect(modalIssues, `Bug mobile (${device.name}) : ${modalIssues.join(' · ')}`).toEqual([]);
        await page.fill('#voteStartEmail', 'ns-test-sophie@yopmail.com');
        await page.fill('#voteStartFirstName', 'Sophie');
        await page.click('#voteStartSubmit');
      }

      await waitForDecideStep(page, 'familyResults');
      await page.waitForFunction(
        () => document.getElementById('familyLinkInput')?.value.includes('?familyVote='),
        { timeout: 15_000 }
      );

      // STRICT : l'overlay doit se fermer correctement
      const closeIssues = await auditTapTargets(page, [
        { sel: '#closeDecide', label: 'Fermeture overlay décision' },
      ]);
      expect(closeIssues, `Bug mobile (${device.name}) : ${closeIssues.join(' · ')}`).toEqual([]);
      await page.click('#closeDecide');
      await expect(
        page.locator('#decideOverlay'),
        `Bug mobile (${device.name}) : l'overlay décision ne se ferme pas`
      ).not.toHaveClass(/open/, { timeout: 5_000 });

      console.log(`\n  📱 ${device.name} : création famille OK, overlay fermé proprement`);
      await ctx.close();
    });

    // ── 8.x Thomas vote et revient sur mobile (régression du bug corrigé) ──────
    test(`[${device.name}] Thomas vote puis revient — votes restitués sur mobile`, async ({ browser }) => {
      // A. Créatrice mobile prépare une décision couple
      const ctxA  = await newMobileContext(browser, device);
      const pageA = await ctxA.newPage();
      await pageA.goto('/');
      await seedFavorites(pageA, TEST_SELECTION);
      const inviteUrl = await createCoupleDecision(pageA, {
        firstName: 'Sophie', email: 'ns-test-sophie@yopmail.com',
      });
      await ctxA.close();

      // B. Thomas vote sur mobile
      const ctxB  = await newMobileContext(browser, device);
      const pageB = await ctxB.newPage();
      await joinCoupleVote(pageB, inviteUrl, agent('thomas'));

      // Audit des boutons de vote (cibles tactiles critiques)
      const voteIssues = await auditTapTargets(pageB, [
        { sel: '#voteList .vote-item [data-react="yes"]',   label: 'Bouton vote ❤️' },
        { sel: '#voteList .vote-item [data-react="maybe"]', label: 'Bouton vote 🤔' },
        { sel: '#voteList .vote-item [data-react="no"]',    label: 'Bouton vote ❌' },
      ]);
      expect(voteIssues, `Bug mobile (${device.name}) : ${voteIssues.join(' · ')}`).toEqual([]);

      const votes = await voteOnAllNames(pageB, ['yes', 'maybe', 'no', 'yes', 'maybe', 'yes']);
      const pid   = await pageB.evaluate(() => decideState.participantId);
      expect(Object.keys(votes).length).toBeGreaterThan(0);
      await pageB.waitForTimeout(2_000); // laisser les upserts partir
      await ctxB.close();

      // C. Thomas revient (nouveau contexte mobile, même email)
      const ctxC  = await newMobileContext(browser, device);
      const pageC = await ctxC.newPage();
      await joinCoupleVote(pageC, inviteUrl, agent('thomas'));
      await pageC.waitForTimeout(6_000);

      // Vérité terrain Supabase puis restitution UI stricte
      const decId    = new URL(inviteUrl).searchParams.get('invite');
      const decision = await fetchDecisionFromSupabase(pageC, decId);
      const stored   = decision?.votes?.[pid] || {};
      expect(Object.keys(stored).length, 'Prérequis : votes de Thomas dans Supabase').toBeGreaterThan(0);
      await verifyVotesSelected(pageC, stored, `Bug mobile (${device.name}) : votes non rechargés depuis Supabase`);

      console.log(`\n  📱 ${device.name} : Thomas revient, ${Object.keys(stored).length} votes restitués`);
      await ctxC.close();
    });

    // ── 8.x Alex sans code sur mobile + toast visible ──────────────────────────
    test(`[${device.name}] Alex sans code — vote inaccessible, toast d'erreur visible`, async ({ browser }) => {
      const ctx  = await newMobileContext(browser, device);
      const page = await ctx.newPage();
      await installToastRecorder(page);

      // Sans code : aucune interface de vote
      await page.goto('/');
      await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });
      await expect(
        page.locator('#decideOverlay'),
        `Bug mobile (${device.name}) : overlay de vote ouvert sans invitation`
      ).not.toHaveClass(/open/);
      expect(
        await page.locator('#voteList .vote-item').count(),
        `Bug mobile (${device.name}) : interface de vote accessible sans code`
      ).toBe(0);
      await assertNoHorizontalOverflow(page, `${device.name} accueil Alex`);

      // Code invalide : le message d'erreur doit avoir été émis…
      await page.goto('/?familyVote=dec_inexistant_mobile&lang=fr');
      await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });
      await page.waitForTimeout(5_000);
      const toasts = await page.evaluate(() => window.__nsToasts);
      expect(
        toasts.join(' | '),
        `Bug mobile (${device.name}) : aucun message d'erreur pour un code invalide`
      ).toMatch(/introuvable|expir|not.*found|expired/i);

      // …et le toast doit être VISIBLE dans le viewport mobile
      await page.evaluate(() => showToast('Test visibilité toast mobile'));
      const toastEl = page.locator('#toast.show');
      await expect(toastEl, `Bug mobile (${device.name}) : toast non affiché`).toBeVisible({ timeout: 3_000 });
      const box = await toastEl.boundingBox();
      const vp  = page.viewportSize();
      expect(box, `Bug mobile (${device.name}) : toast sans boundingBox`).toBeTruthy();
      expect(
        box.x >= -1 && box.x + box.width <= vp.width + 1 && box.y >= -1 && box.y + box.height <= vp.height + 1,
        `Bug mobile (${device.name}) : toast hors du viewport (x=${Math.round(box.x)}, y=${Math.round(box.y)}, ${Math.round(box.width)}×${Math.round(box.height)}, viewport=${vp.width}×${vp.height})`
      ).toBe(true);

      console.log(`\n  📱 ${device.name} : Alex bloqué proprement, toast visible dans le viewport`);
      await ctx.close();
    });

  }

});

// =============================================================================
// SCÉNARIO 9 — CHARGE : 50 agents votent en parallèle
// =============================================================================
const chargeState = { voteUrl: null, decisionId: null, dataJs: null, voters: [] };
const CHARGE_VOTERS = Array.from({ length: 50 }, (_, i) => ({ firstName: `Charge${i + 1}`, email: null }));

test.describe.serial('🚀 Scénario charge — 50 votants simultanés', () => {

  // ── 9.1 Créer la décision + mettre data.js en cache ─────────────────────────
  test('[Charge] Préparation : décision famille + cache data.js', async ({ browser }) => {
    const ctx  = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto('/');
    await seedFavorites(page, TEST_SELECTION);
    chargeState.voteUrl = await createFamilyDecision(page, {
      firstName: 'Capucine', email: 'ns-test-capucine@yopmail.com',
    });
    chargeState.decisionId = new URL(chargeState.voteUrl).searchParams.get('familyVote');
    expect(chargeState.voteUrl).toMatch(/\?familyVote=/);

    // Cache de data.js (2,7 Mo) : servi localement aux 50 contextes pour ne pas
    // saturer le réseau — le parsing JS reste intégral dans chaque page.
    const resp = await page.request.get('/data.js');
    chargeState.dataJs = await resp.body();
    expect(chargeState.dataJs.length, 'data.js doit être en cache').toBeGreaterThan(1_000_000);

    console.log(`\n  📎 Lien charge : ${chargeState.voteUrl} — data.js en cache (${(chargeState.dataJs.length / 1e6).toFixed(1)} Mo)`);
    await ctx.close();
  });

  // ── 9.2 Les 50 agents votent en parallèle ───────────────────────────────────
  test('[50 agents] Votent simultanément — chaque vote est chronométré', async ({ browser }) => {
    test.setTimeout(600_000);
    expect(chargeState.voteUrl).toBeTruthy();

    const reactionsFor = (i) => TEST_SELECTION.map((_, j) => ['yes', 'maybe', 'no'][(i + j) % 3]);

    const results = await Promise.all(CHARGE_VOTERS.map(async (voter, i) => {
      // Démarrage étalé sur ~7s pour éviter l'avalanche de chargements,
      // les 50 contextes restent ensuite actifs et votent simultanément.
      await new Promise((r) => setTimeout(r, i * 150));

      const ctx = await browser.newContext();
      try {
        // data.js servi depuis le cache ; images/fonts/analytics coupés
        await ctx.route('**/data.js*', (route) => route.fulfill({
          status: 200, contentType: 'application/javascript', body: chargeState.dataJs,
        }));
        await ctx.route(/\.(png|jpe?g|webp|svg|woff2?)(\?|$)|plausible/, (route) => route.abort());

        const page = await ctx.newPage();
        await joinFamilyVote(page, chargeState.voteUrl, voter);

        // Chronométrage : on enveloppe saveVote() pour mesurer chaque upsert
        await page.evaluate(() => {
          window.__voteTimes = [];
          const orig = saveVote;
          saveVote = async (...args) => {
            const t0 = performance.now();
            await orig(...args);
            window.__voteTimes.push(performance.now() - t0);
          };
        });

        const votes = await voteOnAllNames(page, reactionsFor(i));
        // Attendre que tous les upserts soient terminés (mesures complètes)
        await page.waitForFunction(
          (n) => window.__voteTimes.length >= n,
          Object.keys(votes).length,
          { timeout: 30_000 }
        );
        const times = await page.evaluate(() => window.__voteTimes);
        const pid   = await page.evaluate(() => decideState.participantId);
        return { firstName: voter.firstName, pid, votes, times };
      } catch (err) {
        return { firstName: voter.firstName, error: err.message?.split('\n')[0] || String(err) };
      } finally {
        await ctx.close();
      }
    }));

    const failures = results.filter((r) => r.error);
    expect(
      failures.map((f) => `${f.firstName} : ${f.error}`),
      `Bug : ${failures.length}/50 agents n'ont pas pu voter`
    ).toEqual([]);

    chargeState.voters = results;
    const totalVotes = results.reduce((s, r) => s + Object.keys(r.votes).length, 0);
    console.log(`\n  🚀 50 agents ont voté en parallèle — ${totalVotes} votes émis`);
  });

  // ── 9.3 STRICT : 0 perdu, 0 doublon, temps moyen < 3s ───────────────────────
  test('[Vérification] 300 votes : 0 perdu, 0 doublon, temps moyen < 3s', async ({ browser }) => {
    test.setTimeout(300_000);
    expect(chargeState.voters.length, 'Les 50 votants doivent avoir été capturés').toBe(50);

    // Attendre 10s après le dernier vote (consigne)
    await new Promise((r) => setTimeout(r, 10_000));

    const ctx  = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/');
    await page.waitForSelector('#espaceBtn:not([disabled])', { timeout: 60_000 });

    // Lecture BRUTE de la table votes (les doublons seraient écrasés par
    // la reconstruction objet de getDecision — il faut les lignes réelles)
    const raw = await page.evaluate(async (id) => {
      const { data, error } = await _sb.from('votes')
        .select('participant_id,name,reaction')
        .eq('decision_id', id)
        .limit(2000);
      return { rows: data || [], error: error?.message ?? null };
    }, chargeState.decisionId);
    expect(raw.error, `Lecture Supabase impossible : ${raw.error}`).toBeNull();

    // 1. Aucun vote perdu (chaque vote émis présent avec la bonne réaction)
    const byPidName = new Map();
    for (const row of raw.rows) {
      const key = `${row.participant_id}|${row.name}`;
      byPidName.set(key, (byPidName.get(key) || []).concat(row.reaction));
    }
    const lost = [];
    let expected = 0;
    for (const voter of chargeState.voters) {
      for (const [name, reaction] of Object.entries(voter.votes)) {
        expected++;
        const recorded = byPidName.get(`${voter.pid}|${name}`) || [];
        if (!recorded.includes(reaction)) {
          lost.push(`${voter.firstName} → "${name}" : attendu "${reaction}", trouvé ${JSON.stringify(recorded)}`);
        }
      }
    }

    // 2. Aucun doublon (même participantId + même prénom = 1 seule ligne)
    const duplicates = [...byPidName.entries()]
      .filter(([, reactions]) => reactions.length > 1)
      .map(([key, reactions]) => `${key} : ${reactions.length} lignes (${reactions.join(', ')})`);

    // 3. Temps de réponse
    const allTimes = chargeState.voters.flatMap((v) => v.times || []);
    const avg = allTimes.reduce((s, t) => s + t, 0) / allTimes.length;
    const min = Math.min(...allTimes);
    const max = Math.max(...allTimes);

    // ── Rapport ──
    console.log('\n  ══════════ RAPPORT DE CHARGE ══════════');
    console.log(`  Votes attendus : ${expected}`);
    console.log(`  Votes reçus    : ${raw.rows.length}`);
    console.log(`  Votes perdus   : ${lost.length}`);
    console.log(`  Doublons       : ${duplicates.length}`);
    console.log(`  Temps upsert   : min ${min.toFixed(0)}ms · moyen ${avg.toFixed(0)}ms · max ${max.toFixed(0)}ms`);
    console.log('  ═══════════════════════════════════════');

    // ── Assertions STRICTES ──
    expect(lost, `Bug : ${lost.length} vote(s) perdu(s) sous charge (50 agents)`).toEqual([]);
    expect(duplicates, `Bug : ${duplicates.length} doublon(s) de vote détecté(s)`).toEqual([]);
    expect(
      avg,
      `Bug : temps de réponse moyen ${avg.toFixed(0)}ms > 3000ms sous charge`
    ).toBeLessThan(3_000);

    await ctx.close();
  });

});
