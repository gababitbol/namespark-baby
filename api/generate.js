/* DIAGNOSTIC TEMPORAIRE — bisect du chargement de /api/generate.
   Aucun import au niveau module : tout est dynamique et sous try/catch,
   pour que chaque couche soit testable isolément via ?t=... */

const BUILD = "bisect-1";

export default async function handler(req, res) {
  const t = (req.query && req.query.t) || "ping";
  const out = { build: BUILD, test: t };

  try {
    if (t === "ping") {
      out.ok = true;
      return res.status(200).json(out);
    }

    if (t === "builtins") {
      const fs = (await import("fs")).default;
      const path = (await import("path")).default;
      const { fileURLToPath } = await import("url");
      out.here = path.dirname(fileURLToPath(import.meta.url));
      out.cwd = process.cwd();
      out.node = process.version;
      try { out.hereListing = fs.readdirSync(out.here).slice(0, 40); } catch (e) { out.hereErr = String(e); }
      try { out.cwdListing = fs.readdirSync(out.cwd).slice(0, 40); } catch (e) { out.cwdErr = String(e); }
      out.ok = true;
      return res.status(200).json(out);
    }

    if (t === "ranking") {
      const r = await import("./_ranking.js");
      out.exports = Object.keys(r);
      out.ok = true;
      return res.status(200).json(out);
    }

    if (t === "data") {
      const fs = (await import("fs")).default;
      const path = (await import("path")).default;
      const { fileURLToPath } = await import("url");
      const here = path.dirname(fileURLToPath(import.meta.url));
      const tries = [
        path.join(here, "_data", "names-index.json"),
        path.join(process.cwd(), "api", "_data", "names-index.json"),
      ];
      out.tries = {};
      for (const p of tries) {
        try { out.tries[p] = fs.existsSync(p) ? "TROUVE " + fs.statSync(p).size : "absent"; }
        catch (e) { out.tries[p] = String(e); }
      }
      out.ok = true;
      return res.status(200).json(out);
    }

    out.error = "test inconnu";
    return res.status(400).json(out);
  } catch (err) {
    out.error = String((err && err.message) || err);
    out.stack = String((err && err.stack) || "").split("\n").slice(0, 5);
    return res.status(500).json(out);
  }
}
