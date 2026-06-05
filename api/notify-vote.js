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
    /* Pas d'email enregistré — on log et on répond OK pour ne pas bloquer l'UX */
    console.warn("[notify-vote] No creator email for decision:", decisionId);
    return res.status(200).json({ sent: false, reason: "no_creator_email" });
  }

  /* ── 2. Construire l'email ── */
  const resendKey = process.env.RESEND_API_KEY;

  const yes   = (votes.yes   || []).join(", ") || "—";
  const maybe = (votes.maybe || []).join(", ") || "—";
  const no    = (votes.no    || []).join(", ") || "—";

  /* MODE LOG : si RESEND_API_KEY absent, log les détails et renvoie OK.
     Utile pour tester le flux complet avant de configurer Resend. */
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

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau vote</title>
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#2c2c2c;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#c8a882;padding:28px 40px;text-align:center;">
            <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:.12em;color:#fff;text-transform:uppercase;">NameSpark Baby</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#fff;">
              ${voterName} a voté 🎉
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">${greeting}</p>
            <p style="margin:0 0 28px;font-size:16px;line-height:1.6;">
              <strong>${voterName}</strong> vient de terminer son vote sur votre sélection de prénoms.
            </p>

            <!-- Votes -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="padding:14px 16px;background:#fdf2f2;border-radius:10px 10px 0 0;border-bottom:1px solid #f5e8e8;">
                  <span style="font-size:18px;">❤️</span>
                  <span style="font-size:14px;font-weight:600;color:#c0392b;margin-left:8px;">Aimés</span>
                  <p style="margin:6px 0 0;font-size:15px;color:#2c2c2c;">${yes}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 16px;background:#fffbf0;border-bottom:1px solid #f5f0e0;">
                  <span style="font-size:18px;">🤔</span>
                  <span style="font-size:14px;font-weight:600;color:#d68910;margin-left:8px;">Peut-être</span>
                  <p style="margin:6px 0 0;font-size:15px;color:#2c2c2c;">${maybe}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 16px;background:#f8f9fa;border-radius:0 0 10px 10px;">
                  <span style="font-size:18px;">❌</span>
                  <span style="font-size:14px;font-weight:600;color:#7f8c8d;margin-left:8px;">Refusés</span>
                  <p style="margin:6px 0 0;font-size:15px;color:#2c2c2c;">${no}</p>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <div style="text-align:center;">
              <a href="${resultsUrl}"
                 style="display:inline-block;background:#c8a882;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:100px;">
                Voir les résultats →
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;text-align:center;border-top:1px solid #f0ece6;">
            <p style="margin:0;font-size:12px;color:#aaa;">
              NameSpark Baby · Vous recevez cet email car vous avez créé une session de vote.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

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
        subject: `${voterName} a voté sur votre sélection de prénoms`,
        html,
      }),
    });

    const result = await emailRes.json();

    if (!emailRes.ok) {
      console.error("[notify-vote] Resend error:", result);
      return res.status(500).json({ error: "Email send failed", detail: result });
    }

    /* ── 4. Log console (à remplacer par table Supabase quand créée) ── */
    console.log("[notify-vote] Email envoyé :", {
      to: creatorEmail, voter: voterName, resend_id: result.id,
    });

    return res.status(200).json({ sent: true, id: result.id });

  } catch (err) {
    console.error("[notify-vote] Fetch error:", err);
    return res.status(500).json({ error: "Network error" });
  }
}
