import { makeScalarTransformAnimation } from "./scalarTransformAnimation";
import { smoothstepDemo } from "../components/MiniDemo/scalarTransforms";
import { smoothstep as smoothstepFormula } from "../pages/createJSON/formulas/animation/Smoothstep";

export default makeScalarTransformAnimation(smoothstepDemo, smoothstepFormula);
