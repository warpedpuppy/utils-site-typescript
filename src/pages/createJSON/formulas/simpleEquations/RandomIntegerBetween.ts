import { CollisionDetectionObject } from "../../../../types/types";

export const RandomIntegerBetween: CollisionDetectionObject = {
  keyFunction: function RandomIntegerBetween(min: number, max: number) {
    max++;
    return Math.floor(Math.random() * (max - min) + min);
  },
  dependencies: [],
  functionString: `
function RandomIntegerBetween(min: number, max: number) {
  max++;
  return Math.floor(Math.random() * (max - min) + min);
}`,
};
