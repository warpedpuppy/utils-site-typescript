import AnimationBaseClass from "../AnimationBaseClass";
import { FindPointAroundCircle } from "../../formulas/animation/FindPointAroundCircle";
import { SphereLighting } from "../../formulas/animation/OrbitalMotion";

class OrbitalMotionAnimation extends AnimationBaseClass {
  static t = "ball orbiting a sun";
  static l = "ball-orbiting-a-sun";
  static f = SphereLighting;
  title = "ball orbiting a sun";
  animationObject = SphereLighting;

  pct: number = 0;
  sunRadius: number = 60;
  orbiterRadius: number = 22;
  orbitRadius: number = 180;

  init() {
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const cx = this.halfWidth;
    const cy = this.halfHeight;

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // faint orbit path
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.arc(cx, cy, this.orbitRadius, 0, Math.PI * 2);
    ctx.stroke();

    // sun
    const sunGr = ctx.createRadialGradient(
      cx - this.sunRadius * 0.3, cy - this.sunRadius * 0.3, 0,
      cx, cy, this.sunRadius
    );
    sunGr.addColorStop(0,    "#fff7a1");
    sunGr.addColorStop(0.35, "#fde047");
    sunGr.addColorStop(0.75, "#f97316");
    sunGr.addColorStop(1,    "#7c2d12");
    ctx.fillStyle = sunGr;
    ctx.beginPath();
    ctx.arc(cx, cy, this.sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // corona glow
    const coronaGr = ctx.createRadialGradient(
      cx, cy, this.sunRadius * 0.9,
      cx, cy, this.sunRadius * 1.6
    );
    coronaGr.addColorStop(0, "rgba(251,191,36,0.35)");
    coronaGr.addColorStop(1, "rgba(251,191,36,0)");
    ctx.fillStyle = coronaGr;
    ctx.beginPath();
    ctx.arc(cx, cy, this.sunRadius * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // orbiter position — reuses the existing FindPointAroundCircle formula
    const { x: ox, y: oy } = FindPointAroundCircle.keyFunction(
      { x: cx, y: cy },
      this.orbitRadius,
      this.pct
    );

    // highlight position — the new SphereLighting formula does the real work
    const highlight = SphereLighting.keyFunction(
      { x: ox, y: oy, radius: this.orbiterRadius },
      { x: cx, y: cy }
    );

    const orbGr = ctx.createRadialGradient(
      highlight.x, highlight.y, 0,
      ox, oy, this.orbiterRadius
    );
    orbGr.addColorStop(0,    "#bfdbfe");
    orbGr.addColorStop(0.45, "#3b82f6");
    orbGr.addColorStop(1,    "#1e1b4b");

    ctx.fillStyle = orbGr;
    ctx.beginPath();
    ctx.arc(ox, oy, this.orbiterRadius, 0, Math.PI * 2);
    ctx.fill();

    this.pct = (this.pct + 0.15) % 100;
    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}

export default OrbitalMotionAnimation;
