import { CollisionDetectionObject } from "../../../../types/types";
import { Deg2Rad as Deg2RadFn } from "../../../../core-functions/DegToRad";
import Deg2RadSource from "../../../../core-functions/DegToRad.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const Deg2Rad: CollisionDetectionObject = {
  keyFunction: Deg2RadFn,
  dependencies: [],
  functionString: extractFunctionString(Deg2RadSource),
};
