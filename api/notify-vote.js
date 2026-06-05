/* =============================================================
   NameSpark Baby — Email de notification après vote
   POST /api/notify-vote
   -------------------------------------------------------------
   Reçoit : { decisionId, voterName, votes: { yes: [], maybe: [], no: [] } }
   Fait    : récupère l'email du créateur depuis Supabase,
             envoie un email via Resend.
   ============================================================= */

const ALLOWED_ORIGINS = [
  "https://namespark.baby",
  "https://www.namespark.baby",
];

/* ── Shared email chrome ─────────────────────────────────────────────────── */
const LOGO_IMG = `<img src="https://namespark.baby/email-logo.png" alt="NameSpark Baby" width="220" height="51" style="display:block;margin:0 auto;border:0;max-width:220px;" />`;

function emailWrapper(body) {
  return `<!DOCTYPE html>
<html lang="fr">
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

function emailHeader() {
  return `<tr>
  <td style="background:#c9a27a;padding:28px 40px 24px;text-align:center;">
    ${LOGO_IMG}
  </td>
</tr>`;
}

function emailFooter() {
  return `<tr>
  <td style="padding:0 40px 28px;text-align:center;border-top:1px solid #ece4da;">
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto 0;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#c9a27a;">NameSpark Baby</p>
          <p style="margin:0;font-size:11px;color:#b0a89e;line-height:1.6;">
            Vous recevez cet email car vous avez créé une session de vote.<br>
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

/* ── Vote result section ─────────────────────────────────────────────────── */
function voteSection({ emoji, label, color, bg, border, names }) {
  const isEmpty = !names || names.length === 0;
  const namesList = isEmpty
    ? `<span style="color:#c9c2b8;font-style:italic;">Aucun prénom</span>`
    : names.map(n =>
        `<span style="display:inline-block;margin:3px 4px 3px 0;padding:4px 12px;background:${bg};border:1px solid ${border};border-radius:100px;font-size:13px;font-weight:600;color:${color};white-space:nowrap;">${n}</span>`
      ).join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:10px;border-radius:14px;overflow:hidden;border:1px solid ${border};">
  <tr>
    <td style="background:${bg};padding:16px 18px 14px;">
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:10px;">
        <tr>
          <td style="width:26px;vertical-align:middle;">
            <div style="width:10px;height:10px;border-radius:50%;background:${color};opacity:0.85;"></div>
          </td>
          <td style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:${color};vertical-align:middle;">${label}</td>
        </tr>
      </table>
      <div>${namesList}</div>
    </td>
  </tr>
</table>`;
}

/* ── Build vote notification email ──────────────────────────────────────── */
function buildVoteEmail({ voterName, greeting, resultsUrl, yes, maybe, no }) {
  const yesSection = voteSection({
    label: 'Prénoms aimés', color: '#166534', bg: '#f0fdf4', border: '#bbf7d0',
    names: yes,
  });
  const maybeSection = voteSection({
    label: 'Peut-être', color: '#92400e', bg: '#fffbeb', border: '#fde68a',
    names: maybe,
  });
  const noSection = voteSection({
    label: 'Refusés', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb',
    names: no,
  });

  const body = `
${emailHeader()}
<tr>
  <td style="padding:36px 40px 8px;text-align:center;">
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:700;color:#1f1b16;letter-spacing:-.02em;font-family:Georgia,'Times New Roman',serif;line-height:1.2;">${voterName} a voté</h1>
    <p style="margin:0;font-size:14px;color:#6b6259;line-height:1.6;">${greeting}</p>
    <p style="margin:8px 0 0;font-size:14px;color:#6b6259;line-height:1.6;">Voici comment <strong style="color:#a9805a;">${voterName}</strong> a voté sur votre sélection.</p>
  </td>
</tr>
<tr>
  <td style="padding:24px 40px 8px;">
    ${yesSection}
    ${maybeSection}
    ${noSection}
  </td>
</tr>
<tr>
  <td style="padding:24px 40px 36px;text-align:center;">
    <a href="${resultsUrl}"
       style="display:inline-block;background:#c9a27a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:100px;letter-spacing:.01em;box-shadow:0 4px 14px -4px rgba(169,128,90,0.5);">
      Voir les résultats complets →
    </a>
  </td>
</tr>
${emailFooter()}`;

  return emailWrapper(body);
}

export default async function handler(req, res) {
  /* CORS */
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { decisionId, voterName, votes = {} } = req.body || {};
  if (!decisionId || !voterName) {
    return res.status(400).json({ error: "decisionId and voterName are required" });
  }

  /* ── 1. Récupérer l'email du créateur ── */
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  let creatorEmail = null, creatorName = null;
  try {
    const sbRes = await fetch(
      `${supabaseUrl}/rest/v1/participants?decision_id=eq.${encodeURIComponent(decisionId)}&role=eq.creator&select=name,email`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    );
    const rows = await sbRes.json();
    if (Array.isArray(rows) && rows.length > 0) {
      creatorEmail = rows[0].email;
      creatorName  = rows[0].name;
    }
  } catch (err) {
    console.error("[notify-vote] Supabase error:", err);
    return res.status(500).json({ error: "Database error" });
  }

  if (!creatorEmail) {
    console.warn("[notify-vote] No creator email for decision:", decisionId);
    return res.status(200).json({ sent: false, reason: "no_creator_email" });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const yes   = votes.yes   || [];
  const maybe = votes.maybe || [];
  const no    = votes.no    || [];

  if (!resendKey) {
    console.log("[notify-vote] DRY RUN", { to: creatorEmail, voterName, yes, maybe, no });
    return res.status(200).json({ sent: false, reason: "no_resend_key" });
  }

  const resultsUrl = `https://namespark.baby/?decision=${encodeURIComponent(decisionId)}`;
  const greeting   = creatorName ? `Bonjour ${creatorName},` : "Bonjour,";
  const html = buildVoteEmail({ voterName, greeting, resultsUrl, yes, maybe, no });

  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "NameSpark Baby <votes@namespark.baby>",
        to: [creatorEmail],
        subject: `${voterName} a voté sur votre sélection ✦`,
        html,
      }),
    });
    const result = await emailRes.json();
    if (!emailRes.ok) {
      console.error("[notify-vote] Resend error:", result);
      return res.status(500).json({ error: "Email send failed", detail: result });
    }
    console.log("[notify-vote] Sent:", { to: creatorEmail, voter: voterName, id: result.id });
    return res.status(200).json({ sent: true, id: result.id });
  } catch (err) {
    console.error("[notify-vote] Fetch error:", err);
    return res.status(500).json({ error: "Network error" });
  }
}
