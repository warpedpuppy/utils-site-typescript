export function centerOnParent(item: any, parent: any) {
  let x = (parent.width - item.width) / 2;
  let y = (parent.height - item.height) / 2;
  return { x, y };
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function randomIntBetween(min: number, max: number) {
  max++;
  return Math.floor(Math.random() * (max - min) + min);
}
export function randomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randomBlue() {
  // Color Channel (OKHSL)	Range
  // Hue	210° - 260°
  // Saturation	70% - 100%
  // Lightness	30% - 70%
  return {};
}

export function hexToRgb(hex: any) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function deg2rad(degree: number) {
  return degree * (Math.PI / 180);
}
export function rad2deg(radians: number) {
  return (radians * 180) / Math.PI;
}

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export {};
