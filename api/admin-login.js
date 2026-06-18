/* =============================================================
   NameSpark Baby — Authentification admin (serveur)
   POST /api/admin-login   body: { password }
   -------------------------------------------------------------
   Vérifie le mot de passe contre process.env.ADMIN_PASSWORD.
   Au succès, renvoie le token (process.env.ADMIN_API_TOKEN) utilisé
   pour appeler les API admin protégées (leads-admin, subscribers-admin).

   Ni le mot de passe ni le token ne sont stockés dans le JS livré au client.
   ============================================================= */

import crypto from "crypto";

const ALLOWED_ORIGINS = [
  "https://namespark.baby",
  "https://www.namespark.baby",
];

/* Comparaison à temps constant, tolérante aux longueurs différentes */
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    /* Compare quand même contre soi-même pour ne pas court-circuiter le timing */
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
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

  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminToken    = process.env.ADMIN_API_TOKEN;
  if (!adminPassword || !adminToken) {
    console.error("[admin-login] ADMIN_PASSWORD ou ADMIN_API_TOKEN absent");
    return res.status(503).json({ error: "Service not configured" });
  }

  const { password } = req.body || {};
  if (typeof password !== "string" || !password) {
    return res.status(400).json({ ok: false });
  }

  if (!safeEqual(password, adminPassword)) {
    return res.status(401).json({ ok: false });
  }

  return res.status(200).json({ ok: true, token: adminToken });
}
