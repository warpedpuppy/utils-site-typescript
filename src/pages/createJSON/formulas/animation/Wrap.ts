import { CollisionDetectionObject } from "../../../../types/types";
import { wrap as WrapFn } from "@utilspalooza/core/Wrap";
import WrapSource from "@utilspalooza/core/Wrap.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const wrap: CollisionDetectionObject = {
  keyFunction: WrapFn,
  dependencies: [],
  functionString: extractFunctionString(WrapSource),
};
