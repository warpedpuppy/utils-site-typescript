import { RegistryRecord } from "../types";

import { sineCurve as sineCurveFormula } from "../../pages/createJSON/formulas/animation/SineCurve";
import { unitCirclePoint as unitCirclePointFormula } from "../../pages/createJSON/formulas/animation/UnitCirclePoint";
import { findPointAroundCircle as findPointAroundCircleFormula } from "../../pages/createJSON/formulas/animation/FindPointAroundCircle";
import { getRotation as getRotationFormula } from "../../pages/createJSON/formulas/animation/GetRotation";
import { DistributeAroundCircle as distributeFormula } from "../../pages/createJSON/formulas/animation/DistributeAroundCircle";
import {
  AngleLerpFormula,
  VectorReflectFormula,
  VectorRotateFormula,
} from "../../animationExtraFormulas";

export const TRIG_ANGLES_VECTORS: RegistryRecord[] = [
  {
    slug: "sine-curve",
    title: "sine curve",
    category: "trig, angles & vectors",
    manifestKey: "SineCurveAnimation",
    formula: sineCurveFormula,
    load: () => import("../../core-animations/SineCurve"),
    coreExports: ["sineCurve", "sineWave"],
    primaryCoreExport: "sineCurve",
    pen: "canonical-vm-tested",
  },
  {
    slug: "demystify-sine-and-cosine",
    title: "demystify sine and cosine",
    category: "trig, angles & vectors",
    manifestKey: "DeMystifySineCosine",
    formula: unitCirclePointFormula,
    load: () => import("../../core-animations/DeMystifySineCosine"),
    coreExports: ["unitCirclePoint", "radToDeg"],
    primaryCoreExport: "unitCirclePoint",
    pen: "canonical-vm-tested",
  },
  {
    slug: "find-points-on-a-circle",
    title: "find points on a circle",
    category: "trig, angles & vectors",
    manifestKey: "MoveItemAroundCircle",
    formula: findPointAroundCircleFormula,
    load: () => import("../../core-animations/MoveItemAroundCircle"),
    coreExports: ["findPointAroundCircle"],
    primaryCoreExport: "findPointAroundCircle",
    pen: "canonical-vm-tested",
  },
  {
    slug: "point-object-towards-another",
    title: "point object towards another",
    category: "trig, angles & vectors",
    manifestKey: "PointTowardsMovingPoint",
    formula: getRotationFormula,
    load: () => import("../../core-animations/PointTowards"),
    coreExports: ["getRotation"],
    primaryCoreExport: "getRotation",
    pen: "canonical-vm-tested",
  },
  {
    slug: "distribute-around-circle",
    title: "distribute around circle",
    category: "trig, angles & vectors",
    manifestKey: "DistributePointsAroundACircle",
    formula: distributeFormula,
    load: () => import("../../core-animations/DistributeAroundCircle"),
    coreExports: ["distributeAroundCircle"],
    primaryCoreExport: "distributeAroundCircle",
    pen: "canonical-vm-tested",
  },
  {
    slug: "vector-reflection",
    title: "vector reflection (bounce)",
    category: "trig, angles & vectors",
    manifestKey: "VectorReflectAnimation",
    formula: VectorReflectFormula,
    load: () => import("../../core-animations/VectorReflect"),
    coreExports: ["vecReflect", "vecNormalize", "vecPerpendicular"],
    primaryCoreExport: "vecReflect",
    pen: "canonical-vm-tested",
  },
  {
    slug: "vector-rotation",
    title: "vector rotation",
    category: "trig, angles & vectors",
    manifestKey: "VectorRotateAnimation",
    formula: VectorRotateFormula,
    load: () => import("../../core-animations/VectorRotate"),
    coreExports: ["vecRotate"],
    primaryCoreExport: "vecRotate",
    pen: "canonical-vm-tested",
  },
  {
    slug: "angle-lerp-shortest-turn",
    title: "angle interpolation (shortest turn)",
    category: "trig, angles & vectors",
    manifestKey: "AngleLerpAnimation",
    formula: AngleLerpFormula,
    load: () => import("../../core-animations/AngleLerp"),
    coreExports: ["lerpAngle", "shortestAngleBetween", "wrapAngle"],
    primaryCoreExport: "lerpAngle",
    pen: "canonical-vm-tested",
  },
];
