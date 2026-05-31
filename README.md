# NameSpark Baby 👶✶

Générateur de prénoms bébé spécialisé, pensé pour les futurs parents.

## Ouvrir le site
Aucune installation requise : ouvrez simplement **`index.html`** dans un navigateur.

## Structure
```
namespark-baby/
├── index.html      # Landing + générateur + comment ça marche + FAQ + nav
├── styles.css      # Design premium minimaliste + animations
├── app.js          # i18n FR/EN, navigation, animations, génération MODE DÉMO
├── data.js         # Liste locale de prénoms (mode démo, sans API)
├── api/
│   └── generate.js # Fonction backend Vercel SÉCURISÉE (préparée, non branchée)
├── seo/            # Pages SEO (garçon, fille, hébreu, rare, court, force)
└── vercel.json     # URLs propres pour les pages SEO
```

## Mode démo (actuel)
Le bouton **Générer** et **« Voir des prénoms similaires »** fonctionnent **sans aucune API** :
la génération se fait localement à partir de `data.js` (voir `generateDemo()` et
`getSimilarDemo()` dans `app.js`). Les filtres (genre, origine, style, signification,
première lettre, longueur, nom de famille) sont respectés au mieux via un système de score.

## Passer à la génération par IA (plus tard)
1. `npm i @anthropic-ai/sdk`
2. Déployer sur Vercel et définir la variable d'environnement `ANTHROPIC_API_KEY`
   (Project Settings → Environment Variables) — **jamais dans le frontend**.
3. Dé-commenter le bloc Anthropic dans `api/generate.js`.
4. Dans `app.js`, remplacer `generateDemo(...)` par `await generateViaBackend(...)`.

> 🔒 Aucune clé API n'est présente dans le frontend. Le navigateur appelle uniquement
> `POST /api/generate`, et la clé reste côté serveur.
