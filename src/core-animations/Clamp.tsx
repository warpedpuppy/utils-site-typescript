import { makeScalarTransformAnimation } from "./scalarTransformAnimation";
import { clampDemo } from "../components/MiniDemo/scalarTransforms";
import { clamp as clampFormula } from "../pages/createJSON/formulas/animation/Clamp";

export default makeScalarTransformAnimation(clampDemo, clampFormula);
