/* =============================================================
   NameSpark Baby — Fonction backend SÉCURISÉE (Vercel Function)
   -------------------------------------------------------------
   ⚠️  ÉTAT : PRÉPARÉE MAIS NON ENCORE BRANCHÉE.
   Le frontend tourne aujourd'hui en MODE DÉMO (génération locale,
   voir generateDemo() dans app.js). Ce fichier est le point
   d'entrée prêt à l'emploi pour passer plus tard à une génération
   par IA, SANS jamais exposer de clé API dans le frontend.

   POURQUOI ICI :
   - Sur Vercel, tout fichier dans /api devient un endpoint serveur.
   - La clé ANTHROPIC_API_KEY est lue depuis les variables
     d'environnement (process.env), donc côté serveur uniquement.
   - Le navigateur appelle simplement POST /api/generate.

   POUR ACTIVER PLUS TARD :
   1) `npm i @anthropic-ai/sdk`
   2) Définir la variable d'env ANTHROPIC_API_KEY sur Vercel
      (Project Settings → Environment Variables).
   3) Dé-commenter le bloc Anthropic ci-dessous.
   4) Dans app.js, remplacer `generateDemo(...)` par
      `await generateViaBackend(...)`.
   ============================================================= */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filters = {}, limit = 8, lang = "fr" } = req.body || {};

  try {
    // -------------------------------------------------------------
    // BLOC IA (à activer quand le backend sera prêt) :
    //
    // import Anthropic from "@anthropic-ai/sdk";
    // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    //
    // const prompt = buildPrompt(filters, limit, lang);
    // const message = await anthropic.messages.create({
    //   model: "claude-sonnet-4-6",
    //   max_tokens: 1500,
    //   messages: [{ role: "user", content: prompt }]
    // });
    // const names = parseNames(message.content[0].text);
    // return res.status(200).json({ names });
    //
    // -------------------------------------------------------------

    // Tant que l'IA n'est pas branchée, on signale clairement
    // que l'endpoint existe mais n'est pas encore actif.
    return res.status(501).json({
      error: "Not implemented yet",
      message:
        "Le backend IA n'est pas encore activé. Le frontend utilise le mode démo (génération locale).",
      received: { filters, limit, lang }
    });
  } catch (err) {
    return res.status(500).json({ error: "Generation failed", detail: String(err) });
  }
}

/* Exemple de construction de prompt (référence pour plus tard).
function buildPrompt(filters, limit, lang) {
  return `Tu es un expert en prénoms de bébé. Propose ${limit} prénoms au format JSON
strict (tableau d'objets {name, gender, origin, style, meaning, why}) correspondant à
ces critères : ${JSON.stringify(filters)}. Langue des descriptions : ${lang}.`;
}
*/
