import { randomIntegerBetween } from "./RandomIntegerBetween";

/**
 * Pick a random HSL color, optionally biased toward a named hue family.
 *
 * Returns hue/saturation/lightness components (not a CSS string) so the caller can
 * format them. Picking the hue from a restricted range keeps random colors within
 * a recognizable family (e.g. all blues).
 *
 * @param str - A color family to stay within: `"red"`, `"orange"`, `"yellow"`,
 *   `"green"`, or `"blue"`. Anything else (default `"all"`) spans the full wheel.
 * @returns `{ H, S, L }` — hue (0–360), saturation (50–100), lightness (25–75).
 * @example
 * const { H, S, L } = getRandomColors("blue");
 * const css = `hsl(${H}, ${S}%, ${L}%)`;
 */
export function getRandomColors(str: string = "all"): { H: number; S: number; L: number } {
  let range = [0, 360];
  if (str.includes("blue")) {
    range = [200, 250];
  } else if (str.includes("green")) {
    range = [80, 150];
  } else if (str.includes("orange")) {
    range = [40, 80];
  } else if (str.includes("red")) {
    range = [0, 40];
  } else if (str.includes("yellow")) {
    range = [51, 60];
  } else {
    range = [0, 360];
  }
  let H = randomIntegerBetween(range[0], range[1]);
  let S = randomIntegerBetween(50, 100);
  let L = randomIntegerBetween(25, 75);
  return { H, S, L };
}
