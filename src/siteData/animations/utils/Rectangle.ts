import { GenericObject, Point, Polygon } from "../../../types/types";
import { getAtan2, distanceBetweenTwoPoints } from "./OmnibusUtils";
class Rectangle {
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  angle: number = 0;
  rotate: boolean = false;
  id: string = "";
  drag: boolean = false;
  vertices: any[] = [];
  rot: number = 0;
  step: number = 0;
  rect: Polygon = { vertices: [], draw: () => {}, drag: false };
  options: GenericObject = {};
  constructor(
    width: number,
    height: number,
    angle: number = 0,
    ctx: any,
    rotate: boolean = false,
    id: string = "",
    options: object
  ) {
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.ctx = ctx;
    this.rotate = rotate;
    this.id = id;
    this.rot = (Math.PI / 2) * 3; // start at 270 degrees
    this.angle *= Math.PI / 180;
    this.options = options;
  }
  returnRectangle() {
    return this.rect;
  }

  draw(
    top: number,
    left: number,
    centerPoint: Point,
    mousePoint: Point = { x: 0, y: 0 }
  ) {
    let { angle, ctx, width, height } = this;

    this.vertices = [];

    let x = centerPoint.x - width / 2;
    let y = centerPoint.y - height / 2;

    let dist = distanceBetweenTwoPoints(centerPoint, { x, y });
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    let atan2 = getAtan2(centerPoint, {
      x,
      y,
    });

    x = centerPoint.x - dist * Math.cos(atan2 + angle);
    y = centerPoint.y + dist * Math.sin(atan2 + angle);
    this.vertices.push({ x, y });

    x = centerPoint.x + dist * Math.cos(atan2 - angle);
    y = centerPoint.y + dist * Math.sin(atan2 - angle);
    this.vertices.push({ x, y });

    x = centerPoint.x + dist * Math.cos(atan2 + angle);
    y = centerPoint.y - dist * Math.sin(atan2 + angle);
    this.vertices.push({ x, y });

    x = centerPoint.x - dist * Math.cos(atan2 - angle);
    y = centerPoint.y - dist * Math.sin(atan2 - angle);
    this.vertices.push({ x, y });

    ctx.beginPath();
    this.vertices.forEach((point, i) => {
      const { x, y } = point;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      if (i === this.vertices.length - 1) {
        ctx.lineTo(this.vertices[0].x, this.vertices[0].y);
      }
    });
    if (this.options?.fill) ctx.fill();
    if (this.options.stroke) ctx.stroke();
    this.angle += (0.25 * Math.PI) / 180;
    this.rect.vertices = this.vertices;
  }
}
export default Rectangle;
