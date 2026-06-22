import { CollisionDetectionObject } from "../../../../types/types";
import { randomNumberBetween as RandomNumberBetweenFn } from "@utilspalooza/core/RandomNumberBetween";
import RandomNumberBetweenSource from "@utilspalooza/core/RandomNumberBetween.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const randomNumberBetween: CollisionDetectionObject = {
  keyFunction: RandomNumberBetweenFn,
  dependencies: [],
  functionString: extractFunctionString(RandomNumberBetweenSource),
};
