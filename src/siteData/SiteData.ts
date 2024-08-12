import circleFromThreePoints from "./animations/trig/getCircleFromThreePoints";
import getHalfwayPointofLine from "./animations/geometry/getHalfwayPointofLine";
import equilateralTriangleVertices from "./animations/trig/getEquilateralTriangleVertices";
import pointMovingObjectInCorrectDirection from "./animations/trig/pointMovingObjectInCorrectDirection";

const SiteData = {
  trig: {
    circleFromThreePoints,
    equilateralTriangleVertices,
    pointMovingObjectInCorrectDirection
  },
  geometry: {
    getHalfwayPointofLine,
  }
}

export default SiteData;