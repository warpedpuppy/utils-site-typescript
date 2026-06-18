import { CollisionDetectionObject } from "../../../../../types/types";
import { PointCircle as PointCircleImported } from "../../../../../core-functions/CollisionObjectAPI/PointCircle";
import PointCircleSource from "../../../../../core-functions/CollisionObjectAPI/PointCircle.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const PointCircle: CollisionDetectionObject = {
  keyFunction: PointCircleImported,
  dependencies: [],
  interfaces: ["Point", "Circle"],
  functionString: extractFunctionString(PointCircleSource),
};
