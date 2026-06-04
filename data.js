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
  { name: "Olivier", gender: "boy", origin: "francais", style: ["elegant", "classique"], meaningTags: ["amour"], length: "long", meaning: { fr: "Celui qui tient l'olivier", en: "He who holds the olive" }, why: { fr: "Pacifique et sage.", en: "Peaceful and wise." } },
  { name: "Mathieu", gender: "boy", origin: "francais", style: ["classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Classique fiable.", en: "Reliable classic." } },

  // ==================== GARÇONS - ANGLAIS ====================
  { name: "James", gender: "boy", origin: "anglais", style: ["classique", "elegant"], meaningTags: ["foi"], length: "moyen", meaning: { fr: "Celui qui supplante", en: "Supplanter" }, why: { fr: "International et noble.", en: "International and noble." } },
  { name: "William", gender: "boy", origin: "anglais", style: ["classique", "elegant"], meaningTags: ["force"], length: "long", meaning: { fr: "Guerrier volontaire", en: "Resolute warrior" }, why: { fr: "Royal et fort.", en: "Royal and strong." } },
  { name: "Henry", gender: "boy", origin: "anglais", style: ["classique"], meaningTags: ["force"], length: "moyen", meaning: { fr: "Maître de maison", en: "Master of the house" }, why: { fr: "Noble et distingué.", en: "Noble and distinguished." } },
  { name: "Oliver", gender: "boy", origin: "anglais", style: ["moderne", "elegant"], meaningTags: ["amour"], length: "long", meaning: { fr: "Olivier", en: "Olive" }, why: { fr: "Doux et chic.", en: "Soft and chic." } },
  { name: "Benjamin", gender: "boy", origin: "anglais", style: ["moderne"], meaningTags: ["foi"], length: "long", meaning: { fr: "Fils de la main droite", en: "Son of the right hand" }, why: { fr: "Moderne et bienveillant.", en: "Modern and benevolent." } },
  { name: "Charles", gender: "boy", origin: "anglais", style: ["classique"], meaningTags: ["force"], length: "long", meaning: { fr: "Homme libre", en: "Free man" }, why: { fr: "Royal et intemporel.", en: "Royal and timeless." } },
  { name: "George", gender: "boy", origin: "anglais", style: ["classique"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Agriculteur", en: "Farmer" }, why: { fr: "Classique robuste.", en: "Strong classic." } },
  { name: "Jack", gender: "boy", origin: "anglais", style: ["court", "moderne"], meaningTags: ["courage"], length: "court", meaning: { fr: "Dieu est gracieux", en: "God is gracious" }, why: { fr: "Court et audacieux.", en: "Short and bold." } },

  // ==================== GARÇONS - ARABE ====================
  { name: "Ali", gender: "boy", origin: "arabe", style: ["court", "classique"], meaningTags: ["force"], length: "court", meaning: { fr: "Le haut, le suprême", en: "The high, the supreme" }, why: { fr: "Court et fort.", en: "Short and strong." } },
  { name: "Omar", gender: "boy", origin: "arabe", style: ["court", "classique"], meaningTags: ["nature", "force"], length: "court", meaning: { fr: "Long-vivant", en: "Long-lived" }, why: { fr: "Court et vibrant.", en: "Short and vibrant." } },
  { name: "Hassan", gender: "boy", origin: "arabe", style: ["classique"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Beau", en: "Beautiful" }, why: { fr: "Gracieux et sage.", en: "Gracious and wise." } },
  { name: "Karim", gender: "boy", origin: "arabe", style: ["moderne"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Généreux", en: "Generous" }, why: { fr: "Noble et bienveillant.", en: "Noble and generous." } },
  { name: "Malik", gender: "boy", origin: "arabe", style: ["court", "moderne"], meaningTags: ["force"], length: "moyen", meaning: { fr: "Roi", en: "King" }, why: { fr: "Royal et affirm.", en: "Royal and bold." } },

  // ==================== GARÇONS - ITALIEN ====================
  { name: "Marco", gender: "boy", origin: "italien", style: ["elegant", "classique"], meaningTags: ["force"], length: "moyen", meaning: { fr: "Dédié à Mars", en: "Dedicated to Mars" }, why: { fr: "Méridional et chaleureux.", en: "Warm and Mediterranean." } },
  { name: "Antonio", gender: "boy", origin: "italien", style: ["elegant", "classique"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "De poids inestimable", en: "Priceless" }, why: { fr: "Noble et sonore.", en: "Noble and resonant." } },
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
  { name: "Nicolas", gender: "boy", origin: "grec", style: ["classique"], meaningTags: ["force"], length: "long", meaning: { fr: "Victoire du peuple", en: "Victory of the people" }, why: { fr: "Noble et classique.", en: "Noble and classic." } },
  { name: "Théo", gender: "boy", origin: "grec", style: ["moderne", "court"], meaningTags: ["foi"], length: "court", meaning: { fr: "Divin", en: "Divine" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },
  { name: "Grégoire", gender: "boy", origin: "grec", style: ["elegant", "rare"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Celui qui veille", en: "The watchman" }, why: { fr: "Sage et intemporel.", en: "Wise and timeless." } },

  // ==================== GARÇONS - LATIN ====================
  { name: "Victor", gender: "boy", origin: "latin", style: ["classique", "elegant"], meaningTags: ["force", "force"], length: "moyen", meaning: { fr: "Vainqueur", en: "Conqueror" }, why: { fr: "Fort et triomphant.", en: "Strong and triumphant." } },
  { name: "Valentin", gender: "boy", origin: "latin", style: ["elegant", "elegant"], meaningTags: ["amour", "force"], length: "long", meaning: { fr: "Fort et vigoureux", en: "Strong and vigorous" }, why: { fr: "Romantique et tendre.", en: "Romantic and tender." } },
  { name: "Maxime", gender: "boy", origin: "latin", style: ["moderne"], meaningTags: ["force"], length: "long", meaning: { fr: "Le plus grand", en: "The greatest" }, why: { fr: "Moderne et ambitieux.", en: "Modern and ambitious." } },

  // ==================== FILLES - HÉBREU ====================
  { name: "Léa", gender: "girl", origin: "hebreu", style: ["court", "elegant"], meaningTags: ["liberte"], length: "court", meaning: { fr: "Fatiguée", en: "Weary" }, why: { fr: "Court et gracieux.", en: "Short and graceful." } },
  { name: "Sarah", gender: "girl", origin: "hebreu", style: ["classique"], meaningTags: ["foi", "sagesse"], length: "moyen", meaning: { fr: "Princesse", en: "Princess" }, why: { fr: "Classique et noble.", en: "Classic and noble." } },
  { name: "Rachel", gender: "girl", origin: "hebreu", style: ["elegant", "classique"], meaningTags: ["amour"], length: "long", meaning: { fr: "Brebis", en: "Ewe" }, why: { fr: "Douce et poétique.", en: "Soft and poetic." } },
  { name: "Hannah", gender: "girl", origin: "hebreu", style: ["classique", "elegant"], meaningTags: ["amour", "foi"], length: "moyen", meaning: { fr: "Grâce de Dieu", en: "Grace of God" }, why: { fr: "Tendre et gracieuse.", en: "Tender and gracious." } },
  { name: "Miriam", gender: "girl", origin: "hebreu", style: ["elegant", "rare"], meaningTags: ["sagesse", "foi"], length: "long", meaning: { fr: "Celle qui aime", en: "She who loves" }, why: { fr: "Biblique et sage.", en: "Biblical and wise." } },
  { name: "Naomi", gender: "girl", origin: "hebreu", style: ["elegant", "poetique"], meaningTags: ["amour"], length: "moyen", meaning: { fr: "Ma douceur", en: "My sweetness" }, why: { fr: "Doux et poétique.", en: "Soft and poetic." } },

  // ==================== FILLES - FRANÇAIS ====================
  { name: "Marie", gender: "girl", origin: "francais", style: ["classique"], meaningTags: ["amour", "foi"], length: "moyen", meaning: { fr: "Aimée de Dieu", en: "Beloved of God" }, why: { fr: "Intemporelle et universelle.", en: "Timeless and universal." } },
  { name: "Sophie", gender: "girl", origin: "francais", style: ["elegant", "classique"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Sagesse", en: "Wisdom" }, why: { fr: "Gracieuse et sage.", en: "Gracious and wise." } },
  { name: "Emma", gender: "girl", origin: "francais", style: ["moderne", "court"], meaningTags: ["amour"], length: "court", meaning: { fr: "Entière, universelle", en: "Whole, universal" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },
  { name: "Chloé", gender: "girl", origin: "francais", style: ["elegant", "moderne"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Jeune pousse", en: "Green shoot" }, why: { fr: "Frais et joyeux.", en: "Fresh and joyful." } },
  { name: "Amélie", gender: "girl", origin: "francais", style: ["elegant", "moderne"], meaningTags: ["courage", "amour"], length: "long", meaning: { fr: "Travailleuse", en: "Worker" }, why: { fr: "Français typique et charmant.", en: "Typically French and charming." } },
  { name: "Isabelle", gender: "girl", origin: "francais", style: ["elegant", "classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Consacrée à Dieu", en: "Devoted to God" }, why: { fr: "Noble et distinguée.", en: "Noble and distinguished." } },
  { name: "Camille", gender: "girl", origin: "francais", style: ["moderne", "elegant"], meaningTags: ["amour"], length: "long", meaning: { fr: "Parfait", en: "Perfect" }, why: { fr: "Moderne et raffiné.", en: "Modern and refined." } },
  { name: "Inès", gender: "girl", origin: "francais", style: ["elegant", "rare"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Pure", en: "Pure" }, why: { fr: "Rare et méridional.", en: "Rare and Mediterranean." } },

  // ==================== FILLES - ANGLAIS ====================
  { name: "Charlotte", gender: "girl", origin: "anglais", style: ["elegant", "classique"], meaningTags: ["force"], length: "long", meaning: { fr: "Femme libre", en: "Free woman" }, why: { fr: "Noble et royal.", en: "Noble and royal." } },
  { name: "Sophia", gender: "girl", origin: "anglais", style: ["elegant"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Sagesse", en: "Wisdom" }, why: { fr: "International et sage.", en: "International and wise." } },
  { name: "Elizabeth", gender: "girl", origin: "anglais", style: ["elegant", "classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Consacrée à Dieu", en: "Devoted to God" }, why: { fr: "Royal et intemporel.", en: "Royal and timeless." } },
  { name: "Grace", gender: "girl", origin: "anglais", style: ["court", "elegant"], meaningTags: ["amour"], length: "court", meaning: { fr: "Grâce", en: "Grace" }, why: { fr: "Court et gracieux.", en: "Short and graceful." } },
  { name: "Victoria", gender: "girl", origin: "anglais", style: ["elegant", "classique"], meaningTags: ["force"], length: "long", meaning: { fr: "Victoire", en: "Victory" }, why: { fr: "Royal et fier.", en: "Royal and proud." } },
  { name: "Eleanor", gender: "girl", origin: "anglais", style: ["elegant", "rare"], meaningTags: ["lumiere", "force"], length: "long", meaning: { fr: "Torche brillante", en: "Bright torch" }, why: { fr: "Noble et rare.", en: "Noble and rare." } },

  // ==================== FILLES - ARABE ====================
  { name: "Aisha", gender: "girl", origin: "arabe", style: ["elegant"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Vivante", en: "Living" }, why: { fr: "Vibrant et lumineux.", en: "Vibrant and luminous." } },
  { name: "Zainab", gender: "girl", origin: "arabe", style: ["elegant", "rare"], meaningTags: ["amour"], length: "long", meaning: { fr: "Beauté de Dieu", en: "Beauty of God" }, why: { fr: "Gracieuse et rare.", en: "Gracious and rare." } },
  { name: "Fatima", gender: "girl", origin: "arabe", style: ["classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Celle qui s'abstient", en: "She who abstains" }, why: { fr: "Classique et respectueux.", en: "Classic and respectful." } },
  { name: "Noor", gender: "girl", origin: "arabe", style: ["court", "moderne"], meaningTags: ["lumiere"], length: "court", meaning: { fr: "Lumière", en: "Light" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },

  // ==================== FILLES - ITALIEN ====================
  { name: "Giulia", gender: "girl", origin: "italien", style: ["elegant"], meaningTags: ["liberte"], length: "long", meaning: { fr: "Jeune", en: "Young" }, why: { fr: "Méditerranéen et chic.", en: "Mediterranean and chic." } },
  { name: "Chiara", gender: "girl", origin: "italien", style: ["elegant", "moderne"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Clair, lumineux", en: "Clear, bright" }, why: { fr: "Lumineux et poétique.", en: "Luminous and poetic." } },
  { name: "Alessia", gender: "girl", origin: "italien", style: ["moderne"], meaningTags: ["courage"], length: "long", meaning: { fr: "Celle qui défend", en: "She who defends" }, why: { fr: "Moderne et fort.", en: "Modern and strong." } },
  { name: "Sofia", gender: "girl", origin: "italien", style: ["elegant"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Sagesse", en: "Wisdom" }, why: { fr: "Sage et internationale.", en: "Wise and international." } },

  // ==================== FILLES - ESPAGNOL ====================
  { name: "Isabella", gender: "girl", origin: "espagnol", style: ["elegant", "classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Consacrée à Dieu", en: "Devoted to God" }, why: { fr: "Noble et passionné.", en: "Noble and passionate." } },
  { name: "Carmen", gender: "girl", origin: "espagnol", style: ["elegant", "rare"], meaningTags: ["lumiere"], length: "moyen", meaning: { fr: "Verger", en: "Vineyard" }, why: { fr: "Rare et musical.", en: "Rare and musical." } },
  { name: "Lucia", gender: "girl", origin: "espagnol", style: ["elegant"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Celle qui apporte la lumière", en: "She who brings light" }, why: { fr: "Lumineuse et douce.", en: "Luminous and soft." } },
  { name: "Matilda", gender: "girl", origin: "espagnol", style: ["elegant", "rare"], meaningTags: ["force"], length: "long", meaning: { fr: "Puissante au combat", en: "Mighty in battle" }, why: { fr: "Rare et fort.", en: "Rare and strong." } },

  // ==================== FILLES - GREC ====================
  { name: "Athena", gender: "girl", origin: "grec", style: ["elegant", "rare"], meaningTags: ["sagesse", "force"], length: "long", meaning: { fr: "Déesse de la sagesse", en: "Goddess of wisdom" }, why: { fr: "Légendaire et noble.", en: "Legendary and noble." } },
  { name: "Iris", gender: "girl", origin: "grec", style: ["court", "poetique"], meaningTags: ["lumiere"], length: "court", meaning: { fr: "Arc-en-ciel", en: "Rainbow" }, why: { fr: "Court et poétique.", en: "Short and poetic." } },
  { name: "Chloe", gender: "girl", origin: "grec", style: ["elegant", "moderne"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Jeune pousse", en: "Green shoot" }, why: { fr: "Frais et moderne.", en: "Fresh and modern." } },

  // ==================== FILLES - LATIN ====================
  { name: "Aurora", gender: "girl", origin: "latin", style: ["elegant", "poetique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Aurore, aube", en: "Dawn" }, why: { fr: "Poétique et lumineux.", en: "Poetic and luminous." } },
  { name: "Clara", gender: "girl", origin: "latin", style: ["elegant", "court"], meaningTags: ["lumiere", "lumiere"], length: "moyen", meaning: { fr: "Clair, lumineux", en: "Clear, bright" }, why: { fr: "Clair et lumineux.", en: "Clear and bright." } },
  { name: "Viola", gender: "girl", origin: "latin", style: ["elegant", "rare"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Violette", en: "Violet" }, why: { fr: "Rare et littéraire.", en: "Rare and literary." } },
  { name: "Juliana", gender: "girl", origin: "latin", style: ["elegant"], meaningTags: ["liberte"], length: "long", meaning: { fr: "De Julia", en: "From Julius" }, why: { fr: "Élégante et jeune.", en: "Elegant and youthful." } },

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
  { name: "Félix", gender: "boy", origin: "latin", style: ["court", "moderne"], meaningTags: ["amour"], length: "moyen", meaning: { fr: "Heureux", en: "Happy" }, why: { fr: "Court et joyeux.", en: "Short and cheerful." } },
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
  { name: "Joséphine", gender: "girl", origin: "francais", style: ["elegant", "rare"], meaningTags: ["amour"], length: "long", meaning: { fr: "Dieu accroîtra", en: "God will increase" }, why: { fr: "Rare et romantique.", en: "Rare and romantic." } },
  { name: "Alice", gender: "girl", origin: "francais", style: ["elegant", "classique"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "De noble lignée", en: "Of noble birth" }, why: { fr: "Intemporelle et délicate.", en: "Timeless and delicate." } },
  { name: "Madeleine", gender: "girl", origin: "francais", style: ["elegant", "rare"], meaningTags: ["amour"], length: "long", meaning: { fr: "Femme de Magdala", en: "Woman of Magdala" }, why: { fr: "Rare et nostalgique.", en: "Rare and nostalgic." } },
  { name: "Margot", gender: "girl", origin: "francais", style: ["court", "moderne"], meaningTags: ["amour"], length: "court", meaning: { fr: "Perle", en: "Pearl" }, why: { fr: "Court et chic.", en: "Short and chic." } },
  { name: "Florence", gender: "girl", origin: "latin", style: ["elegant", "classique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Florissant", en: "Flourishing" }, why: { fr: "Classique et lumineux.", en: "Classic and bright." } },
  { name: "Rose", gender: "girl", origin: "latin", style: ["court", "poetique"], meaningTags: ["nature", "amour"], length: "court", meaning: { fr: "Fleur", en: "Flower" }, why: { fr: "Court et poétique.", en: "Short and poetic." } },
  { name: "Victoire", gender: "girl", origin: "francais", style: ["elegant"], meaningTags: ["force"], length: "long", meaning: { fr: "Victoire", en: "Victory" }, why: { fr: "Fier et affirmé.", en: "Proud and assertive." } },
  { name: "Anya", gender: "girl", origin: "hebreu", style: ["court", "moderne"], meaningTags: ["amour"], length: "court", meaning: { fr: "Grâce de Dieu", en: "Grace of God" }, why: { fr: "Court et moderne.", en: "Short and modern." } },
  { name: "Petra", gender: "girl", origin: "grec", style: ["elegant", "rare"], meaningTags: ["force"], length: "moyen", meaning: { fr: "La pierre", en: "The stone" }, why: { fr: "Rare et solide.", en: "Rare and strong." } },
  { name: "Nina", gender: "girl", origin: "espagnol", style: ["court", "moderne"], meaningTags: ["amour"], length: "court", meaning: { fr: "Petite fille", en: "Little girl" }, why: { fr: "Court et doux.", en: "Short and soft." } },
  { name: "Théa", gender: "girl", origin: "grec", style: ["court", "elegant"], meaningTags: ["foi"], length: "court", meaning: { fr: "Déesse", en: "Goddess" }, why: { fr: "Court et mythique.", en: "Short and mythic." } },
  { name: "Romane", gender: "girl", origin: "francais", style: ["moderne"], meaningTags: ["force"], length: "long", meaning: { fr: "Romaine", en: "Roman" }, why: { fr: "Moderne et affirmée.", en: "Modern and strong." } },
  { name: "Estelle", gender: "girl", origin: "francais", style: ["elegant", "classique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Étoile", en: "Star" }, why: { fr: "Classique et lumineux.", en: "Classic and bright." } },
  { name: "Aline", gender: "girl", origin: "francais", style: ["elegant"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Lueur, noble", en: "Gleam, noble" }, why: { fr: "Élégante et légère.", en: "Elegant and light." } },
  { name: "Cécilia", gender: "girl", origin: "latin", style: ["elegant", "rare"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Celle qui est aveugle", en: "She who is blind" }, why: { fr: "Rare et musicale.", en: "Rare and musical." } },

  // ==================== GARÇONS - HÉBREU (suite) ====================
  { name: "Élias", gender: "boy", origin: "hebreu", style: ["elegant", "classique"], meaningTags: ["foi", "force"], length: "moyen", meaning: { fr: "Mon Dieu est le Seigneur", en: "My God is the Lord" }, why: { fr: "Solide et spirituel.", en: "Solid and spiritual." } },
  { name: "Amos", gender: "boy", origin: "hebreu", style: ["court", "rare"], meaningTags: ["force", "courage"], length: "court", meaning: { fr: "Chargé, fort", en: "Strong, burdened" }, why: { fr: "Court et puissant, très rare.", en: "Short and powerful, very rare." } },
  { name: "Levi", gender: "boy", origin: "hebreu", style: ["moderne", "court"], meaningTags: ["amour", "foi"], length: "court", meaning: { fr: "Attachement", en: "Attachment" }, why: { fr: "Court et tendance.", en: "Short and trendy." } },
  { name: "Eli", gender: "boy", origin: "hebreu", style: ["court", "moderne"], meaningTags: ["foi", "lumiere"], length: "court", meaning: { fr: "Élévation", en: "Elevation" }, why: { fr: "Minimaliste et fort.", en: "Minimalist and strong." } },
  { name: "Tobias", gender: "boy", origin: "hebreu", style: ["rare", "elegant"], meaningTags: ["foi", "amour"], length: "long", meaning: { fr: "Dieu est bon", en: "God is good" }, why: { fr: "Rare et distingué.", en: "Rare and distinguished." } },
  { name: "Ezra", gender: "boy", origin: "hebreu", style: ["moderne", "rare"], meaningTags: ["sagesse", "foi"], length: "court", meaning: { fr: "Aide, secours", en: "Help, assistance" }, why: { fr: "Tendance et original.", en: "Trendy and original." } },

  // ==================== GARÇONS - FRANÇAIS (suite) ====================
  { name: "Théo", gender: "boy", origin: "francais", style: ["moderne", "court"], meaningTags: ["foi", "lumiere"], length: "court", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },
  { name: "Maxime", gender: "boy", origin: "francais", style: ["classique", "moderne"], meaningTags: ["force"], length: "long", meaning: { fr: "Le plus grand", en: "The greatest" }, why: { fr: "Solide et ambitieux.", en: "Solid and ambitious." } },
  { name: "Clément", gender: "boy", origin: "francais", style: ["classique", "elegant"], meaningTags: ["amour", "sagesse"], length: "long", meaning: { fr: "Doux, indulgent", en: "Gentle, merciful" }, why: { fr: "Doux et noble.", en: "Gentle and noble." } },
  { name: "Renaud", gender: "boy", origin: "francais", style: ["classique", "rare"], meaningTags: ["force", "courage"], length: "long", meaning: { fr: "Conseil fort", en: "Strong counsel" }, why: { fr: "Rare et robuste.", en: "Rare and robust." } },
  { name: "Édouard", gender: "boy", origin: "francais", style: ["classique", "elegant"], meaningTags: ["force", "sagesse"], length: "long", meaning: { fr: "Gardien des richesses", en: "Wealthy guardian" }, why: { fr: "Royal et élégant.", en: "Royal and elegant." } },
  { name: "Florian", gender: "boy", origin: "francais", style: ["poetique", "moderne"], meaningTags: ["nature", "lumiere"], length: "long", meaning: { fr: "Fleuri, florissant", en: "Blooming, flourishing" }, why: { fr: "Poétique et printanier.", en: "Poetic and spring-like." } },
  { name: "Baptiste", gender: "boy", origin: "francais", style: ["classique"], meaningTags: ["foi"], length: "long", meaning: { fr: "Celui qui baptise", en: "One who baptizes" }, why: { fr: "Classique et solide.", en: "Classic and solid." } },
  { name: "Bertrand", gender: "boy", origin: "francais", style: ["classique", "rare"], meaningTags: ["courage", "force"], length: "long", meaning: { fr: "Corbeau brillant", en: "Brilliant raven" }, why: { fr: "Rare et noble.", en: "Rare and noble." } },
  { name: "Armand", gender: "boy", origin: "francais", style: ["classique", "elegant"], meaningTags: ["force"], length: "long", meaning: { fr: "Homme de l'armée", en: "Army man" }, why: { fr: "Fort et élégant.", en: "Strong and elegant." } },

  // ==================== GARÇONS - ANGLAIS (suite) ====================
  { name: "Theodore", gender: "boy", origin: "anglais", style: ["classique", "elegant"], meaningTags: ["foi", "sagesse"], length: "long", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Noble et intemporel.", en: "Noble and timeless." } },
  { name: "Sebastian", gender: "boy", origin: "anglais", style: ["elegant", "moderne"], meaningTags: ["courage"], length: "long", meaning: { fr: "De Sébaste", en: "From Sebaste" }, why: { fr: "International et fort.", en: "International and strong." } },
  { name: "Finn", gender: "boy", origin: "anglais", style: ["court", "moderne"], meaningTags: ["nature", "liberte"], length: "court", meaning: { fr: "Blanc, juste", en: "Fair, white" }, why: { fr: "Court et naturel.", en: "Short and natural." } },
  { name: "Owen", gender: "boy", origin: "anglais", style: ["court", "classique"], meaningTags: ["sagesse"], length: "court", meaning: { fr: "Jeune guerrier", en: "Young warrior" }, why: { fr: "Court et fort.", en: "Short and strong." } },
  { name: "Liam", gender: "boy", origin: "anglais", style: ["court", "moderne"], meaningTags: ["force", "liberte"], length: "court", meaning: { fr: "Volonté forte", en: "Strong will" }, why: { fr: "Court et populaire.", en: "Short and popular." } },
  { name: "Elliot", gender: "boy", origin: "anglais", style: ["moderne", "elegant"], meaningTags: ["foi"], length: "long", meaning: { fr: "Mon Dieu est fort", en: "My God is strong" }, why: { fr: "Moderne et équilibré.", en: "Modern and balanced." } },
  { name: "Jasper", gender: "boy", origin: "anglais", style: ["rare", "poetique"], meaningTags: ["nature", "lumiere"], length: "moyen", meaning: { fr: "Pierre précieuse", en: "Precious stone" }, why: { fr: "Rare et poétique.", en: "Rare and poetic." } },
  { name: "Miles", gender: "boy", origin: "anglais", style: ["classique", "court"], meaningTags: ["courage"], length: "court", meaning: { fr: "Soldat", en: "Soldier" }, why: { fr: "Court et distingué.", en: "Short and distinguished." } },
  { name: "Rowan", gender: "boy", origin: "anglais", style: ["poetique", "moderne"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Petit roi rouge", en: "Little red one" }, why: { fr: "Naturel et poétique.", en: "Natural and poetic." } },

  // ==================== GARÇONS - ARABE (suite) ====================
  { name: "Youssef", gender: "boy", origin: "arabe", style: ["classique", "elegant"], meaningTags: ["foi"], length: "long", meaning: { fr: "Dieu accroît", en: "God increases" }, why: { fr: "Classique et universel.", en: "Classic and universal." } },
  { name: "Sami", gender: "boy", origin: "arabe", style: ["court", "moderne"], meaningTags: ["sagesse", "lumiere"], length: "court", meaning: { fr: "Élevé, sublime", en: "Elevated, sublime" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },
  { name: "Bilal", gender: "boy", origin: "arabe", style: ["classique", "court"], meaningTags: ["lumiere"], length: "moyen", meaning: { fr: "Eau fraîche", en: "Fresh water" }, why: { fr: "Doux et évocateur.", en: "Gentle and evocative." } },
  { name: "Rayan", gender: "boy", origin: "arabe", style: ["moderne", "court"], meaningTags: ["nature", "liberte"], length: "moyen", meaning: { fr: "Irrigué, verdoyant", en: "Irrigated, lush" }, why: { fr: "Moderne et frais.", en: "Modern and fresh." } },
  { name: "Mehdi", gender: "boy", origin: "arabe", style: ["classique"], meaningTags: ["foi", "sagesse"], length: "moyen", meaning: { fr: "Bien guidé", en: "Well guided" }, why: { fr: "Profond et spirituel.", en: "Deep and spiritual." } },

  // ==================== GARÇONS - ITALIEN (suite) ====================
  { name: "Lorenzo", gender: "boy", origin: "italien", style: ["elegant", "classique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Couronné de lauriers", en: "Crowned with laurels" }, why: { fr: "Chantant et noble.", en: "Melodious and noble." } },
  { name: "Marco", gender: "boy", origin: "italien", style: ["classique", "court"], meaningTags: ["force"], length: "moyen", meaning: { fr: "Dédié à Mars", en: "Dedicated to Mars" }, why: { fr: "Court et affirmé.", en: "Short and assertive." } },
  { name: "Matteo", gender: "boy", origin: "italien", style: ["moderne", "elegant"], meaningTags: ["foi"], length: "long", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Moderne et musical.", en: "Modern and musical." } },
  { name: "Luca", gender: "boy", origin: "italien", style: ["court", "moderne"], meaningTags: ["lumiere"], length: "court", meaning: { fr: "Lumière", en: "Light" }, why: { fr: "Court et lumineux.", en: "Short and bright." } },
  { name: "Enzo", gender: "boy", origin: "italien", style: ["court", "moderne"], meaningTags: ["force"], length: "court", meaning: { fr: "Chef de maison", en: "Ruler of home" }, why: { fr: "Court et dynamique.", en: "Short and dynamic." } },
  { name: "Nico", gender: "boy", origin: "italien", style: ["court", "moderne"], meaningTags: ["force", "liberte"], length: "court", meaning: { fr: "Victoire du peuple", en: "Victory of the people" }, why: { fr: "Court et moderne.", en: "Short and modern." } },

  // ==================== GARÇONS - ESPAGNOL (suite) ====================
  { name: "Carlos", gender: "boy", origin: "espagnol", style: ["classique"], meaningTags: ["force", "liberte"], length: "long", meaning: { fr: "Homme libre", en: "Free man" }, why: { fr: "International et solide.", en: "International and solid." } },
  { name: "Diego", gender: "boy", origin: "espagnol", style: ["moderne", "classique"], meaningTags: ["sagesse"], length: "moyen", meaning: { fr: "Il enseigne", en: "He teaches" }, why: { fr: "Méditerranéen et fort.", en: "Mediterranean and strong." } },
  { name: "Pablo", gender: "boy", origin: "espagnol", style: ["classique", "court"], meaningTags: ["liberte", "amour"], length: "moyen", meaning: { fr: "Petit", en: "Small" }, why: { fr: "Court et vivant.", en: "Short and lively." } },
  { name: "Alejandro", gender: "boy", origin: "espagnol", style: ["elegant", "classique"], meaningTags: ["force", "courage"], length: "long", meaning: { fr: "Défenseur des hommes", en: "Defender of men" }, why: { fr: "Sonnant et noble.", en: "Resounding and noble." } },
  { name: "Sergio", gender: "boy", origin: "espagnol", style: ["moderne", "classique"], meaningTags: ["courage"], length: "long", meaning: { fr: "Gardien", en: "Guardian" }, why: { fr: "Solide et méditerranéen.", en: "Solid and Mediterranean." } },

  // ==================== GARÇONS - GREC (suite) ====================
  { name: "Léonidas", gender: "boy", origin: "grec", style: ["rare", "elegant"], meaningTags: ["force", "courage"], length: "long", meaning: { fr: "Fils du lion", en: "Son of the lion" }, why: { fr: "Rare et puissant.", en: "Rare and powerful." } },
  { name: "Orion", gender: "boy", origin: "grec", style: ["poetique", "rare"], meaningTags: ["nature", "lumiere"], length: "moyen", meaning: { fr: "Chasseur céleste", en: "Heavenly hunter" }, why: { fr: "Poétique et mystérieux.", en: "Poetic and mysterious." } },
  { name: "Théodore", gender: "boy", origin: "grec", style: ["classique", "elegant"], meaningTags: ["foi"], length: "long", meaning: { fr: "Don de Dieu", en: "Gift of God" }, why: { fr: "Élégant et classique.", en: "Elegant and classic." } },
  { name: "Nikos", gender: "boy", origin: "grec", style: ["court", "moderne"], meaningTags: ["force"], length: "court", meaning: { fr: "Victoire du peuple", en: "Victory of the people" }, why: { fr: "Court et percutant.", en: "Short and impactful." } },
  { name: "Damon", gender: "boy", origin: "grec", style: ["rare", "moderne"], meaningTags: ["courage", "amour"], length: "moyen", meaning: { fr: "Celui qui dompte", en: "One who tames" }, why: { fr: "Rare et fort.", en: "Rare and strong." } },

  // ==================== GARÇONS - LATIN (suite) ====================
  { name: "Augustin", gender: "boy", origin: "latin", style: ["classique", "rare"], meaningTags: ["force", "sagesse"], length: "long", meaning: { fr: "Vénérable", en: "Venerable" }, why: { fr: "Rare et majestueux.", en: "Rare and majestic." } },
  { name: "Maximiliano", gender: "boy", origin: "latin", style: ["rare", "elegant"], meaningTags: ["force"], length: "long", meaning: { fr: "Le plus grand", en: "The greatest" }, why: { fr: "Grand et imposant.", en: "Grand and imposing." } },
  { name: "Fabien", gender: "boy", origin: "latin", style: ["classique", "elegant"], meaningTags: ["nature"], length: "long", meaning: { fr: "Celui qui cultive les fèves", en: "He who grows beans" }, why: { fr: "Classique et discret.", en: "Classic and discreet." } },
  { name: "Corentin", gender: "boy", origin: "latin", style: ["rare", "poetique"], meaningTags: ["nature", "liberte"], length: "long", meaning: { fr: "Cyclone, tourbillon", en: "Whirlwind" }, why: { fr: "Poétique et rare.", en: "Poetic and rare." } },
  { name: "Sylvain", gender: "boy", origin: "latin", style: ["classique", "poetique"], meaningTags: ["nature"], length: "long", meaning: { fr: "De la forêt", en: "Of the forest" }, why: { fr: "Naturel et discret.", en: "Natural and discreet." } },

  // ==================== MIXTE ====================
  { name: "Eden", gender: "mixte", origin: "hebreu", style: ["moderne", "court"], meaningTags: ["nature", "amour"], length: "court", meaning: { fr: "Délice, paradis", en: "Delight, paradise" }, why: { fr: "Court, doux et universel.", en: "Short, soft, and universal." } },
  { name: "Morgan", gender: "mixte", origin: "anglais", style: ["moderne"], meaningTags: ["nature", "liberte"], length: "moyen", meaning: { fr: "Né de la mer", en: "Born of the sea" }, why: { fr: "Moderne et ouvert.", en: "Modern and open." } },
  { name: "Charlie", gender: "mixte", origin: "anglais", style: ["moderne", "court"], meaningTags: ["liberte"], length: "long", meaning: { fr: "Homme libre", en: "Free man" }, why: { fr: "Populaire et chaleureux.", en: "Popular and warm." } },
  { name: "Sacha", gender: "mixte", origin: "grec", style: ["moderne", "court"], meaningTags: ["courage"], length: "moyen", meaning: { fr: "Défenseur de l'humanité", en: "Defender of humanity" }, why: { fr: "Universel et moderne.", en: "Universal and modern." } },
  { name: "Noa", gender: "mixte", origin: "hebreu", style: ["court", "moderne"], meaningTags: ["liberte", "amour"], length: "court", meaning: { fr: "Mouvement, repos", en: "Movement, rest" }, why: { fr: "Minimaliste et doux.", en: "Minimalist and gentle." } },
  { name: "Lou", gender: "mixte", origin: "francais", style: ["court", "moderne"], meaningTags: ["lumiere"], length: "court", meaning: { fr: "Guerrière de lumière", en: "Warrior of light" }, why: { fr: "Tout petit et lumineux.", en: "Tiny and bright." } },
  { name: "Robin", gender: "mixte", origin: "anglais", style: ["court", "poetique"], meaningTags: ["nature", "liberte"], length: "moyen", meaning: { fr: "Oiseau rouge", en: "Red bird" }, why: { fr: "Poétique et naturel.", en: "Poetic and natural." } },
  { name: "Alexis", gender: "mixte", origin: "grec", style: ["classique", "moderne"], meaningTags: ["courage"], length: "long", meaning: { fr: "Défenseur", en: "Defender" }, why: { fr: "Classique universel.", en: "Universal classic." } },

  // ==================== FILLES - HÉBREU (suite) ====================
  { name: "Déborah", gender: "girl", origin: "hebreu", style: ["classique", "rare"], meaningTags: ["sagesse", "courage"], length: "long", meaning: { fr: "Abeille", en: "Bee" }, why: { fr: "Rare et sage.", en: "Rare and wise." } },
  { name: "Miriam", gender: "girl", origin: "hebreu", style: ["classique", "rare"], meaningTags: ["liberte", "foi"], length: "long", meaning: { fr: "Aimée, exaltée", en: "Beloved, exalted" }, why: { fr: "Rare et spirituel.", en: "Rare and spiritual." } },
  { name: "Naomi", gender: "girl", origin: "hebreu", style: ["moderne", "elegant"], meaningTags: ["amour", "sagesse"], length: "moyen", meaning: { fr: "Douceur, plaisir", en: "Sweetness, pleasure" }, why: { fr: "Doux et international.", en: "Soft and international." } },
  { name: "Abigaïl", gender: "girl", origin: "hebreu", style: ["classique", "rare"], meaningTags: ["amour", "sagesse"], length: "long", meaning: { fr: "Source de joie", en: "Source of joy" }, why: { fr: "Rare et poétique.", en: "Rare and poetic." } },
  { name: "Siona", gender: "girl", origin: "hebreu", style: ["rare", "poetique"], meaningTags: ["foi", "liberte"], length: "moyen", meaning: { fr: "Colline de Sion", en: "Hill of Zion" }, why: { fr: "Rare et spirituel.", en: "Rare and spiritual." } },
  { name: "Lia", gender: "girl", origin: "hebreu", style: ["court", "moderne"], meaningTags: ["amour"], length: "court", meaning: { fr: "Fatiguée, délicate", en: "Weary, delicate" }, why: { fr: "Minimaliste et doux.", en: "Minimalist and gentle." } },

  // ==================== FILLES - FRANÇAIS (suite) ====================
  { name: "Nathalie", gender: "girl", origin: "francais", style: ["classique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Née à Noël", en: "Born at Christmas" }, why: { fr: "Classique et lumineux.", en: "Classic and bright." } },
  { name: "Élodie", gender: "girl", origin: "francais", style: ["poetique", "elegant"], meaningTags: ["lumiere", "amour"], length: "long", meaning: { fr: "Richesse étrangère", en: "Foreign wealth" }, why: { fr: "Poétique et mélodieux.", en: "Poetic and melodious." } },
  { name: "Élise", gender: "girl", origin: "francais", style: ["classique", "elegant"], meaningTags: ["foi", "amour"], length: "moyen", meaning: { fr: "Mon Dieu est serment", en: "My God is oath" }, why: { fr: "Élégante et classique.", en: "Elegant and classic." } },
  { name: "Colette", gender: "girl", origin: "francais", style: ["classique", "rare"], meaningTags: ["liberte"], length: "long", meaning: { fr: "Victoire du peuple", en: "Victory of the people" }, why: { fr: "Rare et français vintage.", en: "Rare and vintage French." } },
  { name: "Brigitte", gender: "girl", origin: "francais", style: ["classique", "rare"], meaningTags: ["force"], length: "long", meaning: { fr: "Force, vigueur", en: "Strength, vigor" }, why: { fr: "Classique avec du caractère.", en: "Classic with character." } },
  { name: "Diane", gender: "girl", origin: "francais", style: ["elegant", "classique"], meaningTags: ["nature", "lumiere"], length: "moyen", meaning: { fr: "Divine", en: "Divine" }, why: { fr: "Royal et clair.", en: "Royal and clear." } },
  { name: "Lucie", gender: "girl", origin: "francais", style: ["classique", "moderne"], meaningTags: ["lumiere"], length: "moyen", meaning: { fr: "Lumière", en: "Light" }, why: { fr: "Lumineux et facile.", en: "Bright and easy." } },
  { name: "Manon", gender: "girl", origin: "francais", style: ["court", "moderne"], meaningTags: ["amour", "foi"], length: "moyen", meaning: { fr: "Aimée de Dieu", en: "Beloved of God" }, why: { fr: "Court et charmant.", en: "Short and charming." } },
  { name: "Viviane", gender: "girl", origin: "francais", style: ["poetique", "elegant"], meaningTags: ["nature", "liberte"], length: "long", meaning: { fr: "Vivante", en: "Living" }, why: { fr: "Poétique et rare.", en: "Poetic and rare." } },
  { name: "Bertille", gender: "girl", origin: "francais", style: ["rare", "elegant"], meaningTags: ["force"], length: "long", meaning: { fr: "Brillante combattante", en: "Brilliant fighter" }, why: { fr: "Très rare, élégant.", en: "Very rare, elegant." } },

  // ==================== FILLES - ANGLAIS (suite) ====================
  { name: "Violet", gender: "girl", origin: "anglais", style: ["poetique", "elegant"], meaningTags: ["nature", "amour"], length: "moyen", meaning: { fr: "Violette", en: "Violet flower" }, why: { fr: "Poétique et rare.", en: "Poetic and rare." } },
  { name: "Aurora", gender: "girl", origin: "anglais", style: ["poetique", "rare"], meaningTags: ["lumiere", "nature"], length: "long", meaning: { fr: "Aube", en: "Dawn" }, why: { fr: "Lumineux et poétique.", en: "Luminous and poetic." } },
  { name: "Penelope", gender: "girl", origin: "anglais", style: ["classique", "elegant"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Tisserande", en: "Weaver" }, why: { fr: "Classique et raffiné.", en: "Classic and refined." } },
  { name: "Lily", gender: "girl", origin: "anglais", style: ["court", "poetique"], meaningTags: ["nature", "amour"], length: "court", meaning: { fr: "Fleur de lys", en: "Lily flower" }, why: { fr: "Court et naturel.", en: "Short and natural." } },
  { name: "Hazel", gender: "girl", origin: "anglais", style: ["poetique", "rare"], meaningTags: ["nature", "sagesse"], length: "moyen", meaning: { fr: "Noisetier", en: "Hazel tree" }, why: { fr: "Naturel et poétique.", en: "Natural and poetic." } },
  { name: "Ivy", gender: "girl", origin: "anglais", style: ["court", "poetique"], meaningTags: ["nature", "liberte"], length: "court", meaning: { fr: "Lierre", en: "Ivy plant" }, why: { fr: "Court et symbolique.", en: "Short and symbolic." } },
  { name: "Eleanor", gender: "girl", origin: "anglais", style: ["classique", "elegant"], meaningTags: ["lumiere", "sagesse"], length: "long", meaning: { fr: "Lumière brillante", en: "Shining light" }, why: { fr: "Royal et intemporel.", en: "Royal and timeless." } },
  { name: "Stella", gender: "girl", origin: "anglais", style: ["poetique", "moderne"], meaningTags: ["lumiere"], length: "moyen", meaning: { fr: "Étoile", en: "Star" }, why: { fr: "Stellaire et moderne.", en: "Stellar and modern." } },
  { name: "Maeve", gender: "girl", origin: "anglais", style: ["rare", "court"], meaningTags: ["liberte", "courage"], length: "court", meaning: { fr: "Enivrante", en: "Intoxicating" }, why: { fr: "Court et mystérieux.", en: "Short and mysterious." } },
  { name: "Scarlett", gender: "girl", origin: "anglais", style: ["moderne", "elegant"], meaningTags: ["courage", "amour"], length: "long", meaning: { fr: "Rouge vif", en: "Bright red" }, why: { fr: "Moderne et affirmé.", en: "Modern and assertive." } },

  // ==================== FILLES - ARABE (suite) ====================
  { name: "Lina", gender: "girl", origin: "arabe", style: ["court", "moderne"], meaningTags: ["amour", "nature"], length: "court", meaning: { fr: "Jeune palmier", en: "Young palm tree" }, why: { fr: "Court et doux.", en: "Short and gentle." } },
  { name: "Nour", gender: "girl", origin: "arabe", style: ["court", "poetique"], meaningTags: ["lumiere"], length: "court", meaning: { fr: "Lumière", en: "Light" }, why: { fr: "Minimaliste et lumineux.", en: "Minimalist and bright." } },
  { name: "Yasmine", gender: "girl", origin: "arabe", style: ["elegant", "poetique"], meaningTags: ["nature", "amour"], length: "long", meaning: { fr: "Fleur de jasmin", en: "Jasmine flower" }, why: { fr: "Poétique et parfumé.", en: "Poetic and fragrant." } },
  { name: "Hana", gender: "girl", origin: "arabe", style: ["court", "moderne"], meaningTags: ["amour", "lumiere"], length: "court", meaning: { fr: "Bonheur, fleur", en: "Happiness, flower" }, why: { fr: "Court et universel.", en: "Short and universal." } },
  { name: "Maryam", gender: "girl", origin: "arabe", style: ["classique", "elegant"], meaningTags: ["foi", "amour"], length: "long", meaning: { fr: "Aimée, exaltée", en: "Beloved, exalted" }, why: { fr: "Spirituel et doux.", en: "Spiritual and gentle." } },
  { name: "Salma", gender: "girl", origin: "arabe", style: ["court", "moderne"], meaningTags: ["amour", "sagesse"], length: "moyen", meaning: { fr: "Paix, sérénité", en: "Peace, serenity" }, why: { fr: "Doux et équilibré.", en: "Gentle and balanced." } },

  // ==================== FILLES - ITALIEN (suite) ====================
  { name: "Chiara", gender: "girl", origin: "italien", style: ["elegant", "classique"], meaningTags: ["lumiere"], length: "moyen", meaning: { fr: "Lumineuse, claire", en: "Clear, bright" }, why: { fr: "Lumineux et italien.", en: "Bright and Italian." } },
  { name: "Beatrice", gender: "girl", origin: "italien", style: ["elegant", "classique"], meaningTags: ["amour", "lumiere"], length: "long", meaning: { fr: "Celle qui rend heureux", en: "She who brings happiness" }, why: { fr: "Classique et rayonnant.", en: "Classic and radiant." } },
  { name: "Fiamma", gender: "girl", origin: "italien", style: ["rare", "poetique"], meaningTags: ["lumiere", "amour"], length: "moyen", meaning: { fr: "Flamme", en: "Flame" }, why: { fr: "Rare et ardent.", en: "Rare and fiery." } },
  { name: "Serena", gender: "girl", origin: "italien", style: ["elegant", "moderne"], meaningTags: ["amour", "sagesse"], length: "long", meaning: { fr: "Sereine, calme", en: "Serene, calm" }, why: { fr: "Calme et raffiné.", en: "Calm and refined." } },
  { name: "Valentina", gender: "girl", origin: "italien", style: ["elegant"], meaningTags: ["amour", "force"], length: "long", meaning: { fr: "Courageuse, forte", en: "Courageous, strong" }, why: { fr: "Sonnant et romantique.", en: "Resounding and romantic." } },

  // ==================== FILLES - ESPAGNOL (suite) ====================
  { name: "Luna", gender: "girl", origin: "espagnol", style: ["poetique", "moderne"], meaningTags: ["nature", "lumiere"], length: "court", meaning: { fr: "Lune", en: "Moon" }, why: { fr: "Poétique et naturel.", en: "Poetic and natural." } },
  { name: "Isabella", gender: "girl", origin: "espagnol", style: ["classique", "elegant"], meaningTags: ["foi", "amour"], length: "long", meaning: { fr: "Mon Dieu est serment", en: "My God is oath" }, why: { fr: "Royal et romantique.", en: "Royal and romantic." } },
  { name: "Natalia", gender: "girl", origin: "espagnol", style: ["elegant", "classique"], meaningTags: ["lumiere"], length: "long", meaning: { fr: "Née à Noël", en: "Born at Christmas" }, why: { fr: "Lumineux et chantant.", en: "Bright and melodious." } },
  { name: "Camila", gender: "girl", origin: "espagnol", style: ["moderne"], meaningTags: ["nature"], length: "long", meaning: { fr: "Servante cérémonielle", en: "Ceremonial servant" }, why: { fr: "Moderne et méditerranéen.", en: "Modern and Mediterranean." } },

  // ==================== FILLES - GREC (suite) ====================
  { name: "Athéna", gender: "girl", origin: "grec", style: ["rare", "elegant"], meaningTags: ["sagesse", "courage"], length: "long", meaning: { fr: "Déesse de la sagesse", en: "Goddess of wisdom" }, why: { fr: "Rare et puissant.", en: "Rare and powerful." } },
  { name: "Iris", gender: "girl", origin: "grec", style: ["court", "poetique"], meaningTags: ["nature", "lumiere"], length: "court", meaning: { fr: "Arc-en-ciel", en: "Rainbow" }, why: { fr: "Court et coloré.", en: "Short and colorful." } },
  { name: "Phébe", gender: "girl", origin: "grec", style: ["rare", "poetique"], meaningTags: ["lumiere"], length: "moyen", meaning: { fr: "Lumineuse", en: "Radiant" }, why: { fr: "Rare et poétique.", en: "Rare and poetic." } },
  { name: "Lyra", gender: "girl", origin: "grec", style: ["rare", "poetique"], meaningTags: ["lumiere", "amour"], length: "court", meaning: { fr: "Lyre, instrument", en: "Lyre instrument" }, why: { fr: "Poétique et musical.", en: "Poetic and musical." } },
  { name: "Penéloppe", gender: "girl", origin: "grec", style: ["elegant", "rare"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Tisserande", en: "Weaver" }, why: { fr: "Classique et profond.", en: "Classic and deep." } },
  { name: "Callie", gender: "girl", origin: "grec", style: ["court", "moderne"], meaningTags: ["amour", "lumiere"], length: "moyen", meaning: { fr: "Belle", en: "Beautiful" }, why: { fr: "Court et rayonnant.", en: "Short and radiant." } },

  // ==================== FILLES - LATIN (suite) ====================
  { name: "Aurore", gender: "girl", origin: "latin", style: ["poetique", "elegant"], meaningTags: ["lumiere", "nature"], length: "long", meaning: { fr: "Aube", en: "Dawn" }, why: { fr: "Poétique et lumineux.", en: "Poetic and luminous." } },
  { name: "Flore", gender: "girl", origin: "latin", style: ["court", "poetique"], meaningTags: ["nature"], length: "court", meaning: { fr: "Fleur", en: "Flower" }, why: { fr: "Court et naturel.", en: "Short and natural." } },
  { name: "Camille", gender: "girl", origin: "latin", style: ["moderne", "elegant"], meaningTags: ["sagesse"], length: "long", meaning: { fr: "Parfait", en: "Perfect" }, why: { fr: "Moderne et raffiné.", en: "Modern and refined." } },
  { name: "Diana", gender: "girl", origin: "latin", style: ["classique", "elegant"], meaningTags: ["nature", "liberte"], length: "moyen", meaning: { fr: "Déesse de la chasse", en: "Goddess of the hunt" }, why: { fr: "Noble et libre.", en: "Noble and free." } },
  { name: "Maxine", gender: "girl", origin: "latin", style: ["moderne", "court"], meaningTags: ["force"], length: "long", meaning: { fr: "La plus grande", en: "The greatest" }, why: { fr: "Moderne et affirmé.", en: "Modern and assertive." } },
  { name: "Fauna", gender: "girl", origin: "latin", style: ["rare", "poetique"], meaningTags: ["nature"], length: "moyen", meaning: { fr: "Déesse des forêts", en: "Goddess of forests" }, why: { fr: "Très rare et naturel.", en: "Very rare and natural." } },
  { name: "Lavinia", gender: "girl", origin: "latin", style: ["rare", "elegant"], meaningTags: ["liberte", "amour"], length: "long", meaning: { fr: "De Latium", en: "From Latium" }, why: { fr: "Rare et sonore.", en: "Rare and resonant." } },
];

