import { Point, Nullable, GenericObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class GetEquilateralTriangleVertices extends AnimationBaseClass {
  static t = "get equilateral triangle vertices from radius and center point";
  static l = "equilateral-trianlge-points";
  title = "get equilateral triangle vertices from radius and center point";
  backgroundTris: object[] = [];
  angle = 0;
  keyFunction(radius: number, centerPoint: Point, angle: number) {
    let allRadiansInACircle = 2 * Math.PI;
    let point1 = {
      x: radius * Math.cos(angle) + centerPoint.x,
      y: radius * Math.sin(angle) + centerPoint.y,
    };
    let point2 = {
      x:
        radius * Math.cos(angle + (1 / 3) * allRadiansInACircle) +
        centerPoint.x,
      y:
        radius * Math.sin(angle + (1 / 3) * allRadiansInACircle) +
        centerPoint.y,
    };
    let point3 = {
      x:
        radius * Math.cos(angle + (2 / 3) * allRadiansInACircle) +
        centerPoint.x,
      y:
        radius * Math.sin(angle + (2 / 3) * allRadiansInACircle) +
        centerPoint.y,
    };
    return { point1, point2, point3 };
  }
  init() {
    for (let i = 0; i < 10; i++) {
      let radius = Math.random() * 100 + 50;
      let centerPoint = {
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
      };
      let angle = Math.random() * 1;
      let obj: GenericObject = { radius, centerPoint, angle };
      this.backgroundTris.push(obj);
    }

    this.draw();
  }
  getLineAngle(originPoint: Point, destinationPoint: Point) {
    return Math.atan2(
      destinationPoint.y - originPoint.y,
      destinationPoint.x - originPoint.x
    );
  }
  draw = () => {
    if (!this.canvas || !this.cont || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.backgroundTris.forEach((tri: GenericObject) => {
      if (!this.ctx) return;
      let { point1, point2, point3 } = this.keyFunction(
        tri.radius,
        tri.centerPoint,
        this.angle || tri.angle
      );
      this.ctx.strokeStyle = "rgba(0 0 0 / 0.25)";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(point1.x, point1.y);
      this.ctx.lineTo(point2.x, point2.y);
      this.ctx.lineTo(point3.x, point3.y);
      this.ctx.lineTo(point1.x, point1.y);
      this.ctx.stroke();
    });

    if (!this.startPoint || !this.endPoint) return;

    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 3;

    let a = this.startPoint.x - this.endPoint.x;
    let b = this.startPoint.y - this.endPoint.y;

    let radius = Math.sqrt(a * a + b * b);

    this.angle = this.getLineAngle(this.startPoint, this.endPoint); // * (180 / Math.PI);

    let { point1, point2, point3 } = this.keyFunction(
      radius,
      this.startPoint,
      this.angle
    );
    this.ctx.beginPath();
    this.ctx.moveTo(point1.x, point1.y);
    this.ctx.lineTo(point2.x, point2.y);
    this.ctx.lineTo(point3.x, point3.y);
    this.ctx.lineTo(point1.x, point1.y);
    this.ctx.stroke();
    [point1, point2, point3].forEach((item: Point) => {
      this.ctx?.beginPath();
      this.ctx?.arc(item.x, item.y, 5, 0, 2 * Math.PI);
      this.ctx?.stroke();
    });
  };
  pointerDownHandler(e: PointerEvent) {
    this.startPoint = {
      x: Math.floor(e.pageX - this.left),
      y: Math.floor(e.pageY - this.top),
    };
    this.allowDraw = true;
  }
  pointerMoveHandler(e: PointerEvent) {
    if (this.allowDraw) {
      this.endPoint = {
        x: Math.floor(e.pageX - this.left),
        y: Math.floor(e.pageY - this.top),
      };
      this.draw();
    }
  }
  pointerUpHandler(e: PointerEvent) {
    this.allowDraw = false;
  }
}

export default GetEquilateralTriangleVertices;
