import { CollisionDetectionObject } from "../../../../types/types";
import { CenterOnParent as CenterOnParentFn } from "@utilspalooza/core/CenterOnParent";
import CenterOnParentSource from "@utilspalooza/core/CenterOnParent.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const CenterOnParent: CollisionDetectionObject = {
  keyFunction: CenterOnParentFn,
  dependencies: [],
  functionString: extractFunctionString(CenterOnParentSource),
};
