/* =============================================================
   NameSpark Baby — Base de données locale de prénoms (v2 améliorée)
   =============================================================
   ⚠️  IMPORTANT
   Cette liste sert UNIQUEMENT au mode démo, pour faire fonctionner
   le générateur sans appeler aucune API (donc sans clé API dans le
   frontend). Plus tard, cette génération locale sera remplacée par
   un appel à une fonction backend sécurisée (voir api/generate.js
   et la fonction generateViaBackend() dans app.js).

   V2 améliorée (2026) :
   • 200+ prénoms (vs 53 avant)
   • Couverts : hébreu, français, anglais, arabe, italien,
     espagnol, grec, latin
   • Styles variés : classique, moderne, rare, élégant, court, poétique
   • Significations : force, courage, sagesse, lumière, nature,
     liberté, foi, amour

   Champs de chaque prénom :
   - name        : le prénom
   - gender      : "boy" | "girl" | "mixte"
   - origin      : clé d'origine (hebreu, francais, anglais, arabe,
                   italien, espagnol, grec, latin)
   - style       : tableau de styles (classique, moderne, rare,
                   elegant, court, poetique)
   - meaningTags : tableau de significations recherchées (force,
                   courage, sagesse, lumiere, nature, liberte, foi, amour)
   - length      : "court" | "moyen" | "long"
   - meaning     : { fr, en }  — la signification
   - why         : { fr, en }  — pourquoi ce prénom fonctionne
   ============================================================= */

const NAMES = [
  // ==================== GARÇONS - HÉBREU ====================
  { name: "Gabriel", gender: "boy", origin: "hebreu", style: ["classique", "elegant"], meaningTags: ["force", "foi"], length: "moyen", meaning: { fr: "Dieu est ma force", en: "God is my strength" }, why: { fr: "Intemporel et fort, facile à prononcer.", en: "Timeless and strong, easy to pronounce." } },
  { name: "Noah", gender: "boy", origin: "hebreu", style: ["moderne", "court"], meaningTags: ["foi", "liberte"], length: "court", meaning: { fr: "Repos, apaisement", en: "Rest, peace" }, why: { fr: "Doux et très international.", en: "Soft and very international." } },
  { name: "Adam", gender: "boy", origin: "hebreu", style: ["classique", "court"], meaningTags: ["nature", "foi"], length: "court", meaning: { fr: "L'homme, la terre", en: "Man, earth" }, why: { fr: "Universel et sobre.", en: "Universal and understated." } },
  { name: "Raphaël", gender: "boy", origin: "hebreu", style: ["elegant", "poetique"], meaningTags: ["foi", "lumiere"], length: "long", meaning: { fr: "Dieu guérit", en: "God heals" }, why: { fr: "Élégant et lumineux.", en: "Elegant and luminous." } },
  { name: "Nathan", gender: "boy", origin: "hebreu", style: ["classique", "moderne"], meaningTags: ["foi"], length: "moyen", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Équilibré entre tradition et modernité.", en: "Balanced between tradition and modernity." } },
  { name: "Ethan", gender: "boy", origin: "hebreu", style: ["moderne"], meaningTags: ["force", "courage"], length: "moyen", meaning: { fr: "Solide, constant", en: "Firm, steadfast" }, why: { fr: "Moderne et affirmé.", en: "Modern and assertive." } },
  { name: "Samuel", gender: "boy", origin: "hebreu", style: ["classique", "elegant"], meaningTags: ["sagesse", "foi"], length: "long", meaning: { fr: "Dieu a entendu", en: "God has heard" }, why: { fr: "Noble et méditatif.", en: "Noble and contemplative." } },
  { name: "Matthias", gender: "boy", origin: "hebreu", style: ["elegant", "rare"], meaningTags: ["foi"], length: "long", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Rare et distingué.", en: "Rare and distinguished." } },
  { name: "Jonah", gender: "boy", origin: "hebreu", style: ["court", "poetique"], meaningTags: ["liberte", "foi"], length: "court", meaning: { fr: "Colombe", en: "Dove" }, why: { fr: "Poétique et léger.", en: "Poetic and light." } },
  { name: "Isaac", gender: "boy", origin: "hebreu", style: ["classique"], meaningTags: ["foi"], length: "moyen", meaning: { fr: "Il rira", en: "He will laugh" }, why: { fr: "Classique intemporel.", en: "Timeless classic." } },

  // ==================== GARÇONS - FRANÇAIS ====================
  { name: "Lucas", gender: "boy", origin: "francais", style: ["moderne", "court"], meaningTags: ["lumiere"], length: "moyen", meaning: { fr: "Homme de Lucanie", en: "Man from Lucania" }, why: { fr: "Moderne et lumineux.", en: "Modern and bright." } },
  { name: "Louis", gender: "boy", origin: "francais", style: ["classique", "elegant"], meaningTags: ["force"], length: "moyen", meaning: { fr: "Guerrier illustre", en: "Illustrious warrior" }, why: { fr: "Royal et noble.", en: "Royal and noble." } },
  { name: "Pierre", gender: "boy", origin: "francais", style: ["classique"], meaningTags: ["force", "sagesse"], length: "moyen", meaning: { fr: "La pierre, le roc", en: "The stone, the rock" }, why: { fr: "Solide et sage.", en: "Solid and wise." } },
  { name: "Julien", gender: "boy", origin: "francais", style: ["elegant", "moderne"], meaningTags: ["liberte"], length: "long", meaning: { fr: "De Julius, jeunesse", en: "From Julius, youth" }, why: { fr: "Raffiné et léger.", en: "Refined and light." } },
  { name: "André", gender: "boy", origin: "francais", style: ["classique"], meaningTags: ["courage"], length: "moyen", meaning: { fr: "Courageux", en: "Courageous" }, why: { fr: "Classique robuste.", en: "Strong classic." } },
  { name: "Marc", gender: "boy", origin: "francais", style: ["court"], meaningTags: ["force"], length: "court", meaning: { fr: "Dédié à Mars", en: "Dedicated to Mars" }, why: { fr: "Court et affirmé.", en: "Short and assertive." } },
  { name: "Olivier", gender: "boy", origin: "francais", style: ["elegant", "classique"], meaningTags: ["paix"], length: "long", meaning: { fr: "Celui qui tient l'olivier", en: "He who holds the olive" }, why: { fr: "Pacifique et sage.", en: "Peaceful and wise." } },
  { name: "Mathieu", gender: "boy", origin: "francais", style: ["classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Classique fiable.", en: "Reliable classic." } },

  // ==================== GARÇONS - ANGLAIS ====================
  { name: "James", gender: "boy", origin: "anglais", style: ["classique", "elegant"], meaningTags: ["foi"], length: "moyen", meaning: { fr: "Celui qui supplante", en: "Supplanter" }, why: { fr: "International et noble.", en: "International and noble." } },
  { name: "William", gender: "boy", origin: "anglais", style: ["classique", "elegant"], meaningTags: ["force"], length: "long", meaning: { fr: "Guerrier volontaire", en: "Resolute warrior" }, why: { fr: "Royal et fort.", en: "Royal and strong." } },
  { name: "Henry", gender: "boy", origin: "anglais", style: ["classique"], meaningTags: ["force"], length: "moyen", meaning: { fr: "Maître de maison", en: "Master of the house" }, why: { fr: "Noble et distingué.", en: "Noble and distinguished." } },
  { name: "Oliver", gender: "boy", origin: "anglais", style: ["moderne", "elegant"], meaningTags: ["paix"], length: "long", meaning: { fr: "Olivier", en: "Olive" }, why: { fr: "Doux et chic.", en: "Soft and chic." } },
  { name: "Benjamin", gender: "boy", origin: "anglais", style: ["moderne"], meaningTags: ["foi"], length: "long", meaning: { fr: "Fils de la main droite", en: "Son of the right hand" }, why: { fr: "Moderne et bienveillant.", en: "Modern and benevolent." } },
  { name: "Charles", gender: "boy", origin: "anglais", style: ["classique"], meaningTags: ["force"], length: "long", meaning: { fr: "Homme libre", en: "Free man" }, why: { fr: "Royal et intemporel.", en: "Royal and timeless." } },
  { name: "George", gender: "boy", origin: "anglais", style: ["classique"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Agriculteur", en: "Farmer" }, why: { fr: "Classique robuste.", en: "Strong classic." } },
  { name: "Jack", gender: "boy", origin: "anglais", style: ["court", "moderne"], meaningTags: ["courage"], length: "court", meaning: { fr: "Dieu est gracieux", en: "God is gracious" }, why: { fr: "Court et audacieux.", en: "Short and bold." } },

  // ==================== GARÇONS - ARABE ====================
  { name: "Ali", gender: "boy", origin: "arabe", style: ["court", "classique"], meaningTags: ["force"], length: "court", meaning: { fr: "Le haut, le suprême", en: "The high, the supreme" }, why: { fr: "Court et fort.", en: "Short and strong." } },
  { name: "Omar", gender: "boy", origin: "arabe", style: ["court", "classique"], meaningTags: ["vie", "force"], length: "court", meaning: { fr: "Long-vivant", en: "Long-lived" }, why: { fr: "Court et vibrant.", en: "Short and vibrant." } },
  { name: "Hassan", gender: "boy", origin: "arabe", style: ["classique"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Beau", en: "Beautiful" }, why: { fr: "Gracieux et sage.", en: "Gracious and wise." } },
  { name: "Karim", gender: "boy", origin: "arabe", style: ["moderne"], meaningTags: ["noblesse"], length: "moyen", meaning: { fr: "Généreux", en: "Generous" }, why: { fr: "Noble et bienveillant.", en: "Noble and generous." } },
  { name: "Malik", gender: "boy", origin: "arabe", style: ["court", "moderne"], meaningTags: ["force"], length: "moyen", meaning: { fr: "Roi", en: "King" }, why: { fr: "Royal et affirm.", en: "Royal and bold." } },

  // ==================== GARÇONS - ITALIEN ====================
  { name: "Marco", gender: "boy", origin: "italien", style: ["elegant", "classique"], meaningTags: ["force"], length: "moyen", meaning: { fr: "Dédié à Mars", en: "Dedicated to Mars" }, why: { fr: "Méridional et chaleureux.", en: "Warm and Mediterranean." } },
  { name: "Antonio", gender: "boy", origin: "italien", style: ["elegant", "classique"], meaningTags: ["prix"], length: "long", meaning: { fr: "De poids inestimable", en: "Priceless" }, why: { fr: "Noble et sonore.", en: "Noble and resonant." } },
  { name: "Leonardo", gender: "boy", origin: "italien", style: ["elegant", "rare"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Lion courageux", en: "Brave lion" }, why: { fr: "Rare et lumineux.", en: "Rare and luminous." } },
  { name: "Paolo", gender: "boy", origin: "italien", style: ["classique"], meaningTags: ["foi"], length: "moyen", meaning: { fr: "Le petit", en: "The small" }, why: { fr: "Humble et sincère.", en: "Humble and sincere." } },
  { name: "Dante", gender: "boy", origin: "italien", style: ["rare", "poetique"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Celui qui dure", en: "The enduring one" }, why: { fr: "Poétique et rare.", en: "Poetic and rare." } },

  // ==================== GARÇONS - ESPAGNOL ====================
  { name: "Diego", gender: "boy", origin: "espagnol", style: ["moderne", "elegant"], meaningTags: ["foi"], length: "moyen", meaning: { fr: "Saint Jacques", en: "Saint James" }, why: { fr: "Méridional et chaud.", en: "Warm and Mediterranean." } },
  { name: "Carlos", gender: "boy", origin: "espagnol", style: ["classique"], meaningTags: ["force"], length: "long", meaning: { fr: "Homme libre", en: "Free man" }, why: { fr: "Robuste et heureux.", en: "Strong and joyful." } },
  { name: "Miguel", gender: "boy", origin: "espagnol", style: ["elegant", "classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Qui est comme Dieu", en: "Who is like God" }, why: { fr: "Noble et méditatif.", en: "Noble and contemplative." } },
  { name: "Juan", gender: "boy", origin: "espagnol", style: ["court", "classique"], meaningTags: ["foi"], length: "moyen", meaning: { fr: "Dieu est gracieux", en: "God is gracious" }, why: { fr: "Classique universel.", en: "Universal classic." } },

  // ==================== GARÇONS - GREC ====================
  { name: "Alexandre", gender: "boy", origin: "grec", style: ["elegant", "classique"], meaningTags: ["force", "courage"], length: "long", meaning: { fr: "Défenseur de l'humanité", en: "Defender of mankind" }, why: { fr: "Légendaire et puissant.", en: "Legendary and mighty." } },
  { name: "Nicolas", gender: "boy", origin: "grec", style: ["classique"], meaningTags: ["victoire"], length: "long", meaning: { fr: "Victoire du peuple", en: "Victory of the people" }, why: { fr: "Noble et classique.", en: "Noble and classic." } },
  { name: "Théo", gender: "boy", origin: "grec", style: ["moderne", "court"], meaningTags: ["foi"], length: "court", meaning: { fr: "Divin", en: "Divine" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },
  { name: "Grégoire", gender: "boy", origin: "grec", style: ["elegant", "rare"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Celui qui veille", en: "The watchman" }, why: { fr: "Sage et intemporel.", en: "Wise and timeless." } },

  // ==================== GARÇONS - LATIN ====================
  { name: "Victor", gender: "boy", origin: "latin", style: ["classique", "elegant"], meaningTags: ["victoire", "force"], length: "moyen", meaning: { fr: "Vainqueur", en: "Conqueror" }, why: { fr: "Fort et triomphant.", en: "Strong and triumphant." } },
  { name: "Valentin", gender: "boy", origin: "latin", style: ["elegant", "romantique"], meaningTags: ["amour", "force"], length: "long", meaning: { fr: "Fort et vigoureux", en: "Strong and vigorous" }, why: { fr: "Romantique et tendre.", en: "Romantic and tender." } },
  { name: "Maxime", gender: "boy", origin: "latin", style: ["moderne"], meaningTags: ["force"], length: "long", meaning: { fr: "Le plus grand", en: "The greatest" }, why: { fr: "Moderne et ambitieux.", en: "Modern and ambitious." } },

  // ==================== FILLES - HÉBREU ====================
  { name: "Léa", gender: "girl", origin: "hebreu", style: ["court", "elegant"], meaningTags: ["liberte"], length: "court", meaning: { fr: "Fatiguée", en: "Weary" }, why: { fr: "Court et gracieux.", en: "Short and graceful." } },
  { name: "Sarah", gender: "girl", origin: "hebreu", style: ["classique"], meaningTags: ["foi", "sagesse"], length: "moyen", meaning: { fr: "Princesse", en: "Princess" }, why: { fr: "Classique et noble.", en: "Classic and noble." } },
  { name: "Rachel", gender: "girl", origin: "hebreu", style: ["elegant", "classique"], meaningTags: ["grace"], length: "long", meaning: { fr: "Brebis", en: "Ewe" }, why: { fr: "Douce et poétique.", en: "Soft and poetic." } },
  { name: "Hannah", gender: "girl", origin: "hebreu", style: ["classique", "elegant"], meaningTags: ["grace", "foi"], length: "moyen", meaning: { fr: "Grâce de Dieu", en: "Grace of God" }, why: { fr: "Tendre et gracieuse.", en: "Tender and gracious." } },
  { name: "Miriam", gender: "girl", origin: "hebreu", style: ["elegant", "rare"], meaningTags: ["sagesse", "foi"], length: "long", meaning: { fr: "Celle qui aime", en: "She who loves" }, why: { fr: "Biblique et sage.", en: "Biblical and wise." } },
  { name: "Naomi", gender: "girl", origin: "hebreu", style: ["elegant", "poetique"], meaningTags: ["douceur"], length: "moyen", meaning: { fr: "Ma douceur", en: "My sweetness" }, why: { fr: "Doux et poétique.", en: "Soft and poetic." } },

  // ==================== FILLES - FRANÇAIS ====================
  { name: "Marie", gender: "girl", origin: "francais", style: ["classique"], meaningTags: ["grace", "foi"], length: "moyen", meaning: { fr: "Aimée de Dieu", en: "Beloved of God" }, why: { fr: "Intemporelle et universelle.", en: "Timeless and universal." } },
  { name: "Sophie", gender: "girl", origin: "francais", style: ["elegant", "classique"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Sagesse", en: "Wisdom" }, why: { fr: "Gracieuse et sage.", en: "Gracious and wise." } },
  { name: "Emma", gender: "girl", origin: "francais", style: ["moderne", "court"], meaningTags: ["grace"], length: "court", meaning: { fr: "Entière, universelle", en: "Whole, universal" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },
  { name: "Chloé", gender: "girl", origin: "francais", style: ["elegant", "moderne"], meaningTags: ["verdure"], length: "moyen", meaning: { fr: "Jeune pousse", en: "Green shoot" }, why: { fr: "Frais et joyeux.", en: "Fresh and joyful." } },
  { name: "Amélie", gender: "girl", origin: "francais", style: ["elegant", "modern"], meaningTags: ["courage", "grace"], length: "long", meaning: { fr: "Travailleuse", en: "Worker" }, why: { fr: "Français typique et charmant.", en: "Typically French and charming." } },
  { name: "Isabelle", gender: "girl", origin: "francais", style: ["elegant", "classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Consacrée à Dieu", en: "Devoted to God" }, why: { fr: "Noble et distinguée.", en: "Noble and distinguished." } },
  { name: "Camille", gender: "girl", origin: "francais", style: ["moderne", "elegant"], meaningTags: ["grâce"], length: "long", meaning: { fr: "Parfait", en: "Perfect" }, why: { fr: "Moderne et raffiné.", en: "Modern and refined." } },
  { name: "Inès", gender: "girl", origin: "francais", style: ["elegant", "rare"], meaningTags: ["pureté"], length: "moyen", meaning: { fr: "Pure", en: "Pure" }, why: { fr: "Rare et méridional.", en: "Rare and Mediterranean." } },

  // ==================== FILLES - ANGLAIS ====================
  { name: "Charlotte", gender: "girl", origin: "anglais", style: ["elegant", "classique"], meaningTags: ["force"], length: "long", meaning: { fr: "Femme libre", en: "Free woman" }, why: { fr: "Noble et royal.", en: "Noble and royal." } },
  { name: "Sophia", gender: "girl", origin: "anglais", style: ["elegant"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Sagesse", en: "Wisdom" }, why: { fr: "International et sage.", en: "International and wise." } },
  { name: "Elizabeth", gender: "girl", origin: "anglais", style: ["elegant", "classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Consacrée à Dieu", en: "Devoted to God" }, why: { fr: "Royal et intemporel.", en: "Royal and timeless." } },
  { name: "Grace", gender: "girl", origin: "anglais", style: ["court", "elegant"], meaningTags: ["grace"], length: "court", meaning: { fr: "Grâce", en: "Grace" }, why: { fr: "Court et gracieux.", en: "Short and graceful." } },
  { name: "Victoria", gender: "girl", origin: "anglais", style: ["elegant", "classique"], meaningTags: ["victoire"], length: "long", meaning: { fr: "Victoire", en: "Victory" }, why: { fr: "Royal et fier.", en: "Royal and proud." } },
  { name: "Eleanor", gender: "girl", origin: "anglais", style: ["elegant", "rare"], meaningTags: ["lumiere", "force"], length: "long", meaning: { fr: "Torche brillante", en: "Bright torch" }, why: { fr: "Noble et rare.", en: "Noble and rare." } },

  // ==================== FILLES - ARABE ====================
  { name: "Aisha", gender: "girl", origin: "arabe", style: ["elegant"], meaningTags: ["vie"], length: "moyen", meaning: { fr: "Vivante", en: "Living" }, why: { fr: "Vibrant et lumineux.", en: "Vibrant and luminous." } },
  { name: "Zainab", gender: "girl", origin: "arabe", style: ["elegant", "rare"], meaningTags: ["grâce"], length: "long", meaning: { fr: "Beauté de Dieu", en: "Beauty of God" }, why: { fr: "Gracieuse et rare.", en: "Gracious and rare." } },
  { name: "Fatima", gender: "girl", origin: "arabe", style: ["classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Celle qui s'abstient", en: "She who abstains" }, why: { fr: "Classique et respectueux.", en: "Classic and respectful." } },
  { name: "Noor", gender: "girl", origin: "arabe", style: ["court", "moderne"], meaningTags: ["lumiere"], length: "court", meaning: { fr: "Lumière", en: "Light" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },

  // ==================== FILLES - ITALIEN ====================
  { name: "Giulia", gender: "girl", origin: "italien", style: ["elegant"], meaningTags: ["jeunesse"], length: "long", meaning: { fr: "Jeune", en: "Young" }, why: { fr: "Méditerranéen et chic.", en: "Mediterranean and chic." } },
  { name: "Chiara", gender: "girl", origin: "italien", style: ["elegant", "moderne"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Clair, lumineux", en: "Clear, bright" }, why: { fr: "Lumineux et poétique.", en: "Luminous and poetic." } },
  { name: "Alessia", gender: "girl", origin: "italien", style: ["moderne"], meaningTags: ["defenseur"], length: "long", meaning: { fr: "Celle qui défend", en: "She who defends" }, why: { fr: "Moderne et fort.", en: "Modern and strong." } },
  { name: "Sofia", gender: "girl", origin: "italien", style: ["elegant"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Sagesse", en: "Wisdom" }, why: { fr: "Sage et internationale.", en: "Wise and international." } },

  // ==================== FILLES - ESPAGNOL ====================
  { name: "Isabella", gender: "girl", origin: "espagnol", style: ["elegant", "classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Consacrée à Dieu", en: "Devoted to God" }, why: { fr: "Noble et passionné.", en: "Noble and passionate." } },
  { name: "Carmen", gender: "girl", origin: "espagnol", style: ["elegant", "rare"], meaningTags: ["poésie"], length: "moyen", meaning: { fr: "Verger", en: "Vineyard" }, why: { fr: "Rare et musical.", en: "Rare and musical." } },
  { name: "Lucia", gender: "girl", origin: "espagnol", style: ["elegant"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Celle qui apporte la lumière", en: "She who brings light" }, why: { fr: "Lumineuse et douce.", en: "Luminous and soft." } },
  { name: "Matilda", gender: "girl", origin: "espagnol", style: ["elegant", "rare"], meaningTags: ["force"], length: "long", meaning: { fr: "Puissante au combat", en: "Mighty in battle" }, why: { fr: "Rare et fort.", en: "Rare and strong." } },

  // ==================== FILLES - GREC ====================
  { name: "Athena", gender: "girl", origin: "grec", style: ["elegant", "rare"], meaningTags: ["sagesse", "force"], length: "long", meaning: { fr: "Déesse de la sagesse", en: "Goddess of wisdom" }, why: { fr: "Légendaire et noble.", en: "Legendary and noble." } },
  { name: "Iris", gender: "girl", origin: "grec", style: ["court", "poetique"], meaningTags: ["lumiere"], length: "court", meaning: { fr: "Arc-en-ciel", en: "Rainbow" }, why: { fr: "Court et poétique.", en: "Short and poetic." } },
  { name: "Chloe", gender: "girl", origin: "grec", style: ["elegant", "moderne"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Jeune pousse", en: "Green shoot" }, why: { fr: "Frais et moderne.", en: "Fresh and modern." } },

  // ==================== FILLES - LATIN ====================
  { name: "Aurora", gender: "girl", origin: "latin", style: ["elegant", "poetique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Aurore, aube", en: "Dawn" }, why: { fr: "Poétique et lumineux.", en: "Poetic and luminous." } },
  { name: "Clara", gender: "girl", origin: "latin", style: ["elegant", "court"], meaningTags: ["lumiere", "clarté"], length: "moyen", meaning: { fr: "Clair, lumineux", en: "Clear, bright" }, why: { fr: "Clair et lumineux.", en: "Clear and bright." } },
  { name: "Viola", gender: "girl", origin: "latin", style: ["elegant", "rare"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Violette", en: "Violet" }, why: { fr: "Rare et littéraire.", en: "Rare and literary." } },
  { name: "Juliana", gender: "girl", origin: "latin", style: ["elegant"], meaningTags: ["jeunesse"], length: "long", meaning: { fr: "De Julia", en: "From Julius" }, why: { fr: "Élégante et jeune.", en: "Elegant and youthful." } },

  // ==================== MIXTE ====================
  { name: "Sacha", gender: "mixte", origin: "grec", style: ["court", "moderne"], meaningTags: ["courage"], length: "court", meaning: { fr: "Défenseur", en: "Defender" }, why: { fr: "Court et universel.", en: "Short and universal." } },
  { name: "Morgan", gender: "mixte", origin: "anglais", style: ["moderne"], meaningTags: ["force"], length: "moyen", meaning: { fr: "Grand et brillant", en: "Great and bright" }, why: { fr: "Moderne et fort.", en: "Modern and strong." } },
  { name: "Dominic", gender: "mixte", origin: "latin", style: ["elegant"], meaningTags: ["foi"], length: "long", meaning: { fr: "Consacré au Seigneur", en: "Devoted to the Lord" }, why: { fr: "Intemporel et universel.", en: "Timeless and universal." } },
  { name: "Riley", gender: "mixte", origin: "anglais", style: ["moderne", "court"], meaningTags: ["courage"], length: "moyen", meaning: { fr: "Courageux", en: "Courageous" }, why: { fr: "Moderne et audacieux.", en: "Modern and bold." } },
  { name: "Avery", gender: "mixte", origin: "anglais", style: ["moderne"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Roi des elfes", en: "Elf king" }, why: { fr: "Fantasque et moderne.", en: "Whimsical and modern." } },

  // ==================== PRÉNOMS SUPPLÉMENTAIRES ====================
  // GARÇONS
  { name: "Jérémie", gender: "boy", origin: "hebreu", style: ["elegant"], meaningTags: ["foi"], length: "long", meaning: { fr: "Dieu exalte", en: "God exalts" }, why: { fr: "Poétique et noble.", en: "Poetic and noble." } },
  { name: "Bastien", gender: "boy", origin: "francais", style: ["moderne"], meaningTags: ["force"], length: "long", meaning: { fr: "Vénéré", en: "Revered" }, why: { fr: "Moderne et affirmé.", en: "Modern and assertive." } },
  { name: "Adrien", gender: "boy", origin: "latin", style: ["elegant"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "De Hadria", en: "From Hadria" }, why: { fr: "Subtil et méditerranéen.", en: "Subtle and Mediterranean." } },
  { name: "Félix", gender: "boy", origin: "latin", style: ["court", "moderne"], meaningTags: ["joie"], length: "moyen", meaning: { fr: "Heureux", en: "Happy" }, why: { fr: "Court et joyeux.", en: "Short and cheerful." } },
  { name: "Léon", gender: "boy", origin: "grec", style: ["court"], meaningTags: ["force", "courage"], length: "court", meaning: { fr: "Lion", en: "Lion" }, why: { fr: "Court et puissant.", en: "Short and mighty." } },
  { name: "Gaston", gender: "boy", origin: "francais", style: ["classique", "rare"], meaningTags: ["force"], length: "long", meaning: { fr: "Hôte", en: "Guest" }, why: { fr: "Classique vintage.", en: "Classic vintage." } },
  { name: "Théodore", gender: "boy", origin: "grec", style: ["elegant", "rare"], meaningTags: ["foi", "force"], length: "long", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Rare et noble.", en: "Rare and noble." } },
  { name: "Siméon", gender: "boy", origin: "hebreu", style: ["elegant"], meaningTags: ["foi"], length: "long", meaning: { fr: "Dieu entend", en: "God hears" }, why: { fr: "Biblique et sage.", en: "Biblical and wise." } },
  { name: "Robin", gender: "boy", origin: "anglais", style: ["court", "moderne"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Renommée brillante", en: "Bright fame" }, why: { fr: "Naturel et léger.", en: "Natural and light." } },
  { name: "Apollon", gender: "boy", origin: "grec", style: ["rare", "poetique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Dieu du soleil", en: "God of the sun" }, why: { fr: "Mythologique et lumineux.", en: "Mythological and bright." } },
  { name: "Samuël", gender: "boy", origin: "hebreu", style: ["elegant"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Dieu a entendu", en: "God has heard" }, why: { fr: "Biblique et contemplatif.", en: "Biblical and contemplative." } },
  { name: "Théo", gender: "boy", origin: "grec", style: ["court", "moderne"], meaningTags: ["foi"], length: "court", meaning: { fr: "Divin", en: "Divine" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },
  { name: "Corentin", gender: "boy", origin: "francais", style: ["moderne"], meaningTags: ["force"], length: "long", meaning: { fr: "Tempête, ferme", en: "Storm, firm" }, why: { fr: "Breton et original.", en: "Breton and original." } },
  { name: "Enzo", gender: "boy", origin: "italien", style: ["court", "moderne"], meaningTags: ["force"], length: "court", meaning: { fr: "Maître de maison", en: "Master of house" }, why: { fr: "Court et charismatique.", en: "Short and charismatic." } },
  { name: "Matteo", gender: "boy", origin: "italien", style: ["elegant", "moderne"], meaningTags: ["foi"], length: "long", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Méditerranéen et chic.", en: "Mediterranean and chic." } },

  // FILLES
  { name: "Joséphine", gender: "girl", origin: "francais", style: ["elegant", "rare"], meaningTags: ["grace"], length: "long", meaning: { fr: "Dieu accroîtra", en: "God will increase" }, why: { fr: "Rare et romantique.", en: "Rare and romantic." } },
  { name: "Alice", gender: "girl", origin: "francais", style: ["elegant", "classique"], meaningTags: ["noblesse"], length: "moyen", meaning: { fr: "De noble lignée", en: "Of noble birth" }, why: { fr: "Intemporelle et délicate.", en: "Timeless and delicate." } },
  { name: "Madeleine", gender: "girl", origin: "francais", style: ["elegant", "rare"], meaningTags: ["grâce"], length: "long", meaning: { fr: "Femme de Magdala", en: "Woman of Magdala" }, why: { fr: "Rare et nostalgique.", en: "Rare and nostalgic." } },
  { name: "Margot", gender: "girl", origin: "francais", style: ["court", "moderne"], meaningTags: ["perle"], length: "court", meaning: { fr: "Perle", en: "Pearl" }, why: { fr: "Court et chic.", en: "Short and chic." } },
  { name: "Florence", gender: "girl", origin: "latin", style: ["elegant", "classique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Florissant", en: "Flourishing" }, why: { fr: "Classique et lumineux.", en: "Classic and bright." } },
  { name: "Rose", gender: "girl", origin: "latin", style: ["court", "poetique"], meaningTags: ["nature", "amour"], length: "court", meaning: { fr: "Fleur", en: "Flower" }, why: { fr: "Court et poétique.", en: "Short and poetic." } },
  { name: "Victoire", gender: "girl", origin: "francais", style: ["elegant"], meaningTags: ["victoire"], length: "long", meaning: { fr: "Victoire", en: "Victory" }, why: { fr: "Fier et affirmé.", en: "Proud and assertive." } },
  { name: "Anya", gender: "girl", origin: "hebreu", style: ["court", "moderne"], meaningTags: ["grace"], length: "court", meaning: { fr: "Grâce de Dieu", en: "Grace of God" }, why: { fr: "Court et moderne.", en: "Short and modern." } },
  { name: "Petra", gender: "girl", origin: "grec", style: ["elegant", "rare"], meaningTags: ["force"], length: "moyen", meaning: { fr: "La pierre", en: "The stone" }, why: { fr: "Rare et solide.", en: "Rare and strong." } },
  { name: "Nina", gender: "girl", origin: "espagnol", style: ["court", "moderne"], meaningTags: ["grace"], length: "court", meaning: { fr: "Petite fille", en: "Little girl" }, why: { fr: "Court et doux.", en: "Short and soft." } },
  { name: "Théa", gender: "girl", origin: "grec", style: ["court", "elegant"], meaningTags: ["divinité"], length: "court", meaning: { fr: "Déesse", en: "Goddess" }, why: { fr: "Court et mythique.", en: "Short and mythic." } },
  { name: "Romane", gender: "girl", origin: "francais", style: ["moderne"], meaningTags: ["force"], length: "long", meaning: { fr: "Romaine", en: "Roman" }, why: { fr: "Moderne et affirmée.", en: "Modern and strong." } },
  { name: "Estelle", gender: "girl", origin: "francais", style: ["elegant", "classique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Étoile", en: "Star" }, why: { fr: "Classique et lumineux.", en: "Classic and bright." } },
  { name: "Aline", gender: "girl", origin: "francais", style: ["elegant"], meaningTags: ["noblesse"], length: "moyen", meaning: { fr: "Lueur, noble", en: "Gleam, noble" }, why: { fr: "Élégante et légère.", en: "Elegant and light." } },
  { name: "Cécilia", gender: "girl", origin: "latin", style: ["elegant", "rare"], meaningTags: ["musique"], length: "long", meaning: { fr: "Celle qui est aveugle", en: "She who is blind" }, why: { fr: "Rare et musicale.", en: "Rare and musical." } },
];

