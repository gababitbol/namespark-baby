import { generate, TIER_ORDER } from "./_ranking.js";
export default async function handler(req, res) {
  return res.status(200).json({ probe: "c", note: "import _ranking.js", tiers: TIER_ORDER, hasGenerate: typeof generate });
}
