import circleFromThreePoints from "./animations/trig/getCircleFromThreePoints";
import getHalfwayPointofLine from "./animations/geometry/getHalfwayPointofLine";
import equilateralTriangleVertices from "./animations/trig/getEquilateralTriangleVertices";
import pointMovingObjectInCorrectDirection from "./animations/trig/pointMovingObjectInCorrectDirection";
import distanceBetweenTwoPoints from "./animations/trig/distanceBetweenTwoPoints";
import findCoordinatesForRightTriangleOnCircle from "./animations/trig/findCoordinatesForRightTriangleOnCircle";
import moveObjectTowardsChangingPoint from "./animations/trig/moveObjectTowardsChangingPoint";
const SiteData = {
  trig: {
    circleFromThreePoints,
    equilateralTriangleVertices,
    pointMovingObjectInCorrectDirection,
    distanceBetweenTwoPoints,
    findCoordinatesForRightTriangleOnCircle,
    moveObjectTowardsChangingPoint,
  },
  geometry: {
    getHalfwayPointofLine,
  },
};

export default SiteData;
