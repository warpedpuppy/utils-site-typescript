export function sphereLighting(
  sphere: any,
  lightSource: any,
  highlightReach: any = 0.4
) {
  const angleToLight = Math.atan2(
    lightSource.y - sphere.y,
    lightSource.x - sphere.x
  );
  return {
    x: sphere.x + Math.cos(angleToLight) * sphere.radius * highlightReach,
    y: sphere.y + Math.sin(angleToLight) * sphere.radius * highlightReach,
  };
}
