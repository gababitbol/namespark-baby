/* =============================================================
   NameSpark Baby — Templates newsletter (prêts à brancher)
   -------------------------------------------------------------
   Ces fonctions génèrent le HTML pour les deux types de
   newsletters : "Prénom de la semaine" et "Tendances".

   Utilisation future : appeler depuis un handler Vercel
   qui reçoit la liste d'abonnés et envoie via Resend Batch.
   ============================================================= */

const LOGO_IMG = `<img src="https://namespark.baby/email-logo.png" alt="NameSpark Baby" width="220" height="51" style="display:block;margin:0 auto;border:0;max-width:220px;" />`;

function emailWrapper(body, lang = "fr") {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>NameSpark Baby</title>
</head>
<body style="margin:0;padding:0;background:#fbf9f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1f1b16;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#fbf9f6;padding:44px 16px 52px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 48px -16px rgba(58,44,30,0.20),0 2px 8px -2px rgba(58,44,30,0.08);">
        ${body}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function newsletterHeader(badge) {
  return `<tr>
  <td style="background:#c9a27a;padding:24px 40px 20px;text-align:center;">
    ${LOGO_IMG}
    <p style="margin:12px 0 0;display:inline-block;padding:4px 14px;background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.35);border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,0.88);">${badge}</p>
  </td>
</tr>`;
}

function newsletterFooter() {
  return `<tr>
  <td style="padding:0 40px 28px;text-align:center;border-top:1px solid #ece4da;">
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto 0;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#c9a27a;">NameSpark Baby</p>
          <p style="margin:0;font-size:11px;color:#b0a89e;line-height:1.6;">
            Vous recevez cette newsletter car vous êtes abonné(e).<br>
            <a href="https://namespark.baby" style="color:#c9a27a;text-decoration:none;">namespark.baby</a>
            &nbsp;·&nbsp;
            <a href="https://namespark.baby/unsubscribe" style="color:#d0c8be;text-decoration:none;">Se désabonner</a>
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

/* ─────────────────────────────────────────────────────────────────────────
   TEMPLATE 1 — Prénom de la semaine
   ─────────────────────────────────────────────────────────────────────────
   @param {object} opts
   @param {string} opts.name          — ex: "Iris"
   @param {string} opts.tagline       — ex: "Doux, lumineux, intemporel"
   @param {string} opts.week          — ex: "Semaine 23"
   @param {string} opts.origin        — ex: "Du grec ancien iris, arc-en-ciel."
   @param {string} opts.ranking       — ex: "#28 — ↑ En hausse"
   @param {number} opts.rankPercent   — 0-100, for progress bar fill
   @param {string[]} opts.pairsWell   — last names that pair well
   @param {Array<{name, desc}>} opts.similar — similar names
*/
export function buildWeeklyNameEmail(opts) {
  const { name, tagline, week, origin, ranking, rankPercent = 65, pairsWell = [], similar = [] } = opts;

  const surnamesPills = pairsWell.map(s =>
    `<span style="display:inline-block;margin:3px 5px 3px 0;padding:5px 14px;background:#f4efe9;border:1px solid #ece4da;border-radius:100px;font-size:12px;color:#a9805a;font-weight:500;">${s}</span>`
  ).join("");

  const similarCards = similar.map(({ name: sn, desc }) =>
    `<td style="width:33%;padding:0 5px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4efe9;border:1px solid #ece4da;border-radius:12px;">
        <tr>
          <td style="padding:16px 12px;text-align:center;">
            <div style="font-size:17px;font-weight:700;color:#1f1b16;margin-bottom:6px;font-family:Georgia,serif;">${sn}</div>
            <div style="font-size:11px;color:#6b6259;line-height:1.4;">${desc}</div>
          </td>
        </tr>
      </table>
    </td>`
  ).join("");

  const body = `
${newsletterHeader(`Newsletter · ${week}`)}
<tr>
  <td style="padding:44px 40px 8px;text-align:center;">
    <h1 style="margin:0 0 10px;font-size:58px;font-weight:700;color:#1f1b16;letter-spacing:-.03em;font-family:Georgia,'Times New Roman',serif;line-height:1.05;">${name}</h1>
    <p style="margin:0;font-size:15px;font-style:italic;color:#a9805a;font-family:Georgia,serif;">${tagline}</p>
  </td>
</tr>
<tr>
  <td style="padding:20px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
      <td style="border-top:1px solid #ece4da;"></td>
    </tr></table>
  </td>
</tr>
<!-- Origine -->
<tr>
  <td style="padding:20px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4efe9;border:1px solid #ece4da;border-radius:14px;">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0 0 8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#a9805a;">Origine &amp; signification</p>
          <p style="margin:0;font-size:13px;color:#6b6259;line-height:1.6;">${origin}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>
<!-- Popularité -->
<tr>
  <td style="padding:20px 40px 0;">
    <p style="margin:0 0 10px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#a9805a;">Popularité en France</p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="width:${rankPercent}%;background:#c9a27a;height:10px;border-radius:5px 0 0 5px;"></td>
        <td style="background:#f4efe9;border:1px solid #ece4da;height:10px;border-radius:0 5px 5px 0;"></td>
      </tr>
    </table>
    <p style="margin:8px 0 0;font-size:12px;color:#a9805a;font-weight:600;">${ranking}</p>
  </td>
</tr>
<!-- Se marie bien avec -->
<tr>
  <td style="padding:20px 40px 0;">
    <p style="margin:0 0 10px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#a9805a;">Se marie bien avec…</p>
    <div>${surnamesPills}</div>
  </td>
</tr>
<!-- Prénoms similaires -->
<tr>
  <td style="padding:20px 40px 0;">
    <p style="margin:0 0 12px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#a9805a;">Prénoms similaires</p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>${similarCards}</tr>
    </table>
  </td>
</tr>
<!-- CTA -->
<tr>
  <td style="padding:28px 40px 36px;text-align:center;">
    <a href="https://namespark.baby"
       style="display:inline-block;background:#c9a27a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:100px;box-shadow:0 4px 14px -4px rgba(169,128,90,0.5);">
      Explorer tous les prénoms →
    </a>
  </td>
</tr>
${newsletterFooter()}`;

  return emailWrapper(body);
}

/* ─────────────────────────────────────────────────────────────────────────
   TEMPLATE 2 — Tendances de la saison
   ─────────────────────────────────────────────────────────────────────────
   @param {object} opts
   @param {string} opts.season          — ex: "Printemps 2026"
   @param {string} opts.intro           — intro text (1-2 sentences)
   @param {Array<{name, trend, desc}>} opts.trends  — top 5
   @param {{name, quote}} opts.favorite — coup de cœur
*/
export function buildTrendsEmail(opts) {
  const { season, intro, trends = [], favorite } = opts;

  const trendRows = trends.map(({ name, trend, desc }, i) => {
    const bg = i % 2 === 0 ? "#f4efe9" : "#ffffff";
    const border = i === trends.length - 1 ? "none" : "1px solid #ece4da";
    return `<tr>
  <td style="background:${bg};padding:16px 20px;border-bottom:${border};">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="width:38px;vertical-align:middle;">
          <div style="width:30px;height:30px;background:#c9a27a;border-radius:15px;text-align:center;line-height:30px;font-size:13px;font-weight:800;color:#ffffff;">${i + 1}</div>
        </td>
        <td style="vertical-align:middle;padding-left:4px;">
          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="font-size:17px;font-weight:700;color:#1f1b16;font-family:Georgia,serif;padding-right:10px;vertical-align:middle;">${name}</td>
              <td style="vertical-align:middle;"><span style="display:inline-block;padding:3px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:100px;font-size:10px;font-weight:700;color:#166534;">${trend}</span></td>
            </tr>
          </table>
          <p style="margin:4px 0 0;font-size:12px;color:#6b6259;">${desc}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
  }).join("");

  const favoriteBlock = favorite ? `<tr>
  <td style="padding:0 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#fffbeb;border:1px solid #fde68a;border-radius:14px;">
      <tr>
        <td style="padding:20px 22px;">
          <p style="margin:0 0 8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#92400e;">Coup de cœur de la rédaction</p>
          <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#1f1b16;font-family:Georgia,serif;">${favorite.name}</p>
          <p style="margin:0;font-size:13px;font-style:italic;color:#6b6259;font-family:Georgia,serif;">${favorite.quote}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>` : "";

  const body = `
${newsletterHeader(`Tendances · ${season}`)}
<tr>
  <td style="padding:40px 40px 8px;text-align:center;">
    <h1 style="margin:0 0 6px;font-size:26px;font-weight:700;color:#1f1b16;letter-spacing:-.02em;font-family:Georgia,'Times New Roman',serif;">Les prénoms en vogue</h1>
    <p style="margin:0;font-size:16px;font-style:italic;color:#a9805a;font-family:Georgia,serif;">ce ${season.toLowerCase()}</p>
  </td>
</tr>
<tr>
  <td style="padding:12px 40px 20px;text-align:center;">
    <p style="margin:0;font-size:13px;color:#6b6259;line-height:1.7;">${intro}</p>
  </td>
</tr>
<!-- Trends table -->
<tr>
  <td style="padding:0 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #ece4da;border-radius:14px;overflow:hidden;">
      ${trendRows}
    </table>
  </td>
</tr>
<tr><td style="padding:20px 40px 0;"></td></tr>
${favoriteBlock}
<!-- CTA -->
<tr>
  <td style="padding:28px 40px 36px;text-align:center;">
    <a href="https://namespark.baby"
       style="display:inline-block;background:#c9a27a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:100px;box-shadow:0 4px 14px -4px rgba(169,128,90,0.5);">
      Découvrir toutes les tendances →
    </a>
  </td>
</tr>
${newsletterFooter()}`;

  return emailWrapper(body);
}
