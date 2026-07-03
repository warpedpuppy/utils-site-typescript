// Lightweight reverse index: a @utilspalooza/core export name → the Examples
// animation(s) that teach it, as { slug, title }. This is a *pure-data
// projection* of ALL_RECORDS (slug/title/coreExports only, visible records with
// at least one coreExport). It is kept as standalone data — NOT imported from
// the registry — so the /api bundle can link every documented function back to
// its Examples page without dragging in the whole registry (the formula wrappers
// eagerly pull core source via ?raw, plus every animation loader).
//
// This file must stay in sync with ALL_RECORDS. registry.test.ts asserts exactly
// that with a toEqual, so it can't silently drift. To regenerate after changing
// the registry, run from the repo root:
//
//   npx vite-node -e 'import("./src/registry/index.ts").then(({ALL_RECORDS})=>\
//     console.log(JSON.stringify(ALL_RECORDS.filter(r=>r.include!==false&&\
//     r.coreExports.length>0).map(r=>({slug:r.slug,title:r.title,\
//     coreExports:r.coreExports})),null,2)))'
//
// and paste the result into EXAMPLE_CORE_ROWS below.

export interface ExampleLink {
  slug: string;
  title: string;
}

interface ExampleCoreRow extends ExampleLink {
  coreExports: string[];
}

// Order mirrors ALL_RECORDS (category order, then insertion order).
export const EXAMPLE_CORE_ROWS: ExampleCoreRow[] = [
  { slug: "ball-bounce", title: "ball bounce", coreExports: ["ballBounce"] },
  {
    slug: "ball-orbiting-a-sun",
    title: "ball orbiting a sun",
    coreExports: ["sphereLighting", "findPointAroundCircle"],
  },
  { slug: "lerp-smooth-follow", title: "lerp (smooth follow)", coreExports: ["lerp"] },
  {
    slug: "easing-functions",
    title: "easing functions",
    coreExports: [
      "linear",
      "easeIn",
      "easeInQuad",
      "easeInCubic",
      "easeInQuart",
      "easeInQuint",
      "easeOut",
      "easeOutQuad",
      "easeOutCubic",
      "easeOutQuart",
      "easeOutQuint",
      "easeInOut",
      "easeInOutQuad",
      "easeInOutCubic",
      "easeInOutQuart",
      "easeInOutQuint",
      "easeOutBounce",
      "easeOutElastic",
    ],
  },
  {
    slug: "spring-damped-harmonic",
    title: "spring (damped harmonic motion)",
    coreExports: ["springValue", "criticalDamping"],
  },
  {
    slug: "move-to-changing-point",
    title: "move object to changing point",
    coreExports: ["moveAlongLine", "getRotation"],
  },
  {
    slug: "quadratic-bezier-curve",
    title: "quadratic bezier curve",
    coreExports: ["quadraticBezier", "bezierPoint"],
  },
  { slug: "bezier-curves", title: "Bézier curves", coreExports: ["deCasteljau"] },
  {
    slug: "sine-curve",
    title: "sine curve",
    coreExports: ["sineCurve", "sineWave"],
  },
  {
    slug: "demystify-sine-and-cosine",
    title: "demystify sine and cosine",
    coreExports: ["unitCirclePoint", "radToDeg"],
  },
  {
    slug: "find-points-on-a-circle",
    title: "find points on a circle",
    coreExports: ["findPointAroundCircle"],
  },
  {
    slug: "point-object-towards-another",
    title: "point object towards another",
    coreExports: ["getRotation"],
  },
  {
    slug: "distribute-around-circle",
    title: "distribute around circle",
    coreExports: ["distributeAroundCircle"],
  },
  {
    slug: "vector-reflection",
    title: "vector reflection (bounce)",
    coreExports: ["vecReflect", "vecNormalize", "vecPerpendicular"],
  },
  { slug: "vector-rotation", title: "vector rotation", coreExports: ["vecRotate"] },
  {
    slug: "angle-lerp-shortest-turn",
    title: "angle interpolation (shortest turn)",
    coreExports: ["lerpAngle", "shortestAngleBetween", "wrapAngle"],
  },
  {
    slug: "point-to-circle-collision",
    title: "point to circle collision",
    coreExports: ["pointToCircle", "pointCircle"],
  },
  {
    slug: "point-to-rectangle-collision",
    title: "point to polygon collision",
    coreExports: ["pointToPolygon", "pointToRect", "polygonPoint"],
  },
  {
    slug: "rectangle-to-rectangle-collision",
    title: "rectangle to rectangle collision",
    coreExports: ["rectToRect", "rectToPolygon", "polygonPolygon"],
  },
  {
    slug: "circle-to-rectangle-collision",
    title: "circle to rectangle collision",
    coreExports: ["circleToRect", "polygonCircle"],
  },
  {
    slug: "circle-to-circle-collision",
    title: "circle to circle collision",
    coreExports: ["circleToCircle", "circleCircle"],
  },
  {
    slug: "line-to-circle-collision",
    title: "line to circle collision",
    coreExports: ["lineToCircle", "lineCircle"],
  },
  {
    slug: "line-to-line-collision",
    title: "line to line collision",
    coreExports: ["lineToLine", "lineLine"],
  },
  {
    slug: "line-to-point-collision",
    title: "line to point collision",
    coreExports: ["lineToPoint", "linePoint"],
  },
  {
    slug: "line-to-rectangle-collision",
    title: "line to rectangle collision",
    coreExports: ["lineToRect", "polygonLine"],
  },
  {
    slug: "polygon-to-polygon-collision",
    title: "polygon to polygon collision",
    coreExports: ["polygonToPolygon", "polygonPolygon"],
  },
  {
    slug: "circle-field",
    title: "circle field (collision at scale)",
    coreExports: ["circleToCircle"],
  },
  { slug: "lerp", title: "lerp", coreExports: ["lerp"] },
  { slug: "inverse-lerp", title: "inverse lerp", coreExports: ["inverseLerp"] },
  { slug: "map-range", title: "map range", coreExports: ["mapRange"] },
  { slug: "clamp", title: "clamp", coreExports: ["clamp"] },
  { slug: "wrap", title: "wrap", coreExports: ["wrap"] },
  { slug: "ping-pong", title: "ping pong", coreExports: ["pingPong"] },
  {
    slug: "smoothstep",
    title: "smoothstep",
    coreExports: ["smoothstep", "smootherstep"],
  },
  {
    slug: "get-a-point-on-a-line",
    title: "get a point on a line",
    coreExports: ["getPointOnLine"],
  },
  {
    slug: "line-length",
    title: "get line length",
    coreExports: ["lineLength", "distance"],
  },
  {
    slug: "get-triangle-data-from-line",
    title: "get triangle data from line",
    coreExports: ["triangleDataFromLine", "getTriangleData"],
  },
  { slug: "draw-star", title: "draw star", coreExports: ["starVertices"] },
  {
    slug: "draw-rectangle",
    title: "draw rectangle (using trig, not rect())",
    coreExports: ["createRect"],
  },
  {
    slug: "equilateral-trianlge-points",
    title: "draw equilateral triangle (from radius and center point)",
    coreExports: ["equilateralTriangle"],
  },
  {
    slug: "circle-from-three-points",
    title: "get circle from three points",
    coreExports: ["circleFromThreePoints"],
  },
  {
    slug: "center-on-parent",
    title: "center on parent",
    coreExports: ["centerOnParent"],
  },
  { slug: "fourier-epicycles", title: "Fourier epicycles", coreExports: ["dft"] },
  {
    slug: "game-of-life",
    title: "Conway's Game of Life",
    coreExports: ["gameOfLifeStep"],
  },
  {
    slug: "wave-interference",
    title: "Wave interference",
    coreExports: ["waveAmplitude"],
  },
  {
    slug: "gravitational-lensing",
    title: "Gravitational lensing",
    coreExports: ["lensDeflection"],
  },
  {
    slug: "orbital-precession",
    title: "Orbital precession (GR)",
    coreExports: ["grStep", "gravitationalStep"],
  },
  {
    slug: "murmuration",
    title: "Murmuration (flocking starlings)",
    coreExports: ["boidsStep"],
  },
  {
    slug: "degrees-to-radians",
    title: "degrees to radians",
    coreExports: ["degToRad"],
  },
  {
    slug: "radians-to-degrees",
    title: "radians to degrees",
    coreExports: ["radToDeg"],
  },
  {
    slug: "format-number-with-commas",
    title: "format number with commas",
    coreExports: ["numberWithCommas"],
  },
  {
    slug: "random-integer-between",
    title: "random integer between",
    coreExports: ["randomIntegerBetween"],
  },
  {
    slug: "random-number-between",
    title: "random number between",
    coreExports: ["randomNumberBetween"],
  },
  {
    slug: "color-lerp",
    title: "color lerp (RGB vs HSL)",
    coreExports: ["lerpColor", "lerpColorHsl", "rgbToCss", "rgbToHsl", "hslToRgb"],
  },
  {
    slug: "color-families",
    title: "color families (pick a range by name)",
    coreExports: ["colorFamily", "getRandomColors", "rgbToCss"],
  },
];

const byExport = new Map<string, ExampleLink[]>();
for (const row of EXAMPLE_CORE_ROWS) {
  const link: ExampleLink = { slug: row.slug, title: row.title };
  for (const name of row.coreExports) {
    const list = byExport.get(name);
    if (list) list.push(link);
    else byExport.set(name, [link]);
  }
}

/**
 * The Examples animation(s) that teach a given core export, in registry order.
 * Empty when nothing on /examples demonstrates it (e.g. the Animate scheduler
 * family and the undemonstrated Vec2 primitives — see DOCS_ONLY_EXPORTS).
 */
export function getExamplesForExport(name: string): ExampleLink[] {
  return byExport.get(name) ?? [];
}
