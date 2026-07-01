import { CollisionDetectionObject } from "../../../../../types/types";
import { lineLine as LineLineImported } from "@utilspalooza/core/CollisionObjectAPI/LineLine";
import LineLineSource from "@utilspalooza/core/CollisionObjectAPI/LineLine.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const lineLine: CollisionDetectionObject = {
  keyFunction: LineLineImported,
  dependencies: [],
  interfaces: ["Line"],
  functionString: extractFunctionString(LineLineSource),
};
