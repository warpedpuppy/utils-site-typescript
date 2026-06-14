import Template from "../animationTemplate";

interface FreqComponent {
  freq: number;
  amp: number;
  phase: number;
  re: number;
  im: number;
}

// Preset paths as (x, y) offsets from center (scale ~150)
function squarePath(n: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const s = 150;
  const perSide = Math.floor(n / 4);
  for (let i = 0; i < perSide; i++) {
    const t = i / perSide;
    pts.push({ x: -s + t * 2 * s, y: -s });
  }
  for (let i = 0; i < perSide; i++) {
    const t = i / perSide;
    pts.push({ x: s, y: -s + t * 2 * s });
  }
  for (let i = 0; i < perSide; i++) {
    const t = i / perSide;
    pts.push({ x: s - t * 2 * s, y: s });
  }
  for (let i = 0; i < perSide; i++) {
    const t = i / perSide;
    pts.push({ x: -s, y: s - t * 2 * s });
  }
  return pts;
}

function heartPath(n: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );
    pts.push({ x: x * 9, y: y * 9 });
  }
  return pts;
}

function figure8Path(n: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const x = 150 * Math.sin(t);
    const y = 100 * Math.sin(2 * t);
    pts.push({ x, y });
  }
  return pts;
}

function dft(signal: { x: number; y: number }[]): FreqComponent[] {
  const N = signal.length;
  const result: FreqComponent[] = [];
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      re += signal[n].x * Math.cos(phi) + signal[n].y * Math.sin(phi);
      im += -signal[n].x * Math.sin(phi) + signal[n].y * Math.cos(phi);
    }
    re /= N;
    im /= N;
    result.push({
      freq: k,
      amp: Math.sqrt(re * re + im * im),
      phase: Math.atan2(im, re),
      re,
      im,
    });
  }
  return result.sort((a, b) => b.amp - a.amp);
}

class FourierEpicycles extends Template {
  static t = "Fourier epicycles";
  static l = "fourier-epicycles";
  title = "Fourier epicycles";

  fourier: FreqComponent[] = [];
  trail: { x: number; y: number }[] = [];
  time: number = 0;
  numCircles: number = 64;
  preset: string = "heart";
  animId: number = 0;
  controlsDiv: HTMLDivElement | null = null;

  keyFunction(signal: { x: number; y: number }[]) {
    // DFT: decomposes signal into frequency components (epicycles)
    return dft(signal);
  }

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
      "position:absolute;top:8px;left:8px;display:flex;gap:8px;align-items:center;z-index:10;background:rgba(255,255,255,0.85);padding:6px 10px;border-radius:6px;font-family:monospace;font-size:13px;";

    const label = document.createElement("span");
    label.textContent = "shape:";
    this.controlsDiv.appendChild(label);

    ["heart", "square", "figure8"].forEach((name) => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.style.cssText =
        "padding:3px 8px;cursor:pointer;border:1px solid #aaa;border-radius:4px;background:#fff;font-family:monospace;font-size:12px;";
      btn.addEventListener("click", () => {
        this.preset = name;
        this.buildFourier();
      });
      this.controlsDiv!.appendChild(btn);
    });

    const sep = document.createElement("span");
    sep.textContent = " | circles:";
    this.controlsDiv.appendChild(sep);

    [16, 32, 64, 128].forEach((n) => {
      const btn = document.createElement("button");
      btn.textContent = String(n);
      btn.style.cssText =
        "padding:3px 8px;cursor:pointer;border:1px solid #aaa;border-radius:4px;background:#fff;font-family:monospace;font-size:12px;";
      btn.addEventListener("click", () => {
        this.numCircles = n;
        this.buildFourier();
      });
      this.controlsDiv!.appendChild(btn);
    });

    // Make parent relative so absolute positioning works
    (this.cont as HTMLElement).style.position = "relative";
    this.cont.appendChild(this.controlsDiv);
  }

  init() {
    this.buildFourier();
    this.addControls();
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

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(0, 0, W, H);

    // Draw epicycles
    let x = this.halfWidth;
    let y = this.halfHeight;
    const t = this.time;

    for (let i = 0; i < this.fourier.length; i++) {
      const { freq, amp, phase } = this.fourier[i];
      const prevX = x;
      const prevY = y;

      const angle = freq * t * ((2 * Math.PI) / this.fourier.length) + phase;
      x += amp * Math.cos(angle);
      y += amp * Math.sin(angle);

      // Draw circle
      ctx.strokeStyle = "rgba(80,120,200,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(prevX, prevY, amp, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw radius line
      ctx.strokeStyle = "rgba(80,120,200,0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Record trail point
    this.trail.unshift({ x, y });
    const maxTrail = this.fourier.length * 4;
    if (this.trail.length > maxTrail) this.trail.length = maxTrail;

    // Draw trail
    ctx.beginPath();
    ctx.moveTo(this.trail[0].x, this.trail[0].y);
    for (let i = 1; i < this.trail.length; i++) {
      const alpha = 1 - i / this.trail.length;
      ctx.strokeStyle = `rgba(220,50,50,${alpha})`;
      ctx.lineWidth = 2;
      ctx.lineTo(this.trail[i].x, this.trail[i].y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.trail[i].x, this.trail[i].y);
    }

    // Dot at tip
    ctx.fillStyle = "rgba(220,50,50,1)";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Advance time — one full period = fourier.length steps
    this.time += 1;
    if (this.time >= this.fourier.length) {
      this.time = 0;
      this.trail = [];
    }
  }

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.controlsDiv && this.controlsDiv.parentNode) {
      this.controlsDiv.parentNode.removeChild(this.controlsDiv);
    }
    super.stop();
  }
}

export default FourierEpicycles;
