import circleFromThreePoints from "./animations/trig/getCircleFromThreePoints";
import getHalfwayPointofLine from "./animations/geometry/getHalfwayPointofLine";
import equilateralTriangleVertices from "./animations/trig/getEquilateralTriangleVertices";
import pointMovingObjectInCorrectDirection from "./animations/trig/pointMovingObjectInCorrectDirection";
import distanceBetweenTwoPoints from "./animations/trig/distanceBetweenTwoPoints";
import findCoordinatesForRightTriangleOnCircle from "./animations/trig/findCoordinatesForRightTriangleOnCircle";
import rotateObjectTowardsChangingPoint from "./animations/trig/rotateObjectTowardsChangingPoint";
import pointsAroundACircle from "./animations/trig/pointsAroundACircle";
const SiteData = {
  trig: {
    circleFromThreePoints,
    equilateralTriangleVertices,
    pointMovingObjectInCorrectDirection,
    distanceBetweenTwoPoints,
    findCoordinatesForRightTriangleOnCircle,
    rotateObjectTowardsChangingPoint,
    pointsAroundACircle,
  },
  geometry: {
    getHalfwayPointofLine,
  },
};

export default SiteData;
