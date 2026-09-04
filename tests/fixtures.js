'use strict';

/**
 * Définition des 10 agents de test.
 *
 * Rôles famille  : créateur, conjoint, grand-parent, enfant, oncle/tante
 * Scénarios      : couple, famille, double-vote
 * email          : null pour les votants famille (prénom seul suffit)
 */
const AGENTS = [
  // ── Scénario couple ────────────────────────────────────────────────────────
  {
    id: 'sophie',
    firstName: 'Sophie',
    email: 'ns-test-sophie@namespark.baby',
    role: 'maman (créatrice)',
    scenario: 'couple',
    isCreator: true,
  },
  {
    id: 'thomas',
    firstName: 'Thomas',
    email: 'ns-test-thomas@namespark.baby',
    role: 'papa (partenaire)',
    scenario: 'couple',
    isCreator: false,
  },

  // ── Scénario famille ───────────────────────────────────────────────────────
  {
    id: 'marie',
    firstName: 'Marie',
    email: 'ns-test-marie@namespark.baby',
    role: 'maman (créatrice famille)',
    scenario: 'famille',
    isCreator: true,
  },
  {
    id: 'madeleine',
    firstName: 'Madeleine',
    email: null,          // votant famille : prénom seul
    role: 'grand-mère',
    scenario: 'famille',
    isCreator: false,
  },
  {
    id: 'laurent',
    firstName: 'Laurent',
    email: null,
    role: 'père',
    scenario: 'famille',
    isCreator: false,
  },
  {
    id: 'lucie',
    firstName: 'Lucie',
    email: null,
    role: 'grande sœur',
    scenario: 'famille',
    isCreator: false,
  },
  {
    id: 'rene',
    firstName: 'René',
    email: null,
    role: 'oncle',
    scenario: 'famille',
    isCreator: false,
  },
  {
    id: 'papy',
    firstName: 'Papy',
    email: null,
    role: 'grand-père',
    scenario: 'famille',
    isCreator: false,
  },

  // ── Scénario double vote ───────────────────────────────────────────────────
  {
    id: 'elodie',
    firstName: 'Élodie',
    email: 'ns-test-elodie@namespark.baby',
    role: 'tester (double-vote)',
    scenario: 'double-vote',
    isCreator: true,
  },

  // ── Scénario re-connexion (email déjà existant) ───────────────────────────
  {
    id: 'sophie-retour',
    firstName: 'Sophie',
    email: 'ns-test-sophie@namespark.baby', // même email que sophie → doit détecter "compte trouvé"
    role: 'utilisatrice connue (reconnexion)',
    scenario: 'auth',
    isCreator: false,
  },

  // ── Scénario sécurité (accès sans invitation) ─────────────────────────────
  {
    id: 'alex',
    firstName: 'Alex',
    email: 'ns-test-alex@namespark.baby',
    role: 'invité sans code famille',
    scenario: 'securite',
    isCreator: false,
  },

  // ── Scénario vote parallèle (créatrice) ───────────────────────────────────
  {
    id: 'nadia',
    firstName: 'Nadia',
    email: 'ns-test-nadia@namespark.baby',
    role: 'maman (créatrice — test parallèle)',
    scenario: 'parallele',
    isCreator: true,
  },
];

/** 8 votants famille pour le test de votes simultanés */
const PARALLEL_VOTERS = Array.from({ length: 8 }, (_, i) => ({
  id: `parallel-${i + 1}`,
  firstName: `Votant${i + 1}`,
  email: null,
  role: `votant parallèle ${i + 1}`,
  scenario: 'parallele',
  isCreator: false,
}));

/** Prénoms pré-sélectionnés injectés en localStorage pour les créateurs */
const TEST_SELECTION = ['Emma', 'Léa', 'Sofia', 'Inès', 'Camille', 'Chloé'];

module.exports = { AGENTS, PARALLEL_VOTERS, TEST_SELECTION };
