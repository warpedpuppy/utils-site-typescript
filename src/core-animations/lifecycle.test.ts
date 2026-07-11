import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Lifecycle-cleanup fences (2026-07-11 review, Work Package 4). Three leaks
// are covered:
//  1. Base classes registered `this.resizeHandler` directly, so any subclass
//     that shadows the field (FlowField, CircleField, Klimt, …) leaked the
//     registered base listener on stop(). Both bases now register a stable
//     private _onResize wrapper.
//  2. MoveToDestination's 2s drawDot interval outlived navigation.
//  3. CircleFromThreePoints' setTimeout redraw chain outlived navigation and
//     could double up when the user restarted the point sequence mid-sweep.
//
// The tests run in plain node with hand-rolled DOM stubs (mirroring the VM
// codepen harness approach) so the resize-listener bookkeeping is exact.

type Listener = (...args: unknown[]) => void;

function createCanvasContextStub() {
  const base = {} as Record<string, unknown>;
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

function createElementStub() {
  const ctx = createCanvasContextStub();
  return {
    style: {},
    width: 800,
    height: 600,
    clientWidth: 800,
    clientHeight: 600,
    innerHTML: "",
    appendChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    getContext: () => ctx,
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 800, height: 600 }),
  };
}

const resizeListeners = new Set<Listener>();

function dispatchResize() {
  for (const listener of [...resizeListeners]) listener();
}

beforeEach(() => {
  vi.useFakeTimers();
  resizeListeners.clear();

  vi.stubGlobal("window", {
    addEventListener: (type: string, fn: Listener) => {
      if (type === "resize") resizeListeners.add(fn);
    },
    removeEventListener: (type: string, fn: Listener) => {
      if (type === "resize") resizeListeners.delete(fn);
    },
    innerWidth: 800,
    innerHeight: 600,
  });
  vi.stubGlobal("document", {
    createElement: () => createElementStub(),
    getElementById: () => createElementStub(),
  });
  vi.stubGlobal(
    "Image",
    class {
      src = "";
      addEventListener() {}
      removeEventListener() {}
    }
  );
  vi.stubGlobal("requestAnimationFrame", () => 1);
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("base-class resize listener lifecycle", () => {
  it("AnimationBaseClass removes its resize listener on stop(), even when a subclass shadows resizeHandler", async () => {
    const { default: AnimationBaseClass } = await import("./AnimationBaseClass");

    let subclassResizeCalls = 0;
    class Shadowing extends AnimationBaseClass {
      // Field initializers run AFTER the base constructor registered the
      // listener — exactly the pattern FlowField/CircleField/Klimt use.
      resizeHandler = () => {
        subclassResizeCalls++;
      };
    }

    const instance = new Shadowing("host");
    expect(resizeListeners.size).toBe(1);

    dispatchResize();
    expect(subclassResizeCalls).toBe(1); // the shadowed handler is reached

    instance.stop();
    expect(resizeListeners.size).toBe(0);

    dispatchResize();
    expect(subclassResizeCalls).toBe(1); // no stopped callback runs
  });

  it("animationTemplate removes its resize listener on stop() the same way", async () => {
    const { default: Template } = await import("./animationTemplate");

    let subclassResizeCalls = 0;
    class Shadowing extends Template {
      resizeHandler = () => {
        subclassResizeCalls++;
      };
    }

    const instance = new Shadowing("host");
    expect(resizeListeners.size).toBe(1);
    dispatchResize();
    expect(subclassResizeCalls).toBe(1);

    instance.stop();
    expect(resizeListeners.size).toBe(0);
    dispatchResize();
    expect(subclassResizeCalls).toBe(1);
  });
});

describe("MoveToDestination interval lifecycle", () => {
  it("stop() clears the drawDot interval so no stopped callback runs", async () => {
    const { default: MoveToDestination } = await import("./MoveToDestination");

    const instance = new MoveToDestination("host");
    instance.init();
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    const dotBeforeStop = instance.dotNew;
    instance.stop();
    expect(instance.interval).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(60_000);
    expect(instance.dotNew).toBe(dotBeforeStop); // drawDot never fired again
    expect(resizeListeners.size).toBe(0);
  });
});

describe("CircleFromThreePoints timeout-chain lifecycle", () => {
  function clickThreePoints(instance: {
    pointerDownHandler: (e: PointerEvent) => void;
    points: unknown[];
  }) {
    // A fresh sequence starts once three points exist.
    instance.points.length = 0;
    for (const [x, y] of [
      [100, 100],
      [200, 150],
      [150, 220],
    ]) {
      instance.pointerDownHandler({ pageX: x, pageY: y } as PointerEvent);
    }
  }

  it("restarting the point sequence never runs two redraw chains at once", async () => {
    const { default: CircleFromThreePoints } = await import(
      "./CircleFromThreePoints"
    );
    const instance = new CircleFromThreePoints("host");
    instance.init();

    clickThreePoints(instance);
    expect(vi.getTimerCount()).toBe(1);

    // Mid-sweep, the user restarts the sequence: still exactly one chain.
    clickThreePoints(instance);
    expect(vi.getTimerCount()).toBe(1);
  });

  it("stop() clears the redraw chain so no stopped callback runs", async () => {
    const { default: CircleFromThreePoints } = await import(
      "./CircleFromThreePoints"
    );
    const instance = new CircleFromThreePoints("host");
    instance.init();

    clickThreePoints(instance);
    expect(vi.getTimerCount()).toBe(1);

    instance.stop();
    expect(instance.interval).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);

    const sweepBeforeStop = instance.circleQ;
    vi.advanceTimersByTime(60_000);
    expect(instance.circleQ).toBe(sweepBeforeStop); // drawCircle never fired
    expect(vi.getTimerCount()).toBe(0); // and never rescheduled itself
  });
});
