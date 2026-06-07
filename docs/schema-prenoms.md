# Schéma strict des prénoms — NameSpark

Référence unique pour tout ajout/modification dans `data.js`.
Toute entrée doit passer `node validate-data.js` sans erreur avant commit.

---

## 1. Structure d'un prénom

```js
{
  name: "Nathan",              // string, requis, unique (insensible casse/accents)
  gender: "boy",               // "boy" | "girl" | "mixte"  (liste fermée)
  origin: "hebreu",            // une seule valeur, dans ORIGINS (liste fermée)
  style: ["classique","moderne"], // 1 à 3 valeurs, dans STYLES, sans doublon
  meaningTags: ["foi"],        // 1 à 3 valeurs, dans TAGS, sans doublon
  length: "moyen",             // "court" | "moyen" | "long"  (cohérent, voir §4)
  meaning: { fr: "Don de Dieu", en: "Gift of God" }, // requis, fr+en non vides
  why:     { fr: "...", en: "..." }                  // requis, fr+en non vides

  // --- Champs optionnels (page Signification, Phase 1/2) ---
  variants:      ["Nathaniel","Nathanael"], // string[] optionnel
  pronunciation: "na-TAN",                    // string optionnel
  info:          { fr: "...", en: "..." }     // objet optionnel
}
```

---

## 2. Listes fermées (taxonomie canonique)

### GENDERS
`boy` · `girl` · `mixte`

### LENGTHS
`court` · `moyen` · `long`

### STYLES (6)
`classique` · `moderne` · `rare` · `elegant` · `court` · `poetique`

### TAGS de signification (16)
`force` · `courage` · `sagesse` · `lumiere` · `nature` · `liberte` · `foi` · `amour` ·
`paix` · `victoire` · `joie` · `beaute` · `espoir` · `noblesse` · `grace` · `prosperite`

> `paix` et `victoire` ajoutés (déjà présents et utiles). `combat`, `gloire`, `royaute`,
> `ordre` supprimés (≤3 usages) → remappés vers `force` / `victoire` / `sagesse`.
> `joie`, `beaute`, `espoir`, `noblesse`, `grace`, `prosperite` ajoutés (2026-06-07)
> pour des filtres de signification plus fins sur la base élargie à 10 000.

### ORIGINS (22 — toutes exposées dans le filtre UI)
`hebreu` · `francais` · `anglais` · `arabe` · `italien` · `espagnol` · `grec` ·
`latin` · `nordique` · `irlandais` · `japonais` · `slave` · `sanskrit` · `persan` ·
`africain` · `portugais` · `coreen` · `chinois` · `gallois` · `basque` ·
`armenien` · `georgien`

> ⚠️ Aujourd'hui le `<select>` n'expose que 8 origines → 14 origines (≈300 prénoms)
> sont invisibles via le filtre. À corriger dans `index.html` + clés i18n.

---

## 3. Règles de validation (bloquantes)

1. **Tous les champs requis présents et non vides** (name, gender, origin, style,
   meaningTags, length, meaning.fr/en, why.fr/en).
2. **Unicité** : aucun `name` en double (comparaison minuscules + accents normalisés).
3. **Valeurs dans les listes fermées** : gender, origin, length, chaque style,
   chaque tag.
4. **style** : 1 à 3 valeurs, sans doublon interne.
5. **meaningTags** : 1 à 3 valeurs, sans doublon interne.
6. **meaning.fr ≠ meaning.en** seulement toléré pour mots identiques réels ;
   meaning.fr non vide (longueur ≥ 2). Les sens courts légitimes (« Roi », « Mer »)
   sont valides.
7. **why.fr / why.en** : phrases distinctes de meaning, longueur ≥ 8 caractères.

## 4. Règles de qualité (avertissements, non bloquantes)

- **Cohérence `length`** : court ≤ 4 lettres, moyen 5–6, long ≥ 7 (tolérance ±1).
- **Diversité des significations** : éviter qu'un même sens dépasse ~2 % de la base
  (ex. « Don de Dieu » apparaît 12×). Privilégier des nuances.
- **Équilibre origine × genre** : viser un plancher par cellule (voir recommandations).
