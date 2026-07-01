import { makeScalarTransformAnimation } from "./scalarTransformAnimation";
import { mapRangeDemo } from "../components/MiniDemo/scalarTransforms";
import { mapRange as mapRangeFormula } from "../pages/createJSON/formulas/animation/MapRange";

export default makeScalarTransformAnimation(mapRangeDemo, mapRangeFormula);
