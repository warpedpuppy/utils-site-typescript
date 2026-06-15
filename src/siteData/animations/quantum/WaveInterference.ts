import Template from "../animationTemplate";
import { CollisionDetectionObject } from "../../../types/types";

const ELI5 = `🌊 Wave Interference — What's going on?

Drop a pebble in a still pond: circular ripples spread outward.
Drop two pebbles: the ripples meet and interfere.

WHERE TWO CRESTS MEET → they add up → bigger wave (bright band)
WHERE A CREST MEETS A TROUGH → they cancel → flat water (dark band)

This animation computes that at every pixel. For each point on screen,
we measure the distance to each source and evaluate:

  A(x, y, t) = Σ cos(k · rᵢ − ωt)

  k  = 2π / λ    wavenumber — how tightly packed the waves are
  rᵢ = distance from pixel to source i
  ωt = phase that advances each frame, making waves appear to travel
  λ  = wavelength — drag the slider to see fringes widen or tighten

Bright pixels: waves arrive in phase and reinforce each other.
Dark pixels: waves arrive out of phase and cancel.

THE QUANTUM CONNECTION

This is not just a water analogy. Electrons, photons, and all quantum
particles behave exactly like this. In the famous double-slit experiment:

  • A single electron is fired at a barrier with two slits.
  • No detector tells us which slit it went through.
  • On the screen behind, thousands of electrons land in the same
    bright/dark fringe pattern you see here — even one at a time.

The electron travels as a wave through BOTH slits simultaneously,
interferes with itself, and only "decides" where it is when it hits
the screen. The math governing that wave is Schrödinger's equation,
and the interference term looks identical to what you see here.

That's the core strangeness of quantum mechanics: the wave is real,
not a metaphor. The particle IS the wave — until you look.

CONTROLS
  • Drag the colored dots to reposition the sources
  • λ (wavelength) — longer waves = wider, fewer fringes
  • sources — add a third emitter and watch the pattern change
  • speed — rate at which the wavefronts travel`;

function waveAmplitude(
  px: number,
  py: number,
  sources: { x: number; y: number }[],
  k: number,
  t: number
): number {
  let amp = 0;
  for (const src of sources) {
    const r = Math.hypot(px - src.x, py - src.y);
    amp += Math.cos(k * r - t);
  }
  return amp;
}

const WaveFormula: CollisionDetectionObject = {
  keyFunction: waveAmplitude,
  dependencies: [],
  functionString: `// Amplitude at pixel (px, py) from N wave sources
function waveAmplitude(px, py, sources, k, t) {
  let amp = 0;
  for (const src of sources) {
    const r = Math.hypot(px - src.x, py - src.y);
    amp += Math.cos(k * r - t);   // k = 2π/λ
  }
  return amp;  // range: [-N, N]
}

// Per-pixel brightness (0–1), gamma-curved so fringes pop:
const n = (amp / N + 1) / 2;          // normalise to [0, 1]
const b = Math.pow(n, 1.4);           // gamma darkens midtones`,
};

const SOURCE_COLORS = ["#ff6b6b", "#69d2e7", "#ffd93d"];
const DOT_RADIUS = 10;
const HIT_RADIUS = 22;

// dark-navy → bright-cyan colour ramp
const DARK = [0, 6, 28] as const;
const BRIGHT = [190, 238, 255] as const;

class WaveInterference extends Template {
  static t = "Wave interference";
  static l = "wave-interference";
  static f = WaveFormula;
  title = "Wave interference";

  animationObject = WaveFormula;

  sources: { x: number; y: number }[] = [];
  numSources = 2;
  wavelength = 60;
  speed = 1.5;
  time = 0;
  animId = 0;
  dragging = -1;

  controlsDiv: HTMLDivElement | null = null;
  infoPanel: HTMLDivElement | null = null;

  initSources() {
    const cx = this.halfWidth;
    const cy = this.halfHeight;
    this.sources = [
      { x: cx - 80, y: cy },
      { x: cx + 80, y: cy },
    ];
    if (this.numSources >= 3) {
      this.sources.push({ x: cx, y: cy - 100 });
    }
  }

  drawFrame() {
    if (!this.ctx || !this.canvas) return;
    const W = this.canvasWidth;
    const H = this.canvasHeight;
    const k = (2 * Math.PI) / this.wavelength;
    const t = this.time;
    const N = this.sources.length;

    const imgData = this.ctx.createImageData(W, H);
    const data = imgData.data;

    // Sample every 2 pixels, fill 2×2 blocks — 4× speedup
    for (let py = 0; py < H; py += 2) {
      for (let px = 0; px < W; px += 2) {
        const amp = waveAmplitude(px, py, this.sources, k, t);
        const n = (amp / N + 1) / 2;               // 0–1
        const b = Math.pow(Math.max(0, Math.min(1, n)), 1.4);
        const r = Math.round(DARK[0] + b * (BRIGHT[0] - DARK[0]));
        const g = Math.round(DARK[1] + b * (BRIGHT[1] - DARK[1]));
        const bl = Math.round(DARK[2] + b * (BRIGHT[2] - DARK[2]));

        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            if (py + dy >= H || px + dx >= W) continue;
            const i = ((py + dy) * W + (px + dx)) * 4;
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = bl;
            data[i + 3] = 255;
          }
        }
      }
    }

    this.ctx.putImageData(imgData, 0, 0);

    // Draw source dots on top
    this.sources.forEach((src, i) => {
      if (!this.ctx) return;
      this.ctx.beginPath();
      this.ctx.arc(src.x, src.y, DOT_RADIUS, 0, 2 * Math.PI);
      this.ctx.fillStyle = SOURCE_COLORS[i % SOURCE_COLORS.length];
      this.ctx.fill();
      this.ctx.strokeStyle = "rgba(255,255,255,0.8)";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });

    this.time += this.speed * 0.06;
  }

  addControls() {
    if (!this.cont) return;
    this.controlsDiv = document.createElement("div");
    this.controlsDiv.style.cssText =
      "position:absolute;top:8px;left:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;z-index:10;" +
      "background:rgba(0,6,28,0.93);color:#c8e4ff;border:1px solid rgba(100,180,255,0.3);" +
      "padding:6px 10px;border-radius:6px;font-family:monospace;font-size:12px;";

    const makeBtn = (label: string, fn: () => void) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText =
        "padding:3px 8px;cursor:pointer;border:1px solid rgba(100,180,255,0.4);border-radius:4px;" +
        "background:rgba(80,140,255,0.15);color:#c8e4ff;font-family:monospace;font-size:12px;";
      b.addEventListener("click", fn);
      return b;
    };

    const makeSlider = (
      label: string,
      min: number,
      max: number,
      val: number,
      step: number,
      onChange: (v: number) => void
    ) => {
      const wrap = document.createElement("span");
      wrap.style.cssText = "display:flex;align-items:center;gap:4px;";
      const lbl = document.createElement("span");
      lbl.textContent = `${label}:`;
      const sl = document.createElement("input");
      sl.type = "range";
      sl.min = String(min);
      sl.max = String(max);
      sl.value = String(val);
      sl.step = String(step);
      sl.style.width = "72px";
      const disp = document.createElement("span");
      disp.textContent = String(val);
      disp.style.minWidth = "28px";
      sl.addEventListener("input", () => {
        const v = Number(sl.value);
        disp.textContent = String(v);
        onChange(v);
      });
      wrap.appendChild(lbl);
      wrap.appendChild(sl);
      wrap.appendChild(disp);
      return wrap;
    };

    const srcLabel = document.createElement("span");
    srcLabel.textContent = "sources:";
    this.controlsDiv.appendChild(srcLabel);

    [1, 2, 3].forEach(n => {
      this.controlsDiv!.appendChild(
        makeBtn(String(n), () => {
          this.numSources = n;
          this.initSources();
        })
      );
    });

    this.controlsDiv.appendChild(
      makeSlider("λ", 20, 150, this.wavelength, 5, v => { this.wavelength = v; })
    );

    this.controlsDiv.appendChild(
      makeSlider("speed", 0.5, 5, this.speed, 0.5, v => { this.speed = v; })
    );

    // Info panel
    this.infoPanel = document.createElement("div");
    this.infoPanel.style.cssText =
      "display:none;position:absolute;top:56px;left:8px;width:420px;max-height:70vh;overflow-y:auto;" +
      "background:#0b0f1e;color:#c8e4ff;padding:16px;border-radius:8px;" +
      "font-family:monospace;font-size:12px;line-height:1.7;white-space:pre-wrap;" +
      "z-index:20;box-shadow:0 4px 24px rgba(0,0,0,0.6);border:1px solid rgba(100,180,255,0.2);";
    this.infoPanel.textContent = ELI5;

    const closeInfo = document.createElement("button");
    closeInfo.textContent = "✕";
    closeInfo.style.cssText =
      "position:absolute;top:8px;right:8px;background:none;border:none;color:#c8e4ff;cursor:pointer;font-size:14px;";
    closeInfo.addEventListener("click", () => { this.infoPanel!.style.display = "none"; });
    this.infoPanel.appendChild(closeInfo);

    const infoBtn = makeBtn("? explain", () => {
      this.infoPanel!.style.display =
        this.infoPanel!.style.display === "none" ? "block" : "none";
    });
    infoBtn.style.background = "rgba(80,140,255,0.3)";
    infoBtn.style.borderColor = "rgba(100,180,255,0.7)";
    this.controlsDiv.appendChild(infoBtn);

    (this.cont as HTMLElement).style.position = "relative";
    this.cont.appendChild(this.controlsDiv);
    this.cont.appendChild(this.infoPanel);
  }

  init() {
    this.initSources();
    this.addControls();
    this.animate();
  }

  animate = () => {
    this.drawFrame();
    this.animId = requestAnimationFrame(this.animate);
  };

  pointerDownHandler(e: PointerEvent) {
    const x = e.pageX - this.left;
    const y = e.pageY - this.top;
    this.dragging = this.sources.findIndex(s => {
      return Math.hypot(s.x - x, s.y - y) < HIT_RADIUS;
    });
    if (this.dragging >= 0 && this.canvas) {
      this.canvas.style.cursor = "grabbing";
    }
  }

  pointerMoveHandler(e: PointerEvent) {
    if (!this.canvas) return;
    const x = e.pageX - this.left;
    const y = e.pageY - this.top;
    if (this.dragging >= 0) {
      this.sources[this.dragging].x = x;
      this.sources[this.dragging].y = y;
    } else {
      const nearAny = this.sources.some(s => Math.hypot(s.x - x, s.y - y) < HIT_RADIUS);
      this.canvas.style.cursor = nearAny ? "grab" : "default";
    }
  }

  pointerUpHandler(_e: PointerEvent) {
    this.dragging = -1;
    if (this.canvas) this.canvas.style.cursor = "default";
  }

  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    this.initSources();
  };

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.controlsDiv?.parentNode) this.controlsDiv.parentNode.removeChild(this.controlsDiv);
    if (this.infoPanel?.parentNode) this.infoPanel.parentNode.removeChild(this.infoPanel);
    super.stop();
  }
}

export default WaveInterference;
