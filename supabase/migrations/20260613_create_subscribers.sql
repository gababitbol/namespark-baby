-- Migration : table subscribers
-- À exécuter dans l'éditeur SQL Supabase :
-- https://app.supabase.com/project/agpyqijxzcwesphoxlww/sql/new

-- ══════════════════════════════════════════════════════════════
-- 1. TABLE
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS subscribers (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        UNIQUE NOT NULL,
  first_name TEXT,
  last_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ══════════════════════════════════════════════════════════════
-- 2. TRIGGER : updated_at automatique
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscribers_set_updated_at ON subscribers;
CREATE TRIGGER subscribers_set_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ══════════════════════════════════════════════════════════════
-- 3. TRIGGER : ne jamais écraser une valeur existante par NULL
--    Si l'upsert envoie first_name=null alors qu'il existe déjà,
--    on conserve l'ancienne valeur (COALESCE).
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION subscribers_coalesce_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.first_name := COALESCE(NULLIF(TRIM(COALESCE(NEW.first_name, '')), ''), OLD.first_name);
  NEW.last_name  := COALESCE(NULLIF(TRIM(COALESCE(NEW.last_name,  '')), ''), OLD.last_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscribers_no_null_overwrite ON subscribers;
CREATE TRIGGER subscribers_no_null_overwrite
  BEFORE UPDATE ON subscribers
  FOR EACH ROW EXECUTE FUNCTION subscribers_coalesce_fields();

-- ══════════════════════════════════════════════════════════════
-- 4. RLS
--    • Lecture : service_role uniquement (panneau admin via API)
--    • Écriture : anon peut INSERT/UPDATE (app côté client)
--    Aucune policy SELECT publique → données invisibles via clé anon
-- ══════════════════════════════════════════════════════════════
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_can_insert_subscriber"  ON subscribers;
CREATE POLICY "anon_can_insert_subscriber" ON subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_can_update_subscriber" ON subscribers;
CREATE POLICY "anon_can_update_subscriber" ON subscribers
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- SELECT : aucune policy publique → seul service_role peut lire (bypass RLS)
-- Le panneau admin passe par /api/subscribers-admin (clé service_role côté serveur).
