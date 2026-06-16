import Template from "../animations/animationTemplate";
import { buildCodePenForm, CodePenPayload } from "./codepen";

const DESIGN_NOTES_HTML = `
<h4>Why circular?</h4>
<p>Linear frequency bars get cramped at more than 32 bands. A circle distributes 64–128 bands evenly with no crowding, and maps naturally — bass at the bottom, treble at the top.</p>

<h4>Why synthetic data first?</h4>
<p>Wiring the Web Audio API (<code>getUserMedia</code> → <code>AudioContext</code> → <code>AnalyserNode</code>) takes ~40 lines before you see anything. Build the visualizer with math-generated data — the live mic is one button click away in the CodePen.</p>

<h4>Why smoothing?</h4>
<p>Raw FFT data flickers badly frame-to-frame. Exponential moving average: <code>out[i] = α·prev[i] + (1−α)·new[i]</code>. High α = calm but laggy. Low α = snappy but noisy. The slider lets you feel the tradeoff.</p>

<h4>Why color by amplitude?</h4>
<p>Red = loud, blue = silent. Your eye spots the energetic frequency ranges instantly — far faster than reading a number.</p>
`;

// ─── CodePen content ─────────────────────────────────────────────────────────
// This is a complete, runnable version of the visualizer.
// The synthetic data path runs immediately; "start mic" wires in the real API.

const CODEPEN_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>bands <input type="range" id="bands" min="16" max="128" step="16" value="64"> <span id="bands-val">64</span></label>
  <label>smoothing <input type="range" id="smooth" min="0" max="0.98" step="0.01" value="0.80"> <span id="smooth-val">0.80</span></label>
  <button id="start-btn">&#9654; start mic</button>
</div>`;

const CODEPEN_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: monospace;
  color: #90b8cc;
}

canvas { display: block; }

#controls {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 10px 18px;
  background: rgba(8, 8, 18, 0.88);
  border: 1px solid rgba(100, 200, 255, 0.25);
  border-radius: 8px;
  margin-top: 12px;
  font-size: 11px;
  flex-wrap: wrap;
  justify-content: center;
}

label { display: flex; gap: 8px; align-items: center; }
input[type=range] { width: 70px; }

button {
  background: rgba(100, 200, 255, 0.1);
  border: 1px solid rgba(100, 200, 255, 0.3);
  color: #a0d0ff;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
}
button:disabled { opacity: 0.5; cursor: default; }`;

const CODEPEN_JS = `// ─── canvas setup ────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  const size = Math.min(window.innerWidth, window.innerHeight - 80);
  canvas.width = canvas.height = size;
}
resize();
window.addEventListener('resize', resize);

// ─── state ───────────────────────────────────────────────────────────
let numBands = 64;
let smoothing = 0.8;
let smoothed = new Float32Array(numBands);
let analyser = null;   // populated after mic permission granted
let freqData = null;

// ─── Web Audio API hookup ─────────────────────────────────────────────
// This is the ONLY block that changes when going from synthetic → real.
// The smoothing and drawing code below is identical either way.
document.getElementById('start-btn').addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioCtx = new AudioContext();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;  // → 128 frequency bins
  audioCtx.createMediaStreamSource(stream).connect(analyser);
  freqData = new Uint8Array(analyser.frequencyBinCount);

  document.getElementById('start-btn').textContent = '● listening';
  document.getElementById('start-btn').disabled = true;
});

// ─── synthetic signal (runs before mic is granted) ────────────────────
function getSyntheticData() {
  const data = new Float32Array(numBands);
  const t = Date.now() / 1000;
  const sigma = numBands * 0.035;
  const peaks = [
    { band: Math.floor(numBands * 0.07), amp: 200 + 40 * Math.sin(t * 0.9) },
    { band: Math.floor(numBands * 0.15), amp: 150 + 50 * Math.sin(t * 1.5 + 1) },
    { band: Math.floor(numBands * 0.24), amp: 110 + 60 * Math.sin(t * 2.3 + 2) },
  ];
  for (const { band, amp } of peaks) {
    for (let i = 0; i < numBands; i++) {
      const d = i - band;
      data[i] += amp * Math.exp(-(d * d) / (2 * sigma * sigma));
    }
  }
  for (let i = 0; i < numBands; i++) {
    data[i] = Math.min(255, data[i] + 8 + Math.random() * 12);
  }
  return data;
}

// ─── main loop ────────────────────────────────────────────────────────
function loop() {
  requestAnimationFrame(loop);

  let raw;
  if (analyser && freqData) {
    // ← real mic path: swap the synthetic generator for this
    analyser.getByteFrequencyData(freqData);
    raw = new Float32Array(numBands);
    const ratio = freqData.length / numBands;
    for (let i = 0; i < numBands; i++) raw[i] = freqData[Math.floor(i * ratio)];
  } else {
    raw = getSyntheticData();
  }

  // exponential smoothing — same regardless of data source
  for (let i = 0; i < numBands; i++) {
    smoothed[i] = smoothing * (smoothed[i] || 0) + (1 - smoothing) * raw[i];
  }

  draw();
}

// ─── circular spectrum renderer ───────────────────────────────────────
function draw() {
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const baseR = Math.min(W, H) * 0.28;
  const maxBar = Math.min(W, H) * 0.18;

  ctx.fillStyle = 'rgba(10, 10, 15, 0.25)';
  ctx.fillRect(0, 0, W, H);

  const barWidth = Math.max(1.5, (baseR * (2 * Math.PI / numBands)) * 0.72);

  for (let i = 0; i < numBands; i++) {
    const angle = (i / numBands) * Math.PI * 2 - Math.PI / 2;
    const amp = smoothed[i] / 255;
    const len = amp * maxBar;
    ctx.strokeStyle = 'hsl(' + (1 - amp) * 240 + ',' + (70 + amp * 30) + '%,' + (40 + amp * 25) + '%)';
    ctx.lineWidth = barWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * baseR,         cy + Math.sin(angle) * baseR);
    ctx.lineTo(cx + Math.cos(angle) * (baseR + len), cy + Math.sin(angle) * (baseR + len));
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(100, 200, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const label = analyser ? 'FFT · live mic' : 'FFT · synthetic signal';
  ctx.fillStyle = 'rgba(160, 192, 220, 0.45)';
  ctx.font = Math.max(10, Math.min(W, H) * 0.022) + 'px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy);
}

// ─── controls ─────────────────────────────────────────────────────────
document.getElementById('bands').addEventListener('input', e => {
  numBands = parseInt(e.target.value);
  smoothed = new Float32Array(numBands);
  document.getElementById('bands-val').textContent = numBands;
});
document.getElementById('smooth').addEventListener('input', e => {
  smoothing = parseFloat(e.target.value);
  document.getElementById('smooth-val').textContent = smoothing.toFixed(2);
});

loop();`;

export const AUDIO_VISUALIZER_PEN: CodePenPayload = {
  title: "Audio Visualizer Wireframe",
  description:
    "Circular FFT display. Runs with synthetic data immediately — click 'start mic' to wire in a real microphone via Web Audio API.",
  html: CODEPEN_HTML,
  css: CODEPEN_CSS,
  js: CODEPEN_JS,
  editors: "001",
};

class AudioVisualizerWireframe extends Template {
  static t = "Audio Visualizer Wireframe";
  static l = "audio-visualizer-wireframe";
  static f = { keyFunction: () => {}, dependencies: [], functionString: "" };

  private animId = 0;
  private numBands = 64;
  private smoothing = 0.8;
  private smoothed: Float32Array = new Float32Array(64);
  private tick = 0;

  init() {
    this.injectNotes();
    this.injectControls();
    this.loop();
  }

  private getSyntheticData(): Float32Array {
    const data = new Float32Array(this.numBands);
    const t = this.tick;

    const peaks = [
      { band: Math.floor(this.numBands * 0.07), amp: 200 + 40 * Math.sin(t * 0.9) },
      { band: Math.floor(this.numBands * 0.15), amp: 150 + 50 * Math.sin(t * 1.5 + 1) },
      { band: Math.floor(this.numBands * 0.24), amp: 110 + 60 * Math.sin(t * 2.3 + 2) },
    ];

    const sigma = this.numBands * 0.035;

    for (const { band, amp } of peaks) {
      for (let i = 0; i < this.numBands; i++) {
        const d = i - band;
        data[i] += amp * Math.exp(-(d * d) / (2 * sigma * sigma));
      }
    }

    for (let i = 0; i < this.numBands; i++) {
      data[i] += 8 + Math.random() * 12;
      if (data[i] > 255) data[i] = 255;
    }

    return data;
  }

  private loop() {
    const frame = () => {
      this.animId = requestAnimationFrame(frame);
      if (!this.ctx || !this.canvas) return;

      this.tick += 0.018;

      const raw = this.getSyntheticData();
      const α = this.smoothing;
      for (let i = 0; i < this.numBands; i++) {
        this.smoothed[i] = α * (this.smoothed[i] || 0) + (1 - α) * raw[i];
      }

      this.drawFrame();
    };
    frame();
  }

  private drawFrame() {
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const baseR = Math.min(W, H) * 0.28;
    const maxBar = Math.min(W, H) * 0.18;

    ctx.fillStyle = "rgba(10, 10, 15, 0.25)";
    ctx.fillRect(0, 0, W, H);

    const arcPerBand = (2 * Math.PI) / this.numBands;
    const barWidth = Math.max(1.5, (baseR * arcPerBand) * 0.72);

    for (let i = 0; i < this.numBands; i++) {
      const angle = (i / this.numBands) * Math.PI * 2 - Math.PI / 2;
      const amp = this.smoothed[i] / 255;
      const barLen = amp * maxBar;

      const x1 = cx + Math.cos(angle) * baseR;
      const y1 = cy + Math.sin(angle) * baseR;
      const x2 = cx + Math.cos(angle) * (baseR + barLen);
      const y2 = cy + Math.sin(angle) * (baseR + barLen);

      const hue = (1 - amp) * 240;
      ctx.strokeStyle = `hsl(${hue}, ${70 + amp * 30}%, ${40 + amp * 25}%)`;
      ctx.lineWidth = barWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(100, 200, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const fontSize = Math.max(10, Math.min(W, H) * 0.022);
    ctx.fillStyle = "rgba(160, 192, 220, 0.45)";
    ctx.font = `${fontSize}px "Space Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FFT · synthetic signal", cx, cy);
  }

  private injectControls() {
    if (!this.cont) return;

    const panel = document.createElement("div");
    panel.id = "avw-controls";
    panel.style.cssText = [
      "position:absolute", "bottom:16px", "left:50%", "transform:translateX(-50%)",
      "display:flex", "gap:20px", "align-items:center",
      "background:rgba(8,8,18,0.88)",
      "border:1px solid rgba(100,200,255,0.25)",
      "border-radius:8px", "padding:10px 18px",
      "font-family:'Space Mono',monospace", "font-size:11px", "color:#90b8cc",
      "white-space:nowrap", "z-index:10",
    ].join(";");

    const btnStyle = [
      "background:rgba(100,200,255,0.1)",
      "border:1px solid rgba(100,200,255,0.3)",
      "color:#a0d0ff", "padding:4px 10px",
      "border-radius:4px", "cursor:pointer",
      "font-family:inherit", "font-size:11px",
    ].join(";");

    panel.innerHTML = `
      <label style="display:flex;gap:8px;align-items:center">
        bands
        <input type="range" id="avw-bands" min="16" max="128" step="16" value="${this.numBands}" style="width:70px">
        <span id="avw-bands-val">${this.numBands}</span>
      </label>
      <label style="display:flex;gap:8px;align-items:center">
        smoothing
        <input type="range" id="avw-smooth" min="0" max="0.98" step="0.01" value="${this.smoothing}" style="width:70px">
        <span id="avw-smooth-val">${this.smoothing.toFixed(2)}</span>
      </label>
    `;

    // Append the CodePen form as a real DOM element (not via innerHTML) so the
    // large JSON payload is stored verbatim as a property — no attribute escaping.
    panel.appendChild(buildCodePenForm(AUDIO_VISUALIZER_PEN, "open in CodePen ↗", btnStyle));

    this.cont.appendChild(panel);

    document.getElementById("avw-bands")?.addEventListener("input", (e) => {
      this.numBands = parseInt((e.target as HTMLInputElement).value);
      this.smoothed = new Float32Array(this.numBands);
      const v = document.getElementById("avw-bands-val");
      if (v) v.textContent = String(this.numBands);
    });

    document.getElementById("avw-smooth")?.addEventListener("input", (e) => {
      this.smoothing = parseFloat((e.target as HTMLInputElement).value);
      const v = document.getElementById("avw-smooth-val");
      if (v) v.textContent = this.smoothing.toFixed(2);
    });
  }

  private injectNotes() {
    const el = document.getElementById("studio-text-content");
    if (el) el.innerHTML = DESIGN_NOTES_HTML;
  }

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.canvas) {
      this.canvas.removeEventListener("pointerdown", this.pointerDownHandler.bind(this));
      this.canvas.removeEventListener("pointermove", this.pointerMoveHandler.bind(this));
      this.canvas.removeEventListener("pointerup", this.pointerUpHandler.bind(this));
    }
    window.removeEventListener("resize", this.resizeHandler);
    if (this.cont) this.cont.innerHTML = "";
    this.ctx = null;
    this.canvas = null;
  }
}

export default AudioVisualizerWireframe;
