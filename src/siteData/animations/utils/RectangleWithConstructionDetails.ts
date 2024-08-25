import { Point, Polygon } from "../../../types/types";
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
  star: Polygon = { vertices: [], draw: () => {}, drag: false };
  constructor(
    width: number,
    height: number,
    angle: number = 0,
    ctx: any,
    rotate: boolean = false,
    id: string = ""
  ) {
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.ctx = ctx;
    this.rotate = rotate;
    this.id = id;
    this.rot = (Math.PI / 2) * 3; // start at 270 degrees
    this.angle *= Math.PI / 180;
  }

  draw(
    top: number,
    left: number,
    centerPoint: Point,
    mousePoint: Point = { x: 0, y: 0 }
  ) {
    let { angle, ctx, width, height } = this;

    // ctx.beginPath();
    // ctx.rect(centerPoint.x - 100, centerPoint.y - 100, 200, 200);
    // ctx.stroke();

    this.vertices = [];

    let x = centerPoint.x - width / 2;
    let y = centerPoint.y - height / 2;

    let dist = distanceBetweenTwoPoints(centerPoint, { x, y });
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.arc(centerPoint.x, centerPoint.y, dist, 0, Math.PI * 2);
    // ctx.stroke();

    let atan2 = getAtan2(centerPoint, {
      x,
      y,
    });

    ctx.lineWidth = 3;

    x = centerPoint.x - dist * Math.cos(atan2 + angle);
    y = centerPoint.y + dist * Math.sin(atan2 + angle);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.stroke();
    this.vertices.push({ x, y });

    ctx.strokeStyle = "green";
    x = centerPoint.x + dist * Math.cos(atan2 - angle);
    y = centerPoint.y + dist * Math.sin(atan2 - angle);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.stroke();
    this.vertices.push({ x, y });

    x = centerPoint.x + dist * Math.cos(atan2 + angle);
    y = centerPoint.y - dist * Math.sin(atan2 + angle);
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.stroke();
    this.vertices.push({ x, y });

    x = centerPoint.x - dist * Math.cos(atan2 - angle);
    y = centerPoint.y - dist * Math.sin(atan2 - angle);
    ctx.beginPath();
    ctx.strokeStyle = "orange";
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.stroke();
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
    ctx.stroke();
    this.angle += (0.25 * Math.PI) / 180;
  }
}
export default Rectangle;
