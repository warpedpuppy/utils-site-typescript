import CircleFromThreePointsAnimation from "../core-animations/CircleFromThreePoints";
import GetHalfwayPointOfLine from "../core-animations/GetPointOnLine";
import GetEquilateralTriangleVertices from "../core-animations/EquilateralTriangle";
import MoveObjectToDestinationPoint from "../core-animations/MoveToDestination";
import DistanceBetweenTwoPoints from "../core-animations/LineLength";
import TriangleDataFromLine from "../core-animations/TriangleDataFromLine";
import PointTowardsMovingPoint from "../core-animations/PointTowards";
import MoveItemAroundCircle from "../core-animations/MoveItemAroundCircle";
import SineCurveAnimation from "../core-animations/SineCurve";
import DistributePointsAroundACircle from "../core-animations/DistributeAroundCircle";
import DeMystifySineCosine from "../core-animations/DeMystifySineCosine";
import BallBounce from "../core-animations/BallBounce";
import BallsBouncingAgainstEachOther from "../core-animations/BallBall";
import OrbitalMotionAnimation from "../core-animations/OrbitalMotion";
import LerpAnimation from "../core-animations/Lerp";
import EasingAnimation from "../core-animations/Easing";
import QuadraticBezierAnimation from "../core-animations/QuadraticBezier";
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
import Star from "../core-animations/Star";
import Polygon from "../core-animations/Polygon";
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
import WaveInterference from "./animations/quantum/WaveInterference";
import GravitationalLensing from "./animations/relativity/GravitationalLensing";
import OrbitalPrecession from "./animations/relativity/OrbitalPrecession";
import Phyllotaxis from "./animations/botany/Phyllotaxis";

// Studio projects are loaded directly in Studio.tsx to avoid import issues

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
  quantum: {
    WaveInterference,
  },
  relativity: {
    GravitationalLensing,
    OrbitalPrecession,
  },
  botany: {
    Phyllotaxis,
  },
};

export default SiteData;
