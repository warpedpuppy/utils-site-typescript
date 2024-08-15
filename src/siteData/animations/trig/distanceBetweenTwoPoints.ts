import { Point, Nullable } from "../../../types/types";
class DistanceBetweenTwoPoints {
  static t = "get distance between two points";
  static l = "distance-between-points";
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
  keyFunction(startPoint: Point, endPoint: Point) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }
  init(cont: HTMLDivElement) {
    if (!this.canvas || !this.ctx) return;
    cont.innerHTML = "";
    this.cont = cont;
    cont.appendChild(this.canvas);
    this.canvas.width = cont.clientWidth;
    this.canvas.height = cont.clientHeight;
    this.halfHeight = cont.clientHeight / 2;
    this.halfWidth = cont.clientWidth / 2;
    this.ctx = this.canvas.getContext("2d");

    this.startPoint = { x: this.halfWidth, y: this.halfHeight };
    this.endPoint = { x: this.halfWidth + 200, y: this.halfHeight - 200 };
    let { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    this.canvas.addEventListener(
      "pointerdown",
      this.pointerDownHandler.bind(this)
    );
    this.canvas.addEventListener(
      "pointermove",
      this.pointerMoveHandler.bind(this)
    );
    this.canvas.addEventListener("pointerup", this.pointerUpHandler.bind(this));
    this.draw();
    window.addEventListener("resize", this.resizeHandler);
  }
  resizeHandler = () => {
    if (!this.canvas || !this.ctx) return;
    this.canvas.width = this.cont.clientWidth;
    this.canvas.height = this.cont.clientHeight;
    this.draw();
  };
  draw = () => {
    if (!this.canvas || !this.ctx || !this.startPoint || !this.endPoint) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = "bold 18px sans serif";
    this.ctx.beginPath();
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();
    this.ctx.fillText(
      `{x: ${this.startPoint.x}, y: ${this.startPoint.y}}`,
      this.startPoint.x,
      this.startPoint.y
    );

    this.ctx.fillText("A", this.endPoint.x, this.endPoint.y);
    this.ctx.fillText(
      `{x: ${this.endPoint.x}, y: ${this.endPoint.y}}`,
      this.endPoint.x,
      this.endPoint.y
    );

    this.ctx.strokeStyle = "grey";
    this.ctx.lineWidth = 0.25;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.startPoint.y);
    this.ctx.stroke();

    this.ctx.moveTo(this.endPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();

    let radius = this.keyFunction(this.startPoint, this.endPoint);
    if (this.textDiv)
      this.textDiv.innerHTML = `<h3>Click and drag on the screen to draw line.</h3>
      <h4>the green line is ${Math.floor(radius)} pixels long.</h4>`;
    this.ctx.beginPath();
    this.ctx.arc(this.startPoint.x, this.startPoint.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
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
    if (!this.textDiv || !this.canvas || !this.cont) return;
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
    this.cont.innerHTML = "";
    // this.cont.removeChild(this.canvas);
    this.canvas = null;
  }
}
export default DistanceBetweenTwoPoints;
