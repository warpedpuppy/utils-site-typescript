import { CollisionDetectionObject } from "../../../../types/types";
import { centerOnParent as CenterOnParentFn } from "@utilspalooza/core/CenterOnParent";
import CenterOnParentSource from "@utilspalooza/core/CenterOnParent.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const centerOnParent: CollisionDetectionObject = {
  keyFunction: CenterOnParentFn,
  dependencies: [],
  functionString: extractFunctionString(CenterOnParentSource),
};
