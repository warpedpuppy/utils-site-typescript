// The docs-altitude visual dispatch for /api. Given an API entry, EntryVisual
// picks the ONE live demo that teaches it — easing sweep, parametric sliders,
// timeline sample, color conversion, draggable geometry, or the scalar
// mini-demo — or, when there's no docs cut, links out to the richer /examples
// animation. The math in every demo is single-sourced from @utilspalooza/core
// (CLAUDE.md, "Docs are friendly, visual, and ELI5"); this file only routes an
// entry name to the right component.
import { Link } from "react-router-dom";
import MiniDemo, { MiniDemoProps } from "../../components/MiniDemo/MiniDemo";
import EasingMiniDemo from "../../components/MiniDemo/EasingMiniDemo";
import InteractiveMiniDemo from "../../components/MiniDemo/InteractiveMiniDemo";
import AnimateMiniDemo from "../../components/MiniDemo/AnimateMiniDemo";
import ColorMiniDemo from "../../components/MiniDemo/ColorMiniDemo";
import ConstructiveGeometryDemo from "../../components/MiniDemo/ConstructiveGeometryDemo";
import { INTERACTIVE_DEMOS } from "../../components/MiniDemo/interactiveDemos";
import { ANIMATE_DEMOS } from "../../components/MiniDemo/animateDemos";
import { COLOR_DEMOS } from "../../components/MiniDemo/colorDemos";
import { CONSTRUCTIVE_GEOMETRY_DEMOS } from "../../components/MiniDemo/constructiveGeometryDemos";
import { SCALAR_TRANSFORM_DEMOS } from "../../components/MiniDemo/scalarTransforms";
import { pingPong } from "@utilspalooza/core/PingPong";
import {
  linear, easeIn, easeOut, easeInOut,
  easeInQuad, easeOutQuad, easeInOutQuad,
  easeInCubic, easeOutCubic, easeInOutCubic,
  easeInQuart, easeOutQuart, easeInOutQuart,
  easeInQuint, easeOutQuint, easeInOutQuint,
  easeOutElastic, easeOutBounce,
} from "@utilspalooza/core/Easing";
import { getEntryVisual } from "./docsManifest";
import type { ApiEntry } from "./apiModel";

// Scalar transforms keyed by their docs slug → the core export name they drive.
const TRANSFORM_FN_NAMES: Record<string, string> = {
  lerp: "lerp",
  "inverse-lerp": "inverseLerp",
  "map-range": "mapRange",
  clamp: "clamp",
  wrap: "wrap",
  smoothstep: "smoothstep",
  smootherstep: "smootherstep",
};

const EASING_DEMOS: Record<string, (t: number) => number> = {
  linear, easeIn, easeOut, easeInOut,
  easeInQuad, easeOutQuad, easeInOutQuad,
  easeInCubic, easeOutCubic, easeInOutCubic,
  easeInQuart, easeOutQuart, easeInOutQuart,
  easeInQuint, easeOutQuint, easeInOutQuint,
  easeOutElastic, easeOutBounce,
};

// pingPong is a generator (one number, `fn` path); the rest are transforms keyed
// by their core export name, driven by SCALAR_TRANSFORM_DEMOS (the `sample` path).
const MINI_DEMOS: Record<string, MiniDemoProps> = {
  pingPong: { fn: pingPong, length: 100, label: "pingPong(t, 100)" },
};

for (const demo of SCALAR_TRANSFORM_DEMOS) {
  MINI_DEMOS[TRANSFORM_FN_NAMES[demo.slug]] = {
    sample: demo.sample,
    length: demo.length,
    label: demo.label,
    inputMin: demo.inputMin,
    inputMax: demo.inputMax,
  };
}

// Independent conditionals (not an if/else chain) to preserve the original
// ApiEntryCard semantics exactly: the mini-demo registries are allowed to
// overlap, and the sole known overlap (a name in both INTERACTIVE_DEMOS and
// MINI_DEMOS, e.g. mapRange) is resolved by the `!INTERACTIVE_DEMOS` guard on
// the scalar mini-demo block — same as before the extraction.
export function EntryVisual({ entry }: { entry: ApiEntry }) {
  const visual = getEntryVisual(entry.name);
  const geometryDemo = CONSTRUCTIVE_GEOMETRY_DEMOS[entry.name];
  return (
    <>
      {visual.kind === "mini-demo" && EASING_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">See it move:</p>
          <EasingMiniDemo ease={EASING_DEMOS[entry.name]} label={`${entry.name}(t)`} height={200} />
        </>
      )}
      {visual.kind === "mini-demo" && INTERACTIVE_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">Play with the arguments:</p>
          <InteractiveMiniDemo demo={INTERACTIVE_DEMOS[entry.name]} />
        </>
      )}
      {visual.kind === "mini-demo" && ANIMATE_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">Sample the timeline:</p>
          <AnimateMiniDemo demo={ANIMATE_DEMOS[entry.name]} />
        </>
      )}
      {visual.kind === "mini-demo" && COLOR_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">
            {entry.name === "sphereLighting" ? "Drag the light:" : "See the conversion:"}
          </p>
          <ColorMiniDemo demo={COLOR_DEMOS[entry.name]} />
        </>
      )}
      {visual.kind === "mini-demo" && geometryDemo && (
        <>
          <p className="api-docs__demo-caption">Drag the scene:</p>
          <ConstructiveGeometryDemo demo={geometryDemo} />
        </>
      )}
      {visual.kind === "mini-demo" && !INTERACTIVE_DEMOS[entry.name] && MINI_DEMOS[entry.name] && (
        <>
          <p className="api-docs__demo-caption">See it move:</p>
          <MiniDemo {...MINI_DEMOS[entry.name]} />
        </>
      )}
      {visual.kind === "example" && visual.exampleSlug && (
        <div className="api-docs__example-callout">
          <p>See it in a richer canvas example:</p>
          <Link to={`/examples/${visual.exampleSlug}`} state={{ fromApi: true, fnName: entry.name }}>
            {visual.exampleLabel ?? "Open the example"}
          </Link>
        </div>
      )}
    </>
  );
}
