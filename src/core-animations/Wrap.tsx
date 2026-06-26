import { makeScalarTransformAnimation } from "./scalarTransformAnimation";
import { wrapDemo } from "../components/MiniDemo/scalarTransforms";
import { wrap as wrapFormula } from "../pages/createJSON/formulas/animation/Wrap";

export default makeScalarTransformAnimation(wrapDemo, wrapFormula);
