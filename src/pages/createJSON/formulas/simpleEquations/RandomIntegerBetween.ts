import { CollisionDetectionObject } from "../../../../types/types";
import { randomIntegerBetween as RandomIntegerBetweenFn } from "@utilspalooza/core/RandomIntegerBetween";
import RandomIntegerBetweenSource from "@utilspalooza/core/RandomIntegerBetween.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const randomIntegerBetween: CollisionDetectionObject = {
  keyFunction: RandomIntegerBetweenFn,
  dependencies: [],
  functionString: extractFunctionString(RandomIntegerBetweenSource),
};
