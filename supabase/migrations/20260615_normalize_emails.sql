-- Normalisation des emails en minuscules + dédoublonnage post-normalisation
-- À exécuter dans l'éditeur SQL Supabase :
-- https://app.supabase.com/project/agpyqijxzcwesphoxlww/sql/new
-- Ordre : normaliser → dédoublonner → vérifier

-- ══════════════════════════════════════════════════════════════
-- 1. NORMALISER EN MINUSCULES
-- ══════════════════════════════════════════════════════════════
UPDATE subscribers SET email = LOWER(email) WHERE email <> LOWER(email);
UPDATE leads        SET email = LOWER(email) WHERE email <> LOWER(email);

-- ══════════════════════════════════════════════════════════════
-- 2. DÉDOUBLONNER subscribers après normalisation
--    Deux emails devenus identiques après LOWER → garder le plus complet
-- ══════════════════════════════════════════════════════════════
WITH best AS (
  SELECT DISTINCT ON (LOWER(email))
    id
  FROM subscribers
  ORDER BY
    LOWER(email),
    (first_name IS NOT NULL AND first_name <> '')::int DESC,
    (last_name  IS NOT NULL AND last_name  <> '')::int DESC,
    created_at ASC
)
DELETE FROM subscribers
WHERE id NOT IN (SELECT id FROM best);

-- ══════════════════════════════════════════════════════════════
-- 3. DÉDOUBLONNER leads après normalisation
-- ══════════════════════════════════════════════════════════════
WITH best AS (
  SELECT DISTINCT ON (LOWER(email))
    id
  FROM leads
  ORDER BY
    LOWER(email),
    (first_name IS NOT NULL AND first_name <> '')::int DESC,
    (surname    IS NOT NULL AND surname    <> '')::int DESC,
    created_at ASC
)
DELETE FROM leads
WHERE id NOT IN (SELECT id FROM best);

-- ══════════════════════════════════════════════════════════════
-- 4. CONTRAINTE : empêcher les futures casses mixtes
--    Ajoute une contrainte CHECK si elle n'existe pas encore
-- ══════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'subscribers'::regclass AND conname = 'subscribers_email_lowercase'
  ) THEN
    ALTER TABLE subscribers
      ADD CONSTRAINT subscribers_email_lowercase CHECK (email = LOWER(email));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'leads'::regclass AND conname = 'leads_email_lowercase'
  ) THEN
    ALTER TABLE leads
      ADD CONSTRAINT leads_email_lowercase CHECK (email = LOWER(email));
  END IF;
END $$;

-- ══════════════════════════════════════════════════════════════
-- VÉRIFICATION FINALE
-- ══════════════════════════════════════════════════════════════
SELECT 'subscribers' AS table_name, COUNT(*) AS lignes,
       COUNT(*) FILTER (WHERE email <> LOWER(email)) AS emails_non_normalises
FROM subscribers
UNION ALL
SELECT 'leads', COUNT(*),
       COUNT(*) FILTER (WHERE email <> LOWER(email))
FROM leads;
