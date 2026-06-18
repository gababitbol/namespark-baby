/* =============================================================
   NameSpark Baby — Enregistrement leads / users (serveur)
   POST /api/track   body: { kind:"lead"|"user", email, firstName, surname, favorites, sessions }
   -------------------------------------------------------------
   Écrit dans leads / users / subscribers avec la clé service_role
   (contourne RLS). Remplace les upserts anon directs : la clé anon
   n'a plus aucun droit d'écriture sur leads/users (lecture déjà fermée).
   ============================================================= */

const ALLOWED_ORIGINS = [
  "https://namespark.baby",
  "https://www.namespark.baby",
];

async function sbUpsert(supabaseUrl, serviceKey, table, row, onConflict, representation = false) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: {
      apikey:        serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: `resolution=merge-duplicates,return=${representation ? "representation" : "minimal"}`,
    },
    body: JSON.stringify(row),
  });
  return res;
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

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(503).json({ error: "Service not configured" });
  }

  let { kind, email, firstName, surname, favorites, sessions } = req.body || {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "email required" });
  }
  email = email.trim().toLowerCase();
  if (email === "admin") return res.status(204).end();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "invalid email" });
  }

  const now = new Date().toISOString();
  let userId = null;

  try {
    if (kind === "user") {
      const row = { email, last_seen: now };
      if (firstName) row.first_name = firstName;
      if (surname)   row.surname    = surname;
      const r = await sbUpsert(supabaseUrl, serviceKey, "users", row, "email", true);
      if (r.ok) {
        const data = await r.json().catch(() => null);
        if (Array.isArray(data) && data[0]) userId = data[0].id || null;
      } else {
        console.error("[track] users upsert:", await r.text().catch(() => ""));
      }
    } else {
      const row = { email, last_seen: now };
      if (firstName)                  row.first_name = firstName;
      if (surname)                    row.surname    = surname;
      if (typeof favorites === "number") row.favorites = favorites;
      if (typeof sessions  === "number") row.sessions  = sessions;
      const r = await sbUpsert(supabaseUrl, serviceKey, "leads", row, "email");
      if (!r.ok) console.error("[track] leads upsert:", await r.text().catch(() => ""));
    }

    /* Dual-write subscribers (source de vérité admin) — best-effort, non bloquant */
    try {
      const sub = { email };
      if (firstName) sub.first_name = firstName;
      if (surname)   sub.last_name  = surname;
      await sbUpsert(supabaseUrl, serviceKey, "subscribers", sub, "email");
    } catch (e) {
      console.warn("[track] subscribers dual-write:", e);
    }

    return res.status(200).json({ ok: true, id: userId });
  } catch (err) {
    console.error("[track] error:", err);
    return res.status(500).json({ error: "track failed" });
  }
}
