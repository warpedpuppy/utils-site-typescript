import { describe, it, expect } from "vitest";
import {
  degToRad,
  radToDeg,
  lerp,
  distance,
  lineLength,
  getPointOnLine,
  centerOnParent,
  unitCirclePoint,
  numberWithCommas,
  randomIntegerBetween,
  randomNumberBetween,
  linear,
  easeIn,
  easeOut,
  easeInOut,
  easeInCubic,
  easeOutBounce,
  easeOutElastic,
  pointToCircle,
  pointToRect,
  pointToPolygon,
  rectToRect,
  rectToPolygon,
  circleToRect,
  circleToCircle,
  lineToPoint,
  // remaining raw collision
  lineToCircle,
  lineToLine,
  lineToRect,
  polygonToPolygon,
  // object-API collision
  circleCircle,
  pointCircle,
  linePoint,
  lineLine,
  lineCircle,
  polygonPoint,
  polygonLine,
  polygonCircle,
  polygonPolygon,
  // geometry
  findPointAroundCircle,
  distributeAroundCircle,
  moveAlongLine,
  moveToward,
  getRotation,
  getTriangleData,
  triangleDataFromLine,
  circleFromThreePoints,
  createRect,
  equilateralTriangle,
  starVertices,
  // boids / flocking
  boidsStep,
  Flock,
  // Vec2
  vecAdd,
  vecSubtract,
  vecScale,
  vecDot,
  vecCross,
  vecMagnitude,
  vecMagnitudeSquared,
  vecNormalize,
  vecAngle,
  vecAngleBetween,
  vecRotate,
  vecPerpendicular,
  vecReflect,
  vecLerp,
  vecLimit,
  // Tier A scalar helpers
  clamp,
  mapRange,
  inverseLerp,
  smoothstep,
  smootherstep,
  wrap,
  pingPong,
  wrapAngle,
  shortestAngleBetween,
  lerpAngle,
  // physics (Tier G — damped harmonic spring)
  criticalDamping,
  // color (Tier C)
  rgbToHsl,
  hslToRgb,
  lerpColor,
  lerpColorHsl,
  rgbToCss,
  colorFamily,
  HUE_FAMILIES,
  // now pure & time-driven (post purity fix)
  sineCurve,
  // math-heavy bucket
  dft,
  gameOfLifeStep,
  grStep,
  lensDeflection,
  gravitationalStep,
  sphereLighting,
  sineWave,
  waveAmplitude,
  bezierPoint,
  quadraticBezier,
  ballBounce,
  ballToBallBounce,
  tweenValue,
  tweenObject,
  tweenFrame,
  springValue,
  loop,
  yoyo,
  delay,
  stagger,
} from "@utilspalooza/core";
import {
  distanceAndAngle,
  intersectRect,
  randomHex,
  randomColor,
  legacyCosWave,
  shuffle,
  hexToRgb,
  rgbToHex,
  triangleCircleCollision,
  createParamObject,
  circleToCircleCollisionDetection,
  lineIntersectCircle,
  centerOnStage,
  easeInQuadTime,
  easeInSineTime,
} from "@utilspalooza/core/legacy";

// Small factory so each ball test gets a fresh, fully-typed Ball.
const makeBall = (over: Partial<import("@utilspalooza/core").Ball> = {}) => ({
  id: "b",
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  radius: 10,
  color: "#fff",
  ...over,
});

// These tests exercise the public barrel (@utilspalooza/core), i.e. exactly what
// an npm consumer imports — not the source files directly. Pure math only.

const PI = Math.PI;

describe("angle conversion", () => {
  it("degToRad converts the cardinal angles", () => {
    expect(degToRad(0)).toBe(0);
    expect(degToRad(180)).toBeCloseTo(PI);
    expect(degToRad(360)).toBeCloseTo(2 * PI);
  });

  it("radToDeg is the inverse of degToRad", () => {
    for (const deg of [0, 30, 90, 137, 360]) {
      expect(radToDeg(degToRad(deg))).toBeCloseTo(deg);
    }
  });
});

describe("lerp", () => {
  it("returns the endpoints at t=0 and t=1", () => {
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it("returns the midpoint at t=0.5", () => {
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  it("extrapolates past the range", () => {
    expect(lerp(0, 10, 2)).toBe(20);
    expect(lerp(0, 10, -1)).toBe(-10);
  });
});

describe("color (rgb/hsl conversion + interpolation)", () => {
  const BLUE = { r: 0, g: 0, b: 255 };
  const YELLOW = { r: 255, g: 255, b: 0 };

  it("rgbToHsl reads the primary colors", () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toMatchObject({ h: 0, s: 100, l: 50 });
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toMatchObject({ h: 120, s: 100, l: 50 });
    expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toMatchObject({ h: 240, s: 100, l: 50 });
  });

  it("rgbToHsl reports gray as zero saturation", () => {
    expect(rgbToHsl({ r: 128, g: 128, b: 128 }).s).toBe(0);
  });

  it("hslToRgb is the inverse of rgbToHsl (round-trip)", () => {
    for (const c of [BLUE, YELLOW, { r: 12, g: 200, b: 99 }, { r: 200, g: 30, b: 180 }]) {
      const back = hslToRgb(rgbToHsl(c));
      expect(back.r).toBeCloseTo(c.r, 0);
      expect(back.g).toBeCloseTo(c.g, 0);
      expect(back.b).toBeCloseTo(c.b, 0);
    }
  });

  it("hslToRgb wraps out-of-range hue", () => {
    expect(hslToRgb({ h: 360, s: 100, l: 50 })).toEqual(hslToRgb({ h: 0, s: 100, l: 50 }));
    expect(hslToRgb({ h: -120, s: 100, l: 50 })).toEqual(hslToRgb({ h: 240, s: 100, l: 50 }));
  });

  it("lerpColor returns the endpoints and a muddy-gray midpoint for complements", () => {
    expect(lerpColor(BLUE, YELLOW, 0)).toEqual(BLUE);
    expect(lerpColor(BLUE, YELLOW, 1)).toEqual(YELLOW);
    const mid = lerpColor(BLUE, YELLOW, 0.5);
    // Equal channels == on the gray axis (the whole point of the demo).
    expect(mid.r).toBeCloseTo(mid.g);
    expect(mid.g).toBeCloseTo(mid.b);
  });

  it("lerpColorHsl returns the endpoints and a SATURATED midpoint (not gray)", () => {
    expect(lerpColorHsl(BLUE, YELLOW, 0)).toMatchObject(BLUE);
    expect(lerpColorHsl(BLUE, YELLOW, 1)).toMatchObject(YELLOW);
    const mid = lerpColorHsl(BLUE, YELLOW, 0.5);
    expect(rgbToHsl(mid).s).toBeGreaterThan(50); // stays vivid, unlike lerpColor
  });

  it("rgbToCss rounds channels into an rgb() string", () => {
    expect(rgbToCss({ r: 255, g: 127.5, b: 0 })).toBe("rgb(255, 128, 0)");
  });

  it("colorFamily returns the requested count and is deterministic", () => {
    const a = colorFamily("blue", 5);
    const b = colorFamily("blue", 5);
    expect(a).toHaveLength(5);
    expect(a).toEqual(b);
  });

  it("colorFamily keeps every swatch inside the named hue band", () => {
    const [min, max] = HUE_FAMILIES.green;
    for (const c of colorFamily("green", 8)) {
      const h = rgbToHsl(c).h;
      expect(h).toBeGreaterThanOrEqual(min - 1);
      expect(h).toBeLessThanOrEqual(max + 1);
    }
  });

  it("colorFamily handles the wrap-around red band without producing off-hue colors", () => {
    // red straddles 0°; hues should be near 0 (i.e. <30 or >348), never mid-wheel.
    for (const c of colorFamily("red", 6)) {
      const h = rgbToHsl(c).h;
      expect(h < 30 || h > 348).toBe(true);
    }
  });
});

describe("distance / lineLength", () => {
  it("distance computes the 3-4-5 triangle hypotenuse", () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("distance is zero for identical points", () => {
    expect(distance({ x: 7, y: 7 }, { x: 7, y: 7 })).toBe(0);
  });

  it("lineLength matches distance for the same two points", () => {
    const a = { x: 1, y: 2 };
    const b = { x: 4, y: 6 };
    expect(lineLength({ startPoint: a, endPoint: b })).toBeCloseTo(distance(a, b));
  });
});

describe("getPointOnLine", () => {
  it("returns endpoints at t=0 and t=1", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 10, y: 20 };
    expect(getPointOnLine(a, b, 0)).toEqual(a);
    expect(getPointOnLine(a, b, 1)).toEqual(b);
  });

  it("returns the halfway point at t=0.5", () => {
    expect(getPointOnLine({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5)).toEqual({ x: 5, y: 10 });
  });
});

describe("centerOnParent", () => {
  it("centers a child inside a larger parent", () => {
    const child = { x: 0, y: 0, width: 20, height: 10 };
    const parent = { x: 0, y: 0, width: 100, height: 50 };
    expect(centerOnParent(child, parent)).toEqual({ x: 40, y: 20 });
  });
});

describe("unitCirclePoint", () => {
  it("places a point on the circle and returns its trig components", () => {
    const p = unitCirclePoint(100, 100, 50, 0);
    expect(p.x).toBeCloseTo(150);
    expect(p.y).toBeCloseTo(100);
    expect(p.cos).toBeCloseTo(1);
    expect(p.sin).toBeCloseTo(0);
  });

  it("the returned point always lies on the circle radius", () => {
    for (const t of [0.3, 1.1, 2.7, 5.0]) {
      const p = unitCirclePoint(0, 0, 10, t);
      expect(distance({ x: 0, y: 0 }, p)).toBeCloseTo(10);
    }
  });
});

describe("numberWithCommas", () => {
  it("inserts thousands separators", () => {
    expect(numberWithCommas(1000)).toBe("1,000");
    expect(numberWithCommas(1234567)).toBe("1,234,567");
  });

  it("leaves sub-thousand numbers untouched", () => {
    expect(numberWithCommas(42)).toBe("42");
  });
});

describe("easing functions", () => {
  const eases = { linear, easeIn, easeOut, easeInOut };

  it("all pin the 0->0 and 1->1 endpoints", () => {
    for (const fn of Object.values(eases)) {
      expect(fn(0)).toBeCloseTo(0);
      expect(fn(1)).toBeCloseTo(1);
    }
  });

  it("all stay monotonically non-decreasing across [0,1]", () => {
    for (const fn of Object.values(eases)) {
      let prev = -Infinity;
      for (let t = 0; t <= 1.0001; t += 0.05) {
        const v = fn(t);
        expect(v).toBeGreaterThanOrEqual(prev - 1e-9);
        prev = v;
      }
    }
  });

  it("linear is the identity", () => {
    expect(linear(0.37)).toBe(0.37);
  });
});

describe("randomness (bounds + inclusivity over samples)", () => {
  it("randomNumberBetween stays within [min, max)", () => {
    for (let i = 0; i < 1000; i++) {
      const v = randomNumberBetween(5, 10);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThan(10);
    }
  });

  it("randomIntegerBetween returns integers within the inclusive range", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      const v = randomIntegerBetween(1, 6);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
      seen.add(v);
    }
    // Both endpoints should be reachable (inclusive range).
    expect(seen.has(1)).toBe(true);
    expect(seen.has(6)).toBe(true);
  });
});

describe("collision detection", () => {
  it("pointToCircle: inside, on edge, outside", () => {
    expect(pointToCircle(0, 0, 0, 0, 5)).toBe(true); // center
    expect(pointToCircle(5, 0, 0, 0, 5)).toBe(true); // on edge (<=)
    expect(pointToCircle(6, 0, 0, 0, 5)).toBe(false); // outside
  });

  it("pointToRect: inside vs outside", () => {
    expect(pointToRect(5, 5, 0, 0, 10, 10)).toBe(true);
    expect(pointToRect(11, 5, 0, 0, 10, 10)).toBe(false);
    expect(pointToRect(0, 0, 0, 0, 10, 10)).toBe(true); // corner is inclusive
    expect(pointToRect(10, 10, 0, 0, 10, 10)).toBe(true); // opposite corner is inclusive too
  });

  it("pointToPolygon: inside vs outside a square", () => {
    const square = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
    expect(pointToPolygon(5, 5, square)).toBe(true);
    expect(pointToPolygon(20, 20, square)).toBe(false);
  });

  it("pointToPolygon: works for a concave polygon (L-shape)", () => {
    // L-shape: outer square with inner top-right corner missing
    const lShape = [
      { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 5 },
      { x: 5, y: 5 }, { x: 5, y: 10 }, { x: 0, y: 10 },
    ];
    expect(pointToPolygon(2, 8, lShape)).toBe(true);  // in the bottom of the L
    expect(pointToPolygon(8, 8, lShape)).toBe(false); // in the missing corner
  });

  it("rectToRect: overlapping vs separated", () => {
    expect(rectToRect(0, 0, 10, 10, 5, 5, 10, 10)).toBe(true);
    expect(rectToRect(0, 0, 10, 10, 20, 20, 5, 5)).toBe(false);
    expect(rectToRect(0, 0, 10, 10, 10, 0, 5, 5)).toBe(false); // edge-touch only is not overlap
  });

  it("rectToPolygon: rect overlapping a triangle vs clear of it", () => {
    const tri = [{ x: 5, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
    expect(rectToPolygon(3, 3, 8, 8, tri)).toBe(true);  // triangle vertices inside rect
    expect(rectToPolygon(50, 50, 10, 10, tri)).toBe(false);
  });

  it("rectToPolygon: polygon entirely containing the rect (corner-inside-polygon check)", () => {
    // big polygon surrounds a small rect — no polygon vertex is inside the rect
    const bigSquare = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }];
    expect(rectToPolygon(40, 40, 20, 20, bigSquare)).toBe(true); // rect is inside polygon
  });

  it("circleToRect: circle overlapping a rect vs clear of it", () => {
    expect(circleToRect(0, 0, 5, 3, 0, 10, 10)).toBe(true); // overlaps left edge
    expect(circleToRect(-100, -100, 5, 0, 0, 10, 10)).toBe(false);
    expect(circleToRect(-5, 5, 5, 0, 0, 10, 10)).toBe(true); // exact tangency on left edge
    expect(circleToRect(5, 5, 2, 0, 0, 10, 10)).toBe(true); // fully inside rect
  });

  it("circleToCircle: touching, overlapping, apart", () => {
    expect(circleToCircle(0, 0, 5, 10, 0, 5)).toBe(true); // exactly touching (<=)
    expect(circleToCircle(0, 0, 5, 6, 0, 5)).toBe(true); // overlapping
    expect(circleToCircle(0, 0, 5, 100, 0, 5)).toBe(false); // far apart
  });

  it("lineToPoint: point on the segment vs off it", () => {
    expect(lineToPoint(0, 0, 10, 0, 5, 0, 0.5)).toBe(true); // on the line
    expect(lineToPoint(0, 0, 10, 0, 5, 5, 0.5)).toBe(false); // well above it
  });
});

describe("collision detection — remaining raw functions", () => {
  it("lineToCircle: line through a circle vs clear of it", () => {
    expect(lineToCircle(0, 0, 10, 0, 5, 0, 2)).toBe(true); // passes through center
    expect(lineToCircle(0, 0, 10, 0, 5, 100, 2)).toBe(false); // far away
    expect(lineToCircle(0, 0, 2, 0, 5, 0, 2)).toBe(false); // closest point clamps to endpoint
    expect(lineToCircle(0, 0, 2, 0, 3, 0, 1)).toBe(true); // endpoint-touch after clamping
    expect(lineToCircle(4, 4, 4, 4, 4, 4, 0.5)).toBe(true); // zero-length segment at center
    expect(lineToCircle(4, 4, 4, 4, 10, 10, 1)).toBe(false); // zero-length segment away from circle
  });

  it("lineToLine: crossing segments vs parallel segments", () => {
    expect(lineToLine(0, 0, 10, 10, 0, 10, 10, 0)).toBe(true); // an X
    expect(lineToLine(0, 0, 10, 0, 0, 5, 10, 5)).toBe(false); // parallel
    expect(lineToLine(0, 0, 10, 0, 10, 0, 10, 10)).toBe(true); // shared endpoint
    expect(lineToLine(0, 0, 10, 0, 5, 0, 15, 0)).toBe(false); // collinear overlap counts as false here
  });

  it("lineToRect: line crossing a rect vs missing it", () => {
    expect(lineToRect(-5, 5, 15, 5, 0, 0, 10, 10)).toBe(true); // straight through
    expect(lineToRect(-5, -5, -1, -5, 0, 0, 10, 10)).toBe(false); // off to the side
    expect(lineToRect(2, 2, 8, 8, 0, 0, 10, 10)).toBe(false); // fully inside, no edge crossing
  });

  it("polygonToPolygon (Point[]): overlapping vs separated squares", () => {
    const a = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    const overlapping = a.map((p) => ({ x: p.x + 5, y: p.y + 5 }));
    const apart = a.map((p) => ({ x: p.x + 100, y: p.y + 100 }));
    expect(polygonToPolygon(a, overlapping)).toBe(true);
    expect(polygonToPolygon(a, apart)).toBe(false);
  });
});

describe("collision detection — object API (CollisionObjectAPI)", () => {
  const square = {
    vertices: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ],
  };

  it("circleCircle: overlapping vs apart", () => {
    expect(circleCircle({ x: 0, y: 0, radius: 5 }, { x: 6, y: 0, radius: 5 })).toBe(true);
    expect(circleCircle({ x: 0, y: 0, radius: 5 }, { x: 100, y: 0, radius: 5 })).toBe(false);
  });

  it("circleCircle: exact tangency counts as a hit", () => {
    expect(circleCircle({ x: 0, y: 0, radius: 5 }, { x: 10, y: 0, radius: 5 })).toBe(true);
  });

  it("pointCircle: inside vs outside", () => {
    expect(pointCircle({ x: 1, y: 1 }, { x: 0, y: 0, radius: 5 })).toBe(true);
    expect(pointCircle({ x: 9, y: 9 }, { x: 0, y: 0, radius: 5 })).toBe(false);
  });

  it("pointCircle: points on the circle boundary count as hits", () => {
    expect(pointCircle({ x: 5, y: 0 }, { x: 0, y: 0, radius: 5 })).toBe(true);
  });

  it("linePoint: point on the line vs off it", () => {
    const line = { startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } };
    expect(linePoint(line, { x: 5, y: 0 })).toBe(true);
    expect(linePoint(line, { x: 5, y: 5 })).toBe(false);
  });

  it("linePoint: uses a built-in tolerance for near-line points", () => {
    const line = { startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } };
    expect(linePoint(line, { x: 5, y: 0.05 })).toBe(true);
    expect(linePoint(line, { x: 5, y: 0.2 })).toBe(false);
  });

  it("linePoint: handles zero-length segments as point checks", () => {
    const pointSegment = { startPoint: { x: 3, y: 3 }, endPoint: { x: 3, y: 3 } };
    expect(linePoint(pointSegment, { x: 3.05, y: 3 })).toBe(true);
    expect(linePoint(pointSegment, { x: 3.2, y: 3 })).toBe(false);
  });

  it("lineLine: returns the intersection point when segments cross", () => {
    const result = lineLine(
      { startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 10 } },
      { startPoint: { x: 0, y: 10 }, endPoint: { x: 10, y: 0 } },
    );
    expect(result.hit).toBe(true);
    if (result.hit) {
      expect(result.intersectionX).toBeCloseTo(5);
      expect(result.intersectionY).toBeCloseTo(5);
    }
    const miss = lineLine(
      { startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } },
      { startPoint: { x: 0, y: 5 }, endPoint: { x: 10, y: 5 } },
    );
    expect(miss.hit).toBe(false);
  });

  it("lineLine: counts shared endpoints as hits", () => {
    const result = lineLine(
      { startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } },
      { startPoint: { x: 10, y: 0 }, endPoint: { x: 10, y: 10 } },
    );
    expect(result.hit).toBe(true);
    if (result.hit) {
      expect(result.intersectionX).toBeCloseTo(10);
      expect(result.intersectionY).toBeCloseTo(0);
    }
  });

  it("lineLine: parallel or collinear segments return no hit", () => {
    expect(
      lineLine(
        { startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } },
        { startPoint: { x: 0, y: 5 }, endPoint: { x: 10, y: 5 } },
      ).hit,
    ).toBe(false);

    expect(
      lineLine(
        { startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } },
        { startPoint: { x: 5, y: 0 }, endPoint: { x: 15, y: 0 } },
      ).hit,
    ).toBe(false);
  });

  it("lineCircle: line through a circle vs clear of it", () => {
    const through = { startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } };
    expect(lineCircle(through, { x: 5, y: 0, radius: 2 })).toBe(true);
    expect(lineCircle(through, { x: 5, y: 100, radius: 2 })).toBe(false);
  });

  it("lineCircle: clamps the closest point to the segment endpoints", () => {
    const shortSegment = { startPoint: { x: 0, y: 0 }, endPoint: { x: 2, y: 0 } };
    expect(lineCircle(shortSegment, { x: 5, y: 0, radius: 2 })).toBe(false);
    expect(lineCircle(shortSegment, { x: 3, y: 0, radius: 1 })).toBe(true);
  });

  it("lineCircle: handles a zero-length segment safely", () => {
    const pointSegment = { startPoint: { x: 4, y: 4 }, endPoint: { x: 4, y: 4 } };
    expect(lineCircle(pointSegment, { x: 4, y: 4, radius: 0.5 })).toBe(true);
    expect(lineCircle(pointSegment, { x: 10, y: 10, radius: 1 })).toBe(false);
  });

  it("polygonPoint: point inside the square vs outside", () => {
    expect(polygonPoint(square, { x: 5, y: 5 })).toBe(true);
    expect(polygonPoint(square, { x: 50, y: 50 })).toBe(false);
  });

  it("polygonPoint: works for a concave polygon (L-shape)", () => {
    const lShape = {
      vertices: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 4 },
        { x: 4, y: 4 },
        { x: 4, y: 10 },
        { x: 0, y: 10 },
      ],
    };
    expect(polygonPoint(lShape, { x: 2, y: 8 })).toBe(true);
    expect(polygonPoint(lShape, { x: 8, y: 8 })).toBe(false);
  });

  it("polygonPoint: boundary points follow the raw ray-cast parity result", () => {
    expect(polygonPoint(square, { x: 0, y: 5 })).toBe(true);
    expect(polygonPoint(square, { x: 10, y: 10 })).toBe(false);
  });

  it("polygonLine: line crossing the square vs missing it", () => {
    expect(polygonLine(square, { startPoint: { x: -5, y: 5 }, endPoint: { x: 15, y: 5 } })).toBe(true);
    expect(polygonLine(square, { startPoint: { x: 50, y: 50 }, endPoint: { x: 60, y: 60 } })).toBe(false);
  });

  it("polygonLine: a line fully inside the polygon does not count as an edge crossing", () => {
    expect(polygonLine(square, { startPoint: { x: 2, y: 2 }, endPoint: { x: 8, y: 8 } })).toBe(false);
  });

  it("polygonCircle: circle touching the square vs clear of it", () => {
    expect(polygonCircle(square, { x: 5, y: 5, radius: 2 })).toBe(true); // inside
    expect(polygonCircle(square, { x: 100, y: 100, radius: 2 })).toBe(false);
  });

  it("polygonCircle: detects edge contact and full containment", () => {
    expect(polygonCircle(square, { x: 12, y: 5, radius: 2 })).toBe(true); // tangent to right edge
    expect(polygonCircle(square, { x: 5, y: 5, radius: 4.5 })).toBe(true); // fully inside, no edge crossing needed
  });

  it("polygonPolygon: overlapping vs separated squares", () => {
    const overlapping = { vertices: square.vertices.map((p) => ({ x: p.x + 5, y: p.y + 5 })) };
    const apart = { vertices: square.vertices.map((p) => ({ x: p.x + 100, y: p.y + 100 })) };
    expect(polygonPolygon(square, overlapping)).toBe(true);
    expect(polygonPolygon(square, apart)).toBe(false);
  });

  it("polygonPolygon: detects containment in either direction", () => {
    const inner = {
      vertices: [
        { x: 2, y: 2 },
        { x: 8, y: 2 },
        { x: 8, y: 8 },
        { x: 2, y: 8 },
      ],
    };
    const outer = {
      vertices: [
        { x: -5, y: -5 },
        { x: 15, y: -5 },
        { x: 15, y: 15 },
        { x: -5, y: 15 },
      ],
    };

    expect(polygonPolygon(outer, inner)).toBe(true);
    expect(polygonPolygon(inner, outer)).toBe(true);
  });

  it("polygonPolygon: catches edge crossings even when no vertex is contained", () => {
    const diamond = {
      vertices: [
        { x: 5, y: -2 },
        { x: 12, y: 5 },
        { x: 5, y: 12 },
        { x: -2, y: 5 },
      ],
    };

    expect(polygonPolygon(square, diamond)).toBe(true);
    expect(polygonPolygon(diamond, square)).toBe(true);
  });
});

describe("points around a circle", () => {
  const center = { x: 0, y: 0 };

  it("findPointAroundCircle: 0% / 25% / 50% land on the expected spots", () => {
    let p = findPointAroundCircle(center, 10, 0);
    expect(p.x).toBeCloseTo(10);
    expect(p.y).toBeCloseTo(0);
    p = findPointAroundCircle(center, 10, 25);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(10);
    p = findPointAroundCircle(center, 10, 50);
    expect(p.x).toBeCloseTo(-10);
    expect(p.y).toBeCloseTo(0);
  });

  it("distributeAroundCircle: returns N points, all on the radius, first at angle 0", () => {
    const pts = distributeAroundCircle(center, 10, 8);
    expect(pts).toHaveLength(8);
    for (const p of pts) {
      expect(distance(center, p)).toBeCloseTo(10);
    }
    expect(pts[0].x).toBeCloseTo(10);
    expect(pts[0].y).toBeCloseTo(0);
  });
});

describe("movement helpers", () => {
  it("moveAlongLine: endpoints at ratio 0/1 and midpoint at 0.5", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 10, y: 20 };
    expect(moveAlongLine(a, b, 0)).toEqual(a);
    expect(moveAlongLine(a, b, 1)).toEqual(b);
    expect(moveAlongLine(a, b, 0.5)).toEqual({ x: 5, y: 10 });
  });

  it("moveToward: steps by `speed` and returns the heading angle", () => {
    const obj = { x: 0, y: 0 };
    const angle = moveToward(obj, { x: 10, y: 0 }, 2);
    expect(obj).toEqual({ x: 2, y: 0 });
    expect(angle).toBeCloseTo(0);
  });

  it("moveToward: snaps to the destination when within one step", () => {
    const obj = { x: 0, y: 0 };
    moveToward(obj, { x: 1, y: 0 }, 5);
    expect(obj).toEqual({ x: 1, y: 0 });
  });

  it("getRotation: angle from one point toward another", () => {
    expect(getRotation({ x: 0, y: 0 }, { x: 1, y: 0 })).toBeCloseTo(0);
    expect(getRotation({ x: 0, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(Math.PI / 2);
    expect(getRotation({ x: 0, y: 0 }, { x: -1, y: 0 })).toBeCloseTo(Math.PI);
  });
});

describe("triangle / circle geometry", () => {
  it("getTriangleData: dx, dy and distance for a 3-4-5 triangle", () => {
    const d = getTriangleData({ x: 0, y: 0 }, { x: 3, y: 4 });
    expect(d.dx).toBe(3);
    expect(d.dy).toBe(4);
    expect(d.distance).toBe(5);
  });

  it("triangleDataFromLine: solves the 3-4-5 right triangle", () => {
    const d = triangleDataFromLine({ x: 0, y: 0 }, { x: 4, y: 3 });
    expect(d.hypotenuse).toBeCloseTo(5);
    expect(d.adjacent).toBeCloseTo(4);
    expect(d.opposite).toBeCloseTo(3);
    expect(d.angleInDegrees).toBe(36); // floor(asin(3/5)) = floor(36.87)
    expect(d.remainingAngle).toBe(54);
  });

  it("circleFromThreePoints: recovers the circumcircle of three points on a known circle", () => {
    const c = circleFromThreePoints({ x: 5, y: 0 }, { x: 0, y: 5 }, { x: -5, y: 0 });
    expect(c.radius).toBeCloseTo(5);
    expect(c.center.x).toBeCloseTo(0);
    expect(c.center.y).toBeCloseTo(0);
  });
});

describe("shape vertex generators", () => {
  it("createRect: produces four vertices", () => {
    expect(createRect(10, 10).vertices).toHaveLength(4);
  });

  it("equilateralTriangle: three vertices, all on the radius, 120° apart", () => {
    const center = { x: 0, y: 0 };
    const { point1, point2, point3 } = equilateralTriangle(5, center, 0);
    for (const p of [point1, point2, point3]) {
      expect(distance(center, p)).toBeCloseTo(5);
    }
    // point1 sits at angle 0
    expect(point1.x).toBeCloseTo(5);
    expect(point1.y).toBeCloseTo(0);
    // adjacent vertices are 1/3 of the way around (120°) apart
    const a12 = Math.atan2(point2.y, point2.x) - Math.atan2(point1.y, point1.x);
    expect(Math.abs(a12)).toBeCloseTo((2 * Math.PI) / 3);
  });

  it("starVertices: 2 vertices per spike, alternating outer/inner radius", () => {
    const { vertices } = starVertices(5, 5, 10, 0);
    expect(vertices).toHaveLength(10);
    // even indices sit on the outer radius, odd on the inner
    expect(Math.hypot(vertices[0].x, vertices[0].y)).toBeCloseTo(10);
    expect(Math.hypot(vertices[1].x, vertices[1].y)).toBeCloseTo(5);
  });
});

describe("Vec2 — 2D vector operations", () => {
  it("vecAdd / vecSubtract: component-wise", () => {
    expect(vecAdd({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({ x: 4, y: 6 });
    expect(vecSubtract({ x: 5, y: 5 }, { x: 1, y: 2 })).toEqual({ x: 4, y: 3 });
  });

  it("vecScale: multiplies both components", () => {
    expect(vecScale({ x: 3, y: 4 }, 2)).toEqual({ x: 6, y: 8 });
    expect(vecScale({ x: 3, y: 4 }, 0)).toEqual({ x: 0, y: 0 });
  });

  it("vecDot: 0 for perpendicular, positive for aligned, negative for opposed", () => {
    expect(vecDot({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(0);
    expect(vecDot({ x: 2, y: 0 }, { x: 3, y: 0 })).toBe(6);
    expect(vecDot({ x: 1, y: 0 }, { x: -1, y: 0 })).toBe(-1);
  });

  it("vecCross: sign indicates turn direction", () => {
    expect(vecCross({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(1); // CCW
    expect(vecCross({ x: 1, y: 0 }, { x: 0, y: -1 })).toBe(-1); // CW
    expect(vecCross({ x: 2, y: 0 }, { x: 4, y: 0 })).toBe(0); // parallel
  });

  it("vecMagnitude / vecMagnitudeSquared: 3-4-5", () => {
    expect(vecMagnitude({ x: 3, y: 4 })).toBe(5);
    expect(vecMagnitudeSquared({ x: 3, y: 4 })).toBe(25);
  });

  it("vecNormalize: returns a unit vector, and {0,0} for the zero vector", () => {
    expect(vecNormalize({ x: 0, y: 5 })).toEqual({ x: 0, y: 1 });
    const n = vecNormalize({ x: 3, y: 4 });
    expect(vecMagnitude(n)).toBeCloseTo(1);
    expect(vecNormalize({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 }); // no NaN
  });

  it("vecAngle: angle from the +x axis", () => {
    expect(vecAngle({ x: 1, y: 0 })).toBeCloseTo(0);
    expect(vecAngle({ x: 0, y: 1 })).toBeCloseTo(Math.PI / 2);
  });

  it("vecAngleBetween: unsigned angle in 0..π, 0 for a zero vector", () => {
    expect(vecAngleBetween({ x: 1, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(Math.PI / 2);
    expect(vecAngleBetween({ x: 1, y: 0 }, { x: -1, y: 0 })).toBeCloseTo(Math.PI);
    expect(vecAngleBetween({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(0);
  });

  it("vecRotate: 90° turns (1,0) into (0,1) without changing length", () => {
    const r = vecRotate({ x: 1, y: 0 }, Math.PI / 2);
    expect(r.x).toBeCloseTo(0);
    expect(r.y).toBeCloseTo(1);
    expect(vecMagnitude(r)).toBeCloseTo(1);
  });

  it("vecPerpendicular: rotates 90° CCW", () => {
    const p = vecPerpendicular({ x: 1, y: 0 });
    expect(p.x).toBeCloseTo(0); // tolerant of -0
    expect(p.y).toBeCloseTo(1);
  });

  it("vecReflect: bounces a vector off a surface (unit normal)", () => {
    // falling down-right, hitting the floor (normal pointing up) → goes up-right
    const r = vecReflect({ x: 1, y: -1 }, { x: 0, y: 1 });
    expect(r.x).toBeCloseTo(1);
    expect(r.y).toBeCloseTo(1);
  });

  it("vecLerp: endpoints and midpoint", () => {
    expect(vecLerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 0)).toEqual({ x: 0, y: 0 });
    expect(vecLerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 1)).toEqual({ x: 10, y: 20 });
    expect(vecLerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5)).toEqual({ x: 5, y: 10 });
  });

  it("vecLimit: caps magnitude but leaves shorter vectors untouched", () => {
    const capped = vecLimit({ x: 30, y: 40 }, 10); // was length 50
    expect(vecMagnitude(capped)).toBeCloseTo(10);
    expect(capped).toEqual({ x: 6, y: 8 });
    expect(vecLimit({ x: 3, y: 4 }, 10)).toEqual({ x: 3, y: 4 }); // already short
  });

  it("does not mutate its inputs", () => {
    const a = { x: 1, y: 2 };
    const b = { x: 3, y: 4 };
    vecAdd(a, b);
    vecScale(a, 5);
    vecNormalize(a);
    expect(a).toEqual({ x: 1, y: 2 });
    expect(b).toEqual({ x: 3, y: 4 });
  });
});

describe("Tier A scalar helpers", () => {
  it("clamp: within, below, above", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("mapRange: rescales linearly and extrapolates outside the range", () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
    expect(mapRange(0.5, 0, 1, -180, 180)).toBe(0);
    expect(mapRange(15, 0, 10, 0, 100)).toBe(150); // unclamped
  });

  it("inverseLerp: fraction within a range, 0 when degenerate", () => {
    expect(inverseLerp(0, 100, 25)).toBe(0.25);
    expect(inverseLerp(20, 40, 30)).toBe(0.5);
    expect(inverseLerp(5, 5, 5)).toBe(0); // a === b, no divide-by-zero
  });

  it("inverseLerp is the inverse of lerp", () => {
    expect(inverseLerp(10, 20, lerp(10, 20, 0.3))).toBeCloseTo(0.3);
  });

  it("smoothstep / smootherstep: clamp at the edges, 0.5 at the midpoint", () => {
    expect(smoothstep(0, 10, -2)).toBe(0);
    expect(smoothstep(0, 10, 12)).toBe(1);
    expect(smoothstep(0, 10, 5)).toBeCloseTo(0.5);
    expect(smootherstep(0, 10, 5)).toBeCloseTo(0.5);
    expect(smoothstep(5, 5, 4)).toBe(0); // degenerate edges
    expect(smoothstep(5, 5, 6)).toBe(1);
  });

  it("wrap: loops a value into [min, max)", () => {
    expect(wrap(5, 0, 10)).toBe(5);
    expect(wrap(11, 0, 10)).toBe(1);
    expect(wrap(-1, 0, 10)).toBe(9);
    expect(wrap(20, 0, 10)).toBe(0);
  });

  it("pingPong: triangle wave between 0 and length", () => {
    expect(pingPong(0, 10)).toBe(0);
    expect(pingPong(10, 10)).toBe(10);
    expect(pingPong(15, 10)).toBe(5);
    expect(pingPong(20, 10)).toBe(0);
  });

  it("wrapAngle: normalizes into (-π, π]", () => {
    expect(wrapAngle(3 * Math.PI)).toBeCloseTo(Math.PI); // +half-turn lands on +π
    expect(wrapAngle(-3 * Math.PI)).toBeCloseTo(-Math.PI); // -half-turn lands on -π (same direction)
    expect(wrapAngle(0)).toBeCloseTo(0);
    expect(wrapAngle(2 * Math.PI + 1)).toBeCloseTo(1); // a full turn + 1 rad => 1 rad
  });

  it("shortestAngleBetween: takes the short way across the seam", () => {
    expect(shortestAngleBetween(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
    // from ~350° to ~10° should be a small positive turn, not a huge negative one
    const a = (350 * Math.PI) / 180;
    const b = (10 * Math.PI) / 180;
    expect(shortestAngleBetween(a, b)).toBeCloseTo((20 * Math.PI) / 180);
  });

  it("lerpAngle: interpolates along the shortest arc", () => {
    expect(lerpAngle(0, Math.PI / 2, 0)).toBeCloseTo(0);
    expect(lerpAngle(0, Math.PI / 2, 1)).toBeCloseTo(Math.PI / 2);
    expect(lerpAngle(0, Math.PI / 2, 0.5)).toBeCloseTo(Math.PI / 4);
  });
});

describe("criticalDamping (Tier G — pairs with springValue)", () => {
  // run springValue to rest and report whether it overshot the target on the way
  const settle = (damping: number, steps = 600) => {
    let s = { value: 0, velocity: 0 };
    let overshot = false;
    for (let i = 0; i < steps; i++) {
      s = springValue(s, 100, { stiffness: 170, damping });
      if (s.value > 100.001) overshot = true;
    }
    return { final: s, overshot };
  };

  it("criticalDamping = 2·√(k·m)", () => {
    expect(criticalDamping(170)).toBeCloseTo(2 * Math.sqrt(170));
    expect(criticalDamping(100, 4)).toBeCloseTo(2 * Math.sqrt(400));
  });

  it("damping below critical overshoots; at/above critical does not", () => {
    const crit = criticalDamping(170); // ~26
    expect(settle(crit * 0.25).overshot).toBe(true);
    expect(settle(crit).overshot).toBe(false);
    expect(settle(crit * 3).overshot).toBe(false);
  });

  it("a critically-damped spring still converges to the target", () => {
    const { final } = settle(criticalDamping(170));
    expect(final.value).toBeCloseTo(100, 1);
    expect(final.velocity).toBeCloseTo(0, 2);
  });
});

describe("sineCurve (pure / time-driven)", () => {
  it("returns the baseline when the sine term is zero", () => {
    expect(sineCurve(10, 5, 1, 0)).toBeCloseTo(10); // sin(0) = 0
    expect(sineCurve(10, 5, 0, 12345)).toBeCloseTo(10); // speed 0 => sin(0) = 0
  });

  it("adds amplitude × sin(time × speed) to the baseline", () => {
    // time × speed = π/2 => sin = 1 => baseline + full amplitude
    expect(sineCurve(100, 50, Math.PI / 2, 1)).toBeCloseTo(150);
    // time × speed = 3π/2 => sin = -1 => baseline − full amplitude
    expect(sineCurve(100, 50, (3 * Math.PI) / 2, 1)).toBeCloseTo(50);
  });

  it("is deterministic — same args, same result (no hidden clock)", () => {
    expect(sineCurve(0, 1, 0.002, 5000)).toBe(sineCurve(0, 1, 0.002, 5000));
  });
});

// ─── math-heavy bucket ──────────────────────────────────────────────────────

describe("sineWave", () => {
  it("returns centerY where the sine term is zero (x=0, phase=0)", () => {
    expect(sineWave(0, 200, 50, 120, 0)).toBeCloseTo(200);
  });

  it("hits the crest a quarter-wavelength along", () => {
    expect(sineWave(30, 200, 50, 120, 0)).toBeCloseTo(250); // x/λ = 0.25 => sin(π/2)=1
  });

  it("is periodic in wavelength", () => {
    expect(sineWave(17, 0, 50, 120, 0)).toBeCloseTo(sineWave(17 + 120, 0, 50, 120, 0));
  });
});

describe("waveAmplitude", () => {
  it("is +1 at a single source at t=0 (cos 0)", () => {
    const s = { x: 50, y: 50 };
    expect(waveAmplitude(s.x, s.y, [s], 0, 0.05, 0.1)).toBeCloseTo(1);
  });

  it("averages across sources (two coincident sources still = 1)", () => {
    const s = { x: 0, y: 0 };
    expect(waveAmplitude(0, 0, [s, { ...s }], 0, 0.05, 0.1)).toBeCloseTo(1);
  });

  it("stays within [-1, 1]", () => {
    const sources = [{ x: 0, y: 0 }, { x: 100, y: 40 }];
    for (let x = 0; x < 100; x += 13) {
      const a = waveAmplitude(x, 20, sources, 5, 0.05, 0.1);
      expect(a).toBeGreaterThanOrEqual(-1);
      expect(a).toBeLessThanOrEqual(1);
    }
  });
});

describe("bezierPoint (cubic, de Casteljau)", () => {
  const p0 = { x: 0, y: 0 }, p1 = { x: 0, y: 1 }, p2 = { x: 1, y: 1 }, p3 = { x: 1, y: 0 };

  it("returns the anchors at the endpoints", () => {
    expect(bezierPoint(p0, p1, p2, p3, 0)).toEqual(p0);
    expect(bezierPoint(p0, p1, p2, p3, 1)).toEqual(p3);
  });

  it("computes the midpoint of a symmetric curve", () => {
    const m = bezierPoint(p0, p1, p2, p3, 0.5);
    expect(m.x).toBeCloseTo(0.5);
    expect(m.y).toBeCloseTo(0.75);
  });
});

describe("quadraticBezier", () => {
  const p0 = { x: 0, y: 0 }, p1 = { x: 50, y: 100 }, p2 = { x: 100, y: 0 };

  it("returns the anchors at the endpoints", () => {
    expect(quadraticBezier(0, p0, p1, p2)).toEqual(p0);
    expect(quadraticBezier(1, p0, p1, p2)).toEqual(p2);
  });

  it("matches the closed-form midpoint", () => {
    const m = quadraticBezier(0.5, p0, p1, p2);
    expect(m.x).toBeCloseTo(50);
    expect(m.y).toBeCloseTo(50);
  });
});

describe("dft", () => {
  it("transforms a single point exactly (amp = magnitude, phase = atan2)", () => {
    const out = dft([{ x: 3, y: 4 }]);
    expect(out).toHaveLength(1);
    expect(out[0].freq).toBe(0);
    expect(out[0].amp).toBeCloseTo(5);
    expect(out[0].phase).toBeCloseTo(Math.atan2(4, 3));
  });

  it("preserves length and returns entries sorted by descending amplitude", () => {
    const out = dft([
      { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 },
    ]);
    expect(out).toHaveLength(4);
    for (let i = 1; i < out.length; i++) {
      expect(out[i - 1].amp).toBeGreaterThanOrEqual(out[i].amp);
    }
  });
});

describe("gameOfLifeStep", () => {
  // index = y * cols + x
  const cols = 5, rows = 5;
  const live = (idxs: number[]) => {
    const g = new Uint8Array(cols * rows);
    for (const i of idxs) g[i] = 1;
    return g;
  };
  const liveIndices = (g: ArrayLike<number>) => {
    const out: number[] = [];
    for (let i = 0; i < g.length; i++) if (g[i]) out.push(i);
    return out;
  };

  it("oscillates a blinker (horizontal → vertical)", () => {
    // horizontal: (x=1,2,3 at y=2) => indices 11,12,13
    const next = gameOfLifeStep(live([11, 12, 13]), cols, rows);
    // vertical: (x=2 at y=1,2,3) => indices 7,12,17
    expect(liveIndices(next).sort((a, b) => a - b)).toEqual([7, 12, 17]);
  });

  it("keeps a 2×2 block stable (still life)", () => {
    const block = [6, 7, 11, 12]; // (1,1)(2,1)(1,2)(2,2)
    const next = gameOfLifeStep(live(block), cols, rows);
    expect(liveIndices(next).sort((a, b) => a - b)).toEqual(block);
  });

  it("lets a lone cell die of loneliness", () => {
    expect(liveIndices(gameOfLifeStep(live([12]), cols, rows))).toEqual([]);
  });
});

describe("gravitationalStep (Newtonian)", () => {
  it("pulls the orbiter toward the body", () => {
    const orbiter = { x: 0, y: 0, vx: 0, vy: 0 };
    gravitationalStep(orbiter, { x: 10, y: 0, mass: 100 });
    expect(orbiter.vx).toBeGreaterThan(0); // accelerated toward the body (to the right)
    expect(orbiter.vy).toBeCloseTo(0); // no vertical pull when dy = 0
    expect(orbiter.x).toBeGreaterThan(0); // and it moved
  });
});

describe("grStep (general-relativity correction)", () => {
  it("reduces to Newtonian when grStrength = 0", () => {
    const a = { x: 0, y: 30, vx: 1, vy: 0 };
    const b = { x: 0, y: 30, vx: 1, vy: 0 };
    const sun = { x: 100, y: 30, mass: 200 };
    grStep(a, { ...sun }, 0);
    gravitationalStep(b, { ...sun });
    expect(a.x).toBeCloseTo(b.x);
    expect(a.y).toBeCloseTo(b.y);
    expect(a.vx).toBeCloseTo(b.vx);
    expect(a.vy).toBeCloseTo(b.vy);
  });

  it("pulls harder than Newtonian when grStrength > 0", () => {
    const gr = { x: 0, y: 30, vx: 0, vy: 0 };
    const newton = { x: 0, y: 30, vx: 0, vy: 0 };
    const sun = { x: 50, y: 30, mass: 200 };
    grStep(gr, { ...sun }, 5000);
    gravitationalStep(newton, { ...sun });
    expect(gr.vx).toBeGreaterThan(newton.vx); // stronger inward acceleration
  });
});

describe("lensDeflection", () => {
  it("is zero far from the lens and when the ray runs through its center", () => {
    expect(lensDeflection(0, 0, 500, 0, 2000)).toBe(0); // x outside lx ± 100
    expect(lensDeflection(100, 0, 100, 0, 2000)).toBe(0); // b = 0 (y0 === ly)
  });

  it("bends a near ray, and more massive lenses bend more", () => {
    const d1 = lensDeflection(100, 20, 100, 0, 1600);
    expect(d1).toBeCloseTo(2); // r = b = 20 => 1600/(20*20)*0.5 = 2
    const d2 = lensDeflection(100, 20, 100, 0, 3200);
    expect(d2).toBeCloseTo(2 * d1); // linear in mass
  });
});

describe("sphereLighting", () => {
  const sphere = { x: 100, y: 100, radius: 40 };

  it("places the highlight toward the light, default reach 0.4", () => {
    const hi = sphereLighting(sphere, { x: 300, y: 100 }); // light to the right
    expect(hi.x).toBeCloseTo(116); // 100 + 40 * 0.4
    expect(hi.y).toBeCloseTo(100);
  });

  it("respects the highlightReach parameter and light direction", () => {
    const hi = sphereLighting(sphere, { x: 100, y: 0 }, 0.5); // light straight up (smaller y)
    expect(hi.x).toBeCloseTo(100);
    expect(hi.y).toBeCloseTo(80); // 100 - 40 * 0.5
  });
});

describe("ballBounce", () => {
  const stage = { x: 0, y: 0, width: 800, height: 600 };

  it("applies gravity to vertical velocity", () => {
    const ball = makeBall({ x: 400, y: 300, vy: 0 });
    ballBounce(ball, stage);
    expect(ball.vy).toBeCloseTo(0.4); // gravity
    expect(ball.y).toBeCloseTo(300.4);
  });

  it("clamps to the floor and reverses velocity on impact", () => {
    const ball = makeBall({ x: 400, y: 595, vy: 10, radius: 10 });
    ballBounce(ball, stage);
    expect(ball.y).toBe(stage.height - ball.radius); // clamped to 590
    expect(ball.vy).toBeLessThan(0); // bounced upward
  });

  it("rebounds harder with a higher restitution (bounciness param)", () => {
    const bouncy = makeBall({ x: 400, y: 595, vy: 10, radius: 10 });
    const dull = makeBall({ x: 400, y: 595, vy: 10, radius: 10 });
    ballBounce(bouncy, stage, 0.95);
    ballBounce(dull, stage, 0.5);
    // both bounce up; the bouncier one keeps more speed
    expect(Math.abs(bouncy.vy)).toBeGreaterThan(Math.abs(dull.vy));
  });
});

describe("ballToBallBounce", () => {
  it("pushes overlapping balls apart", () => {
    const a = makeBall({ id: "a", x: 0, y: 0, radius: 10 });
    const b = makeBall({ id: "b", x: 5, y: 0, radius: 10 });
    ballToBallBounce(a, b);
    expect(a.vx).toBeLessThan(0); // shoved left
    expect(b.vx).toBeGreaterThan(0); // shoved right (equal & opposite)
    expect(a.vx).toBeCloseTo(-b.vx);
  });

  it("leaves non-overlapping balls untouched", () => {
    const a = makeBall({ id: "a", x: 0, y: 0, radius: 10 });
    const b = makeBall({ id: "b", x: 100, y: 0, radius: 10 });
    ballToBallBounce(a, b);
    expect(a.vx).toBe(0);
    expect(b.vx).toBe(0);
  });

  it("is a no-op when handed the same ball twice", () => {
    const a = makeBall({ id: "a", x: 0, y: 0, vx: 3, radius: 10 });
    ballToBallBounce(a, a);
    expect(a.vx).toBe(3);
  });
});

describe("boidsStep (Reynolds flocking)", () => {
  it("cohesion pulls two boids toward each other", () => {
    const flock = [
      { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
      { position: { x: 10, y: 0 }, velocity: { x: 0, y: 0 } },
    ];
    boidsStep(flock, {
      perceptionRadius: 100,
      separationRadius: 0,
      separationWeight: 0,
      alignmentWeight: 0,
      cohesionWeight: 1,
      targetWeight: 0,
    });
    expect(flock[0].velocity.x).toBeGreaterThan(0); // toward the one on its right
    expect(flock[1].velocity.x).toBeLessThan(0); // toward the one on its left
  });

  it("separation pushes crowded boids apart", () => {
    const flock = [
      { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
      { position: { x: 5, y: 0 }, velocity: { x: 0, y: 0 } },
    ];
    boidsStep(flock, {
      perceptionRadius: 0, // disable alignment/cohesion
      separationRadius: 20,
      separationWeight: 1,
      alignmentWeight: 0,
      cohesionWeight: 0,
      targetWeight: 0,
    });
    expect(flock[0].velocity.x).toBeLessThan(0); // shoved away from neighbor
    expect(flock[1].velocity.x).toBeGreaterThan(0);
  });

  it("never lets a boid exceed maxSpeed", () => {
    const flock = Array.from({ length: 30 }, () => ({
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      velocity: { x: 0, y: 0 },
    }));
    for (let i = 0; i < 20; i++) boidsStep(flock, { maxSpeed: 3 });
    for (const b of flock) {
      expect(Math.hypot(b.velocity.x, b.velocity.y)).toBeLessThanOrEqual(3 + 1e-9);
    }
  });

  it("is deterministic for identical inputs", () => {
    const make = () => [
      { position: { x: 0, y: 0 }, velocity: { x: 1, y: 0 } },
      { position: { x: 8, y: 3 }, velocity: { x: 0, y: 1 } },
      { position: { x: -4, y: 6 }, velocity: { x: -1, y: -1 } },
    ];
    const a = make();
    const b = make();
    boidsStep(a);
    boidsStep(b);
    expect(a).toEqual(b);
  });

  it("leaves a lone boid with no target coasting unchanged", () => {
    const solo = [{ position: { x: 5, y: 5 }, velocity: { x: 1, y: 0 } }];
    boidsStep(solo);
    expect(solo[0].velocity).toEqual({ x: 1, y: 0 });
    expect(solo[0].position).toEqual({ x: 6, y: 5 });
  });

  it("wraps boids inside toroidal bounds", () => {
    const flock = [{ position: { x: 99, y: 99 }, velocity: { x: 5, y: 5 } }];
    boidsStep(flock, {}, { width: 100, height: 100 });
    expect(flock[0].position.x).toBeGreaterThanOrEqual(0);
    expect(flock[0].position.x).toBeLessThan(100);
    expect(flock[0].position.y).toBeGreaterThanOrEqual(0);
    expect(flock[0].position.y).toBeLessThan(100);
  });
});

describe("tiny animation helpers", () => {
  it("tweenValue samples scalar motion with easing and clamped progress", () => {
    expect(tweenValue(0, 100, 500, 1000)).toBe(50);
    expect(tweenValue(0, 100, 1500, 1000)).toBe(100);
    expect(tweenValue(0, 100, 500, 1000, (t: number) => t * t)).toBe(25);
  });

  it("tweenObject and tweenFrame sample object-shaped animation state", () => {
    const spec = { x: { from: 0, to: 10 }, y: { from: 10, to: 0 }, alpha: { from: 0, to: 1 } };
    expect(tweenObject(spec, 500, 1000)).toEqual({ x: 5, y: 5, alpha: 0.5 });
    expect(tweenFrame(spec, 1000, 1000)).toEqual({ x: 10, y: 0, alpha: 1 });
  });

  it("springValue advances toward the target without mutating the input state", () => {
    const state = { value: 0, velocity: 0 };
    const next = springValue(state, 10);
    expect(next.value).toBeGreaterThan(0);
    expect(next.velocity).toBeGreaterThan(0);
    expect(state).toEqual({ value: 0, velocity: 0 });
  });

  it("loop, yoyo, delay, and stagger return reusable progress values", () => {
    expect(loop(1250, 1000)).toBeCloseTo(0.25);
    expect(yoyo(1500, 1000)).toBeCloseTo(0.5);
    expect(delay(250, 500, 1000)).toBe(0);
    expect(delay(750, 500, 1000)).toBeCloseTo(0.25);
    expect(stagger(2, 700, 1000, 250)).toBeCloseTo(0.2);
  });
});

describe("Flock", () => {
  it("spawns the requested number of boids inside its bounds", () => {
    const flock = new Flock(25, { width: 100, height: 80 });
    expect(flock.boids.length).toBe(25);
    for (const b of flock.boids) {
      expect(b.position.x).toBeGreaterThanOrEqual(0);
      expect(b.position.x).toBeLessThan(100);
      expect(b.position.y).toBeGreaterThanOrEqual(0);
      expect(b.position.y).toBeLessThan(80);
    }
  });

  it("keeps boids within bounds after stepping", () => {
    const flock = new Flock(40, { width: 120, height: 120 });
    for (let i = 0; i < 30; i++) flock.step({ x: 60, y: 60 });
    for (const b of flock.boids) {
      expect(b.position.x).toBeGreaterThanOrEqual(0);
      expect(b.position.x).toBeLessThan(120);
      expect(b.position.y).toBeGreaterThanOrEqual(0);
      expect(b.position.y).toBeLessThan(120);
    }
  });
});

describe("legacy lib migration", () => {
  it("exports the migrated easing functions through the public barrel", () => {
    expect(easeInCubic(0.5)).toBeCloseTo(0.125);
    expect(easeOutBounce(0)).toBeCloseTo(0);
    expect(easeOutBounce(1)).toBeCloseTo(1);
    expect(easeOutElastic(1)).toBeCloseTo(1);
  });

  it("keeps the old tween math pure by requiring explicit time", () => {
    expect(easeInQuadTime(500, 10, 20, 1000)).toBeCloseTo(15);
    expect(easeInSineTime(0, 10, 20, 1000)).toBeCloseTo(10);
  });

  it("ports the old utility geometry and color helpers", () => {
    expect(distanceAndAngle({ x: 0, y: 0 }, { x: 3, y: 4 })).toEqual([5, Math.atan2(4, 3)]);
    expect(
      intersectRect(
        { left: 0, top: 0, right: 10, bottom: 10 },
        { left: 5, top: 5, right: 15, bottom: 15 }
      )
    ).toBe(true);
    expect(hexToRgb("#00ffaa")).toEqual({ r: 0, g: 255, b: 170 });
    expect(rgbToHex(0, 255, 170)).toBe("#00ffaa");
    expect(centerOnStage(20, 10, 100, 50)).toEqual({ x: 40, y: 20 });
  });

  it("ports random and query helpers without browser globals", () => {
    expect(randomHex()).toMatch(/^#[0-9a-f]{6}$/);
    expect(randomColor()).toMatch(/^0x[0-9a-f]{6}$/);
    expect(shuffle([1, 2, 3]).sort()).toEqual([1, 2, 3]);
    expect(createParamObject("?a=1&b=two")).toEqual({ a: "1", b: "two" });
    expect(legacyCosWave(10, 5, 1, 0)).toBe(15);
  });

  it("ports the old collision helpers", () => {
    expect(
      triangleCircleCollision(
        { x: 5, y: 0, radius: 2 },
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 0, y: 10 }
      )
    ).toBe(true);
    expect(circleToCircleCollisionDetection({ x: 0, y: 0, radius: 10 }, { x: 15, y: 0, radius: 10 })).toEqual([
      true,
      5,
    ]);
    expect(lineIntersectCircle({ x: -10, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 0 }, 5)).toBe(true);
  });
});
