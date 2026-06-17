import { CollisionDetectionObject } from "../../../../types/types";

export const NumberWithCommas: CollisionDetectionObject = {
  keyFunction: function NumberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  dependencies: [],
  functionString: `
function NumberWithCommas(x: number) {
  return x.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
}`,
};
