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
import PointToCircleCollision from "./animations/collisionDetection/PointToCircle";
import CircleToCircleCollision from "./animations/collisionDetection/CircleToCircle";
import RectToRect from "./animations/collisionDetection/RectToRect";
import PointToRectangle from "./animations/collisionDetection/PointToRect";
import CirceToRectCollision from "./animations/collisionDetection/CircleToRect";
import LineToCircleCollision from "./animations/collisionDetection/LineToCircle";
import LineToLineCollision from "./animations/collisionDetection/LineToLine";
import LineToPointCollision from "./animations/collisionDetection/LineToPoint";
import LineToRectangleCollision from "./animations/collisionDetection/LineToRect";
import PolygonToPolygonCollision from "./animations/collisionDetection/PolygonToPolygonCollision";
const SiteData = {
  collissionDetection: {
    PointToCircleCollision,
    PointToRectangle,
    RectToRect,
    CirceToRectCollision,
    CircleToCircleCollision,
    LineToCircleCollision,
    LineToLineCollision,
    LineToPointCollision,
    LineToRectangleCollision,
    PolygonToPolygonCollision,
  },
  trig: {
    BallBounce,
    BallsBouncingAgainstEachOther,
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
    GetHalfwayPointOfLine,
  },
};

export default SiteData;
