import { makeScalarTransformAnimation } from "./scalarTransformAnimation";
import { lerpDemo } from "../components/MiniDemo/scalarTransforms";
import { lerp as lerpFormula } from "../pages/createJSON/formulas/animation/Lerp";

export default makeScalarTransformAnimation(lerpDemo, lerpFormula);
