import { Point, Nullable } from "../types/types";
import { prefersReducedMotion } from "../motionPreference";

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
  continue: boolean = true;
  /**
   * Motion gate (mirrors AnimationBaseClass). Under an OS reduced-motion
   * setting the loop gets ONE frame — a real still — then holds until the
   * visitor presses play. Subclasses must schedule frames via this.raf().
   */
  motionPaused: boolean = prefersReducedMotion();
  protected rafId: number = 0;
  private lastFrame: Nullable<FrameRequestCallback> = null;
  private firstFrameScheduled = false;
  private gatedEffect: Nullable<{ pause(): void; resume(): void }> = null;
  private onPointerDown = (e: PointerEvent) => this.pointerDownHandler(e);
  private onPointerMove = (e: PointerEvent) => this.pointerMoveHandler(e);
  private onPointerUp = (e: PointerEvent) => this.pointerUpHandler(e);

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

    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("resize", this.resizeHandler);
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
  };
  /** Schedule the next frame through the motion gate. Returns the rAF id. */
  protected raf(fn: FrameRequestCallback): number {
    this.lastFrame = fn;
    if (this.motionPaused && this.firstFrameScheduled) return 0;
    this.firstFrameScheduled = true;
    this.rafId = requestAnimationFrame(fn);
    return this.rafId;
  }

  /**
   * Effects-mounted subclasses (Glitter, PrettyRing, Sparklies) don't drive
   * frames through raf() — the @utilspalooza/effects harness owns the loop.
   * They hand their EffectHandle here so the same motion gate controls it.
   */
  protected gateEffect(effect: { pause(): void; resume(): void }) {
    this.gatedEffect = effect;
    if (this.motionPaused) {
      // Let the harness paint one frame (a real still), then hold.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (this.motionPaused) effect.pause();
        })
      );
    }
  }

  /** Restart the loop after the motion gate (or pauseMotion) held it. */
  resumeMotion() {
    if (!this.motionPaused) return;
    this.motionPaused = false;
    this.gatedEffect?.resume();
    if (this.lastFrame) this.rafId = requestAnimationFrame(this.lastFrame);
  }

  /** Freeze the loop on the current frame; resumeMotion() picks it back up. */
  pauseMotion() {
    if (this.motionPaused) return;
    this.motionPaused = true;
    this.gatedEffect?.pause();
    cancelAnimationFrame(this.rafId);
  }

  /** Subclasses override; declared here so the base satisfies AnimationInstance. */
  init() {}

  pointerDownHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  stop() {
    this.continue = false;
    cancelAnimationFrame(this.rafId);

    if (this.textDiv) this.textDiv.innerHTML = "";
    if (this.canvas) {
      this.canvas.removeEventListener("pointerdown", this.onPointerDown);
      this.canvas.removeEventListener("pointermove", this.onPointerMove);
      this.canvas.removeEventListener("pointerup", this.onPointerUp);
    }
    window.removeEventListener("resize", this.resizeHandler);
    if (this.cont) this.cont.innerHTML = "";
    this.ctx = null;
    this.canvas = null;
  }
}
export default Template;
