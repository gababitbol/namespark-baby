/* =============================================================
   NameSpark Baby — Base de données locale de prénoms (MODE DÉMO)
   -------------------------------------------------------------
   ⚠️  IMPORTANT
   Cette liste sert UNIQUEMENT au mode démo, pour faire fonctionner
   le générateur sans appeler aucune API (donc sans clé API dans le
   frontend). Plus tard, cette génération locale sera remplacée par
   un appel à une fonction backend sécurisée (voir api/generate.js
   et la fonction generateViaBackend() dans app.js).

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
  // ---------------------- GARÇONS ----------------------
  {
    name: "Gabriel", gender: "boy", origin: "hebreu",
    style: ["classique", "elegant"], meaningTags: ["force", "foi"], length: "moyen",
    meaning: { fr: "Dieu est ma force", en: "God is my strength" },
    why: {
      fr: "Facile à prononcer dans plusieurs langues, intemporel et fort.",
      en: "Easy to pronounce across languages, timeless and strong."
    }
  },
  {
    name: "Noah", gender: "boy", origin: "hebreu",
    style: ["moderne", "court"], meaningTags: ["foi", "liberte"], length: "court",
    meaning: { fr: "Repos, apaisement", en: "Rest, peace" },
    why: {
      fr: "Doux, court et très international, idéal pour un prénom moderne.",
      en: "Soft, short and very international, ideal for a modern name."
    }
  },
  {
    name: "Adam", gender: "boy", origin: "hebreu",
    style: ["classique", "court"], meaningTags: ["nature", "foi"], length: "court",
    meaning: { fr: "L'homme, la terre", en: "Man, earth" },
    why: {
      fr: "Universel et sobre, il traverse les cultures sans effort.",
      en: "Universal and understated, it crosses cultures effortlessly."
    }
  },
  {
    name: "Raphaël", gender: "boy", origin: "hebreu",
    style: ["elegant", "poetique"], meaningTags: ["foi", "lumiere"], length: "long",
    meaning: { fr: "Dieu guérit", en: "God heals" },
    why: {
      fr: "Élégant et lumineux, avec une vraie noblesse sonore.",
      en: "Elegant and luminous, with a genuinely noble sound."
    }
  },
  {
    name: "Nathan", gender: "boy", origin: "hebreu",
    style: ["classique", "moderne"], meaningTags: ["foi"], length: "moyen",
    meaning: { fr: "Don de Dieu", en: "Gift of God" },
    why: {
      fr: "Équilibré entre tradition et modernité, simple à porter.",
      en: "Balanced between tradition and modernity, easy to carry."
    }
  },
  {
    name: "Ethan", gender: "boy", origin: "hebreu",
    style: ["moderne"], meaningTags: ["force", "courage"], length: "moyen",
    meaning: { fr: "Solide, constant", en: "Firm, steadfast" },
    why: {
      fr: "Moderne et affirmé, il évoque la solidité et la constance.",
      en: "Modern and assertive, it evokes strength and steadiness."
    }
  },
  {
    name: "Léon", gender: "boy", origin: "latin",
    style: ["classique", "court"], meaningTags: ["force", "courage"], length: "court",
    meaning: { fr: "Lion", en: "Lion" },
    why: {
      fr: "Court mais puissant, un classique qui revient en force.",
      en: "Short yet powerful, a classic making a strong comeback."
    }
  },
  {
    name: "Lucas", gender: "boy", origin: "latin",
    style: ["classique", "moderne"], meaningTags: ["lumiere"], length: "moyen",
    meaning: { fr: "Lumineux, né à l'aube", en: "Bright, born at dawn" },
    why: {
      fr: "Doux et lumineux, c'est une valeur sûre très appréciée.",
      en: "Soft and luminous, a reliable and well-loved choice."
    }
  },
  {
    name: "Maxime", gender: "boy", origin: "latin",
    style: ["classique"], meaningTags: ["force"], length: "moyen",
    meaning: { fr: "Le plus grand", en: "The greatest" },
    why: {
      fr: "Affirmé et rassurant, il porte une belle ambition.",
      en: "Assertive and reassuring, it carries quiet ambition."
    }
  },
  {
    name: "Marius", gender: "boy", origin: "latin",
    style: ["rare", "classique"], meaningTags: ["force", "courage"], length: "moyen",
    meaning: { fr: "Viril, voué à Mars", en: "Manly, dedicated to Mars" },
    why: {
      fr: "Rare et chaleureux, il a un charme méditerranéen affirmé.",
      en: "Rare and warm, with a distinct Mediterranean charm."
    }
  },
  {
    name: "Félix", gender: "boy", origin: "latin",
    style: ["classique", "elegant"], meaningTags: ["amour", "liberte"], length: "moyen",
    meaning: { fr: "Heureux, chanceux", en: "Happy, lucky" },
    why: {
      fr: "Joyeux et raffiné, il porte une promesse de bonheur.",
      en: "Joyful and refined, it carries a promise of happiness."
    }
  },
  {
    name: "Liam", gender: "boy", origin: "anglais",
    style: ["moderne", "court"], meaningTags: ["courage", "force"], length: "court",
    meaning: { fr: "Protecteur déterminé", en: "Resolute protector" },
    why: {
      fr: "Très court et percutant, ultra populaire à l'international.",
      en: "Very short and punchy, hugely popular worldwide."
    }
  },
  {
    name: "Owen", gender: "boy", origin: "anglais",
    style: ["rare", "court"], meaningTags: ["courage"], length: "court",
    meaning: { fr: "Jeune guerrier, bien né", en: "Young warrior, well-born" },
    why: {
      fr: "Rare en français, doux à l'oreille et facile à écrire.",
      en: "Rare in French, gentle on the ear and easy to spell."
    }
  },
  {
    name: "Tom", gender: "boy", origin: "anglais",
    style: ["court", "moderne"], meaningTags: ["foi"], length: "court",
    meaning: { fr: "Jumeau", en: "Twin" },
    why: {
      fr: "Minimaliste et direct, parfait pour un prénom court et net.",
      en: "Minimalist and direct, perfect for a short, clean name."
    }
  },
  {
    name: "Théo", gender: "boy", origin: "grec",
    style: ["moderne", "court"], meaningTags: ["foi"], length: "court",
    meaning: { fr: "Don de Dieu / divin", en: "Gift of God / divine" },
    why: {
      fr: "Court, doux et tendance, il plaît immédiatement.",
      en: "Short, soft and trendy, instantly likeable."
    }
  },
  {
    name: "Alexandre", gender: "boy", origin: "grec",
    style: ["classique", "elegant"], meaningTags: ["force", "courage"], length: "long",
    meaning: { fr: "Celui qui protège les hommes", en: "Protector of mankind" },
    why: {
      fr: "Noble et majestueux, un grand classique qui inspire le respect.",
      en: "Noble and majestic, a grand classic that commands respect."
    }
  },
  {
    name: "Matteo", gender: "boy", origin: "italien",
    style: ["moderne", "elegant"], meaningTags: ["foi"], length: "moyen",
    meaning: { fr: "Don de Dieu", en: "Gift of God" },
    why: {
      fr: "Chantant et chaleureux, il apporte une touche italienne raffinée.",
      en: "Melodic and warm, with a refined Italian touch."
    }
  },
  {
    name: "Enzo", gender: "boy", origin: "italien",
    style: ["moderne", "court"], meaningTags: ["force"], length: "court",
    meaning: { fr: "Maître du foyer", en: "Ruler of the home" },
    why: {
      fr: "Énergique et court, un prénom moderne plein de caractère.",
      en: "Energetic and short, a modern name full of character."
    }
  },
  {
    name: "Diego", gender: "boy", origin: "espagnol",
    style: ["moderne", "elegant"], meaningTags: ["sagesse"], length: "moyen",
    meaning: { fr: "Savant, instruit", en: "Learned, taught" },
    why: {
      fr: "Solaire et affirmé, il porte une belle énergie hispanique.",
      en: "Sunny and assertive, with a warm Hispanic energy."
    }
  },
  {
    name: "Pablo", gender: "boy", origin: "espagnol",
    style: ["classique"], meaningTags: ["sagesse"], length: "moyen",
    meaning: { fr: "Petit, humble", en: "Small, humble" },
    why: {
      fr: "Chaleureux et artistique, il évoque douceur et caractère.",
      en: "Warm and artistic, evoking both softness and character."
    }
  },
  {
    name: "Omar", gender: "boy", origin: "arabe",
    style: ["classique", "court"], meaningTags: ["liberte", "force"], length: "court",
    meaning: { fr: "Florissant, qui vit longtemps", en: "Flourishing, long-lived" },
    why: {
      fr: "Sobre et puissant, il sonne fort dans toutes les langues.",
      en: "Understated and powerful, it sounds strong in every language."
    }
  },
  {
    name: "Adib", gender: "boy", origin: "arabe",
    style: ["rare", "elegant"], meaningTags: ["sagesse"], length: "moyen",
    meaning: { fr: "Cultivé, raffiné", en: "Cultured, refined" },
    why: {
      fr: "Rare et distingué, il évoque l'esprit et l'élégance.",
      en: "Rare and distinguished, evoking wit and elegance."
    }
  },
  {
    name: "Anas", gender: "boy", origin: "arabe",
    style: ["court", "moderne"], meaningTags: ["amour"], length: "court",
    meaning: { fr: "Compagnon aimable, sociable", en: "Friendly companion" },
    why: {
      fr: "Doux et chaleureux, il respire la convivialité.",
      en: "Soft and warm, it radiates friendliness."
    }
  },
  {
    name: "Hugo", gender: "boy", origin: "francais",
    style: ["classique", "court"], meaningTags: ["sagesse"], length: "court",
    meaning: { fr: "Esprit, intelligence", en: "Mind, intelligence" },
    why: {
      fr: "Court et solide, un classique français toujours élégant.",
      en: "Short and solid, a French classic that stays elegant."
    }
  },
  {
    name: "Aaron", gender: "boy", origin: "hebreu",
    style: ["classique"], meaningTags: ["force", "foi"], length: "moyen",
    meaning: { fr: "Montagnard, élevé", en: "Mountain of strength, exalted" },
    why: {
      fr: "Ancien et noble, il évoque la hauteur et la stabilité.",
      en: "Ancient and noble, it evokes height and stability."
    }
  },

  // ---------------------- FILLES ----------------------
  {
    name: "Emma", gender: "girl", origin: "anglais",
    style: ["moderne", "court"], meaningTags: ["force"], length: "court",
    meaning: { fr: "Universelle, forte", en: "Whole, universal, strong" },
    why: {
      fr: "Court, doux et universel, un prénom intemporel et solide.",
      en: "Short, soft and universal, a timeless and solid name."
    }
  },
  {
    name: "Léa", gender: "girl", origin: "hebreu",
    style: ["court", "moderne"], meaningTags: ["nature"], length: "court",
    meaning: { fr: "Délicate, gazelle", en: "Delicate, gazelle" },
    why: {
      fr: "Très court et fluide, gracieux et facile à porter.",
      en: "Very short and flowing, graceful and easy to wear."
    }
  },
  {
    name: "Chloé", gender: "girl", origin: "grec",
    style: ["elegant", "poetique"], meaningTags: ["nature"], length: "moyen",
    meaning: { fr: "Jeune pousse verdoyante", en: "Young green shoot" },
    why: {
      fr: "Frais et poétique, il évoque le renouveau et la nature.",
      en: "Fresh and poetic, evoking renewal and nature."
    }
  },
  {
    name: "Sarah", gender: "girl", origin: "hebreu",
    style: ["classique"], meaningTags: ["sagesse"], length: "moyen",
    meaning: { fr: "Princesse, souveraine", en: "Princess, noblewoman" },
    why: {
      fr: "Intemporel et doux, il porte une noblesse tranquille.",
      en: "Timeless and gentle, it carries a quiet nobility."
    }
  },
  {
    name: "Anna", gender: "girl", origin: "hebreu",
    style: ["classique", "court"], meaningTags: ["foi", "amour"], length: "court",
    meaning: { fr: "Grâce, faveur", en: "Grace, favour" },
    why: {
      fr: "Symétrique et limpide, il sonne joliment partout.",
      en: "Symmetrical and clear, it sounds lovely everywhere."
    }
  },
  {
    name: "Louise", gender: "girl", origin: "francais",
    style: ["classique", "elegant"], meaningTags: ["courage"], length: "moyen",
    meaning: { fr: "Guerrière illustre", en: "Renowned warrior" },
    why: {
      fr: "Rétro-chic et raffiné, il revient en grande tendance.",
      en: "Retro-chic and refined, strongly back in fashion."
    }
  },
  {
    name: "Alice", gender: "girl", origin: "francais",
    style: ["classique", "elegant"], meaningTags: ["sagesse", "lumiere"], length: "moyen",
    meaning: { fr: "Noble, de haute naissance", en: "Noble, of nobility" },
    why: {
      fr: "Délicat et littéraire, il garde une fraîcheur intemporelle.",
      en: "Delicate and literary, with a timeless freshness."
    }
  },
  {
    name: "Manon", gender: "girl", origin: "francais",
    style: ["moderne"], meaningTags: ["amour"], length: "moyen",
    meaning: { fr: "Grâce (dérivé de Marie)", en: "Grace (from Marie)" },
    why: {
      fr: "Très français, doux et chantant, simple et charmant.",
      en: "Very French, soft and melodic, simple and charming."
    }
  },
  {
    name: "Jade", gender: "girl", origin: "francais",
    style: ["moderne", "court"], meaningTags: ["nature"], length: "court",
    meaning: { fr: "La pierre précieuse", en: "The precious stone" },
    why: {
      fr: "Minéral et court, moderne avec une touche apaisante.",
      en: "Mineral and short, modern with a soothing touch."
    }
  },
  {
    name: "Rose", gender: "girl", origin: "latin",
    style: ["classique", "poetique"], meaningTags: ["amour", "nature"], length: "court",
    meaning: { fr: "La fleur, la rose", en: "The flower, the rose" },
    why: {
      fr: "Court et romantique, un classique floral qui ne vieillit pas.",
      en: "Short and romantic, a floral classic that never ages."
    }
  },
  {
    name: "Clara", gender: "girl", origin: "latin",
    style: ["classique", "elegant"], meaningTags: ["lumiere"], length: "moyen",
    meaning: { fr: "Claire, lumineuse", en: "Clear, bright" },
    why: {
      fr: "Lumineux et limpide, il évoque la clarté et la douceur.",
      en: "Bright and clear, evoking light and gentleness."
    }
  },
  {
    name: "Stella", gender: "girl", origin: "latin",
    style: ["elegant", "poetique"], meaningTags: ["lumiere"], length: "moyen",
    meaning: { fr: "Étoile", en: "Star" },
    why: {
      fr: "Céleste et raffiné, il brille par sa simplicité poétique.",
      en: "Celestial and refined, it shines with poetic simplicity."
    }
  },
  {
    name: "Aurora", gender: "girl", origin: "latin",
    style: ["poetique", "elegant"], meaningTags: ["lumiere"], length: "long",
    meaning: { fr: "Aurore, lumière du matin", en: "Dawn, morning light" },
    why: {
      fr: "Lyrique et lumineux, il évoque le commencement et l'espoir.",
      en: "Lyrical and luminous, evoking beginnings and hope."
    }
  },
  {
    name: "Olivia", gender: "girl", origin: "latin",
    style: ["classique", "elegant"], meaningTags: ["nature", "liberte"], length: "long",
    meaning: { fr: "L'olivier, symbole de paix", en: "Olive tree, symbol of peace" },
    why: {
      fr: "Doux et élégant, très international avec un fond paisible.",
      en: "Soft and elegant, very international with a peaceful core."
    }
  },
  {
    name: "Sofia", gender: "girl", origin: "grec",
    style: ["elegant"], meaningTags: ["sagesse"], length: "moyen",
    meaning: { fr: "Sagesse", en: "Wisdom" },
    why: {
      fr: "Gracieux et universel, il rayonne d'intelligence et de douceur.",
      en: "Graceful and universal, radiating wisdom and softness."
    }
  },
  {
    name: "Iris", gender: "girl", origin: "grec",
    style: ["poetique", "rare", "court"], meaningTags: ["nature", "lumiere"], length: "court",
    meaning: { fr: "Arc-en-ciel, la fleur", en: "Rainbow, the flower" },
    why: {
      fr: "Court et poétique, rare et coloré, plein de fraîcheur.",
      en: "Short and poetic, rare and colourful, full of freshness."
    }
  },
  {
    name: "Giulia", gender: "girl", origin: "italien",
    style: ["elegant"], meaningTags: ["amour"], length: "moyen",
    meaning: { fr: "Jeune, juvénile", en: "Youthful" },
    why: {
      fr: "Mélodieux et raffiné, il apporte une élégance italienne.",
      en: "Melodic and refined, bringing an Italian elegance."
    }
  },
  {
    name: "Mila", gender: "girl", origin: "italien",
    style: ["moderne", "court"], meaningTags: ["amour"], length: "court",
    meaning: { fr: "Chère, aimée", en: "Dear, beloved" },
    why: {
      fr: "Court et tendre, moderne et très facile à porter.",
      en: "Short and tender, modern and very easy to wear."
    }
  },
  {
    name: "Inès", gender: "girl", origin: "espagnol",
    style: ["elegant", "classique"], meaningTags: ["lumiere", "sagesse"], length: "moyen",
    meaning: { fr: "Pure, chaste", en: "Pure, chaste" },
    why: {
      fr: "Raffiné et lumineux, il allie pureté et caractère.",
      en: "Refined and luminous, blending purity and character."
    }
  },
  {
    name: "Nour", gender: "girl", origin: "arabe",
    style: ["poetique", "court"], meaningTags: ["lumiere"], length: "court",
    meaning: { fr: "Lumière", en: "Light" },
    why: {
      fr: "Court et lumineux, doux et hautement symbolique.",
      en: "Short and luminous, soft and deeply symbolic."
    }
  },
  {
    name: "Yasmine", gender: "girl", origin: "arabe",
    style: ["elegant", "poetique"], meaningTags: ["nature"], length: "long",
    meaning: { fr: "Fleur de jasmin", en: "Jasmine flower" },
    why: {
      fr: "Parfumé et élégant, il évoque la délicatesse florale.",
      en: "Fragrant and elegant, evoking floral delicacy."
    }
  },
  {
    name: "Lina", gender: "girl", origin: "arabe",
    style: ["court", "moderne"], meaningTags: ["nature", "amour"], length: "court",
    meaning: { fr: "Tendre, jeune palmier", en: "Tender, young palm" },
    why: {
      fr: "Court et fluide, doux et facile dans toutes les langues.",
      en: "Short and flowing, gentle and easy in every language."
    }
  },
  {
    name: "Maya", gender: "girl", origin: "grec",
    style: ["moderne", "court"], meaningTags: ["nature"], length: "court",
    meaning: { fr: "Mère nourricière, déesse du printemps", en: "Nurturing mother, goddess of spring" },
    why: {
      fr: "Doux et solaire, court et universel, plein de fraîcheur.",
      en: "Soft and sunny, short and universal, full of freshness."
    }
  },

  // ---------------------- MIXTES (UNISEXES) ----------------------
  {
    name: "Camille", gender: "mixte", origin: "latin",
    style: ["classique", "elegant"], meaningTags: ["foi"], length: "moyen",
    meaning: { fr: "Jeune assistant des cérémonies", en: "Young ceremonial attendant" },
    why: {
      fr: "Élégant et unisexe, il convient aussi bien aux filles qu'aux garçons.",
      en: "Elegant and unisex, equally fitting for girls and boys."
    }
  },
  {
    name: "Noa", gender: "mixte", origin: "hebreu",
    style: ["moderne", "court"], meaningTags: ["liberte"], length: "court",
    meaning: { fr: "Mouvement, tremblement", en: "Movement, motion" },
    why: {
      fr: "Ultra-court et moderne, neutre et facile à porter.",
      en: "Ultra-short and modern, neutral and easy to wear."
    }
  },
  {
    name: "Sasha", gender: "mixte", origin: "grec",
    style: ["moderne"], meaningTags: ["courage", "force"], length: "moyen",
    meaning: { fr: "Défenseur de l'humanité", en: "Defender of mankind" },
    why: {
      fr: "Dynamique et international, unisexe et plein de caractère.",
      en: "Dynamic and international, unisex and full of character."
    }
  },
  {
    name: "Andrea", gender: "mixte", origin: "italien",
    style: ["elegant"], meaningTags: ["courage"], length: "moyen",
    meaning: { fr: "Courageux, viril", en: "Brave, manly" },
    why: {
      fr: "Doux et élégant, populaire au masculin comme au féminin.",
      en: "Soft and elegant, popular for both boys and girls."
    }
  },
  {
    name: "Alix", gender: "mixte", origin: "francais",
    style: ["rare", "court", "elegant"], meaningTags: ["sagesse"], length: "court",
    meaning: { fr: "Noble (forme ancienne d'Alice)", en: "Noble (old form of Alice)" },
    why: {
      fr: "Rare, court et chic, un unisexe au charme aristocratique.",
      en: "Rare, short and chic, a unisex name with aristocratic charm."
    }
  }
];

// Exposé en global pour pouvoir l'utiliser sans bundler (ouverture directe du HTML).
window.NAMES = NAMES;
