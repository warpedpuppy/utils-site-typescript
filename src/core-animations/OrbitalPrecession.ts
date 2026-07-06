import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";

const ELI5 = `🪐 Orbital Precession — What's going on?

Newton's law of gravity predicts that a planet in a two-body system
traces a perfect, closed ellipse — the same ellipse, forever.

This is exactly right for a simple sun + one planet system.
But Mercury doesn't do this. Its orbit slowly rotates.

The axis of Mercury's ellipse drifts by 575 arcseconds per century.
Most of that (532") is explained by the gravitational pull of other planets.
The remaining 43 arcseconds per century stumped astronomers for 50 years.

Einstein's general relativity explained those 43 arcseconds exactly.
It was one of the first experimental confirmations of the theory.

WHY DOES GR CAUSE PRECESSION?

In Newtonian gravity, the force falls off as exactly 1/r².
This produces a perfectly closed orbit (Bertrand's theorem).

General relativity adds a tiny extra attractive term:

  F_GR = GM/r² + 3GML²/(c²r⁴)

The extra term is strongest at periapsis (closest approach), where r is
smallest. It gives the planet a slightly stronger "slingshot" than
Newtonian physics predicts, so the orbit overshoots closure by a small
angle each revolution. That small angle accumulates over centuries
into the measurable drift called perihelion precession.

THE SIMULATION

This animation integrates two planets from identical starting conditions:

  BLUE  — Newtonian gravity:  F = GM/r²         (orbit closes perfectly)
  GOLD  — GR gravity:         F = GM/r² · (1 + ε/r²)

The ε slider exaggerates the GR correction so it's visible in seconds
rather than centuries. You can watch the gold ellipse slowly rotate
while the blue ellipse stays fixed.

The algorithm is Euler integration:
  a  = −F/m · r_hat           (acceleration toward sun)
  v  += a · dt                (update velocity)
  pos += v · dt               (update position)

Run multiple steps per frame for a stable, smooth orbit.

CONTROLS
  • GR ε — size of the relativistic correction (0 = pure Newton)
  • speed — integration steps per frame
  • reset — return both planets to their starting positions`;

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
}

export function newtonAccel(
  bx: number, by: number,
  sunX: number, sunY: number,
  GM: number
): [number, number] {
  const dx = bx - sunX;
  const dy = by - sunY;
  const r2 = dx * dx + dy * dy;
  const r3 = r2 * Math.sqrt(r2);
  const f = -GM / r3;
  return [f * dx, f * dy];
}

export function grAccel(
  bx: number, by: number,
  sunX: number, sunY: number,
  GM: number,
  epsilon: number
): [number, number] {
  const dx = bx - sunX;
  const dy = by - sunY;
  const r2 = dx * dx + dy * dy;
  const r3 = r2 * Math.sqrt(r2);
  const f = -GM / r3 * (1 + epsilon / r2);
  return [f * dx, f * dy];
}

/** Standalone draw — steps physics AND draws. Embed with `newtonAccel` and `grAccel` via `.toString()`. */
export function drawOrbitalPrecession(
  ctx: CanvasRenderingContext2D,
  newton: Body,
  gr: Body,
  epsilon: number,
  stepsPerFrame: number
): void {
  const GM = 400;
  const MAX_TRAIL = 2400;
  const TRAIL_CHUNKS = 12;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const sunX = W / 2;
  const sunY = H / 2;

  for (let i = 0; i < stepsPerFrame; i++) {
    const [nax, nay] = newtonAccel(newton.x, newton.y, sunX, sunY, GM);
    newton.vx += nax; newton.vy += nay;
    newton.x += newton.vx; newton.y += newton.vy;
    newton.trail.push({ x: newton.x, y: newton.y });
    if (newton.trail.length > MAX_TRAIL) newton.trail.shift();

    const [gax, gay] = grAccel(gr.x, gr.y, sunX, sunY, GM, epsilon);
    gr.vx += gax; gr.vy += gay;
    gr.x += gr.vx; gr.y += gr.vy;
    gr.trail.push({ x: gr.x, y: gr.y });
    if (gr.trail.length > MAX_TRAIL) gr.trail.shift();
  }

  ctx.fillStyle = "#04040e";
  ctx.fillRect(0, 0, W, H);

  function drawTrail(trail: { x: number; y: number }[], r: number, g: number, b: number) {
    if (trail.length < 2) return;
    const chunkSize = Math.max(1, Math.floor(trail.length / TRAIL_CHUNKS));
    for (let c = 0; c < TRAIL_CHUNKS; c++) {
      const start = c * chunkSize;
      if (start >= trail.length) break;
      const end = Math.min(start + chunkSize + 1, trail.length);
      const alpha = ((c + 1) / TRAIL_CHUNKS) * 0.75;
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(trail[start].x, trail[start].y);
      for (let i = start + 1; i < end; i++) ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();
    }
  }

  drawTrail(newton.trail, 96, 165, 250);
  drawTrail(gr.trail, 251, 191, 36);

  const R = 22;
  const glow = ctx.createRadialGradient(sunX, sunY, R * 0.8, sunX, sunY, R * 2.2);
  glow.addColorStop(0, "rgba(253,186,36,0.3)");
  glow.addColorStop(1, "rgba(253,186,36,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, R * 2.2, 0, 2 * Math.PI);
  ctx.fill();

  const grad = ctx.createRadialGradient(sunX - R * 0.3, sunY - R * 0.3, 0, sunX, sunY, R);
  grad.addColorStop(0, "#fff7a1");
  grad.addColorStop(0.4, "#fde047");
  grad.addColorStop(0.8, "#f97316");
  grad.addColorStop(1, "#7c2d12");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, R, 0, 2 * Math.PI);
  ctx.fill();

  function drawPlanet(body: Body, color: string, radius: number) {
    ctx.beginPath();
    ctx.arc(body.x, body.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawPlanet(newton, "#60a5fa", 9);
  drawPlanet(gr, "#fbbf24", 9);

  ctx.font = "bold 11px monospace";
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(96,165,250,0.85)";
  ctx.fillText("Newtonian", W - 16, H - 32);
  ctx.fillStyle = "rgba(251,191,36,0.85)";
  ctx.fillText("General Relativity", W - 16, H - 16);
  ctx.textAlign = "left";
}

const PrecessionFormula: CollisionDetectionObject = {
  keyFunction: grAccel,
  dependencies: [],
  functionString: `// Newtonian gravity
function newtonAccel(bx, by, sunX, sunY, GM) {
  const dx = bx - sunX, dy = by - sunY;
  const r3 = Math.pow(dx*dx + dy*dy, 1.5);
  return [-GM * dx / r3, -GM * dy / r3];
}

// GR-corrected gravity — adds a 1/r² term to the force
function grAccel(bx, by, sunX, sunY, GM, epsilon) {
  const dx = bx - sunX, dy = by - sunY;
  const r2 = dx*dx + dy*dy;
  const r3 = r2 * Math.sqrt(r2);
  const f = -GM / r3 * (1 + epsilon / r2);   // ← GR correction
  return [f * dx, f * dy];
}`,
};

const R0 = 195;
const V0 = 1.04;

class OrbitalPrecession extends Template {
  static t = "Orbital precession (GR)";
  static l = "orbital-precession";
  static f = PrecessionFormula;
  title = "Orbital precession (GR)";

  animationObject = PrecessionFormula;

  newton: Body = { x: 0, y: 0, vx: 0, vy: 0, trail: [] };
  gr: Body     = { x: 0, y: 0, vx: 0, vy: 0, trail: [] };

  epsilon = 800;
  stepsPerFrame = 4;
  animId = 0;

  controlsDiv: HTMLDivElement | null = null;
  infoPanel: HTMLDivElement | null = null;

  resetBodies() {
    const x0 = this.halfWidth + R0;
    const y0 = this.halfHeight;
    this.newton = { x: x0, y: y0, vx: 0, vy: -V0, trail: [] };
    this.gr     = { x: x0, y: y0, vx: 0, vy: -V0, trail: [] };
  }

  drawFrame() {
    if (!this.ctx) return;
    drawOrbitalPrecession(this.ctx, this.newton, this.gr, this.epsilon, this.stepsPerFrame);
  }

  addControls() {
    if (!this.cont) return;
    this.controlsDiv = document.createElement("div");
    this.controlsDiv.style.cssText =
      "position:absolute;top:8px;left:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;" +
      "z-index:10;background:rgba(4,4,18,0.93);color:#e8d8a0;" +
      "border:1px solid rgba(251,191,36,0.3);padding:6px 10px;border-radius:6px;" +
      "font-family:monospace;font-size:12px;";

    const makeBtn = (label: string, fn: () => void) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText =
        "padding:3px 8px;cursor:pointer;border:1px solid rgba(251,191,36,0.4);" +
        "border-radius:4px;background:rgba(251,191,36,0.12);color:#e8d8a0;" +
        "font-family:monospace;font-size:12px;";
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
      disp.style.minWidth = "32px";
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

    this.controlsDiv.appendChild(makeBtn("reset", () => this.resetBodies()));

    this.controlsDiv.appendChild(
      makeSlider("GR ε", 0, 3000, this.epsilon, 50, v => { this.epsilon = v; })
    );
    this.controlsDiv.appendChild(
      makeSlider("speed", 1, 12, this.stepsPerFrame, 1, v => { this.stepsPerFrame = v; })
    );

    // Info panel
    this.infoPanel = document.createElement("div");
    this.infoPanel.style.cssText =
      "display:none;position:absolute;top:56px;left:8px;width:420px;max-height:70vh;overflow-y:auto;" +
      "background:#08060c;color:#e8d8b0;padding:16px;border-radius:8px;" +
      "font-family:monospace;font-size:12px;line-height:1.7;white-space:pre-wrap;" +
      "z-index:20;box-shadow:0 4px 24px rgba(0,0,0,0.7);border:1px solid rgba(251,191,36,0.2);";
    this.infoPanel.textContent = ELI5;

    const closeInfo = document.createElement("button");
    closeInfo.textContent = "✕";
    closeInfo.style.cssText =
      "position:absolute;top:8px;right:8px;background:none;border:none;color:#e8d8b0;cursor:pointer;font-size:14px;";
    closeInfo.addEventListener("click", () => { this.infoPanel!.style.display = "none"; });
    this.infoPanel.appendChild(closeInfo);

    const infoBtn = makeBtn("? explain", () => {
      this.infoPanel!.style.display =
        this.infoPanel!.style.display === "none" ? "block" : "none";
    });
    this.controlsDiv.appendChild(infoBtn);

    (this.cont as HTMLElement).style.position = "relative";
    this.cont.appendChild(this.controlsDiv);
    this.cont.appendChild(this.infoPanel);
  }

  init() {
    this.resetBodies();
    this.addControls();
    this.animate();
  }

  animate = () => {
    this.drawFrame();
    this.animId = this.raf(this.animate);
  };

  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    this.resetBodies();
  };

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.controlsDiv?.parentNode) this.controlsDiv.parentNode.removeChild(this.controlsDiv);
    if (this.infoPanel?.parentNode) this.infoPanel.parentNode.removeChild(this.infoPanel);
    super.stop();
  }
}

export default OrbitalPrecession;
