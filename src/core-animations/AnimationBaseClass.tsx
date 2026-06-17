import { Nullable } from "../types/types";
import { Point } from "../types/shapes";

class AnimationBaseClass {
  static t = "";
  static l = "";
  title = "";
  cont: Nullable<HTMLElement> = null;
  canvas: Nullable<HTMLCanvasElement> = document.createElement("canvas");
  ctx = this.canvas?.getContext("2d");
  textDiv: Nullable<HTMLElement> = null; // resolved after DOM is ready
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  halfHeight: number = 0;
  halfWidth: number = 0;
  startPoint: Nullable<Point> = null;
  endPoint: Nullable<Point> = null;
  top: number = 0;
  left: number = 0;
  allowDraw: boolean = false;
  /** Set to false to break the animation loop cleanly. */
  continue: boolean = true;
  /** Stored RAF id so we can cancel it on stop(). */
  private rafId: number = 0;

  // Store bound handlers as stable references so removeEventListener works.
  private _onPointerDown = (e: PointerEvent) => this.pointerDownHandler(e);
  private _onPointerMove = (e: PointerEvent) => this.pointerMoveHandler(e);
  private _onPointerUp   = (e: PointerEvent) => this.pointerUpHandler(e);

  constructor(id: string = "primary-canvas--content--canvas-container") {
    if (!this.canvas || !this.ctx) return;

    this.cont = document.getElementById(id);
    this.textDiv = document.getElementById("primary-canvas--content--text");

    if (this.cont) {
      this.cont.innerHTML = "";
      this.cont.appendChild(this.canvas);
      this.canvas.width = this.canvasWidth = this.cont.clientWidth;
      this.canvas.height = this.canvasHeight = this.cont.clientHeight;
      this.halfHeight = this.cont.clientHeight / 2;
      this.halfWidth  = this.cont.clientWidth  / 2;
    }

    const { top, left } = this.canvas.getBoundingClientRect();
    this.top  = top;
    this.left = left;

    this.canvas.addEventListener("pointerdown", this._onPointerDown);
    this.canvas.addEventListener("pointermove", this._onPointerMove);
    this.canvas.addEventListener("pointerup",   this._onPointerUp);
    window.addEventListener("resize", this.resizeHandler);
  }

  resizeHandler = () => {
    if (!this.canvas || !this.ctx || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.cont.clientHeight / 2;
    this.halfWidth  = this.cont.clientWidth  / 2;
    const { top, left } = this.canvas.getBoundingClientRect();
    this.top  = top;
    this.left = left;
  };

  /** Subclasses should call this.raf(this.draw) at the end of draw(). */
  protected raf(fn: FrameRequestCallback) {
    this.rafId = requestAnimationFrame(fn);
  }

  pointerDownHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent)   {}

  stop() {
    this.continue = false;
    cancelAnimationFrame(this.rafId);

    if (this.textDiv) this.textDiv.innerHTML = "";

    if (this.canvas) {
      this.canvas.removeEventListener("pointerdown", this._onPointerDown);
      this.canvas.removeEventListener("pointermove", this._onPointerMove);
      this.canvas.removeEventListener("pointerup",   this._onPointerUp);
    }
    window.removeEventListener("resize", this.resizeHandler);

    if (this.cont) this.cont.innerHTML = "";
    this.ctx    = null;
    this.canvas = null;
  }
}

export default AnimationBaseClass;
