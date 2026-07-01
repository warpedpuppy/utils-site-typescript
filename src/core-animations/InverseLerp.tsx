import { makeScalarTransformAnimation } from "./scalarTransformAnimation";
import { inverseLerpDemo } from "../components/MiniDemo/scalarTransforms";
import { inverseLerp as inverseLerpFormula } from "../pages/createJSON/formulas/animation/InverseLerp";

export default makeScalarTransformAnimation(inverseLerpDemo, inverseLerpFormula);
