import { CollisionDetectionObject } from "../../../../../types/types";
import { pointCircle as PointCircleImported } from "@utilspalooza/core/CollisionObjectAPI/PointCircle";
import PointCircleSource from "@utilspalooza/core/CollisionObjectAPI/PointCircle.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const pointCircle: CollisionDetectionObject = {
  keyFunction: PointCircleImported,
  dependencies: [],
  interfaces: ["Point", "Circle"],
  functionString: extractFunctionString(PointCircleSource),
};
