/* =============================================================
   NameSpark Baby — Helpers partagés (non exposé comme route Vercel)
   ============================================================= */
import crypto from "crypto";

const UNSUB_SECRET = process.env.UNSUBSCRIBE_SECRET || "namespark-baby-unsub-2026";

export function generateUnsubToken(email) {
  return crypto
    .createHmac("sha256", UNSUB_SECRET)
    .update(email.toLowerCase().trim())
    .digest("hex")
    .slice(0, 40);
}

export function verifyUnsubToken(email, token) {
  const expected = generateUnsubToken(email);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

export function unsubscribeUrl(email) {
  const token = generateUnsubToken(email);
  return `https://namespark.baby/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

/* ──────────────────────────────────────────────────────────────
   Envoi email via Resend — avec headers de délivrabilité standard
   ────────────────────────────────────────────────────────────── */

/**
 * Convertit un corps HTML email en texte brut lisible.
 * Sert de fallback text/plain — améliore le score anti-spam.
 */
function htmlToText(html) {
  return (html || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<a [^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, "$2 ( $1 )")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/td>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&#[0-9]+;/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Envoie un email via Resend avec les headers de délivrabilité obligatoires.
 *
 * Toujours inclus :
 *   - text/plain fallback (auto-généré si absent)
 *   - List-Unsubscribe  + List-Unsubscribe-Post (exigé par Gmail depuis fév. 2024)
 *   - Reply-To → bonjour@namespark.baby
 *
 * @param {object} opts
 * @param {string}          opts.apiKey      Clé RESEND_API_KEY
 * @param {string}          opts.from        "NameSpark Baby <bonjour@namespark.baby>"
 * @param {string|string[]} opts.to          Destinataire(s)
 * @param {string}          opts.subject
 * @param {string}          opts.html        Corps HTML complet
 * @param {string}          [opts.text]      Corps texte brut (auto-généré si omis)
 * @param {string}          [opts.unsubEmail] Email du destinataire pour URL désabo personnalisée
 * @returns {Promise<{ok: boolean, result: object, id?: string}>}
 */
export async function sendEmail({ apiKey, from, to, subject, html, text, unsubEmail }) {
  const unsubLink = unsubEmail
    ? unsubscribeUrl(unsubEmail)
    : "https://namespark.baby/unsubscribe";

  const payload = {
    from,
    to:       Array.isArray(to) ? to : [to],
    reply_to: "bonjour@namespark.baby",
    subject,
    html,
    text: text || htmlToText(html),
    headers: {
      /* Requis par Gmail pour les expéditeurs en volume (fév. 2024) */
      "List-Unsubscribe":      `<${unsubLink}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  return { ok: res.ok, result, id: result?.id };
}

/* Bloc footer email standard */
export function footerHtml({ notice, unsubLabel, unsubUrl }) {
  return `<tr>
  <td style="padding:0 40px 28px;text-align:center;border-top:1px solid #ece4da;">
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto 0;">
      <tr><td style="text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#c9a27a;">NameSpark Baby</p>
        <p style="margin:0;font-size:11px;color:#b0a89e;line-height:1.7;">
          ${notice}<br>
          <a href="https://namespark.baby" style="color:#c9a27a;text-decoration:none;">namespark.baby</a>
          &nbsp;·&nbsp;
          <a href="${unsubUrl}" style="color:#d0c8be;text-decoration:none;">${unsubLabel}</a>
        </p>
      </td></tr>
    </table>
  </td>
</tr>`;
}
