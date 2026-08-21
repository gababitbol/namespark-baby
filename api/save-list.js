/* =============================================================
   NameSpark Baby — Envoi de la liste de favoris par email
   POST /api/save-list
   -------------------------------------------------------------
   Reçoit : { email, firstName, names: string[], lang }
   Fait    : envoie un email récapitulatif via Resend
   ============================================================= */

import { unsubscribeUrl, sendEmail } from "./_helpers.js";

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

function emailHeader() {
  return `<tr>
  <td style="background:#c9a27a;padding:28px 40px 24px;text-align:center;">
    ${LOGO_IMG}
  </td>
</tr>`;
}

function emailFooter(isFr, recipientEmail) {
  const unsub    = isFr ? "Se désabonner" : "Unsubscribe";
  const notice   = isFr
    ? "Vous recevez cet email car vous avez sauvegardé votre liste."
    : "You received this email because you saved your list.";
  const unsubUrl = recipientEmail ? unsubscribeUrl(recipientEmail) : "https://namespark.baby/unsubscribe";
  return `<tr>
  <td style="padding:0 40px 28px;text-align:center;border-top:1px solid #ece4da;">
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto 0;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#c9a27a;">NameSpark Baby</p>
          <p style="margin:0;font-size:11px;color:#b0a89e;line-height:1.6;">
            ${notice}<br>
            <a href="https://namespark.baby" style="color:#c9a27a;text-decoration:none;">namespark.baby</a>
            &nbsp;·&nbsp;
            <a href="${unsubUrl}" style="color:#d0c8be;text-decoration:none;">${unsub}</a>
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

function buildSelectionEmail({ lang, firstName, names, email }) {
  const isFr = lang !== "en";
  const greeting = firstName
    ? (isFr ? `Bonjour ${firstName},` : `Hi ${firstName},`)
    : (isFr ? "Bonjour," : "Hi,");
  const title   = isFr ? "Votre sélection" : "Your selection";
  const counter = isFr
    ? `${names.length} prénoms aimés`
    : `${names.length} favourite names`;
  const subtitle = isFr
    ? "Nous les avons sauvegardés pour vous."
    : "We saved them for you.";
  const cta = isFr ? "Retourner sur NameSpark Baby →" : "Back to NameSpark Baby →";

  /* Two-column name grid */
  const half = Math.ceil(names.length / 2);
  const col1 = names.slice(0, half);
  const col2 = names.slice(half);

  const maxRows = Math.max(col1.length, col2.length);
  let rows = "";
  for (let i = 0; i < maxRows; i++) {
    const n1 = col1[i];
    const n2 = col2[i];
    const cellStyle = `padding:10px 0 10px 4px;border-bottom:1px solid #f4efe9;font-size:14px;color:#1f1b16;width:50%;vertical-align:middle;`;
    rows += `<tr>
  <td style="${cellStyle}">
    ${n1 ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#c9a27a;margin-right:10px;vertical-align:middle;opacity:0.8;"></span><span style="vertical-align:middle;font-weight:500;">${n1}</span>` : ""}
  </td>
  <td style="${cellStyle}">
    ${n2 ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#c9a27a;margin-right:10px;vertical-align:middle;opacity:0.8;"></span><span style="vertical-align:middle;font-weight:500;">${n2}</span>` : ""}
  </td>
</tr>`;
  }

  const body = `
${emailHeader()}
<tr>
  <td style="padding:36px 40px 8px;text-align:center;">
    <h1 style="margin:0 0 14px;font-size:26px;font-weight:700;color:#1f1b16;letter-spacing:-.02em;font-family:Georgia,'Times New Roman',serif;">${title}</h1>
    <span style="display:inline-block;padding:5px 16px;background:#f4efe9;border:1px solid #ece4da;border-radius:100px;font-size:12px;font-weight:600;color:#a9805a;letter-spacing:.04em;">${counter}</span>
  </td>
</tr>
<tr>
  <td style="padding:8px 40px 4px;text-align:center;">
    <p style="margin:0 0 4px;font-size:14px;color:#6b6259;">${greeting}</p>
    <p style="margin:0;font-size:14px;color:#6b6259;">${subtitle}</p>
  </td>
</tr>
<tr>
  <td style="padding:20px 40px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      ${rows}
    </table>
  </td>
</tr>
<tr>
  <td style="padding:8px 40px 32px;border-top:1px solid #ece4da;margin-top:8px;">
    <!-- spacer -->
  </td>
</tr>
<tr>
  <td style="padding:0 40px 36px;text-align:center;">
    <a href="https://namespark.baby"
       style="display:inline-block;background:#c9a27a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:100px;letter-spacing:.01em;box-shadow:0 4px 14px -4px rgba(169,128,90,0.5);">
      ${cta}
    </a>
  </td>
</tr>
${emailFooter(isFr, email)}`;

  return emailWrapper(body, lang);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, firstName, names = [], lang = "fr", weeks = null } = req.body || {};
  if (!email || !names.length) {
    return res.status(400).json({ error: "email and names are required" });
  }

  /* Stade de grossesse (facultatif) — best effort, ne bloque jamais l'envoi.
     Valeurs acceptées : "4".."40" ou "born". */
  if (weeks) {
    const valid = weeks === "born" || (/^\d{1,2}$/.test(weeks) && +weeks >= 4 && +weeks <= 40);
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (valid && url && key) {
      fetch(`${url}/rest/v1/subscribers?on_conflict=email`, {
        method: "POST",
        headers: {
          apikey: key, Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          pregnancy_weeks: weeks,
          pregnancy_declared_at: new Date().toISOString(),
        }),
      }).catch((e) => console.error("[save-list] pregnancy upsert:", e.message));
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log("[save-list] DRY RUN →", email, names);
    return res.status(200).json({ sent: false, reason: "no_resend_key" });
  }

  const isFr = lang !== "en";

  try {
    const html = buildSelectionEmail({ lang, firstName, names, email });
    const { ok, result } = await sendEmail({
      apiKey:     resendKey,
      from:       "NameSpark Baby <bonjour@namespark.baby>",
      to:         email,
      subject:    isFr
        ? `Vos ${names.length} prénoms favoris — NameSpark Baby`
        : `Your ${names.length} favourite names — NameSpark Baby`,
      html,
      unsubEmail: email,
    });
    if (!ok) {
      console.error("[save-list] Resend error:", result);
      return res.status(500).json({ error: "Email send failed", detail: result });
    }
    return res.status(200).json({ sent: true, id: result?.id });
  } catch (err) {
    console.error("[save-list] error:", err);
    return res.status(500).json({ error: "Send error", detail: String(err && err.message || err) });
  }
}
