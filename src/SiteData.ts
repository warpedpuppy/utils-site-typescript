import CircleFromThreePointsAnimation from "./core-animations/CircleFromThreePoints";
import GetHalfwayPointOfLine from "./core-animations/GetPointOnLine";
import GetEquilateralTriangleVertices from "./core-animations/EquilateralTriangle";
import MoveObjectToDestinationPoint from "./core-animations/MoveToDestination";
import DistanceBetweenTwoPoints from "./core-animations/LineLength";
import triangleDataFromLine from "./core-animations/TriangleDataFromLine";
import PointTowardsMovingPoint from "./core-animations/PointTowards";
import MoveItemAroundCircle from "./core-animations/MoveItemAroundCircle";
import SineCurveAnimation from "./core-animations/SineCurve";
import DistributePointsAroundACircle from "./core-animations/DistributeAroundCircle";
import DeMystifySineCosine from "./core-animations/DeMystifySineCosine";
import ballBounce from "./core-animations/BallBounce";
import BallsBouncingAgainstEachOther from "./core-animations/BallBall";
import OrbitalMotionAnimation from "./core-animations/OrbitalMotion";
import LerpAnimation from "./core-animations/Lerp";
import EasingAnimation from "./core-animations/Easing";
import QuadraticBezierAnimation from "./core-animations/QuadraticBezier";
import PointToCircleCollision from "./core-animations/PointToCircle";
import CircleToCircleCollision from "./core-animations/CircleToCircle";
import RectToRect from "./core-animations/RectToRect";
import PointToRectangle from "./core-animations/PointToRect";
import CirceToRectCollision from "./core-animations/CircleToRect";
import LineToCircleCollision from "./core-animations/LineToCircle";
import LineToLineCollision from "./core-animations/LineToLine";
import LineToPointCollision from "./core-animations/LineToPoint";
import LineToRectangleCollision from "./core-animations/LineToRect";
import PolygonToPolygonCollision from "./core-animations/PolygonToPolygonCollision";
import Star from "./core-animations/Star";
import Polygon from "./core-animations/Polygon";
import GetRandomColorAnimation from "./core-animations/GetRandomColorsAnimations";
import CenterOnParentAnimation from "./core-animations/CenterOnParentAnimation";
import Deg2RadAnimation from "./core-animations/DegToRadAnimation";
import NumberWithCommasAnimation from "./core-animations/NumberWithCommasAnimation";
import Rad2DegAnimation from "./core-animations/Rad2DegAnimation";
import RandomIntegerAnimation from "./core-animations/RandomIntegerAnimation";
import RandomNumberAnimation from "./core-animations/RandomNumberAnimation";
import { PrimaryObject } from "./types/types";

// New sections
import BezierCurves from "./core-animations/BezierCurves";
import FourierEpicycles from "./core-animations/FourierEpicycles";
import GameOfLife from "./core-animations/GameOfLife";
import FlowField from "./core-animations/FlowField";
import WaveInterference from "./core-animations/WaveInterference";
import GravitationalLensing from "./core-animations/GravitationalLensing";
import OrbitalPrecession from "./core-animations/OrbitalPrecession";
import Phyllotaxis from "./core-animations/Phyllotaxis";

// Vector demos (new Vec2 / angle-helper functions)
import VectorReflectAnimation from "./core-animations/VectorReflect";
import VectorRotateAnimation from "./core-animations/VectorRotate";
import AngleLerpAnimation from "./core-animations/AngleLerp";

// Ported "pretty little things" from the warpedpuppies portfolio.
// SCAFFOLDS — drawX() is blank; the original source is commented at the bottom
// of each file as the reference to port from. Ted converts each to Canvas 2D.
import Murmuration from "./core-animations/Murmuration";
import Sierpinski from "./core-animations/Sierpinski";
import Glitter from "./core-animations/Glitter";
import PrettyRing from "./core-animations/PrettyRing";
import Sparklies from "./core-animations/Sparklies";
import Klimt from "./core-animations/Klimt";

// Studio projects are loaded directly in Studio.tsx to avoid import issues

const SiteData: PrimaryObject = {
  animations: {
    ballBounce,
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
    triangleDataFromLine,
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
  vectors: {
    VectorReflectAnimation,
    VectorRotateAnimation,
    AngleLerpAnimation,
  },
  flocking: {
    Murmuration,
  },
  fractals: {
    Sierpinski,
  },
  "pretty things": {
    Glitter,
    PrettyRing,
    Sparklies,
    Klimt,
  },
};

export default SiteData;
