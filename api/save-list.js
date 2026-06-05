/* =============================================================
   NameSpark Baby — Envoi de la liste de favoris par email
   POST /api/save-list
   -------------------------------------------------------------
   Reçoit : { email, firstName, names: string[], lang }
   Fait    : envoie un email récapitulatif via Resend
   ============================================================= */

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

  /* Mode dry run sans clé */
  if (!resendKey) {
    console.log("[save-list] DRY RUN — email qui serait envoyé à :", email, "noms :", names);
    return res.status(200).json({ sent: false, reason: "no_resend_key" });
  }

  const greeting  = firstName ? (lang === "fr" ? `Bonjour ${firstName},` : `Hi ${firstName},`) : (lang === "fr" ? "Bonjour," : "Hi,");
  const title     = lang === "fr" ? "Votre sélection de prénoms" : "Your baby name selection";
  const subtitle  = lang === "fr"
    ? `Voici les ${names.length} prénoms que vous avez sauvegardés sur NameSpark Baby.`
    : `Here are the ${names.length} names you saved on NameSpark Baby.`;
  const cta       = lang === "fr" ? "Voir ma sélection" : "View my selection";
  const footer    = lang === "fr"
    ? "NameSpark Baby · Vous recevez cet email car vous avez sauvegardé votre liste."
    : "NameSpark Baby · You received this email because you saved your list.";

  const namesList = names.map((n) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #f0ece6;font-size:15px;color:#2c2c2c;">
        ❤️ &nbsp;${n}
      </td>
    </tr>`).join("");

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#2c2c2c;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#c8a882;padding:28px 40px;text-align:center;">
            <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:.12em;color:#fff;text-transform:uppercase;">NameSpark Baby</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#fff;">${title} ✨</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px 16px;">
            <p style="margin:0 0 8px;font-size:16px;">${greeting}</p>
            <p style="margin:0 0 24px;font-size:15px;color:#6b6259;">${subtitle}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ece6;border-radius:12px;overflow:hidden;">
              ${namesList}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px;text-align:center;">
            <a href="https://namespark.baby" style="display:inline-block;background:#c8a882;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:100px;">
              ${cta} →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;text-align:center;border-top:1px solid #f0ece6;">
            <p style="margin:0;font-size:12px;color:#aaa;">${footer}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

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
        subject: lang === "fr"
          ? `Vos ${names.length} prénoms favoris — NameSpark Baby`
          : `Your ${names.length} favourite names — NameSpark Baby`,
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
