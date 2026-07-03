import { describe, it, expect } from "vitest";
import animationManifest from "../animationManifest";
import { ALL_RECORDS } from "./index";
import { EXAMPLE_CORE_ROWS } from "./exampleCoreLinks";
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
// category names + order, entry keys + order, and each entry's title/slug/include.
// (formula and load are functions; identity is covered by A2/A3 later.)
it("manifest shape is unchanged by the registry refactor", () => {
  const shape = Object.fromEntries(
    Object.entries(animationManifest).map(([cat, entries]) => [
      cat,
      Object.fromEntries(
        Object.entries(entries).map(([key, e]) => [
          key,
          { title: e.title, slug: e.slug, include: e.include ?? true },
        ])
      ),
    ])
  );
  expect(shape).toMatchInlineSnapshot(`
    {
      "collision detection": {
        "BallsBouncingAgainstEachOther": {
          "include": false,
          "slug": "balls-bouncing-against-each-other",
          "title": "balls bouncing against each other",
        },
        "CirceToRectCollision": {
          "include": true,
          "slug": "circle-to-rectangle-collision",
          "title": "circle to rectangle collision",
        },
        "CircleFieldCollision": {
          "include": true,
          "slug": "circle-field",
          "title": "circle field (collision at scale)",
        },
        "CircleToCircleCollision": {
          "include": true,
          "slug": "circle-to-circle-collision",
          "title": "circle to circle collision",
        },
        "LineToCircleCollision": {
          "include": true,
          "slug": "line-to-circle-collision",
          "title": "line to circle collision",
        },
        "LineToLineCollision": {
          "include": true,
          "slug": "line-to-line-collision",
          "title": "line to line collision",
        },
        "LineToPointCollision": {
          "include": true,
          "slug": "line-to-point-collision",
          "title": "line to point collision",
        },
        "LineToRectangleCollision": {
          "include": true,
          "slug": "line-to-rectangle-collision",
          "title": "line to rectangle collision",
        },
        "PointToCircleCollision": {
          "include": true,
          "slug": "point-to-circle-collision",
          "title": "point to circle collision",
        },
        "PointToRectangle": {
          "include": true,
          "slug": "point-to-rectangle-collision",
          "title": "point to polygon collision",
        },
        "PolygonToPolygonCollision": {
          "include": true,
          "slug": "polygon-to-polygon-collision",
          "title": "polygon to polygon collision",
        },
        "RectToRect": {
          "include": true,
          "slug": "rectangle-to-rectangle-collision",
          "title": "rectangle to rectangle collision",
        },
      },
      "generative showpieces": {
        "FlowField": {
          "include": true,
          "slug": "flow-field",
          "title": "Perlin noise flow field",
        },
        "FourierEpicycles": {
          "include": true,
          "slug": "fourier-epicycles",
          "title": "Fourier epicycles",
        },
        "GameOfLife": {
          "include": true,
          "slug": "game-of-life",
          "title": "Conway's Game of Life",
        },
        "Glitter": {
          "include": true,
          "slug": "glitter",
          "title": "Glitter",
        },
        "GravitationalLensing": {
          "include": true,
          "slug": "gravitational-lensing",
          "title": "Gravitational lensing",
        },
        "Klimt": {
          "include": true,
          "slug": "klimt",
          "title": "Klimt-Inspired Swirls",
        },
        "Murmuration": {
          "include": true,
          "slug": "murmuration",
          "title": "Murmuration (flocking starlings)",
        },
        "OrbitalPrecession": {
          "include": true,
          "slug": "orbital-precession",
          "title": "Orbital precession (GR)",
        },
        "Phyllotaxis": {
          "include": true,
          "slug": "phyllotaxis",
          "title": "Phyllotaxis (golden angle)",
        },
        "PrettyRing": {
          "include": true,
          "slug": "pretty-ring",
          "title": "Pretty Ring",
        },
        "Sierpinski": {
          "include": true,
          "slug": "sierpinski",
          "title": "Sierpinski Triangle",
        },
        "Sparklies": {
          "include": true,
          "slug": "sparklies",
          "title": "Sparklies",
        },
        "WaveInterference": {
          "include": true,
          "slug": "wave-interference",
          "title": "Wave interference",
        },
      },
      "geometry & shapes": {
        "CenterOnParentAnimation": {
          "include": true,
          "slug": "center-on-parent",
          "title": "center on parent",
        },
        "CircleFromThreePointsAnimation": {
          "include": true,
          "slug": "circle-from-three-points",
          "title": "get circle from three points",
        },
        "DistanceBetweenTwoPoints": {
          "include": true,
          "slug": "line-length",
          "title": "get line length",
        },
        "GetEquilateralTriangleVertices": {
          "include": true,
          "slug": "equilateral-trianlge-points",
          "title": "draw equilateral triangle (from radius and center point)",
        },
        "GetHalfwayPointOfLine": {
          "include": true,
          "slug": "get-a-point-on-a-line",
          "title": "get a point on a line",
        },
        "Polygon": {
          "include": true,
          "slug": "draw-rectangle",
          "title": "draw rectangle (using trig, not rect())",
        },
        "Star": {
          "include": true,
          "slug": "draw-star",
          "title": "draw star",
        },
        "triangleDataFromLine": {
          "include": true,
          "slug": "get-triangle-data-from-line",
          "title": "get triangle data from line",
        },
      },
      "handy helpers": {
        "ColorFamiliesAnimation": {
          "include": true,
          "slug": "color-families",
          "title": "color families (pick a range by name)",
        },
        "ColorLerpAnimation": {
          "include": true,
          "slug": "color-lerp",
          "title": "color lerp (RGB vs HSL)",
        },
        "Deg2RadAnimation": {
          "include": true,
          "slug": "degrees-to-radians",
          "title": "degrees to radians",
        },
        "NumberWithCommasAnimation": {
          "include": true,
          "slug": "format-number-with-commas",
          "title": "format number with commas",
        },
        "Rad2DegAnimation": {
          "include": true,
          "slug": "radians-to-degrees",
          "title": "radians to degrees",
        },
        "RandomIntegerAnimation": {
          "include": true,
          "slug": "random-integer-between",
          "title": "random integer between",
        },
        "RandomNumberAnimation": {
          "include": true,
          "slug": "random-number-between",
          "title": "random number between",
        },
      },
      "motion & easing": {
        "BezierCurves": {
          "include": true,
          "slug": "bezier-curves",
          "title": "Bézier curves",
        },
        "EasingAnimation": {
          "include": true,
          "slug": "easing-functions",
          "title": "easing functions",
        },
        "LerpAnimation": {
          "include": true,
          "slug": "lerp-smooth-follow",
          "title": "lerp (smooth follow)",
        },
        "MoveObjectToDestinationPoint": {
          "include": true,
          "slug": "move-to-changing-point",
          "title": "move object to changing point",
        },
        "OrbitalMotionAnimation": {
          "include": true,
          "slug": "ball-orbiting-a-sun",
          "title": "ball orbiting a sun",
        },
        "QuadraticBezierAnimation": {
          "include": true,
          "slug": "quadratic-bezier-curve",
          "title": "quadratic bezier curve",
        },
        "SpringAnimation": {
          "include": true,
          "slug": "spring-damped-harmonic",
          "title": "spring (damped harmonic motion)",
        },
        "ballBounce": {
          "include": true,
          "slug": "ball-bounce",
          "title": "ball bounce",
        },
      },
      "numbers in motion": {
        "ClampAnimation": {
          "include": true,
          "slug": "clamp",
          "title": "clamp",
        },
        "InverseLerpAnimation": {
          "include": true,
          "slug": "inverse-lerp",
          "title": "inverse lerp",
        },
        "LerpScalarAnimation": {
          "include": true,
          "slug": "lerp",
          "title": "lerp",
        },
        "MapRangeAnimation": {
          "include": true,
          "slug": "map-range",
          "title": "map range",
        },
        "PingPongAnimation": {
          "include": true,
          "slug": "ping-pong",
          "title": "ping pong",
        },
        "SmoothstepAnimation": {
          "include": true,
          "slug": "smoothstep",
          "title": "smoothstep",
        },
        "WrapAnimation": {
          "include": true,
          "slug": "wrap",
          "title": "wrap",
        },
      },
      "trig, angles & vectors": {
        "AngleLerpAnimation": {
          "include": true,
          "slug": "angle-lerp-shortest-turn",
          "title": "angle interpolation (shortest turn)",
        },
        "DeMystifySineCosine": {
          "include": true,
          "slug": "demystify-sine-and-cosine",
          "title": "demystify sine and cosine",
        },
        "DistributePointsAroundACircle": {
          "include": true,
          "slug": "distribute-around-circle",
          "title": "distribute around circle",
        },
        "MoveItemAroundCircle": {
          "include": true,
          "slug": "find-points-on-a-circle",
          "title": "find points on a circle",
        },
        "PointTowardsMovingPoint": {
          "include": true,
          "slug": "point-object-towards-another",
          "title": "point object towards another",
        },
        "SineCurveAnimation": {
          "include": true,
          "slug": "sine-curve",
          "title": "sine curve",
        },
        "VectorReflectAnimation": {
          "include": true,
          "slug": "vector-reflection",
          "title": "vector reflection (bounce)",
        },
        "VectorRotateAnimation": {
          "include": true,
          "slug": "vector-rotation",
          "title": "vector rotation",
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

  // A6 — the /api "See it in Examples" links are a pure-data projection of the
  // registry, kept standalone so the /api bundle need not import the heavy
  // registry. This locks that projection to ALL_RECORDS; edit the registry and
  // this fails until exampleCoreLinks.ts is regenerated (recipe in its header).
  it("A6 — EXAMPLE_CORE_ROWS matches the visible-record projection of ALL_RECORDS", () => {
    const expected = ALL_RECORDS.filter(
      (r) => r.include !== false && r.coreExports.length > 0
    ).map((r) => ({ slug: r.slug, title: r.title, coreExports: r.coreExports }));
    expect(EXAMPLE_CORE_ROWS).toEqual(expected);
  });
});
