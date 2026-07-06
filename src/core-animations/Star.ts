import { Point } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { starVertices } from "@utilspalooza/core/Star";
import { StarObject as starFormula } from "../pages/createJSON/formulas/animation/Star";

function drawStar(ctx: CanvasRenderingContext2D, star: { vertices: Point[] }, halfWidth: number, halfHeight: number): void {
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  star.vertices.forEach((vertex: Point, i: number) => {
    if (i === 0) {
      ctx.moveTo(halfWidth + vertex.x, halfHeight + vertex.y);
    } else {
      ctx.lineTo(halfWidth + vertex.x, halfHeight + vertex.y);
    }
  });
  ctx.closePath();
  ctx.stroke();
}

export { drawStar };

export default class StarAnimation extends AnimationBaseClass {
  static t = "draw star";
  static l = "draw-star";
  static f = starFormula;
  title = "draw star";
  animationObject = starFormula;
  star: { vertices: Point[] } = { vertices: [] };

  spikes = 5;
  angle = -Math.PI / 2; // first tip points straight up
  outerRadius = 160;
  innerRadius = 70;
  dragging: "outer" | "inner" | null = null;
  private grabRadius = 20;

  init() {
    if (this.textDiv)
      this.textDiv.innerHTML = `<h3>Drag the handles to reshape the star</h3>
        <p>Drag the <strong>outer</strong> handle to resize &amp; spin the star;
        drag the <strong>inner</strong> handle to change the inner radius.
        A star is just vertices alternating between an outer and an inner radius.</p>
        <p><strong>Why know this?</strong> Placing points at evenly-spaced angles
        (<code>cos</code>/<code>sin</code> around a center) is the workhorse behind a
        huge amount of animation: stars, gears, sparkles, asteroids, explosion bursts,
        loading spinners, radial menus. Once you can put N points on a circle at the
        right angle and radius, you can build any of them — and because every vertex is
        plain math, you can tween the radii, spin the angle, or morph the spike count
        over time for free.</p>`;
    this.draw();
  }

  private get step(): number {
    return Math.PI / this.spikes;
  }

  private outerHandle(): Point {
    return {
      x: this.halfWidth + Math.cos(this.angle) * this.outerRadius,
      y: this.halfHeight + Math.sin(this.angle) * this.outerRadius,
    };
  }

  private innerHandle(): Point {
    const a = this.angle + this.step;
    return {
      x: this.halfWidth + Math.cos(a) * this.innerRadius,
      y: this.halfHeight + Math.sin(a) * this.innerRadius,
    };
  }

  private drawGuides() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // faint guide circles for each radius
    ctx.strokeStyle = "rgba(129,140,248,0.25)";
    ctx.lineWidth = 1;
    [this.outerRadius, this.innerRadius].forEach((r) => {
      ctx.beginPath();
      ctx.arc(this.halfWidth, this.halfHeight, r, 0, 2 * Math.PI);
      ctx.stroke();
    });

    const handles: Array<[Point, string]> = [
      [this.outerHandle(), "#818cf8"],
      [this.innerHandle(), "#f472b6"],
    ];
    handles.forEach(([p, color]) => {
      ctx.beginPath();
      ctx.moveTo(this.halfWidth, this.halfHeight);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    });
  }

  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.star = starVertices(
      this.spikes,
      this.innerRadius,
      this.outerRadius,
      this.angle
    );

    drawStar(this.ctx, this.star, this.halfWidth, this.halfHeight);
    this.drawGuides();
  };

  private dist(p: Point, x: number, y: number): number {
    return Math.hypot(p.x - x, p.y - y);
  }

  keyFunction() {}

  pointerDownHandler(e: PointerEvent) {
    const mx = e.pageX - this.left;
    const my = e.pageY - this.top;
    const dOuter = this.dist(this.outerHandle(), mx, my);
    const dInner = this.dist(this.innerHandle(), mx, my);

    if (dOuter <= this.grabRadius && dOuter <= dInner) {
      this.dragging = "outer";
    } else if (dInner <= this.grabRadius) {
      this.dragging = "inner";
    } else {
      this.dragging = null;
    }
  }

  pointerMoveHandler(e: PointerEvent) {
    if (!this.dragging) return;
    const dx = e.pageX - this.left - this.halfWidth;
    const dy = e.pageY - this.top - this.halfHeight;
    const r = Math.hypot(dx, dy);

    if (this.dragging === "outer") {
      this.outerRadius = Math.max(r, this.innerRadius + 10);
      this.angle = Math.atan2(dy, dx);
    } else {
      this.innerRadius = Math.min(Math.max(r, 5), this.outerRadius - 10);
    }
    this.draw();
  }

  pointerUpHandler(_e: PointerEvent) {
    this.dragging = null;
  }
}
