import { describe, expect, it } from "vitest";
import vm from "node:vm";
import { CODEPEN_GALLERY } from "./pens";

// This is intentionally narrower than CANONICAL_DRAW_PEN_KEYS in the sync test.
// It is a smoke-test allowlist for canonicalized pens whose serialized runtime
// is currently known to boot cleanly under a bare VM stub. Some pens are still
// canonical at the draw-function identity layer while carrying separate runtime
// caveats documented in .claude/STUDIO-CANONICALIZATION-CHECKLIST.md.
const CANONICAL_DRAW_PEN_KEYS = new Set([
  "angle-lerp-shortest-turn",
  "ball-bounce",
  "ball-orbiting-a-sun",
  "balls-bouncing-against-each-other",
  "circle-to-circle-collision",
  "circle-to-rectangle-collision",
  "color-families",
  "color-lerp",
  "distribute-around-circle",
  "easing-functions",
  "draw-rectangle",
  "draw-star",
  "find-points-on-a-circle",
  "get-a-point-on-a-line",
  "line-length",
  "line-to-circle-collision",
  "line-to-line-collision",
  "line-to-point-collision",
  "line-to-rectangle-collision",
  "lerp-smooth-follow",
  "move-to-changing-point",
  "murmuration",
  "point-object-towards-another",
  "point-to-circle-collision",
  "point-to-rectangle-collision",
  "quadratic-bezier-curve",
  "rectangle-to-rectangle-collision",
  "sine-curve",
  "spring-damped-harmonic",
  "vector-reflection",
  "vector-rotation",
  "circle-from-three-points",
  "equilateral-trianlge-points",
  "get-triangle-data-from-line",
  "demystify-sine-and-cosine",
  "polygon-to-polygon-collision",
  "fourier-epicycles",
  "game-of-life",
  "wave-interference",
  "gravitational-lensing",
  "orbital-precession",
  "center-on-parent",
  "degrees-to-radians",
  "radians-to-degrees",
  "format-number-with-commas",
  "random-integer-between",
  "random-number-between",
  "sierpinski",
  "klimt",
  "flow-field",
  "phyllotaxis",
]);

function createCanvasContextStub() {
  const gradient = { addColorStop: () => {} };
  const imageData = (width = 1, height = 1) => ({
    data: new Uint8ClampedArray(Math.max(1, width * height * 4)),
  });

  const base = {
    canvas: { width: 800, height: 600 },
    createImageData: imageData,
    getImageData: imageData,
    putImageData: () => {},
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    measureText: () => ({ width: 100 }),
    setLineDash: () => {},
    getLineDash: () => [],
    resetTransform: () => {},
  } as Record<string, unknown>;

  return new Proxy(base, {
    get(target, prop) {
      if (prop in target) return target[prop as keyof typeof target];
      return () => {};
    },
    set(target, prop, value) {
      target[prop as keyof typeof target] = value;
      return true;
    },
  });
}

function createElementStub(tagName: string, ctxStub: ReturnType<typeof createCanvasContextStub>) {
  return {
    tagName,
    style: {},
    width: 800,
    height: 600,
    clientWidth: 800,
    clientHeight: 600,
    value: "0",
    checked: false,
    textContent: "",
    innerHTML: "",
    appendChild: () => {},
    removeChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    setAttribute: () => {},
    getContext: () => ctxStub,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  };
}

function runPen(js: string) {
  const ctxStub = createCanvasContextStub();
  const elements = new Map<string, ReturnType<typeof createElementStub>>();
  const documentStub = {
    getElementById(id: string) {
      if (!elements.has(id)) {
        const element = createElementStub(id === "canvas" ? "canvas" : "div", ctxStub);
        if (id === "deg") element.value = "45";
        if (id === "rad") element.value = "0.785";
        if (id === "t") element.value = "50";
        if (id === "points") element.value = "20";
        if (id === "speed") element.value = "0.005";
        if (id === "differential") element.value = "200";
        if (id === "starting") element.value = "0";
        if (id === "family") element.value = "all";
        elements.set(id, element);
      }
      return elements.get(id);
    },
    createElement(tagName: string) {
      return createElementStub(tagName, ctxStub);
    },
    body: {
      appendChild: () => {},
      removeChild: () => {},
    },
  };

  const sandbox = {
    console,
    Math,
    Date,
    Uint8ClampedArray,
    Image: class {
      src = "";
      addEventListener() {}
      removeEventListener() {}
    },
    performance: { now: () => 1000 },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    setTimeout: () => 1,
    clearTimeout: () => {},
    window: {
      addEventListener: () => {},
      removeEventListener: () => {},
      innerWidth: 800,
      innerHeight: 600,
    },
    document: documentStub,
  };

  vm.runInNewContext(js, sandbox, { timeout: 1000 });
}

describe("canonicalized CodePen payloads boot without startup exceptions", () => {
  it("runs every completed canonical pen without missing serialized helpers", () => {
    const failures: string[] = [];

    for (const pen of CODEPEN_GALLERY) {
      if (!CANONICAL_DRAW_PEN_KEYS.has(pen.key)) continue;

      try {
        runPen(pen.payload.js);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`${pen.key}: ${message}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
