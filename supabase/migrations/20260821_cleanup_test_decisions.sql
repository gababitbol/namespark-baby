-- Nettoyage des décisions de test créées lors des vérifications
-- À exécuter dans l'éditeur SQL Supabase :
-- https://app.supabase.com/project/agpyqijxzcwesphoxlww/sql/new
--
-- Contexte : la vérification du parcours « voter à deux » a créé de
-- vraies décisions en base (emails en @mailtest.com). Elles sont
-- inoffensives mais polluent les statistiques.
--
-- Ordre imposé par les clés étrangères : votes → participants → decisions.

-- ══════════════════════════════════════════════════════════════
-- 1. APERÇU AVANT SUPPRESSION (à lire d'abord)
-- ══════════════════════════════════════════════════════════════
SELECT d.id, d.created_at, p.email
FROM decisions d
JOIN participants p ON p.decision_id = d.id
WHERE p.email ILIKE '%@mailtest.com'
   OR p.email ILIKE 'ns-test-%'
ORDER BY d.created_at DESC;

-- ══════════════════════════════════════════════════════════════
-- 2. SUPPRESSION
--    Sélectionne toutes les décisions ayant au moins un
--    participant de test, puis nettoie les 3 tables dans l'ordre.
-- ══════════════════════════════════════════════════════════════
WITH test_decisions AS (
  SELECT DISTINCT decision_id AS id
  FROM participants
  WHERE email ILIKE '%@mailtest.com'
     OR email ILIKE 'ns-test-%'
)
DELETE FROM votes
WHERE decision_id IN (SELECT id FROM test_decisions);

WITH test_decisions AS (
  SELECT DISTINCT decision_id AS id
  FROM participants
  WHERE email ILIKE '%@mailtest.com'
     OR email ILIKE 'ns-test-%'
)
DELETE FROM participants
WHERE decision_id IN (SELECT id FROM test_decisions);

-- Les décisions devenues orphelines (plus aucun participant)
DELETE FROM decisions d
WHERE NOT EXISTS (
  SELECT 1 FROM participants p WHERE p.decision_id = d.id
);

-- ══════════════════════════════════════════════════════════════
-- 3. NETTOYAGE DES EMAILS DE TEST (subscribers / leads)
-- ══════════════════════════════════════════════════════════════
DELETE FROM subscribers
WHERE email ILIKE '%@mailtest.com' OR email ILIKE 'ns-test-%';

DELETE FROM leads
WHERE email ILIKE '%@mailtest.com' OR email ILIKE 'ns-test-%';

-- ══════════════════════════════════════════════════════════════
-- VÉRIFICATION FINALE — doit renvoyer 0 partout
-- ══════════════════════════════════════════════════════════════
SELECT 'participants de test' AS quoi, COUNT(*) AS restants
FROM participants WHERE email ILIKE '%@mailtest.com' OR email ILIKE 'ns-test-%'
UNION ALL
SELECT 'decisions orphelines', COUNT(*)
FROM decisions d WHERE NOT EXISTS (SELECT 1 FROM participants p WHERE p.decision_id = d.id)
UNION ALL
SELECT 'subscribers de test', COUNT(*)
FROM subscribers WHERE email ILIKE '%@mailtest.com' OR email ILIKE 'ns-test-%'
UNION ALL
SELECT 'leads de test', COUNT(*)
FROM leads WHERE email ILIKE '%@mailtest.com' OR email ILIKE 'ns-test-%';
