// Post-build prerender: crawl every route in dist/sitemap.xml with headless
// Chromium and write the fully rendered HTML back into dist/, so crawlers and
// social scrapers (which don't run JS) see real per-page titles, canonicals,
// and teaching text instead of an empty <div id="root">.
//
// Runs AFTER `vite build` (needs dist/): `node scripts/prerender.mjs`
// Or both together: `npm run build:prerender`
// Requires the browser once per machine: `npx playwright install chromium`
//
// Design notes:
// - Routes come from dist/sitemap.xml, which is itself registry-generated and
//   drift-tested (registry.test.ts A7) — one source of truth for "what pages exist".
// - All snapshots are captured first, files written after the browser closes,
//   so the crawl never reads a file this script has already overwritten
//   (dist/index.html doubles as the SPA fallback while serving).
// - External requests (GA, Google Fonts) are aborted during the crawl for
//   determinism; the tags stay in the HTML so real visitors load them.
// - The static og:url/og:title/twitter:title in index.html describe the
//   homepage; on deep routes they'd contradict Helmet's per-page tags, so the
//   static ones (no data-rh attribute) are stripped from non-home snapshots.
// - React mounts with createRoot, which replaces the prerendered DOM on load —
//   the static HTML is for crawlers; browsers get the live app as before.
import { createServer } from "node:http";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { chromium } from "playwright";

const DIST = resolve(process.cwd(), "dist");
const DIST_PREFIX = `${DIST}${sep}`;
const PORT = 4179;
const HOST = "127.0.0.1";
const ORIGIN = `http://${HOST}:${PORT}`;
const CONCURRENCY = 4;

// ── routes ────────────────────────────────────────────────────────────────────
const sitemap = readFileSync(join(DIST, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/utilspalooza\.com(\/[^<]*)<\/loc>/g)]
  .map((m) => m[1]);
if (routes.length === 0) {
  console.error("prerender: no routes found in dist/sitemap.xml");
  process.exit(1);
}

// ── static file server with SPA fallback (mimics the Netlify _redirects rule) ─
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".map": "application/json",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
};
const server = createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url ?? "/", ORIGIN).pathname);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
    return;
  }

  const requested = urlPath.endsWith("/") ? `${urlPath}index.html` : urlPath;
  const candidate = resolve(DIST, `.${requested}`);
  if (candidate !== DIST && !candidate.startsWith(DIST_PREFIX)) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
    return;
  }

  let body;
  let type = MIME[extname(candidate)] ?? "application/octet-stream";
  try {
    body = readFileSync(candidate);
  } catch {
    body = readFileSync(join(DIST, "index.html")); // SPA fallback
    type = "text/html";
  }
  res.writeHead(200, { "content-type": type });
  res.end(body);
});
await new Promise((ok) => server.listen(PORT, HOST, ok));

// ── crawl ─────────────────────────────────────────────────────────────────────
const browser = await chromium.launch();
const context = await browser.newContext();
// Abort anything that isn't served by us (GA, fonts) — deterministic + fast.
await context.route(
  (url) => url.origin !== ORIGIN,
  (route) => route.abort()
);

function postProcess(html, route) {
  // Every route sets its own description/canonical/og:url/og:title via Helmet
  // (tagged data-rh). The static index.html copies describe the homepage and
  // would duplicate/contradict them, so drop the static ones from snapshots.
  // twitter:title has no Helmet version; scrapers fall back to og:title.
  // og:image/og:description/twitter:card stay — they're static-only.
  html = html.replace(
    /<meta (?:property="og:(?:url|title)"|name="(?:twitter:title|description)")(?![^>]*data-rh)[^>]*>\s*/g,
    ""
  );
  return html.replace("</head>", `<!-- prerendered ${route} --></head>`);
}

const snapshots = new Map();
const queue = [...routes];
async function worker() {
  const page = await context.newPage();
  for (let route; (route = queue.shift()) !== undefined; ) {
    await page.goto(`${ORIGIN}${route}`, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () => (document.getElementById("root")?.children.length ?? 0) > 0
    );
    await page.waitForTimeout(700); // let Helmet + ELI5 injection settle
    snapshots.set(route, postProcess(await page.content(), route));
  }
  await page.close();
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
await browser.close();
server.close();

// ── write (only after the crawl is fully done) ────────────────────────────────
for (const [route, html] of snapshots) {
  const dir = route === "/" ? DIST : join(DIST, route.slice(1));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}
console.log(`prerendered ${snapshots.size}/${routes.length} routes into dist/`);
if (snapshots.size !== routes.length) process.exit(1);
