/* =============================================================
   NameSpark Baby — Abonnement newsletter
   POST /api/subscribe-newsletter
   -------------------------------------------------------------
   Reçoit : { email, firstName, lang }
   Fait    : upsert dans Supabase table `newsletter_subscribers`
             + email de confirmation via Resend

   Migration Supabase requise (une seule fois) :
   ─────────────────────────────────────────────
   CREATE TABLE IF NOT EXISTS newsletter_subscribers (
     id              UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
     email           TEXT    UNIQUE NOT NULL,
     first_name      TEXT,
     lang            TEXT    DEFAULT 'fr',
     subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
     unsubscribed_at TIMESTAMPTZ,
     is_active       BOOLEAN DEFAULT TRUE
   );
   ============================================================= */

import { unsubscribeUrl } from "./_helpers.js";

const ALLOWED_ORIGINS = [
  "https://namespark.baby",
  "https://www.namespark.baby",
];

const LOGO_IMG = `<img src="https://namespark.baby/email-logo.png" alt="NameSpark Baby" width="220" height="51" style="display:block;margin:0 auto;border:0;max-width:220px;" />`;

function confirmationEmail({ firstName, lang, email }) {
  const isFr = lang !== "en";
  const greeting = firstName
    ? (isFr ? `Bonjour ${firstName},` : `Hi ${firstName},`)
    : (isFr ? "Bonjour," : "Hi,");

  const body = isFr ? `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1f1b16;">${greeting}</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#6b6259;">
      Vous êtes maintenant abonné(e) à la newsletter <strong style="color:#a9805a;">NameSpark Baby</strong>.
    </p>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#6b6259;">
      Chaque semaine vous recevrez un prénom à découvrir, des tendances et des idées pour vous aider à choisir.
    </p>` : `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1f1b16;">${greeting}</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#6b6259;">
      You're now subscribed to the <strong style="color:#a9805a;">NameSpark Baby</strong> newsletter.
    </p>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#6b6259;">
      Every week you'll receive a name to discover, trends, and ideas to help you choose.
    </p>`;

  const ctaText = isFr ? "Explorer les prénoms →" : "Explore names →";
  const footerNote = isFr
    ? "Vous recevez cet email car vous venez de vous abonner."
    : "You received this email because you just subscribed.";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#fbf9f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1f1b16;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#fbf9f6;padding:44px 16px 52px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 48px -16px rgba(58,44,30,0.20);">
        <tr><td style="background:#c9a27a;padding:28px 40px 24px;text-align:center;">${LOGO_IMG}</td></tr>
        <tr>
          <td style="padding:36px 40px 8px;text-align:center;">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1f1b16;font-family:Georgia,serif;">${isFr ? "Bienvenue ✦" : "Welcome ✦"}</h1>
          </td>
        </tr>
        <tr><td style="padding:8px 40px 28px;">${body}</td></tr>
        <tr>
          <td style="padding:0 40px 36px;text-align:center;">
            <a href="https://namespark.baby" style="display:inline-block;background:#c9a27a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:100px;box-shadow:0 4px 14px -4px rgba(169,128,90,0.5);">${ctaText}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 28px;text-align:center;border-top:1px solid #ece4da;">
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto 0;">
              <tr><td style="text-align:center;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#c9a27a;">NameSpark Baby</p>
                <p style="margin:0;font-size:11px;color:#b0a89e;line-height:1.6;">${footerNote}<br>
                  <a href="https://namespark.baby" style="color:#c9a27a;text-decoration:none;">namespark.baby</a>
                  &nbsp;·&nbsp;
                  <a href="${unsubscribeUrl(email)}" style="color:#d0c8be;text-decoration:none;">${isFr ? "Se désabonner" : "Unsubscribe"}</a>
                </p>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, firstName, lang = "fr" } = req.body || {};
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email required" });
  }

  /* ── 1. Upsert dans Supabase ── */
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers`, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          email,
          first_name: firstName || null,
          lang,
          is_active: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
        }),
      });
    } catch (err) {
      console.error("[subscribe-newsletter] Supabase error:", err);
      /* On continue quand même — email de confirmation reste prioritaire */
    }
  }

  /* ── 2. Email de confirmation ── */
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log("[subscribe-newsletter] DRY RUN →", email);
    return res.status(200).json({ subscribed: true, emailSent: false });
  }

  const html = confirmationEmail({ firstName, lang, email });
  const isFr = lang !== "en";

  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "NameSpark Baby <bonjour@namespark.baby>",
        to: [email],
        subject: isFr
          ? "Bienvenue dans la newsletter NameSpark Baby ✦"
          : "Welcome to the NameSpark Baby newsletter ✦",
        html,
      }),
    });
    const result = await emailRes.json();
    if (!emailRes.ok) console.error("[subscribe-newsletter] Resend:", result);
    return res.status(200).json({ subscribed: true, emailSent: emailRes.ok, id: result.id });
  } catch (err) {
    console.error("[subscribe-newsletter] Fetch error:", err);
    return res.status(200).json({ subscribed: true, emailSent: false });
  }
}
