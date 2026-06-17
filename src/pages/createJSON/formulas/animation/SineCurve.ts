import { CollisionDetectionObject } from "../../../../types/types";

export const SineCurve: CollisionDetectionObject = {
  keyFunction: function SineCurve(
    startingValue: number,
    differential: number,
    speed: number
  ) {
    const currentDate = new Date();
    return (
      startingValue + Math.sin(currentDate.getTime() * speed) * differential
    );
  },
  dependencies: [],
  functionString: ` 
  function SineCurve(
    startingValue: number,
    differential: number,
    speed: number
  ) {
    const currentDate = new Date();
    return (
      startingValue + Math.sin(currentDate.getTime() * speed) * differential
    );
  }`,
};
