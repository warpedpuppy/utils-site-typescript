import { CollisionDetectionObject } from "../../../../types/types";
import { RandomNumberBetween as RandomNumberBetweenFn } from "../../../../core-functions/RandomNumberBetween";
import RandomNumberBetweenSource from "../../../../core-functions/RandomNumberBetween.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const RandomNumberBetween: CollisionDetectionObject = {
  keyFunction: RandomNumberBetweenFn,
  dependencies: [],
  functionString: extractFunctionString(RandomNumberBetweenSource),
};
