import { CollisionDetectionObject } from "../../../../types/types";
import { ballToBallBounce as BallToBallBounceFn } from "@utilspalooza/core/BallToBallBounce";
import BallToBallBounceSource from "@utilspalooza/core/BallToBallBounce.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const ballToBallBounce: CollisionDetectionObject = {
  keyFunction: BallToBallBounceFn,
  dependencies: [],
  interfaces: ["Ball"],
  functionString: extractFunctionString(BallToBallBounceSource),
};
