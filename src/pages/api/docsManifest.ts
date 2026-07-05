export type ModuleDocMode = "reference" | "guide";
export type GuideKind = "system" | "concept";
export type DocVisualKind = "mini-demo" | "example" | "none";
export type EntryTabPanel = "intro" | "visual" | "reference";

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

export interface EntryTabConfig {
  id: string;
  label: string;
  panel: EntryTabPanel;
}

export interface RelatedEntryConfig {
  name: string;
  reason: string;
}

export interface EntryDocConfig {
  whatItIs?: string;
  howToUse?: string;
  related?: RelatedEntryConfig[];
  tabs?: EntryTabConfig[];
}

export interface ApiEntryDocLike extends ApiEntryLike {
  kind?: "function" | "const" | "type";
  description?: string;
  signature?: string;
  example?: string;
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
      "PointToPolygon", "RectToPolygon", "PolygonToPolygon", "RectToRect",
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
  circleToRect: { kind: "mini-demo" },
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
  lineToCircle: { kind: "mini-demo" },
  lineCircle: { kind: "example", exampleSlug: "line-to-circle-collision", exampleLabel: "Open the line-to-circle collision example" },
  lineToLine: { kind: "mini-demo" },
  lineLine: { kind: "example", exampleSlug: "line-to-line-collision", exampleLabel: "Open the line-to-line collision example" },
  lineToPoint: { kind: "mini-demo" },
  linePoint: { kind: "example", exampleSlug: "line-to-point-collision", exampleLabel: "Open the line-to-point collision example" },
  lineToRect: { kind: "mini-demo" },
  lineLength: { kind: "example", exampleSlug: "line-length", exampleLabel: "Open the line-length example" },
  moveAlongLine: { kind: "example", exampleSlug: "move-to-changing-point", exampleLabel: "Open the move-along-line example" },
  moveToward: { kind: "example", exampleSlug: "move-to-changing-point", exampleLabel: "Open the move-toward example" },
  numberWithCommas: { kind: "example", exampleSlug: "format-number-with-commas", exampleLabel: "Open the format-number example" },
  pointCircle: { kind: "example", exampleSlug: "point-to-circle-collision", exampleLabel: "Open the point-to-circle example" },
  pointToCircle: { kind: "mini-demo" },
  pointToPolygon: { kind: "mini-demo" },
  pointToRect: { kind: "mini-demo" },
  polygonCircle: { kind: "mini-demo" },
  polygonLine: { kind: "mini-demo" },
  polygonPoint: { kind: "mini-demo" },
  polygonPolygon: { kind: "mini-demo" },
  polygonToPolygon: { kind: "mini-demo" },
  radToDeg: { kind: "example", exampleSlug: "radians-to-degrees", exampleLabel: "Open the radians-to-degrees example" },
  randomIntegerBetween: { kind: "example", exampleSlug: "random-integer-between", exampleLabel: "Open the random integer example" },
  randomNumberBetween: { kind: "example", exampleSlug: "random-number-between", exampleLabel: "Open the random number example" },
  createRect: { kind: "example", exampleSlug: "draw-rectangle", exampleLabel: "Open the rectangle example" },
  rectToPolygon: { kind: "mini-demo" },
  rectToRect: { kind: "mini-demo" },
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
  vecReflect: { kind: "mini-demo" },
  vecRotate: { kind: "example", exampleSlug: "vector-rotation", exampleLabel: "Open the vector rotation example" },
  waveAmplitude: { kind: "mini-demo" },
};

const ENTRY_USAGE_LEADS: Partial<Record<string, string>> = {
  "Boids:Flock": "Use this when you want a whole flock of little movers that steer together.",
  "Boids:boidsStep": "Use this when you already have the boids and just want to advance them by one frame.",
  "Animate:ticker": "Use this when you want the library to call you every frame so you can update and draw.",
  "Animate:tweenObject": "Use this when several things should move together, like x, y, scale, and opacity.",
  "Animate:tweenValue": "Use this when one number should glide from one value to another.",
  "Animate:springValue": "Use this when you want motion that feels bouncy instead of robotic.",
  "AngleInterpolation:lerpAngle": "Use this when something rotates toward a target heading and must take the short turn across the 0°/360° seam instead of whipping almost a full circle.",
  "AngleInterpolation:shortestAngleBetween": "Use this when you need the signed shortest turn from one heading to another, like steering an enemy or pointing a turret.",
  "AngleInterpolation:wrapAngle": "Use this when rotations keep accumulating and you want equivalent angles like 370° and 10° treated as the same direction.",
  "DegToRad:degToRad": "Use this when you think in degrees, but `Math.sin` and `Math.cos` need radians.",
  "RadToDeg:radToDeg": "Use this when the math gives you radians, but you want to show degrees to a human.",
  "Color:lerpColor": "Use this when one color should fade into another.",
  "Color:lerpColorHsl": "Use this when you want a color fade that usually looks nicer in the middle.",
  "Color:colorFamily": "Use this when you want a little group of colors that feel like they belong together.",
  "UnitCirclePoint:unitCirclePoint": "Use this when you want something to go around a circle or understand where sine and cosine come from.",
  "SineCurve:sineCurve": "Use this when something should bob up and down over and over, like floating or breathing.",
  "SineWave:sineWave": "Use this when lots of points should make a wavy line, like water, a rope, or a flag.",
  "WaveAmplitude:waveAmplitude": "Use this when several waves are all pushing on the same point at once.",
  "Vec2:vecNormalize": "Use this when you care about direction, but you want every step to have the same size.",
  "Vec2:vecDot": "Use this when you want to know whether two things are pointing mostly the same way.",
  "Vec2:vecAngleBetween": "Use this when you need the size of the turn from one direction to another, like measuring how far off-target an aim or heading is.",
  "Vec2:vecReflect": "Use this when an incoming velocity or direction hits a surface and you need the clean bounced direction back.",
};

const INTRO_TAB: EntryTabConfig = { id: "intro", label: "Start Here", panel: "intro" };
const EXPLAIN_TAB: EntryTabConfig = { id: "intro", label: "Explain It", panel: "intro" };
const VISUAL_TAB: EntryTabConfig = { id: "visual", label: "See It Move", panel: "visual" };
const REFERENCE_TAB: EntryTabConfig = { id: "reference", label: "Code & Details", panel: "reference" };

// Reorder these arrays if you want the docs to lead with motion instead of prose.
const DEFAULT_ENTRY_TABS: Record<DocVisualKind, EntryTabConfig[]> = {
  none: [INTRO_TAB, REFERENCE_TAB],
  "mini-demo": [VISUAL_TAB, EXPLAIN_TAB, REFERENCE_TAB],
  example: [{ ...VISUAL_TAB, label: "See Example" }, EXPLAIN_TAB, REFERENCE_TAB],
};

export const ENTRY_DOCS: Partial<Record<string, EntryDocConfig>> = {
  circleToCircle: {
    whatItIs:
      "This is the simple version of 'are these two circles touching?' You hand it two circle centers and two radii, and it gives you back `true` or `false`.",
    howToUse:
      "Use this when a moving circle should react the moment it bumps into another one. For example: make bubbles pop, balls bounce, or enemies hit each other.",
    related: [
      { name: "circleCircle", reason: "Same touch test, but it takes whole circle objects, which is usually easier to read." },
    ],
  },
  circleCircle: {
    whatItIs:
      "This is the nicer-to-read version of 'are these two circles touching?' It does the same job as `circleToCircle`, but it takes full circle objects.",
    howToUse:
      "Use this when your animation already stores circles as objects and you want a clean collision check. Good for balls, ripples, bubbles, and anything round that can bump into something.",
    related: [
      { name: "circleToCircle", reason: "Same touch test, but written as a flat list of numbers." },
    ],
  },
  pointToCircle: {
    whatItIs:
      "This answers a tiny question: is this point inside the circle or not?",
    howToUse:
      "Use this when you want to know whether the mouse, a particle, or a tiny object has entered a circular area.",
    related: [
      { name: "pointCircle", reason: "Same check, but with a point object and a circle object." },
    ],
  },
  pointCircle: {
    whatItIs:
      "This is the object-shaped version of 'is this point inside the circle?'",
    howToUse:
      "Use this when your animation already keeps points and circles as objects. Great for mouse hover zones, radar ranges, or checking whether a spark landed inside a bubble.",
    related: [
      { name: "pointToCircle", reason: "Same check, but written as a flat list of numbers." },
    ],
  },
  lineToLine: {
    whatItIs:
      "This tells you whether two line segments cross each other. Just yes or no.",
    howToUse:
      "Use this when two moving sticks, rays, or edges might cross and you only care whether they hit. For example: laser tripwires, sword slashes, or path blocking.",
    related: [
      { name: "lineLine", reason: "Same crossing check, but it also gives you the exact hit point." },
    ],
  },
  lineLine: {
    whatItIs:
      "This is the fancier line-crossing helper. It not only tells you whether two segments hit, it also tells you where they hit.",
    howToUse:
      "Use this when you want to draw the exact crossing point or make something happen right at that spot, like a spark, marker, or snapped connection.",
    related: [
      { name: "lineToLine", reason: "Same crossing idea, but only gives back true or false." },
    ],
  },
  polygonToPolygon: {
    whatItIs:
      "This answers 'are these two many-sided shapes overlapping?' using two raw lists of corner points.",
    howToUse:
      "Use this when your scene already has two polygon point lists and you want to know whether they now overlap. Good for irregular hit areas that are not just circles or rectangles.",
    related: [
      { name: "polygonPolygon", reason: "Same overlap check, but with object-shaped inputs that are easier to read." },
    ],
  },
  polygonPolygon: {
    whatItIs:
      "This is the main 'do these two shapes overlap?' helper for polygons. It handles both edge crossings and one shape sitting inside the other.",
    howToUse:
      "Use this when your hit areas are odd shapes and you need a real overlap answer, not just a circle or rectangle guess. Think custom spaceships, hand-drawn islands, or weird buttons.",
    related: [
      { name: "polygonToPolygon", reason: "Same overlap check, but with two raw point arrays." },
    ],
  },
  lineToCircle: {
    whatItIs:
      "This tells you whether a straight line segment touches or passes through a circle. Just yes or no.",
    howToUse:
      "Use this when a ray, laser, stick, or path might hit a round thing. For example: a laser beam crossing a shield, or checking whether a line of sight passes through a planet.",
    related: [
      { name: "lineCircle", reason: "Same hit test, but you hand it a line object and a circle object." },
    ],
  },
  lineCircle: {
    whatItIs:
      "This is the object-shaped version of 'does this line touch this circle?' Same job as `lineToCircle`, but it takes a whole line object and a whole circle object.",
    howToUse:
      "Use this when your animation already stores lines and circles as objects and you want a clean, readable hit check.",
    related: [
      { name: "lineToCircle", reason: "Same hit test, but written as a flat list of numbers." },
    ],
  },
  lineToPoint: {
    whatItIs:
      "This checks whether a point is sitting on a line segment. Because exact hits almost never happen with real numbers, you also give it a little wiggle room (a threshold).",
    howToUse:
      "Use this when you want to know if the mouse (or a dot) is hovering over a line, within a few pixels. Good for clickable lines, connectors, or wires.",
    related: [
      { name: "linePoint", reason: "Same on-the-line check with objects, using a built-in tolerance instead of one you pass in." },
    ],
  },
  linePoint: {
    whatItIs:
      "This is the object-shaped version of 'is this point on this line?' It takes a line object and a point object.",
    howToUse:
      "Use this when your scene keeps lines and points as objects and you want a tidy on-the-line check without spelling out every coordinate.",
    related: [
      { name: "lineToPoint", reason: "Same check as flat numbers, where you set the tolerance yourself." },
    ],
  },
  pointToPolygon: {
    whatItIs:
      "This answers 'is this point inside this many-sided shape?' You give it the point and the shape's list of corners.",
    howToUse:
      "Use this to know whether the mouse or a particle landed inside an odd, hand-drawn shape, not just a circle or a box. Great for map regions, custom hit areas, or weird buttons.",
    related: [
      { name: "polygonPoint", reason: "Same inside/outside test, but with a polygon object and a point object (arguments the other way round)." },
    ],
  },
  polygonPoint: {
    whatItIs:
      "This is the object-shaped 'is this point inside the polygon?' test. Same idea as `pointToPolygon`, just with a polygon object and a point object.",
    howToUse:
      "Use this when your shapes are already stored as polygon objects and you want a clean containment check.",
    related: [
      { name: "pointToPolygon", reason: "Same test with a raw corner list, arguments in the other order." },
    ],
  },
  circleToRect: {
    whatItIs:
      "This tells you whether a circle is overlapping a rectangle. Yes or no.",
    howToUse:
      "Use this when a round thing might bump a box: a ball hitting a paddle or wall, a bubble touching a panel, a coin landing on a platform.",
    related: [
      { name: "rectToRect", reason: "Box-vs-box overlap for when neither shape is round." },
      { name: "circleCircle", reason: "Round-vs-round overlap for when neither shape is a box." },
    ],
  },
  lineToRect: {
    whatItIs:
      "This checks whether a straight line segment crosses the edges of a rectangle.",
    howToUse:
      "Use this when a ray or path might cut through a box. For example: a line of sight blocked by a wall, or a laser clipping a panel.",
    related: [
      { name: "lineToCircle", reason: "Same idea, but the line is tested against a circle instead of a box." },
    ],
  },
  pointToRect: {
    whatItIs:
      "This tells you whether a point is inside (or on the edge of) a rectangle.",
    howToUse:
      "Use this for hit testing a box: is the mouse over this button, did a particle enter this zone, is something inside this panel.",
    related: [
      { name: "pointToPolygon", reason: "Same inside test for odd shapes instead of a plain box." },
    ],
  },
  rectToRect: {
    whatItIs:
      "This is the classic 'do these two boxes overlap?' check, using axis-aligned bounding boxes (AABB). Fast and simple.",
    howToUse:
      "Use this as a cheap first collision check between rectangular things: sprites, cards, platforms, UI panels.",
    related: [
      { name: "circleToRect", reason: "When one of the two shapes is a circle instead of a box." },
      { name: "pointToRect", reason: "When you only need a single point tested against the box." },
    ],
  },
  rectToPolygon: {
    whatItIs:
      "This checks whether a rectangle overlaps a many-sided shape.",
    howToUse:
      "Use this when a boxy thing might touch an irregular shape: a crate against a hand-drawn island, a panel over a custom region.",
    related: [
      { name: "polygonPolygon", reason: "Shape-vs-shape overlap when neither side is a plain box." },
      { name: "rectToRect", reason: "Box-vs-box overlap when both shapes are rectangles." },
    ],
  },
  polygonCircle: {
    whatItIs:
      "This tells you whether a circle overlaps a many-sided shape.",
    howToUse:
      "Use this when a round thing might touch an irregular shape: a ball entering a custom zone, a bubble drifting over a hand-drawn region.",
    related: [
      { name: "polygonPolygon", reason: "Shape-vs-shape overlap when neither side is round." },
      { name: "circleCircle", reason: "Round-vs-round overlap when there is no polygon involved." },
    ],
  },
  polygonLine: {
    whatItIs:
      "This tells you whether a line segment crosses any edge of a many-sided shape.",
    howToUse:
      "Use this when a ray or path might cut across an irregular shape: a line of sight through a custom wall, or a slash crossing a shape's outline.",
    related: [
      { name: "lineLine", reason: "Line-crossing-line when you only have one edge, and you also want the hit point." },
      { name: "polygonPolygon", reason: "Full shape-vs-shape overlap instead of a single line." },
    ],
  },
  lerpColor: {
    whatItIs:
      "This fades one color into another in the most direct way possible.",
    howToUse:
      "Use this when a background, particle, or shape should slowly change color over time. For example: sunrise skies, warning lights, or a health bar moving from green to red.",
    related: [
      { name: "lerpColorHsl", reason: "Another color fade that often looks nicer in the middle." },
    ],
  },
  lerpColorHsl: {
    whatItIs:
      "This also fades one color into another, but it takes a prettier route around the color wheel.",
    howToUse:
      "Use this when a normal color fade looks muddy and you want something that feels more lively. Great for magical glows, playful gradients, and rainbow-ish transitions.",
    related: [
      { name: "lerpColor", reason: "The simpler, more literal color fade." },
    ],
  },
  tweenValue: {
    whatItIs:
      "This is a helper for moving one number from here to there over time.",
    howToUse:
      "Use this when one thing should change smoothly, like x position, size, opacity, or rotation. If you can say 'I just need one value to glide,' this is a good pick.",
    related: [
      { name: "tweenObject", reason: "Same idea, but for several values at once." },
    ],
  },
  tweenObject: {
    whatItIs:
      "This is the multi-part version of `tweenValue`. It moves several numbers together.",
    howToUse:
      "Use this when one animated thing has lots of moving parts, like x, y, scale, and opacity all changing together. Good for cards, popups, sprites, and UI bits.",
    related: [
      { name: "tweenValue", reason: "The smaller version when you only need one moving value." },
    ],
  },
  degToRad: {
    whatItIs:
      "This changes degrees into radians.",
    howToUse:
      "Use this when you want to say 'turn 45 degrees' but the math function you are calling wants radians instead.",
    related: [
      { name: "radToDeg", reason: "The opposite conversion: radians back into degrees." },
    ],
  },
  radToDeg: {
    whatItIs:
      "This changes radians back into degrees.",
    howToUse:
      "Use this when the math gives you a radian angle, but you want to show a friendly degree number like 90 or 180.",
    related: [
      { name: "degToRad", reason: "The opposite conversion: degrees into radians." },
    ],
  },
  unitCirclePoint: {
    whatItIs:
      "This gives you a point on the edge of a circle from one angle. It is one of the simplest ways to make something go around and around.",
    howToUse:
      "Use this when a dot, planet, eye, or handle should travel around a center point. It is also the easiest place to see where sine and cosine come from.",
  },
  sineCurve: {
    whatItIs:
      "This makes a value go up, then down, then up again forever in a smooth loop.",
    howToUse:
      "Use this when something should bob, pulse, breathe, float, wobble, or gently drift over and over again.",
  },
  sineWave: {
    whatItIs:
      "This helps draw a whole wavy line instead of moving just one thing up and down.",
    howToUse:
      "Use this when you want many points to rise and fall in a repeating wave. Think water, a hanging rope, a flag, sound squiggles, or grass blowing in the wind.",
  },
  waveAmplitude: {
    whatItIs:
      "This tells you how strong the wave is at one spot after several waves all mix together.",
    howToUse:
      "Use this when lots of ripples or signals are meeting in one place and you want the final height there. Think overlapping pond ripples or layered sound-like motion.",
  },
  lerp: {
    whatItIs:
      "This is the classic move-from-A-to-B helper. Give it a start, an end, and a slider from 0 to 1.",
    howToUse:
      "Use this when one thing should travel between two values. For example: move a dot between two points, fade opacity from 0 to 1, or grow a shape from small to big.",
  },
  mapRange: {
    whatItIs:
      "This takes a number from one scale and converts it to another scale.",
    howToUse:
      "Use this when one input should control something else. For example: turn mouse position into rotation, turn scroll amount into opacity, or turn speed into size.",
  },
  distance: {
    whatItIs:
      "This tells you how far apart two points are.",
    howToUse:
      "Use this when something should react to closeness. For example: make a particle notice the mouse, trigger a hit when two things get near, or scale something based on distance.",
  },
  getRotation: {
    whatItIs:
      "This gives you the angle from one point to another.",
    howToUse:
      "Use this when one thing should point at another thing. For example: make an arrow face the mouse, a spaceship aim at a target, or eyes look at a moving dot.",
  },
  ballBounce: {
    whatItIs:
      "This helps a moving ball bounce off the edges instead of flying away forever.",
    howToUse:
      "Use this when you want the classic screensaver/game feel: a ball hits a wall, flips direction, and keeps going.",
  },

  // --- Numbers in motion (scalar primitives) ---
  clamp: {
    whatItIs:
      "This keeps a number from wandering out of bounds. You give it a value, a lowest allowed, and a highest allowed, and it never lets the value cross either edge.",
    howToUse:
      "Use this to stop things from going too far: keep an object on screen, cap a volume at 100, or make sure a health bar never drops below 0 or above full.",
    related: [
      { name: "wrap", reason: "When you'd rather the value loop back around instead of stopping at the edge." },
    ],
  },
  inverseLerp: {
    whatItIs:
      "This is the backwards version of `lerp`. Instead of 'give me the value at 30% of the way', it asks 'this value is what percent of the way between the start and the end?' The answer comes back as a slider from 0 to 1.",
    howToUse:
      "Use this to turn a real measurement into a 0-to-1 progress number: how full is the tank, how far along is the scroll, how close to the goal are we.",
    related: [
      { name: "lerp", reason: "The forward version: turn a 0-to-1 slider back into a value." },
      { name: "mapRange", reason: "Do both at once: convert straight from one scale to another." },
    ],
  },
  wrap: {
    whatItIs:
      "This makes a number loop around inside a range instead of stopping. Go past the top and it pops back to the bottom, like a clock rolling from 59 minutes back to 0.",
    howToUse:
      "Use this for anything that should cycle: an object leaving the right edge and reappearing on the left, an angle staying inside one full turn, or a carousel index.",
    related: [
      { name: "clamp", reason: "When you'd rather the value stop at the edge instead of looping around." },
      { name: "pingPong", reason: "When you want it to bounce back at the ends instead of jumping to the other side." },
    ],
  },
  pingPong: {
    whatItIs:
      "This makes a value walk up to a limit, then turn around and walk back, over and over, like a bouncing back-and-forth.",
    howToUse:
      "Use this for motion that should reverse instead of restart: something sliding left and right, a pulse growing and shrinking, or a value that sweeps a range endlessly.",
    related: [
      { name: "wrap", reason: "When you want it to jump back to the start instead of reversing." },
    ],
  },
  smoothstep: {
    whatItIs:
      "This is like a gentler `lerp`. It still goes from one edge to the other, but it eases in at the start and eases out at the end instead of moving at a constant, robotic speed.",
    howToUse:
      "Use this when a transition should feel soft and natural: fading something in, a camera settling into place, or a value that shouldn't snap harshly at the edges.",
    related: [
      { name: "smootherstep", reason: "An even smoother version with softer starts and stops." },
      { name: "lerp", reason: "The plain, constant-speed version with no easing." },
    ],
  },
  smootherstep: {
    whatItIs:
      "This is `smoothstep` with the corners rounded off even more. Ken Perlin's version, which starts and stops so gently there's no visible kink at the ends.",
    howToUse:
      "Use this when even `smoothstep` looks a touch abrupt and you want the silkiest possible ease between two edges.",
    related: [
      { name: "smoothstep", reason: "The standard, slightly less soft version." },
    ],
  },

  // --- Vec2 (direction, distance, and motion primitives) ---
  vecAdd: {
    whatItIs:
      "This adds two vectors together, matching up their x's and their y's. Think of it as walking one arrow, then walking the next, and asking where you ended up.",
    howToUse:
      "Use this to apply movement: add a velocity to a position each frame, or stack up several pushes (gravity, wind, a nudge) into one combined move.",
    related: [
      { name: "vecSubtract", reason: "The opposite: find the arrow pointing from one place to another." },
    ],
  },
  vecSubtract: {
    whatItIs:
      "This subtracts one vector from another, which gives you the arrow that points from the second place to the first. It's how you get a 'direction toward' something.",
    howToUse:
      "Use this to find which way one thing is from another: aim a chaser at its target, or measure the gap between two points before you normalize it.",
    related: [
      { name: "vecNormalize", reason: "Squash that arrow down to length 1 to get a pure direction." },
      { name: "vecAdd", reason: "The opposite operation: combine two vectors." },
    ],
  },
  vecScale: {
    whatItIs:
      "This stretches or shrinks a vector by a single number, keeping its direction the same (unless the number is negative, which flips it).",
    howToUse:
      "Use this to set how far or how fast: take a unit direction and multiply it by a speed, or shrink a push so it's gentler.",
    related: [
      { name: "vecNormalize", reason: "Get a length-1 direction first, then scale it to the size you want." },
      { name: "vecLimit", reason: "Cap the length instead of setting it exactly." },
    ],
  },
  vecNormalize: {
    whatItIs:
      "This keeps a vector's direction but forces its length to exactly 1. The result is a 'unit vector' — a pure pointer with no size baked in.",
    howToUse:
      "Use this whenever you care about which way, not how far: get a clean direction, then multiply by your own speed with `vecScale`.",
    related: [
      { name: "vecScale", reason: "Multiply the length-1 direction by the speed you actually want." },
      { name: "vecMagnitude", reason: "Read a vector's current length before or after normalizing." },
    ],
  },
  vecMagnitude: {
    whatItIs:
      "This tells you how long a vector is — the straight-line distance from its tail to its tip.",
    howToUse:
      "Use this to measure speed from a velocity, or the distance represented by an arrow between two points.",
    related: [
      { name: "vecMagnitudeSquared", reason: "The faster version when you only need to compare lengths, not read them." },
      { name: "distance", reason: "Measure straight between two points without building a vector first." },
    ],
  },
  vecMagnitudeSquared: {
    whatItIs:
      "This is the length of a vector, but left squared — it skips the slow square-root step. The number is bigger than the real length, but it sorts in the same order.",
    howToUse:
      "Use this when you're only comparing distances (which is closer? is it within range?) and want the cheaper math. Compare against your radius squared.",
    related: [
      { name: "vecMagnitude", reason: "The real length when you actually need the true number." },
    ],
  },
  vecDot: {
    whatItIs:
      "The dot product. The simplest way to think about it: it's big and positive when two vectors point the same way, zero when they're at right angles, and negative when they point apart.",
    howToUse:
      "Use this to ask 'are these facing the same direction?' — is the target in front of me or behind, how aligned are two headings, or is a surface facing the light.",
    related: [
      { name: "vecCross", reason: "Tells you the turning side (left or right) instead of the same-way/opposite-way answer." },
      { name: "vecAngleBetween", reason: "Turn that alignment into an actual angle." },
    ],
  },
  vecCross: {
    whatItIs:
      "The 2D cross product. It gives you a single number whose sign tells you which side one vector is on relative to another: positive for one turning direction, negative for the other.",
    howToUse:
      "Use this to tell left from right: is the target to my left or right, is a point on one side of a line, is a turn clockwise or counter-clockwise.",
    related: [
      { name: "vecDot", reason: "Tells you same-way vs opposite-way instead of which side." },
    ],
  },
  vecPerpendicular: {
    whatItIs:
      "This gives you a vector at a right angle to the one you hand it — turned a quarter-turn.",
    howToUse:
      "Use this to get a surface's 'normal' for bouncing, to slide something sideways relative to its heading, or to draw a thickness across a line.",
    related: [
      { name: "vecReflect", reason: "Uses a perpendicular (a normal) to bounce a vector off a surface." },
      { name: "vecRotate", reason: "Turn by any angle, not just a quarter-turn." },
    ],
  },
  vecReflect: {
    whatItIs:
      "This is the vector bounce helper. You give it the direction or velocity that is coming in, plus the surface normal for the wall, floor, mirror, or slope it hits, and it gives you back the reflected vector that leaves the collision.",
    howToUse:
      "Use this when you already know the thing has hit a surface and now you need the rebound direction. Typical cases are a puck ricocheting off an angled wall, a ball bouncing off a paddle, a particle hitting the floor, or a light ray reflecting off a mirror. The important input is the surface normal: that perpendicular direction is what tells the function which way the surface is facing.",
    related: [
      { name: "vecPerpendicular", reason: "Handy for building the surface normal a reflection needs." },
    ],
  },
  vecRotate: {
    whatItIs:
      "This spins a vector around by an angle (in radians), keeping its length but changing which way it points.",
    howToUse:
      "Use this to turn things: rotate a heading, orbit a point around a center, or fan out several directions from one.",
    related: [
      { name: "vecPerpendicular", reason: "The quick special case of rotating exactly a quarter-turn." },
      { name: "vecAngle", reason: "Read a vector's current angle before rotating it." },
    ],
  },
  vecLerp: {
    whatItIs:
      "This is `lerp` for points and directions. Give it a start vector, an end vector, and a 0-to-1 slider, and it hands back the point partway between them.",
    howToUse:
      "Use this to glide something between two positions, or to ease a camera, a handle, or a target from where it is to where it should be.",
    related: [
      { name: "lerp", reason: "The single-number version for one value at a time." },
    ],
  },
  vecLimit: {
    whatItIs:
      "This caps a vector's length at a maximum, keeping its direction. If it's already shorter, it's left alone; if it's too long, it's shortened to the limit.",
    howToUse:
      "Use this to enforce a speed limit: let velocity build up but never exceed a top speed, so a chaser or particle can't run away too fast.",
    related: [
      { name: "vecScale", reason: "Set the length to an exact value instead of just capping it." },
      { name: "clamp", reason: "The same 'keep it within bounds' idea for a single number." },
    ],
  },
  vecAngle: {
    whatItIs:
      "This tells you which way a vector is pointing, as an angle in radians measured from the positive x-axis (pointing right).",
    howToUse:
      "Use this to face a sprite along its direction of travel, or to read a heading you can then tweak and turn back into a vector.",
    related: [
      { name: "getRotation", reason: "Get that angle straight from two points instead of a vector." },
      { name: "vecRotate", reason: "Spin a vector by an angle once you know it." },
    ],
  },
  vecAngleBetween: {
    whatItIs:
      "This tells you how much one vector would need to turn to line up with another. The result is the smallest unsigned gap between their directions, returned in radians.",
    howToUse:
      "Use this when you want the size of a turn without caring whether it goes left or right: how far off-aim a shot is, how sharply a mover would need to turn, or whether two headings are nearly aligned, perpendicular, or opposite.",
    related: [
      { name: "vecDot", reason: "The cheaper same-way/opposite-way signal underneath this angle." },
      { name: "shortestAngleBetween", reason: "Use this when you also need the turn direction, not just its size." },
    ],
  },

  // --- Angles (the short way around the circle) ---
  lerpAngle: {
    whatItIs:
      "This is `lerp`, but for angles. It blends from one angle to another the short way around the circle, so turning from 350° to 10° sweeps a tidy 20° instead of spinning 340° the long way.",
    howToUse:
      "Use this to rotate something smoothly toward a new heading — a compass needle, a steering enemy, a dial — without an ugly wrap-around jump at the 0°/360° seam.",
    related: [
      { name: "shortestAngleBetween", reason: "The raw shortest turn this blend is built on." },
      { name: "lerp", reason: "The straight-line version for plain numbers that don't wrap." },
    ],
  },
  shortestAngleBetween: {
    whatItIs:
      "This tells you the smallest turn needed to get from one angle to another, and its sign tells you which way to turn. It always takes the short way around.",
    howToUse:
      "Use this to steer: how much, and in which direction, should something rotate this frame to face its target.",
    related: [
      { name: "lerpAngle", reason: "Smoothly ease across that shortest turn instead of snapping." },
      { name: "wrapAngle", reason: "Keep the result folded into one tidy turn." },
    ],
  },
  wrapAngle: {
    whatItIs:
      "This folds any angle back into a tidy range (about -180° to 180°), so 370° becomes 10° and angles never pile up past a full turn.",
    howToUse:
      "Use this to keep an ever-growing rotation sane, or to compare two angles fairly after lots of spinning.",
    related: [
      { name: "wrap", reason: "The same looping idea for plain numbers over any range." },
      { name: "shortestAngleBetween", reason: "Uses this kind of folding to find the short way around." },
    ],
  },

  // --- Color ---
  colorFamily: {
    whatItIs:
      "This builds a small ordered palette of colors that all belong to one named family (like 'blue' or 'warm'), so they clearly look like they go together.",
    howToUse:
      "Use this when you want a coherent set of colors instead of random ones: bars in a chart, particles in a burst, or a themed background.",
    related: [
      { name: "getRandomColors", reason: "One random color, optionally biased toward a family." },
      { name: "lerpColorHsl", reason: "Blend smoothly between two of these colors." },
    ],
  },
  hslToRgb: {
    whatItIs:
      "This converts a color from HSL (hue, saturation, lightness — the human-friendly way to describe color) into RGB (red, green, blue — what screens actually use).",
    howToUse:
      "Use this after you've picked or tweaked a color in HSL and now need real RGB channels to draw with.",
    related: [
      { name: "rgbToHsl", reason: "The reverse conversion, RGB back to HSL." },
      { name: "rgbToCss", reason: "Turn the RGB result into a string canvas or CSS can use." },
    ],
  },
  rgbToHsl: {
    whatItIs:
      "This converts a color from RGB (red, green, blue) into HSL (hue, saturation, lightness), which is far easier to reason about when you want to shift or brighten a color.",
    howToUse:
      "Use this when you have a screen color and want to nudge its hue or lightness without wrestling three separate channels.",
    related: [
      { name: "hslToRgb", reason: "The reverse conversion, HSL back to RGB." },
      { name: "lerpColorHsl", reason: "Blend colors around the HSL wheel." },
    ],
  },
  rgbToCss: {
    whatItIs:
      "This turns an RGB color into a plain `rgb(...)` text string, rounding the channels to whole numbers — exactly the format canvas and CSS expect.",
    howToUse:
      "Use this right before you draw: convert your computed color into the string you hand to `fillStyle` or a style.",
    related: [
      { name: "hslToRgb", reason: "Get an RGB value first if you started in HSL." },
    ],
  },
  getRandomColors: {
    whatItIs:
      "This picks a random color in HSL, and you can optionally nudge it toward a named family so the randomness still feels on-theme.",
    howToUse:
      "Use this to sprinkle variety with a little control: confetti, particles, or tiles that differ but still belong together.",
    related: [
      { name: "colorFamily", reason: "A whole ordered palette instead of one random pick." },
    ],
  },

  // --- Animate (time & springs) ---
  ticker: {
    whatItIs:
      "This is the heartbeat. It calls your function once per animation frame, hands it the timing info, and gives you back a small handle for stopping it. It is the one piece of core that touches the clock — everything else in the library just does math on the numbers this feeds it.",
    howToUse:
      "Use this instead of wiring up `requestAnimationFrame` by hand: start it, read the elapsed time inside your callback, feed that into `loop`, `yoyo`, or `tweenFrame`, and cancel the handle when your page or component goes away.",
    related: [
      { name: "loop", reason: "Turn the elapsed time this provides into repeating 0..1 progress." },
      { name: "tweenFrame", reason: "Sample a whole animation from the elapsed time, one frame at a time." },
    ],
  },
  loop: {
    whatItIs:
      "This turns raw elapsed time into a progress value that runs 0→1, snaps back to 0, and runs again — a sawtooth. You tell it how long one cycle is; it answers 'how far through the current cycle are we?'",
    howToUse:
      "Use this for anything that repeats forever: an orbit, a blinking cursor, a marching dash pattern. Feed the 0..1 through an easing curve or a lerp to drive the thing that actually moves.",
    related: [
      { name: "yoyo", reason: "Comes back down smoothly (0→1→0) instead of snapping to the start." },
      { name: "pingPong", reason: "The same back-and-forth idea for arbitrary value ranges instead of time." },
    ],
  },
  yoyo: {
    whatItIs:
      "Like `loop`, but instead of snapping back to 0 at the end of each cycle, the progress turns around and comes home: 0→1→0, over and over. A triangle wave made of time.",
    howToUse:
      "Use this for breathing, hovering, and pulsing — any motion that should go out and come back with no visible seam where the cycle restarts.",
    related: [
      { name: "loop", reason: "The one-way version that snaps back to the start each cycle." },
    ],
  },
  delay: {
    whatItIs:
      "This holds a progress value at 0 until a delay has passed, then lets it run 0→1 over the duration. It is how 'wait, then go' becomes plain math instead of a setTimeout.",
    howToUse:
      "Use this to choreograph from one shared clock: the title fades in, and half a second later the subtitle follows — two calls with different delays, no timers to clean up.",
    related: [
      { name: "stagger", reason: "This same idea applied across a whole list by index." },
    ],
  },
  stagger: {
    whatItIs:
      "This is `delay` for a whole list: item 0 starts now, item 1 starts one beat later, item 2 a beat after that. Call it with each item's index and you get a cascade from a single clock.",
    howToUse:
      "Use this for ripple-in effects: menu items sliding in one after another, chart bars growing left to right, particles launching in sequence.",
    related: [
      { name: "delay", reason: "The single-item version, when there's no list involved." },
    ],
  },
  springValue: {
    whatItIs:
      "This advances a spring simulation one small step: the value gets pulled toward its target like a weight on a spring — it can overshoot, wobble, and settle. Unlike a tween it has no duration; it has physics (stiffness, damping, mass), and the motion falls out of them.",
    howToUse:
      "Use this when the target keeps moving — a cursor follower, a dragged card settling into place — because springs never need to know when they'll arrive. Keep the returned state and feed it back in every frame.",
    related: [
      { name: "criticalDamping", reason: "The damping value where the wobble disappears — the natural tuning starting point." },
      { name: "lerp", reason: "The no-physics way to chase a target, when you don't want overshoot." },
    ],
  },
  criticalDamping: {
    whatItIs:
      "This computes the exact damping value at which a spring stops overshooting: any less and it bounces past the target, any more and it oozes in slowly. Physics calls that 'critically damped' — the fastest possible arrival with zero wobble.",
    howToUse:
      "Use it as your tuning anchor for `springValue`: take the critical value, then multiply by less than 1 for playful bounce or more than 1 for a heavier, damped feel.",
    related: [
      { name: "springValue", reason: "The spring this value tunes." },
    ],
  },
  tweenFrame: {
    whatItIs:
      "This is `tweenObject` under a name that matches how you actually call it in an animation loop: every frame, hand it the spec, the elapsed time, and the duration, and it hands back that frame's in-between values. Same math, frame-at-a-time framing.",
    howToUse:
      "Use it inside a `ticker` callback: it eases every numeric property from its start value to its end value and returns the current snapshot, ready to draw.",
    related: [
      { name: "tweenObject", reason: "The same function under its primary name." },
      { name: "ticker", reason: "The frame loop that supplies the elapsed time." },
    ],
  },

  // --- Physics & simulation ---
  ballToBallBounce: {
    whatItIs:
      "This is the 'two balls bumped into each other' response. While they overlap, it pushes them apart with a spring-like force sized to the overlap — a soft, springy shove rather than an instant billiard-ball deflection. It edits both balls' velocities in place.",
    howToUse:
      "Call it every frame for each pair of balls that might be touching (a cheap `circleToCircle` check first saves work). Deeper overlaps push harder, so a crowd of balls jostles itself apart naturally.",
    related: [
      { name: "circleToCircle", reason: "The touch test that tells you when this response is needed." },
      { name: "ballBounce", reason: "The wall-bounce sibling: one ball against the container edges." },
    ],
  },
  boidsStep: {
    whatItIs:
      "This advances a whole flock one tick using Craig Reynolds' three boids rules: separation (don't crowd me), alignment (fly the way my neighbors fly), and cohesion (drift toward the group). From just those, flocking emerges. No randomness, no clock — the same flock in gives the same flock out.",
    howToUse:
      "Keep an array of boids, call this once per frame, then draw each boid at its new position. The rule weights in the options are the personality dials: tight school of fish at one end, loose gaggle of tourists at the other.",
    related: [
      { name: "Flock", reason: "The higher-level flock object that wraps this stepping function for you." },
    ],
  },
  gravitationalStep: {
    whatItIs:
      "One frame of Newtonian gravity: the orbiter feels a pull toward the central body proportional to mass over distance squared, then its velocity and position update. String frames together and real orbits appear — ellipses and slingshots included. It mutates the orbiter in place.",
    howToUse:
      "Call it once per frame with your orbiter and the body it orbits. Give the orbiter some sideways starting velocity, or it will do the physically-correct thing and fall straight in.",
    related: [
      { name: "grStep", reason: "The same step with a general-relativity correction that makes orbits precess." },
    ],
  },
  grStep: {
    whatItIs:
      "Same as `gravitationalStep`, plus a pinch of general relativity: an extra term strengthens gravity at close range, which makes the orbit's ellipse slowly rotate (precess) instead of retracing itself. This is the effect that made Mercury's orbit famously refuse to behave for Newton.",
    howToUse:
      "Use it exactly like `gravitationalStep`, with `grStrength` as the 'how much Einstein' dial: 0 is plain Newton; turn it up and the rosette pattern becomes obvious.",
    related: [
      { name: "gravitationalStep", reason: "The plain Newtonian version this extends." },
      { name: "lensDeflection", reason: "The other relativity demo: gravity bending light instead of orbits." },
    ],
  },
  lensDeflection: {
    whatItIs:
      "This approximates how much a light ray bends as it passes a heavy object — gravitational lensing. Bigger mass bends more; passing farther from the lens bends less. It's why galaxies smear whatever is behind them into arcs.",
    howToUse:
      "March rays across your canvas and add this deflection to each one as it passes the lens — the warped-grid look appears on its own. The gravitational-lensing example is exactly this, with sliders.",
    related: [
      { name: "grStep", reason: "The other relativity demo: gravity bending orbits instead of light." },
    ],
  },
  gameOfLifeStep: {
    whatItIs:
      "One generation of Conway's Game of Life: every cell looks at its eight neighbors — a live cell survives with two or three alive, a dead cell is born with exactly three, everything else dies or stays empty. The grid wraps at the edges, and you get a brand-new grid back; the input isn't touched.",
    howToUse:
      "Keep a flat grid of 0s and 1s, call this on a throttled tick (full frame rate is an unreadable blur), and draw the live cells. Seed it randomly, or with a known pattern like a glider, and watch structure emerge from three rules.",
  },
  sphereLighting: {
    whatItIs:
      "This fakes 3D on a flat circle: given a light position, it returns where the bright specular highlight should sit — partway from the circle's center toward the light. Draw a radial gradient there and the circle reads as a shiny ball.",
    howToUse:
      "Recompute it every frame as the ball or the light moves and the illusion holds up surprisingly well. The ball-orbiting-a-sun example leans on this for its lit planet.",
  },

  // --- Curves ---
  quadraticBezier: {
    whatItIs:
      "This gives you the point at `t` along a quadratic Bézier — the simplest curved path: a start point, an end point, and one control point that pulls the curve toward itself (the path bends toward it but never touches it).",
    howToUse:
      "Sweep `t` from 0 to 1 to move something along the arc, or sample many `t` values to draw the path yourself. If you only need to *stroke* the curve, `ctx.quadraticCurveTo` already does that — this is for when you need the actual points.",
    related: [
      { name: "bezierPoint", reason: "The cubic version: two control points, S-curves possible." },
      { name: "deCasteljau", reason: "The same evaluation for any number of control points, showing its work." },
    ],
  },
  bezierPoint: {
    whatItIs:
      "The point at `t` along a cubic Bézier — the workhorse curve with two control points, the same kind you drag around with a pen tool. Under the hood it's just repeated lerps between the control points (de Casteljau's construction) until one point remains.",
    howToUse:
      "Use it to move objects along a designed path, not just draw one: sweep `t` over time (through an easing function, if you want acceleration) and place your object at each result.",
    related: [
      { name: "quadraticBezier", reason: "The simpler one-control-point version." },
      { name: "deCasteljau", reason: "The same algorithm generalized, returning the construction lines too." },
    ],
  },
  deCasteljau: {
    whatItIs:
      "Bézier evaluation with the construction left in. It lerps between adjacent control points, then between those results, and so on until a single point remains — and it returns every intermediate level, not just the answer. Any number of control points welcome.",
    howToUse:
      "Use it when you want to *show* how Béziers work — draw the shrinking scaffolding of lines at each level as `t` sweeps — or when your curve has more control points than the standard quadratic/cubic helpers handle.",
    related: [
      { name: "bezierPoint", reason: "The fixed cubic case, when you just want the point." },
      { name: "getPointOnLine", reason: "The single 2D lerp this whole algorithm is stacked out of." },
    ],
  },

  // --- Lines, points & triangles ---
  lineLength: {
    whatItIs:
      "The length of a line segment, taken from a line object's two endpoints. It's Pythagoras with the coordinate unpacking done for you.",
    howToUse:
      "Use it when your data is already line objects: sizing dashes, showing distance readouts, or sorting segments by length.",
    related: [
      { name: "distance", reason: "The same measurement from two loose points instead of a line object." },
      { name: "getTriangleData", reason: "The distance plus its dx/dy legs, when you need direction too." },
    ],
  },
  getPointOnLine: {
    whatItIs:
      "This finds the point a fraction `t` of the way from one point to another — a lerp applied to x and y at once. `t = 0` is the start, `t = 1` the end, `t = 0.5` the midpoint.",
    howToUse:
      "Use it to place things along a straight path: evenly spaced dots, an object 30% of the way to its target, or the repeated-lerp skeleton underneath a Bézier curve.",
    related: [
      { name: "moveAlongLine", reason: "Same job, different argument names — pick whichever reads better." },
      { name: "lerp", reason: "The 1D version this applies to both axes." },
    ],
  },
  moveAlongLine: {
    whatItIs:
      "This finds the point a given fraction of the way from an origin to a destination. It's the same math as `getPointOnLine` — a 2D lerp — under a name that reads like motion.",
    howToUse:
      "Use it to park something partway along a route, or sweep the ratio 0→1 over time to slide it there. For constant-speed chasing of a moving target, `moveToward` is the better fit.",
    related: [
      { name: "getPointOnLine", reason: "Same job, different argument names — pick whichever reads better." },
      { name: "moveToward", reason: "Fixed-speed stepping instead of fraction-based placement." },
    ],
  },
  moveToward: {
    whatItIs:
      "This nudges an object a fixed number of pixels toward a destination each call, and snaps it exactly onto the target once it's within one step. Unlike a lerp chase, the speed is constant — no slowing down on approach. It edits the object's x/y in place.",
    howToUse:
      "Call it every frame for homing behavior: an enemy chasing the player, items flying to an inventory slot, a camera walking to its mark. It's perfectly happy while the destination moves.",
    related: [
      { name: "lerp", reason: "Proportional chasing that eases in, instead of marching at constant speed." },
      { name: "moveAlongLine", reason: "Placement by fraction of the route, when you know the whole path." },
    ],
  },
  getTriangleData: {
    whatItIs:
      "Given two points, this returns the right triangle hiding between them: the horizontal leg (dx), the vertical leg (dy), and the hypotenuse (their distance). Every pair of points has one.",
    howToUse:
      "Use it when the distance alone isn't enough — dx and dy give you direction, for velocities, proportional forces, or feeding the trig functions.",
    related: [
      { name: "triangleDataFromLine", reason: "The same triangle solved fully: side lengths and the angles." },
      { name: "distance", reason: "Just the hypotenuse, when the legs don't matter." },
    ],
  },
  triangleDataFromLine: {
    whatItIs:
      "This solves the right triangle the trig-class way: treat the line as the hypotenuse and get back the side lengths *and* both angles, in degrees. It's SOH-CAH-TOA as a function.",
    howToUse:
      "Use it when you need the angle a line makes — to rotate a sprite along its path, to label a slope, or to see with real numbers why atan2 gives what it gives.",
    related: [
      { name: "getTriangleData", reason: "Just the sides, when you don't need angles." },
      { name: "getRotation", reason: "The one-liner when the angle is all you wanted." },
    ],
  },
  circleFromThreePoints: {
    whatItIs:
      "Pick any three points that aren't in a straight line, and exactly one circle passes through all three. This finds it — center and radius. Geometry calls it the circumcircle.",
    howToUse:
      "Use it to fit an arc through known points: three positions of a moving object, three user clicks, or the circle a triangle naturally sits on.",
  },

  // --- Around a circle & shape builders ---
  findPointAroundCircle: {
    whatItIs:
      "This finds the point a given percentage of the way around a circle — 0 is the start, 0.25 a quarter-turn, 0.5 the far side. Cosine and sine do the converting from 'how far around' to x/y, so you never have to.",
    howToUse:
      "Sweep the percentage over time and you have an orbit. Park it at a fixed value to place a marker on a dial, a moon at a phase, or a label around a badge.",
    related: [
      { name: "distributeAroundCircle", reason: "All N evenly-spaced points at once, instead of one at a chosen fraction." },
      { name: "unitCirclePoint", reason: "The same idea parameterized by angle instead of percentage." },
    ],
  },
  distributeAroundCircle: {
    whatItIs:
      "This places N points evenly around a circle and hands you all of them at once — a clock face in one call.",
    howToUse:
      "Use it for radial menus, orbiting clusters, flower petals, dots on a loading spinner — anywhere 'evenly around a ring' is the layout.",
    related: [
      { name: "findPointAroundCircle", reason: "One point at an arbitrary fraction, instead of the whole evenly-spaced set." },
    ],
  },
  equilateralTriangle: {
    whatItIs:
      "The three corners of an equilateral triangle inscribed in a circle: give it a center, radius, and starting angle, and it returns the vertices — three points on the circle, 120° apart.",
    howToUse:
      "Use it to draw or hit-test triangles that rotate cleanly: spin the angle over time and the triangle turns in place around its center.",
    related: [
      { name: "starVertices", reason: "The same vertices-around-a-center recipe, grown into a star." },
      { name: "createRect", reason: "The rectangle member of the same shape-builder family." },
    ],
  },
  createRect: {
    whatItIs:
      "The four corner vertices of a rectangle centered on the origin, optionally rotated — with a built-in spin option if you feed it a running time. You translate the points to where the rectangle lives and connect the dots.",
    howToUse:
      "Use it when you need a rectangle's actual corners — for polygon collision checks or custom drawing with rotation — rather than the axis-aligned box `ctx.fillRect` gives you.",
    related: [
      { name: "starVertices", reason: "Same family and options, star-shaped." },
      { name: "polygonPolygon", reason: "The corner list drops straight into the polygon overlap checks." },
    ],
  },
  starVertices: {
    whatItIs:
      "The corner points of a star: it walks around a circle alternating between an outer radius (the spike tips) and an inner radius (the notches between them). Change the spike count or the radius ratio and you change the star's whole character.",
    howToUse:
      "Connect the returned vertices to draw it; use the spin option for a rotating star. The inner-to-outer ratio is the personality dial — close together reads as a subtle badge, far apart as a spiky cartoon burst.",
    related: [
      { name: "equilateralTriangle", reason: "The simplest member of the same shape-builder family." },
      { name: "createRect", reason: "Same family and options, four corners instead of spikes." },
    ],
  },

  // --- Signals ---
  dft: {
    whatItIs:
      "The Discrete Fourier Transform, pointed at drawings: it takes a path of 2D points and re-expresses it as a stack of spinning circles (epicycles), each with a size, a spin speed, and a starting angle. Chain the circles tip-to-tail, set them spinning, and the last tip retraces your drawing.",
    howToUse:
      "Sample a shape's outline into points, run it through once, then animate the returned circles. They come sorted by size, so keeping just the first handful redraws a dreamier, simplified version of the shape.",
    related: [
      { name: "findPointAroundCircle", reason: "Each epicycle's tip is exactly this, swept over time." },
    ],
  },

  // --- Helpers ---
  centerOnParent: {
    whatItIs:
      "Given a child box and a parent box, this returns the top-left position that centers the child inside the parent — the subtract-half-the-difference math, done for both axes.",
    howToUse:
      "Use it to park a canvas, sprite, or panel dead-center in its container without re-deriving the offset arithmetic for the hundredth time.",
  },
  numberWithCommas: {
    whatItIs:
      "This formats a number with comma thousands-separators: 1234567 becomes '1,234,567'. That's the whole job, and that's the point.",
    howToUse:
      "Use it on score counters, stat readouts, and labels — anywhere raw digits get hard to read past four figures.",
  },
  randomIntegerBetween: {
    whatItIs:
      "A random whole number between min and max, with both ends included — the dice-roll function.",
    howToUse:
      "Use it for counts and picks: how many particles to spawn, which color index to grab, which cell to seed.",
    related: [
      { name: "randomNumberBetween", reason: "The decimal version, for continuous values like speeds and sizes." },
    ],
  },
  randomNumberBetween: {
    whatItIs:
      "A random decimal number from min up to (but not including) max — for values that live on a continuum rather than in whole-number steps.",
    howToUse:
      "Use it to give particles individuality: each gets its own speed, drift, and size, and the crowd stops looking stamped from one mold.",
    related: [
      { name: "randomIntegerBetween", reason: "The whole-number version, for counts and index picks." },
    ],
  },
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
  const collisionLead = getCollisionUsageLead(entry);
  if (collisionLead) return collisionLead;

  const direct = ENTRY_USAGE_LEADS[`${entry.module}:${entry.name}`];
  if (direct) return direct;
  if (entry.kind === "type") {
    return "This is a shared data shape used by other helpers.";
  }
  if (entry.kind === "const") {
    return "This is a ready-made exported value.";
  }
  if (entry.module.startsWith("CollisionObjectAPI/") || /ToCircle|ToRect|ToLine|ToPolygon|ToPoint|CircleTo|RectTo|LineTo|PolygonTo/.test(entry.module)) {
    return "This one helps answer: are these things touching yet?";
  }
  if (["Lerp", "InverseLerp", "MapRange", "Clamp", "Wrap", "PingPong", "Smoothstep", "Easing", "Animate", "AngleInterpolation"].includes(entry.module)) {
    return "This one helps a value move in a useful way.";
  }
  if (["UnitCirclePoint", "SineCurve", "SineWave", "WaveAmplitude", "GetRotation", "DegToRad", "RadToDeg", "DFT"].includes(entry.module)) {
    return "This one is great for loops, waves, turning, and repeated motion.";
  }
  if (["Vec2", "Distance", "LineLength", "GetPointOnLine", "MoveAlongLine", "MoveToward", "GetTriangleData", "CircleFromThreePoints", "FindPointAroundCircle", "DistributeAroundCircle", "EquilateralTriangle", "Rectangle", "Star", "QuadraticBezier", "BezierCurve"].includes(entry.module)) {
    return "This one helps with direction, distance, shape, or placement.";
  }
  if (["Color", "GetRandomColors"].includes(entry.module)) {
    return "This one helps colors change or work nicely together.";
  }
  if (["Boids", "BallBounce", "BallToBallBounce", "OrbitalMotion", "GameOfLife", "GRStep", "LensDeflection", "SphereLighting"].includes(entry.module)) {
    return "This one creates motion or behavior you can actually see.";
  }
  return "This is a small helper you can plug into an animation.";
}

function getCollisionUsageLead(
  entry: Pick<ApiEntryLike, "module" | "name"> & { kind?: "function" | "const" | "type" },
): string | null {
  const id = `${entry.module}:${entry.name}`;
  switch (id) {
    case "CircleToCircle:circleToCircle":
    case "CollisionObjectAPI/CircleCircle:circleCircle":
      return "This one helps answer: are these circles touching yet?";
    case "CircleToRect:circleToRect":
      return "This one helps answer: is this circle touching the rectangle yet?";
    case "LineToCircle:lineToCircle":
      return "This one helps answer: is this line touching the circle yet?";
    case "LineToLine:lineToLine":
      return "This one helps answer: are these lines crossing yet?";
    case "LineToPoint:lineToPoint":
      return "This one helps answer: is this point on the line yet?";
    case "LineToRect:lineToRect":
      return "This one helps answer: is this line crossing the rectangle yet?";
    case "PointToCircle:pointToCircle":
      return "This one helps answer: is this point inside the circle yet?";
    case "PointToPolygon:pointToPolygon":
    case "PolygonCollision:polygonPoint":
      return "This one helps answer: is this point inside the polygon yet?";
    case "PointToRect:pointToRect":
      return "This one helps answer: is this point inside the rectangle yet?";
    case "PolygonCollision:polygonCircle":
      return "This one helps answer: is this circle touching the polygon yet?";
    case "PolygonCollision:polygonLine":
      return "This one helps answer: is this line crossing the polygon yet?";
    case "PolygonCollision:polygonPolygon":
    case "PolygonToPolygon:polygonToPolygon":
      return "This one helps answer: are these polygons overlapping yet?";
    case "RectToPolygon:rectToPolygon":
      return "This one helps answer: is this rectangle overlapping the polygon yet?";
    case "RectToRect:rectToRect":
      return "This one helps answer: are these rectangles overlapping yet?";
    default:
      return null;
  }
}

export function getEntryVisual(name: string): DocVisualConfig {
  return ENTRY_VISUALS[name] ?? { kind: "none" };
}

function cleanInlineDoc(text: string): string {
  return text.replace(/\{@link\s+([^}]+)\}/g, (_match, ref) => ref.trim()).replace(/\s+/g, " ").trim();
}

function firstParagraph(text: string): string {
  const [first = ""] = text.split(/\n\s*\n/);
  return cleanInlineDoc(first);
}

function defaultWhatItIs(entry: ApiEntryDocLike): string {
  // Easing family: one shared explanation, differentiated by each curve's own JSDoc line.
  if (entry.module === "Easing") {
    const curve = entry.description?.trim() ? firstParagraph(entry.description) : "";
    const family =
      "An easing curve takes a plain 0-to-1 progress and bends it so motion feels natural instead of robotic — slow starts, soft landings, a little bounce or overshoot.";
    return curve ? `${family} This one: ${curve.replace(/\.$/, "")}.` : family;
  }
  if (entry.description?.trim()) {
    return firstParagraph(entry.description);
  }
  if (entry.kind === "type") {
    return "This is a shared shape name for data, like saying what a point or circle is supposed to look like.";
  }
  if (entry.kind === "const") {
    return "This is a ready-made value you can grab and use without rebuilding it yourself.";
  }
  return "This is one small reusable building block from `@utilspalooza/core`.";
}

function defaultHowToUse(entry: ApiEntryDocLike): string {
  if (entry.kind === "type") {
    return "Use this when you want your own code to clearly describe what kind of data it expects.";
  }
  if (entry.kind === "const") {
    return "Use this when you want a ready-made value instead of typing it all out yourself.";
  }
  if (entry.module === "Easing") {
    return "Feed it a 0-to-1 progress value (how far a tween has gone) and use what it returns to drive position, size, or opacity. Swapping one easing for another changes how the movement *feels* without touching the rest of your animation.";
  }
  const directLead = ENTRY_USAGE_LEADS[`${entry.module}:${entry.name}`];
  if (directLead) return directLead;
  if (entry.module.startsWith("CollisionObjectAPI/") || /ToCircle|ToRect|ToLine|ToPolygon|ToPoint|CircleTo|RectTo|LineTo|PolygonTo/.test(entry.module)) {
    return "Use this when you want to know whether two things in your animation are touching so you can bounce, stop, light up, or react.";
  }
  if (["Lerp", "InverseLerp", "MapRange", "Clamp", "Wrap", "PingPong", "Smoothstep", "Easing", "Animate", "AngleInterpolation"].includes(entry.module)) {
    return "Use this when one value in your animation should move smoothly, loop, ease, or stay within a limit.";
  }
  if (["UnitCirclePoint", "SineCurve", "SineWave", "WaveAmplitude", "GetRotation", "DegToRad", "RadToDeg", "DFT"].includes(entry.module)) {
    return "Use this when something should spin, orbit, wiggle, wave, or repeat in a smooth rhythm.";
  }
  if (["Vec2", "Distance", "LineLength", "GetPointOnLine", "MoveAlongLine", "MoveToward", "GetTriangleData", "CircleFromThreePoints", "FindPointAroundCircle", "DistributeAroundCircle", "EquilateralTriangle", "Rectangle", "Star", "QuadraticBezier", "BezierCurve"].includes(entry.module)) {
    return "Use this when you need help with position, direction, distance, paths, or placing shapes in space.";
  }
  if (["Color", "GetRandomColors"].includes(entry.module)) {
    return "Use this when colors in your animation should change, blend, or stay in the same family.";
  }
  if (["Boids", "BallBounce", "BallToBallBounce", "OrbitalMotion", "GameOfLife", "GRStep", "LensDeflection", "SphereLighting"].includes(entry.module)) {
    return "Use this when you want motion or behavior that feels alive, like bouncing, orbiting, flocking, or reacting to light.";
  }
  if (["RandomIntegerBetween", "RandomNumberBetween", "NumberWithCommas", "CenterOnParent"].includes(entry.module)) {
    return "Use this when you need a small utility to help place, format, or randomize something in your scene.";
  }
  if (entry.example?.trim()) {
    return "Start with the example call below, then swap in your own numbers or objects.";
  }
  return "Start with the example below, then plug in values from your own animation.";
}

export function getEntryTabs(entry: ApiEntryDocLike): EntryTabConfig[] {
  const visual = getEntryVisual(entry.name);
  const overrideTabs = ENTRY_DOCS[entry.name]?.tabs;
  const sourceTabs = overrideTabs ?? DEFAULT_ENTRY_TABS[visual.kind];
  return sourceTabs.filter((tab) => visual.kind !== "none" || tab.panel !== "visual");
}

export function getEntryIntro(entry: ApiEntryDocLike) {
  const override = ENTRY_DOCS[entry.name];
  return {
    whatItIs: override?.whatItIs ?? defaultWhatItIs(entry),
    howToUse: override?.howToUse ?? defaultHowToUse(entry),
    related: override?.related ?? [],
  };
}
