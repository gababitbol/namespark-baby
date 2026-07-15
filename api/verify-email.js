/* =============================================================
   NameSpark Baby — Vérification email (MX + domaines jetables)
   POST /api/verify-email
   Body : { email: string }
   Retourne : { valid: boolean, reason: 'ok' | 'invalid_format' | 'disposable' | 'no_mx' }
   ============================================================= */

import { promises as dns } from "dns";

/* Liste des domaines d'emails temporaires / jetables les plus courants */
const DISPOSABLE = new Set([
  /* Mailinator */
  "mailinator.com","mailinater.com","mailinator2.com","suremail.info",
  /* Yopmail */
  "yopmail.com","yopmail.fr","cool.fr.nf","jetable.fr.nf","nospam.ze.tc",
  "nomail.xl.cx","mega.zik.dj","speed.1s.fr","courriel.fr.nf",
  "moncourrier.fr.nf","monemail.fr.nf","monmail.fr.nf","jetable.net",
  /* Guerrilla Mail */
  "guerrillamail.com","guerrillamail.net","guerrillamail.org","guerrillamail.de",
  "guerrillamail.info","guerrillamail.biz","sharklasers.com","guerrillamailblock.com",
  "grr.la","spam4.me","spam.la",
  /* TrashMail */
  "trashmail.com","trashmail.at","trashmail.io","trashmail.me","trashmail.org",
  "trashmail.network","trashmail.xyz","trashdevil.de","trashdevil.com",
  /* 10 Minute Mail */
  "10minutemail.com","10minutemail.net","10minutemail.org","10minutemail.co.uk",
  /* Temp-Mail */
  "tempmail.com","temp-mail.org","temp-mail.ru","tempmail.net","tempr.email",
  "temporary-mail.com","tempinbox.com","tempemail.com","tempsky.com",
  /* Maildrop / Discard */
  "maildrop.cc","discard.email","fakeinbox.com","mailscrap.com","mailnull.com",
  /* Throw-away */
  "throwam.com","throwam.net","throwaway.email","emailondeck.com",
  "burnermail.io","filzmail.com",
  /* SpamGourmet */
  "spamgourmet.com","spamgourmet.net","spamgourmet.org",
  /* Misc jetables */
  "mailexpire.com","spamex.com","spamfree.eu","spamfree24.org","spamfree24.de",
  "spamfree24.eu","spamfree24.net","spamfree24.info","spamoff.de",
  "getairmail.com","dispostable.com","harakirimail.com","mailnew.com",
  "maileater.com","moakt.com","getnada.com","inboxbear.com","laoeq.com",
  "mt2009.com","mt2014.com","mt2015.com","spamstack.net","spamcowboy.com",
  "spamcowboy.net","spamcowboy.org","spammotel.com","spaml.de",
  "cevipsa.com","chacuo.net","tafmail.com","mailboxy.fun","spamhereplease.com",
]);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body || {};
  if (!email || typeof email !== "string") {
    return res.status(200).json({ valid: false, reason: "invalid_format" });
  }

  const normalized = email.trim().toLowerCase();
  const atIdx = normalized.lastIndexOf("@");
  if (atIdx < 1) return res.status(200).json({ valid: false, reason: "invalid_format" });

  const domain = normalized.slice(atIdx + 1);
  if (!domain || !domain.includes(".")) {
    return res.status(200).json({ valid: false, reason: "invalid_format" });
  }

  /* 1 — domaine jetable ? */
  if (DISPOSABLE.has(domain)) {
    return res.status(200).json({ valid: false, reason: "disposable" });
  }

  /* 2 — vérification MX (le domaine peut-il recevoir des emails ?) */
  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return res.status(200).json({ valid: false, reason: "no_mx" });
    }
    return res.status(200).json({ valid: true, reason: "ok" });
  } catch (err) {
    /* ENODATA = pas de MX, ENOTFOUND = domaine inexistant */
    if (err.code === "ENODATA" || err.code === "ENOTFOUND" || err.code === "SERVFAIL") {
      return res.status(200).json({ valid: false, reason: "no_mx" });
    }
    /* Timeout réseau ou autre erreur DNS → on laisse passer (fail open) */
    console.warn("[verify-email] DNS fallback:", err.code, domain);
    return res.status(200).json({ valid: true, reason: "dns_error" });
  }
}
