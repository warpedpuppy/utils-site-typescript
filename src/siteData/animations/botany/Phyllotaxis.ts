import Template from "../animationTemplate";
import { CollisionDetectionObject } from "../../../types/types";

const GOLDEN_ANGLE = 137.50776405003785; // degrees — (2 - φ) × 360
const MAX_ROTATE_SPEED = 0.3; // degrees per frame — never let it get that fast

const ELI5 = `🌻 Phyllotaxis — Why Sunflowers Are Mathematical

The one-line takeaway: sunflowers grow in Fibonacci spirals because each
new seed is placed exactly one golden angle (137.507°) around from the last,
and that angle is the single most "irrational" way to never overlap.

HOW SEEDS ARE PLACED (Vogel's model, 1979):
  For seed n = 0, 1, 2, 3, …
    θ = n × φ           (φ is the divergence angle — the one knob)
    r = c × √n          (√n keeps seed AREA-density constant)
    x = r · cos(θ)
    y = r · sin(θ)

That is the entire algorithm. There is no "loop count the spirals" logic.
The double-spiral structure you see is a side-effect of the angle, not
something programmed in.

WHY THE GOLDEN ANGLE SPECIFICALLY?

The golden ratio φ ≈ 1.6180339... is the "most irrational" number.
Its continued-fraction expansion is [1; 1, 1, 1, …] — all ones, forever.
That means rational approximations converge to it slower than to any other
number. In other words: no simple fraction p/q is ever close to φ.

If you used a rational angle (1/2 turn, 1/3 turn), every seed in the
same angular "slot" would stack radially, leaving gaps. Wasteful, ugly.

The golden angle (1/φ × 360°) is so irrational that seeds never line up
radially, giving perfect, gap-free packing. Nature didn't "choose"
Fibonacci — Fibonacci is just what you count when you look at the closest-
approach spirals of a perfectly-packed golden-angle lattice.

THE FIBONACCI CONNECTION

Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89…) are the
denominators of the best rational approximations to 1/φ. When you count
clockwise and counter-clockwise spiral arms in a sunflower, you always get
consecutive Fibonacci numbers because those are the "almost-fits" of the
golden angle — angles at which seeds nearly line up, forming the visual ridges.

CONTROLS
  • Divergence angle — the hero slider. At 137.507° the head crystallizes.
    Drag away and watch it shatter.
  • "Snap to Golden" button — eases the slider home and crystallizes.
  • Seeds — grow from a single seed to 1 000.
  • Color — toggle gradient (by generation) vs. monochrome.
  • Spirals — overlay that traces and counts the two spiral families
    (parastichies), so the Fibonacci pair is shown, not just claimed.
  • Presets — 1/2 turn (180°), 1/3 turn (120°), Golden (137.507°),
    √2 turn (222.49°), Silver (151.14°).
  • Auto / Manual — auto mode slowly sweeps the angle back and forth
    while rotating, showing the knife-edge between packing and chaos.
  • Rotate speed — how fast the whole pattern spins.`;

function phyllotaxisPoint(
  n: number,
  angleDeg: number,
  scale: number
): [number, number] {
  const theta = (n * angleDeg * Math.PI) / 180;
  const r = scale * Math.sqrt(n);
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

const PhyllotaxisFormula: CollisionDetectionObject = {
  keyFunction: phyllotaxisPoint,
  dependencies: [],
  functionString: `// Vogel's model (1979) — place seed n at:
//   θ = n × φ_deg × (π/180)
//   r = c × √n        (√n keeps area-density constant)
//   x = r·cos(θ),  y = r·sin(θ)
function phyllotaxisPoint(n, angleDeg, scale) {
  const theta = n * angleDeg * Math.PI / 180;
  const r = scale * Math.sqrt(n);
  return [r * Math.cos(theta), r * Math.sin(theta)];
}`,
};

const PRESETS: { label: string; angle: number }[] = [
  { label: "1/2 (180°)",    angle: 180 },
  { label: "1/3 (120°)",    angle: 120 },
  { label: "Golden",        angle: GOLDEN_ANGLE },
  { label: "√2 (222.5°)",   angle: 222.492 },
  { label: "Silver (151°)", angle: 151.135 },
];

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

class Phyllotaxis extends Template {
  static t = "Phyllotaxis (golden angle)";
  static l = "phyllotaxis";
  static f = PhyllotaxisFormula;
  title = "Phyllotaxis (golden angle)";

  animationObject = PhyllotaxisFormula;

  // State
  angleDeg: number = GOLDEN_ANGLE;
  numSeeds: number = 500;
  seedRadius: number = 4;
  scale: number = 0;
  colorMode: "gradient" | "mono" = "gradient";
  showSpirals: boolean = false;
  animId: number = 0;

  // Rotation
  rotationAngleDeg: number = 0;
  rotateSpeed: number = 0.03; // degrees per frame — one full rotation ~3 min at 60fps

  // Auto mode: slowly sweeps the angle slider back and forth
  autoMode: boolean = true;
  autoPhase: number = 0;
  autoAngleSpeed: number = 0.0002; // radians per frame — imperceptible drift
  autoAngleRange: number = 2;     // ± degrees around golden angle

  // Snap animation (manual mode only)
  snapFrom: number = GOLDEN_ANGLE;
  snapTo: number = GOLDEN_ANGLE;
  snapT: number = 1;
  snapDuration: number = 60;

  // DOM refs
  controlsDiv: HTMLDivElement | null = null;
  infoPanel: HTMLDivElement | null = null;
  angleSlider: HTMLInputElement | null = null;
  angleDisp: HTMLSpanElement | null = null;
  cfDisp: HTMLSpanElement | null = null;
  modeBtn: HTMLButtonElement | null = null;
  rotateSlider: HTMLInputElement | null = null;
  rotateDisp: HTMLSpanElement | null = null;
  // All interactive controls except the mode toggle — disabled in auto mode
  otherControls: (HTMLInputElement | HTMLButtonElement)[] = [];

  // --- helpers ---

  computeScale() {
    return Math.min(this.halfWidth, this.halfHeight) * 0.88 / Math.sqrt(this.numSeeds);
  }

  continuedFraction(x: number, depth = 6): number[] {
    const terms: number[] = [];
    for (let i = 0; i < depth; i++) {
      const a = Math.floor(x);
      terms.push(a);
      const frac = x - a;
      if (frac < 1e-9) break;
      x = 1 / frac;
    }
    return terms;
  }

  cfString(angleDeg: number): string {
    const frac = (angleDeg / 360) % 1;
    if (frac < 1e-6) return "[0]";
    const terms = this.continuedFraction(frac);
    return "[" + terms.map((t, i) => (i === 0 ? "0" : "") + t).join("; ") + "]";
  }

  // --- spiral overlay (called inside rotated ctx) ---

  drawSpiralLines(ctx: CanvasRenderingContext2D) {
    const fibs: number[] = [1, 1];
    while (fibs[fibs.length - 1] < this.numSeeds) {
      const n = fibs.length;
      fibs.push(fibs[n - 1] + fibs[n - 2]);
    }
    let cwCount = 1, ccwCount = 1;
    for (let i = 0; i + 1 < fibs.length; i++) {
      if (fibs[i + 1] <= this.numSeeds) {
        cwCount = fibs[i];
        ccwCount = fibs[i + 1];
      } else break;
    }

    const drawFamily = (step: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      for (let i = 0; i + step < this.numSeeds; i++) {
        const [x0, y0] = phyllotaxisPoint(i,        this.angleDeg, this.scale);
        const [x1, y1] = phyllotaxisPoint(i + step, this.angleDeg, this.scale);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    };

    drawFamily(cwCount,  "rgba(100,220,255,0.35)");
    drawFamily(ccwCount, "rgba(255,180,80,0.35)");

    // Store counts for the text label drawn in screen space
    this._cwCount  = cwCount;
    this._ccwCount = ccwCount;
  }

  _cwCount  = 1;
  _ccwCount = 1;

  drawSpiralLabel(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#e0f0ff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(
      `Spirals: ${this._cwCount} CW (cyan)  ·  ${this._ccwCount} CCW (orange)  — both Fibonacci`,
      14,
      this.canvasHeight - 14
    );
  }

  // --- draw ---

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Apply rotation around canvas center
    ctx.save();
    ctx.translate(this.halfWidth, this.halfHeight);
    ctx.rotate(this.rotationAngleDeg * Math.PI / 180);

    if (this.showSpirals) this.drawSpiralLines(ctx);

    for (let n = 0; n < this.numSeeds; n++) {
      const [x, y] = phyllotaxisPoint(n, this.angleDeg, this.scale);

      let color: string;
      if (this.colorMode === "gradient") {
        const t = n / Math.max(1, this.numSeeds - 1);
        const hue = 30 + t * 200;
        const sat = 80 + t * 15;
        const lit = 45 + t * 25;
        color = `hsl(${hue},${sat}%,${lit}%)`;
      } else {
        color = "#f0e6c8";
      }

      ctx.beginPath();
      ctx.arc(x, y, this.seedRadius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }

    ctx.restore();

    // Spiral label in screen space (not rotated)
    if (this.showSpirals) this.drawSpiralLabel(ctx);
  }

  // --- snap animation (manual only) ---

  snapToGolden() {
    if (this.autoMode) return;
    this.snapFrom = this.angleDeg;
    this.snapTo   = GOLDEN_ANGLE;
    this.snapT    = 0;
  }

  // --- controls ---

  addControls() {
    if (!this.cont) return;
    (this.cont as HTMLElement).style.position = "relative";

    this.controlsDiv = document.createElement("div");
    this.controlsDiv.style.cssText =
      "position:absolute;top:8px;left:8px;display:flex;flex-wrap:wrap;" +
      "gap:6px;align-items:center;z-index:10;" +
      "background:rgba(8,8,14,0.94);color:#e6dcc8;" +
      "border:1px solid rgba(255,200,80,0.3);padding:6px 10px;" +
      "border-radius:6px;font-family:monospace;font-size:12px;max-width:calc(100% - 24px);";

    const makeBtn = (label: string, fn: () => void, highlight = false): HTMLButtonElement => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText =
        `padding:3px 8px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:12px;` +
        (highlight
          ? "border:1px solid rgba(255,200,80,0.7);background:rgba(255,200,80,0.2);color:#ffe090;"
          : "border:1px solid rgba(255,200,80,0.3);background:rgba(255,200,80,0.08);color:#e6dcc8;");
      b.addEventListener("click", fn);
      return b;
    };

    const makeSlider = (
      label: string,
      min: number, max: number, val: number, step: number,
      onChange: (v: number) => void,
      width = "90px"
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
      sl.style.width = width;
      const disp = document.createElement("span");
      disp.textContent = val.toFixed(2);
      disp.style.minWidth = "40px";
      sl.addEventListener("input", () => {
        const v = Number(sl.value);
        disp.textContent = v.toFixed(2);
        onChange(v);
      });
      wrap.appendChild(lbl);
      wrap.appendChild(sl);
      wrap.appendChild(disp);
      return { wrap, sl, disp };
    };

    // ---- Mode toggle (auto / manual) ----
    const applyMode = (isAuto: boolean) => {
      this.autoMode = isAuto;
      modeBtn.textContent = isAuto ? "mode: auto" : "mode: manual";
      modeBtn.style.border     = isAuto ? "1px solid rgba(100,255,160,0.7)" : "1px solid rgba(255,200,80,0.3)";
      modeBtn.style.background = isAuto ? "rgba(100,255,160,0.18)"          : "rgba(255,200,80,0.08)";
      modeBtn.style.color      = isAuto ? "#90ffb0"                         : "#e6dcc8";
      for (const el of this.otherControls) {
        el.disabled = isAuto;
        (el as HTMLElement).style.opacity = isAuto ? "0.35" : "1";
        (el as HTMLElement).style.cursor  = isAuto ? "not-allowed" : "";
        (el as HTMLElement).style.pointerEvents = isAuto ? "none" : "";
      }
    };

    const modeBtn = makeBtn("mode: auto", () => applyMode(!this.autoMode), false);
    modeBtn.style.border    = "1px solid rgba(100,255,160,0.7)";
    modeBtn.style.background = "rgba(100,255,160,0.18)";
    modeBtn.style.color     = "#90ffb0";
    this.modeBtn = modeBtn;
    this.controlsDiv.appendChild(modeBtn);

    // ---- Rotate speed slider ----
    const { wrap: rotWrap, sl: rotSl, disp: rotDisp } = makeSlider(
      "rotate", 0, MAX_ROTATE_SPEED, this.rotateSpeed, 0.05,
      (v) => { this.rotateSpeed = v; },
      "80px"
    );
    rotDisp.textContent = this.rotateSpeed.toFixed(2);
    this.rotateSlider = rotSl;
    this.rotateDisp   = rotDisp;
    this.otherControls.push(rotSl);
    this.controlsDiv.appendChild(rotWrap);

    // ---- Angle slider (hero control) ----
    const { wrap: angleWrap, sl: angleSl, disp: angleDisp } = makeSlider(
      "angle°", 0.1, 359.9, this.angleDeg, 0.001,
      (v) => {
        this.angleDeg = v;
        this.snapT = 1;
        if (this.cfDisp) this.cfDisp.textContent = this.cfString(v);
      },
      "90px"
    );
    angleDisp.style.minWidth = "52px";
    angleDisp.textContent = this.angleDeg.toFixed(3);
    this.angleSlider = angleSl;
    this.angleDisp   = angleDisp;
    this.otherControls.push(angleSl);
    this.controlsDiv.appendChild(angleWrap);

    // ---- Snap button ----
    const snapBtn = makeBtn("Snap to Golden", () => this.snapToGolden(), true);
    this.otherControls.push(snapBtn);
    this.controlsDiv.appendChild(snapBtn);

    // ---- Seeds slider ----
    const { wrap: seedsWrap, sl: seedsSl } = makeSlider(
      "seeds", 10, 1000, this.numSeeds, 10,
      (v) => { this.numSeeds = v; this.scale = this.computeScale(); }
    );
    this.otherControls.push(seedsSl);
    this.controlsDiv.appendChild(seedsWrap);

    // ---- Color toggle ----
    const colorBtn = makeBtn(
      this.colorMode === "gradient" ? "color: gradient" : "color: mono",
      () => {
        this.colorMode = this.colorMode === "gradient" ? "mono" : "gradient";
        colorBtn.textContent = this.colorMode === "gradient" ? "color: gradient" : "color: mono";
      }
    );
    this.otherControls.push(colorBtn);
    this.controlsDiv.appendChild(colorBtn);

    // ---- Spirals toggle ----
    const spiralBtn = makeBtn("spirals: off", () => {
      this.showSpirals = !this.showSpirals;
      spiralBtn.textContent = this.showSpirals ? "spirals: on" : "spirals: off";
    });
    this.otherControls.push(spiralBtn);
    this.controlsDiv.appendChild(spiralBtn);

    // ---- Presets row ----
    const presetsWrap = document.createElement("span");
    presetsWrap.style.cssText = "display:flex;align-items:center;gap:4px;flex-wrap:wrap;";
    const presetsLabel = document.createElement("span");
    presetsLabel.textContent = "preset:";
    presetsWrap.appendChild(presetsLabel);
    for (const p of PRESETS) {
      const pb = makeBtn(p.label, () => {
        this.angleDeg = p.angle;
        if (this.angleSlider) this.angleSlider.value = String(p.angle);
        if (this.angleDisp) this.angleDisp.textContent = p.angle.toFixed(3);
        if (this.cfDisp) this.cfDisp.textContent = this.cfString(p.angle);
        this.snapT = 1;
      });
      this.otherControls.push(pb);
      presetsWrap.appendChild(pb);
    }
    this.controlsDiv.appendChild(presetsWrap);

    // ---- ? explain ----
    const infoBtn = makeBtn("? explain", () => {
      this.infoPanel!.style.display =
        this.infoPanel!.style.display === "none" ? "block" : "none";
    });
    this.controlsDiv.appendChild(infoBtn);

    // Apply initial disabled state (auto mode is default)
    applyMode(this.autoMode);

    // ---- Continued-fraction readout ----
    const cfRow = document.createElement("div");
    cfRow.style.cssText =
      "width:100%;margin-top:4px;font-size:11px;color:#b0a080;" +
      "font-family:monospace;line-height:1.4;";
    const cfLabel = document.createElement("span");
    cfLabel.textContent = "1/φ continued fraction: ";
    this.cfDisp = document.createElement("span");
    this.cfDisp.style.color = "#ffe090";
    this.cfDisp.textContent = this.cfString(this.angleDeg);
    cfRow.appendChild(cfLabel);
    cfRow.appendChild(this.cfDisp);
    this.controlsDiv.appendChild(cfRow);

    // ---- Info panel ----
    this.infoPanel = document.createElement("div");
    this.infoPanel.style.cssText =
      "display:none;position:absolute;top:56px;left:8px;width:440px;max-height:72vh;overflow-y:auto;" +
      "background:#0c0c10;color:#e6dcc8;padding:16px;border-radius:8px;" +
      "font-family:monospace;font-size:12px;line-height:1.7;white-space:pre-wrap;" +
      "z-index:20;box-shadow:0 4px 24px rgba(0,0,0,0.75);border:1px solid rgba(255,200,80,0.25);";
    this.infoPanel.textContent = ELI5;

    const closeInfo = document.createElement("button");
    closeInfo.textContent = "✕";
    closeInfo.style.cssText =
      "position:absolute;top:8px;right:8px;background:none;border:none;" +
      "color:#e6dcc8;cursor:pointer;font-size:14px;";
    closeInfo.addEventListener("click", () => { this.infoPanel!.style.display = "none"; });
    this.infoPanel.appendChild(closeInfo);

    this.cont.appendChild(this.controlsDiv);
    this.cont.appendChild(this.infoPanel);
  }

  // --- lifecycle ---

  init() {
    this.scale = this.computeScale();
    this.addControls();
    this.animate();
  }

  animate = () => {
    if (this.autoMode) {
      // Auto: angle sweeps gently — no canvas rotation so speed slider stays honest in manual

      this.autoPhase += this.autoAngleSpeed;
      this.angleDeg = GOLDEN_ANGLE + Math.sin(this.autoPhase) * this.autoAngleRange;
      if (this.angleSlider) this.angleSlider.value = String(this.angleDeg);
      if (this.angleDisp) this.angleDisp.textContent = this.angleDeg.toFixed(3);
      if (this.cfDisp) this.cfDisp.textContent = this.cfString(this.angleDeg);
    } else {
      // Manual: canvas rotates at slider speed
      this.rotationAngleDeg = (this.rotationAngleDeg + this.rotateSpeed) % 360;

      if (this.snapT < 1) {
        // Snap-to-golden easing
        this.snapT = Math.min(1, this.snapT + 1 / this.snapDuration);
        const eased = easeInOut(this.snapT);
        this.angleDeg = this.snapFrom + (this.snapTo - this.snapFrom) * eased;
        if (this.angleSlider) this.angleSlider.value = String(this.angleDeg);
        if (this.angleDisp) this.angleDisp.textContent = this.angleDeg.toFixed(3);
        if (this.cfDisp) this.cfDisp.textContent = this.cfString(this.angleDeg);
      }
    }

    this.draw();
    this.animId = requestAnimationFrame(this.animate);
  };

  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth  = this.canvasWidth / 2;
    this.scale = this.computeScale();
  };

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.controlsDiv?.parentNode) this.controlsDiv.parentNode.removeChild(this.controlsDiv);
    if (this.infoPanel?.parentNode)  this.infoPanel.parentNode.removeChild(this.infoPanel);
    super.stop();
  }
}

export default Phyllotaxis;
