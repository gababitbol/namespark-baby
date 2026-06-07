/* Modèle de lot. Copier puis remplir.
   Champs requis par prénom : name, gender(boy|girl|mixte), fr, en, tags[1-3].
   Optionnels : style[1-3] (défaut ["classique"]), variants[], pronunciation, why{fr,en}.
   length + why sont remplis automatiquement par add-batch.js si absents.
   Tags valides : force, courage, sagesse, lumiere, nature, liberte, foi, amour,
   paix, victoire, joie, beaute, espoir, noblesse, grace, prosperite. */
module.exports = {
  origin: "exemple",
  names: [
    // { name: "Nom", gender: "boy", fr: "Sens FR", en: "EN meaning", tags: ["force"], style: ["classique"] },
  ],
};
