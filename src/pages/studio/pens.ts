// ─── "Tinker in CodePen" gallery ─────────────────────────────────────────────
// Each entry is a complete, self-contained, plain-JS version of an animation
// that already exists on the site — no TypeScript, no imports, no Template base
// class. The core math is untouched; the only added code is ~10 lines of inline
// canvas setup that the Template class normally does, plus a small controls
// panel. Comments mark the seams ("← the golden angle goes here").
//
// New pens go here as standalone string constants, then get an entry in
// CODEPEN_GALLERY at the bottom.

import { CodePenPayload } from "./codepen";
import { AUDIO_VISUALIZER_PEN } from "./AudioVisualizerWireframe";
// Build-time generated plain-JS source for the embedded functions — see
// scripts/generate-codepen-sources.mjs. String literals survive minification;
// runtime function serialization does not.
import { CODEPEN_FUNCTION_SOURCES } from "./generatedCodepenSources";
import { EXAMPLE_PENS } from "./pens-examples";

// ── shared CSS used by the canvas-fills-the-page pens ────────────────────────
const FULLSCREEN_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }

html, body { width: 100%; height: 100%; overflow: hidden; background: #0a0a0f; }

canvas { display: block; width: 100vw; height: 100vh; }

#controls {
  position: fixed;
  top: 12px;
  left: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  background: rgba(8, 8, 18, 0.9);
  border: 1px solid rgba(150, 180, 255, 0.3);
  border-radius: 8px;
  padding: 8px 14px;
  font-family: monospace;
  font-size: 12px;
  color: #d8e2ff;
}

#controls label { display: flex; gap: 6px; align-items: center; }
#controls input[type=range] { width: 90px; }

#controls button {
  background: rgba(120, 160, 255, 0.14);
  border: 1px solid rgba(150, 180, 255, 0.4);
  color: #d8e2ff;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
}`;

// ─── Phyllotaxis ─────────────────────────────────────────────────────────────
const PHYLLOTAXIS_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>angle&deg; <input type="range" id="angle" min="0.1" max="359.9" step="0.001" value="137.50776"> <span id="angle-val">137.508</span></label>
  <button id="snap">Snap to Golden</button>
  <label>seeds <input type="range" id="seeds" min="10" max="1000" step="10" value="500"> <span id="seeds-val">500</span></label>
  <button id="color">color: gradient</button>
</div>`;

const PHYLLOTAXIS_JS = `const GOLDEN_ANGLE = 137.50776405003785; // ← (2 − φ) × 360, the whole show

${CODEPEN_FUNCTION_SOURCES.phyllotaxisPoint}

${CODEPEN_FUNCTION_SOURCES.drawPhyllotaxis}

// ─── canvas setup (what the site's Template base class normally does) ─────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// ─── state (wired to the controls below) ────────────────────────────────────
let angleDeg = GOLDEN_ANGLE;
let numSeeds = 500;
let colorMode = 'gradient';
let rotationAngleDeg = 0;

// snap-to-golden easing
let snapFrom = angleDeg, snapTo = angleDeg, snapT = 1;
const snapDuration = 60;
const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

const computeScale = () =>
  Math.min(canvas.width, canvas.height) * 0.44 / Math.sqrt(numSeeds);

function draw() {
  drawPhyllotaxis(ctx, canvas.width, canvas.height, {
    angleDeg,
    numSeeds,
    seedRadius: 4,
    scale: computeScale(),
    colorMode,
    showSpirals: false,
    rotationAngleDeg,
  });
}

const angleSlider = document.getElementById('angle');
const angleVal = document.getElementById('angle-val');

function loop() {
  rotationAngleDeg = (rotationAngleDeg + 0.05) % 360; // slow spin

  if (snapT < 1) { // animate the slider home to the golden angle
    snapT = Math.min(1, snapT + 1 / snapDuration);
    angleDeg = snapFrom + (snapTo - snapFrom) * easeInOut(snapT);
    angleSlider.value = angleDeg;
    angleVal.textContent = angleDeg.toFixed(3);
  }

  draw();
  requestAnimationFrame(loop);
}

// ─── controls ───────────────────────────────────────────────────────────────
angleSlider.addEventListener('input', e => {
  angleDeg = parseFloat(e.target.value);
  snapT = 1; // cancel any in-flight snap
  angleVal.textContent = angleDeg.toFixed(3);
});
document.getElementById('seeds').addEventListener('input', e => {
  numSeeds = parseInt(e.target.value);
  document.getElementById('seeds-val').textContent = numSeeds;
});
document.getElementById('snap').addEventListener('click', () => {
  snapFrom = angleDeg; snapTo = GOLDEN_ANGLE; snapT = 0;
});
document.getElementById('color').addEventListener('click', e => {
  colorMode = colorMode === 'gradient' ? 'mono' : 'gradient';
  e.target.textContent = 'color: ' + colorMode;
});

loop();`;

const PHYLLOTAXIS_PEN: CodePenPayload = {
  title: "Phyllotaxis — the golden angle",
  description:
    "Vogel's model: place seed n at angle n×137.507° and radius √n. Drag the angle slider a fraction of a degree off the golden angle and watch the packing shatter.",
  html: PHYLLOTAXIS_HTML,
  css: FULLSCREEN_CSS,
  js: PHYLLOTAXIS_JS,
  editors: "001",
};

// ─── Perlin Flow Field ───────────────────────────────────────────────────────
const FLOW_FIELD_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <button id="reset">reset</button>
  <label>particles <input type="range" id="particles" min="100" max="2000" step="100" value="600"> <span id="particles-val">600</span></label>
  <label>speed <input type="range" id="speed" min="0.5" max="6" step="0.5" value="2.5"> <span id="speed-val">2.5</span></label>
  <label>zoom <input type="range" id="zoom" min="1" max="10" step="1" value="3"> <span id="zoom-val">3</span></label>
  <label>trail <input type="range" id="trail" min="10" max="100" step="5" value="40"> <span id="trail-val">40</span></label>
</div>`;

const FLOW_FIELD_JS = `// ─── Perlin noise (classic Ken Perlin permutation-table implementation) ──────
function buildPermTable() {
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {            // Fisher–Yates shuffle
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return [...p, ...p];                        // duplicate to avoid index wrap
}
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + t * (b - a);
function grad(hash, x, y) {
  const h = hash & 3;
  const u = h < 2 ? x : y, v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}
function perlin2(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  x -= Math.floor(x); y -= Math.floor(y);
  const u = fade(x), v = fade(y);
  const a = perm[X] + Y, b = perm[X + 1] + Y;
  return lerp(
    lerp(grad(perm[a], x, y),     grad(perm[b], x - 1, y),     u),
    lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u),
    v
  );
}

${CODEPEN_FUNCTION_SOURCES.drawFlowField}

// ─── canvas setup (what the site's Template base class normally does) ─────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// off-screen canvas accumulates the glowing trails
const trail = document.createElement('canvas');
const trailCtx = trail.getContext('2d');
function resize() {
  canvas.width = trail.width = canvas.clientWidth;
  canvas.height = trail.height = canvas.clientHeight;
}
window.addEventListener('resize', () => { resize(); resetParticles(); });
resize();

// ─── state (wired to the controls below) ────────────────────────────────────
let numParticles = 600;
let speed = 2.5;
let fieldScale = 0.003; // noise zoom
let trailLength = 40;
const state = {
  particles: [],
  fieldScale,
  speed,
  trailLength,
  zOffset: 0,
  zSpeed: 0.0005,
  perm: buildPermTable(),
};

function spawn() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: 0, vy: 0,
    hue: Math.random() * 360,
    alpha: 0.6 + Math.random() * 0.4,
    history: [],
  };
}
function resetParticles() {
  state.particles = Array.from({ length: numParticles }, spawn);
  state.perm = buildPermTable(); // fresh noise on reset
  trailCtx.clearRect(0, 0, trail.width, trail.height);
}
resetParticles();

function loop() {
  state.fieldScale = fieldScale;
  state.speed = speed;
  state.trailLength = trailLength;
  drawFlowField(ctx, trailCtx, canvas.width, canvas.height, state);
  requestAnimationFrame(loop);
}

// ─── controls ───────────────────────────────────────────────────────────────
document.getElementById('reset').addEventListener('click', resetParticles);
document.getElementById('particles').addEventListener('input', e => {
  numParticles = parseInt(e.target.value);
  document.getElementById('particles-val').textContent = numParticles;
  state.particles = Array.from({ length: numParticles }, spawn);
});
document.getElementById('speed').addEventListener('input', e => {
  speed = parseFloat(e.target.value);
  document.getElementById('speed-val').textContent = speed;
});
document.getElementById('zoom').addEventListener('input', e => {
  fieldScale = parseInt(e.target.value) / 1000;
  document.getElementById('zoom-val').textContent = e.target.value;
});
document.getElementById('trail').addEventListener('input', e => {
  trailLength = parseInt(e.target.value);
  document.getElementById('trail-val').textContent = trailLength;
});

loop();`;

const FLOW_FIELD_PEN: CodePenPayload = {
  title: "Perlin noise flow field",
  description:
    "Hundreds of particles steer by an invisible Perlin-noise wind map that slowly evolves over time. Classic Ken Perlin permutation-table noise, no dependencies.",
  html: FLOW_FIELD_HTML,
  css: FULLSCREEN_CSS,
  js: FLOW_FIELD_JS,
  editors: "001",
};

// ─── the gallery ─────────────────────────────────────────────────────────────
export interface CodePenGalleryItem {
  key: string;
  label: string;
  blurb: string;
  group?: string;
  payload: CodePenPayload;
}

export const CODEPEN_GALLERY: CodePenGalleryItem[] = [
  ...EXAMPLE_PENS,
  {
    key: "phyllotaxis",
    label: "Phyllotaxis",
    group: "Math & Physics",
    blurb: "Golden-angle sunflower packing (Vogel's model).",
    payload: PHYLLOTAXIS_PEN,
  },
  {
    key: "flow-field",
    label: "Perlin Flow Field",
    group: "Math & Physics",
    blurb: "Particles steered by an evolving Perlin noise field.",
    payload: FLOW_FIELD_PEN,
  },
  {
    key: "audio-visualizer",
    label: "Audio Visualizer",
    group: "Math & Physics",
    blurb: "Circular FFT display; one line away from a live mic.",
    payload: AUDIO_VISUALIZER_PEN,
  },
];
