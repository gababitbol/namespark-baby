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
