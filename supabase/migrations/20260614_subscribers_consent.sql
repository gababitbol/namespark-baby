-- Migration : colonne consent_terms dans subscribers
-- À exécuter dans l'éditeur SQL Supabase :
-- https://app.supabase.com/project/agpyqijxzcwesphoxlww/sql/new

-- La ligne de consentement est visible sous chaque bouton d'inscription.
-- Continuer = accepter les CGU + politique de confidentialité.
-- La colonne passe à true automatiquement à l'upsert.
ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS consent_terms BOOLEAN NOT NULL DEFAULT true;
