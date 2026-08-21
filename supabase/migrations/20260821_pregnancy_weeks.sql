-- Stade de grossesse déclaré par l'abonné(e)
-- À exécuter dans l'éditeur SQL Supabase :
-- https://app.supabase.com/project/agpyqijxzcwesphoxlww/sql/new
--
-- On stocke la semaine déclarée ET la date de déclaration : la semaine
-- réelle se recalcule ensuite toute seule (semaine + temps écoulé),
-- sans redemander l'info à la personne.
-- Valeurs : '4'..'40' (semaine d'aménorrhée) ou 'born' (bébé déjà né).

ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS pregnancy_weeks       TEXT,
  ADD COLUMN IF NOT EXISTS pregnancy_declared_at TIMESTAMPTZ;

-- Garde-fou : refuse toute valeur hors format attendu
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'subscribers'::regclass
      AND conname  = 'subscribers_pregnancy_weeks_valid'
  ) THEN
    ALTER TABLE subscribers
      ADD CONSTRAINT subscribers_pregnancy_weeks_valid
      CHECK (
        pregnancy_weeks IS NULL
        OR pregnancy_weeks = 'born'
        OR (pregnancy_weeks ~ '^\d{1,2}$' AND pregnancy_weeks::int BETWEEN 4 AND 40)
      );
  END IF;
END $$;

-- Vérification
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'subscribers'
  AND column_name IN ('pregnancy_weeks', 'pregnancy_declared_at');
