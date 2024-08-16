import { Nullable, Point } from "../../../types/types";
class MoveObjectToDestinationPoint {
  static t = "move object to changing point";
  static l = "move-to-changing-point";
  title: string = "move object to changing point";
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
  points = [];
  text = [];
  interval: any = undefined;
  dot: Point = { x: 0, y: 0 };
  dotNew: Point = { x: 0, y: 0 };
  arrowPoint: Point = { x: 0, y: 0 };
  img = new Image();
  ratio = 0;
  keyFunction(origin: Point, destination: Point, ratio: number) {
    let x = origin.x + ratio * (destination.x - origin.x);
    let y = origin.y + ratio * (destination.y - origin.y);
    return { x, y };
  }
  init(cont: HTMLDivElement) {
    if (!this.canvas || !this.ctx || !this.textDiv) return;
    this.textDiv.innerHTML =
      "<h3>this function shows you how the arrow moves to the point.  To see how to get the arrow to point towards the point, please see 'point one object towards a moving object'.</h3>";
    this.canvas.width = this.canvasWidth = cont.clientWidth;
    this.canvas.height = this.canvasHeight = cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    this.ctx = this.canvas.getContext("2d");
    this.cont = cont;
    cont.innerHTML = "";
    cont.appendChild(this.canvas);

    window.addEventListener("resize", this.resizeHandler);

    this.dot = {
      x: Math.floor(Math.random() * this.canvasWidth),
      y: Math.floor(Math.random() * this.canvasHeight),
    };
    this.drawDot();

    this.img.addEventListener("load", () => {
      if (!this.ctx) return;
      this.ctx.drawImage(this.img, 0, 0);
      this.draw();
    });

    this.img.src = "/bmps/arrow.png";

    this.arrowPoint = { x: this.halfWidth - 50, y: this.halfHeight - 25 };

    this.interval = setInterval(this.drawDot.bind(this), 2000);
  }
  getRotation(destinationPoint: Point, zeroReference: Point) {
    return Math.atan2(
      destinationPoint.y - zeroReference.y,
      destinationPoint.x - zeroReference.x
    );
  }
  drawDot() {
    this.ratio = 0;
    this.dotNew = {
      x: Math.floor(Math.random() * this.canvasWidth),
      y: Math.floor(Math.random() * this.canvasHeight),
    };
  }
  drawLine(x1: number, y1: number, x2: number, y2: number, ratio: number) {
    x2 = x1 + ratio * (x2 - x1);
    y2 = y1 + ratio * (y2 - y1);
    return { x: x2, y: y2 };
  }
  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.cont.clientWidth;
    this.canvas.height = this.cont.clientHeight;
    this.draw();
  };

  draw = () => {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 10;

    let newDotPoint = this.keyFunction(this.dot, this.dotNew, this.ratio);
    this.dot = newDotPoint;
    this.ctx.beginPath();
    this.ctx.arc(this.dot.x, this.dot.y, 20, 0, 2 * Math.PI);
    this.ctx.stroke();

    let newPoint = this.keyFunction(this.arrowPoint, this.dot, this.ratio);

    this.arrowPoint = newPoint;

    let angle = this.getRotation(this.dot, newPoint);

    this.ctx.translate(newPoint.x, newPoint.y);
    this.ctx.rotate(angle);
    this.ctx.translate(-newPoint.x, -newPoint.y);

    this.ctx.drawImage(
      this.img,
      this.arrowPoint.x - 50,
      this.arrowPoint.y - 25
    );
    this.ctx.resetTransform();
    this.ratio += 0.0001;

    requestAnimationFrame(this.draw);
  };
  stop() {
    if (!this.canvas || !this.ctx || !this.textDiv) return;
    clearInterval(this.interval);
    this.textDiv.innerHTML = "";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    window.removeEventListener("resize", this.resizeHandler.bind(this));
    this.cont.removeChild(this.canvas);
    this.canvas = null;
  }
}
export default MoveObjectToDestinationPoint;
