/* =============================================================
   NameSpark Baby — Lecture sécurisée des leads (admin)
   GET /api/leads-admin
   -------------------------------------------------------------
   Authentification : header X-Admin-Token (ou ?token=…).
   La clé service_role n'est jamais exposée côté client.
   La table `leads` est protégée par RLS (lecture anon interdite) ;
   seule cette route, avec la clé service_role, peut la lire.
   ============================================================= */

const ALLOWED_ORIGINS = [
  "https://namespark.baby",
  "https://www.namespark.baby",
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).end();

  /* Token admin obligatoire — aucune valeur par défaut devinable */
  const token      = req.headers["x-admin-token"] || req.query.token || "";
  const adminToken = process.env.ADMIN_API_TOKEN;
  if (!adminToken) {
    return res.status(503).json({ error: "Service not configured" });
  }
  if (!token || token !== adminToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(503).json({ error: "Service not configured" });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/leads?select=id,email,first_name,surname,favorites,sessions,created_at,last_seen&order=last_seen.desc`,
      {
        headers: {
          apikey:        serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Accept:        "application/json",
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[leads-admin] Supabase error:", err);
      return res.status(502).json({ error: "Database error" });
    }

    const data = await response.json();
    return res.status(200).json({ leads: Array.isArray(data) ? data : [] });
  } catch (err) {
    console.error("[leads-admin] Fetch error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
