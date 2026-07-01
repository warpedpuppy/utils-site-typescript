export interface EasingMiniDemoFrame {
  /** The easing output for the current progress, ease(progress). */
  eased: number;
  /** Current linear progress 0→1 (the playhead position along the x-axis). */
  progress: number;
  /** Up to `samples` precomputed [t, ease(t)] points for the static curve. */
  curve: ReadonlyArray<readonly [number, number]>;
  width: number;
  height: number;
  label?: string;
}

const INDIGO = "#6366f1";
const INDIGO_LIGHT = "#c7d2fe";
const ORANGE = "#f97316";
const TRACK = "rgba(255,255,255,0.12)";
const FAINT = "rgba(255,255,255,0.35)";
const DIM = "rgba(255,255,255,0.55)";

// Vertical plot range: padded so elastic/bounce overshoot is fully visible.
const Y_MIN = -0.35;
const Y_MAX = 1.35;
const Y_SPAN = Y_MAX - Y_MIN;

/** Draw one frame of the easing mini-demo. Pure given (ctx, frame) — no math inside. */
export function drawEasingMiniDemo(
  ctx: CanvasRenderingContext2D,
  { eased, progress, curve, width, height, label }: EasingMiniDemoFrame,
): void {
  ctx.clearRect(0, 0, width, height);

  const pad = 22;
  const topInset = label ? 28 : 10;
  const available = height - topInset;
  const curvePaneH = Math.floor(available * 0.68);

  // Curve pane: x-axis labels sit to the left of cLeft.
  const axisLabelW = 18;
  const cLeft = pad + axisLabelW;
  const cRight = width - pad;
  const cTop = topInset;
  const cBottom = cTop + curvePaneH;
  const cW = cRight - cLeft;

  // Motion track: horizontally aligned with the curve pane.
  const tLeft = cLeft;
  const tRight = cRight;
  const tW = tRight - tLeft;
  const tCY = Math.round(cBottom + (height - cBottom) / 2);

  // Coordinate helpers.
  const tToX = (t: number) => cLeft + t * cW;
  const vToY = (v: number) => cBottom - ((v - Y_MIN) / Y_SPAN) * curvePaneH;

  const y0 = vToY(0);
  const y1 = vToY(1);

  // ── Label ─────────────────────────────────────────────────────────────────────
  if (label) {
    ctx.fillStyle = DIM;
    ctx.font = "13px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(label, pad, 18);
  }

  // ── Subtle pane background ────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.025)";
  ctx.fillRect(cLeft, cTop, cW, curvePaneH);

  // ── Gridlines at y=0, y=1, x=0, x=1 ─────────────────────────────────────────
  ctx.strokeStyle = FAINT;
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(cLeft, y0); ctx.lineTo(cRight, y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cLeft, y1); ctx.lineTo(cRight, y1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cLeft, cTop); ctx.lineTo(cLeft, cBottom); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cRight, cTop); ctx.lineTo(cRight, cBottom); ctx.stroke();

  // ── Y-axis labels ─────────────────────────────────────────────────────────────
  ctx.fillStyle = FAINT;
  ctx.font = "10px monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText("1", cLeft - 3, y1);
  ctx.fillText("0", cLeft - 3, y0);

  // ── Axis hints (in the breathing-room gaps, non-intrusive) ───────────────────
  ctx.font = "10px monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  // "time →" in the gap below y=0, right-aligned
  ctx.fillText("time →", cRight, y0 + Math.round((cBottom - y0) / 2) + 4);
  // "↑ value" in the gap above y=1, left-aligned
  ctx.textAlign = "left";
  ctx.fillText("↑ value", cLeft + 2, y1 - 4);

  // ── Diagonal y=x reference (what linear easing looks like) ───────────────────
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(tToX(0), vToY(0));
  ctx.lineTo(tToX(1), vToY(1));
  ctx.stroke();
  ctx.setLineDash([]);

  // ── Easing curve ──────────────────────────────────────────────────────────────
  if (curve.length > 1) {
    const grad = ctx.createLinearGradient(cLeft, 0, cRight, 0);
    grad.addColorStop(0, INDIGO);
    grad.addColorStop(1, INDIGO_LIGHT);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const [t0, v0] = curve[0];
    ctx.moveTo(tToX(t0), vToY(v0));
    for (let i = 1; i < curve.length; i++) {
      const [t, v] = curve[i];
      ctx.lineTo(tToX(t), vToY(v));
    }
    ctx.stroke();
  }

  // ── Riding dot on the curve at (progress, eased) ─────────────────────────────
  const dotX = tToX(progress);
  const dotY = vToY(eased);
  const dotR = 5;
  const dg = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, dotR * 2);
  dg.addColorStop(0, "#ffedd5");
  dg.addColorStop(1, ORANGE);
  ctx.fillStyle = dg;
  ctx.beginPath();
  ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
  ctx.fill();

  // ── Motion track rail ─────────────────────────────────────────────────────────
  ctx.strokeStyle = TRACK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tLeft, tCY);
  ctx.lineTo(tRight, tCY);
  ctx.stroke();

  // Input marker: progress at constant speed, muted indigo (the "linear" reference).
  const inputX = tLeft + progress * tW;
  ctx.fillStyle = INDIGO;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(inputX, tCY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Output marker: eased output, accent orange, allowed to overshoot past rail ends.
  const rawOutputX = tLeft + eased * tW;
  const outputX = Math.max(pad / 2, Math.min(width - pad / 2, rawOutputX));
  const odg = ctx.createRadialGradient(outputX, tCY, 0, outputX, tCY, 9);
  odg.addColorStop(0, "#ffedd5");
  odg.addColorStop(1, ORANGE);
  ctx.fillStyle = odg;
  ctx.beginPath();
  ctx.arc(outputX, tCY, 9, 0, Math.PI * 2);
  ctx.fill();
}
