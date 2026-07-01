import { lerp } from "./Lerp";

/** An RGB color. Channels are 0–255 (may be fractional mid-interpolation). */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** An HSL color: hue 0–360°, saturation and lightness 0–100%. */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Convert an RGB color to HSL.
 *
 * Hue is the angle on the color wheel; saturation is how vivid (vs. gray) the
 * color is; lightness is how close to black/white. Separating these is what lets
 * you interpolate colors without dragging them through gray — see {@link lerpColorHsl}.
 *
 * @param rgb - Channels 0–255.
 * @returns `{ h, s, l }` with `h` 0–360 and `s`/`l` 0–100.
 * @example
 * rgbToHsl({ r: 255, g: 0, b: 0 }); // => { h: 0, s: 100, l: 50 }
 */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

/**
 * Convert an HSL color back to RGB.
 *
 * Inverse of {@link rgbToHsl}. Hue wraps, so values outside 0–360 are accepted.
 *
 * @param hsl - `h` in degrees (wraps), `s`/`l` 0–100.
 * @returns Channels rounded to integers 0–255.
 * @example
 * hslToRgb({ h: 120, s: 100, l: 50 }); // => { r: 0, g: 255, b: 0 }
 */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = ((((h % 360) + 360) % 360)) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  const m = ln - c / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

/**
 * Interpolate two colors in RGB space — a straight per-channel {@link lerp}.
 *
 * This is the obvious approach, and it has a famous pitfall: blending two vivid
 * complementary colors (e.g. blue↔yellow) passes through a muddy gray at the
 * midpoint, because the midpoint of opposite channels is ~middle-gray. Compare
 * with {@link lerpColorHsl}.
 *
 * @param a - Start color, returned at `t = 0`.
 * @param b - End color, returned at `t = 1`.
 * @param t - Interpolation factor, 0–1.
 * @returns The blended color (channels may be fractional).
 * @example
 * lerpColor({ r: 0, g: 0, b: 255 }, { r: 255, g: 255, b: 0 }, 0.5); // => { r: 127.5, g: 127.5, b: 127.5 } (gray!)
 */
export function lerpColor(a: RGB, b: RGB, t: number): RGB {
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  };
}

/**
 * Interpolate two colors through HSL space, rotating hue the short way around.
 *
 * Because hue, saturation, and lightness move independently, the blend stays
 * vivid instead of collapsing to gray — the colors travel *around* the wheel
 * rather than *through* its desaturated center. This is the perceptually nicer
 * default for gradients. Contrast with {@link lerpColor}.
 *
 * @param a - Start color, returned at `t = 0`.
 * @param b - End color, returned at `t = 1`.
 * @param t - Interpolation factor, 0–1.
 * @returns The blended color, channels rounded to 0–255.
 * @example
 * lerpColorHsl({ r: 0, g: 0, b: 255 }, { r: 255, g: 255, b: 0 }, 0.5); // a vivid mid-hue, not gray
 */
export function lerpColorHsl(a: RGB, b: RGB, t: number): RGB {
  const ha = rgbToHsl(a);
  const hb = rgbToHsl(b);
  // Shortest signed hue delta in (-180, 180], so we never spin the long way.
  const dh = ((((hb.h - ha.h) % 360) + 540) % 360) - 180;
  return hslToRgb({
    h: ha.h + dh * t,
    s: lerp(ha.s, hb.s, t),
    l: lerp(ha.l, hb.l, t),
  });
}

/**
 * Format an RGB color as a CSS `rgb()` string, rounding channels to integers.
 *
 * @param rgb - Channels 0–255 (fractional values are rounded).
 * @returns e.g. `"rgb(255, 128, 0)"`.
 * @example
 * rgbToCss({ r: 255, g: 127.5, b: 0 }); // => "rgb(255, 128, 0)"
 */
export function rgbToCss({ r, g, b }: RGB): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/** Named hue families and the wheel angle range (in degrees) each spans. */
export type HueFamily =
  | "all"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "pink";

/**
 * Hue ranges (degrees) for each named family. `red` uses a negative start so it
 * straddles the 0°/360° seam cleanly — {@link hslToRgb} wraps the hue for you.
 */
export const HUE_FAMILIES: Record<HueFamily, [number, number]> = {
  all: [0, 360],
  red: [-12, 18],
  orange: [18, 45],
  yellow: [45, 70],
  green: [80, 160],
  cyan: [160, 200],
  blue: [200, 250],
  purple: [255, 290],
  pink: [300, 345],
};

/**
 * Build an ordered palette of colors that all belong to one named hue family.
 *
 * The spiritual successor to a "give me a random blue" helper: instead of one
 * random color, you get an evenly-spread *range* within the family (all blues,
 * all greens, …). Hue marches across the family's band while lightness arcs up
 * toward the middle of the ramp, so the set reads as a coherent, lively palette
 * rather than a flat gradient. Deterministic — same args, same palette.
 *
 * @param family - One of {@link HUE_FAMILIES} (`"blue"`, `"yellow"`, `"all"`, …).
 * @param count - How many swatches to produce (>= 1).
 * @returns An array of {@link RGB} colors, ordered across the family's hue range.
 * @example
 * colorFamily("blue", 5);   // five blues, light→deep→light across the band
 * colorFamily("all", 12);   // a full evenly-spaced rainbow
 */
export function colorFamily(family: HueFamily, count: number): RGB[] {
  const [min, max] = HUE_FAMILIES[family] ?? HUE_FAMILIES.all;
  const span = max - min;
  const out: RGB[] = [];
  for (let i = 0; i < count; i++) {
    const f = count <= 1 ? 0.5 : i / (count - 1);
    const h = min + f * span;
    const s = 72;
    const l = 50 + Math.sin(f * Math.PI) * 16; // brighter through the middle of the ramp
    out.push(hslToRgb({ h, s, l }));
  }
  return out;
}
