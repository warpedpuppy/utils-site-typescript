import { CollisionDetectionObject } from "../../../../types/types";
import { RandomIntegerBetween as RandomIntegerBetweenFn } from "../../../../core-functions/RandomIntegerBetween";
import RandomIntegerBetweenSource from "../../../../core-functions/RandomIntegerBetween.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const RandomIntegerBetween: CollisionDetectionObject = {
  keyFunction: RandomIntegerBetweenFn,
  dependencies: [],
  functionString: extractFunctionString(RandomIntegerBetweenSource),
};
