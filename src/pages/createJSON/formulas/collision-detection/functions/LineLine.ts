import { CollisionDetectionObject } from "../../../../../types/types";
import { LineLine as LineLineImported } from "../../../../../core-functions/CollisionObjectAPI/LineLine";
import LineLineSource from "../../../../../core-functions/CollisionObjectAPI/LineLine.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const LineLine: CollisionDetectionObject = {
  keyFunction: LineLineImported,
  dependencies: [],
  interfaces: ["Line"],
  functionString: extractFunctionString(LineLineSource),
};
