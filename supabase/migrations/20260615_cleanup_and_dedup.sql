-- Nettoyage + dédoublonnage de subscribers et leads
-- À exécuter dans l'éditeur SQL Supabase :
-- https://app.supabase.com/project/agpyqijxzcwesphoxlww/sql/new
-- Ordre important : supprimer les tests → dédoublonner → backfill → migration colonne

-- ══════════════════════════════════════════════════════════════
-- 1. SUPPRIMER LES EMAILS DE TEST PLAYWRIGHT
-- ══════════════════════════════════════════════════════════════
DELETE FROM subscribers
WHERE email ILIKE 'ns-test-%'
   OR email ILIKE '%mailtest.com%';

DELETE FROM leads
WHERE email ILIKE 'ns-test-%'
   OR email ILIKE '%mailtest.com%';

-- ══════════════════════════════════════════════════════════════
-- 2. DÉDOUBLONNER leads
--    Garde la ligne la plus complète (prénom > pas de prénom,
--    puis nom de famille, puis la plus ancienne)
-- ══════════════════════════════════════════════════════════════
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY email
           ORDER BY
             (first_name IS NOT NULL AND first_name <> '')::int DESC,
             (surname    IS NOT NULL AND surname    <> '')::int DESC,
             created_at ASC
         ) AS rn
  FROM leads
)
DELETE FROM leads WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- ══════════════════════════════════════════════════════════════
-- 3. DÉDOUBLONNER subscribers (idem)
-- ══════════════════════════════════════════════════════════════
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY email
           ORDER BY
             (first_name IS NOT NULL AND first_name <> '')::int DESC,
             (last_name  IS NOT NULL AND last_name  <> '')::int DESC,
             created_at ASC
         ) AS rn
  FROM subscribers
)
DELETE FROM subscribers WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- ══════════════════════════════════════════════════════════════
-- 4. CONTRAINTE UNIQUE sur leads.email (si absente)
--    Requise pour que l'upsert ON CONFLICT (email) fonctionne
-- ══════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'leads'::regclass
      AND contype IN ('u', 'p')
      AND array_to_string(conkey, ',') = (
        SELECT array_to_string(ARRAY[attnum::text], ',')
        FROM pg_attribute
        WHERE attrelid = 'leads'::regclass AND attname = 'email'
      )
  ) THEN
    ALTER TABLE leads ADD CONSTRAINT leads_email_key UNIQUE (email);
  END IF;
END $$;

-- ══════════════════════════════════════════════════════════════
-- 5. BACKFILL : copie tous les vrais leads → subscribers
--    Le ON CONFLICT DO UPDATE applique le COALESCE manuellement
--    car le trigger COALESCE ne se déclenche que sur UPDATE (pas INSERT)
-- ══════════════════════════════════════════════════════════════
INSERT INTO subscribers (email, first_name, last_name)
SELECT
  email,
  NULLIF(TRIM(COALESCE(first_name, '')), '') AS first_name,
  NULLIF(TRIM(COALESCE(surname,    '')), '') AS last_name
FROM leads
WHERE email NOT ILIKE 'ns-test-%'
  AND email NOT ILIKE '%mailtest.com%'
ON CONFLICT (email) DO UPDATE
  SET first_name = COALESCE(
        NULLIF(TRIM(COALESCE(EXCLUDED.first_name, '')), ''),
        subscribers.first_name
      ),
      last_name  = COALESCE(
        NULLIF(TRIM(COALESCE(EXCLUDED.last_name, '')), ''),
        subscribers.last_name
      );

-- ══════════════════════════════════════════════════════════════
-- 6. COLONNE consent_terms (si pas encore ajoutée)
-- ══════════════════════════════════════════════════════════════
ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS consent_terms BOOLEAN NOT NULL DEFAULT true;

-- ══════════════════════════════════════════════════════════════
-- VÉRIFICATION FINALE
-- ══════════════════════════════════════════════════════════════
SELECT 'subscribers' AS table_name, COUNT(*) AS lignes FROM subscribers
UNION ALL
SELECT 'leads',                      COUNT(*)          FROM leads;
