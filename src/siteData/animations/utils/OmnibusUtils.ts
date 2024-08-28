import { Point, Polygon } from "../../../types/shapes";
export function centerOnStage(item: any, parent: any) {
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

export function getAtan2(originPoint: Point, destinationPoint: Point) {
  return Math.atan2(
    destinationPoint.y - originPoint.y,
    destinationPoint.x - originPoint.x
  );
}

export function distanceBetweenTwoPoints(startPoint: Point, endPoint: Point) {
  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;
  return Math.sqrt(a * a + b * b);
}

export {};
