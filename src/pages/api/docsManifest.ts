export type ModuleDocMode = "reference" | "guide";
export type GuideKind = "system" | "concept";
export type DocVisualKind = "mini-demo" | "example" | "none";

export interface ApiEntryLike {
  name: string;
  module: string;
}

export interface ModuleGuide {
  title: string;
  guideKind: GuideKind;
  badgeLabel: string;
  whatItIs: string;
  howToStart: string;
  importSnippet: string;
  keyPieceNames: string[];
}

export interface DocVisualConfig {
  kind: DocVisualKind;
  exampleSlug?: string;
  exampleLabel?: string;
}

export interface ConceptDefinition {
  title: string;
  blurb: string;
  modules: string[];
}

export const CONCEPTS: ConceptDefinition[] = [
  {
    title: "Numbers in motion",
    blurb:
      "The scalar building blocks: turn time, input, or distance into a usable value. Almost every animation downstream is just these, repeated.",
    modules: ["Lerp", "InverseLerp", "MapRange", "Clamp", "Wrap", "PingPong", "Smoothstep"],
  },
  {
    title: "Easing & tweening",
    blurb:
      "Why motion feels alive instead of robotic. The curves that shape acceleration, plus tiny time-driven helpers that sample them — they move values, never your render layer.",
    modules: ["Easing", "Animate"],
  },
  {
    title: "Angles & trigonometry",
    blurb:
      "Where sine and cosine stop being homework and become rotation, orbits, and waves. Degrees, radians, and the unit circle, made visible.",
    modules: [
      "AngleInterpolation", "DegToRad", "RadToDeg", "UnitCirclePoint",
      "GetRotation", "SineCurve", "SineWave", "WaveAmplitude", "DFT",
    ],
  },
  {
    title: "Vectors",
    blurb:
      "How anything that moves knows where it is going. Add, scale, rotate, reflect, normalize — the grammar of position and velocity in 2D.",
    modules: ["Vec2"],
  },
  {
    title: "Points, lines & curves",
    blurb:
      "The geometry under shapes and paths: distances, points along a line, triangle math, Bezier curves, and placing things evenly around a circle.",
    modules: [
      "Distance", "LineLength", "GetPointOnLine", "MoveAlongLine", "MoveToward",
      "GetTriangleData", "CircleFromThreePoints", "FindPointAroundCircle",
      "DistributeAroundCircle", "EquilateralTriangle", "Rectangle", "Star",
      "QuadraticBezier", "BezierCurve",
    ],
  },
  {
    title: "Collision detection",
    blurb:
      "The question every game asks: are these two things touching? Circles, rectangles, lines, points, and polygons, in every combination.",
    modules: [
      "CircleToCircle", "CircleToRect", "LineToCircle", "LineToLine",
      "LineToPoint", "LineToRect", "PointToCircle", "PointToRect",
      "PolygonToPolygon", "RectToRect",
      "CollisionObjectAPI/CircleCircle", "CollisionObjectAPI/LineCircle",
      "CollisionObjectAPI/LineLine", "CollisionObjectAPI/LinePoint",
      "CollisionObjectAPI/PointCircle", "CollisionObjectAPI/PolygonCircle",
      "CollisionObjectAPI/PolygonLine", "CollisionObjectAPI/PolygonPoint",
      "CollisionObjectAPI/PolygonPolygon",
    ],
  },
  {
    title: "Color",
    blurb:
      "Color as math you can interpolate. Convert between RGB and HSL, blend two colors, and build palettes that actually go together.",
    modules: ["Color", "GetRandomColors"],
  },
  {
    title: "Physics & systems",
    blurb:
      "Where simple rules produce complex, lifelike behavior: bouncing, orbits, flocking, gravity, lensing, and cellular automata.",
    modules: [
      "Boids", "BallBounce", "BallToBallBounce", "OrbitalMotion",
      "GameOfLife", "GRStep", "LensDeflection", "SphereLighting",
    ],
  },
  {
    title: "Helpers",
    blurb:
      "The small conveniences every demo needs and nobody wants to rewrite: random numbers, number formatting, centering on a parent.",
    modules: ["RandomIntegerBetween", "RandomNumberBetween", "NumberWithCommas", "CenterOnParent"],
  },
  {
    title: "Core types",
    blurb:
      "The shared shapes — Point, Circle, Line, Polygon, Vector — that the whole library speaks in.",
    modules: ["types"],
  },
];

export const CATCH_ALL_CONCEPT = {
  title: "More core math",
  blurb: "Recently added to the package and not yet slotted into a concept above.",
};

export const MODULE_GUIDES: Partial<Record<string, ModuleGuide>> = {
  Animate: {
    title: "Animation toolkit guide",
    guideKind: "system",
    badgeLabel: "system guide",
    whatItIs:
      "These are time-sampling helpers. They do not draw anything and they do not own your render loop. Their job is to turn elapsed time into usable values or frames of numeric state.",
    howToStart:
      "Start with `tweenValue` for one number, `tweenObject` for several numbers, `springValue` for spring motion, and `ticker` only if you want the package to own the frame loop callback.",
    importSnippet: `import { tweenValue, tweenObject, springValue, ticker } from "@utilspalooza/core";`,
    keyPieceNames: ["tweenValue", "tweenObject", "springValue", "ticker", "loop", "yoyo", "delay", "stagger"],
  },
  Boids: {
    title: "Boids system guide",
    guideKind: "system",
    badgeLabel: "system guide",
    whatItIs:
      "This module is a small flocking system, not just one formula. It gives you both a low-level stepping function and a higher-level flock object, while leaving drawing and timing to your app.",
    howToStart:
      "Most people should start with `Flock`: create it once, call `step()` each frame, then draw `flock.boids`. Reach for `boidsStep` only when you already manage your own boid array and want full control.",
    importSnippet: `import { Flock, DEFAULT_BOIDS_OPTIONS } from "@utilspalooza/core";`,
    keyPieceNames: ["Flock", "boidsStep", "DEFAULT_BOIDS_OPTIONS", "BoidsOptions", "Boid", "FlockBounds"],
  },
  Color: {
    title: "Color toolkit guide",
    guideKind: "concept",
    badgeLabel: "concept set",
    whatItIs:
      "This module is a small color toolbox. The pieces are related: convert between RGB and HSL, interpolate in either space, turn colors into CSS strings, or generate a coherent hue-family palette.",
    howToStart:
      "Start with `lerpColor` versus `lerpColorHsl` if you are choosing how to blend colors. Use `rgbToHsl` and `hslToRgb` when you need to reason about hue/saturation/lightness directly, and `colorFamily` when you want a ready-made palette.",
    importSnippet: `import { lerpColor, lerpColorHsl, rgbToHsl, hslToRgb, colorFamily } from "@utilspalooza/core";`,
    keyPieceNames: ["lerpColor", "lerpColorHsl", "rgbToHsl", "hslToRgb", "colorFamily", "rgbToCss", "HUE_FAMILIES", "RGB", "HSL", "HueFamily"],
  },
  Vec2: {
    title: "Vector toolkit guide",
    guideKind: "concept",
    badgeLabel: "concept set",
    whatItIs:
      "This is the grammar of 2D movement. The exports are small, but they belong together: add and scale vectors, measure them, rotate them, reflect them, and cap their length.",
    howToStart:
      "Start with `vecAdd`, `vecSubtract`, `vecScale`, and `vecNormalize` if you are building motion. Reach for `vecDot`, `vecAngleBetween`, and `vecReflect` when you need direction tests, turning behavior, or bounce math.",
    importSnippet: `import { vecAdd, vecSubtract, vecScale, vecNormalize, vecDot, vecReflect } from "@utilspalooza/core";`,
    keyPieceNames: ["vecAdd", "vecSubtract", "vecScale", "vecNormalize", "vecDot", "vecAngleBetween", "vecReflect", "vecRotate", "vecLimit"],
  },
};

export const MODULE_ENTRY_ORDER: Partial<Record<string, string[]>> = {
  Easing: [
    "linear",
    "easeIn", "easeOut", "easeInOut",
    "easeInQuad", "easeOutQuad", "easeInOutQuad",
    "easeInCubic", "easeOutCubic", "easeInOutCubic",
    "easeInQuart", "easeOutQuart", "easeInOutQuart",
    "easeInQuint", "easeOutQuint", "easeInOutQuint",
    "easeOutElastic", "easeOutBounce",
  ],
  Animate: [
    "tweenValue",
    "tweenObject",
    "springValue",
    "ticker",
    "loop",
    "yoyo",
    "delay",
    "stagger",
    "criticalDamping",
    "tweenFrame",
    "EasingFunction",
    "TweenValueOptions",
    "TweenObjectSpec",
    "SpringOptions",
    "SpringState",
    "TickerFrame",
    "TickerHandle",
  ],
  Boids: [
    "Flock",
    "boidsStep",
    "DEFAULT_BOIDS_OPTIONS",
    "BoidsOptions",
    "Boid",
    "FlockBounds",
  ],
  Color: [
    "lerpColor",
    "lerpColorHsl",
    "rgbToHsl",
    "hslToRgb",
    "colorFamily",
    "rgbToCss",
    "HUE_FAMILIES",
    "RGB",
    "HSL",
    "HueFamily",
  ],
  Vec2: [
    "vecAdd",
    "vecSubtract",
    "vecScale",
    "vecNormalize",
    "vecMagnitude",
    "vecMagnitudeSquared",
    "vecDot",
    "vecCross",
    "vecAngle",
    "vecAngleBetween",
    "vecRotate",
    "vecPerpendicular",
    "vecReflect",
    "vecLerp",
    "vecLimit",
  ],
};

export const ENTRY_VISUALS: Partial<Record<string, DocVisualConfig>> = {
  // Easing mini-demos (all 18 functions from Easing.ts, in teaching order)
  linear: { kind: "mini-demo" },
  easeIn: { kind: "mini-demo" },
  easeOut: { kind: "mini-demo" },
  easeInOut: { kind: "mini-demo" },
  easeInQuad: { kind: "mini-demo" },
  easeOutQuad: { kind: "mini-demo" },
  easeInOutQuad: { kind: "mini-demo" },
  easeInCubic: { kind: "mini-demo" },
  easeOutCubic: { kind: "mini-demo" },
  easeInOutCubic: { kind: "mini-demo" },
  easeInQuart: { kind: "mini-demo" },
  easeOutQuart: { kind: "mini-demo" },
  easeInOutQuart: { kind: "mini-demo" },
  easeInQuint: { kind: "mini-demo" },
  easeOutQuint: { kind: "mini-demo" },
  easeInOutQuint: { kind: "mini-demo" },
  easeOutElastic: { kind: "mini-demo" },
  easeOutBounce: { kind: "mini-demo" },
  // Scalar primitive mini-demos
  pingPong: { kind: "mini-demo" },
  lerp: { kind: "mini-demo" },
  inverseLerp: { kind: "mini-demo" },
  mapRange: { kind: "mini-demo" },
  clamp: { kind: "mini-demo" },
  wrap: { kind: "mini-demo" },
  smoothstep: { kind: "mini-demo" },
  smootherstep: { kind: "mini-demo" },
  ticker: { kind: "mini-demo" },
  tweenValue: { kind: "mini-demo" },
  tweenObject: { kind: "mini-demo" },
  tweenFrame: { kind: "mini-demo" },
  loop: { kind: "mini-demo" },
  yoyo: { kind: "mini-demo" },
  delay: { kind: "mini-demo" },
  stagger: { kind: "mini-demo" },
  ballBounce: { kind: "example", exampleSlug: "ball-bounce", exampleLabel: "Open the ball bounce example" },
  ballToBallBounce: { kind: "example", exampleSlug: "balls-bouncing-against-each-other", exampleLabel: "Open the ball-to-ball bounce example" },
  Flock: { kind: "example", exampleSlug: "murmuration", exampleLabel: "Open the murmuration example" },
  boidsStep: { kind: "example", exampleSlug: "murmuration", exampleLabel: "Open the murmuration example" },
  bezierPoint: { kind: "example", exampleSlug: "bezier-curves", exampleLabel: "Open the Bezier curves example" },
  deCasteljau: { kind: "example", exampleSlug: "bezier-curves", exampleLabel: "Open the Bezier curves example" },
  centerOnParent: { kind: "example", exampleSlug: "center-on-parent", exampleLabel: "Open the center-on-parent example" },
  quadraticBezier: { kind: "example", exampleSlug: "quadratic-bezier-curve", exampleLabel: "Open the quadratic Bezier example" },
  circleFromThreePoints: { kind: "example", exampleSlug: "circle-from-three-points", exampleLabel: "Open the circle-from-three-points example" },
  circleToCircle: { kind: "mini-demo" },
  circleCircle: { kind: "mini-demo" },
  circleToRect: { kind: "example", exampleSlug: "circle-to-rectangle-collision", exampleLabel: "Open the circle-to-rectangle example" },
  colorFamily: { kind: "example", exampleSlug: "color-families", exampleLabel: "Open the color families example" },
  hslToRgb: { kind: "mini-demo" },
  lerpColor: { kind: "example", exampleSlug: "color-lerp", exampleLabel: "Open the color lerp example" },
  lerpColorHsl: { kind: "example", exampleSlug: "color-lerp", exampleLabel: "Open the color lerp example" },
  rgbToCss: { kind: "mini-demo" },
  rgbToHsl: { kind: "mini-demo" },
  degToRad: { kind: "example", exampleSlug: "degrees-to-radians", exampleLabel: "Open the degrees-to-radians example" },
  dft: { kind: "example", exampleSlug: "fourier-epicycles", exampleLabel: "Open the Fourier epicycles example" },
  distributeAroundCircle: { kind: "example", exampleSlug: "distribute-around-circle", exampleLabel: "Open the distribute-around-circle example" },
  equilateralTriangle: { kind: "example", exampleSlug: "equilateral-trianlge-points", exampleLabel: "Open the equilateral triangle example" },
  findPointAroundCircle: { kind: "example", exampleSlug: "find-points-on-a-circle", exampleLabel: "Open the points-on-a-circle example" },
  gameOfLifeStep: { kind: "example", exampleSlug: "game-of-life", exampleLabel: "Open the Game of Life example" },
  getPointOnLine: { kind: "example", exampleSlug: "get-a-point-on-a-line", exampleLabel: "Open the point-on-a-line example" },
  getTriangleData: { kind: "example", exampleSlug: "get-triangle-data-from-line", exampleLabel: "Open the triangle-data example" },
  getRotation: { kind: "mini-demo" },
  getRandomColors: { kind: "mini-demo" },
  grStep: { kind: "example", exampleSlug: "orbital-precession", exampleLabel: "Open the orbital precession example" },
  gravitationalStep: { kind: "example", exampleSlug: "orbital-precession", exampleLabel: "Open the orbital precession example" },
  lerpAngle: { kind: "mini-demo" },
  shortestAngleBetween: { kind: "mini-demo" },
  wrapAngle: { kind: "mini-demo" },
  lensDeflection: { kind: "example", exampleSlug: "gravitational-lensing", exampleLabel: "Open the gravitational lensing example" },
  distance: { kind: "mini-demo" },
  lineToCircle: { kind: "example", exampleSlug: "line-to-circle-collision", exampleLabel: "Open the line-to-circle collision example" },
  lineCircle: { kind: "example", exampleSlug: "line-to-circle-collision", exampleLabel: "Open the line-to-circle collision example" },
  lineToLine: { kind: "example", exampleSlug: "line-to-line-collision", exampleLabel: "Open the line-to-line collision example" },
  lineLine: { kind: "example", exampleSlug: "line-to-line-collision", exampleLabel: "Open the line-to-line collision example" },
  lineToPoint: { kind: "example", exampleSlug: "line-to-point-collision", exampleLabel: "Open the line-to-point collision example" },
  linePoint: { kind: "example", exampleSlug: "line-to-point-collision", exampleLabel: "Open the line-to-point collision example" },
  lineToRect: { kind: "example", exampleSlug: "line-to-rectangle-collision", exampleLabel: "Open the line-to-rectangle collision example" },
  lineLength: { kind: "example", exampleSlug: "line-length", exampleLabel: "Open the line-length example" },
  moveAlongLine: { kind: "example", exampleSlug: "move-to-changing-point", exampleLabel: "Open the move-along-line example" },
  moveToward: { kind: "example", exampleSlug: "move-to-changing-point", exampleLabel: "Open the move-toward example" },
  numberWithCommas: { kind: "example", exampleSlug: "format-number-with-commas", exampleLabel: "Open the format-number example" },
  pointCircle: { kind: "example", exampleSlug: "point-to-circle-collision", exampleLabel: "Open the point-to-circle example" },
  pointToCircle: { kind: "example", exampleSlug: "point-to-circle-collision", exampleLabel: "Open the point-to-circle example" },
  pointToRect: { kind: "example", exampleSlug: "point-to-rectangle-collision", exampleLabel: "Open the point-to-rectangle example" },
  polygonCircle: { kind: "example", exampleSlug: "circle-to-rectangle-collision", exampleLabel: "Open the polygon-circle example" },
  polygonLine: { kind: "example", exampleSlug: "line-to-rectangle-collision", exampleLabel: "Open the polygon-line example" },
  polygonPoint: { kind: "example", exampleSlug: "point-to-rectangle-collision", exampleLabel: "Open the polygon-point example" },
  polygonPolygon: { kind: "example", exampleSlug: "polygon-to-polygon-collision", exampleLabel: "Open the polygon collision example" },
  polygonToPolygon: { kind: "example", exampleSlug: "polygon-to-polygon-collision", exampleLabel: "Open the polygon collision example" },
  radToDeg: { kind: "example", exampleSlug: "radians-to-degrees", exampleLabel: "Open the radians-to-degrees example" },
  randomIntegerBetween: { kind: "example", exampleSlug: "random-integer-between", exampleLabel: "Open the random integer example" },
  randomNumberBetween: { kind: "example", exampleSlug: "random-number-between", exampleLabel: "Open the random number example" },
  createRect: { kind: "example", exampleSlug: "draw-rectangle", exampleLabel: "Open the rectangle example" },
  rectToRect: { kind: "example", exampleSlug: "rectangle-to-rectangle-collision", exampleLabel: "Open the rectangle collision example" },
  sineCurve: { kind: "mini-demo" },
  springValue: { kind: "example", exampleSlug: "spring-damped-harmonic", exampleLabel: "Open the spring example" },
  sphereLighting: { kind: "mini-demo" },
  criticalDamping: { kind: "example", exampleSlug: "spring-damped-harmonic", exampleLabel: "Open the spring example" },
  starVertices: { kind: "example", exampleSlug: "draw-star", exampleLabel: "Open the star example" },
  sineWave: { kind: "mini-demo" },
  triangleDataFromLine: { kind: "example", exampleSlug: "get-triangle-data-from-line", exampleLabel: "Open the triangle-data example" },
  unitCirclePoint: { kind: "mini-demo" },
  vecAdd: { kind: "mini-demo" },
  vecSubtract: { kind: "mini-demo" },
  vecScale: { kind: "mini-demo" },
  vecMagnitude: { kind: "mini-demo" },
  vecMagnitudeSquared: { kind: "mini-demo" },
  vecNormalize: { kind: "mini-demo" },
  vecAngle: { kind: "mini-demo" },
  vecDot: { kind: "mini-demo" },
  vecCross: { kind: "mini-demo" },
  vecAngleBetween: { kind: "mini-demo" },
  vecPerpendicular: { kind: "mini-demo" },
  vecLerp: { kind: "mini-demo" },
  vecLimit: { kind: "mini-demo" },
  vecReflect: { kind: "example", exampleSlug: "vector-reflection", exampleLabel: "Open the vector reflection example" },
  vecRotate: { kind: "example", exampleSlug: "vector-rotation", exampleLabel: "Open the vector rotation example" },
  waveAmplitude: { kind: "mini-demo" },
};

const ENTRY_USAGE_LEADS: Partial<Record<string, string>> = {
  "Boids:Flock": "Start here if you want a ready-to-own flock object.",
  "Boids:boidsStep": "Use this when you already own the boid array and just need one deterministic simulation tick.",
  "Animate:ticker": "Use this only if you want the library to drive your frame loop callback.",
  "Animate:tweenObject": "Best when several numeric properties need to move together from one elapsed time value.",
  "Animate:tweenValue": "The simplest animation helper here: one number in, one number out.",
  "Animate:springValue": "Use this for spring motion when easing curves feel too mechanical.",
  "DegToRad:degToRad": "Use this at the edge where a human thinks in degrees but `Math.sin` and `Math.cos` still want radians.",
  "RadToDeg:radToDeg": "Use this when the math is already in radians but the explanation, label, or UI should speak degrees.",
  "Color:lerpColor": "The straight per-channel blend: simple, sometimes muddy.",
  "Color:lerpColorHsl": "Usually the nicer visual blend: colors travel around the wheel instead of collapsing through gray.",
  "Color:colorFamily": "Use this when you want a coherent palette, not one isolated color.",
  "UnitCirclePoint:unitCirclePoint": "Start here for trig that actually teaches: one angle gives you the point, plus the raw cosine and sine components.",
  "SineCurve:sineCurve": "The time-driven oscillation helper: feed it the same angle from the unit circle and you get the matching vertical sine position back.",
  "SineWave:sineWave": "Use this when the oscillation lives across x-position instead of only over time.",
  "WaveAmplitude:waveAmplitude": "Use this when several emitters overlap and you need the combined interference value at one sample point.",
  "Vec2:vecNormalize": "One of the core motion primitives: keep direction, force length to 1.",
  "Vec2:vecDot": "Use this to ask directional questions: same way, opposite way, or perpendicular?",
  "Vec2:vecReflect": "The bounce helper: incoming vector plus surface normal gives you the outgoing direction.",
};

export function makeConceptId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getModuleDocMode(module: string): ModuleDocMode {
  return MODULE_GUIDES[module] ? "guide" : "reference";
}

export function getEntryUsageLead(
  entry: Pick<ApiEntryLike, "module" | "name"> & { kind?: "function" | "const" | "type" },
): string {
  const direct = ENTRY_USAGE_LEADS[`${entry.module}:${entry.name}`];
  if (direct) return direct;
  if (entry.kind === "type") {
    return "Shared shape/type information for the runtime APIs around it.";
  }
  if (entry.kind === "const") {
    return "Reusable exported data you can import directly instead of rebuilding yourself.";
  }
  return "A small pure function: read the signature, scan the params, then steal the example.";
}

export function getEntryVisual(name: string): DocVisualConfig {
  return ENTRY_VISUALS[name] ?? { kind: "none" };
}
