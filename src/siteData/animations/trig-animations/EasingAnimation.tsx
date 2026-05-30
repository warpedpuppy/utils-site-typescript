import AnimationBaseClass from "../AnimationBaseClass";
import { Easing } from "../../formulas/animation/Easing";

// ── Easing helpers ────────────────────────────────────────────────────────────

function linear(t: number)        { return t; }
function easeInQuad(t: number)    { return t * t; }
function easeOutQuad(t: number)   { return t * (2 - t); }
function easeInOutQuad(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function easeOutElastic(t: number) {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function easeOutBounce(t: number) {
  const n1 = 7.5625, d1 = 2.75;
  if      (t < 1 / d1)       return n1 * t * t;
  else if (t < 2 / d1)       return n1 * (t -= 1.5   / d1) * t + 0.75;
  else if (t < 2.5 / d1)     return n1 * (t -= 2.25  / d1) * t + 0.9375;
  else                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

// ── Track definitions ─────────────────────────────────────────────────────────

const TRACKS = [
  { name: "linear",         ease: linear,         color: "#94a3b8" },
  { name: "ease-in-quad",   ease: easeInQuad,     color: "#60a5fa" },
  { name: "ease-out-quad",  ease: easeOutQuad,    color: "#34d399" },
  { name: "ease-in-out-quad", ease: easeInOutQuad, color: "#a78bfa" },
  { name: "ease-out-elastic", ease: easeOutElastic, color: "#f472b6" },
  { name: "ease-out-bounce",  ease: easeOutBounce,  color: "#fb923c" },
];

const PERIOD_MS = 2800; // ms for one full pass (left → right)
const PAUSE_MS  =  500; // ms of pause at the end before looping

class EasingAnimation extends AnimationBaseClass {
  static t = "easing functions";
  static l = "easing-functions";
  static f = Easing;
  title = "easing functions";
  animationObject = Easing;

  init() {
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>All six balls travel the same distance in the same total time — easing changes how they accelerate through that journey.</h3>";
    }
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    const elapsed = Date.now() % (PERIOD_MS + PAUSE_MS);
    // t goes 0→1 during PERIOD_MS, then freezes at 1 during PAUSE_MS
    const t = Math.min(elapsed / PERIOD_MS, 1);

    const PAD_X     = Math.max(130, this.canvasWidth * 0.22);
    const PAD_RIGHT = 20;
    const PAD_Y     = 32;
    const trackW    = this.canvasWidth - PAD_X - PAD_RIGHT;
    const trackH    = (this.canvasHeight - PAD_Y * 2) / TRACKS.length;
    const BALL_R    = Math.max(6, Math.min(10, trackH * 0.28));

    ctx.font = "11px monospace";
    ctx.textAlign = "right";

    TRACKS.forEach((track, i) => {
      const cy = PAD_Y + i * trackH + trackH / 2;

      // Track line
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD_X,            cy);
      ctx.lineTo(PAD_X + trackW,   cy);
      ctx.stroke();

      // End-caps (dot markers for start/end positions)
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.arc(PAD_X,          cy, BALL_R * 0.55, 0, Math.PI * 2);
      ctx.arc(PAD_X + trackW, cy, BALL_R * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = track.color;
      ctx.fillText(track.name, PAD_X - 10, cy + 4);

      // Ball
      const easedT = track.ease(t);
      const bx     = PAD_X + easedT * trackW;

      // Glow
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = track.color;
      ctx.beginPath();
      ctx.arc(bx, cy, BALL_R * 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Ball body
      ctx.fillStyle = track.color;
      ctx.beginPath();
      ctx.arc(bx, cy, BALL_R, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.textAlign = "left";
    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent)   {}
  pointerMoveHandler(_e: PointerEvent) {}
}

export default EasingAnimation;
