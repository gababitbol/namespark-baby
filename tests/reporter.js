'use strict';

const fs   = require('fs');
const path = require('path');

/**
 * Reporter personnalisé NameSpark.
 * Génère tests/test-results/agent-report.json  (machine-readable)
 *         tests/test-results/agent-report.html  (rapport lisible)
 */
class AgentReporter {
  constructor() {
    this._results = [];
    this._startTime = Date.now();
    this._outDir = path.join(__dirname, 'test-results');
  }

  onBegin(config, suite) {
    const total = suite.allTests().length;
    console.log(`\n🤖 NameSpark — ${total} test(s) d'agents\n`);
  }

  onTestBegin(test) {
    process.stdout.write(`  ▶ ${test.title} … `);
  }

  onTestEnd(test, result) {
    const icon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
    process.stdout.write(`${icon}\n`);

    const entry = {
      scenario:    this._getScenario(test.titlePath()),
      title:       test.title,
      status:      result.status,
      duration:    result.duration,
      errors:      result.errors.map((e) => e.message?.split('\n')[0] || String(e)),
      unexpected:  this._detectUnexpected(test.title, result),
    };
    this._results.push(entry);
  }

  onEnd(result) {
    const duration = ((Date.now() - this._startTime) / 1000).toFixed(1);
    const passed   = this._results.filter((r) => r.status === 'passed').length;
    const failed   = this._results.filter((r) => r.status === 'failed').length;
    const unexpected = this._results.filter((r) => r.unexpected.length > 0).length;

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`🏁 Fin — ${passed} réussis · ${failed} échoués · ${unexpected} comportements inattendus`);
    console.log(`   Durée totale : ${duration}s`);

    this._ensureDir();
    this._writeJSON({ passed, failed, unexpected, duration: parseFloat(duration), results: this._results });
    this._writeHTML({ passed, failed, unexpected, duration });

    console.log(`\n📄 Rapport : tests/test-results/agent-report.html\n`);
  }

  // ── Private ────────────────────────────────────────────────────────────────

  _getScenario(titlePath) {
    return titlePath.find((t) => /^(🥂|👨|🔁|🔑|🛡|⚡|🧨|📱|🚀)/u.test(t)) || titlePath[0] || '';
  }

  _detectUnexpected(title, result) {
    const flags = [];
    if (result.status === 'passed' && title.toLowerCase().includes('double')) {
      flags.push('Comportement de double vote à valider manuellement');
    }
    if (result.errors.some((e) => /supabase|network/i.test(String(e.message)))) {
      flags.push('Erreur réseau / Supabase détectée');
    }
    return flags;
  }

  _ensureDir() {
    if (!fs.existsSync(this._outDir)) fs.mkdirSync(this._outDir, { recursive: true });
  }

  _writeJSON(data) {
    fs.writeFileSync(
      path.join(this._outDir, 'agent-report.json'),
      JSON.stringify(data, null, 2),
      'utf8'
    );
  }

  _writeHTML({ passed, failed, unexpected, duration }) {
    const rows = this._results.map((r) => {
      const statusColor = r.status === 'passed' ? '#166534' : r.status === 'failed' ? '#991b1b' : '#92400e';
      const statusBg    = r.status === 'passed' ? '#f0fdf4' : r.status === 'failed' ? '#fef2f2' : '#fffbeb';
      const statusIcon  = r.status === 'passed' ? '✅' : r.status === 'failed' ? '❌' : '⚠️';
      const errorHtml   = r.errors.length
        ? `<pre style="margin:6px 0 0;font-size:11px;color:#991b1b;background:#fef2f2;padding:8px;border-radius:6px;overflow-x:auto;white-space:pre-wrap;">${this._esc(r.errors.join('\n'))}</pre>`
        : '';
      const unexpectedHtml = r.unexpected.length
        ? `<div style="margin-top:6px;font-size:11px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;padding:6px 10px;border-radius:6px;">⚠️ ${this._esc(r.unexpected.join(' · '))}</div>`
        : '';
      return `
        <tr style="background:${statusBg};">
          <td style="padding:10px 14px;font-size:13px;color:${statusColor};font-weight:700;">${statusIcon} ${this._esc(r.status.toUpperCase())}</td>
          <td style="padding:10px 14px;font-size:13px;color:#1f1b16;">${this._esc(r.title)}${errorHtml}${unexpectedHtml}</td>
          <td style="padding:10px 14px;font-size:12px;color:#9c9388;text-align:right;white-space:nowrap;">${(r.duration / 1000).toFixed(1)}s</td>
        </tr>`;
    }).join('');

    // Group by scenario
    const scenarios = [...new Set(this._results.map((r) => r.scenario))];
    const summaryRows = scenarios.map((s) => {
      const group = this._results.filter((r) => r.scenario === s);
      const ok = group.filter((r) => r.status === 'passed').length;
      return `<tr>
        <td style="padding:8px 14px;font-size:13px;color:#1f1b16;">${this._esc(s || '(général)')}</td>
        <td style="padding:8px 14px;font-size:13px;color:#166534;">${ok} ✅</td>
        <td style="padding:8px 14px;font-size:13px;color:#991b1b;">${group.length - ok} ❌</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Rapport agents — NameSpark Baby</title>
  <style>
    *{box-sizing:border-box}
    body{margin:0;padding:32px 24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#fbf9f6;color:#1f1b16;}
    h1{font-size:22px;font-weight:700;margin:0 0 4px;}
    .sub{font-size:13px;color:#9c9388;margin:0 0 28px;}
    .summary{display:flex;gap:16px;margin-bottom:28px;flex-wrap:wrap;}
    .stat{background:#fff;border:1px solid #ece4da;border-radius:12px;padding:14px 20px;min-width:120px;}
    .stat-num{font-size:28px;font-weight:800;}
    .stat-label{font-size:11px;color:#9c9388;text-transform:uppercase;letter-spacing:.06em;margin-top:2px;}
    .green{color:#166534;} .red{color:#991b1b;} .amber{color:#92400e;}
    table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #ece4da;border-radius:12px;overflow:hidden;}
    th{background:#f4efe9;padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9c9388;text-align:left;}
    tr+tr{border-top:1px solid #f4efe9;}
    h2{font-size:16px;font-weight:700;margin:28px 0 10px;}
  </style>
</head>
<body>
  <h1>🤖 Rapport agents — NameSpark Baby</h1>
  <p class="sub">Généré le ${new Date().toLocaleString('fr-FR')} · Durée totale : ${duration}s</p>

  <div class="summary">
    <div class="stat"><div class="stat-num green">${passed}</div><div class="stat-label">Réussis</div></div>
    <div class="stat"><div class="stat-num red">${failed}</div><div class="stat-label">Échoués</div></div>
    <div class="stat"><div class="stat-num amber">${unexpected}</div><div class="stat-label">Comportements inattendus</div></div>
  </div>

  <h2>Par scénario</h2>
  <table>
    <thead><tr><th>Scénario</th><th>Réussis</th><th>Échoués</th></tr></thead>
    <tbody>${summaryRows}</tbody>
  </table>

  <h2>Détail par test</h2>
  <table>
    <thead><tr><th>Statut</th><th>Test</th><th>Durée</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

    fs.writeFileSync(path.join(this._outDir, 'agent-report.html'), html, 'utf8');
  }

  _esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

module.exports = AgentReporter;
