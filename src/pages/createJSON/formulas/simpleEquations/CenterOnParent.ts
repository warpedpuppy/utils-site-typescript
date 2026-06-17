import { CollisionDetectionObject } from "../../../../types/types";

export const CenterOnParent: CollisionDetectionObject = {
  keyFunction: function CenterOnParent(item: any, parent: any) {
    let x = (parent.width - item.width) / 2;
    let y = (parent.height - item.height) / 2;
    return { x, y };
  },
  dependencies: [],
  functionString: `
function centerOnParent(item: any, parent: any) {
  let x = (parent.width - item.width) / 2;
  let y = (parent.height - item.height) / 2;
  return { x, y };
}
`,
};
