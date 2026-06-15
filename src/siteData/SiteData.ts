import CircleFromThreePointsAnimation from "./animations/trig-animations/CircleFromThreePointsAnimation";
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
import OrbitalMotionAnimation from "./animations/trig-animations/OrbitalMotionAnimation";
import LerpAnimation from "./animations/trig-animations/LerpAnimation";
import EasingAnimation from "./animations/trig-animations/EasingAnimation";
import QuadraticBezierAnimation from "./animations/trig-animations/QuadraticBezierAnimation";
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
import GetRandomColorAnimation from "./animations/other-animations/GetRandomColorsAnimations";
import CenterOnParentAnimation from "./animations/simpleEquations/CenterOnParentAnimation";
import Deg2RadAnimation from "./animations/simpleEquations/DegToRadAnimation";
import NumberWithCommasAnimation from "./animations/simpleEquations/NumberWithCommasAnimation";
import Rad2DegAnimation from "./animations/simpleEquations/Rad2DegAnimation";
import RandomIntegerAnimation from "./animations/simpleEquations/RandomIntegerAnimation";
import RandomNumberAnimation from "./animations/simpleEquations/RandomNumberAnimation";
import { PrimaryObject } from "../types/types";

// New sections
import BezierCurves from "./animations/geometry/BezierCurves";
import FourierEpicycles from "./animations/fourier/FourierEpicycles";
import GameOfLife from "./animations/automata/GameOfLife";
import FlowField from "./animations/noise/FlowField";

const SiteData: PrimaryObject = {
  animations: {
    BallBounce,
    BallsBouncingAgainstEachOther,
    OrbitalMotionAnimation,
    LerpAnimation,
    EasingAnimation,
    QuadraticBezierAnimation,
    MoveItemAroundCircle,
    MoveObjectToDestinationPoint,
    PointTowardsMovingPoint,
    SineCurveAnimation,
    DeMystifySineCosine,
  },
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
    GetRandomColorAnimation,
    GetHalfwayPointOfLine,
    TriangleDataFromLine,
    Star,
    Polygon,
    GetEquilateralTriangleVertices,
    CircleFromThreePointsAnimation,
    DistributePointsAroundACircle,
    DistanceBetweenTwoPoints,
    BezierCurves,
  },
  "simple useful equations": {
    CenterOnParentAnimation,
    Deg2RadAnimation,
    NumberWithCommasAnimation,
    Rad2DegAnimation,
    RandomIntegerAnimation,
    RandomNumberAnimation,
  },
  fourier: {
    FourierEpicycles,
  },
  automata: {
    GameOfLife,
  },
  noise: {
    FlowField,
  },
};

export default SiteData;
