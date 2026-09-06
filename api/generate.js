/* TEST MINIMAL ESM->CommonJS — valide en production, sans syntaxe ESM
   non transpilable, les trois mécanismes dont la vraie fonction a besoin :
     1. chargement du module compilé en CommonJS ;
     2. import d'un module voisin _prefixé (convention _helpers.js) ;
     3. lecture du catalogue JSON embarqué via functions.includeFiles,
        chemin résolu avec process.cwd().
   Remplacé par la vraie implémentation dès que ce test passe. */
import fs from "fs";
import path from "path";
import { TIER_ORDER } from "./_ranking.js";

export default async function handler(req, res) {
  const out = { test: "esm", node: process.version, cwd: process.cwd() };
  out.siblingImport = Array.isArray(TIER_ORDER) ? TIER_ORDER.length + " paliers" : "ECHEC";

  const p = path.join(process.cwd(), "api", "_data", "names-index.json");
  try {
    if (fs.existsSync(p)) {
      const idx = JSON.parse(fs.readFileSync(p, "utf8"));
      out.jsonLoad = idx.length + " entrees";
      out.sample = idx[0] && idx[0].name;
    } else {
      out.jsonLoad = "ABSENT: " + p;
      try { out.apiListing = fs.readdirSync(path.join(process.cwd(), "api")).slice(0, 25); }
      catch (e) { out.apiListingErr = String(e); }
    }
  } catch (e) { out.jsonErr = String(e); }

  return res.status(200).json(out);
}
