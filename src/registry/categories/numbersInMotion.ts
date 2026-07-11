import { RegistryRecord } from "../types";

import { lerp as lerpFormula } from "../../pages/createJSON/formulas/animation/Lerp";
import { inverseLerp as inverseLerpFormula } from "../../pages/createJSON/formulas/animation/InverseLerp";
import { mapRange as mapRangeFormula } from "../../pages/createJSON/formulas/animation/MapRange";
import { clamp as clampFormula } from "../../pages/createJSON/formulas/animation/Clamp";
import { wrap as wrapFormula } from "../../pages/createJSON/formulas/animation/Wrap";
import { pingPong as pingPongFormula } from "../../pages/createJSON/formulas/animation/PingPong";
import { smoothstep as smoothstepFormula } from "../../pages/createJSON/formulas/animation/Smoothstep";

// Scalar primitives. These are docs-first: each shows the shared scalar
// mini-demo (same drawing as the /api docs) and intentionally has NO CodePen
// pen — hence pen: "mini-demo-no-pen" (see CLAUDE.md, "Docs are friendly,
// visual, and ELI5", and the MINI_DEMO carve-out the studio tests derive from
// this field).
export const NUMBERS_IN_MOTION: RegistryRecord[] = [
  {
    slug: "lerp",
    title: "lerp",
    category: "numbers in motion",
    manifestKey: "LerpScalarAnimation",
    formula: lerpFormula,
    load: () => import("../../core-animations/ScalarLerp"),
    coreExports: ["lerp"],
    primaryCoreExport: "lerp",
    pen: "mini-demo-no-pen",
  },
  {
    slug: "inverse-lerp",
    title: "inverse lerp",
    category: "numbers in motion",
    manifestKey: "InverseLerpAnimation",
    formula: inverseLerpFormula,
    load: () => import("../../core-animations/InverseLerp"),
    coreExports: ["inverseLerp"],
    primaryCoreExport: "inverseLerp",
    pen: "mini-demo-no-pen",
  },
  {
    slug: "map-range",
    title: "map range",
    category: "numbers in motion",
    manifestKey: "MapRangeAnimation",
    formula: mapRangeFormula,
    load: () => import("../../core-animations/MapRange"),
    coreExports: ["mapRange"],
    primaryCoreExport: "mapRange",
    pen: "mini-demo-no-pen",
  },
  {
    slug: "clamp",
    title: "clamp",
    category: "numbers in motion",
    manifestKey: "ClampAnimation",
    formula: clampFormula,
    load: () => import("../../core-animations/Clamp"),
    coreExports: ["clamp"],
    primaryCoreExport: "clamp",
    pen: "mini-demo-no-pen",
  },
  {
    slug: "wrap",
    title: "wrap",
    category: "numbers in motion",
    manifestKey: "WrapAnimation",
    formula: wrapFormula,
    load: () => import("../../core-animations/Wrap"),
    coreExports: ["wrap"],
    primaryCoreExport: "wrap",
    pen: "mini-demo-no-pen",
  },
  {
    slug: "ping-pong",
    title: "ping pong",
    category: "numbers in motion",
    manifestKey: "PingPongAnimation",
    formula: pingPongFormula,
    load: () => import("../../core-animations/PingPong"),
    coreExports: ["pingPong"],
    primaryCoreExport: "pingPong",
    pen: "mini-demo-no-pen",
  },
  {
    slug: "smoothstep",
    title: "smoothstep",
    category: "numbers in motion",
    manifestKey: "SmoothstepAnimation",
    formula: smoothstepFormula,
    load: () => import("../../core-animations/Smoothstep"),
    coreExports: ["smoothstep", "smootherstep"],
    primaryCoreExport: "smoothstep",
    pen: "mini-demo-no-pen",
  },
];
