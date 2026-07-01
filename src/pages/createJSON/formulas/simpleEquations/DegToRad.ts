import { CollisionDetectionObject } from "../../../../types/types";
import { degToRad as Deg2RadFn } from "@utilspalooza/core/DegToRad";
import Deg2RadSource from "@utilspalooza/core/DegToRad.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const degToRad: CollisionDetectionObject = {
  keyFunction: Deg2RadFn,
  dependencies: [],
  functionString: extractFunctionString(Deg2RadSource),
};
