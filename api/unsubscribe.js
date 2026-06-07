/* =============================================================
   NameSpark Baby — Désabonnement newsletter
   POST /api/unsubscribe
   Body : { email, token }
   ============================================================= */
import { verifyUnsubToken } from "./_helpers.js";

const ALLOWED_ORIGINS = [
  "https://namespark.baby",
  "https://www.namespark.baby",
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, token } = req.body || {};

  if (!email || !token) {
    return res.status(400).json({ error: "email and token required" });
  }

  if (!verifyUnsubToken(email, token)) {
    return res.status(403).json({ error: "Invalid token" });
  }

  /* Marquer comme désabonné dans Supabase */
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    try {
      await fetch(
        `${supabaseUrl}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            is_active: false,
            unsubscribed_at: new Date().toISOString(),
          }),
        }
      );
    } catch (err) {
      console.error("[unsubscribe] Supabase error:", err);
    }
  } else {
    console.log("[unsubscribe] DRY RUN — would unsubscribe:", email);
  }

  return res.status(200).json({ unsubscribed: true });
}
