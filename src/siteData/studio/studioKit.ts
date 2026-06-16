// ─── studioKit ───────────────────────────────────────────────────────────────
// Small shared UI helpers for the "Build With It" studio projects, so each
// project file can focus on its actual canvas logic instead of re-deriving the
// same control-panel boilerplate. Every project gets the same look: a dark
// glass panel pinned to the bottom of the canvas with sliders/buttons and an
// "open in CodePen" form.

import { buildCodePenForm, CodePenPayload } from "./codepen";

// Inject the "Design Decisions" HTML into the studio notes panel.
export function injectStudioNotes(html: string): void {
  const el = document.getElementById("studio-text-content");
  if (el) el.innerHTML = html;
}

export const STUDIO_BTN_STYLE = [
  "background:rgba(100,200,255,0.12)",
  "border:1px solid rgba(100,200,255,0.35)",
  "color:#bfe3ff",
  "padding:5px 12px",
  "border-radius:4px",
  "cursor:pointer",
  "font-family:'Space Mono',monospace",
  "font-size:11px",
].join(";");

// A glass control panel pinned to the bottom-center of the canvas container.
export function makeControlPanel(): HTMLDivElement {
  const panel = document.createElement("div");
  panel.className = "studio-control-panel";
  panel.style.cssText = [
    "position:absolute",
    "bottom:16px",
    "left:50%",
    "transform:translateX(-50%)",
    "display:flex",
    "gap:16px",
    "align-items:center",
    "flex-wrap:wrap",
    "justify-content:center",
    "max-width:calc(100% - 24px)",
    "background:rgba(8,8,18,0.9)",
    "border:1px solid rgba(120,170,235,0.28)",
    "border-radius:10px",
    "padding:10px 18px",
    "font-family:'Space Mono',monospace",
    "font-size:11px",
    "color:#a8c6e0",
    "z-index:10",
    "backdrop-filter:blur(4px)",
  ].join(";");
  return panel;
}

export function makeButton(
  label: string,
  onClick: () => void,
): HTMLButtonElement {
  const b = document.createElement("button");
  b.textContent = label;
  b.style.cssText = STUDIO_BTN_STYLE;
  b.addEventListener("click", onClick);
  return b;
}

// A labelled range slider with a live value readout. `format` controls the
// readout text; the live numeric value is passed to `onChange`.
export function makeSlider(opts: {
  label: string;
  min: number;
  max: number;
  value: number;
  step: number;
  width?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}): HTMLElement {
  const {
    label,
    min,
    max,
    value,
    step,
    width = "84px",
    format,
    onChange,
  } = opts;
  const fmt = format ?? ((v: number) => String(v));

  const wrap = document.createElement("label");
  wrap.style.cssText =
    "display:flex;gap:7px;align-items:center;white-space:nowrap;";

  const lbl = document.createElement("span");
  lbl.textContent = label;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = String(min);
  slider.max = String(max);
  slider.step = String(step);
  slider.value = String(value);
  slider.style.width = width;

  const out = document.createElement("span");
  out.textContent = fmt(value);
  out.style.cssText = "min-width:34px;color:#dcecff;";

  slider.addEventListener("input", () => {
    const v = Number(slider.value);
    out.textContent = fmt(v);
    onChange(v);
  });

  wrap.append(lbl, slider, out);
  return wrap;
}

// Classic Ken Perlin permutation-table 2D noise. Returns a fresh `perlin2`
// closure with its own shuffled table, so each instance is independent.
export function createPerlin2(): (x: number, y: number) => number {
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = [...p, ...p];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -v : v);
  };
  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const a = perm[X] + Y;
    const b = perm[X + 1] + Y;
    return lerp(
      lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u),
      lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u),
      v,
    );
  };
}

// Linear interpolation + a cubic ease — the studio's "natural motion" primitive.
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Append the "open in CodePen" form (native submit button) to a panel.
export function appendCodePenButton(
  panel: HTMLElement,
  payload: CodePenPayload,
  label = "open in CodePen ↗",
): void {
  panel.appendChild(buildCodePenForm(payload, label, STUDIO_BTN_STYLE));
}
