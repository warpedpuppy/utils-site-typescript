import Template from "./animationTemplate";
import { Flock } from "@utilspalooza/core/Boids";
import type { Vector } from "@utilspalooza/core/types";
import { BoidsObject } from "../pages/createJSON/formulas/animation/Boids";

/*
 * Murmuration (flocking starlings) — a real boids flock.
 *
 * Ported from the warpedpuppies portfolio "pretty little things". The original
 * (Murmuration.js / Starlings.js) was not actually boids: every bird chased one
 * shared point plus random jitter and never looked at its neighbors. This version
 * uses Craig Reynolds' genuine boids model (separation / alignment / cohesion) —
 * the simulation lives in the pure, publishable `@utilspalooza/core` `Flock` class;
 * this file only owns the canvas, the rAF loop, and the drawing.
 *
 * CREDIT: flocking algorithm is Craig W. Reynolds' "boids" (1986; "Flocks, Herds,
 * and Schools", SIGGRAPH '87). See packages/core/src/Boids.ts.
 */

const ELI5 = `🐦 Murmuration — how do thousands of starlings swirl as one, with no leader?

They don't follow a leader, and nothing choreographs the flock. Each bird obeys
just THREE simple rules, looking only at the handful of neighbors near it:

  1. SEPARATION — don't crowd: steer away from neighbors that get too close.
  2. ALIGNMENT  — go with the flow: steer toward the average heading of neighbors.
  3. COHESION   — stay together: steer toward the average position of neighbors.

Every bird does only that, every frame. The hypnotic, wheeling murmuration you see
is EMERGENT — it appears from hundreds of birds each following local rules, not from
any global plan. That's the whole lesson: complex group behavior from simple local
behavior.

This is Craig Reynolds' "boids" model (1986) — the same idea behind flocks, schools,
and crowds in films and games. The math (separation·alignment·cohesion steering) is
the pure boidsStep / Flock in @utilspalooza/core; this page just draws it.`;

/**
 * drawBird — self-contained: draw one bird as a small triangle pointing along its
 * heading. Kept dependency-free so it can be embedded in a CodePen via .toString().
 */
export function drawBird(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.6, size * 0.5);
  ctx.lineTo(-size * 0.6, -size * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

class Murmuration extends Template {
  static t = "Murmuration (flocking starlings)";
  static l = "murmuration";
  static f = BoidsObject;
  title = "Murmuration (flocking starlings)";

  animationObject = BoidsObject;
  animId = 0;

  flock: Flock | null = null;
  count = 260;
  frame = 0;

  // A slowly wandering "roost" the flock gently drifts toward — gives the whole
  // group somewhere to wheel around. Frame-based, no clock (purity rule).
  target: Vector = { x: 0, y: 0 };
  goal: Vector = { x: 0, y: 0 };
  repickEvery = 160; // frames between new wander goals

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    if (!this.ctx) return;

    this.target = { x: this.halfWidth, y: this.halfHeight };
    this.goal = this.pickGoal();

    this.flock = new Flock(
      this.count,
      { width: this.canvasWidth, height: this.canvasHeight },
      {
        perceptionRadius: 60,
        separationRadius: 28,
        maxSpeed: 3.6,
        maxForce: 0.08,
        separationWeight: 1.7,
        alignmentWeight: 1.0,
        cohesionWeight: 0.9,
        targetWeight: 0.35,
      }
    );

    // Paint the backdrop once; the loop fades it instead of hard-clearing, leaving
    // motion trails that read as the smear of a real murmuration.
    this.ctx.fillStyle = "#0a0a12";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.animate();
  }

  pickGoal(): Vector {
    // Keep the goal off the edges so the flock wheels in open space.
    const margin = 0.2;
    return {
      x: this.canvasWidth * (margin + Math.random() * (1 - 2 * margin)),
      y: this.canvasHeight * (margin + Math.random() * (1 - 2 * margin)),
    };
  }

  animate = () => {
    if (!this.ctx || !this.flock) return;
    const ctx = this.ctx;
    this.frame++;

    // Wander the roost: ease the live target toward the goal, repick periodically.
    if (this.frame % this.repickEvery === 0) this.goal = this.pickGoal();
    this.target.x += (this.goal.x - this.target.x) * 0.02;
    this.target.y += (this.goal.y - this.target.y) * 0.02;

    this.flock.step(this.target);

    // Trailing fade instead of clearRect.
    ctx.fillStyle = "rgba(10, 10, 18, 0.22)";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    ctx.fillStyle = "rgba(220, 228, 245, 0.9)";
    for (const b of this.flock.boids) {
      const angle = Math.atan2(b.velocity.y, b.velocity.x);
      drawBird(ctx, b.position.x, b.position.y, angle, 4);
    }

    this.animId = requestAnimationFrame(this.animate);
  };

  resizeHandler = () => {
    if (!this.canvas || !this.ctx || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.cont.clientHeight / 2;
    this.halfWidth = this.cont.clientWidth / 2;
    const { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    if (this.flock) this.flock.bounds = { width: this.canvasWidth, height: this.canvasHeight };
    this.ctx.fillStyle = "#0a0a12";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  };

  stop() {
    cancelAnimationFrame(this.animId);
    this.flock = null;
    super.stop();
  }
}

export default Murmuration;
