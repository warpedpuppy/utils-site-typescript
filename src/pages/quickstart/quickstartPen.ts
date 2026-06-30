import { CodePenPayload } from "../studio/codepen";

// ─── The quickstart artifact: the SMALLEST complete file that runs ───────────
//
// This is deliberately NOT one of the /studio pens. The studio pens inline the
// math via `.toString()` to teach an animation's internals. This pen teaches
// the opposite lesson — *integration*: how little it takes to pull the published
// library off a CDN and call one function in your own page. Keep this source
// separate from `pens-examples.ts` so the two lessons never drift into each other.

// The single library call, with everything around it kept to the bare minimum.
// `ballBounce` mutates the ball in place, so the loop is just: step, clear, draw.
const QUICKSTART_JS = `const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

// the playing field and the ball — plain objects, no classes needed
const stage = { x: 0, y: 0, width: canvas.width, height: canvas.height };
const ball = { x: 300, y: 60, vx: 4, vy: 0, radius: 18, color: '#7cf' };

function frame() {
  Utilspalooza.ballBounce(ball, stage);          // ← the one library call
  ctx.clearRect(0, 0, stage.width, stage.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  requestAnimationFrame(frame);
}
frame();
`;

const QUICKSTART_HTML = `<canvas id="stage" width="600" height="400"></canvas>`;

// The few lines of CSS that actually matter: center the canvas, give it a
// background so you can see its edges. Everything else is taste.
const QUICKSTART_CSS = `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #111;
}
canvas {
  background: #1b1b2b;
  border-radius: 8px;
}
`;

// The CDN URL for the minified IIFE build (window.Utilspalooza). The `unpkg`
// field in packages/core/package.json points the bare specifier here.
export const UTILSPALOOZA_CDN = "https://unpkg.com/@utilspalooza/core";

// What the "Open in CodePen" button submits. CodePen splits the file across
// three panes, so the library comes in via js_external rather than a <script>.
export const QUICKSTART_PEN: CodePenPayload = {
  title: "Bouncing ball — Utilspalooza quickstart",
  description:
    "The smallest complete page that loads @utilspalooza/core from a CDN and calls ballBounce() in a requestAnimationFrame loop.",
  html: QUICKSTART_HTML,
  css: QUICKSTART_CSS,
  js: QUICKSTART_JS,
  js_external: UTILSPALOOZA_CDN,
  editors: "001", // HTML collapsed, CSS collapsed, JS open
};

// The same thing as ONE self-contained file. This is the literal "smallest
// complete file" the page shows: save it as index.html, double-click, done —
// no build step, no node_modules, no bundler.
export const QUICKSTART_SINGLE_FILE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bouncing ball</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #111;
    }
    canvas {
      background: #1b1b2b;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <canvas id="stage" width="600" height="400"></canvas>

  <!-- the whole library, straight from the CDN — no build step -->
  <script src="${UTILSPALOOZA_CDN}"></script>
  <script>
${QUICKSTART_JS.split("\n")
  .map((line) => (line ? "    " + line : line))
  .join("\n")
  .replace(/\n$/, "")}
  </script>
</body>
</html>
`;
