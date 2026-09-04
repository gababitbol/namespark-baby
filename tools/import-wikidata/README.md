# Pipeline d'import Wikidata — NameSpark Baby

Source unique retenue pour l'instant : **Wikidata** (licence CC0, aucune contrainte
de réutilisation). Voir la discussion produit du 2026-09 pour le contexte complet
(pourquoi INSEE/SSA/ONS ne suffisent pas seuls — ils donnent des noms réels mais
aucune signification — et pourquoi Wiktionary a été écarté pour l'instant, à cause
de sa clause de partage à l'identique CC BY-SA).

## Étapes

1. **`1-query.sparql`** — requête SPARQL contre `query.wikidata.org`. Récupère tous
   les éléments « prénom » (`Q202444`, sous-classes `Q12308941`/`Q11879590`/`Q3409032`)
   ayant un lien d'étymologie réel (`P138` « named after »).
   ```
   curl -s -G "https://query.wikidata.org/sparql" \
     --data-urlencode "query@1-query.sparql" \
     --data-urlencode "format=json" -o /tmp/wd_names_raw.json
   ```
   ⚠️ Utiliser `-G --data-urlencode` en une seule commande — l'encodage manuel
   d'URL ou les variables inter-commandes ont échoué de façon peu évidente
   pendant le développement (erreur Jetty « Unable to parse URI query »).

2. **Classement** : les résultats se séparent en trois familles selon où pointe
   `P138` :
   - **cible = concept commun** (minuscule, ex. « victory », « peace ») → glose
     directe, confiance maximale. Script `4-build-conceptual.js`.
   - **cible = figure religieuse/saint/dédicace mariale** → glose mécanique
     « En l'honneur de / Consacré à [figure] », tag `foi`. Script `2-build-religious.js`.
   - **cible = autre nom propre** (figure historique/mythologique) → nécessite une
     glose au cas par cas (`TARGET_GLOSS` dans `3-build-other.js`), en décrivant
     honnêtement « en l'honneur de X » plutôt que d'trancher une étymologie
     disputée. Exclure systématiquement : fiction, marques, noms à charge
     politique/idéologique forte, figures aux connotations négatives.

3. **`validate-batch.js`** — à lancer sur CHAQUE lot avant insertion :
   ```
   node validate-batch.js /chemin/vers/batch.json
   ```
   Vérifie : schéma (genre/origine/style/tags valides), longueur calculée
   correctement, doublons exacts contre `data.js`, quasi-doublons (accents/casse)
   contre `data.js` ET à l'intérieur du lot lui-même.

   Un quasi-doublon détecté n'est pas forcément une erreur : si les deux entrées
   ont des **origines différentes** (ex. « Luis Gonzaga » espagnol vs « Luís
   Gonzaga » portugais), ce sont deux variantes légitimes à conserver. Si elles
   ont la **même origine** (juste une différence de tiret/espace), c'est un vrai
   doublon à corriger avant insertion — vérifié manuellement à chaque lot.

4. **Insertion** : remplacement chirurgical en fin de fichier (avant le `];`
   fermant), jamais de réécriture complète de `data.js` — voir le motif dans
   n'importe lequel des scripts `*-build-*.js`.

5. **Après insertion** : toujours relancer, dans l'ordre :
   ```
   node tools/build-seo-pages.js     # régénère /prenom/*.html + sitemap.xml
   node tools/audit-tag-conflicts.js # verifie les nouvelles entrees aussi
   ```

## Audit de cohérence des tags (`audit-tag-conflicts.js`)

Approche **conservatrice** : ne signale un tag comme incorrect que s'il existe
une **contradiction directe** dans le texte de `meaning.fr` (ex. tag `noblesse`
mais signification « humble »). Ne retire jamais un tag simplement parce
qu'aucun mot du champ lexical n'apparaît — une relation sémantique non littérale
peut être légitime (c'est le rôle d'une relecture humaine, pas d'un script).

## Limite connue de cette source

Le lien `P138` de Wikidata est très majoritairement peuplé pour des **dédicaces
religieuses catholiques** (saints, titres mariaux). Résultat : cette source
enrichit efficacement le thème `foi`, mais apporte peu aux autres thèmes
prioritaires (victoire, espoir, prospérité, paix, liberté, courage, amour) et
quasi rien aux origines hors tradition catholique européenne (coréen, arménien,
géorgien, persan...). Pour progresser sur ces zones précises, il faudra une
source différente, ciblée par origine — pas un nouveau passage sur Wikidata.
