import { CollisionDetectionObject } from "../../../../types/types";

export const RandomNumberBetween: CollisionDetectionObject = {
  keyFunction: function randoRandomNumberBetweenmNumberBetween(
    min: number,
    max: number
  ) {
    return Math.random() * (max - min) + min;
  },
  dependencies: [],
  functionString: `
function RandomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}`,
};
