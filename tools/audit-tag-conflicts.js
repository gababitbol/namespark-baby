const fs = require("fs");
const g = {};
eval(fs.readFileSync("/Users/gabrielabitbol/VS/namespark-baby/data.js","utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;

/* Approche conservatrice : on ne retire un tag QUE si la signification contient
   un mot directement CONTRADICTOIRE au theme — jamais juste "absence de preuve".
   Ex: tague "joie" mais la signification dit "tristesse" -> conflit reel.
   On ne touche PAS aux tags juste parce qu'aucun mot du champ lexical n'apparait
   (une relation semantique non-litterale peut etre legitime). */
const CONTRADICTIONS = {
  joie:       [/\btrist(e|esse)\b/i, /\bchagrin\b/i, /\bmalheur\b/i, /\bdouleur\b/i, /\bpleurs?\b/i, /\bafflig[ée]e?\b/i],
  paix:       [/\bguerre\b/i, /\bcombat(tant)?\b/i, /\bviolen(t|ce)\b/i, /\bbataille\b/i],
  amour:      [/\bha(i|î)ne?\b/i, /\bd[ée]test[ée]e?\b/i, /\brejet[ée]e?\b/i],
  beaute:     [/\blaid(e)?\b/i, /\bhideu(x|se)\b/i],
  espoir:     [/\bd[ée]sespoir\b/i, /\bd[ée]sesp[ée]r[ée]e?\b/i],
  courage:    [/\bl[âa]che\b/i, /\bpeureu(x|se)\b/i, /\bcraintif\b/i, /\bcouard(e)?\b/i],
  force:      [/\bfaible\b/i, /\bfaiblesse\b/i, /\bfragile\b/i],
  sagesse:    [/\bfolie\b/i, /\bsot(te)?\b/i, /\binsens[ée]e?\b/i, /\bimprudent(e)?\b/i],
  liberte:    [/\bcaptif(ve)?\b/i, /\besclave\b/i, /\bprisonni[èe]re?\b/i, /\bencha[îi]n[ée]e?\b/i],
  noblesse:   [/\bhumble\b/i, /\bmodeste\b/i, /\bhonteu(x|se)\b/i],
  lumiere:    [/\bobscur(e|it[ée])\b/i, /\bt[ée]n[èe]bres\b/i, /\bsombre\b/i],
  victoire:   [/\bd[ée]faite\b/i, /\bvaincu(e)?\b/i, /\bperdant(e)?\b/i],
  prosperite: [/\bpauvret[ée]\b/i, /\bmisere\b/i, /\bruine\b/i],
};

const conflicts = [];
NAMES.forEach(n => {
  n.meaningTags.forEach(tag => {
    const patterns = CONTRADICTIONS[tag];
    if (!patterns) return;
    if (patterns.some(re => re.test(n.meaning.fr))) {
      conflicts.push({ name: n.name, origin: n.origin, meaning: n.meaning.fr, conflictTag: tag, allTags: n.meaningTags });
    }
  });
});

console.log("=== AUDIT DE COHERENCE DES TAGS ===");
console.log("Prenoms verifies:", NAMES.length);
console.log("Conflits reels detectes (contradiction directe, pas absence de preuve):", conflicts.length);
console.log("");
conflicts.forEach(c => console.log(" ", c.name.padEnd(15), "|", ("\""+c.meaning+"\"").padEnd(30), "| tag conteste:", c.conflictTag, "| tous les tags:", c.allTags.join(",")));

fs.writeFileSync("/tmp/tag_conflicts_report.json", JSON.stringify(conflicts, null, 1));
