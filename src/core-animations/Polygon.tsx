import { Point } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { createRect as Rectangle } from "@utilspalooza/core/Rectangle";
import { RectangleObject as rectangleFormula } from "../pages/createJSON/formulas/animation/Rectangle";

function drawPolygon(ctx: CanvasRenderingContext2D, rect: { vertices: Point[] }, halfWidth: number, halfHeight: number): void {
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  rect.vertices.forEach((corner: Point, i: number) => {
    let { x, y } = corner;
    x += halfWidth;
    y += halfHeight;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.stroke();
}

export { drawPolygon };

export default class PolygonAnimation extends AnimationBaseClass {
  static t = "draw rectangle (using trig, not rect())";
  static l = "draw-rectangle";
  static f = rectangleFormula;
  title = "draw rectangle";
  animationObject = rectangleFormula;
  rect: { vertices: Point[] } = { vertices: [] };

  width = 280;
  height = 160;
  angle = 0;
  dragging: "width" | "height" | null = null;
  private grabRadius = 20;

  init() {
    this.draw();
    if (this.textDiv)
      this.textDiv.innerHTML = `
        <h3>Drag the handles to reshape the rectangle</h3>
        <p>Drag the <strong>width</strong> handle to resize &amp; rotate; drag the
        <strong>height</strong> handle to set the height. By computing the corners with
        cos/sin instead of <code>rect()</code>, the shape stays a true polygon you can
        rotate and run collision detection against.</p>
        <p><strong>Why know this?</strong> <code>ctx.rect()</code> can only draw an
        axis-aligned box — it can't rotate, and it gives you no actual corner points.
        The moment you want a tilted card, a swinging platform, a rotating hitbox, or
        any shape you can test for collisions, you need the four corners as real
        coordinates. Computing them from width, height, and angle is the same trick
        that powers sprite rotation and oriented bounding-box (OBB) collision — learn
        it once and rotated rectangles stop being scary.</p>`;
  }

  private widthHandle(): Point {
    return {
      x: this.halfWidth + Math.cos(this.angle) * (this.width / 2),
      y: this.halfHeight + Math.sin(this.angle) * (this.width / 2),
    };
  }

  private heightHandle(): Point {
    const a = this.angle + Math.PI / 2;
    return {
      x: this.halfWidth + Math.cos(a) * (this.height / 2),
      y: this.halfHeight + Math.sin(a) * (this.height / 2),
    };
  }

  private drawGuides() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    const handles: Array<[Point, string]> = [
      [this.widthHandle(), "#818cf8"],
      [this.heightHandle(), "#f472b6"],
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

    this.rect = Rectangle(this.width, this.height, this.angle);

    drawPolygon(this.ctx, this.rect, this.halfWidth, this.halfHeight);
    this.drawGuides();
  };

  private dist(p: Point, x: number, y: number): number {
    return Math.hypot(p.x - x, p.y - y);
  }

  keyFunction() {}

  pointerDownHandler(e: PointerEvent) {
    const mx = e.pageX - this.left;
    const my = e.pageY - this.top;
    const dWidth = this.dist(this.widthHandle(), mx, my);
    const dHeight = this.dist(this.heightHandle(), mx, my);

    if (dWidth <= this.grabRadius && dWidth <= dHeight) {
      this.dragging = "width";
    } else if (dHeight <= this.grabRadius) {
      this.dragging = "height";
    } else {
      this.dragging = null;
    }
  }

  pointerMoveHandler(e: PointerEvent) {
    if (!this.dragging) return;
    const dx = e.pageX - this.left - this.halfWidth;
    const dy = e.pageY - this.top - this.halfHeight;

    if (this.dragging === "width") {
      this.width = Math.max(2 * Math.hypot(dx, dy), 20);
      this.angle = Math.atan2(dy, dx);
    } else {
      // project the pointer onto the rectangle's height axis so the handle
      // slides along that axis without rotating the shape
      const ax = Math.cos(this.angle + Math.PI / 2);
      const ay = Math.sin(this.angle + Math.PI / 2);
      const proj = dx * ax + dy * ay;
      this.height = Math.max(2 * Math.abs(proj), 20);
    }
    this.draw();
  }

  pointerUpHandler(_e: PointerEvent) {
    this.dragging = null;
  }
}
