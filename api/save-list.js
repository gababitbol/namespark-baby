/* =============================================================
   NameSpark Baby — Envoi de la liste de favoris par email
   POST /api/save-list
   -------------------------------------------------------------
   Reçoit : { email, firstName, names: string[], lang }
   Fait    : envoie un email récapitulatif via Resend
   ============================================================= */

function buildSaveListHtml({ lang, greeting, title, subtitle, names, cta, footer }) {
  const nameRows = names.map((n) => `
    <tr>
      <td style="padding:13px 20px;border-bottom:1px solid #f0ece8;">
        <table cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="font-size:16px;padding-right:10px;vertical-align:middle;">❤️</td>
            <td style="font-size:15px;font-weight:600;color:#1f1b16;vertical-align:middle;">${n}</td>
          </tr>
        </table>
      </td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${title} — NameSpark Baby</title>
</head>
<body style="margin:0;padding:0;background:#fbf9f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1f1b16;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#fbf9f6;padding:48px 16px;">
    <tr><td align="center">

      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 48px -12px rgba(58,44,30,0.18);">

        <!-- ══════ HEADER / LOGO ══════ -->
        <tr>
          <td style="background:#c9a27a;padding:44px 40px 36px;text-align:center;">
            <!-- Logo mark -->
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 18px;">
              <tr>
                <td width="60" height="60" style="width:60px;height:60px;background:rgba(255,255,255,0.2);border-radius:30px;text-align:center;vertical-align:middle;">
                  <span style="font-size:30px;line-height:60px;color:#fff;display:block;">✦</span>
                </td>
              </tr>
            </table>
            <!-- Brand name -->
            <div style="font-size:10px;font-weight:800;letter-spacing:.22em;color:rgba(255,255,255,0.72);text-transform:uppercase;margin-bottom:5px;">NameSpark</div>
            <div style="font-size:30px;font-weight:700;color:#fff;font-family:Georgia,'Times New Roman',serif;letter-spacing:.02em;line-height:1.1;">Baby</div>
          </td>
        </tr>

        <!-- ══════ TITRE ══════ -->
        <tr>
          <td style="padding:40px 40px 8px;text-align:center;">
            <h1 style="margin:0 0 10px;font-size:24px;font-weight:800;color:#1f1b16;letter-spacing:-.02em;">${title} ✦</h1>
            <p style="margin:0;font-size:14px;color:#6b6259;line-height:1.6;">${greeting}</p>
          </td>
        </tr>

        <!-- ══════ SOUS-TITRE ══════ -->
        <tr>
          <td style="padding:16px 40px 28px;text-align:center;">
            <p style="margin:0;font-size:15px;color:#6b6259;line-height:1.6;">${subtitle}</p>
          </td>
        </tr>

        <!-- ══════ LISTE DES PRÉNOMS ══════ -->
        <tr>
          <td style="padding:0 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #ece4da;border-radius:14px;overflow:hidden;">
              ${nameRows}
              <!-- Dernière rangée sans bordure en bas : supprimée via CSS inline -->
            </table>
          </td>
        </tr>

        <!-- ══════ CTA ══════ -->
        <tr>
          <td style="padding:0 40px 44px;text-align:center;">
            <a href="https://namespark.baby"
               style="display:inline-block;background:#c9a27a;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:100px;letter-spacing:.02em;box-shadow:0 4px 16px -4px rgba(169,128,90,0.45);">
              ${cta} →
            </a>
          </td>
        </tr>

        <!-- ══════ FOOTER ══════ -->
        <tr>
          <td style="padding:20px 40px 28px;text-align:center;border-top:1px solid #ece4da;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c9a27a;">NameSpark Baby</p>
            <p style="margin:0;font-size:11px;color:#b0a89e;line-height:1.6;">
              ${footer}<br>
              <a href="https://namespark.baby" style="color:#c9a27a;text-decoration:none;">namespark.baby</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, firstName, names = [], lang = "fr" } = req.body || {};

  if (!email || !names.length) {
    return res.status(400).json({ error: "email and names are required" });
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.log("[save-list] DRY RUN — email qui serait envoyé à :", email, "noms :", names);
    return res.status(200).json({ sent: false, reason: "no_resend_key" });
  }

  const isFr = lang !== "en";

  const greeting  = firstName
    ? (isFr ? `Bonjour ${firstName},` : `Hi ${firstName},`)
    : (isFr ? "Bonjour," : "Hi,");
  const title     = isFr ? "Votre sélection de prénoms" : "Your baby name selection";
  const subtitle  = isFr
    ? `Voici les ${names.length} prénoms que vous avez sauvegardés sur NameSpark Baby.`
    : `Here are the ${names.length} names you saved on NameSpark Baby.`;
  const cta       = isFr ? "Retourner sur NameSpark Baby" : "Back to NameSpark Baby";
  const footer    = isFr
    ? "Vous recevez cet email car vous avez sauvegardé votre liste."
    : "You received this email because you saved your list.";

  const html = buildSaveListHtml({ lang, greeting, title, subtitle, names, cta, footer });

  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NameSpark Baby <bonjour@namespark.baby>",
        to: [email],
        subject: isFr
          ? `Vos ${names.length} prénoms favoris — NameSpark Baby ✦`
          : `Your ${names.length} favourite names — NameSpark Baby ✦`,
        html,
      }),
    });

    const result = await emailRes.json();
    if (!emailRes.ok) {
      console.error("[save-list] Resend error:", result);
      return res.status(500).json({ error: "Email send failed", detail: result });
    }

    return res.status(200).json({ sent: true, id: result.id });
  } catch (err) {
    console.error("[save-list] Fetch error:", err);
    return res.status(500).json({ error: "Network error" });
  }
}
