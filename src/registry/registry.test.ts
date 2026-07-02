import { describe, it, expect } from "vitest";
import animationManifest from "../animationManifest";
import { ALL_RECORDS } from "./index";
import { CODEPEN_GALLERY } from "../pages/studio/pens";
import coreApi from "../pages/api/core-api.json";

// Locks category + entry INSERTION ORDER, which drives the /examples and
// à la carte sidebars (invariant #2 in REGISTRY-CONSOLIDATION-SPEC §2). The
// shape snapshot below cannot do this on its own: vitest's snapshot serializer
// alphabetizes object keys, so only arrays preserve order. Keep this test.
it("manifest category + entry order is unchanged by the registry refactor", () => {
  const order = Object.entries(animationManifest).map(([cat, entries]) => ({
    category: cat,
    entries: Object.keys(entries),
  }));
  expect(order).toMatchInlineSnapshot(`
    [
      {
        "category": "motion & easing",
        "entries": [
          "ballBounce",
          "OrbitalMotionAnimation",
          "LerpAnimation",
          "EasingAnimation",
          "SpringAnimation",
          "MoveObjectToDestinationPoint",
          "QuadraticBezierAnimation",
          "BezierCurves",
        ],
      },
      {
        "category": "trig, angles & vectors",
        "entries": [
          "SineCurveAnimation",
          "DeMystifySineCosine",
          "MoveItemAroundCircle",
          "PointTowardsMovingPoint",
          "DistributePointsAroundACircle",
          "VectorReflectAnimation",
          "VectorRotateAnimation",
          "AngleLerpAnimation",
        ],
      },
      {
        "category": "collision detection",
        "entries": [
          "PointToCircleCollision",
          "PointToRectangle",
          "RectToRect",
          "CirceToRectCollision",
          "CircleToCircleCollision",
          "LineToCircleCollision",
          "LineToLineCollision",
          "LineToPointCollision",
          "LineToRectangleCollision",
          "PolygonToPolygonCollision",
          "CircleFieldCollision",
          "BallsBouncingAgainstEachOther",
        ],
      },
      {
        "category": "numbers in motion",
        "entries": [
          "LerpScalarAnimation",
          "InverseLerpAnimation",
          "MapRangeAnimation",
          "ClampAnimation",
          "WrapAnimation",
          "PingPongAnimation",
          "SmoothstepAnimation",
        ],
      },
      {
        "category": "geometry & shapes",
        "entries": [
          "GetHalfwayPointOfLine",
          "DistanceBetweenTwoPoints",
          "triangleDataFromLine",
          "Star",
          "Polygon",
          "GetEquilateralTriangleVertices",
          "CircleFromThreePointsAnimation",
          "CenterOnParentAnimation",
        ],
      },
      {
        "category": "generative showpieces",
        "entries": [
          "FourierEpicycles",
          "GameOfLife",
          "FlowField",
          "WaveInterference",
          "GravitationalLensing",
          "OrbitalPrecession",
          "Phyllotaxis",
          "Murmuration",
          "Sierpinski",
          "Glitter",
          "PrettyRing",
          "Sparklies",
          "Klimt",
        ],
      },
      {
        "category": "handy helpers",
        "entries": [
          "Deg2RadAnimation",
          "Rad2DegAnimation",
          "NumberWithCommasAnimation",
          "RandomIntegerAnimation",
          "RandomNumberAnimation",
          "ColorLerpAnimation",
          "ColorFamiliesAnimation",
        ],
      },
    ]
  `);
});

// Locks the exact observable shape of the manifest across the refactor:
// category names + order, entry keys + order, and each entry's t/l/include.
// (f and load are functions; identity is covered by A2/A3 later.)
it("manifest shape is unchanged by the registry refactor", () => {
  const shape = Object.fromEntries(
    Object.entries(animationManifest).map(([cat, entries]) => [
      cat,
      Object.fromEntries(
        Object.entries(entries).map(([key, e]) => [
          key,
          { t: e.t, l: e.l, include: e.include ?? true },
        ])
      ),
    ])
  );
  expect(shape).toMatchInlineSnapshot(`
    {
      "collision detection": {
        "BallsBouncingAgainstEachOther": {
          "include": false,
          "l": "balls-bouncing-against-each-other",
          "t": "balls bouncing against each other",
        },
        "CirceToRectCollision": {
          "include": true,
          "l": "circle-to-rectangle-collision",
          "t": "circle to rectangle collision",
        },
        "CircleFieldCollision": {
          "include": true,
          "l": "circle-field",
          "t": "circle field (collision at scale)",
        },
        "CircleToCircleCollision": {
          "include": true,
          "l": "circle-to-circle-collision",
          "t": "circle to circle collision",
        },
        "LineToCircleCollision": {
          "include": true,
          "l": "line-to-circle-collision",
          "t": "line to circle collision",
        },
        "LineToLineCollision": {
          "include": true,
          "l": "line-to-line-collision",
          "t": "line to line collision",
        },
        "LineToPointCollision": {
          "include": true,
          "l": "line-to-point-collision",
          "t": "line to point collision",
        },
        "LineToRectangleCollision": {
          "include": true,
          "l": "line-to-rectangle-collision",
          "t": "line to rectangle collision",
        },
        "PointToCircleCollision": {
          "include": true,
          "l": "point-to-circle-collision",
          "t": "point to circle collision",
        },
        "PointToRectangle": {
          "include": true,
          "l": "point-to-rectangle-collision",
          "t": "point to polygon collision",
        },
        "PolygonToPolygonCollision": {
          "include": true,
          "l": "polygon-to-polygon-collision",
          "t": "polygon to polygon collision",
        },
        "RectToRect": {
          "include": true,
          "l": "rectangle-to-rectangle-collision",
          "t": "rectangle to rectangle collision",
        },
      },
      "generative showpieces": {
        "FlowField": {
          "include": true,
          "l": "flow-field",
          "t": "Perlin noise flow field",
        },
        "FourierEpicycles": {
          "include": true,
          "l": "fourier-epicycles",
          "t": "Fourier epicycles",
        },
        "GameOfLife": {
          "include": true,
          "l": "game-of-life",
          "t": "Conway's Game of Life",
        },
        "Glitter": {
          "include": true,
          "l": "glitter",
          "t": "Glitter",
        },
        "GravitationalLensing": {
          "include": true,
          "l": "gravitational-lensing",
          "t": "Gravitational lensing",
        },
        "Klimt": {
          "include": true,
          "l": "klimt",
          "t": "Klimt-Inspired Swirls",
        },
        "Murmuration": {
          "include": true,
          "l": "murmuration",
          "t": "Murmuration (flocking starlings)",
        },
        "OrbitalPrecession": {
          "include": true,
          "l": "orbital-precession",
          "t": "Orbital precession (GR)",
        },
        "Phyllotaxis": {
          "include": true,
          "l": "phyllotaxis",
          "t": "Phyllotaxis (golden angle)",
        },
        "PrettyRing": {
          "include": true,
          "l": "pretty-ring",
          "t": "Pretty Ring",
        },
        "Sierpinski": {
          "include": true,
          "l": "sierpinski",
          "t": "Sierpinski Triangle",
        },
        "Sparklies": {
          "include": true,
          "l": "sparklies",
          "t": "Sparklies",
        },
        "WaveInterference": {
          "include": true,
          "l": "wave-interference",
          "t": "Wave interference",
        },
      },
      "geometry & shapes": {
        "CenterOnParentAnimation": {
          "include": true,
          "l": "center-on-parent",
          "t": "center on parent",
        },
        "CircleFromThreePointsAnimation": {
          "include": true,
          "l": "circle-from-three-points",
          "t": "get circle from three points",
        },
        "DistanceBetweenTwoPoints": {
          "include": true,
          "l": "line-length",
          "t": "get line length",
        },
        "GetEquilateralTriangleVertices": {
          "include": true,
          "l": "equilateral-trianlge-points",
          "t": "draw equilateral triangle (from radius and center point)",
        },
        "GetHalfwayPointOfLine": {
          "include": true,
          "l": "get-a-point-on-a-line",
          "t": "get a point on a line",
        },
        "Polygon": {
          "include": true,
          "l": "draw-rectangle",
          "t": "draw rectangle (using trig, not rect())",
        },
        "Star": {
          "include": true,
          "l": "draw-star",
          "t": "draw star",
        },
        "triangleDataFromLine": {
          "include": true,
          "l": "get-triangle-data-from-line",
          "t": "get triangle data from line",
        },
      },
      "handy helpers": {
        "ColorFamiliesAnimation": {
          "include": true,
          "l": "color-families",
          "t": "color families (pick a range by name)",
        },
        "ColorLerpAnimation": {
          "include": true,
          "l": "color-lerp",
          "t": "color lerp (RGB vs HSL)",
        },
        "Deg2RadAnimation": {
          "include": true,
          "l": "degrees-to-radians",
          "t": "degrees to radians",
        },
        "NumberWithCommasAnimation": {
          "include": true,
          "l": "format-number-with-commas",
          "t": "format number with commas",
        },
        "Rad2DegAnimation": {
          "include": true,
          "l": "radians-to-degrees",
          "t": "radians to degrees",
        },
        "RandomIntegerAnimation": {
          "include": true,
          "l": "random-integer-between",
          "t": "random integer between",
        },
        "RandomNumberAnimation": {
          "include": true,
          "l": "random-number-between",
          "t": "random number between",
        },
      },
      "motion & easing": {
        "BezierCurves": {
          "include": true,
          "l": "bezier-curves",
          "t": "Bézier curves",
        },
        "EasingAnimation": {
          "include": true,
          "l": "easing-functions",
          "t": "easing functions",
        },
        "LerpAnimation": {
          "include": true,
          "l": "lerp-smooth-follow",
          "t": "lerp (smooth follow)",
        },
        "MoveObjectToDestinationPoint": {
          "include": true,
          "l": "move-to-changing-point",
          "t": "move object to changing point",
        },
        "OrbitalMotionAnimation": {
          "include": true,
          "l": "ball-orbiting-a-sun",
          "t": "ball orbiting a sun",
        },
        "QuadraticBezierAnimation": {
          "include": true,
          "l": "quadratic-bezier-curve",
          "t": "quadratic bezier curve",
        },
        "SpringAnimation": {
          "include": true,
          "l": "spring-damped-harmonic",
          "t": "spring (damped harmonic motion)",
        },
        "ballBounce": {
          "include": true,
          "l": "ball-bounce",
          "t": "ball bounce",
        },
      },
      "numbers in motion": {
        "ClampAnimation": {
          "include": true,
          "l": "clamp",
          "t": "clamp",
        },
        "InverseLerpAnimation": {
          "include": true,
          "l": "inverse-lerp",
          "t": "inverse lerp",
        },
        "LerpScalarAnimation": {
          "include": true,
          "l": "lerp",
          "t": "lerp",
        },
        "MapRangeAnimation": {
          "include": true,
          "l": "map-range",
          "t": "map range",
        },
        "PingPongAnimation": {
          "include": true,
          "l": "ping-pong",
          "t": "ping pong",
        },
        "SmoothstepAnimation": {
          "include": true,
          "l": "smoothstep",
          "t": "smoothstep",
        },
        "WrapAnimation": {
          "include": true,
          "l": "wrap",
          "t": "wrap",
        },
      },
      "trig, angles & vectors": {
        "AngleLerpAnimation": {
          "include": true,
          "l": "angle-lerp-shortest-turn",
          "t": "angle interpolation (shortest turn)",
        },
        "DeMystifySineCosine": {
          "include": true,
          "l": "demystify-sine-and-cosine",
          "t": "demystify sine and cosine",
        },
        "DistributePointsAroundACircle": {
          "include": true,
          "l": "distribute-around-circle",
          "t": "distribute around circle",
        },
        "MoveItemAroundCircle": {
          "include": true,
          "l": "find-points-on-a-circle",
          "t": "find points on a circle",
        },
        "PointTowardsMovingPoint": {
          "include": true,
          "l": "point-object-towards-another",
          "t": "point object towards another",
        },
        "SineCurveAnimation": {
          "include": true,
          "l": "sine-curve",
          "t": "sine curve",
        },
        "VectorReflectAnimation": {
          "include": true,
          "l": "vector-reflection",
          "t": "vector reflection (bounce)",
        },
        "VectorRotateAnimation": {
          "include": true,
          "l": "vector-rotation",
          "t": "vector rotation",
        },
      },
    }
  `);
});

// ─── Drift tests A1–A5 (REGISTRY-CONSOLIDATION-SPEC §7) ──────────────────────
// These are the mechanism that turns the "ships the full set" iron rule from
// policy into enforcement — including the check (A4) that would have caught the
// five degToRad/radToDeg/commas/random functions that once shipped with no
// Examples animation.

interface CoreApiEntry {
  name: string;
  kind: string;
}
const CORE_API = coreApi as CoreApiEntry[];
const CORE_API_NAMES = new Set(CORE_API.map((e) => e.name));
const CORE_FUNCTION_NAMES = CORE_API.filter((e) => e.kind === "function").map(
  (e) => e.name
);

// Studio-only projects are not animations and never enter the registry.
const STUDIO_ONLY_KEYS = new Set(["audio-visualizer"]);

// Core exports that are documented on /api but have NO Examples animation
// demonstrating them. This is the visible debt ledger: shrinking it is future
// teaching work. Every entry carries a one-line justification. Populated with
// exactly what is needed to make A4 green at migration time — no padding.
const DOCS_ONLY_EXPORTS = [
  // Animate.ts scheduler/tween family — real rAF/tween helpers with no dedicated
  // /examples animation. `ticker` is the documented rAF exception kept in core
  // (CLAUDE.md publish-gate note); the rest are its pure math siblings.
  "delay",
  "loop",
  "stagger",
  "ticker",
  "tweenFrame",
  "tweenObject",
  "tweenValue",
  "yoyo",
  // Vec2.ts primitives with no dedicated /examples animation. The vector demos
  // teach vecReflect/vecNormalize/vecPerpendicular/vecRotate; these siblings are
  // documented but not yet animated.
  "moveToward",
  "vecAdd",
  "vecAngle",
  "vecAngleBetween",
  "vecCross",
  "vecDot",
  "vecLerp",
  "vecLimit",
  "vecMagnitude",
  "vecMagnitudeSquared",
  "vecScale",
  "vecSubtract",
];

describe("registry drift tests", () => {
  it("A1 — slugs and manifestKeys are unique across ALL_RECORDS", () => {
    const slugs = ALL_RECORDS.map((r) => r.slug);
    const keys = ALL_RECORDS.map((r) => r.manifestKey);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("A2 — every visible non-mini record has exactly one matching pen, no orphans", () => {
    // Source of truth is CODEPEN_GALLERY (the sync test's catalogue), not
    // EXAMPLE_PENS: flow-field and phyllotaxis define their pens in pens.ts, not
    // pens-examples.ts. include:false records (the hidden balls-bouncing
    // duplicate) are not on /examples and correctly have no pen.
    const penKeys = CODEPEN_GALLERY.map((p) => p.key).filter(
      (k) => !STUDIO_ONLY_KEYS.has(k)
    );
    const penned = ALL_RECORDS.filter(
      (r) => r.include !== false && r.pen !== "mini-demo-no-pen"
    );
    const recordSlugs = new Set(ALL_RECORDS.map((r) => r.slug));

    const missingPens = penned
      .filter((r) => !penKeys.includes(r.slug))
      .map((r) => r.slug)
      .sort();
    const orphanPens = penKeys.filter((k) => !recordSlugs.has(k)).sort();
    const duplicatePens = penKeys.filter(
      (k, i) => penKeys.indexOf(k) !== i
    );

    expect({ missingPens, orphanPens, duplicatePens }).toEqual({
      missingPens: [],
      orphanPens: [],
      duplicatePens: [],
    });
  });

  it("A3 — every record's load() resolves to a class matching its slug/title", async () => {
    const failures: string[] = [];
    for (const r of ALL_RECORDS) {
      const mod = await r.load();
      const cls = mod.default as unknown as {
        l?: string;
        t?: string;
      };
      if (cls?.l !== r.slug) {
        failures.push(`${r.manifestKey}: class static l ${cls?.l} !== slug ${r.slug}`);
      }
      if (cls?.t !== r.title) {
        failures.push(`${r.manifestKey}: class static t ${cls?.t} !== title ${r.title}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("A4 — every core function is taught by some animation or is in DOCS_ONLY_EXPORTS", () => {
    const taught = new Set(ALL_RECORDS.flatMap((r) => r.coreExports));
    const docsOnly = new Set(DOCS_ONLY_EXPORTS);
    const untaught = CORE_FUNCTION_NAMES.filter(
      (n) => !taught.has(n) && !docsOnly.has(n)
    ).sort();
    expect(untaught).toEqual([]);
  });

  it("A5 — every claimed coreExport and DOCS_ONLY_EXPORT exists in core-api.json", () => {
    const claimed = [
      ...ALL_RECORDS.flatMap((r) => r.coreExports),
      ...DOCS_ONLY_EXPORTS,
    ];
    const bogus = [...new Set(claimed)].filter((n) => !CORE_API_NAMES.has(n)).sort();
    expect(bogus).toEqual([]);
  });
});
