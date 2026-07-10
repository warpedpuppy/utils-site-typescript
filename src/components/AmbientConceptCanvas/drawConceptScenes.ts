// One small pop-art vignette per /api concept chapter, drawn in the comic
// colorway (Lichtenstein red/yellow/blue on halftone fields). These are
// decorative teaching glimpses for the newsstand covers and issue mastheads —
// NOT CodePen sources and NOT registry entries. All animation math is imported
// from @utilspalooza/core; the only local code is canvas plumbing (fields,
// halftone dots, arrowheads) and a deterministic phase hash for scatter.
import {
  circleToCircle,
  easeInOut,
  easeOutBounce,
  lerp,
  lerpColorHsl,
  pingPong,
  quadraticBezier,
  rgbToCss,
  smoothstep,
  starVertices,
  unitCirclePoint,
  vecReflect,
  vecRotate,
} from "@utilspalooza/core";

export const COMIC = {
  ink: "#12100e",
  paper: "#fbf3df",
  red: "#e5261f",
  yellow: "#ffd630",
  blue: "#1d53c0",
} as const;

const TAU = Math.PI * 2;

/** A scene paints one frame at `t` seconds into the loop. Pure of state. */
export type ConceptScene = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) => void;

// Deterministic scatter (NOT a stand-in for core's random helpers — those are
// impure by design; scenes must repaint identically at a given t).
function phase(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function halftone(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  for (let y = 5; y < h; y += 12) {
    for (let x = ((y / 12) % 2) * 6 + 5; x < w; x += 12) {
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, TAU);
      ctx.fill();
    }
  }
}

function field(ctx: CanvasRenderingContext2D, w: number, h: number, bg: string, dot: string) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  halftone(ctx, w, h, dot);
}

function arrow(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  lineWidth: number,
) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - 9 * Math.cos(a - 0.45), y1 - 9 * Math.sin(a - 0.45));
  ctx.lineTo(x1 - 9 * Math.cos(a + 0.45), y1 - 9 * Math.sin(a + 0.45));
  ctx.closePath();
  ctx.fill();
}

function outlinedDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fill: string,
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = Math.max(3, r * 0.4);
  ctx.strokeStyle = COMIC.ink;
  ctx.stroke();
}

// Keys are makeConceptId(title) for every CONCEPTS chapter plus the catch-all.
export const CONCEPT_SCENES: Record<string, ConceptScene> = {
  // lerp + pingPong + smoothstep: a dot easing back and forth along a strip
  // while a value bar tracks it.
  "numbers-in-motion": (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.yellow, "rgba(229, 38, 31, 0.35)");
    const y = h * 0.62;
    const x0 = 18;
    const x1 = w - 18;
    ctx.strokeStyle = COMIC.ink;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    const tt = smoothstep(0, 1, pingPong(t * 0.55, 1));
    const x = lerp(x0, x1, tt);
    ctx.fillStyle = COMIC.blue;
    ctx.fillRect(x0, h * 0.24, x - x0, 12);
    ctx.strokeStyle = COMIC.ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(x0, h * 0.24, x1 - x0, 12);
    outlinedDot(ctx, x, y, 10, COMIC.red);
  },

  // easeOutBounce: the ball drop everyone recognizes.
  "easing-tweening": (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.blue, "rgba(251, 243, 223, 0.3)");
    const floor = h - 18;
    ctx.strokeStyle = COMIC.paper;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(12, floor);
    ctx.lineTo(w - 12, floor);
    ctx.stroke();
    const y = lerp(16, floor - 11, easeOutBounce((t * 0.5) % 1));
    outlinedDot(ctx, w * 0.5, y, 11, COMIC.yellow);
  },

  // unitCirclePoint: the rotating radius on the left traces the sine wave on
  // the right — the chapter's whole thesis in one glance.
  "angles-trigonometry": (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.red, "rgba(251, 243, 223, 0.28)");
    const cx = w * 0.24;
    const cy = h * 0.5;
    const r = h * 0.3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = COMIC.paper;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = COMIC.ink;
    ctx.stroke();
    const angle = -t * 1.4;
    const tip = unitCirclePoint(cx, cy, r, angle);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tip.x, tip.y);
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = COMIC.yellow;
    ctx.lineWidth = 4;
    ctx.beginPath();
    const waveStart = cx + r + 8;
    for (let x = waveStart; x < w - 8; x += 3) {
      const sample = unitCirclePoint(0, 0, 1, angle + (x - waveStart) * 0.045);
      const y = cy + r * sample.sin;
      if (x === waveStart) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    outlinedDot(ctx, tip.x, tip.y, 6, COMIC.yellow);
  },

  // vecRotate + vecReflect: a vector sweeping against its mirror twin.
  vectors: (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.paper, "rgba(29, 83, 192, 0.3)");
    const cx = w / 2;
    const cy = h * 0.55;
    ctx.strokeStyle = COMIC.ink;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(14, cy);
    ctx.lineTo(w - 14, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    const angle = -0.4 - 0.5 * pingPong(t * 0.6, 1);
    const v = vecRotate({ x: h * 0.42, y: 0 }, angle);
    const mirrored = vecReflect(v, { x: 0, y: 1 });
    arrow(ctx, cx, cy, cx + v.x, cy + v.y, COMIC.blue, 5);
    arrow(ctx, cx, cy, cx + mirrored.x, cy + mirrored.y, COMIC.red, 5);
    outlinedDot(ctx, cx, cy, 6, COMIC.ink);
  },

  // quadraticBezier: control point swings, a dot rides the curve.
  "points-lines-curves": (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.blue, "rgba(251, 243, 223, 0.3)");
    const p0 = { x: 18, y: h - 20 };
    const p2 = { x: w - 18, y: h - 20 };
    const p1 = { x: w / 2, y: lerp(6, h * 0.6, pingPong(t * 0.5, 1)) };
    ctx.strokeStyle = "rgba(251, 243, 223, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.strokeStyle = COMIC.yellow;
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const p = quadraticBezier(i / 24, p0, p1, p2);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    const rider = quadraticBezier(pingPong(t * 0.7, 1), p0, p1, p2);
    outlinedDot(ctx, rider.x, rider.y, 8, COMIC.red);
  },

  // circleToCircle answers "touching yet?" live; the burst fires on contact.
  "collision-detection": (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.yellow, "rgba(229, 38, 31, 0.35)");
    const cy = h * 0.55;
    const r = h * 0.24;
    const gap = lerp(w * 0.26, r * 0.9, easeInOut(pingPong(t * 0.7, 1)));
    const x1 = w / 2 - gap;
    const x2 = w / 2 + gap;
    if (circleToCircle(x1, cy, r, x2, cy, r)) {
      ctx.save();
      ctx.translate(w / 2, cy);
      ctx.beginPath();
      for (let i = 0; i < 20; i++) {
        const rr = i % 2 === 0 ? r * 1.7 : r * 0.9;
        const a = (i / 20) * TAU;
        if (i === 0) ctx.moveTo(rr * Math.cos(a), rr * Math.sin(a));
        else ctx.lineTo(rr * Math.cos(a), rr * Math.sin(a));
      }
      ctx.closePath();
      ctx.fillStyle = COMIC.red;
      ctx.strokeStyle = COMIC.ink;
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    outlinedDot(ctx, x1, cy, r, COMIC.paper);
    outlinedDot(ctx, x2, cy, r, COMIC.blue);
  },

  // lerpColorHsl: a row of swatches breathing between the comic primaries.
  color: (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.ink, "rgba(251, 243, 223, 0.18)");
    const red = { r: 229, g: 38, b: 31 };
    const blue = { r: 29, g: 83, b: 192 };
    const count = 6;
    for (let i = 0; i < count; i++) {
      const k = pingPong(t * 0.3 + i * 0.14, 1);
      const x = lerp(24, w - 24, i / (count - 1));
      ctx.beginPath();
      ctx.arc(x, h * 0.5, h * 0.17, 0, TAU);
      ctx.fillStyle = rgbToCss(lerpColorHsl(red, blue, k));
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = COMIC.paper;
      ctx.stroke();
    }
  },

  // A tiny flock: darts orbiting a drifting attractor (unitCirclePoint drives
  // both the drift and each orbit). Reads as boids without simulating them.
  "physics-systems": (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.red, "rgba(251, 243, 223, 0.28)");
    const drift = unitCirclePoint(w / 2, h / 2, Math.min(w, h) * 0.18, t * 0.7);
    for (let i = 0; i < 7; i++) {
      const speed = 0.8 + phase(i) * 0.7;
      const orbitR = 14 + phase(i + 40) * 22;
      const p = unitCirclePoint(drift.x, drift.y, orbitR, t * speed + i);
      const heading = Math.atan2(p.cos, -p.sin) + (phase(i + 7) > 0.5 ? 0 : Math.PI);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(heading);
      ctx.beginPath();
      ctx.moveTo(7, 0);
      ctx.lineTo(-5, 4);
      ctx.lineTo(-5, -4);
      ctx.closePath();
      ctx.fillStyle = COMIC.paper;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = COMIC.ink;
      ctx.stroke();
      ctx.restore();
    }
  },

  // Bars re-rolling on a slow clock — the "grab-bag of conveniences" chapter.
  helpers: (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.paper, "rgba(29, 83, 192, 0.3)");
    const count = 6;
    const step = Math.floor(t * 2);
    for (let i = 0; i < count; i++) {
      const slot = (w - 40) / count;
      const barW = slot - 8;
      const x = 20 + i * slot;
      const barH = lerp(10, h - 34, phase(step * 13 + i * 7 + 3));
      ctx.fillStyle = i % 2 === 0 ? COMIC.blue : COMIC.red;
      ctx.fillRect(x, h - 16 - barH, barW, barH);
      ctx.lineWidth = 3;
      ctx.strokeStyle = COMIC.ink;
      ctx.strokeRect(x, h - 16 - barH, barW, barH);
    }
  },

  // The shared vocabulary, gently breathing: circle, line, star polygon
  // (via starVertices), a point, and a vector arrow.
  "core-types": (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.blue, "rgba(251, 243, 223, 0.3)");
    const s = 1 + 0.04 * (pingPong(t, 1) * 2 - 1);
    ctx.lineWidth = 4;
    ctx.strokeStyle = COMIC.paper;
    ctx.beginPath();
    ctx.arc(w * 0.2, h * 0.42, h * 0.18 * s, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.36, h * 0.72);
    ctx.lineTo(w * 0.58, h * 0.28);
    ctx.stroke();
    const { vertices } = starVertices(5, h * 0.1 * s, h * 0.2 * s, -Math.PI / 2);
    ctx.beginPath();
    vertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(w * 0.72 + v.x, h * 0.5 + v.y);
      else ctx.lineTo(w * 0.72 + v.x, h * 0.5 + v.y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = COMIC.yellow;
    ctx.beginPath();
    ctx.arc(w * 0.46, h * 0.52, 5, 0, TAU);
    ctx.fill();
    arrow(ctx, w * 0.86, h * 0.8, w * 0.94, h * 0.25, COMIC.yellow, 4);
  },

  // Catch-all chapter ("More core math"): a plain halftone field with a
  // wandering dot, so an unclaimed module still gets a cover.
  "more-core-math": (ctx, w, h, t) => {
    field(ctx, w, h, COMIC.paper, "rgba(229, 38, 31, 0.35)");
    const p = unitCirclePoint(w / 2, h / 2, Math.min(w, h) * 0.28, t * 0.9);
    outlinedDot(ctx, p.x, p.y, 9, COMIC.blue);
  },
};
