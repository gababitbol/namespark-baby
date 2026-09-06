# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: agents.spec.js >> 🥂 Scénario couple — Sophie & Thomas >> [Thomas] Rejoint via lien et vote sur tous les prénoms
- Location: agents.spec.js:76:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#decideOverlay.open') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - link "✶ NameSpark Baby" [ref=e4] [cursor=pointer]:
        - /url: "#accueil"
        - generic [ref=e5]: ✶
        - generic [ref=e6]: NameSpark Baby
      - list [ref=e7]:
        - listitem [ref=e8]:
          - link "Accueil" [ref=e9] [cursor=pointer]:
            - /url: "#accueil"
        - listitem [ref=e10]:
          - link "Générateur" [ref=e11] [cursor=pointer]:
            - /url: "#generateur"
        - listitem [ref=e12]:
          - link "Signification" [ref=e13] [cursor=pointer]:
            - /url: "#signification"
        - listitem [ref=e14]:
          - link "Comment ça marche" [ref=e15] [cursor=pointer]:
            - /url: "#comment"
        - listitem [ref=e16]:
          - link "FAQ" [ref=e17] [cursor=pointer]:
            - /url: "#faq"
      - generic [ref=e18]:
        - button "Mon espace" [ref=e19] [cursor=pointer]:
          - generic [ref=e20]: Mon espace
        - generic [ref=e21]:
          - button "FR" [ref=e22] [cursor=pointer]
          - button "EN" [ref=e23] [cursor=pointer]
  - main [ref=e24]:
    - generic [ref=e26]:
      - generic [ref=e27]: Pour les futurs parents
      - heading "Le prénom de votre bébé, choisi ensemble" [level=1] [ref=e28]
      - paragraph [ref=e29]: Générez des idées, votez chacun de votre côté, et découvrez les prénoms où vous êtes vraiment d'accord.
      - generic [ref=e30]:
        - link "Découvrir les prénoms" [ref=e31] [cursor=pointer]:
          - /url: "#generateur"
        - link "Comment ça marche" [ref=e32] [cursor=pointer]:
          - /url: "#comment"
      - paragraph [ref=e33]: Ajoutez vos coups de cœur, puis votez ensemble.
    - generic [ref=e35]:
      - generic [ref=e36]:
        - heading "Pas juste un générateur de prénoms" [level=2] [ref=e37]
        - paragraph [ref=e38]: NameSpark Baby est conçu pour décider ensemble — pas seulement explorer chacun de son côté.
      - generic [ref=e39]:
        - generic [ref=e40]:
          - generic [ref=e41]: 💑
          - heading "Votez en couple" [level=3] [ref=e42]
          - paragraph [ref=e43]: Partagez un lien. Votre partenaire vote de son côté. On vous montre les prénoms où vous êtes vraiment d'accord.
        - generic [ref=e44]:
          - generic [ref=e45]: 👨‍👩‍👧‍👦
          - heading "Faites voter la famille" [level=3] [ref=e46]
          - paragraph [ref=e47]: Envoyez le lien aux grands-parents, à vos proches. Suivez le classement en direct avec le détail de qui a voté quoi.
        - generic [ref=e48]:
          - generic [ref=e49]: 🎯
          - heading "Des idées sur-mesure" [level=3] [ref=e50]
          - paragraph [ref=e51]: Filtres précis par genre, origine, style, signification. Compatibilité avec votre nom de famille incluse.
    - generic [ref=e53]:
      - generic [ref=e54]:
        - heading "Le générateur de prénoms" [level=2] [ref=e55]
        - paragraph [ref=e56]: Renseignez vos préférences, on s'occupe du reste.
      - generic [ref=e57]:
        - generic [ref=e58]:
          - generic [ref=e59]:
            - generic [ref=e60]: Genre
            - generic [ref=e61]:
              - button "Garçon" [ref=e62] [cursor=pointer]
              - button "Fille" [ref=e63] [cursor=pointer]
              - button "Mixte" [ref=e64] [cursor=pointer]
          - generic [ref=e65]:
            - generic [ref=e66]:
              - generic [ref=e67]: Origine
              - combobox "Origine" [ref=e68]:
                - option "Toutes" [selected]
                - option "Hébreu"
                - option "Français"
                - option "Anglais"
                - option "Arabe"
                - option "Italien"
                - option "Espagnol"
                - option "Grec"
                - option "Latin"
                - option "Nordique"
                - option "Irlandais"
                - option "Japonais"
                - option "Slave"
                - option "Sanskrit"
                - option "Persan"
                - option "Africain"
                - option "Portugais"
                - option "Coréen"
                - option "Chinois"
                - option "Gallois"
                - option "Basque"
                - option "Arménien"
                - option "Géorgien"
            - generic [ref=e69]:
              - generic [ref=e70]: Style
              - combobox "Style" [ref=e71]:
                - option "Peu importe" [selected]
                - option "Classique"
                - option "Moderne"
                - option "Rare"
                - option "Élégant"
                - option "Court"
                - option "Poétique"
            - generic [ref=e72]:
              - generic [ref=e73]: Signification recherchée
              - combobox "Signification recherchée" [ref=e74]:
                - option "Peu importe" [selected]
                - option "Force"
                - option "Courage"
                - option "Sagesse"
                - option "Lumière"
                - option "Nature"
                - option "Liberté"
                - option "Foi"
                - option "Amour"
                - option "Paix"
                - option "Victoire"
                - option "Joie"
                - option "Beauté"
                - option "Espoir"
                - option "Noblesse"
                - option "Grâce"
                - option "Prospérité"
            - generic [ref=e75]:
              - generic [ref=e76]: Première lettre (optionnel)
              - textbox "Première lettre (optionnel)" [ref=e77]:
                - /placeholder: A, B, C…
            - generic [ref=e78]:
              - generic [ref=e79]: Longueur
              - generic [ref=e80]:
                - button "Court" [ref=e81] [cursor=pointer]
                - button "Moyen" [ref=e82] [cursor=pointer]
                - button "Long" [ref=e83] [cursor=pointer]
                - button "Peu importe" [ref=e84] [cursor=pointer]
            - generic [ref=e85]:
              - generic [ref=e86]: Nom de famille (optionnel)
              - textbox "Nom de famille (optionnel)" [ref=e87]:
                - /placeholder: Dupont…
          - button "Générer des prénoms" [ref=e88] [cursor=pointer]
        - generic [ref=e89]:
          - heading "Vos prénoms" [level=3] [ref=e91]
          - generic [ref=e93]:
            - generic [ref=e94]: 👶
            - paragraph [ref=e95]: Choisissez vos critères puis cliquez sur « Générer » pour découvrir des idées de prénoms.
    - generic [ref=e97]:
      - generic [ref=e98]:
        - heading "Signification d'un prénom" [level=2] [ref=e99]
        - paragraph [ref=e100]: Tapez un prénom pour découvrir son origine, sa signification et des prénoms proches.
      - textbox "Rechercher un prénom" [ref=e102]:
        - /placeholder: "Ex : Nathan, Léa, Yasmine…"
    - generic [ref=e104]:
      - generic [ref=e105]:
        - heading "Comment ça marche" [level=2] [ref=e106]
        - paragraph [ref=e107]: Quatre étapes simples pour trouver le prénom parfait.
      - generic [ref=e108]:
        - generic [ref=e109]:
          - text: "01"
          - heading "Générez des prénoms" [level=3] [ref=e110]
          - paragraph [ref=e111]: Définissez vos envies — genre, origine, style, longueur. Cliquez sur Générer pour découvrir une sélection personnalisée avec la signification de chaque prénom.
        - generic [ref=e112]:
          - text: "02"
          - heading "Likez vos coups de cœur ❤️" [level=3] [ref=e113]
          - paragraph [ref=e114]: "Un prénom vous touche ? Cliquez sur ❤️ — il s'ajoute instantanément à votre sélection. Régénérez autant de fois que vous voulez : de nouveaux prénoms apparaissent à chaque fois."
        - generic [ref=e115]:
          - text: "03"
          - heading "Consultez Ma sélection" [level=3] [ref=e116]
          - paragraph [ref=e117]: Retrouvez tous vos coups de cœur dans « Ma sélection ». Comparez-les, exportez-les en PDF ou ajoutez votre nom de famille pour visualiser le résultat final.
        - generic [ref=e118]:
          - text: "04"
          - heading "Décidez ensemble" [level=3] [ref=e119]
          - paragraph [ref=e120]: Partagez votre sélection avec votre partenaire ou votre famille. Chacun vote en secret. NameSpark révèle les prénoms sur lesquels vous êtes vraiment d'accord.
    - generic [ref=e122]:
      - generic [ref=e123]:
        - heading "Exemples de prénoms populaires" [level=2] [ref=e124]
        - paragraph [ref=e125]: Cliquez sur un prénom pour voir des idées similaires dans le générateur.
      - generic [ref=e126]:
        - button "Gabriel" [ref=e127] [cursor=pointer]
        - button "Emma" [ref=e128] [cursor=pointer]
        - button "Raphaël" [ref=e129] [cursor=pointer]
        - button "Léa" [ref=e130] [cursor=pointer]
        - button "Noah" [ref=e131] [cursor=pointer]
        - button "Chloé" [ref=e132] [cursor=pointer]
        - button "Lucas" [ref=e133] [cursor=pointer]
        - button "Inès" [ref=e134] [cursor=pointer]
        - button "Adam" [ref=e135] [cursor=pointer]
        - button "Sofia" [ref=e136] [cursor=pointer]
    - generic [ref=e138]:
      - heading "Questions fréquentes" [level=2] [ref=e140]
      - generic [ref=e141]:
        - generic [ref=e142]:
          - button "Par où commencer ? +" [ref=e143] [cursor=pointer]
          - paragraph [ref=e144]:
            - text: "C'est immédiat : cliquez sur"
            - strong [ref=e145]: Générer des prénoms
            - text: ", parcourez les résultats et cliquez sur le ❤️ dès qu'un prénom vous plaît. Vos coups de cœur s'accumulent dans"
            - strong [ref=e146]: Ma sélection
            - text: . Régénérez autant de fois que vous voulez — de nouveaux prénoms apparaissent à chaque fois. Quand votre liste est prête, partagez-la pour voter en couple ou en famille.
        - generic [ref=e147]:
          - button "NameSpark Baby est-il gratuit ? +" [ref=e148] [cursor=pointer]
          - paragraph [ref=e149]: Oui, entièrement gratuit. Le générateur, les favoris, la recherche par signification, le vote en couple, le vote famille et l'export PDF sont tous accessibles sans abonnement ni carte bancaire. Vous pouvez créer un espace personnel (email facultatif) pour retrouver vos favoris d'une session à l'autre, depuis n'importe quel appareil.
        - generic [ref=e150]:
          - button "En quoi NameSpark Baby est-il différent de ChatGPT ? +" [ref=e151] [cursor=pointer]
          - paragraph [ref=e152]:
            - text: ChatGPT vous produit une liste statique de prénoms. NameSpark Baby vous accompagne dans
            - strong [ref=e153]: la décision
            - text: ": vous générez, vous likez, vous comparez, et vous invitez votre partenaire ou votre famille à voter en secret sur votre sélection. L'outil révèle ensuite les prénoms sur lesquels vous êtes vraiment d'accord, sans vous être influencés mutuellement. C'est un outil de décision partagée, pas juste une recherche."
        - generic [ref=e154]:
          - button "Comment fonctionne le vote en couple ? +" [ref=e155] [cursor=pointer]
          - paragraph [ref=e156]:
            - text: 1. Générez des prénoms et cliquez sur ❤️ pour remplir votre sélection.
            - text: 2. Ouvrez
            - strong [ref=e157]: Ma sélection
            - text: et cliquez sur « Décider à deux ».
            - text: 3. Un lien unique est créé — envoyez-le à votre partenaire.
            - text: "4. Chacun vote en secret : ❤️ j'adore, ? peut-être, ✗ non."
            - text: 5. NameSpark vous révèle les prénoms que vous avez tous les deux adorés.
        - generic [ref=e158]:
          - button "Comment fonctionne le vote famille ? +" [ref=e159] [cursor=pointer]
          - paragraph [ref=e160]:
            - text: Même principe que le vote couple, mais ouvert à tous les proches. Depuis
            - strong [ref=e161]: Ma sélection
            - text: ", choisissez « Décider en famille » et partagez le lien. Chaque participant vote juste avec son prénom, sans créer de compte. Vous suivez le classement en temps réel — qui a voté quoi, pour chaque prénom."
        - generic [ref=e162]:
          - button "Comment fonctionne le score de compatibilité ? +" [ref=e163] [cursor=pointer]
          - paragraph [ref=e164]: "Renseignez votre nom de famille dans le générateur. Chaque prénom reçoit un score de 1 à 10 estimant la fluidité de la combinaison : longueur totale, équilibre syllabique, enchaînement sonore. C'est une aide indicative — pas une règle absolue — pour repérer les combinaisons naturellement harmonieuses."
        - generic [ref=e165]:
          - button "Mes favoris sont-ils sauvegardés si je ferme l'onglet ? +" [ref=e166] [cursor=pointer]
          - paragraph [ref=e167]: Oui. Vos favoris sont sauvegardés automatiquement dans votre navigateur et restent disponibles à la prochaine visite. Pour les retrouver sur un autre appareil ou les partager, créez un espace personnel en laissant votre email — c'est gratuit et facultatif. Aucune donnée n'est vendue ni partagée avec des tiers.
  - contentinfo [ref=e168]:
    - generic [ref=e169]:
      - generic [ref=e170]:
        - generic [ref=e171]:
          - generic [ref=e172]:
            - generic [ref=e173]: ✶
            - generic [ref=e174]: NameSpark Baby
          - paragraph [ref=e175]: Choisissez le prénom de votre bébé, ensemble.
        - generic [ref=e176]:
          - heading "Explorer" [level=5] [ref=e177]
          - list [ref=e178]:
            - listitem [ref=e179]:
              - link "Prénoms garçon" [ref=e180] [cursor=pointer]:
                - /url: seo/prenom-garcon.html
            - listitem [ref=e181]:
              - link "Prénoms fille" [ref=e182] [cursor=pointer]:
                - /url: seo/prenom-fille.html
            - listitem [ref=e183]:
              - link "Prénoms rares" [ref=e184] [cursor=pointer]:
                - /url: seo/prenom-rare.html
            - listitem [ref=e185]:
              - link "Prénoms courts" [ref=e186] [cursor=pointer]:
                - /url: seo/prenom-court.html
            - listitem [ref=e187]:
              - link "Signification d'un prénom" [ref=e188] [cursor=pointer]:
                - /url: "#signification"
        - generic [ref=e189]:
          - heading "Navigation" [level=5] [ref=e190]
          - list [ref=e191]:
            - listitem [ref=e192]:
              - link "Accueil" [ref=e193] [cursor=pointer]:
                - /url: "#accueil"
            - listitem [ref=e194]:
              - link "Générateur" [ref=e195] [cursor=pointer]:
                - /url: "#generateur"
            - listitem [ref=e196]:
              - link "Signification" [ref=e197] [cursor=pointer]:
                - /url: "#signification"
            - listitem [ref=e198]:
              - link "Comment ça marche" [ref=e199] [cursor=pointer]:
                - /url: "#comment"
            - listitem [ref=e200]:
              - link "FAQ" [ref=e201] [cursor=pointer]:
                - /url: "#faq"
      - generic [ref=e202]:
        - generic [ref=e203]: © 2026 NameSpark Baby
        - link "admin" [ref=e204] [cursor=pointer]:
          - /url: admin.html
  - complementary "Favoris":
    - generic: ❤️
    - generic:
      - strong: "0"
      - text: favori
    - button "💑 Décider à deux"
    - button "👨‍👩‍👧‍👦 Vote famille"
    - button "Voir ma sélection"
  - dialog "Ma sélection":
    - generic:
      - generic:
        - generic:
          - generic: ✶
          - generic: NameSpark Baby
        - button "Fermer": ✕
      - generic:
        - generic:
          - generic: Votre sélection
          - heading "Votre sélection de prénoms" [level=2]
          - paragraph: Retrouvez tous les prénoms que vous avez enregistrés.
          - generic:
            - button "💑 Décider à deux"
            - button "👨‍👩‍👧‍👦 Faire voter la famille"
        - generic:
          - paragraph: Faites plus avec votre sélection
  - dialog "Votre sélection est prête !":
    - generic:
      - generic:
        - button "Fermer": ✕
      - generic: ✶
      - heading "Votre sélection est prête !" [level=3]
      - paragraph: Créez votre espace gratuit pour y accéder, recevoir votre liste par email et la retrouver à tout moment.
      - list:
        - listitem: ✓ Retrouvez vos prénoms favoris depuis n'importe quel appareil
        - listitem: ✓ Recevez votre sélection complète par email
        - listitem: ✓ Partagez facilement avec votre partenaire
        - listitem: ✓ Téléchargez votre liste en PDF quand vous voulez
      - generic:
        - generic:
          - generic: Votre adresse email *
          - textbox "Votre adresse email":
            - /placeholder: marie@exemple.com
        - generic:
          - generic: Votre prénom (optionnel)
          - textbox "Votre prénom (optionnel)":
            - /placeholder: Marie…
        - button "Accéder à ma sélection →"
      - generic:
        - generic: 🔒 Gratuit
        - generic: • Sans engagement
        - generic: • Données protégées
  - dialog "Décider ensemble":
    - generic:
      - generic:
        - generic:
          - generic: Décidez ensemble
          - heading "Invitez votre partenaire" [level=2]
        - button "Fermer": ✕
  - dialog "Mon espace" [ref=e205]:
    - generic [ref=e206]:
      - generic [ref=e207]: Mon espace
      - button "Fermer" [ref=e208] [cursor=pointer]: ✕
    - generic [ref=e209]:
      - generic [ref=e210]: "?"
      - generic [ref=e212]: Connecté·e
    - button "Se déconnecter" [ref=e215] [cursor=pointer]
  - dialog "Sauvegardez votre sélection":
    - generic:
      - generic:
        - heading "Sauvegardez votre sélection" [level=3]
        - button "Fermer": ✕
      - generic: ✶
      - paragraph: Sauvegardez vos prénoms favoris, retrouvez-les plus tard et exportez-les en PDF.
      - generic:
        - generic:
          - generic: Votre prénom (optionnel)
          - textbox "Votre prénom (optionnel)":
            - /placeholder: Marie…
        - generic:
          - generic: Votre adresse email *
          - textbox "Votre adresse email":
            - /placeholder: marie@exemple.com
        - button "Sauvegarder ma sélection"
        - paragraph:
          - text: En continuant, vous acceptez nos
          - link "Conditions d'utilisation":
            - /url: /terms
          - text: et notre
          - link "Politique de confidentialité":
            - /url: /privacy
          - text: .
      - paragraph: Déjà inscrit·e ? Entrez simplement votre email.
  - dialog "Être notifié quand votre partenaire vote":
    - generic:
      - generic:
        - heading "Être notifié quand votre partenaire vote" [level=3]
        - button "Fermer": ✕
      - generic: 📨
      - paragraph: Laissez votre email et recevez automatiquement un message dès que votre partenaire a terminé son vote.
      - generic:
        - generic:
          - generic: Votre prénom (optionnel)
          - textbox "Votre prénom (optionnel)":
            - /placeholder: Marie…
        - generic:
          - generic: Votre adresse email
          - textbox "Votre adresse email":
            - /placeholder: marie@exemple.com
        - button "Continuer"
        - paragraph:
          - text: En continuant, vous acceptez nos
          - link "Conditions d'utilisation":
            - /url: /terms
          - text: et notre
          - link "Politique de confidentialité":
            - /url: /privacy
          - text: .
      - button "Passer →"
  - dialog "Sauvegarder ma liste":
    - generic:
      - generic:
        - heading "Sauvegarder ma liste" [level=3]
        - button "Fermer": ✕
      - generic:
        - paragraph: Recevez votre sélection par email et retrouvez-la plus tard.
        - generic:
          - generic: Votre prénom (optionnel)
          - textbox "Votre prénom (optionnel)":
            - /placeholder: Marie…
        - generic:
          - generic: Où en êtes-vous ? (optionnel)
          - combobox "Où en êtes-vous ? (optionnel)":
            - option "Je préfère ne pas dire" [selected]
            - option "Semaine 4"
            - option "Semaine 5"
            - option "Semaine 6"
            - option "Semaine 7"
            - option "Semaine 8"
            - option "Semaine 9"
            - option "Semaine 10"
            - option "Semaine 11"
            - option "Semaine 12"
            - option "Semaine 13"
            - option "Semaine 14"
            - option "Semaine 15"
            - option "Semaine 16"
            - option "Semaine 17"
            - option "Semaine 18"
            - option "Semaine 19"
            - option "Semaine 20"
            - option "Semaine 21"
            - option "Semaine 22"
            - option "Semaine 23"
            - option "Semaine 24"
            - option "Semaine 25"
            - option "Semaine 26"
            - option "Semaine 27"
            - option "Semaine 28"
            - option "Semaine 29"
            - option "Semaine 30"
            - option "Semaine 31"
            - option "Semaine 32"
            - option "Semaine 33"
            - option "Semaine 34"
            - option "Semaine 35"
            - option "Semaine 36"
            - option "Semaine 37"
            - option "Semaine 38"
            - option "Semaine 39"
            - option "Semaine 40"
            - option "Bébé est déjà né"
          - paragraph: Pour vous montrer le temps qu'il vous reste pour choisir.
        - generic:
          - generic: Votre adresse email *
          - textbox "Votre adresse email":
            - /placeholder: marie@exemple.com
        - generic:
          - checkbox "Recevoir aussi les tendances et idées chaque semaine" [checked]
          - generic: Recevoir aussi les tendances et idées chaque semaine
        - button "Recevoir ma liste"
        - paragraph:
          - text: En continuant, vous acceptez nos
          - link "Conditions d'utilisation":
            - /url: /terms
          - text: et notre
          - link "Politique de confidentialité":
            - /url: /privacy
          - text: .
  - dialog "Comparateur de prénoms":
    - generic:
      - generic:
        - heading "Comparateur de prénoms" [level=3]
        - button "Fermer": ✕
      - generic:
        - table:
          - rowgroup
          - rowgroup
  - status:
    - paragraph: Chargement de votre session…
  - status:
    - paragraph
    - paragraph
    - button "Fermer": ✕
  - status: Cette invitation est introuvable ou a expiré.
```

# Test source

```ts
  1   | 'use strict';
  2   | 
  3   | const { expect } = require('@playwright/test');
  4   | 
  5   | const BASE_URL = 'https://namespark.baby';
  6   | 
  7   | // ─── Attente utilitaire ──────────────────────────────────────────────────────
  8   | 
  9   | /** Attend que #decideOverlay soit ouvert et qu'un step soit actif */
  10  | async function waitForDecideStep(page, stepId, timeout = 15_000) {
> 11  |   await page.waitForSelector('#decideOverlay.open', { timeout });
      |              ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  12  |   // showDecideStep() met display:none sur tous les autres steps
  13  |   await page.waitForFunction(
  14  |     (id) => {
  15  |       const el = document.getElementById(id);
  16  |       return el && el.style.display !== 'none' && el.offsetParent !== null;
  17  |     },
  18  |     stepId,
  19  |     { timeout }
  20  |   );
  21  | }
  22  | 
  23  | // ─── Auth ────────────────────────────────────────────────────────────────────
  24  | 
  25  | /**
  26  |  * Connexion via la modale d'auth principale (#espaceBtn).
  27  |  * Attend que la modale se ferme ET ferme le drawer qui s'ouvre automatiquement.
  28  |  */
  29  | async function loginViaAuthModal(page, agent) {
  30  |   await page.click('#espaceBtn');
  31  |   await page.waitForSelector('#authModal.open', { timeout: 8_000 });
  32  |   await page.fill('#authEmail', agent.email);
  33  |   // Debounce de 1.4s + lookup Supabase
  34  |   await page.waitForTimeout(2_500);
  35  |   const fnField = page.locator('#authFirstName');
  36  |   if (await fnField.isVisible()) {
  37  |     await fnField.fill(agent.firstName);
  38  |   }
  39  |   await page.click('#authSubmit');
  40  |   // Attendre la fin de l'opération async (bouton re-enabled → modale fermée)
  41  |   await page.waitForFunction(
  42  |     () => {
  43  |       const modal = document.getElementById('authModal');
  44  |       return modal && !modal.classList.contains('open');
  45  |     },
  46  |     { timeout: 15_000 }
  47  |   );
  48  |   // Fermer le drawer espace qui s'ouvre automatiquement après auth
  49  |   const drawerOpen = await page.locator('#espaceDrawer.open').isVisible().catch(() => false);
  50  |   if (drawerOpen) {
  51  |     await page.keyboard.press('Escape');
  52  |     await page.waitForTimeout(400);
  53  |   }
  54  | }
  55  | 
  56  | /**
  57  |  * Connexion via la modale #voteStartModal (déclenchée par "Décider à deux" sans être connecté).
  58  |  * Retourne une fois que #decideOverlay est ouvert.
  59  |  */
  60  | async function loginViaVoteStartModal(page, agent, mode = 'couple') {
  61  |   await page.waitForSelector('#voteStartModal.open', { timeout: 10_000 });
  62  |   await page.fill('#voteStartEmail', agent.email);
  63  |   await page.fill('#voteStartFirstName', agent.firstName);
  64  |   await page.click('#voteStartSubmit');
  65  | }
  66  | 
  67  | // ─── Sélection & prénoms ─────────────────────────────────────────────────────
  68  | 
  69  | /**
  70  |  * Injecte une liste de prénoms directement dans localStorage,
  71  |  * puis recharge la page. Plus rapide et déterministe que cliquer dans le générateur.
  72  |  *
  73  |  * Attend que #navListeLink soit visible — signal fiable que loadFavorites() +
  74  |  * updateEspaceButton() ont été appelés avec favorites.size > 0.
  75  |  */
  76  | async function seedFavorites(page, names) {
  77  |   await page.evaluate(
  78  |     (n) => localStorage.setItem('namespark.selection', JSON.stringify(n)),
  79  |     names
  80  |   );
  81  |   await page.reload({ waitUntil: 'load' });
  82  |   // Après reload, forcer la mise à jour en mémoire au cas où DOMContentLoaded
  83  |   // aurait couru avant que localStorage soit lu (race condition Playwright/JS).
  84  |   await page.evaluate((n) => {
  85  |     localStorage.setItem('namespark.selection', JSON.stringify(n));
  86  |     if (typeof loadFavorites === 'function')  loadFavorites();
  87  |     if (typeof renderFavorites === 'function') renderFavorites();
  88  |   }, names);
  89  |   // Signal fiable : renderFavorites() met le badge count à jour.
  90  |   // On vérifie #navListeBadge plutôt que style.display (le parent #navListeWrap
  91  |   // reste display:none en CSS même quand style.display="" est retiré).
  92  |   await page.waitForFunction(
  93  |     (n) => {
  94  |       const badge = document.getElementById('navListeBadge');
  95  |       return badge && parseInt(badge.textContent, 10) === n;
  96  |     },
  97  |     names.length,
  98  |     { timeout: 15_000 }
  99  |   );
  100 | }
  101 | 
  102 | /**
  103 |  * Ouvre l'overlay "Ma sélection" via appel JS direct.
  104 |  * #navListeWrap a display:none en CSS même quand il contient des favoris
  105 |  * (renderFavorites() met style.display="" qui revient au display:none du CSS),
  106 |  * donc page.click('#navListeLink') échoue avec "element not visible".
  107 |  * On appelle openSelection() directement, comme le ferait l'app.
  108 |  */
  109 | async function openSelectionOverlay(page) {
  110 |   await page.evaluate(() => openSelection());
  111 |   await page.waitForSelector('#selectionOverlay.open', { timeout: 8_000 });
```