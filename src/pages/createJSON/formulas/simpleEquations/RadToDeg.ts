import { CollisionDetectionObject } from "../../../../types/types";

export const Rad2Deg: CollisionDetectionObject = {
  keyFunction: function Rad2Deg(radians: number) {
    return (radians * 180) / Math.PI;
  },
  dependencies: [],
  functionString: `
function Rad2Deg(radians: number) {
    return (radians * 180) / Math.PI;
}`,
};
