import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
export default async function handler(req, res) {
  return res.status(200).json({ probe: "b", note: "builtins node", here: path.dirname(fileURLToPath(import.meta.url)) });
}
