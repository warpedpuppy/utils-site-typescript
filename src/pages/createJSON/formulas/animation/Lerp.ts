import { CollisionDetectionObject } from "../../../../types/types";

export const Lerp: CollisionDetectionObject = {
  keyFunction: function Lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },
  dependencies: [],
  functionString: `
  // Lerp moves from value "a" toward value "b" by factor "t" (0–1).
  // Call it every frame with the same t to get smooth follow behaviour.
  //
  //  t = 0   → stays at a
  //  t = 0.5 → halfway between a and b
  //  t = 1   → jumps straight to b
  //
  // Typical usage: pos = lerp(pos, target, 0.08)

  function Lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }`,
};
