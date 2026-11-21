// shack-app: the small demo service we use in every DevOps Shack webinar.
// No dependencies: plain Node.js http module.
const http = require('http');
const os = require('os');
 
const VERSION = process.env.APP_VERSION || '1.0.0';
const MESSAGE = process.env.APP_MESSAGE || 'Hello from shack-app';
const COLOR = process.env.APP_COLOR || '#2563EB';
const PORT = process.env.PORT || 3000;
const STARTED = new Date();
 
// Values from env vars are shown on the page, so escape them.
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
 
const page = () => {
  const up = Math.floor((Date.now() - STARTED) / 1000);
  const uptime = up < 60 ? `${up}s` : up < 3600 ? `${Math.floor(up / 60)}m ${up % 60}s` : `${Math.floor(up / 3600)}h ${Math.floor(up / 60) % 60}m`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>shack-app ${esc(VERSION)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;display:grid;place-items:center;padding:32px;font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;color:#0F172A;
  background:radial-gradient(900px 500px at 15% 10%,${esc(COLOR)}55,transparent 60%),radial-gradient(800px 500px at 90% 90%,${esc(COLOR)}40,transparent 60%),#0B1220}
.card{width:min(860px,100%);background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.45)}
.top{background:${esc(COLOR)};color:#fff;padding:40px 48px 36px;position:relative}
.top:after{content:"";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.12)}
.tag{display:inline-flex;align-items:center;gap:10px;font-size:15px;font-weight:600;letter-spacing:.3px;background:rgba(255,255,255,.18);padding:7px 14px;border-radius:999px}
.dot{width:9px;height:9px;border-radius:50%;background:#4ADE80;box-shadow:0 0 0 4px rgba(74,222,128,.25)}
h1{font-size:46px;line-height:1.15;margin-top:22px;font-weight:800;max-width:90%}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:32px 48px 8px}
.tile{border:1.5px solid #E2E8F0;border-radius:16px;padding:16px 18px}
.k{font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#64748B}
.v{font-size:20px;font-weight:700;margin-top:6px;word-break:break-all}
.v.ver{color:${esc(COLOR)}}
.flow{padding:24px 48px 8px}
.steps{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}
.s{font-size:14px;font-weight:600;padding:8px 12px;border-radius:10px;background:#F1F5F9;color:#334155}
.s.on{background:${esc(COLOR)};color:#fff}
.ar{color:#94A3B8;font-weight:700}
.foot{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:22px 48px 30px;font-size:14px;color:#64748B}
.foot b{color:#0F172A}
@media(max-width:640px){.grid{grid-template-columns:1fr}h1{font-size:34px}.top,.grid,.flow,.foot{padding-left:24px;padding-right:24px}}
</style></head><body>
<main class="card">
  <section class="top">
    <span class="tag"><span class="dot"></span>DevOps Shack · GitOps demo</span>
    <h1>${esc(MESSAGE)}</h1>
  </section>
  <section class="grid">
    <div class="tile"><div class="k">Version</div><div class="v ver">${esc(VERSION)}</div></div>
    <div class="tile"><div class="k">Served by pod</div><div class="v">${esc(os.hostname())}</div></div>
    <div class="tile"><div class="k">Pod uptime</div><div class="v">${uptime}</div></div>
  </section>
  <section class="flow">
    <div class="k">How this version got here</div>
    <div class="steps">
      <span class="s">git push</span><span class="ar">→</span>
      <span class="s">GitHub Actions</span><span class="ar">→</span>
      <span class="s">GHCR</span><span class="ar">→</span>
      <span class="s">shack-gitops</span><span class="ar">→</span>
      <span class="s">Argo CD</span><span class="ar">→</span>
      <span class="s on">this pod</span>
    </div>
  </section>
  <footer class="foot"><span>Two pods run this app. The <b>pod name</b> shows which one answered.</span><span>Health: <b>/healthz</b> · <b>/readyz</b></span></footer>
</main>
</body></html>`;
};
 
const server = http.createServer((req, res) => {
  if (req.url === '/healthz' || req.url === '/readyz') { res.writeHead(200); return res.end('ok'); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(page());
});
server.listen(PORT, () => console.log(`shack-app ${VERSION} listening on ${PORT}`));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
 
