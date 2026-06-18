-- =============================================================
-- NameSpark Baby — Verrouillage RLS de `leads` et `users`
-- -------------------------------------------------------------
-- PROBLÈME corrigé : la clé `anon` (publique, livrée dans storage.js à chaque
-- visiteur) pouvait lire TOUTE la table `leads` et `users` via PostgREST →
-- tous les emails exposés (fuite RGPD).
--
-- ÉTAT FINAL VISÉ : la clé anon n'a AUCUN accès (ni lecture ni écriture) à
-- `leads` / `users`. Toutes les écritures passent par l'endpoint serveur
-- /api/track (clé service_role, qui contourne RLS et n'est jamais exposée au
-- client). Les lectures admin passent par /api/leads-admin (service_role).
--
-- À EXÉCUTER une fois dans le SQL Editor Supabase (idempotent, sans bloc DO).
-- =============================================================

-- ── leads : RLS activé, aucune policy anon ───────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "leads_anon_select" ON public.leads;
DROP POLICY IF EXISTS "leads_anon_insert" ON public.leads;
DROP POLICY IF EXISTS "leads_anon_update" ON public.leads;
-- (aucune policy recréée pour anon ⇒ lecture ET écriture anon refusées)

-- ── users : RLS activé, aucune policy anon ───────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_anon_select" ON public.users;
DROP POLICY IF EXISTS "users_anon_insert" ON public.users;
DROP POLICY IF EXISTS "users_anon_update" ON public.users;

-- =============================================================
-- NOTE — tables decisions / participants / votes :
-- Elles restent lisibles/écrivables par anon À DESSEIN : le partenaire qui vote
-- depuis un autre appareil doit pouvoir lire la décision et écrire ses votes, et
-- le créateur doit relire les votes. La sécurité repose sur l'imprévisibilité de
-- l'ID de décision (cf. 20260612_add_decision_status.sql).
-- Risque résiduel : `participants` contient des emails lisibles si on devine un
-- ID de décision. Mitigation future possible : jeton d'accès par décision.
-- =============================================================
