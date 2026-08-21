/* =============================================================
   keepalive.js — Empêche la mise en pause automatique de Supabase
   =============================================================
   Supabase (plan gratuit) met un projet en pause après ~7 jours
   sans aucune requête. Un projet en pause ne résout plus en DNS :
   toutes les lectures échouent et les liens de vote affichent
   « session expirée ».

   Cette route est appelée chaque jour par le cron Vercel
   (voir "crons" dans vercel.json). Elle fait une vraie requête
   SQL, ce qui compte comme activité et remet le compteur à zéro.

   Si le projet est DÉJÀ en pause, elle tente une reprise via la
   Management API — uniquement si SUPABASE_ACCESS_TOKEN est
   configuré (jeton personnel, à créer par le propriétaire).

   Variables d'environnement :
   - SUPABASE_URL                (déjà configurée)
   - SUPABASE_SERVICE_ROLE_KEY   (déjà configurée)
   - CRON_SECRET                 (optionnelle — protège la route)
   - SUPABASE_ACCESS_TOKEN       (optionnelle — reprise auto)
   ============================================================= */

const PING_TIMEOUT_MS = 10000;
const RESTORE_TIMEOUT_MS = 15000;

/* Extrait la référence du projet depuis l'URL Supabase.
   https://agpyqijxzcwesphoxlww.supabase.co → agpyqijxzcwesphoxlww */
function projectRefFrom(url) {
  try {
    return new URL(url).hostname.split(".")[0] || null;
  } catch {
    return null;
  }
}

/* Requête réelle sur la base — c'est elle qui compte comme activité. */
async function pingDatabase(url, key) {
  const r = await fetch(`${url}/rest/v1/decisions?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(PING_TIMEOUT_MS),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return true;
}

/* Reprise du projet via la Management API (nécessite un jeton personnel). */
async function restoreProject(ref, token) {
  const r = await fetch(`https://api.supabase.com/v1/projects/${ref}/restore`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({}),
    signal: AbortSignal.timeout(RESTORE_TIMEOUT_MS),
  });
  return { ok: r.ok, status: r.status, body: (await r.text()).slice(0, 300) };
}

export default async function handler(req, res) {
  /* Protection optionnelle : si CRON_SECRET existe, on l'exige.
     Vercel Cron envoie automatiquement cet en-tête. */
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return res.status(500).json({ error: "missing_supabase_env" });
  }

  const checkedAt = new Date().toISOString();

  try {
    await pingDatabase(url, key);
    return res.status(200).json({ status: "awake", restored: false, checkedAt });
  } catch (err) {
    /* Injoignable → très probablement en pause (DNS retiré). */
    const reason = err.name === "TimeoutError" ? "timeout" : err.message;
    const token = process.env.SUPABASE_ACCESS_TOKEN;
    const ref = projectRefFrom(url);

    if (!token || !ref) {
      console.error("[keepalive] base injoignable, reprise auto indisponible:", reason);
      return res.status(503).json({
        status: "unreachable",
        reason,
        restored: false,
        hint: "Configurer SUPABASE_ACCESS_TOKEN pour la reprise automatique.",
        checkedAt,
      });
    }

    try {
      const r = await restoreProject(ref, token);
      console.error("[keepalive] tentative de reprise:", r.status, r.body);
      return res.status(r.ok ? 200 : 502).json({
        status: r.ok ? "restore_requested" : "restore_failed",
        reason,
        restored: r.ok,
        managementApiStatus: r.status,
        checkedAt,
      });
    } catch (e2) {
      console.error("[keepalive] reprise échouée:", e2.message);
      return res.status(502).json({
        status: "restore_error",
        reason,
        restored: false,
        error: e2.message,
        checkedAt,
      });
    }
  }
}
