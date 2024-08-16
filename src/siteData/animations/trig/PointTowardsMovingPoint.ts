import { Nullable, Point } from "../../../types/types";
class PointTowardsMovingPoint {
  static t = "point one object towards a moving object";
  static l = "point-one-object-towards-a-moving-object";
  title = "point one object towards a moving object";
  canvas: Nullable<HTMLCanvasElement> = document.createElement("canvas");
  textDiv: Nullable<HTMLElement> = document.getElementById(
    "primary-canvas--content--text"
  );
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  halfHeight: number = 0;
  halfWidth: number = 0;
  cont: HTMLDivElement = undefined!;
  ctx = this.canvas?.getContext("2d");
  startPoint: Nullable<Point> = null;
  endPoint: Nullable<Point> = null;
  top: number = 0;
  left: number = 0;
  allowDraw: boolean = false;
  img = new Image();
  i = 0;
  keyFunction(originPoint: Point, destinationPoint: Point) {
    return Math.atan2(
      destinationPoint.y - originPoint.y,
      destinationPoint.x - originPoint.x
    );
  }
  init(cont: HTMLDivElement) {
    if (!this.canvas || !this.ctx) return;
    this.canvas.width = this.canvasWidth = cont.clientWidth;
    this.canvas.height = this.canvasHeight = cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    this.ctx = this.canvas.getContext("2d");
    cont.innerHTML = "";
    cont.appendChild(this.canvas);
    this.cont = cont;
    window.addEventListener("resize", this.resizeHandler);

    this.img.addEventListener("load", () => {
      if (!this.ctx) return;
      this.ctx.drawImage(this.img, 0, 0);
      this.draw();
    });
    this.img.src = "/bmps/arrow.png";
  }
  pointsAroundCircle(
    circleCenter: Point,
    i: number,
    radius: number,
    numElements: number
  ) {
    const x =
      circleCenter.x + radius * Math.cos(2 * Math.PI * (i / numElements));
    const y =
      circleCenter.y + radius * Math.sin(2 * Math.PI * (i / numElements));
    return { x, y };
  }
  resizeHandler() {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.cont.clientWidth;
    this.canvas.height = this.cont.clientHeight;
    this.draw();
  }
  draw = () => {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.halfHeight);
    this.ctx.lineTo(this.canvasWidth, this.halfHeight);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.halfWidth, 0);
    this.ctx.lineTo(this.halfWidth, this.canvasHeight);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.halfWidth, this.halfHeight, 200, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.strokeStyle = "grey";
    this.ctx.lineWidth = 2;

    let point = this.pointsAroundCircle(
      { x: this.halfWidth, y: this.halfHeight },
      this.i,
      200,
      360
    );

    this.i += 0.5;
    if (this.i > 360) this.i = 0;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
    this.ctx.stroke();

    let angle = this.keyFunction(
      {
        x: this.halfWidth,
        y: this.halfHeight,
      },
      point
    );

    this.ctx.translate(this.halfWidth, this.halfHeight);
    this.ctx.rotate(angle);
    this.ctx.translate(-this.halfWidth, -this.halfHeight);

    this.ctx.drawImage(this.img, this.halfWidth - 50, this.halfHeight - 25);
    this.ctx.resetTransform();

    requestAnimationFrame(this.draw);
  };
  stop() {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    window.removeEventListener("resize", this.resizeHandler);
    this.cont.removeChild(this.canvas);
    this.canvas = null;
  }
}
export default PointTowardsMovingPoint;
