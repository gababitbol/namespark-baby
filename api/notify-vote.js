/* =============================================================
   NameSpark Baby — Email de notification après vote
   POST /api/notify-vote
   -------------------------------------------------------------
   Reçoit : { decisionId, voterName, votes: { yes: [], maybe: [], no: [] } }
   Fait    : récupère l'email du créateur depuis Supabase,
             envoie un email via Resend.
   Vars d'env requises sur Vercel :
     RESEND_API_KEY
     SUPABASE_URL            (même URL que le frontend)
     SUPABASE_SERVICE_ROLE_KEY  (Project Settings → API → service_role)
   ============================================================= */

const ALLOWED_ORIGINS = [
  "https://namespark.baby",
  "https://www.namespark.baby",
];

function buildVoteEmailHtml({ voterName, greeting, resultsUrl, yes, maybe, no }) {
  const yesHtml   = yes   === "—" ? `<span style="color:#9ca3af;font-style:italic">Aucun prénom aimé</span>` : yes;
  const maybeHtml = maybe === "—" ? `<span style="color:#9ca3af;font-style:italic">Aucun</span>` : maybe;
  const noHtml    = no    === "—" ? `<span style="color:#9ca3af;font-style:italic">Aucun prénom refusé</span>` : no;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Nouveau vote — NameSpark Baby</title>
</head>
<body style="margin:0;padding:0;background:#fbf9f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1f1b16;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#fbf9f6;padding:48px 16px;">
    <tr><td align="center">

      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 48px -12px rgba(58,44,30,0.18);">

        <!-- ══════ HEADER / LOGO ══════ -->
        <tr>
          <td style="background:#c9a27a;padding:32px 40px 28px;text-align:center;">
            <img src="https://namespark.baby/email-logo.png"
                 alt="NameSpark Baby"
                 width="220" height="51"
                 style="display:block;margin:0 auto;border:0;outline:none;text-decoration:none;max-width:220px;" />
          </td>
        </tr>

        <!-- ══════ INTRO ══════ -->
        <tr>
          <td style="padding:40px 40px 8px;">
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#1f1b16;">${greeting}</p>
            <p style="margin:0 0 36px;font-size:16px;line-height:1.7;color:#1f1b16;">
              <strong style="color:#a9805a;">${voterName}</strong> vient de terminer son vote sur votre sélection de prénoms. Voici ce qu'il·elle a choisi :
            </p>
          </td>
        </tr>

        <!-- ══════ RÉSULTATS DU VOTE ══════ -->
        <tr>
          <td style="padding:0 40px 36px;">

            <!-- ❤️ Aimés -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:10px;border-radius:14px;overflow:hidden;border:1px solid #bbf7d0;">
              <tr>
                <td style="background:#f0fdf4;padding:18px 20px;">
                  <table cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="font-size:20px;vertical-align:middle;padding-right:10px;">❤️</td>
                      <td style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#15803d;vertical-align:middle;">Prénoms aimés</td>
                    </tr>
                  </table>
                  <p style="margin:10px 0 0;font-size:15px;color:#1f1b16;line-height:1.65;">${yesHtml}</p>
                </td>
              </tr>
            </table>

            <!-- 🤔 Peut-être -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:10px;border-radius:14px;overflow:hidden;border:1px solid #fde68a;">
              <tr>
                <td style="background:#fffbeb;padding:18px 20px;">
                  <table cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="font-size:20px;vertical-align:middle;padding-right:10px;">🤔</td>
                      <td style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#b45309;vertical-align:middle;">Peut-être</td>
                    </tr>
                  </table>
                  <p style="margin:10px 0 0;font-size:15px;color:#1f1b16;line-height:1.65;">${maybeHtml}</p>
                </td>
              </tr>
            </table>

            <!-- ✕ Refusés -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:14px;overflow:hidden;border:1px solid #ece4da;">
              <tr>
                <td style="background:#faf9f6;padding:18px 20px;">
                  <table cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="font-size:20px;vertical-align:middle;padding-right:10px;">❌</td>
                      <td style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#6b6259;vertical-align:middle;">Refusés</td>
                    </tr>
                  </table>
                  <p style="margin:10px 0 0;font-size:15px;color:#6b6259;line-height:1.65;">${noHtml}</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ══════ CTA ══════ -->
        <tr>
          <td style="padding:0 40px 44px;text-align:center;">
            <a href="${resultsUrl}"
               style="display:inline-block;background:#c9a27a;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:100px;letter-spacing:.02em;box-shadow:0 4px 16px -4px rgba(169,128,90,0.45);">
              Voir les résultats complets →
            </a>
          </td>
        </tr>

        <!-- ══════ FOOTER ══════ -->
        <tr>
          <td style="padding:20px 40px 28px;text-align:center;border-top:1px solid #ece4da;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c9a27a;">NameSpark Baby</p>
            <p style="margin:0;font-size:11px;color:#b0a89e;line-height:1.6;">
              Vous recevez cet email car vous avez créé une session de vote.<br>
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

  /* ── 1. Récupérer l'email du créateur depuis Supabase ── */
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("[notify-vote] Missing Supabase env vars");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  let creatorEmail = null;
  let creatorName  = null;

  try {
    const sbRes = await fetch(
      `${supabaseUrl}/rest/v1/participants?decision_id=eq.${encodeURIComponent(decisionId)}&role=eq.creator&select=name,email`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );
    const rows = await sbRes.json();
    if (Array.isArray(rows) && rows.length > 0) {
      creatorEmail = rows[0].email;
      creatorName  = rows[0].name;
    }
  } catch (err) {
    console.error("[notify-vote] Supabase fetch error:", err);
    return res.status(500).json({ error: "Database error" });
  }

  if (!creatorEmail) {
    console.warn("[notify-vote] No creator email for decision:", decisionId);
    return res.status(200).json({ sent: false, reason: "no_creator_email" });
  }

  /* ── 2. Construire l'email ── */
  const resendKey = process.env.RESEND_API_KEY;

  const yes   = (votes.yes   || []).join(", ") || "—";
  const maybe = (votes.maybe || []).join(", ") || "—";
  const no    = (votes.no    || []).join(", ") || "—";

  if (!resendKey) {
    console.log("[notify-vote] DRY RUN — RESEND_API_KEY non configurée.");
    console.log("[notify-vote] Email qui serait envoyé :", {
      to: creatorEmail,
      subject: `${voterName} a voté sur votre sélection de prénoms`,
      yes, maybe, no,
    });
    return res.status(200).json({
      sent: false,
      reason: "no_resend_key",
      preview: { to: creatorEmail, subject: `${voterName} a voté`, yes, maybe, no },
    });
  }

  const resultsUrl = `https://namespark.baby/?decision=${encodeURIComponent(decisionId)}`;
  const greeting   = creatorName ? `Bonjour ${creatorName},` : "Bonjour,";

  const html = buildVoteEmailHtml({ voterName, greeting, resultsUrl, yes, maybe, no });

  /* ── 3. Envoyer via Resend ── */
  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NameSpark Baby <votes@namespark.baby>",
        to: [creatorEmail],
        subject: `${voterName} a voté sur votre sélection de prénoms ✦`,
        html,
      }),
    });

    const result = await emailRes.json();

    if (!emailRes.ok) {
      console.error("[notify-vote] Resend error:", result);
      return res.status(500).json({ error: "Email send failed", detail: result });
    }

    console.log("[notify-vote] Email envoyé :", {
      to: creatorEmail, voter: voterName, resend_id: result.id,
    });

    return res.status(200).json({ sent: true, id: result.id });

  } catch (err) {
    console.error("[notify-vote] Fetch error:", err);
    return res.status(500).json({ error: "Network error" });
  }
}
