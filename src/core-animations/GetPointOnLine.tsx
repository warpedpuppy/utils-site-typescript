import { Point } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { getPointOnLine as GetPointOnLineFunc } from "@utilspalooza/core/GetPointOnLine";
import { GetPointOnLine as getPointOnLineFormula } from "../pages/createJSON/formulas/animation/GetPointOnLine";

const T_MIN = -0.4;
const T_MAX = 1.4;

function drawGetPointOnLine(
  ctx: any,
  startPoint: Point,
  endPoint: Point,
  t: number,
  getPointOnLineFn: (
    startPoint: Point,
    endPoint: Point,
    percentage: number
  ) => Point
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // dashed extension line — the part of the lerp that lives OUTSIDE [0,1]
  const extStart = getPointOnLineFn(startPoint, endPoint, T_MIN);
  const extEnd = getPointOnLineFn(startPoint, endPoint, T_MAX);
  ctx.save();
  ctx.setLineDash([6, 8]);
  ctx.strokeStyle = "rgba(244,114,182,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(extStart.x, extStart.y);
  ctx.lineTo(extEnd.x, extEnd.y);
  ctx.stroke();
  ctx.restore();

  // the actual segment A → B (t in [0,1])
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();

  // evenly-spaced tick ghosts so the subdivision is visible
  [0, 0.25, 0.5, 0.75, 1].forEach((tick) => {
    const p = getPointOnLineFn(startPoint, endPoint, tick);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
  });

  // endpoint handles
  ([
    [startPoint, "A"],
    [endPoint, "B"],
  ] as Array<[Point, string]>).forEach(([p, label]) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 9, 0, 2 * Math.PI);
    ctx.fillStyle = "#818cf8";
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(label, p.x + 12, p.y - 12);
  });

  // the moving marker — orange on the segment, pink when extrapolating
  const point: Point = getPointOnLineFn(startPoint, endPoint, t);
  const extrapolating = t < 0 || t > 1;
  ctx.fillStyle = extrapolating ? "#f472b6" : "#f97316";
  ctx.beginPath();
  ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`t = ${t.toFixed(2)}`, point.x + 12, point.y + 4);
}

export { drawGetPointOnLine };

export default class GetPointOnLineAnimation extends AnimationBaseClass {
  static t = "get a point on a line";
  static l = "get-a-point-on-a-line";
  static f = getPointOnLineFormula;
  title = "get a point on a line";
  animationObject = getPointOnLineFormula;
  perc: number = 0.5;
  dragging: "start" | "end" | null = null;
  private grabRadius = 18;

  init() {
    this.startPoint = { x: this.halfWidth - 140, y: this.halfHeight + 90 };
    this.endPoint = { x: this.halfWidth + 140, y: this.halfHeight - 90 };
    this.draw();
  }

  extraHTML = () => {
    return (
      <div className="extra-html">
        <label style={{ marginRight: 10 }}>t (fraction along the line):</label>
        <input
          type="range"
          min={T_MIN}
          max={T_MAX}
          step="0.01"
          defaultValue={this.perc}
          style={{ verticalAlign: "middle", width: 200 }}
          onChange={(e) => {
            this.perc = +e.currentTarget.value;
          }}
        />
        <span style={{ marginLeft: 8, opacity: 0.7, fontSize: "0.85rem" }}>
          0 = A · 1 = B · outside [0,1] extrapolates
        </span>
      </div>
    );
  };

  draw = () => {
    if (!this.ctx || !this.canvas || !this.startPoint || !this.endPoint) return;
    drawGetPointOnLine(
      this.ctx,
      this.startPoint,
      this.endPoint,
      this.perc,
      GetPointOnLineFunc
    );

    if (this.textDiv) {
      const a = this.startPoint;
      const b = this.endPoint;
      const p = GetPointOnLineFunc(a, b, this.perc);
      this.textDiv.innerHTML = `
        <p>Drag endpoints <strong>A</strong> and <strong>B</strong>, and the
        <strong>t</strong> slider. It's just lerp on each axis:</p>
        <p style="font-family:monospace">
          x = ${Math.round(a.x)} + (${Math.round(b.x)} − ${Math.round(a.x)}) · ${this.perc.toFixed(2)}
          = <strong>${Math.round(p.x)}</strong><br/>
          y = ${Math.round(a.y)} + (${Math.round(b.y)} − ${Math.round(a.y)}) · ${this.perc.toFixed(2)}
          = <strong>${Math.round(p.y)}</strong>
        </p>`;
    }

    this.raf(this.draw);
  };

  private dist(p: Point, x: number, y: number): number {
    return Math.hypot(p.x - x, p.y - y);
  }

  pointerDownHandler(e: PointerEvent) {
    if (!this.startPoint || !this.endPoint) return;
    const mx = e.pageX - this.left;
    const my = e.pageY - this.top;
    const dStart = this.dist(this.startPoint, mx, my);
    const dEnd = this.dist(this.endPoint, mx, my);

    if (dStart <= this.grabRadius && dStart <= dEnd) {
      this.dragging = "start";
    } else if (dEnd <= this.grabRadius) {
      this.dragging = "end";
    } else {
      this.dragging = null;
    }
  }

  pointerMoveHandler(e: PointerEvent) {
    if (!this.dragging) return;
    const p = {
      x: Math.floor(e.pageX - this.left),
      y: Math.floor(e.pageY - this.top),
    };
    if (this.dragging === "start") this.startPoint = p;
    else this.endPoint = p;
  }

  pointerUpHandler(_e: PointerEvent) {
    this.dragging = null;
  }
}
