import { CollisionDetectionObject } from "../../../../types/types";
import { BallBounce as BallBounceFn } from "../../../../core-functions/BallBounce";
import BallBounceSource from "../../../../core-functions/BallBounce.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const BallBounce: CollisionDetectionObject = {
  keyFunction: BallBounceFn,
  dependencies: [],
  interfaces: ["Ball", "Container"],
  functionString: extractFunctionString(BallBounceSource),
};
