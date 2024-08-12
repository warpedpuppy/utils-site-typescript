import circleFromThreePoints from "./animations/trig/getCircleFromThreePoints";
import getHalfwayPointofLine from "./animations/geometry/getHalfwayPointofLine";
import equilateralTriangleVertices from "./animations/trig/getEquilateralTriangleVertices";
import pointMovingObjectInCorrectDirection from "./animations/trig/pointMovingObjectInCorrectDirection";
import distanceBetweenTwoPoints from "./animations/trig/distanceBetweenTwoPoints";
const SiteData = {
  trig: {
    circleFromThreePoints,
    equilateralTriangleVertices,
    pointMovingObjectInCorrectDirection,
    distanceBetweenTwoPoints
  },
  geometry: {
    getHalfwayPointofLine,
  }
}

export default SiteData;