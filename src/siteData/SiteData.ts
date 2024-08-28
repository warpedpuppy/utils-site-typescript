import CircleFromThreePoints_Anim from "./animations/trig-animations/CircleFromThreePointsAnimation";
import GetHalfwayPointOfLine from "./animations/trig-animations/GetPointOnLineAnimation";
import GetEquilateralTriangleVertices from "./animations/trig-animations/EquilateralTriangleAnimation";
import MoveObjectToDestinationPoint from "./animations/trig-animations/MoveObjectToDestinationPoint";
import DistanceBetweenTwoPoints from "./animations/trig-animations/LIneLengthAnimation";
import TriangleDataFromLine from "./animations/trig-animations/TriangleDataFromLineAnimation";
import PointTowardsMovingPoint from "./animations/trig-animations/PointTowardsMovingPoint";
import MoveItemAroundCircle from "./animations/trig-animations/MoveItemAroundCircle";
import SineCurveAnimation from "./animations/trig-animations/SineCurveAnimation";
import DistributePointsAroundACircle from "./animations/trig-animations/DistributePointsAroundACircleAnimation";
import DeMystifySineCosine from "./animations/trig-animations/DeMystifySineCosine";
import BallBounce from "./animations/trig-animations/BallBounceAnimation";
import BallsBouncingAgainstEachOther from "./animations/trig-animations/BallBallAnimation";
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
import Star from "./animations/trig-animations/StarAnimation";
import Polygon from "./animations/trig-animations/PolygonAnimation";
const SiteData = {
  "collision detection": {
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
  "useful little things": {
    GetHalfwayPointOfLine,
    TriangleDataFromLine,
    Star,
    Polygon,
    GetEquilateralTriangleVertices,
    CircleFromThreePoints_Anim,
    DistributePointsAroundACircle,
    DistanceBetweenTwoPoints,
  },

  animations: {
    BallBounce,
    BallsBouncingAgainstEachOther,
    MoveItemAroundCircle,
    MoveObjectToDestinationPoint,
    PointTowardsMovingPoint,
    SineCurveAnimation,
    DeMystifySineCosine,
  },
};

export default SiteData;
