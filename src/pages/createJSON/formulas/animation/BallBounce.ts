import { CollisionDetectionObject } from "../../../../types/types";
import { BallBounce as BallBounceFn } from "@utilspalooza/core/BallBounce";
import BallBounceSource from "@utilspalooza/core/BallBounce.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const BallBounce: CollisionDetectionObject = {
  keyFunction: BallBounceFn,
  dependencies: [],
  interfaces: ["Ball", "Container"],
  functionString: extractFunctionString(BallBounceSource),
};
