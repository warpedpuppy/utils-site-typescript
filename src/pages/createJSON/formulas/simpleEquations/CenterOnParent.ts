import { CollisionDetectionObject } from "../../../../types/types";
import { CenterOnParent as CenterOnParentFn } from "../../../../core-functions/CenterOnParent";
import CenterOnParentSource from "../../../../core-functions/CenterOnParent.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const CenterOnParent: CollisionDetectionObject = {
  keyFunction: CenterOnParentFn,
  dependencies: [],
  functionString: extractFunctionString(CenterOnParentSource),
};
