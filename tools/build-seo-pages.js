#!/usr/bin/env node
/* =============================================================
   build-seo-pages.js — Génère une page SEO statique par prénom
   Sortie : /prenom/<slug>.html  (servies en /prenom/<slug> via cleanUrls)
            + /sitemap.xml
   Usage : node tools/build-seo-pages.js
   Source : data.js (aucune dépendance). À relancer après chaque
   gros enrichissement de la base.
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "prenom");
const DOMAIN = "https://namespark.baby";

const g = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;

const ORIGINS = { hebreu:"hébraïque", francais:"française", anglais:"anglaise", arabe:"arabe", italien:"italienne", espagnol:"espagnole", grec:"grecque", latin:"latine", nordique:"nordique", irlandais:"irlandaise", japonais:"japonaise", slave:"slave", sanskrit:"sanskrite", persan:"persane", africain:"africaine", portugais:"portugaise", coreen:"coréenne", chinois:"chinoise", gallois:"galloise", basque:"basque", armenien:"arménienne", georgien:"géorgienne" };
const STYLES = { classique:"classique", moderne:"moderne", rare:"rare", elegant:"élégant", court:"court", poetique:"poétique" };
const GENDER = { boy:"masculin", girl:"féminin", mixte:"mixte" };
const GENDER_ART = { boy:"un prénom masculin", girl:"un prénom féminin", mixte:"un prénom mixte" };
const LENGTHS = { court:"court", moyen:"de longueur moyenne", long:"long" };

// Contexte rédactionnel par origine — sert à donner à chaque page
// un paragraphe de fond réellement informatif plutôt qu'une fiche nue.
const ORIGIN_DESC = {
  hebreu:"Les prénoms hébraïques comptent parmi les plus anciens encore portés aujourd'hui. Ils sont presque toujours construits sur une racine porteuse de sens, souvent liée au divin, à la force ou à une qualité morale — ce qui explique que leur signification soit aussi limpide.",
  francais:"Les prénoms français puisent à la fois dans le fonds latin, le christianisme médiéval et les langues régionales. Beaucoup ont traversé les siècles en changeant de forme, ce qui leur donne aujourd'hui une sonorité familière et intemporelle.",
  anglais:"Les prénoms anglais mêlent héritage anglo-saxon, normand et biblique. Leur diffusion internationale en fait des choix faciles à porter au-delà des frontières, sans difficulté de prononciation.",
  arabe:"Les prénoms arabes se distinguent par la clarté de leur sens : la plupart sont des mots courants de la langue, choisis pour la qualité ou la vertu qu'ils désignent. Leur musicalité repose sur des sonorités pleines et rythmées.",
  italien:"Les prénoms italiens descendent en droite ligne du latin, adouci par des terminaisons vocaliques. Ils gardent une chaleur et une rondeur sonore très reconnaissables.",
  espagnol:"Les prénoms espagnols associent racines latines et influence catholique, souvent enrichies par l'histoire andalouse. Ils se caractérisent par des finales sonores et une grande facilité de prononciation.",
  grec:"Les prénoms grecs sont parmi les plus imagés : chacun décrit généralement une qualité, un élément naturel ou une figure mythologique. Ils ont irrigué toute l'onomastique européenne.",
  latin:"Les prénoms latins sont à la source d'une grande partie des prénoms européens actuels. Sobres et construits sur des racines transparentes, ils évoquent souvent une vertu ou un rang.",
  nordique:"Les prénoms nordiques viennent du vieux norrois et de la tradition scandinave. Ils évoquent fréquemment la nature, la protection ou le combat, dans des formes courtes et affirmées.",
  irlandais:"Les prénoms irlandais sont issus du gaélique et portent souvent une charge poétique forte, liée au paysage, à la lumière ou aux légendes celtiques. Leur graphie garde volontiers une trace de la langue d'origine.",
  japonais:"Les prénoms japonais tirent leur sens des caractères qui les composent, ce qui permet à une même sonorité de porter plusieurs significations. Les thèmes de la nature et des saisons y sont très présents.",
  slave:"Les prénoms slaves sont généralement formés de deux racines assemblées — gloire, paix, monde, amour — ce qui leur donne un sens explicite et souvent solennel.",
  sanskrit:"Les prénoms sanskrits proviennent de l'une des plus anciennes langues écrites. Chacun renvoie à une notion précise, fréquemment spirituelle ou cosmique, portée par une sonorité ample.",
  persan:"Les prénoms persans s'appuient sur une longue tradition littéraire et poétique. Ils évoquent volontiers la lumière, la beauté ou la noblesse, avec une élégance sonore particulière.",
  africain:"Les prénoms africains couvrent une grande diversité de langues et de cultures. Beaucoup racontent une circonstance de naissance, un souhait adressé à l'enfant ou une qualité attendue de lui.",
  portugais:"Les prénoms portugais partagent le fonds latin commun aux langues romanes, avec des sonorités plus douces et des finales nasales caractéristiques.",
  coreen:"Les prénoms coréens sont composés d'éléments porteurs de sens, souvent choisis pour exprimer un souhait de réussite, de vertu ou de beauté adressé à l'enfant.",
  chinois:"Les prénoms chinois sont construits caractère par caractère, chacun apportant sa signification propre. Le choix relève autant du sens que de l'équilibre sonore avec le nom de famille.",
  gallois:"Les prénoms gallois viennent d'une langue celtique restée vivante. Ils évoquent souvent des éléments naturels ou des figures des légendes arthuriennes, dans des formes très musicales.",
  basque:"Les prénoms basques appartiennent à une langue sans parenté connue, ce qui leur donne des sonorités uniques en Europe. Beaucoup sont liés à la nature ou aux lieux du Pays basque.",
  armenien:"Les prénoms arméniens s'enracinent dans une tradition chrétienne très ancienne et dans une langue à l'alphabet propre. Ils portent fréquemment une idée de force ou de fidélité.",
  georgien:"Les prénoms géorgiens proviennent d'une langue caucasienne singulière, marquée par une longue histoire chrétienne. Leurs sonorités, peu répandues ailleurs, les rendent immédiatement distinctifs."
};

const STYLE_DESC = {
  classique:"un prénom installé, qui ne dépend pas des modes",
  moderne:"un prénom dans l'air du temps, porté par les générations récentes",
  rare:"un prénom peu répandu, que votre enfant a peu de chances de partager en classe",
  elegant:"un prénom à la sonorité soignée, qui reste distingué à l'âge adulte",
  court:"un prénom bref, facile à retenir et à prononcer",
  poetique:"un prénom à la musicalité douce, évocatrice"
};

const THEMES = { amour:"l'amour", beaute:"la beauté", courage:"le courage", espoir:"l'espoir", foi:"la foi", force:"la force", grace:"la grâce", joie:"la joie", liberte:"la liberté", lumiere:"la lumière", nature:"la nature", noblesse:"la noblesse", paix:"la paix", prosperite:"la prospérité", sagesse:"la sagesse", victoire:"la victoire" };

const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const slugify = (name) => name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const listFr = (arr) => arr.length <= 1 ? (arr[0]||"") : arr.slice(0,-1).join(", ") + " et " + arr[arr.length-1];

/* Prénoms proches : le genre est un FILTRE, pas un simple bonus.
   Un prénom mixte reste compatible avec les deux genres. */
function similar(ref, all, limit = 14) {
  return all
    .filter(n => {
      if (n.name === ref.name) return false;
      if (ref.gender !== "mixte" && n.gender !== "mixte" && n.gender !== ref.gender) return false;
      return true;
    })
    .map(n => {
      let s = 0;
      if (n.origin === ref.origin) s += 3;
      s += n.style.filter(x => ref.style.includes(x)).length * 2;
      s += n.meaningTags.filter(m => ref.meaningTags.includes(m)).length;
      if (n.length === ref.length) s += 1;
      return { n, s };
    })
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s || a.n.name.localeCompare(b.n.name, "fr"))
    .slice(0, limit)
    .map(x => x.n);
}

/* Deux maillages complémentaires : même origine, et même thème de
   signification. Objectif : élargir le maillage interne au-delà du
   seul bloc "similaires" pour aider l'exploration par Google. */
function byFacet(ref, all, predicate, exclude, limit = 10) {
  const seen = new Set(exclude.map(n => n.name));
  return all
    .filter(n => n.name !== ref.name && !seen.has(n.name) && predicate(n))
    .filter(n => ref.gender === "mixte" || n.gender === "mixte" || n.gender === ref.gender)
    .sort((a, b) => a.name.localeCompare(b.name, "fr"))
    .slice(0, limit);
}

function chips(list) {
  return `<div class="chips">${list.map(s => `<a class="chip" href="/prenom/${slugify(s.name)}">${esc(s.name)}</a>`).join("")}</div>`;
}

function page(n, all) {
  const slug = slugify(n.name);
  const origine = ORIGINS[n.origin] || n.origin;
  const genre = GENDER[n.gender] || n.gender;
  const meaningFr = n.meaning.fr;
  const styleFr = n.style.map(s => STYLES[s] || s).join(", ");
  const title = `${n.name} : signification, origine et style du prénom`;
  const desc = `${n.name} est ${GENDER_ART[n.gender]} d'origine ${origine}. Signification : ${meaningFr}. Découvrez son style, ses variantes et des prénoms similaires sur NameSpark Baby.`;
  const url = `${DOMAIN}/prenom/${slug}`;
  const letters = n.name.replace(/[^A-Za-zÀ-ÿ]/g, "").length;

  const variants = (n.variants && n.variants.length)
    ? `<p><strong>Variantes :</strong> ${esc(n.variants.join(", "))}</p>` : "";

  const sims = similar(n, all, 14);
  const sameOrigin = byFacet(n, all, x => x.origin === n.origin, sims, 10);
  const mainTag = n.meaningTags[0];
  const sameTheme = mainTag
    ? byFacet(n, all, x => x.meaningTags.includes(mainTag), sims.concat(sameOrigin), 10)
    : [];

  const themeList = listFr(n.meaningTags.map(t => THEMES[t] || t));
  const styleList = listFr(n.style.map(s => STYLE_DESC[s]).filter(Boolean));
  const originDesc = ORIGIN_DESC[n.origin] || "";

  // Paragraphes de fond — construits uniquement à partir des données réelles
  const intro = `<p>${esc(n.name)} est ${GENDER_ART[n.gender]} d'origine ${origine}, dont la signification est «&nbsp;${esc(meaningFr)}&nbsp;». Avec ses ${letters} lettres, c'est un prénom ${LENGTHS[n.length] || n.length}${styleList ? `, que l'on peut décrire comme ${styleList}` : ""}.</p>`;
  const originPara = originDesc ? `<h2>L'origine ${origine} du prénom ${esc(n.name)}</h2><p>${originDesc}</p>` : "";
  const themePara = themeList
    ? `<h2>Ce que le prénom ${esc(n.name)} évoque</h2><p>La signification de ${esc(n.name)} — «&nbsp;${esc(meaningFr)}&nbsp;» — le rattache aux thèmes suivants&nbsp;: ${themeList}. ${esc(n.why.fr)}</p>`
    : "";

  const simsHTML = sims.length ? `<h2>Prénoms similaires à ${esc(n.name)}</h2>
      <p>Ces prénoms partagent avec ${esc(n.name)} son origine, son style ou sa signification.</p>
      ${chips(sims)}` : "";
  const originHTML = sameOrigin.length ? `<h2>Autres prénoms d'origine ${origine}</h2>${chips(sameOrigin)}` : "";
  const themeHTML = sameTheme.length ? `<h2>Prénoms évoquant ${THEMES[mainTag] || mainTag}</h2>${chips(sameTheme)}` : "";

  // --- Données structurées ---
  const jsonld = {
    "@context":"https://schema.org","@type":"DefinedTerm",
    "name":n.name,"description":`${n.name} — ${meaningFr} (origine ${origine}, prénom ${genre})`,
    "inDefinedTermSet":`${DOMAIN}/`
  };
  const breadcrumb = {
    "@context":"https://schema.org","@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Accueil","item":`${DOMAIN}/`},
      {"@type":"ListItem","position":2,"name":"Prénoms","item":`${DOMAIN}/prenom/`},
      {"@type":"ListItem","position":3,"name":n.name,"item":url}
    ]
  };
  const faq = {
    "@context":"https://schema.org","@type":"FAQPage",
    "mainEntity":[
      {"@type":"Question","name":`Quelle est la signification du prénom ${n.name} ?`,
       "acceptedAnswer":{"@type":"Answer","text":`${n.name} signifie « ${meaningFr} ».`}},
      {"@type":"Question","name":`Quelle est l'origine du prénom ${n.name} ?`,
       "acceptedAnswer":{"@type":"Answer","text":`${n.name} est un prénom d'origine ${origine}.`}},
      {"@type":"Question","name":`${n.name} est-il un prénom de fille ou de garçon ?`,
       "acceptedAnswer":{"@type":"Answer","text":`${n.name} est ${GENDER_ART[n.gender]}.`}}
    ]
  };

  const faqHTML = `<h2>Questions fréquentes sur le prénom ${esc(n.name)}</h2>
      <h3>Quelle est la signification du prénom ${esc(n.name)} ?</h3>
      <p>${esc(n.name)} signifie «&nbsp;${esc(meaningFr)}&nbsp;».</p>
      <h3>Quelle est l'origine du prénom ${esc(n.name)} ?</h3>
      <p>${esc(n.name)} est un prénom d'origine ${origine}.</p>
      <h3>${esc(n.name)} est-il un prénom de fille ou de garçon ?</h3>
      <p>${esc(n.name)} est ${GENDER_ART[n.gender]}.</p>
      <h3>Combien de lettres compte le prénom ${esc(n.name)} ?</h3>
      <p>${esc(n.name)} compte ${letters} lettres, ce qui en fait un prénom ${LENGTHS[n.length] || n.length}.</p>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)} | NameSpark Baby</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(n.name)} — ${esc(meaningFr)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${DOMAIN}/og-image.png" />
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
  <script type="application/ld+json">${JSON.stringify(faq)}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css?v=2" />
</head>
<body>
  <header class="site-header">
    <nav class="nav container">
      <a href="/" class="brand"><span class="spark">✶</span><span>NameSpark <b>Baby</b></span></a>
      <a href="/" class="btn btn-ghost">← Accueil</a>
    </nav>
  </header>
  <section class="hero">
    <div class="container hero-inner">
      <span class="eyebrow">Signification du prénom</span>
      <h1>${esc(n.name)}</h1>
      <p class="subtitle">${esc(n.name)} est ${GENDER_ART[n.gender]} d'origine ${origine}. Signification : <strong>${esc(meaningFr)}</strong>.</p>
      <a href="/#/prenom/${slug}" class="btn btn-primary">Explorer ${esc(n.name)} sur NameSpark</a>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="section-head"><h2>Le prénom ${esc(n.name)} en détail</h2></div>
      ${intro}
      <p><strong>Signification :</strong> ${esc(meaningFr)}</p>
      <p><strong>Origine :</strong> ${origine}</p>
      <p><strong>Genre :</strong> ${genre}</p>
      <p><strong>Style :</strong> ${styleFr}</p>
      <p><strong>Nombre de lettres :</strong> ${letters}</p>
      ${variants}
      ${originPara}
      ${themePara}
      <h2>Choisir ${esc(n.name)}… à deux</h2>
      <p>Un prénom se choisit rarement seul. Avec NameSpark Baby, générez une sélection de prénoms proches de ${esc(n.name)}, votez chacun de votre côté, et découvrez ceux sur lesquels vous êtes réellement d'accord.</p>
      <a href="/?origin=${n.origin}&amp;gender=${n.gender}#generateur" class="btn btn-primary">Générer des prénoms ${origine}s</a>
      ${simsHTML}
      ${originHTML}
      ${themeHTML}
      ${faqHTML}
    </div>
  </section>
  <footer class="site-footer">
    <div class="container"><div class="footer-bottom"><span>© 2026 NameSpark Baby</span><span>Prénoms choisis avec ❤️</span></div></div>
  </footer>
</body>
</html>`;
}

// --- Génération ---
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const seen = new Set();
let written = 0, skipped = 0;
const urls = [];
for (const n of NAMES) {
  const slug = slugify(n.name);
  if (seen.has(slug)) { skipped++; continue; }
  seen.add(slug);
  fs.writeFileSync(path.join(OUT, slug + ".html"), page(n, NAMES));
  urls.push(`${DOMAIN}/prenom/${slug}`);
  written++;
}

// --- sitemap.xml ---
const staticUrls = [ `${DOMAIN}/`, `${DOMAIN}/seo/prenom-garcon`, `${DOMAIN}/seo/prenom-fille`, `${DOMAIN}/seo/prenom-hebreu`, `${DOMAIN}/seo/prenom-rare`, `${DOMAIN}/seo/prenom-court` ];
const all = staticUrls.concat(urls);
const today = new Date().toISOString().slice(0,10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  all.map(u=>`  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

console.log(`Pages SEO générées : ${written} (slugs en double ignorés : ${skipped})`);
console.log(`sitemap.xml : ${all.length} URLs`);
