import CircleFromThreePointsAnimation from "./core-animations/CircleFromThreePoints";
import GetHalfwayPointOfLine from "./core-animations/GetPointOnLine";
import GetEquilateralTriangleVertices from "./core-animations/EquilateralTriangle";
import MoveObjectToDestinationPoint from "./core-animations/MoveToDestination";
import DistanceBetweenTwoPoints from "./core-animations/LineLength";
import TriangleDataFromLine from "./core-animations/TriangleDataFromLine";
import PointTowardsMovingPoint from "./core-animations/PointTowards";
import MoveItemAroundCircle from "./core-animations/MoveItemAroundCircle";
import SineCurveAnimation from "./core-animations/SineCurve";
import DistributePointsAroundACircle from "./core-animations/DistributeAroundCircle";
import DeMystifySineCosine from "./core-animations/DeMystifySineCosine";
import BallBounce from "./core-animations/BallBounce";
import BallsBouncingAgainstEachOther from "./core-animations/BallBall";
import OrbitalMotionAnimation from "./core-animations/OrbitalMotion";
import LerpAnimation from "./core-animations/Lerp";
import EasingAnimation from "./core-animations/Easing";
import QuadraticBezierAnimation from "./core-animations/QuadraticBezier";
import PointToCircleCollision from "./pages/examples/animations/collisionDetection/PointToCircle";
import CircleToCircleCollision from "./pages/examples/animations/collisionDetection/CircleToCircle";
import RectToRect from "./pages/examples/animations/collisionDetection/RectToRect";
import PointToRectangle from "./pages/examples/animations/collisionDetection/PointToRect";
import CirceToRectCollision from "./pages/examples/animations/collisionDetection/CircleToRect";
import LineToCircleCollision from "./pages/examples/animations/collisionDetection/LineToCircle";
import LineToLineCollision from "./pages/examples/animations/collisionDetection/LineToLine";
import LineToPointCollision from "./pages/examples/animations/collisionDetection/LineToPoint";
import LineToRectangleCollision from "./pages/examples/animations/collisionDetection/LineToRect";
import PolygonToPolygonCollision from "./pages/examples/animations/collisionDetection/PolygonToPolygonCollision";
import Star from "./core-animations/Star";
import Polygon from "./core-animations/Polygon";
import GetRandomColorAnimation from "./pages/examples/animations/other-animations/GetRandomColorsAnimations";
import CenterOnParentAnimation from "./pages/examples/animations/simpleEquations/CenterOnParentAnimation";
import Deg2RadAnimation from "./pages/examples/animations/simpleEquations/DegToRadAnimation";
import NumberWithCommasAnimation from "./pages/examples/animations/simpleEquations/NumberWithCommasAnimation";
import Rad2DegAnimation from "./pages/examples/animations/simpleEquations/Rad2DegAnimation";
import RandomIntegerAnimation from "./pages/examples/animations/simpleEquations/RandomIntegerAnimation";
import RandomNumberAnimation from "./pages/examples/animations/simpleEquations/RandomNumberAnimation";
import { PrimaryObject } from "./types/types";

// New sections
import BezierCurves from "./pages/examples/animations/geometry/BezierCurves";
import FourierEpicycles from "./pages/examples/animations/fourier/FourierEpicycles";
import GameOfLife from "./pages/examples/animations/automata/GameOfLife";
import FlowField from "./pages/examples/animations/noise/FlowField";
import WaveInterference from "./pages/examples/animations/quantum/WaveInterference";
import GravitationalLensing from "./pages/examples/animations/relativity/GravitationalLensing";
import OrbitalPrecession from "./pages/examples/animations/relativity/OrbitalPrecession";
import Phyllotaxis from "./pages/examples/animations/botany/Phyllotaxis";

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
