import { Point, Nullable, GenericObject } from "../../../types/types";
class GetEquilateralTriangleVertices {
  static t = "get equilateral triangle vertices from radius and center point";
  static l = "equilateral-trianlge-points";
  title = "get equilateral triangle vertices from radius and center point";
  canvas: Nullable<HTMLCanvasElement> = document.createElement("canvas");
  textDiv: Nullable<HTMLElement> = document.getElementById(
    "primary-canvas--content--text"
  );
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  halfHeight: number = 0;
  halfWidth: number = 0;
  cont: HTMLDivElement = undefined!;
  startPoint: Nullable<Point> = null;
  endPoint: Nullable<Point> = null;
  top: number = 0;
  left: number = 0;
  allowDraw = false;
  ctx = this.canvas?.getContext("2d");
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
  init(cont: HTMLDivElement) {
    if (!this.textDiv) return;
    this.cont = cont;
    this.textDiv.innerHTML =
      "click and drag to create center and radius of triangle";
    this.canvas = document.createElement("canvas");
    this.cont.innerHTML = "";
    this.cont.appendChild(this.canvas);
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.ctx = this.canvas.getContext("2d");

    let { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    this.allowDraw = false;

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

    this.canvas.addEventListener(
      "pointerdown",
      this.pointerDownHandler.bind(this)
    );
    this.canvas.addEventListener(
      "pointermove",
      this.pointerMoveHandler.bind(this)
    );
    this.canvas.addEventListener("pointerup", this.pointerUpHandler.bind(this));
    window.addEventListener("resize", this.resizeHandler.bind(this));
    this.draw();
  }
  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.cont.clientWidth;
    this.canvas.height = this.cont.clientHeight;
    let { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    this.draw();
  };
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
      this.ctx.strokeStyle = "rgba(0 0 0 / 0.25";
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
  stop() {
    if (!this.canvas || !this.cont || !this.textDiv) return;
    this.textDiv.innerHTML = "";
    this.canvas.removeEventListener(
      "pointerdown",
      this.pointerDownHandler.bind(this)
    );
    this.canvas.removeEventListener(
      "pointermove",
      this.pointerMoveHandler.bind(this)
    );
    this.canvas.removeEventListener(
      "pointerup",
      this.pointerUpHandler.bind(this)
    );
    window.removeEventListener("resize", this.resizeHandler.bind(this));
    this.cont.removeChild(this.canvas);
    this.canvas = null;
  }
}

export default GetEquilateralTriangleVertices;
