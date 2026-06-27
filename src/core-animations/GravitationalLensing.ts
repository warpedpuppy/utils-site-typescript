import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";

const ELI5 = `🌌 Gravitational Lensing — What's going on?

Newton said: light has no mass, so gravity cannot pull it.
Einstein said: mass curves space itself, and light must follow the curve.

Both cannot be right. In 1919, Arthur Eddington photographed stars near
the edge of the Sun during a total solar eclipse. The stars appeared
shifted from their true positions — exactly as Einstein predicted,
and twice what Newton would predict (zero).

General relativity won. It has been winning ever since.

THE MATH (weak-field / thin-lens approximation):

  α = 4GM / (bc²)

  α   deflection angle of the light ray
  G   gravitational constant
  M   mass of the lens
  b   impact parameter — the closest approach distance of the ray
  c   speed of light

In the animation, all constants are folded into one slider ("mass").
The essential relationship that remains:

  α ∝ 1/b

Rays that pass close to the lens bend the most.
Rays that pass far away barely bend at all.
This 1/b relationship is what creates the characteristic ring shape.

EINSTEIN RINGS

When a source, lens, and observer are perfectly aligned, every ray
at the same impact parameter b bends by the same angle and converges
to a ring on the image plane. The radius of this ring is:

  θ_E = √( 4GM · D_ls / c² · D_s · D_l )

where D_l, D_s, D_ls are distances between observer, lens, and source.

Real examples you can look up: the "Einstein Cross" (quasar Q2237+030),
the "Horseshoe Einstein Ring" (SDSS J1148+1930), and thousands more
catalogued by Hubble and the James Webb Space Telescope.

HOW THIS VISUALIZATION WORKS

Parallel horizontal rays enter from the left (the "source" side).
At the lens position, each ray is deflected by α = −mass/b toward the lens.
The deflected ray then continues in a straight line until it exits the canvas.

This is the "thin lens" approximation: we pretend all the bending happens
at a single plane (the lens x-position) rather than gradually along the path.
It is accurate when the lens is much closer than the source distance — which
is true for most real lensing scenarios.

CONTROLS
  • The lens drifts on its own — watch the rays bend and the focus sweep
  • Drag the glowing dot to reposition it (drift resumes around the new spot)
  • mass — increase to see stronger bending; watch the rays converge
  • rays  — more or fewer light paths shown`;

function deflect(
  rayY: number,
  lensY: number,
  mass: number
): number {
  const b = rayY - lensY;
  if (Math.abs(b) < 1) return 0;
  return -mass / b;
}

const LensingFormula: CollisionDetectionObject = {
  keyFunction: deflect,
  dependencies: [],
  functionString: `// Thin-lens gravitational deflection
// b = impact parameter (signed distance from lens axis)
// Returns post-lens slope (dy/dx) of the deflected ray
function deflect(rayY, lensY, mass) {
  const b = rayY - lensY;
  return -mass / b;       // α ∝ 1/b, toward the lens
}`,
};

interface Star {
  x: number;
  y: number;
  r: number;
  brightness: number;
}

/** Standalone draw — self-contained, embed via `.toString()` in CodePen. */
export function drawGravitationalLensing(
  ctx: CanvasRenderingContext2D,
  lensX: number,
  lensY: number,
  mass: number,
  numRays: number,
  time: number,
  stars: { x: number; y: number; r: number; brightness: number }[]
): void {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  function rayExit(x0: number, y0: number, slope: number): { x: number; y: number } {
    const dx = W - x0;
    const y_right = y0 + slope * dx;
    if (y_right >= 0 && y_right <= H) return { x: W, y: y_right };
    if (slope < 0 && y0 > 0) {
      const x_top = x0 + (-y0) / slope;
      if (x_top >= x0 && x_top <= W) return { x: x_top, y: 0 };
    }
    if (slope > 0 && y0 < H) {
      const x_bot = x0 + (H - y0) / slope;
      if (x_bot >= x0 && x_bot <= W) return { x: x_bot, y: H };
    }
    return { x: W, y: y_right };
  }

  ctx.fillStyle = "#02020c";
  ctx.fillRect(0, 0, W, H);

  for (const s of stars) {
    const twinkle = s.brightness * (0.7 + 0.3 * Math.sin(time * 0.8 + s.x));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(200, 220, 255, ${twinkle})`;
    ctx.fill();
  }

  const spacing = H / (numRays + 1);
  const minImpact = 16;
  for (let i = 1; i <= numRays; i++) {
    const y0 = i * spacing;
    const b = y0 - lensY;
    if (Math.abs(b) < minImpact) continue;
    const slope = -mass / b;
    const normDist = Math.abs(b) / (H / 2);
    const alpha = Math.max(0.08, 0.65 - normDist * 0.45);
    ctx.strokeStyle = `rgba(255, 195, 65, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(lensX, y0);
    const exit = rayExit(lensX, y0, slope);
    ctx.lineTo(exit.x, exit.y);
    ctx.stroke();
  }

  const pulse = 0.85 + 0.15 * Math.sin(time * 1.8);
  const glow = ctx.createRadialGradient(lensX, lensY, 0, lensX, lensY, 60 * pulse);
  glow.addColorStop(0, "rgba(200, 240, 255, 0.55)");
  glow.addColorStop(0.3, "rgba(120, 180, 255, 0.25)");
  glow.addColorStop(1, "rgba(80,  120, 255, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(lensX, lensY, 60 * pulse, 0, 2 * Math.PI);
  ctx.fill();

  const core = ctx.createRadialGradient(lensX - 3, lensY - 3, 0, lensX, lensY, 14);
  core.addColorStop(0, "#ffffff");
  core.addColorStop(0.4, "#c8e8ff");
  core.addColorStop(1, "#5080c0");
  ctx.beginPath();
  ctx.arc(lensX, lensY, 14, 0, 2 * Math.PI);
  ctx.fillStyle = core;
  ctx.fill();
}

class GravitationalLensing extends Template {
  static t = "Gravitational lensing";
  static l = "gravitational-lensing";
  static f = LensingFormula;
  title = "Gravitational lensing";

  animationObject = LensingFormula;

  lensX = 0;
  lensY = 0;
  homeX = 0;
  homeY = 0;
  autoMove = true;
  mass = 120;
  numRays = 50;
  time = 0;
  animId = 0;
  dragging = false;

  stars: Star[] = [];
  controlsDiv: HTMLDivElement | null = null;
  infoPanel: HTMLDivElement | null = null;

  initScene() {
    this.lensX = this.homeX = this.halfWidth * 0.9;
    this.lensY = this.homeY = this.halfHeight;
    this.stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * this.canvasWidth,
      y: Math.random() * this.canvasHeight,
      r: Math.random() * 1.4 + 0.3,
      brightness: 0.3 + Math.random() * 0.7,
    }));
  }

  drawFrame() {
    if (!this.ctx) return;
    const W = this.canvasWidth;
    const H = this.canvasHeight;

    if (this.autoMove && !this.dragging) {
      const yb = this.homeY + this.halfHeight * 0.5 * Math.sin(this.time * 0.6);
      const xb = this.homeX + this.halfWidth * 0.1 * Math.sin(this.time * 0.3);
      this.lensY = Math.min(Math.max(yb, 12), H - 12);
      this.lensX = Math.min(Math.max(xb, 12), W - 12);
    }

    drawGravitationalLensing(this.ctx, this.lensX, this.lensY, this.mass, this.numRays, this.time, this.stars);
    this.time += 0.03;
  }

  addControls() {
    if (!this.cont) return;
    this.controlsDiv = document.createElement("div");
    this.controlsDiv.style.cssText =
      "position:absolute;top:8px;left:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;" +
      "z-index:10;background:rgba(2,2,18,0.93);color:#d0e8ff;" +
      "border:1px solid rgba(100,160,255,0.3);padding:6px 10px;border-radius:6px;" +
      "font-family:monospace;font-size:12px;";

    const makeBtn = (label: string, fn: () => void) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText =
        "padding:3px 8px;cursor:pointer;border:1px solid rgba(100,160,255,0.4);" +
        "border-radius:4px;background:rgba(60,100,255,0.15);color:#d0e8ff;" +
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

    this.controlsDiv.appendChild(
      makeSlider("mass", 0, 400, this.mass, 10, v => { this.mass = v; })
    );
    this.controlsDiv.appendChild(
      makeSlider("rays", 20, 80, this.numRays, 5, v => { this.numRays = v; })
    );

    // Info panel
    this.infoPanel = document.createElement("div");
    this.infoPanel.style.cssText =
      "display:none;position:absolute;top:56px;left:8px;width:420px;max-height:70vh;overflow-y:auto;" +
      "background:#06060f;color:#c8dcff;padding:16px;border-radius:8px;" +
      "font-family:monospace;font-size:12px;line-height:1.7;white-space:pre-wrap;" +
      "z-index:20;box-shadow:0 4px 24px rgba(0,0,0,0.7);border:1px solid rgba(100,160,255,0.2);";
    this.infoPanel.textContent = ELI5;

    const closeInfo = document.createElement("button");
    closeInfo.textContent = "✕";
    closeInfo.style.cssText =
      "position:absolute;top:8px;right:8px;background:none;border:none;color:#c8dcff;cursor:pointer;font-size:14px;";
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
    this.initScene();
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
    if (Math.hypot(x - this.lensX, y - this.lensY) < 28) {
      this.dragging = true;
      this.autoMove = false;
      if (this.canvas) this.canvas.style.cursor = "grabbing";
    }
  }

  pointerMoveHandler(e: PointerEvent) {
    const x = e.pageX - this.left;
    const y = e.pageY - this.top;
    if (this.dragging) {
      this.lensX = x;
      this.lensY = y;
    } else if (this.canvas) {
      this.canvas.style.cursor =
        Math.hypot(x - this.lensX, y - this.lensY) < 28 ? "grab" : "default";
    }
  }

  pointerUpHandler(_e: PointerEvent) {
    if (this.dragging) {
      // re-anchor the drift around wherever the user dropped it, then resume
      this.homeX = this.lensX;
      this.homeY = this.lensY;
      this.autoMove = true;
    }
    this.dragging = false;
    if (this.canvas) this.canvas.style.cursor = "default";
  }

  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    this.initScene();
  };

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.controlsDiv?.parentNode) this.controlsDiv.parentNode.removeChild(this.controlsDiv);
    if (this.infoPanel?.parentNode) this.infoPanel.parentNode.removeChild(this.infoPanel);
    super.stop();
  }
}

export default GravitationalLensing;
