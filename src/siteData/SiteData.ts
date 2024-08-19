import CircleFromThreePoints from "./animations/trig/CircleFromThreePoints";
import GetHalfwayPointOfLine from "./animations/geometry/GetHalfwayPointOfLine";
import GetEquilateralTriangleVertices from "./animations/trig/GetEquilateralTriangleVertices";
import MoveObjectToDestinationPoint from "./animations/trig/MoveObjectToDestinationPoint";
import DistanceBetweenTwoPoints from "./animations/trig/DistanceBetweenTwoPoints";
import TriangleDataFromLine from "./animations/trig/TriangleDataFromLine";
import PointTowardsMovingPoint from "./animations/trig/PointTowardsMovingPoint";
import MoveItemAroundCircle from "./animations/trig/MoveItemAroundCircle";
import SineCurve from "./animations/trig/SineCurve";
import DistributePointsAroundACircle from "./animations/trig/DistributePointsAroundACircle";
import DeMystifySineCosine from "./animations/trig/DeMystifySineCosine";
import BallBounce from "./animations/geometry/BallBounce";
import BallsBouncingAgainstEachOther from "./animations/geometry/BallsBouncingAgainstEachOther";

const SiteData = {
  geometry: {
    BallBounce,
    GetHalfwayPointOfLine,
    BallsBouncingAgainstEachOther,
  },
  trig: {
    DistributePointsAroundACircle,
    DistanceBetweenTwoPoints,
    GetEquilateralTriangleVertices,
    CircleFromThreePoints,
    MoveItemAroundCircle,
    MoveObjectToDestinationPoint,
    PointTowardsMovingPoint,
    TriangleDataFromLine,
    SineCurve,
    DeMystifySineCosine,
  },
  collissionDetection: {},
};

export default SiteData;
