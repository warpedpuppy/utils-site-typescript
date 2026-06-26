// ─────────────────────────────────────────────────────────────────────────────
// drawScalarMiniDemo — the single canonical drawing for a "scalar mini-demo".
//
// This is the shared heart of the two-altitude docs idea (see CLAUDE.md, "Docs
// are friendly, visual, and ELI5"). A scalar primitive — pingPong, lerp, clamp,
// wrap, smoothstep … — turns time/input into one number. This draws that number
// twice, side by side, so a non-engineer can SEE it:
//
//   • left pane  — "the number": a bar that fills to value / length.
//   • right pane — "what it drives": a dot whose position is value / length.
//
// Both panes read the SAME fraction, so the bar and the dot move together. The
// caller computes `value` by calling the real @utilspalooza/core function, so the
// math is never re-implemented here. BOTH harnesses that show this demo — the
// React <MiniDemo/> on /api and the PingPong animation class on /examples — call
// this one function, which is how "same component, both places" stays honest even
// though the two pages mount differently.
// ─────────────────────────────────────────────────────────────────────────────

export interface ScalarMiniDemoFrame {
  /** Current output of the scalar function (the live value to visualize). */
  value: number;
  /** Domain peak: the value pane reads `value / length`. */
  length: number;
  /** Canvas width in device-independent pixels. */
  width: number;
  /** Canvas height in device-independent pixels. */
  height: number;
  /** Optional title drawn at the top, e.g. `pingPong(t, 100)`. */
  label?: string;

  // ── Transform mode (optional) ──────────────────────────────────────────────
  // pingPong is a *generator* — one number that means the same thing on both
  // sides, so the left bar and right dot read the same `value / length`. The
  // "numbers in motion" transforms (lerp, clamp, wrap, …) instead turn an INPUT
  // into an OUTPUT, so we must show input → output. Provide `input` to switch the
  // left pane to "input" over `[inputMin, inputMax]`; the right pane stays the
  // output over `[0, length]`. Omit `input` and the drawing behaves exactly as
  // the original generator (pingPong) path — these fields are purely additive.
  /** When set, the left pane shows this INPUT instead of the output value. */
  input?: number;
  /** Lower bound of the input pane's display range. Defaults to 0. */
  inputMin?: number;
  /** Upper bound of the input pane's display range. Defaults to `length`. */
  inputMax?: number;
}

const INDIGO = "#6366f1";
const INDIGO_LIGHT = "#c7d2fe";
const ORANGE = "#f97316";
const TRACK = "rgba(255,255,255,0.12)";
const FAINT = "rgba(255,255,255,0.35)";
const DIM = "rgba(255,255,255,0.55)";

/** Draw one frame of the two-pane scalar demo. Pure given (ctx, frame). */
export function drawScalarMiniDemo(
  ctx: CanvasRenderingContext2D,
  { value, length, width, height, label, input, inputMin, inputMax }: ScalarMiniDemoFrame
): void {
  // Transform mode iff an `input` was supplied (see ScalarMiniDemoFrame above).
  const transform = input !== undefined;
  const leftValue = transform ? input : value;
  const leftMin = transform ? inputMin ?? 0 : 0;
  const leftMax = transform ? inputMax ?? length : length;
  const leftSpan = leftMax - leftMin;
  const leftFrac = leftSpan > 0 ? clamp01((leftValue - leftMin) / leftSpan) : 0;
  const rightFrac = length > 0 ? clamp01(value / length) : 0;

  ctx.clearRect(0, 0, width, height);

  const pad = 22;
  const gap = 26;
  const topInset = label ? 30 : 14;
  const paneW = (width - pad * 2 - gap) / 2;
  const leftX = pad;
  const rightX = pad + paneW + gap;
  const cy = topInset + (height - topInset) / 2;

  // ── Title ──────────────────────────────────────────────────────────────────
  if (label) {
    ctx.fillStyle = DIM;
    ctx.font = "13px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(label, leftX, 20);
  }

  // ── Left pane: "the number" — a bar that fills to value / length ────────────
  const barH = 16;
  const barY = cy - barH / 2;

  // track
  ctx.fillStyle = TRACK;
  roundRect(ctx, leftX, barY, paneW, barH, barH / 2);
  ctx.fill();

  // fill
  const fillW = Math.max(barH, paneW * leftFrac);
  const grad = ctx.createLinearGradient(leftX, 0, leftX + paneW, 0);
  grad.addColorStop(0, INDIGO);
  grad.addColorStop(1, INDIGO_LIGHT);
  ctx.fillStyle = grad;
  roundRect(ctx, leftX, barY, fillW, barH, barH / 2);
  ctx.fill();

  // playhead at the fill edge
  const headX = leftX + paneW * leftFrac;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(headX, cy, barH / 2 + 2, 0, Math.PI * 2);
  ctx.fill();

  // numeric readout + caption
  ctx.fillStyle = DIM;
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "left";
  ctx.fillText(
    `${transform ? "input" : "value"}: ${leftValue.toFixed(1)}`,
    leftX,
    barY - 12
  );
  ctx.fillStyle = FAINT;
  ctx.font = "11px monospace";
  ctx.fillText(transform ? "input" : "the number", leftX, barY + barH + 22);
  ctx.textAlign = "right";
  ctx.fillText(`${Math.round(leftMax)}`, leftX + paneW, barY + barH + 22);
  ctx.textAlign = "left";
  ctx.fillText(`${Math.round(leftMin)}`, leftX + 8, barY + barH + 22);

  // ── Right pane: "what it drives" / "output" — a dot at value / length ───────
  const trackY = cy;
  ctx.strokeStyle = TRACK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rightX, trackY);
  ctx.lineTo(rightX + paneW, trackY);
  ctx.stroke();

  const dotX = rightX + paneW * rightFrac;
  const r = 14;
  const dg = ctx.createRadialGradient(dotX, trackY, 0, dotX, trackY, r);
  dg.addColorStop(0, "#ffedd5");
  dg.addColorStop(1, ORANGE);
  ctx.fillStyle = dg;
  ctx.beginPath();
  ctx.arc(dotX, trackY, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = FAINT;
  ctx.font = "11px monospace";
  ctx.textAlign = "left";
  if (transform) {
    // The "output: X" readout (below) already names this pane, so use the bottom
    // row for the track-end labels — that's what makes clamp's "pin at the walls"
    // read clearly (the dot parks exactly on 0 / length).
    ctx.fillText("0", rightX, trackY + r + 18);
    ctx.textAlign = "right";
    ctx.fillText(`${Math.round(length)}`, rightX + paneW, trackY + r + 18);
    ctx.fillStyle = DIM;
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`output: ${value.toFixed(1)}`, rightX, barY - 12);
  } else {
    ctx.fillText("an object using it", rightX, trackY + r + 18);
  }
}

/** Clamp a fraction into [0, 1] for safe pane positioning. */
function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Small rounded-rect path helper (no Path2D dependency, CodePen-friendly). */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
