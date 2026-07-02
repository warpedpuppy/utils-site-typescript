import AnimationBaseClass from "./AnimationBaseClass";
import { findPointAroundCircle } from "@utilspalooza/core/FindPointAroundCircle";
import { SphereLighting } from "../pages/createJSON/formulas/animation/OrbitalMotion";

// SphereLighting calculates the highlight position on a sphere given the orbiter and light source positions
// (Implementation moved to formulas/animation/OrbitalMotion.ts to satisfy CollisionDetectionObject interface)

const ELI5 = `<h3>The orbit and the lighting are two different jobs.</h3>
<p><b>sphereLighting</b> does not move the planet. It only finds where the bright
spot should sit on the orbiting ball, based on the sun's position.</p>
<p>The circular motion comes from
<a href="/examples/find-points-on-a-circle"><b>findPointAroundCircle</b></a>,
which returns the x/y point for the ball at each percentage around the orbit.</p>`;

function drawOrbitalMotion(
  ctx: any,
  canvasWidth: any,
  canvasHeight: any,
  pct: number,
  sunRadius: number,
  orbiterRadius: number,
  orbitRadius: number,
  findPointAroundCircleFn: (
    centerPoint: { x: number; y: number },
    radius: number,
    currentPoint: number
  ) => { x: number; y: number },
  sphereLightingFn: (
    orbiter: { x: number; y: number; radius: number },
    lightSource: { x: number; y: number }
  ) => { x: number; y: number }
): void {
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // faint orbit path
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
  ctx.stroke();

  // sun
  const sunGr = ctx.createRadialGradient(
    cx - sunRadius * 0.3,
    cy - sunRadius * 0.3,
    0,
    cx,
    cy,
    sunRadius
  );
  sunGr.addColorStop(0, "#fff7a1");
  sunGr.addColorStop(0.35, "#fde047");
  sunGr.addColorStop(0.75, "#f97316");
  sunGr.addColorStop(1, "#7c2d12");
  ctx.fillStyle = sunGr;
  ctx.beginPath();
  ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // corona glow
  const coronaGr = ctx.createRadialGradient(
    cx,
    cy,
    sunRadius * 0.9,
    cx,
    cy,
    sunRadius * 1.6
  );
  coronaGr.addColorStop(0, "rgba(251,191,36,0.35)");
  coronaGr.addColorStop(1, "rgba(251,191,36,0)");
  ctx.fillStyle = coronaGr;
  ctx.beginPath();
  ctx.arc(cx, cy, sunRadius * 1.6, 0, Math.PI * 2);
  ctx.fill();

  // orbiter position — reuses the existing findPointAroundCircle formula
  const { x: ox, y: oy } = findPointAroundCircleFn(
    { x: cx, y: cy },
    orbitRadius,
    pct
  );

  // highlight position — the new SphereLighting formula does the real work
  const highlight = sphereLightingFn(
    { x: ox, y: oy, radius: orbiterRadius },
    { x: cx, y: cy }
  );

  const orbGr = ctx.createRadialGradient(
    highlight.x,
    highlight.y,
    0,
    ox,
    oy,
    orbiterRadius
  );
  orbGr.addColorStop(0, "#bfdbfe");
  orbGr.addColorStop(0.45, "#3b82f6");
  orbGr.addColorStop(1, "#1e1b4b");

  ctx.fillStyle = orbGr;
  ctx.beginPath();
  ctx.arc(ox, oy, orbiterRadius, 0, Math.PI * 2);
  ctx.fill();
}

export { drawOrbitalMotion };

export default class OrbitalMotionAnimation extends AnimationBaseClass {
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
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    drawOrbitalMotion(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.pct,
      this.sunRadius,
      this.orbiterRadius,
      this.orbitRadius,
      findPointAroundCircle,
      SphereLighting.keyFunction as (
        orbiter: { x: number; y: number; radius: number },
        lightSource: { x: number; y: number }
      ) => { x: number; y: number }
    );
    this.pct = (this.pct + 0.15) % 100;
    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}
