import { Nullable, Point } from "../../../types/types";
class MoveItemAroundCircle {
  static t: string = "move item around circle";
  static l: string = "move-item-around-circle";
  title = "move item around circle";
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
  text: string[] = [];
  interval: any = 0;
  circleQ = 0;
  points: any = [];
  allowDraw: boolean = false;
  i: number = 0;
  keyFunction(
    circleCenter: Point,
    radius: number,
    percentageAroundCircle: number
  ) {
    let totalCircleRadians = Math.PI * 2;
    let percent = percentageAroundCircle / 100;
    const x = circleCenter.x + radius * Math.cos(totalCircleRadians * percent);
    const y = circleCenter.y + radius * Math.sin(totalCircleRadians * percent);
    return { x, y };
  }
  init(cont: HTMLDivElement) {
    if (!this.canvas || !this.ctx) return;
    this.canvas.width = this.canvasWidth = cont.clientWidth;
    this.canvas.height = this.canvasHeight = cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    this.ctx = this.canvas.getContext("2d");
    this.cont = cont;
    cont.innerHTML = "";
    cont.appendChild(this.canvas);
    this.draw();
    this.i = 0;
    window.addEventListener("resize", this.resizeHandler);
  }
  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.cont.clientWidth;
    this.canvas.height = this.cont.clientHeight;
  };
  draw = () => {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 2;

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

    let point = this.keyFunction(
      { x: this.halfWidth, y: this.halfHeight },
      200,
      this.i
    );
    this.i += 0.5;
    if (this.i > 100) this.i = 0;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.strokeStyle = "rgba(0 0 0 / 0.25)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(this.halfWidth, this.halfHeight);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
    this.ctx.lineTo(point.x, this.halfHeight);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
  stop() {
    if (!this.canvas || !this.ctx || !this.cont) return;
    clearInterval(this.interval);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    window.removeEventListener("resize", this.resizeHandler.bind(this));
    this.cont.removeChild(this.canvas);
    this.canvas = null;
  }
}
export default MoveItemAroundCircle;
