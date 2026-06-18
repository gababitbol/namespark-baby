-- =============================================================
-- NameSpark Baby — Verrouillage RLS de `leads` et `users`
-- -------------------------------------------------------------
-- PROBLÈME corrigé : la clé `anon` (publique, livrée dans storage.js à chaque
-- visiteur) pouvait lire TOUTE la table `leads` et `users` →
--   GET /rest/v1/leads?select=*   renvoyait tous les emails.
-- C'est une fuite de données personnelles (RGPD).
--
-- CORRECTIF : la clé anon peut INSÉRER / METTRE À JOUR (le site enregistre
-- leads & users en upsert) mais NE PEUT PLUS LIRE ces tables.
-- Les lectures admin passent par les API service_role :
--   /api/leads-admin  et  /api/subscribers-admin
-- (la clé service_role contourne RLS et n'est jamais exposée au client).
--
-- À EXÉCUTER une fois dans le SQL Editor Supabase (idempotent).
-- =============================================================

-- ── leads ────────────────────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads_anon_select" ON public.leads;
DROP POLICY IF EXISTS "leads_anon_insert" ON public.leads;
DROP POLICY IF EXISTS "leads_anon_update" ON public.leads;

-- Écriture autorisée pour l'app publique (upsert = insert + update)
CREATE POLICY "leads_anon_insert" ON public.leads
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "leads_anon_update" ON public.leads
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
-- AUCUNE policy SELECT pour anon ⇒ lecture publique refusée.

-- ── users ────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_anon_select" ON public.users;
DROP POLICY IF EXISTS "users_anon_insert" ON public.users;
DROP POLICY IF EXISTS "users_anon_update" ON public.users;

CREATE POLICY "users_anon_insert" ON public.users
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "users_anon_update" ON public.users
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
-- AUCUNE policy SELECT pour anon ⇒ lecture publique refusée.

-- =============================================================
-- NOTE — tables decisions / participants / votes :
-- Elles restent lisibles par anon À DESSEIN : le partenaire qui vote depuis
-- un autre appareil doit pouvoir lire la décision et écrire ses votes, et le
-- créateur doit relire les votes. La sécurité repose sur l'imprévisibilité de
-- l'ID de décision (cf. 20260612_add_decision_status.sql).
-- Risque résiduel : `participants` contient des emails ; quelqu'un qui
-- devinerait un ID de décision pourrait les lire. Mitigation future possible :
-- jeton d'accès par décision plutôt que l'ID seul. Hors périmètre de ce correctif.
-- =============================================================
