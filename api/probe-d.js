import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
export default async function handler(req, res) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const out = { probe: "d", here, cwd: process.cwd() };
  try { out.hereListing = fs.readdirSync(here).slice(0, 30); } catch (e) { out.hereErr = String(e); }
  try { out.cwdListing = fs.readdirSync(process.cwd()).slice(0, 30); } catch (e) { out.cwdErr = String(e); }
  for (const p of [path.join(here, "_data", "names-index.json"), path.join(process.cwd(), "api", "_data", "names-index.json")]) {
    try { out[p] = fs.existsSync(p) ? "TROUVE " + (fs.statSync(p).size) + " octets" : "absent"; }
    catch (e) { out[p] = String(e); }
  }
  return res.status(200).json(out);
}
