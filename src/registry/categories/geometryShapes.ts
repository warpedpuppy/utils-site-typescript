import { RegistryRecord } from "../types";

import { GetPointOnLine as getPointOnLineFormula } from "../../pages/createJSON/formulas/animation/GetPointOnLine";
import { lineLength as lineLengthFormula } from "../../pages/createJSON/formulas/animation/LineLength";
import { triangleDataFromLine as triangleDataFromLineFormula } from "../../pages/createJSON/formulas/animation/TriangleDataFromLine";
import { StarObject as starFormula } from "../../pages/createJSON/formulas/animation/Star";
import { RectangleObject as rectangleFormula } from "../../pages/createJSON/formulas/animation/Rectangle";
import { equilateralTriangle as equilateralTriangleFormula } from "../../pages/createJSON/formulas/animation/EquilateralTriangle";
import { circleFromThreePoints as circleFromThreePointsFormula } from "../../pages/createJSON/formulas/animation/CircleFromThreePoints";
import { centerOnParent } from "../../pages/createJSON/formulas/simpleEquations/CenterOnParent";

export const GEOMETRY_SHAPES: RegistryRecord[] = [
  {
    slug: "get-a-point-on-a-line",
    title: "get a point on a line",
    category: "geometry & shapes",
    manifestKey: "GetHalfwayPointOfLine",
    formula: getPointOnLineFormula,
    load: () => import("../../core-animations/GetPointOnLine"),
    coreExports: ["getPointOnLine"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "line-length",
    title: "get line length",
    category: "geometry & shapes",
    manifestKey: "DistanceBetweenTwoPoints",
    formula: lineLengthFormula,
    load: () => import("../../core-animations/LineLength"),
    coreExports: ["lineLength", "distance"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "get-triangle-data-from-line",
    title: "get triangle data from line",
    category: "geometry & shapes",
    manifestKey: "triangleDataFromLine",
    formula: triangleDataFromLineFormula,
    load: () => import("../../core-animations/TriangleDataFromLine"),
    coreExports: ["triangleDataFromLine", "getTriangleData"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "draw-star",
    title: "draw star",
    category: "geometry & shapes",
    manifestKey: "Star",
    formula: starFormula,
    load: () => import("../../core-animations/Star"),
    coreExports: ["starVertices"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "draw-rectangle",
    title: "draw rectangle (using trig, not rect())",
    category: "geometry & shapes",
    manifestKey: "Polygon",
    formula: rectangleFormula,
    load: () => import("../../core-animations/Polygon"),
    coreExports: ["createRect"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "equilateral-trianlge-points",
    title: "draw equilateral triangle (from radius and center point)",
    category: "geometry & shapes",
    manifestKey: "GetEquilateralTriangleVertices",
    formula: equilateralTriangleFormula,
    load: () => import("../../core-animations/EquilateralTriangle"),
    coreExports: ["equilateralTriangle"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "circle-from-three-points",
    title: "get circle from three points",
    category: "geometry & shapes",
    manifestKey: "CircleFromThreePointsAnimation",
    formula: circleFromThreePointsFormula,
    load: () => import("../../core-animations/CircleFromThreePoints"),
    coreExports: ["circleFromThreePoints"],
    pen: "canonical-vm-tested",
  },
  {
    slug: "center-on-parent",
    title: "center on parent",
    category: "geometry & shapes",
    manifestKey: "CenterOnParentAnimation",
    formula: centerOnParent,
    load: () => import("../../core-animations/CenterOnParentAnimation"),
    coreExports: ["centerOnParent"],
    pen: "canonical-vm-tested",
  },
];
