import { CollisionDetectionObject } from "../../../../types/types";
import { colorFamily } from "@utilspalooza/core/Color";

const functionString = `// Named hue bands on the color wheel (degrees).
const HUE_FAMILIES = {
  all: [0, 360], red: [-12, 18], orange: [18, 45], yellow: [45, 70],
  green: [80, 160], cyan: [160, 200], blue: [200, 250],
  purple: [255, 290], pink: [300, 345],
};

// Give me a *range* of one color family, e.g. colorFamily("blue", 5).
function colorFamily(family, count) {
  const [min, max] = HUE_FAMILIES[family] ?? HUE_FAMILIES.all;
  const span = max - min;
  const out = [];
  for (let i = 0; i < count; i++) {
    const f = count <= 1 ? 0.5 : i / (count - 1);
    const h = min + f * span;
    const s = 72;
    const l = 50 + Math.sin(f * Math.PI) * 16;
    out.push(hslToRgb({ h, s, l }));
  }
  return out;
}`;

export const colorFamilyFormula: CollisionDetectionObject = {
  keyFunction: colorFamily,
  dependencies: ["hslToRgb"],
  interfaces: ["RGB"],
  functionString,
};
