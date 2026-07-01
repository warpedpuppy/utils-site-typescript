import { CollisionDetectionObject } from "../../../../types/types";
import { pingPong as PingPongFn } from "@utilspalooza/core/PingPong";
import PingPongSource from "@utilspalooza/core/PingPong.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const pingPong: CollisionDetectionObject = {
  keyFunction: PingPongFn,
  dependencies: [],
  functionString: extractFunctionString(PingPongSource),
};
