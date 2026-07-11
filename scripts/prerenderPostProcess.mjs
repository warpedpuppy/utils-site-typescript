// Pure post-processing for the prerender crawl, extracted from prerender.mjs so
// it can be unit-tested without booting the crawl (prerender.mjs runs a full
// headless-Chromium crawl at import time). See prerender.mjs for how these are
// wired into the pipeline.

export const PORT = 4179;
export const HOST = "127.0.0.1";
export const ORIGIN = `http://${HOST}:${PORT}`;

/**
 * Clean one route's captured HTML before it is written into dist/.
 *
 * @param {string} html  The serialized DOM captured by Playwright.
 * @param {string} route The route path (e.g. "/", "/examples"), for the marker.
 * @returns {string}
 */
export function postProcess(html, route) {
  // Vite's router preloads lazy route chunks by injecting
  // <link rel="modulepreload"> whose href is resolved against the page origin —
  // here the prerender preview server (http://127.0.0.1:4179). Snapshotting the
  // live DOM freezes those absolute URLs into the deployed HTML, so every real
  // visitor's browser tries to fetch assets from THEIR OWN localhost, tripping
  // Chrome's "Local Network Access" permission prompt ("wants to access other
  // apps and services on this device"). Strip the preview origin so any such
  // self-link becomes a root-relative /assets/... URL. Timing-dependent (the
  // injection is non-deterministic across crawls), so this must run every route.
  html = html.replaceAll(ORIGIN, "");

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
