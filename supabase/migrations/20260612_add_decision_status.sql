-- Migration : clôture de vote
-- À exécuter dans l'éditeur SQL Supabase :
-- https://app.supabase.com/project/agpyqijxzcwesphoxlww/sql/new

-- 1. Colonne status (idempotent)
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'open';

-- 2. RLS : le créateur (authentifié ou anonyme) peut passer son vote à 'closed'
--    Règle : creator_id IS NULL = créateur sans compte Supabase Auth (localStorage uniquement)
CREATE POLICY "creator_can_close_decision" ON decisions
FOR UPDATE TO anon, authenticated
USING (creator_id IS NULL OR creator_id = auth.uid())
WITH CHECK (status IN ('open', 'closed'));

-- 3. Trigger : bloquer les votes sur une décision clôturée côté base
--    Impossible à contourner via console JS ou devtools réseau.
CREATE OR REPLACE FUNCTION check_decision_open_before_vote()
RETURNS TRIGGER AS $$
DECLARE dec_status TEXT;
BEGIN
  SELECT status INTO dec_status FROM decisions WHERE id = NEW.decision_id;
  IF dec_status = 'closed' THEN
    RAISE EXCEPTION 'decision_closed: vote rejected — decision % is closed', NEW.decision_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS votes_block_on_closed_decision ON votes;
CREATE TRIGGER votes_block_on_closed_decision
  BEFORE INSERT OR UPDATE ON votes
  FOR EACH ROW EXECUTE FUNCTION check_decision_open_before_vote();
