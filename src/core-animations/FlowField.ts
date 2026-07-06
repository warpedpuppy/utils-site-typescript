import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";


const ELI5 = `🌊 Perlin Flow Field — What's going on?

Each particle follows an invisible "wind map" made of Perlin noise.

PERLIN NOISE is a way to make smooth random numbers. Unlike pure random
(which jumps around chaotically), Perlin noise changes gradually — nearby
points get similar values. That's what makes it look organic and natural.

HOW THE FIELD WORKS:
  1. Divide the canvas into an invisible grid
  2. At each grid point, compute a noise value → turn it into an angle (0–2π)
  3. Each particle reads the angle at its position and steers that direction
  4. The noise slowly "flows" over time (z-offset), so the whole field evolves

THE MATH:
  angle = perlin2(x * scale, y * scale + time) × 4π
  vx += cos(angle) × force
  vy += sin(angle) × force

The permutation table is the key trick: Ken Perlin (1983) shuffled 0–255
into a lookup table so gradient directions could be computed cheaply
without storing them explicitly.

Real-world uses: cloud/terrain generation in games, smoke/fire VFX,
procedural textures, organic animation paths.`;

// Permutation-table Perlin noise (classic Ken Perlin implementation)
function buildPermTable(): number[] {
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return [...p, ...p];
}

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

function perlin2(x: number, y: number, permTable: number[]): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  const u = fade(x);
  const v = fade(y);
  const a = permTable[X] + Y;
  const b = permTable[X + 1] + Y;
  return lerp(
    lerp(grad(permTable[a], x, y), grad(permTable[b], x - 1, y), u),
    lerp(
      grad(permTable[a + 1], x, y - 1),
      grad(permTable[b + 1], x - 1, y - 1),
      u
    ),
    v
  );
}

function getFlowAngle(
  x: number,
  y: number,
  scale: number,
  z: number,
  permTable: number[]
): number {
  return perlin2(x * scale, y * scale + z, permTable) * Math.PI * 4;
}

const flowFieldFormulaPerm = buildPermTable();

const FlowFieldFormula: CollisionDetectionObject = {
  keyFunction: (x: number, y: number, scale: number, z: number) =>
    getFlowAngle(x, y, scale, z, flowFieldFormulaPerm),
  dependencies: [],
  functionString: `function buildPermTable(): number[] {
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return [...p, ...p];
}
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y, v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}
function perlin2(x: number, y: number): number {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  x -= Math.floor(x); y -= Math.floor(y);
  const u = fade(x), v = fade(y);
  const a = perm[X] + Y, b = perm[X + 1] + Y;
  return lerp(
    lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u),
    lerp(grad(perm[a+1], x, y-1), grad(perm[b+1], x-1, y-1), u),
    v
  );
}
const perm = buildPermTable();
function getFlowAngle(x: number, y: number, scale: number, z: number): number {
  return perlin2(x * scale, y * scale + z) * Math.PI * 4;
}`,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  alpha: number;
  history: { x: number; y: number }[];
}

interface FlowFieldDrawState {
  particles: Particle[];
  fieldScale: number;
  speed: number;
  trailLength: number;
  zOffset: number;
  zSpeed: number;
  perm: number[];
}

export function drawFlowField(
  ctx: CanvasRenderingContext2D,
  trailCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: FlowFieldDrawState
) {
  function getFlowAngleAtPoint(x: number, y: number): number {
    function fadeLocal(t: number) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }

    function lerpLocal(a: number, b: number, t: number) {
      return a + t * (b - a);
    }

    function gradLocal(hash: number, px: number, py: number): number {
      const h = hash & 3;
      const u = h < 2 ? px : py;
      const v = h < 2 ? py : px;
      return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }

    let sampleX = x * state.fieldScale;
    let sampleY = y * state.fieldScale + state.zOffset;
    const X = Math.floor(sampleX) & 255;
    const Y = Math.floor(sampleY) & 255;
    sampleX -= Math.floor(sampleX);
    sampleY -= Math.floor(sampleY);
    const u = fadeLocal(sampleX);
    const v = fadeLocal(sampleY);
    const a = state.perm[X] + Y;
    const b = state.perm[X + 1] + Y;

    return (
      lerpLocal(
        lerpLocal(
          gradLocal(state.perm[a], sampleX, sampleY),
          gradLocal(state.perm[b], sampleX - 1, sampleY),
          u
        ),
        lerpLocal(
          gradLocal(state.perm[a + 1], sampleX, sampleY - 1),
          gradLocal(state.perm[b + 1], sampleX - 1, sampleY - 1),
          u
        ),
        v
      ) *
      Math.PI *
      4
    );
  }

  state.zOffset += state.zSpeed;

  for (const p of state.particles) {
    const angle = getFlowAngleAtPoint(p.x, p.y);
    p.vx += Math.cos(angle) * 0.3;
    p.vy += Math.sin(angle) * 0.3;

    const mag = Math.hypot(p.vx, p.vy);
    if (mag > state.speed) {
      p.vx = (p.vx / mag) * state.speed;
      p.vy = (p.vy / mag) * state.speed;
    }

    p.history.push({ x: p.x, y: p.y });
    if (p.history.length > state.trailLength) p.history.shift();

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    p.hue = (p.hue + 0.3) % 360;
  }

  trailCtx.fillStyle = "rgba(15, 15, 25, 0.04)";
  trailCtx.fillRect(0, 0, width, height);

  for (const p of state.particles) {
    if (p.history.length < 2) continue;
    trailCtx.beginPath();
    trailCtx.moveTo(p.history[0].x, p.history[0].y);
    for (let i = 1; i < p.history.length; i++) {
      const alpha = (i / p.history.length) * p.alpha;
      trailCtx.strokeStyle = `hsla(${p.hue},80%,60%,${alpha})`;
      trailCtx.lineWidth = 1.5;
      trailCtx.lineTo(p.history[i].x, p.history[i].y);
      trailCtx.stroke();
      trailCtx.beginPath();
      trailCtx.moveTo(p.history[i].x, p.history[i].y);
    }
  }

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(trailCtx.canvas, 0, 0);

  for (const p of state.particles) {
    ctx.fillStyle = `hsla(${p.hue},90%,75%,0.9)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class FlowField extends Template {
  static t = "Perlin noise flow field";
  static l = "flow-field";
  static f = FlowFieldFormula;
  title = "Perlin noise flow field";

  animationObject = FlowFieldFormula;

  particles: Particle[] = [];
  numParticles: number = 600;
  fieldScale: number = 0.003;   // noise zoom
  speed: number = 2.5;
  trailLength: number = 40;
  zOffset: number = 0;          // animate noise over time
  zSpeed: number = 0.0005;
  animId: number = 0;
  controlsDiv: HTMLDivElement | null = null;
  infoPanel: HTMLDivElement | null = null;

  // Off-screen trail canvas for persistent blending
  trailCanvas: HTMLCanvasElement | null = null;
  trailCtx: CanvasRenderingContext2D | null = null;
  perm: number[] = buildPermTable();

  keyFunction(x: number, y: number, scale: number, z: number): number {
    // Returns a Perlin noise angle (0–2π) for position (x,y)
    return getFlowAngle(x, y, scale, z, this.perm);
  }

  spawnParticle(): Particle {
    return {
      x: Math.random() * this.canvasWidth,
      y: Math.random() * this.canvasHeight,
      vx: 0,
      vy: 0,
      hue: Math.random() * 360,
      alpha: 0.6 + Math.random() * 0.4,
      history: [],
    };
  }

  resetParticles() {
    this.particles = Array.from({ length: this.numParticles }, () =>
      this.spawnParticle()
    );
    this.perm = buildPermTable(); // new noise on reset
    if (this.trailCtx && this.trailCanvas) {
      this.trailCtx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
    }
  }

  addControls() {
    if (!this.cont) return;
    this.controlsDiv = document.createElement("div");
    this.controlsDiv.style.cssText =
      "position:absolute;top:8px;left:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;z-index:10;background:rgba(10,10,20,0.92);color:#e0e8ff;border:1px solid rgba(150,180,255,0.3);padding:6px 10px;border-radius:6px;font-family:monospace;font-size:12px;";

    const makeBtn = (label: string, fn: () => void) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText =
        "padding:3px 8px;cursor:pointer;border:1px solid rgba(150,180,255,0.4);border-radius:4px;background:rgba(100,140,255,0.15);color:#e0e8ff;font-family:monospace;font-size:12px;";
      b.addEventListener("click", fn);
      return b;
    };

    const makeSlider = (label: string, min: number, max: number, val: number, step: number, onChange: (v: number) => void) => {
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
      sl.style.width = "80px";
      const disp = document.createElement("span");
      disp.textContent = String(val);
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

    this.controlsDiv.appendChild(makeBtn("reset", () => this.resetParticles()));

    this.controlsDiv.appendChild(
      makeSlider("particles", 100, 2000, this.numParticles, 100, (v) => {
        this.numParticles = v;
        this.particles = Array.from({ length: v }, () => this.spawnParticle());
      })
    );

    this.controlsDiv.appendChild(
      makeSlider("speed", 0.5, 6, this.speed, 0.5, (v) => { this.speed = v; })
    );

    this.controlsDiv.appendChild(
      makeSlider("zoom", 1, 10, Math.round(this.fieldScale * 1000), 1, (v) => {
        this.fieldScale = v / 1000;
      })
    );

    this.controlsDiv.appendChild(
      makeSlider("trail", 10, 100, this.trailLength, 5, (v) => { this.trailLength = v; })
    );

    // Info panel
    this.infoPanel = document.createElement("div");
    this.infoPanel.style.cssText =
      "display:none;position:absolute;top:56px;left:8px;width:420px;max-height:70vh;overflow-y:auto;background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;z-index:20;box-shadow:0 4px 20px rgba(0,0,0,0.4);";
    this.infoPanel.textContent = ELI5;
    const closeInfo = document.createElement("button");
    closeInfo.textContent = "✕";
    closeInfo.style.cssText = "position:absolute;top:8px;right:8px;background:none;border:none;color:#cdd6f4;cursor:pointer;font-size:14px;";
    closeInfo.addEventListener("click", () => { this.infoPanel!.style.display = "none"; });
    this.infoPanel.appendChild(closeInfo);

    const infoBtn = makeBtn("? explain", () => {
      this.infoPanel!.style.display = this.infoPanel!.style.display === "none" ? "block" : "none";
    });
    infoBtn.style.background = "rgba(100,140,255,0.3)";
    infoBtn.style.color = "#e0e8ff";
    infoBtn.style.borderColor = "rgba(150,180,255,0.6)";
    this.controlsDiv.appendChild(infoBtn);

    (this.cont as HTMLElement).style.position = "relative";
    this.cont.appendChild(this.controlsDiv);
    this.cont.appendChild(this.infoPanel);
  }

  init() {
    // Set up an off-screen canvas for trails
    this.trailCanvas = document.createElement("canvas");
    this.trailCanvas.width = this.canvasWidth;
    this.trailCanvas.height = this.canvasHeight;
    this.trailCtx = this.trailCanvas.getContext("2d");

    this.resetParticles();
    this.addControls();
    this.animate();
  }

  animate = () => {
    if (this.ctx && this.trailCtx) {
      drawFlowField(
        this.ctx,
        this.trailCtx,
        this.canvasWidth,
        this.canvasHeight,
        this
      );
    }
    this.animId = this.raf(this.animate);
  };

  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    if (this.trailCanvas) {
      this.trailCanvas.width = this.canvasWidth;
      this.trailCanvas.height = this.canvasHeight;
    }
    this.resetParticles();
  };

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.controlsDiv?.parentNode) this.controlsDiv.parentNode.removeChild(this.controlsDiv);
    if (this.infoPanel?.parentNode) this.infoPanel.parentNode.removeChild(this.infoPanel);
    this.trailCanvas = null;
    this.trailCtx = null;
    super.stop();
  }
}

export default FlowField;
