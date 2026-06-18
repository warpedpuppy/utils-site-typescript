import { CollisionDetectionObject } from "../../../../types/types";
import { BallToBallBounce as BallToBallBounceFn } from "../../../../core-functions/BallToBallBounce";
import BallToBallBounceSource from "../../../../core-functions/BallToBallBounce.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const BallToBallBounce: CollisionDetectionObject = {
  keyFunction: BallToBallBounceFn,
  dependencies: [],
  interfaces: ["Ball"],
  functionString: extractFunctionString(BallToBallBounceSource),
};
