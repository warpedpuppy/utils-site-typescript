import { Point, Nullable } from "../../types/types";

class Template {
  static t = "";
  static l = "";
  title = "";
  cont: Nullable<HTMLElement> = null;
  canvas: Nullable<HTMLCanvasElement> = document.createElement("canvas");
  ctx = this.canvas?.getContext("2d");
  textDiv: Nullable<HTMLElement> = document.getElementById(
    "primary-canvas--content--text"
  );
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  halfHeight: number = 0;
  halfWidth: number = 0;
  startPoint: Nullable<Point> = null;
  endPoint: Nullable<Point> = null;
  top: number = 0;
  left: number = 0;
  allowDraw: boolean = false;
  constructor(id: string) {
    if (!this.canvas || !this.ctx) return;

    this.cont = document.getElementById(id);

    if (this.cont) {
      this.cont.innerHTML = "";
      this.cont.appendChild(this.canvas);
      this.canvas.width = this.canvasWidth = this.cont.clientWidth;
      this.canvas.height = this.canvasHeight = this.cont.clientHeight;
      this.halfHeight = this.cont.clientHeight / 2;
      this.halfWidth = this.cont.clientWidth / 2;
    }

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

    // this.draw = this.draw.bind(this);
    // this.draw();
  }
  resizeHandler = () => {
    if (!this.canvas || !this.ctx) return;
    if (this.cont) {
      this.canvas.width = this.cont.clientWidth;
      this.canvas.height = this.cont.clientHeight;
      this.halfHeight = this.cont.clientHeight / 2;
      this.halfWidth = this.cont.clientWidth / 2;
    }
    let { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    // this.draw(); // only if no requestAnimationFrame
  };
  // draw() {
  //   if (!this.canvas || !this.ctx || !this.startPoint || !this.endPoint) return;
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  // }
  pointerDownHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  stop() {
    console.log("stop being called");
    if (!this.textDiv || !this.canvas || !this.cont) return;
    console.log("stop being called2");
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
    this.ctx = null;
    this.canvas = null;
  }
}
export default Template;
