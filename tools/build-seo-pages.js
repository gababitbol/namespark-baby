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

const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const slugify = (name) => name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

function similar(ref, all, limit=6){
  return all.filter(n=>n.name!==ref.name).map(n=>{
    let s=0; if(n.origin===ref.origin)s+=3; s+=n.style.filter(x=>ref.style.includes(x)).length*2;
    if(n.gender===ref.gender)s+=1; s+=n.meaningTags.filter(m=>ref.meaningTags.includes(m)).length;
    return {n,s};
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,limit).map(x=>x.n);
}

function page(n, all){
  const slug = slugify(n.name);
  const origine = ORIGINS[n.origin] || n.origin;
  const genre = GENDER[n.gender] || n.gender;
  const meaningFr = n.meaning.fr;
  const styleFr = n.style.map(s=>STYLES[s]||s).join(", ");
  const title = `${n.name} : signification, origine et style du prénom`;
  const desc = `${n.name} est ${GENDER_ART[n.gender]} d'origine ${origine}. Signification : ${meaningFr}. Découvrez son style, ses variantes et des prénoms similaires sur NameSpark Baby.`;
  const url = `${DOMAIN}/prenom/${slug}`;
  const variants = (n.variants&&n.variants.length) ? `<p><strong>Variantes :</strong> ${esc(n.variants.join(", "))}</p>` : "";
  const sims = similar(n, all, 8);
  const simsHTML = sims.length ? `
    <h2>Prénoms similaires à ${esc(n.name)}</h2>
    <div class="chips">${sims.map(s=>`<a class="chip" href="/prenom/${slugify(s.name)}">${esc(s.name)}</a>`).join("")}</div>` : "";

  // JSON-LD (DefinedTerm) pour enrichir le SEO
  const jsonld = {
    "@context":"https://schema.org","@type":"DefinedTerm",
    "name":n.name,"description":`${n.name} — ${meaningFr} (origine ${origine}, prénom ${genre})`,
    "inDefinedTermSet":`${DOMAIN}/`
  };

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
      <p><strong>Signification :</strong> ${esc(meaningFr)}</p>
      <p><strong>Origine :</strong> ${origine}</p>
      <p><strong>Genre :</strong> ${genre}</p>
      <p><strong>Style :</strong> ${styleFr}</p>
      ${variants}
      <p>Vous cherchez un prénom proche de ${esc(n.name)} ? Lancez le générateur NameSpark Baby et filtrez par origine, style et signification — puis votez en couple sur vos préférés.</p>
      <a href="/?origin=${n.origin}&gender=${n.gender}#generateur" class="btn btn-primary">Générer des prénoms ${origine}s</a>
      ${simsHTML}
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
