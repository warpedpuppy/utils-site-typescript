import { Point, Nullable } from "../../types/types";
class Template {
  static t = "";
  static l = "";
  title = "";
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
  keyFunction() {}
  init(cont: HTMLDivElement) {
    if (!this.canvas || !this.ctx) return;

    this.cont = cont;
    cont.innerHTML = "";
    cont.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = cont.clientWidth;
    this.canvas.height = cont.clientHeight;
    this.halfHeight = cont.clientHeight / 2;
    this.halfWidth = cont.clientWidth / 2;

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

    window.addEventListener("resize", this.resizeHandler);

    this.draw();
  }
  resizeHandler = () => {
    if (!this.canvas || !this.ctx) return;
    this.canvas.width = this.cont.clientWidth;
    this.canvas.height = this.cont.clientHeight;
    this.halfHeight = this.cont.clientHeight / 2;
    this.halfWidth = this.cont.clientWidth / 2;
    let { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    // this.draw(); // only if no requestAnimationFrame
  };
  draw = () => {
    if (!this.canvas || !this.ctx || !this.startPoint || !this.endPoint) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
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
    this.canvas = null;
  }
}
export default Template;
