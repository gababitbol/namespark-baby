# NameSpark Baby — Document de conception : unification de l'architecture de données

> Statut : **proposition à valider**. Aucun code modifié.
> Objectif : une seule source de vérité, un seul moteur de matching, un seul concept de
> sélection, prêt à brancher sur Supabase sans refonte.

---

## 1. Audit du flux de données actuel

### 1.1 État en mémoire (app.js)

| Variable | Contenu | Rôle |
|---|---|---|
| `lang` | `"fr" \| "en"` | langue UI |
| `filters` | `{ gender, length }` | critères du générateur |
| `lastResults` / `lastTitle` | derniers prénoms générés | re-render |
| `lastSurname` | string | nom de famille (score compat.) |
| **`favorites`** | **`Set<string>`** | **LA sélection utilisateur (pilote l'UI)** |
| `currentUser` | `{ email, firstName, createdAt, surname }` | profil |
| `pendingAction` | string | action en attente d'auth |
| **`decideState`** | `{ shortlistId, role, partnerEmail, votes:{name:reaction}, matchs:[] }` | **état couple (pilote l'UI couple)** |

### 1.2 localStorage

**Espace v1 (app.js — actif)**
| Clé | Écrite par | Lue par |
|---|---|---|
| `namespark_v1_favorites` | `saveFavorites()` | `loadFavorites()` |
| `namespark_v1_user` | `saveUser()` | au boot |
| `namespark_v1_surname` | app.js (2 endroits) | app.js |
| `namespark_v1_lang` | `applyLang()` | au boot |
| `namespark_v1_history` | générations | drawer |
| `namespark_v1_comparisons` | comparateur | comparateur |
| `namespark_v1_saved_lists` | `saveListeToStorage()` | admin |

**Espace v2 (storage.js — partiellement mort)**
| Clé | Écrite par | Réellement appelée ? | Lue pour l'affichage ? |
|---|---|---|---|
| `namespark_v2_shortlist` | `saveShortlist()` | ✅ via `openDecide()` | ❌ (l'UI lit `favorites`) |
| `namespark_v2_shortlist_id` | `saveShortlist()` | ✅ | ✅ (id du lien) |
| `namespark_v2_votes` | `saveVote()` | ✅ via `handleVote()` | ❌ (l'UI lit `decideState.votes`) |
| `namespark_v2_invitation` | `createInvitation()` | ❌ **jamais appelée** | — |
| `namespark_v2_participant` | `saveParticipant()` | ❌ **jamais appelée** | — |
| `namespark_v2_matchs` | `calculateAndSaveMatchs()` | ❌ **jamais appelée par l'app** | — |
| `namespark_v2_notifications` | `addNotification()` | ✅ | partiel |

### 1.3 Schéma du flux réel

```
Génération ──► favorites (Set) ──► namespark_v1_favorites      ← source réelle
                   │
                   │  copie au moment de "Décider ensemble"
                   ▼
            namespark_v2_shortlist  (jamais relue pour l'affichage)
                   │
   handleVote ─────┼──► namespark_v2_votes  (clé email = "guest", jamais relue)
                   └──► decideState.votes   ──► calculateMatchsLocal()
                                                      │
                                                      ▼
                                              decideState.matchs ──► UI résultats

   ?invite=<id>  ──► GÉNÉRÉ dans l'URL, JAMAIS LU au chargement
```

---

## 2. Problèmes confirmés

1. **La sélection existe en 3 exemplaires** : `favorites` (Set) → `namespark_v2_shortlist` → clés de `decideState.votes`. Trois copies dérivées, aucune source unique.
2. **Deux moteurs de matching divergents** :
   - `calculateMatchsLocal()` (app.js, en mémoire) — **pilote l'UI**.
   - `calculateAndSaveMatchs()` (storage.js) — **jamais utilisée par l'app**.
   - Observé en direct : un prénom voté « maybe » affiché comme match (état mémoire périmé vs stockage).
3. **Les votes vivent en double** : `decideState.votes` (mémoire, sert à l'affichage) vs `namespark_v2_votes` (stockage, jamais relu).
4. **Participant unique `"guest"`** : tous les votes tombent sous la même clé → le consensus « tout le monde dit oui » est impossible à plusieurs.
5. **Invitation non persistée** : `createInvitation()` jamais appelée ; le mode famille (checkbox) jamais lu.
6. **`?invite=` jamais consommé** : le lien est généré mais aucun code ne le lit au boot. Le « vote partenaire » est une **simulation aléatoire locale**, pas un vrai parcours invité.
7. **Couche storage.js morte à ~70 %** : seules `saveShortlist`/`saveVote`/`addNotification` sont appelées, et leurs données ne sont même pas relues pour l'affichage.

**Conséquence :** `storage.js` n'est pas la source de vérité ; c'est `app.js` (mémoire) qui l'est, avec des écritures de stockage parallèles inutilisées. C'est l'inverse de l'objectif.

---

## 3. Modèle de données cible

Deux entités seulement. **Matchs et "shortlist" disparaissent en tant que données stockées** : ce sont des dérivés.

### 3.1 `selection` — concept unique de sélection utilisateur

Fusionne `favorites` + `shortlist`. Une seule liste, une seule clé.

```
selection: string[]            // prénoms choisis par l'utilisateur
// clé localStorage : namespark_selection
```

> `favorites` et `shortlist` ne sont plus deux choses. La « shortlist » d'une décision
> est simplement un instantané de `selection` au moment du partage (voir `Decision.items`).

### 3.2 `Decision` — la session couple (source de vérité unique du flux)

```
Decision {
  id:        string                 // ex-shortlistId
  createdAt: string (ISO)
  surname:   string | null
  familyMode: boolean
  items:     string[]               // prénoms soumis au vote (snapshot de selection)
  participants: {
    [participantId]: { role: "creator"|"partner"|"family", name, email }
  }
  votes: {
    [participantId]: { [name]: "yes"|"no"|"maybe" }
  }
}
// clé localStorage : namespark_decision:<id>   (+ namespark_decision_current = <id>)
```

**`matchs` n'est PAS stocké.** C'est une fonction pure dérivée :

```
computeMatches(decision) =
  decision.items where  ( ≥1 participant a voté )
                  AND   ( tous les participants AYANT voté ont dit "yes" )
```

> Un seul moteur, déterministe, sans état, testable, identique côté front et futur backend.

### 3.3 Schéma cible

```
selection (Set) ──► namespark_selection
     │
     │ "Décider ensemble" : fige selection → Decision.items
     ▼
Decision { items, participants, votes }  ◄── source de vérité unique (storage)
     │
     │ vote (créateur OU partenaire via ?invite=)
     ▼
Decision.votes[participantId][name]
     │
     ▼
computeMatches(decision)  ──► UI (dérivé, jamais stocké)
```

---

## 4. Plan : conserver / fusionner / supprimer

### ✅ À conserver
- **Le principe d'une couche `storage.js`** (bon pattern, prêt Supabase) — mais elle devient *réellement* la source de vérité.
- `currentUser`, `namespark_v1_user`, `namespark_v1_lang`, `namespark_v1_surname` (stables).
- La forme `votes[participant][name] = reaction` de `saveVote` (déjà proche de la cible).
- `history`, `comparisons`, `saved_lists` : **hors périmètre** de cette unification (fonctions périphériques) — inchangés.

### 🔀 À fusionner
| Avant | Après |
|---|---|
| `favorites` (Set) + `namespark_v2_shortlist` + clés `decideState.votes` | **`selection`** unique (`namespark_selection`) |
| `calculateMatchsLocal()` + `calculateAndSaveMatchs()` | **`computeMatches(decision)`** — fonction pure unique, dérivée |
| `decideState.votes` (mémoire) + `namespark_v2_votes` (storage) | **`Decision.votes`** — vit uniquement dans la `Decision` (storage), l'UI lit depuis là |
| `namespark_v2_invitation` + `namespark_v2_participant` | intégrés dans **`Decision.participants` / `Decision.familyMode`** |

### ❌ À supprimer
- `calculateMatchsLocal()` (app.js) — remplacée par `computeMatches`.
- Clé `namespark_v2_matchs` et `calculateAndSaveMatchs()` (matchs dérivés, jamais stockés).
- `decideState` comme source de vérité → réduit à un **pointeur léger** : `{ decisionId, role, participantId }`. Votes et matchs lus depuis la `Decision`.
- `generateShortlistId()` dupliqué dans app.js (garder celui de storage.js).
- Le participant codé en dur `"guest"`.
- Doublons legacy de storage.js si app.js garde son propre chemin favoris : un seul chemin d'accès à `selection`.

### ➕ À ajouter (manquant aujourd'hui, requis par le modèle ET par Supabase)
- **Consommation de `?invite=<id>` au chargement** → `role = "partner"`, charge la `Decision` par id, ouvre l'écran de vote. (Aujourd'hui inexistant.)
- Création réelle d'un participant + persistance de la `Decision` au moment du partage.
- Lecture effective de la checkbox **mode famille** → `Decision.familyMode`.
- Un `participantId` distinct par personne (créateur / partenaire / parent).

---

## 5. État d'implémentation (V1 — localStorage)

> ✅ **Implémenté.** L'unification est en place. `storage.js` est l'unique point
> d'accès aux données ; `app.js` ne touche plus jamais localStorage directement
> (vérifiable par `grep -n localStorage app.js` → uniquement des commentaires/FAQ).

### 5.1 API publique de `storage.js` (contrat stable, front-agnostique du backend)

```
// Préférences
getLang() / saveLang(lang)
getSurname() / saveSurname(s)

// Utilisateur
getUser() / setUser(u) / clearUser() / findUserByEmail(email)

// Sélection (concept unique)
getSelection() / saveSelection(names[]) / addToSelection(name) / removeFromSelection(name)

// Listes email, historique, comparaisons
getSavedLists() / addSavedList(entry)
getHistory() / addHistory(entry)
getComparisons() / addComparison(entry)

// Décisions (session couple)
createDecision({ creatorName, creatorEmail, surname, familyMode, items }) -> { decision, participantId }
getDecision(id)
getCurrentDecisionId() / setCurrentDecisionId(id)
addParticipant(decisionId, { role, name, email }) -> participantId
joinDecision(decisionId, { role, name, email }) -> participantId   // get-or-create (cet appareil)
getMyParticipantId(decisionId)
saveVote(decisionId, participantId, name, reaction)
getVotes(decisionId) -> { [participantId]: { [name]: reaction } }
computeMatches(decisionId) -> string[]    // DÉRIVÉ, jamais stocké

// Notifications
addNotification(type, text) / getNotifications() / markNotificationRead(id) / clearNotifications()
```

**Règle de match (unique, dans `computeMatches`)** : un prénom de `items` est un
match s'il a reçu ≥1 vote et que **tous les votes exprimés** sur ce prénom sont `yes`.
_Évolution possible : compter le vote implicite du créateur, ou distinguer match
« fort » (yes/yes) vs « possible » (yes/maybe)._

## 6. Schéma Supabase cible (à implémenter plus tard — NON implémenté)

Le modèle se mappe 1:1. Migration = remplacer le corps des fonctions `storage.*`
par des appels Supabase, **sans toucher à `app.js`**.

```sql
-- Utilisateurs (ou s'appuyer sur auth.users de Supabase)
create table users (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  first_name  text,
  surname     text,
  created_at  timestamptz not null default now()
);

-- Sélection personnelle (ex-favoris)
create table user_selections (
  user_id  uuid references users(id) on delete cascade,
  name     text not null,
  primary key (user_id, name)
);

-- Décisions (sessions couple)
create table decisions (
  id           uuid primary key default gen_random_uuid(),
  creator_id   uuid references users(id) on delete set null,
  surname      text,
  family_mode  boolean not null default false,
  items        text[] not null default '{}',   -- snapshot des prénoms soumis au vote
  created_at   timestamptz not null default now()
);

-- Participants d'une décision (créateur, partenaire, famille)
create table participants (
  id           uuid primary key default gen_random_uuid(),
  decision_id  uuid references decisions(id) on delete cascade,
  role         text not null check (role in ('creator','partner','family')),
  name         text,
  email        text,
  joined_at    timestamptz not null default now()
);

-- Votes
create table votes (
  decision_id     uuid references decisions(id) on delete cascade,
  participant_id  uuid references participants(id) on delete cascade,
  name            text not null,
  reaction        text not null check (reaction in ('yes','no','maybe')),
  primary key (decision_id, participant_id, name)
);
```

```sql
-- Matchs = vue dérivée (même règle que computeMatches) : aucune table stockée
create view decision_matches as
select v.decision_id, v.name
from votes v
group by v.decision_id, v.name
having bool_and(v.reaction = 'yes') and count(*) >= 1;
```

| Objet front (`storage.js`) | Table / vue Supabase |
|---|---|
| `getSelection` / `saveSelection` | `user_selections` |
| `createDecision` / `getDecision` | `decisions` |
| `addParticipant` / `joinDecision` | `participants` |
| `saveVote` / `getVotes` | `votes` |
| `computeMatches` | vue `decision_matches` (ou RPC) |
| `getUser` / `setUser` | `users` (ou `auth.users`) |

> Sécurité : activer **Row Level Security**. Un participant ne peut lire/écrire que
> les `votes`/`decisions` auxquels il appartient. Le `?invite=<decisionId>` devient
> un jeton d'accès en lecture à la décision + droit de créer son propre participant.

---

## 7. Limite connue en V1 (localStorage)

Le parcours `?invite=` est **pleinement fonctionnel dans le même navigateur**
(localStorage partagé entre onglets). Le **cross-appareil** (le partenaire sur son
propre téléphone) ne fonctionnera qu'une fois Supabase branché — **sans aucune
modification d'`app.js`**, puisque seule l'implémentation interne de `storage.js`
changera. C'est précisément l'objectif de cette architecture.
