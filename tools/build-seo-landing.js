#!/usr/bin/env node
/* =============================================================
   build-seo-landing.js — reconstruit les pages /seo/*.html
   -------------------------------------------------------------
   Les versions précédentes faisaient ~100 mots et ne contenaient
   AUCUN lien vers les fiches de prénoms. Elles visaient pourtant les
   requêtes à plus fort volume du site (« prénom garçon », « prénom
   fille », « prénom rare »).

   Chaque page devient un classement réel, construit sur les données
   INSEE/SSA : rang, prénom, signification, nombre de naissances,
   année de pic. C'est un contenu qu'aucun gabarit ne peut produire,
   et chaque ligne est un lien vers la fiche correspondante — ce qui
   donne enfin à Google un chemin d'exploration interne vers les
   5 300 pages qui méritent d'être indexées.

   Usage : node tools/build-seo-landing.js
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "seo");
const DOMAIN = "https://namespark.baby";

const g = {};
eval(fs.readFileSync(path.join(ROOT, "data.js"), "utf8").replace(/const NAMES =/, "g.NAMES ="));
const NAMES = g.NAMES;
const STATS = JSON.parse(fs.readFileSync(path.join(ROOT, "tools", "name-stats.json"), "utf8"));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (n) => n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const nf = (n) => n.toLocaleString("fr-FR").replace(/ | /g, " ");
const frTotal = (n) => (STATS[n.name] && STATS[n.name].fr ? STATS[n.name].fr.total : 0);
const frPeak = (n) => (STATS[n.name] && STATS[n.name].fr ? STATS[n.name].fr.peakYear : null);
const recent = (n) => (STATS[n.name] && STATS[n.name].fr ? STATS[n.name].fr.recentAvg : 0);

const ORIGINS = { hebreu:"hébraïque", francais:"française", anglais:"anglaise", arabe:"arabe", italien:"italienne", espagnol:"espagnole", grec:"grecque", latin:"latine", nordique:"nordique", irlandais:"irlandaise", japonais:"japonaise", slave:"slave", sanskrit:"sanskrite", persan:"persane", africain:"africaine", portugais:"portugaise", coreen:"coréenne", chinois:"chinoise", gallois:"galloise", basque:"basque", armenien:"arménienne", georgien:"géorgienne" };

/* Seuls les prénoms réellement attestés figurent dans ces classements. */
const attested = NAMES.filter((n) => STATS[n.name]);

function table(list, { showOrigin = true } = {}) {
  return `<div class="table-wrap"><table class="rank-table">
  <thead><tr><th scope="col">#</th><th scope="col">Prénom</th>${showOrigin ? "<th scope=\"col\">Origine</th>" : ""}<th scope="col">Signification</th><th scope="col">Naissances en France</th><th scope="col">Pic</th></tr></thead>
  <tbody>
${list.map((n, i) => {
  const t = frTotal(n), p = frPeak(n);
  return `    <tr><td>${i + 1}</td><th scope="row"><a href="/prenom/${slugify(n.name)}">${esc(n.name)}</a></th>${showOrigin ? `<td>${ORIGINS[n.origin] || n.origin}</td>` : ""}<td>${esc(n.meaning.fr)}</td><td>${t ? nf(t) : "—"}</td><td>${p || "—"}</td></tr>`;
}).join("\n")}
  </tbody>
</table></div>`;
}

function chips(list) {
  return `<div class="chips">${list.map((n) => `<a class="chip" href="/prenom/${slugify(n.name)}">${esc(n.name)}</a>`).join("")}</div>`;
}

function shell({ slug, title, desc, eyebrow, h1, subtitle, cta, ctaHref, body, faq }) {
  const url = `${DOMAIN}/seo/${slug}`;
  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${DOMAIN}/og-image.png" />
  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css?v=4" />
  <style>
    /* Un tableau à six colonnes doit défiler DANS son conteneur :
       jamais la page entière, sous peine de casser le mobile. */
    .table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:20px 0}
    .rank-table{width:100%;min-width:560px;border-collapse:collapse;font-size:15px}
    .rank-table th,.rank-table td{padding:8px 10px;border-bottom:1px solid #ece4da;text-align:left;vertical-align:top}
    .rank-table thead th{font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#9b9188;font-weight:600}
    .rank-table th[scope=row]{font-weight:600}
    .rank-table th[scope=row] a{color:#8a6a45;text-decoration:none}
    .rank-table th[scope=row] a:hover{text-decoration:underline}
    .rank-table td:first-child{color:#b8aea4;width:38px}
    .src-note{font-size:13px;color:#9b9188;margin-top:4px}
    @media(max-width:640px){.rank-table{font-size:13.5px}.rank-table th,.rank-table td{padding:6px 6px}}
  </style>
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
      <span class="eyebrow">${esc(eyebrow)}</span>
      <h1>${esc(h1)}</h1>
      <p class="subtitle">${subtitle}</p>
      <a href="${ctaHref}" class="btn btn-primary">${esc(cta)}</a>
    </div>
  </section>
  <section>
    <div class="container">
${body}
      <h2>Questions fréquentes</h2>
${faq.map((f) => `      <h3>${esc(f.q)}</h3>\n      <p>${f.a}</p>`).join("\n")}
      <p style="margin-top:28px"><a href="${ctaHref}" class="btn btn-primary">${esc(cta)}</a></p>
    </div>
  </section>
  <footer class="site-footer">
    <div class="container"><div class="footer-bottom"><span>© 2026 NameSpark Baby</span><span>Prénoms choisis avec ❤️</span></div></div>
  </footer>
</body>
</html>`;
}

const SOURCE_NOTE = `<p class="src-note">Source : fichier des prénoms de l'INSEE (naissances enregistrées en France de 1900 à 2022), complété par les registres officiels américain, britannique et irlandais.</p>`;

/* ---------------- Définition des pages ---------------- */
const PAGES = [];

/* --- Garçon / Fille : classement par nombre de naissances --- */
for (const [gender, label, slug] of [["boy", "garçon", "prenom-garcon"], ["girl", "fille", "prenom-fille"]]) {
  const pool = attested.filter((n) => n.gender === gender || n.gender === "mixte").filter((n) => frTotal(n) > 0);
  const top = [...pool].sort((a, b) => frTotal(b) - frTotal(a)).slice(0, 100);
  const montants = [...pool].filter((n) => frPeak(n) >= 2010).sort((a, b) => recent(b) - recent(a)).slice(0, 30);
  const intemporels = [...pool].filter((n) => frPeak(n) <= 1960 && recent(n) > 20).sort((a, b) => frTotal(b) - frTotal(a)).slice(0, 30);
  const totalBirths = top.reduce((a, n) => a + frTotal(n), 0);

  PAGES.push({
    slug,
    title: `Prénoms de ${label} : les 100 plus donnés en France | NameSpark Baby`,
    desc: `Les 100 prénoms de ${label} les plus donnés en France depuis 1900, avec leur signification, leur origine et leur année de pic. Classement établi sur les données de l'INSEE.`,
    eyebrow: `Prénoms ${label}`,
    h1: `Prénoms de ${label} : les 100 plus donnés en France`,
    subtitle: `Classement établi sur les naissances réellement enregistrées en France depuis 1900. À eux seuls, ces 100 prénoms représentent <strong>${nf(totalBirths)}</strong> naissances.`,
    cta: `Générer des prénoms de ${label}`,
    ctaHref: `/?gender=${gender}#generateur`,
    body: `      <div class="section-head"><h2>Le classement des 100 prénoms de ${label} les plus portés</h2>
        <p>Ce tableau ne repose sur aucune sélection éditoriale : il reprend les naissances enregistrées à l'état civil français depuis 1900. Pour chaque prénom, vous trouverez sa signification, son origine et l'année où il a été le plus donné — un indicateur utile pour savoir s'il appartient à une génération précise ou s'il traverse les époques.</p></div>
      ${table(top)}
      ${SOURCE_NOTE}
      <h2>Les prénoms de ${label} qui montent</h2>
      <p>Ces prénoms ont atteint leur maximum au cours des dix dernières années : ils sont portés par la génération actuelle plutôt que par celle des parents.</p>
      ${chips(montants)}
      <h2>Les prénoms de ${label} intemporels</h2>
      <p>À l'inverse, ceux-ci ont connu leur apogée avant 1960 mais continuent d'être donnés aujourd'hui — le signe d'un prénom qui résiste aux modes.</p>
      ${chips(intemporels)}
      <h2>Choisir un prénom de ${label} à deux</h2>
      <p>Un classement ne décide pas à votre place. Sur NameSpark Baby, vous générez une sélection selon vos critères — origine, style, longueur, signification —, chacun vote de son côté, et l'outil révèle les prénoms sur lesquels vous êtes réellement d'accord.</p>`,
    faq: [
      { q: `Quel est le prénom de ${label} le plus donné en France ?`, a: `D'après les données de l'INSEE, c'est <strong>${top[0].name}</strong>, avec ${nf(frTotal(top[0]))} naissances enregistrées depuis 1900.` },
      { q: `Comment ce classement est-il établi ?`, a: `Il cumule les naissances enregistrées à l'état civil français entre 1900 et 2022, telles que publiées par l'INSEE. Aucun prénom n'y figure s'il n'est pas réellement attesté dans un registre officiel.` },
      { q: `Que signifie l'année de pic ?`, a: `C'est l'année où le prénom a été attribué au plus grand nombre d'enfants. Un pic ancien indique un prénom de génération ; un pic récent, un prénom en vogue aujourd'hui.` },
      { q: `Comment trouver un prénom de ${label} plus rare ?`, a: `Le générateur propose d'abord les prénoms les plus établis, puis élargit vers des choix moins courants à chaque nouvelle génération. Vous pouvez aussi filtrer directement sur le style « rare ».` },
    ],
  });
}

/* --- Rares mais réels --- */
{
  const pool = attested.filter((n) => { const t = frTotal(n); return t >= 30 && t <= 1500; })
    .sort((a, b) => frTotal(b) - frTotal(a)).slice(0, 100);
  PAGES.push({
    slug: "prenom-rare",
    title: "Prénoms rares mais réels : 100 idées attestées à l'état civil | NameSpark Baby",
    desc: "100 prénoms rares et pourtant bien réels, chacun attesté dans les registres officiels français. Signification, origine et nombre exact de naissances.",
    eyebrow: "Prénoms rares",
    h1: "Prénoms rares mais réels",
    subtitle: "Des prénoms peu portés — entre quelques dizaines et quelques centaines de naissances en France — mais <strong>tous attestés à l'état civil</strong>. Aucun prénom inventé.",
    cta: "Générer des prénoms rares",
    ctaHref: "/?style=rare#generateur",
    body: `      <div class="section-head"><h2>100 prénoms rares attestés en France</h2>
        <p>Chercher un prénom rare expose à une difficulté : beaucoup de listes mélangent de vrais prénoms peu répandus avec des inventions. Ce classement ne retient que des prénoms <strong>réellement enregistrés à l'état civil français</strong>, avec le nombre exact de naissances. Votre enfant aura peu de chances de partager son prénom en classe, mais il portera un prénom qui existe.</p></div>
      ${table(pool)}
      ${SOURCE_NOTE}
      <h2>Rare ne veut pas dire inventé</h2>
      <p>Un prénom peut être rare en France et parfaitement courant ailleurs. C'est pourquoi chaque fiche indique aussi la présence du prénom dans les registres américain, britannique et irlandais : un prénom donné quelques dizaines de fois en France peut compter des milliers de porteurs à l'étranger.</p>`,
    faq: [
      { q: "Ces prénoms rares sont-ils acceptés à l'état civil ?", a: "Tous figurent déjà dans le fichier des prénoms de l'INSEE, ce qui signifie qu'ils ont été enregistrés en France. En droit français, l'officier d'état civil ne peut refuser un prénom que s'il est contraire à l'intérêt de l'enfant." },
      { q: "Combien de naissances faut-il pour qu'un prénom soit « rare » ?", a: "Cette sélection retient les prénoms comptant entre 30 et 1 500 naissances depuis 1900 — assez pour être attestés, assez peu pour rester distinctifs." },
      { q: "Comment éviter les prénoms inventés ?", a: "En vérifiant leur présence dans un registre officiel. C'est le principe appliqué ici : aucun prénom n'apparaît dans ce classement s'il n'est pas attesté." },
    ],
  });
}

/* --- Courts --- */
{
  const pool = attested.filter((n) => n.length === "court" && frTotal(n) > 0)
    .sort((a, b) => frTotal(b) - frTotal(a)).slice(0, 100);
  PAGES.push({
    slug: "prenom-court",
    title: "Prénoms courts : les 100 plus donnés en France | NameSpark Baby",
    desc: "Les prénoms courts (4 lettres ou moins) les plus donnés en France, avec signification, origine et nombre de naissances. Classement INSEE.",
    eyebrow: "Prénoms courts",
    h1: "Prénoms courts : les 100 plus donnés en France",
    subtitle: "Quatre lettres ou moins, faciles à retenir et à prononcer — classés selon les naissances réellement enregistrées en France.",
    cta: "Générer des prénoms courts",
    ctaHref: "/?length=court#generateur",
    body: `      <div class="section-head"><h2>Classement des prénoms courts</h2>
        <p>Un prénom court s'accorde souvent bien avec un nom de famille long, se retient immédiatement et supporte mal les diminutifs — ce qui est parfois recherché. Voici les plus portés en France, tous attestés à l'état civil.</p></div>
      ${table(pool)}
      ${SOURCE_NOTE}`,
    faq: [
      { q: "Qu'appelle-t-on un prénom court ?", a: "Ici, un prénom de quatre lettres ou moins. C'est le seuil retenu par le générateur pour son filtre de longueur." },
      { q: "Un prénom court va-t-il avec mon nom de famille ?", a: "Le générateur calcule un score de compatibilité entre le prénom et votre nom : longueur totale, équilibre des syllabes et enchaînement sonore. Renseignez votre nom pour le voir apparaître sur chaque proposition." },
    ],
  });
}

/* --- Par origine : hébreu (page existante) --- */
{
  const pool = attested.filter((n) => n.origin === "hebreu" && frTotal(n) > 0)
    .sort((a, b) => frTotal(b) - frTotal(a)).slice(0, 100);
  PAGES.push({
    slug: "prenom-hebreu",
    title: "Prénoms hébraïques : les 100 plus donnés en France | NameSpark Baby",
    desc: "Les prénoms d'origine hébraïque les plus donnés en France, avec leur signification exacte, leur origine et leur année de pic. Données INSEE.",
    eyebrow: "Prénoms hébraïques",
    h1: "Prénoms hébraïques : les 100 plus donnés en France",
    subtitle: "Parmi les plus anciens prénoms encore portés, presque tous construits sur une racine porteuse de sens.",
    cta: "Générer des prénoms hébraïques",
    ctaHref: "/?origin=hebreu#generateur",
    body: `      <div class="section-head"><h2>Classement des prénoms hébraïques en France</h2>
        <p>Les prénoms hébraïques ont une particularité : leur signification est presque toujours limpide, parce qu'ils sont bâtis sur une racine de la langue — souvent liée au divin, à la force ou à une qualité morale. Beaucoup sont passés dans le fonds commun européen via le christianisme, au point qu'on oublie leur origine.</p></div>
      ${table(pool, { showOrigin: false })}
      ${SOURCE_NOTE}`,
    faq: [
      { q: "Quel est le prénom hébraïque le plus donné en France ?", a: pool.length ? `<strong>${pool[0].name}</strong>, avec ${nf(frTotal(pool[0]))} naissances enregistrées depuis 1900.` : "—" },
      { q: "Pourquoi tant de prénoms français sont-ils d'origine hébraïque ?", a: "Par la diffusion biblique : Jean, Marie, Michel, Daniel ou Gabriel viennent tous de l'hébreu, transmis par le grec puis le latin avant d'entrer dans l'usage français." },
    ],
  });
}

/* --- Signification : force --- */
{
  const pool = attested.filter((n) => (n.meaningTags || []).includes("force") && frTotal(n) > 0)
    .sort((a, b) => frTotal(b) - frTotal(a)).slice(0, 100);
  PAGES.push({
    slug: "prenom-signification-force",
    title: "Prénoms signifiant la force : 100 idées attestées | NameSpark Baby",
    desc: "Les prénoms dont la signification évoque la force, classés par nombre de naissances en France. Origine, sens exact et année de pic.",
    eyebrow: "Signification : la force",
    h1: "Prénoms qui signifient la force",
    subtitle: "Des prénoms dont le sens renvoie à la force, au courage ou à la puissance — classés selon les naissances enregistrées en France.",
    cta: "Générer des prénoms évoquant la force",
    ctaHref: "/?meaning=force#generateur",
    body: `      <div class="section-head"><h2>Classement des prénoms évoquant la force</h2>
        <p>Choisir un prénom pour son sens est une démarche ancienne : dans la plupart des traditions, le prénom exprimait un souhait adressé à l'enfant. Ceux réunis ici portent, dans leur langue d'origine, une idée de force, de vigueur ou de courage.</p></div>
      ${table(pool)}
      ${SOURCE_NOTE}`,
    faq: [
      { q: "Comment la signification d'un prénom est-elle déterminée ?", a: "Elle provient de la racine du prénom dans sa langue d'origine. Sur NameSpark Baby, aucune signification n'est inventée : lorsqu'elle n'est pas établie, elle n'est pas affichée." },
      { q: "Peut-on filtrer les prénoms par signification ?", a: "Oui. Le générateur propose seize thèmes — force, courage, lumière, nature, paix, sagesse et d'autres — combinables avec l'origine, le genre et la longueur." },
    ],
  });
}

/* ---------------- Écriture ---------------- */
fs.mkdirSync(OUT, { recursive: true });
let n = 0, words = 0;
for (const p of PAGES) {
  const html = shell(p);
  fs.writeFileSync(path.join(OUT, p.slug + ".html"), html);
  const txt = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
  const w = txt.split(/\s+/).filter(Boolean).length;
  words += w;
  const links = (html.match(/href="\/prenom\//g) || []).length;
  console.log(`  ${p.slug.padEnd(30)} ${String(w).padStart(5)} mots | ${String(links).padStart(4)} liens vers des fiches`);
  n++;
}
console.log(`\n${n} pages écrites, ${Math.round(words / n)} mots en moyenne.`);
