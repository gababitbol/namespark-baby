# NameSpark Baby 👶✶

Générateur de prénoms bébé pensé pour les futurs parents, avec une fonctionnalité
différenciante : le vote à deux (et en famille). Chacun génère, aime, puis vote de
son côté sur les prénoms partagés — l'app révèle ensuite ceux qui font l'unanimité.

Site en production : **[namespark.baby](https://namespark.baby)**

## Ouvrir le site en local
Aucune installation ni build requis : le site est du HTML/CSS/JS statique.
Servez le dossier avec n'importe quel serveur statique, par exemple :
```
python3 -m http.server 8124
```
Ouvrir `index.html` en double-clic fonctionne aussi pour l'essentiel, mais les appels
`fetch()` vers `/api/*` (Supabase, emails) nécessitent un vrai serveur — utilisez
`vercel dev` pour tester les fonctions serverless en local.

## Structure
```
namespark-baby/
├── index.html          # Landing + générateur + FAQ + vote couple/famille + Mon espace
├── styles.css           # Design (crème / brun / doré), responsive
├── app.js               # Toute la logique front : i18n FR/EN, générateur, vote,
│                         #   compte à rebours grossesse, Mon espace, admin login
├── storage.js            # Couche d'accès données — localStorage + Supabase.
│                          #   app.js y passe presque toujours (exception connue :
│                          #   le compte à rebours grossesse touche localStorage direct).
├── data.js               # Base locale de ~10 000 prénoms (génération sans API)
├── 404.html               # Page d'erreur personnalisée (vraie réponse HTTP 404)
├── admin.html / admin.js  # Dashboard (leads, abonnés) — protégé par mot de passe serveur
├── mentions-legales.html, privacy.html, terms.html, unsubscribe.html
│
├── prenom/                # ~10 000 pages statiques, une par prénom — SEO
│                          #   (signification, origine, popularité, prénoms proches, FAQ)
├── seo/                   # 6 pages de catégorie (prénom garçon/fille/hébreu/rare/court)
│
├── api/                   # Fonctions serverless Vercel
│   ├── generate.js         #   génération de prénoms (mode démo local, IA prête mais désactivée)
│   ├── verify-email.js     #   validation email : domaines jetables + vérif MX
│   ├── save-list.js        #   envoi de la sélection par email (Resend)
│   ├── subscribe-newsletter.js, newsletter.js, unsubscribe.js
│   ├── notify-vote.js      #   notifie le créateur quand son partenaire a voté
│   ├── admin-login.js, subscribers-admin.js, leads-admin.js
│   ├── keepalive.js        #   ping quotidien (cron) pour empêcher la pause auto de Supabase
│   └── track.js
│
├── supabase/migrations/   # Migrations SQL (décisions de vote, abonnés, RLS, grossesse…)
├── tools/                 # Scripts de génération : build-seo-pages.js régénère /prenom/
│                          #   à partir de data.js — à relancer après tout enrichissement
├── tests/                 # Suite Playwright (33 scénarios E2E contre la prod)
└── vercel.json            # cleanUrls, redirections /vote & /family, cron keepalive
```

## Fonctionnalités principales

- **Générateur** de prénoms par filtres (genre, origine, style, signification, longueur,
  compatibilité avec le nom de famille) — génération locale instantanée, sans API.
- **Vote à deux** : partagez un lien, votez chacun de votre côté, découvrez vos matchs.
- **Vote en famille** : plusieurs votants, classement en temps réel, sans création de compte
  (prénom seul suffit — l'email n'est jamais obligatoire pour voter).
- **Compte à rebours grossesse** (facultatif) : la semaine déclarée + sa date sont stockées,
  la semaine affichée avance donc toute seule d'une visite à l'autre.
- **Mon espace** : retrouver ses favoris d'une session à l'autre via un email facultatif.
- **~10 000 pages SEO** par prénom, générées statiquement (voir `tools/build-seo-pages.js`).
- **Dashboard admin** (leads, abonnés) protégé par mot de passe côté serveur.

## Génération des prénoms — mode démo (actuel)
Le bouton **Générer** fonctionne **sans aucune API** : la génération se fait localement à
partir de `data.js` (voir `generateDemo()` dans `app.js`). Les filtres sont respectés au
mieux via un système de score.

### Passer à la génération par IA (optionnel, plus tard)
1. `npm i @anthropic-ai/sdk`
2. Sur Vercel, définir `ANTHROPIC_API_KEY` (Project Settings → Environment Variables) —
   jamais dans le frontend.
3. Dé-commenter le bloc Anthropic dans `api/generate.js`.
4. Dans `app.js`, remplacer `generateDemo(...)` par `await generateViaBackend(...)`.

> 🔒 Aucune clé API n'est présente dans le frontend. Le navigateur appelle uniquement les
> routes `/api/*`, et les clés restent côté serveur.

## Variables d'environnement (Vercel)

| Variable | Sert à |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Lecture/écriture des décisions de vote, abonnés, leads |
| `RESEND_API_KEY` | Envoi des emails (sélection, notifications de vote, newsletter) |
| `ADMIN_PASSWORD`, `ADMIN_API_TOKEN` | Authentification du dashboard admin |
| `UNSUBSCRIBE_SECRET` | Signature des liens de désabonnement |
| `CRON_SECRET` *(optionnel)* | Protège `/api/keepalive` contre les appels externes |
| `SUPABASE_ACCESS_TOKEN` *(optionnel)* | Permet à `/api/keepalive` de relancer le projet Supabase s'il est en pause |
| `ANTHROPIC_API_KEY` *(optionnel, désactivé)* | Génération de prénoms par IA — voir ci-dessus |

Côté client, l'URL et la clé anonyme Supabase sont directement dans `storage.js`
(clé publique, prévue pour être exposée — la clé service-role, elle, ne l'est jamais).

## Déploiement
Le site est déployé sur **Vercel**, connecté au dépôt GitHub — chaque push sur `main`
redéploie automatiquement. Un cron Vercel (`vercel.json`) appelle `/api/keepalive` chaque
jour pour empêcher Supabase (plan gratuit) de mettre le projet en pause après 7 jours
d'inactivité.

## Tests
```
cd tests && npm test
```
Suite Playwright (33 scénarios) qui s'exécute contre **namespark.baby en production**
(voir `tests/playwright.config.js`). Les comptes de test utilisent le domaine
`@namespark.baby` (préfixe `ns-test-`) pour passer le filtre anti-emails-jetables tout en
restant identifiables et faciles à nettoyer côté Supabase.
