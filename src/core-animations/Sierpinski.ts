import Template from "./animationTemplate";
import type { Point } from "../types/types";
import { CollisionDetectionObject } from "../types/types";

/*
 * Sierpinski Triangle — an infinitely-zooming Sierpinski gasket.
 *
 * Ported from the pure-Canvas-2D version in utils-site-javascript
 * (effects/sierpinski-purejs.js), itself the improved rewrite of the old
 * Pixi.Graphics original from the warpedpuppies portfolio.
 *
 * THE IMPROVEMENT (carried over from the purejs version): the figure zooms
 * forever without a hard reset. The trick is locking two growth rates together —
 * see expandIncrease below. The original (expandIncrease 1.006) made each new
 * center triangle slightly smaller than the last, so the center shrank to a point
 * and needed a periodic reset; this one is a stable infinite zoom.
 */

const ELI5 = `△ Sierpinski Triangle — a shape made of smaller copies of itself.

Take a triangle. Mark the midpoint of each side and connect those three
midpoints — that carves out a smaller upside-down triangle in the middle and
leaves three corner triangles. Now do the same thing to each of those. Forever.

That's a FRACTAL: the same rule applied at every scale, so any piece, zoomed in,
looks like the whole. Here we lean into that self-similarity by zooming in
continuously. Each frame the whole figure grows a little, and whenever a triangle
gets big enough it spawns its medial (midpoint) triangle — half the size, rotated
60°. Because the growth rate and the spawn rate are locked together, a freshly
spawned triangle reappears at exactly the size the previous innermost one had, so
the zoom never bottoms out and never resets. You're falling into the gasket.`;

/**
 * sierpinskiMidpoints — the heart of the fractal: given an equilateral triangle
 * of circumradius `radius` at orientation `phase` (radians), return the midpoints
 * of its three edges. Connecting these midpoints is the Sierpinski subdivision
 * step, and each midpoint triangle is the next, half-size generation.
 * Self-contained (no imports referenced) so a CodePen can embed it via .toString().
 */
export function sierpinskiMidpoints(radius: number, phase: number): Point[] {
  const TAU = 2 * Math.PI;
  const vertex = (k: number): Point => ({
    x: radius * Math.cos(phase + (k * TAU) / 3),
    y: radius * Math.sin(phase + (k * TAU) / 3),
  });
  const v1 = vertex(0);
  const v2 = vertex(1);
  const v3 = vertex(2);
  return [
    { x: (v1.x + v2.x) / 2, y: (v1.y + v2.y) / 2 },
    { x: (v2.x + v3.x) / 2, y: (v2.y + v3.y) / 2 },
    { x: (v1.x + v3.x) / 2, y: (v1.y + v3.y) / 2 },
  ];
}

const SierpinskiFormula: CollisionDetectionObject = {
  keyFunction: sierpinskiMidpoints,
  dependencies: [],
  functionString: `// The subdivision step: midpoints of an equilateral triangle's
// three edges. Connect them and you've drawn the next generation.
function sierpinskiMidpoints(radius, phase) {
  const TAU = 2 * Math.PI;
  const vertex = (k) => ({
    x: radius * Math.cos(phase + (k * TAU) / 3),
    y: radius * Math.sin(phase + (k * TAU) / 3),
  });
  const v1 = vertex(0), v2 = vertex(1), v3 = vertex(2);
  return [
    { x: (v1.x + v2.x) / 2, y: (v1.y + v2.y) / 2 },
    { x: (v2.x + v3.x) / 2, y: (v2.y + v3.y) / 2 },
    { x: (v1.x + v3.x) / 2, y: (v1.y + v3.y) / 2 },
  ];
}`,
};

interface Tri {
  radius: number;
  phase: number;
  ratio: number; // 0→1 "draw-in" progress of this triangle's edges
  hasSpawned: boolean;
}

/**
 * Step and render one frame of the infinite-zoom Sierpinski animation.
 * Mutates `state` in place. Embed `sierpinskiMidpoints.toString()` in the
 * same scope before calling this from a CodePen.
 */
export function drawSierpinski(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: { triangles: Tri[]; rotation: number }
): void {
  const ratioIncrease = 0.01;
  const expandIncrease = Math.pow(2, ratioIncrease);
  const threshold = Math.max(width, height) * 2;

  state.rotation += 0.01;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(state.rotation);

  for (const t of state.triangles) {
    t.radius *= expandIncrease;
    const [m1, m2, m3] = sierpinskiMidpoints(t.radius, t.phase);
    ctx.fillStyle = '#ffffff';
    for (const pt of [m1, m2, m3]) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#ffd900';
    ctx.lineWidth = 1;
    const drawEdge = (a: Point, b: Point) => {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x + t.ratio * (b.x - a.x), a.y + t.ratio * (b.y - a.y));
      ctx.stroke();
    };
    drawEdge(m1, m2);
    drawEdge(m2, m3);
    drawEdge(m3, m1);
    if (t.ratio < 1) {
      t.ratio = Math.min(1, t.ratio + ratioIncrease);
    } else if (!t.hasSpawned && t.radius / 2 >= 1) {
      t.hasSpawned = true;
      state.triangles.push({ radius: t.radius / 2, phase: t.phase + Math.PI / 3, ratio: 0, hasSpawned: false });
    }
  }
  state.triangles = state.triangles.filter(t => t.radius <= threshold);

  ctx.restore();
}

class Sierpinski extends Template {
  static t = "Sierpinski Triangle";
  static l = "sierpinski";
  static f = SierpinskiFormula;
  title = "Sierpinski Triangle";

  animationObject = SierpinskiFormula;
  animId = 0;

  ratioIncrease = 0.01;
  // INVARIANT: in the time one triangle "draws in" (1 / ratioIncrease frames) the
  // whole figure must grow by exactly 2×, so a child — spawned at half its parent's
  // radius — reappears at the SAME size the previous innermost had. Locking the two
  // rates together gives a stable infinite zoom with no hard reset.
  expandIncrease = Math.pow(2, this.ratioIncrease); // 2 ** 0.01 ≈ 1.00696
  rotation = 0;
  triangles: Tri[] = [];

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    if (!this.ctx) return;
    this.rotation = 0;
    this.triangles = [
      { radius: this.canvasHeight / 4, phase: 0, ratio: 0, hasSpawned: false },
    ];
    this.animate();
  }

  animate = () => {
    if (!this.ctx) return;
    const ctx = this.ctx;
    this.rotation += 0.01;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.save();
    ctx.translate(this.halfWidth, this.halfHeight);
    ctx.rotate(this.rotation);
    this.update(ctx);
    ctx.restore();
    this.animId = this.raf(this.animate);
  };

  update(ctx: CanvasRenderingContext2D) {
    const threshold = Math.max(this.canvasWidth, this.canvasHeight) * 2;

    for (const t of this.triangles) {
      t.radius *= this.expandIncrease;
      this.drawTriangle(ctx, t);
      if (t.ratio < 1) {
        t.ratio = Math.min(1, t.ratio + this.ratioIncrease);
      } else if (!t.hasSpawned && t.radius / 2 >= 1) {
        // The child's vertices land exactly on this triangle's edge midpoints:
        // the medial triangle is rotated π/3 and has half the circumradius.
        t.hasSpawned = true;
        this.triangles.push({
          radius: t.radius / 2,
          phase: t.phase + Math.PI / 3,
          ratio: 0,
          hasSpawned: false,
        });
      }
    }

    this.triangles = this.triangles.filter((t) => t.radius <= threshold);
  }

  drawTriangle(ctx: CanvasRenderingContext2D, t: Tri) {
    const [m1, m2, m3] = sierpinskiMidpoints(t.radius, t.phase);

    ctx.fillStyle = "#ffffff";
    for (const pt of [m1, m2, m3]) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    this.drawLine(ctx, m1, m2, t.ratio);
    this.drawLine(ctx, m2, m3, t.ratio);
    this.drawLine(ctx, m3, m1, t.ratio);
  }

  drawLine(ctx: CanvasRenderingContext2D, a: Point, b: Point, ratio: number) {
    ctx.beginPath();
    ctx.strokeStyle = "#ffd900";
    ctx.lineWidth = 1;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(a.x + ratio * (b.x - a.x), a.y + ratio * (b.y - a.y));
    ctx.stroke();
  }

  stop() {
    cancelAnimationFrame(this.animId);
    super.stop();
  }
}

export default Sierpinski;
