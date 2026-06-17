import Template from "../../../../core-animations/animationTemplate";
import { CollisionDetectionObject } from "../../../../types/types";

interface FreqComponent {
  freq: number;
  amp: number;
  phase: number;
  re: number;
  im: number;
}

const ELI5 = `🌀 Fourier Epicycles — What's going on?

Imagine drawing any shape using only spinning circles.

A big circle spins slowly and gets you roughly close to the shape.
A smaller circle sits on top, spinning faster, correcting the path.
An even smaller one sits on that, spinning faster still...

Stack enough spinning circles and their combined tip traces your shape perfectly.

This is what the Fourier Transform does: it takes any path and figures out
exactly which circles (how big, how fast, what starting angle) recreate it.

Each circle is one "frequency component":
  - Size  → amplitude
  - Speed → frequency
  - Start → phase

The DFT (Discrete Fourier Transform) computes all of these from your path.

Real-world uses: MP3 audio compression, JPEG images, radio signals, MRI machines.`;

function squarePath(n: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const s = 150;
  const perSide = Math.floor(n / 4);
  for (let i = 0; i < perSide; i++) { const t = i / perSide; pts.push({ x: -s + t * 2 * s, y: -s }); }
  for (let i = 0; i < perSide; i++) { const t = i / perSide; pts.push({ x: s, y: -s + t * 2 * s }); }
  for (let i = 0; i < perSide; i++) { const t = i / perSide; pts.push({ x: s - t * 2 * s, y: s }); }
  for (let i = 0; i < perSide; i++) { const t = i / perSide; pts.push({ x: -s, y: s - t * 2 * s }); }
  return pts;
}

function heartPath(n: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    pts.push({ x: x * 9, y: y * 9 });
  }
  return pts;
}

function figure8Path(n: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    pts.push({ x: 150 * Math.sin(t), y: 100 * Math.sin(2 * t) });
  }
  return pts;
}

function dft(signal: { x: number; y: number }[]): FreqComponent[] {
  const N = signal.length;
  const result: FreqComponent[] = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      re += signal[n].x * Math.cos(phi) + signal[n].y * Math.sin(phi);
      im += -signal[n].x * Math.sin(phi) + signal[n].y * Math.cos(phi);
    }
    re /= N; im /= N;
    result.push({ freq: k, amp: Math.sqrt(re * re + im * im), phase: Math.atan2(im, re), re, im });
  }
  return result.sort((a, b) => b.amp - a.amp);
}

const FourierFormula: CollisionDetectionObject = {
  keyFunction: dft,
  dependencies: [],
  functionString: `function dft(signal: { x: number; y: number }[]): FreqComponent[] {
  const N = signal.length;
  const result: FreqComponent[] = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      re += signal[n].x * Math.cos(phi) + signal[n].y * Math.sin(phi);
      im += -signal[n].x * Math.sin(phi) + signal[n].y * Math.cos(phi);
    }
    re /= N; im /= N;
    result.push({
      freq: k,
      amp: Math.sqrt(re * re + im * im),
      phase: Math.atan2(im, re),
      re, im,
    });
  }
  return result.sort((a, b) => b.amp - a.amp);
}`,
};

class FourierEpicycles extends Template {
  static t = "Fourier epicycles";
  static l = "fourier-epicycles";
  static f = FourierFormula;
  title = "Fourier epicycles";

  animationObject = FourierFormula;

  fourier: FreqComponent[] = [];
  trail: { x: number; y: number }[] = [];
  time: number = 0;
  numCircles: number = 64;
  preset: string = "heart";
  animId: number = 0;
  controlsDiv: HTMLDivElement | null = null;
  infoPanel: HTMLDivElement | null = null;

  buildFourier() {
    const N = this.numCircles * 4;
    let pts: { x: number; y: number }[];
    if (this.preset === "square") pts = squarePath(N);
    else if (this.preset === "figure8") pts = figure8Path(N);
    else pts = heartPath(N);
    this.fourier = dft(pts).slice(0, this.numCircles);
    this.trail = [];
    this.time = 0;
  }

  addControls() {
    if (!this.cont) return;
    this.controlsDiv = document.createElement("div");
    this.controlsDiv.style.cssText =
      "position:absolute;top:8px;left:8px;display:flex;gap:6px;align-items:center;z-index:10;background:rgba(20,20,35,0.92);color:#f0e6ff;border:1px solid rgba(255,120,200,0.3);padding:6px 10px;border-radius:6px;font-family:monospace;font-size:12px;flex-wrap:wrap;";

    const makeBtn = (label: string, fn: () => void) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText = "padding:3px 8px;cursor:pointer;border:1px solid rgba(255,120,200,0.5);border-radius:4px;background:rgba(255,60,180,0.15);color:#f0e6ff;font-family:monospace;font-size:12px;";
      b.addEventListener("click", fn);
      return b;
    };

    const label = document.createElement("span");
    label.textContent = "shape:";
    this.controlsDiv.appendChild(label);
    ["heart", "square", "figure8"].forEach(name => {
      this.controlsDiv!.appendChild(makeBtn(name, () => { this.preset = name; this.buildFourier(); }));
    });

    const sep = document.createElement("span");
    sep.textContent = "circles:";
    this.controlsDiv.appendChild(sep);
    [16, 32, 64, 128].forEach(n => {
      this.controlsDiv!.appendChild(makeBtn(String(n), () => { this.numCircles = n; this.buildFourier(); }));
    });

    // Info panel
    this.infoPanel = document.createElement("div");
    this.infoPanel.style.cssText =
      "display:none;position:absolute;top:56px;left:8px;width:380px;max-height:70vh;overflow-y:auto;background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;z-index:20;box-shadow:0 4px 20px rgba(0,0,0,0.4);";
    this.infoPanel.textContent = ELI5;

    const closeInfo = document.createElement("button");
    closeInfo.textContent = "✕";
    closeInfo.style.cssText = "position:absolute;top:8px;right:8px;background:none;border:none;color:#cdd6f4;cursor:pointer;font-size:14px;";
    closeInfo.addEventListener("click", () => { this.infoPanel!.style.display = "none"; });
    this.infoPanel.appendChild(closeInfo);

    const infoBtn = makeBtn("? explain", () => {
      this.infoPanel!.style.display = this.infoPanel!.style.display === "none" ? "block" : "none";
    });
    infoBtn.style.background = "rgba(255,60,180,0.35)";
    infoBtn.style.color = "#fff";
    infoBtn.style.borderColor = "rgba(255,120,200,0.7)";
    this.controlsDiv.appendChild(infoBtn);

    (this.cont as HTMLElement).style.position = "relative";
    this.cont.appendChild(this.controlsDiv);
    this.cont.appendChild(this.infoPanel);
  }

  init() {
    this.buildFourier();
    this.addControls();
    // Seed the background dark so the first fade doesn't start from white
    if (this.ctx) {
      this.ctx.fillStyle = "#0f0f1a";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    this.animate();
  }

  animate = () => {
    this.drawFrame();
    this.animId = requestAnimationFrame(this.animate);
  };

  drawFrame() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const W = this.canvasWidth;
    const H = this.canvasHeight;

    // Dark background with slight fade for trail ghosting
    ctx.fillStyle = "rgba(15,15,26,0.3)";
    ctx.fillRect(0, 0, W, H);

    let x = this.halfWidth;
    let y = this.halfHeight;
    const t = this.time;

    for (let i = 0; i < this.fourier.length; i++) {
      const { freq, amp, phase } = this.fourier[i];
      const prevX = x, prevY = y;
      const angle = freq * t * ((2 * Math.PI) / this.fourier.length) + phase;
      x += amp * Math.cos(angle);
      y += amp * Math.sin(angle);

      // Circle outlines — muted pink/rose
      ctx.strokeStyle = "rgba(255,100,180,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(prevX, prevY, amp, 0, 2 * Math.PI);
      ctx.stroke();

      // Spoke lines — brighter pink
      ctx.strokeStyle = "rgba(255,120,200,0.7)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    this.trail.unshift({ x, y });
    const maxTrail = this.fourier.length * 4;
    if (this.trail.length > maxTrail) this.trail.length = maxTrail;

    // Traced path — hot pink / magenta
    ctx.beginPath();
    ctx.moveTo(this.trail[0].x, this.trail[0].y);
    for (let i = 1; i < this.trail.length; i++) {
      const alpha = 1 - i / this.trail.length;
      ctx.strokeStyle = `rgba(255,60,180,${alpha})`;
      ctx.lineWidth = 2.5;
      ctx.lineTo(this.trail[i].x, this.trail[i].y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.trail[i].x, this.trail[i].y);
    }

    // Tip dot — bright white-pink
    ctx.fillStyle = "rgba(255,220,240,1)";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();

    this.time += 1;
    if (this.time >= this.fourier.length) { this.time = 0; this.trail = []; }
  }

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.controlsDiv?.parentNode) this.controlsDiv.parentNode.removeChild(this.controlsDiv);
    if (this.infoPanel?.parentNode) this.infoPanel.parentNode.removeChild(this.infoPanel);
    super.stop();
  }
}

export default FourierEpicycles;
