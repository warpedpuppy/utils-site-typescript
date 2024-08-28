import CircleFromThreePoints_Anim from "./animations/trig-animations/CircleFromThreePoints_anim";
import GetHalfwayPointOfLine from "./animations/trig-animations/GetHalfwayPointOfLine";
import GetEquilateralTriangleVertices from "./animations/trig-animations/GetEquilateralTriangleVertices_anim";
import MoveObjectToDestinationPoint from "./animations/trig-animations/MoveObjectToDestinationPoint";
import DistanceBetweenTwoPoints from "./animations/trig-animations/DistanceBetweenTwoPoints_anim";
import TriangleDataFromLine from "./animations/trig-animations/TriangleDataFromLine";
import PointTowardsMovingPoint from "./animations/trig-animations/PointTowardsMovingPoint";
import MoveItemAroundCircle from "./animations/trig-animations/MoveItemAroundCircle";
import SineCurve from "./animations/trig-animations/SineCurve";
import DistributePointsAroundACircle from "./animations/trig-animations/DistributePointsAroundACircle_anim";
import DeMystifySineCosine from "./animations/trig-animations/DeMystifySineCosine";
import BallBounce from "./animations/trig-animations/BallBounce_anim";
import BallsBouncingAgainstEachOther from "./animations/trig-animations/BallsBouncingAgainstEachOther_anim";
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
import Star from "./animations/trig-animations/Star_anim";
import Polygon from "./animations/trig-animations/Polygon_anim";
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
    Star,
    Polygon,
    BallBounce,
    BallsBouncingAgainstEachOther,
    DistributePointsAroundACircle,
    DistanceBetweenTwoPoints,
    GetEquilateralTriangleVertices,
    CircleFromThreePoints_Anim,
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
