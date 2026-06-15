import { CollisionDetectionObject } from "../../../types/types";

export const Deg2Rad: CollisionDetectionObject = {
  keyFunction: function Deg2Rad(degree: number) {
    return degree * (Math.PI / 180);
  },
  dependencies: [],
  functionString: `
function deg2rad(degree: number) {
  return degree * (Math.PI / 180);
}`,
};
