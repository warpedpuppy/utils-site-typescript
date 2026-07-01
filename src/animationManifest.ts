import { CollisionDetectionObject } from "./types/types";

import { ballBounce as ballBounceFormula } from "./pages/createJSON/formulas/animation/BallBounce";
import { ballToBallBounce as ballToBallBounceFormula } from "./pages/createJSON/formulas/animation/BallToBallBounce";
import { BoidsObject } from "./pages/createJSON/formulas/animation/Boids";
import { circleFromThreePoints as circleFromThreePointsFormula } from "./pages/createJSON/formulas/animation/CircleFromThreePoints";
import { DistributeAroundCircle as distributeFormula } from "./pages/createJSON/formulas/animation/DistributeAroundCircle";
import { Easing as easingFormula } from "./pages/createJSON/formulas/animation/Easing";
import { equilateralTriangle as equilateralTriangleFormula } from "./pages/createJSON/formulas/animation/EquilateralTriangle";
import { findPointAroundCircle as findPointAroundCircleFormula } from "./pages/createJSON/formulas/animation/FindPointAroundCircle";
import { GetPointOnLine as getPointOnLineFormula } from "./pages/createJSON/formulas/animation/GetPointOnLine";
import { getRotation as getRotationFormula } from "./pages/createJSON/formulas/animation/GetRotation";
import { lerp as lerpFormula } from "./pages/createJSON/formulas/animation/Lerp";
import { lineLength as lineLengthFormula } from "./pages/createJSON/formulas/animation/LineLength";
import { moveAlongLine as moveAlongLineFormula } from "./pages/createJSON/formulas/animation/MoveAlongLine";
import { pingPong as pingPongFormula } from "./pages/createJSON/formulas/animation/PingPong";
import { inverseLerp as inverseLerpFormula } from "./pages/createJSON/formulas/animation/InverseLerp";
import { mapRange as mapRangeFormula } from "./pages/createJSON/formulas/animation/MapRange";
import { clamp as clampFormula } from "./pages/createJSON/formulas/animation/Clamp";
import { wrap as wrapFormula } from "./pages/createJSON/formulas/animation/Wrap";
import { smoothstep as smoothstepFormula } from "./pages/createJSON/formulas/animation/Smoothstep";
import { SphereLighting } from "./pages/createJSON/formulas/animation/OrbitalMotion";
import { quadraticBezier as quadraticBezierFormula } from "./pages/createJSON/formulas/animation/QuadraticBezier";
import { RectangleObject as rectangleFormula } from "./pages/createJSON/formulas/animation/Rectangle";
import { sineCurve as sineCurveFormula } from "./pages/createJSON/formulas/animation/SineCurve";
import { StarObject as starFormula } from "./pages/createJSON/formulas/animation/Star";
import { triangleDataFromLine as triangleDataFromLineFormula } from "./pages/createJSON/formulas/animation/TriangleDataFromLine";
import { unitCirclePoint as unitCirclePointFormula } from "./pages/createJSON/formulas/animation/UnitCirclePoint";
import { circleCircle } from "./pages/createJSON/formulas/collision-detection/CircleCollision";
import {
  lineCircle,
  lineLine,
  linePoint,
  LinePolygon,
} from "./pages/createJSON/formulas/collision-detection/LineCollision";
import { pointCircle } from "./pages/createJSON/formulas/collision-detection/PointCollision";
import {
  polygonCircle,
  polygonPoint,
  polygonPolygon,
} from "./pages/createJSON/formulas/collision-detection/PolygonCollision";
import { centerOnParent } from "./pages/createJSON/formulas/simpleEquations/CenterOnParent";
import { degToRad } from "./pages/createJSON/formulas/simpleEquations/DegToRad";
import { numberWithCommas } from "./pages/createJSON/formulas/simpleEquations/NumberWIthCommas";
import { radToDeg } from "./pages/createJSON/formulas/simpleEquations/RadToDeg";
import { randomIntegerBetween } from "./pages/createJSON/formulas/simpleEquations/RandomIntegerBetween";
import { randomNumberBetween } from "./pages/createJSON/formulas/simpleEquations/RandomNumberBetween";
import { colorFamilyFormula } from "./pages/createJSON/formulas/usefulLittleThings/ColorFamily";
import { lerpColor as lerpColorFormula } from "./pages/createJSON/formulas/usefulLittleThings/LerpColor";
import {
  AngleLerpFormula,
  BezierFormula,
  FlowFieldFormula,
  FourierFormula,
  GameOfLifeFormula,
  GlitterFormula,
  KlimtFormula,
  LensingFormula,
  PhyllotaxisFormula,
  PrecessionFormula,
  PrettyRingFormula,
  SierpinskiFormula,
  SparkliesFormula,
  SpringFormula,
  VectorReflectFormula,
  VectorRotateFormula,
  WaveFormula,
} from "./animationExtraFormulas";

export interface AnimationManifestEntry {
  t: string;
  l: string;
  include?: boolean;
  f: CollisionDetectionObject;
  load: () => Promise<{ default: new (canvasCont: string) => any }>;
}

export interface AnimationManifest {
  [category: string]: Record<string, AnimationManifestEntry>;
}

const animationManifest: AnimationManifest = {
  "motion & easing": {
    ballBounce: {
      t: "ball bounce",
      l: "ball-bounce",
      f: ballBounceFormula,
      load: () => import("./core-animations/BallBounce"),
    },
    OrbitalMotionAnimation: {
      t: "ball orbiting a sun",
      l: "ball-orbiting-a-sun",
      f: SphereLighting,
      load: () => import("./core-animations/OrbitalMotion"),
    },
    LerpAnimation: {
      t: "lerp (smooth follow)",
      l: "lerp-smooth-follow",
      f: lerpFormula,
      load: () => import("./core-animations/Lerp"),
    },
    EasingAnimation: {
      t: "easing functions",
      l: "easing-functions",
      f: easingFormula,
      load: () => import("./core-animations/Easing"),
    },
    SpringAnimation: {
      t: "spring (damped harmonic motion)",
      l: "spring-damped-harmonic",
      f: SpringFormula,
      load: () => import("./core-animations/Spring"),
    },
    MoveObjectToDestinationPoint: {
      t: "move object to changing point",
      l: "move-to-changing-point",
      f: moveAlongLineFormula,
      load: () => import("./core-animations/MoveToDestination"),
    },
    QuadraticBezierAnimation: {
      t: "quadratic bezier curve",
      l: "quadratic-bezier-curve",
      f: quadraticBezierFormula,
      load: () => import("./core-animations/QuadraticBezier"),
    },
    BezierCurves: {
      t: "Bézier curves",
      l: "bezier-curves",
      f: BezierFormula,
      load: () => import("./core-animations/BezierCurves"),
    },
  },
  "trig, angles & vectors": {
    SineCurveAnimation: {
      t: "sine curve",
      l: "sine-curve",
      f: sineCurveFormula,
      load: () => import("./core-animations/SineCurve"),
    },
    DeMystifySineCosine: {
      t: "demystify sine and cosine",
      l: "demystify-sine-and-cosine",
      f: unitCirclePointFormula,
      load: () => import("./core-animations/DeMystifySineCosine"),
    },
    MoveItemAroundCircle: {
      t: "find points on a circle",
      l: "find-points-on-a-circle",
      f: findPointAroundCircleFormula,
      load: () => import("./core-animations/MoveItemAroundCircle"),
    },
    PointTowardsMovingPoint: {
      t: "point object towards another",
      l: "point-object-towards-another",
      f: getRotationFormula,
      load: () => import("./core-animations/PointTowards"),
    },
    DistributePointsAroundACircle: {
      t: "distribute around circle",
      l: "distribute-around-circle",
      f: distributeFormula,
      load: () => import("./core-animations/DistributeAroundCircle"),
    },
    VectorReflectAnimation: {
      t: "vector reflection (bounce)",
      l: "vector-reflection",
      f: VectorReflectFormula,
      load: () => import("./core-animations/VectorReflect"),
    },
    VectorRotateAnimation: {
      t: "vector rotation",
      l: "vector-rotation",
      f: VectorRotateFormula,
      load: () => import("./core-animations/VectorRotate"),
    },
    AngleLerpAnimation: {
      t: "angle interpolation (shortest turn)",
      l: "angle-lerp-shortest-turn",
      f: AngleLerpFormula,
      load: () => import("./core-animations/AngleLerp"),
    },
  },
  "collision detection": {
    PointToCircleCollision: {
      t: "point to circle collision",
      l: "point-to-circle-collision",
      f: pointCircle,
      load: () => import("./core-animations/PointToCircle"),
    },
    PointToRectangle: {
      t: "point to polygon collision",
      l: "point-to-rectangle-collision",
      f: polygonPoint,
      load: () => import("./core-animations/PointToRect"),
    },
    RectToRect: {
      t: "rectangle to rectangle collision",
      l: "rectangle-to-rectangle-collision",
      f: polygonPolygon,
      load: () => import("./core-animations/RectToRect"),
    },
    CirceToRectCollision: {
      t: "circle to rectangle collision",
      l: "circle-to-rectangle-collision",
      f: polygonCircle,
      load: () => import("./core-animations/CircleToRect"),
    },
    CircleToCircleCollision: {
      t: "circle to circle collision",
      l: "circle-to-circle-collision",
      f: circleCircle,
      load: () => import("./core-animations/CircleToCircle"),
    },
    LineToCircleCollision: {
      t: "line to circle collision",
      l: "line-to-circle-collision",
      f: lineCircle,
      load: () => import("./core-animations/LineToCircle"),
    },
    LineToLineCollision: {
      t: "line to line collision",
      l: "line-to-line-collision",
      f: lineLine,
      load: () => import("./core-animations/LineToLine"),
    },
    LineToPointCollision: {
      t: "line to point collision",
      l: "line-to-point-collision",
      f: linePoint,
      load: () => import("./core-animations/LineToPoint"),
    },
    LineToRectangleCollision: {
      t: "line to rectangle collision",
      l: "line-to-rectangle-collision",
      f: LinePolygon,
      load: () => import("./core-animations/LineToRect"),
    },
    PolygonToPolygonCollision: {
      t: "polygon to polygon collision",
      l: "polygon-to-polygon-collision",
      f: polygonPolygon,
      load: () => import("./core-animations/PolygonToPolygonCollision"),
    },
    CircleFieldCollision: {
      t: "circle field (collision at scale)",
      l: "circle-field",
      f: circleCircle,
      load: () => import("./core-animations/CircleField"),
    },
    // Hidden duplicate of the circle-field bounce (weaker two-ball version).
    // Kept off the sidebar via include:false; CircleField above is the one to show.
    BallsBouncingAgainstEachOther: {
      t: "balls bouncing against each other",
      l: "balls-bouncing-against-each-other",
      include: false,
      f: ballToBallBounceFormula,
      load: () => import("./core-animations/BallBall"),
    },
  },
  "numbers in motion": {
    // Scalar primitives. These are docs-first: each shows the shared scalar
    // mini-demo (same drawing as the /api docs) and intentionally has NO CodePen
    // pen — see CLAUDE.md, "Docs are friendly, visual, and ELI5", and the
    // MINI_DEMO_KEYS carve-out in studio-pens-sync.test.ts.
    LerpScalarAnimation: {
      t: "lerp",
      l: "lerp",
      f: lerpFormula,
      load: () => import("./core-animations/ScalarLerp"),
    },
    InverseLerpAnimation: {
      t: "inverse lerp",
      l: "inverse-lerp",
      f: inverseLerpFormula,
      load: () => import("./core-animations/InverseLerp"),
    },
    MapRangeAnimation: {
      t: "map range",
      l: "map-range",
      f: mapRangeFormula,
      load: () => import("./core-animations/MapRange"),
    },
    ClampAnimation: {
      t: "clamp",
      l: "clamp",
      f: clampFormula,
      load: () => import("./core-animations/Clamp"),
    },
    WrapAnimation: {
      t: "wrap",
      l: "wrap",
      f: wrapFormula,
      load: () => import("./core-animations/Wrap"),
    },
    PingPongAnimation: {
      t: "ping pong",
      l: "ping-pong",
      f: pingPongFormula,
      load: () => import("./core-animations/PingPong"),
    },
    SmoothstepAnimation: {
      t: "smoothstep",
      l: "smoothstep",
      f: smoothstepFormula,
      load: () => import("./core-animations/Smoothstep"),
    },
  },
  "geometry & shapes": {
    GetHalfwayPointOfLine: {
      t: "get a point on a line",
      l: "get-a-point-on-a-line",
      f: getPointOnLineFormula,
      load: () => import("./core-animations/GetPointOnLine"),
    },
    DistanceBetweenTwoPoints: {
      t: "get line length",
      l: "line-length",
      f: lineLengthFormula,
      load: () => import("./core-animations/LineLength"),
    },
    triangleDataFromLine: {
      t: "get triangle data from line",
      l: "get-triangle-data-from-line",
      f: triangleDataFromLineFormula,
      load: () => import("./core-animations/TriangleDataFromLine"),
    },
    Star: {
      t: "draw star",
      l: "draw-star",
      f: starFormula,
      load: () => import("./core-animations/Star"),
    },
    Polygon: {
      t: "draw rectangle (using trig, not rect())",
      l: "draw-rectangle",
      f: rectangleFormula,
      load: () => import("./core-animations/Polygon"),
    },
    GetEquilateralTriangleVertices: {
      t: "draw equilateral triangle (from radius and center point)",
      l: "equilateral-trianlge-points",
      f: equilateralTriangleFormula,
      load: () => import("./core-animations/EquilateralTriangle"),
    },
    CircleFromThreePointsAnimation: {
      t: "get circle from three points",
      l: "circle-from-three-points",
      f: circleFromThreePointsFormula,
      load: () => import("./core-animations/CircleFromThreePoints"),
    },
    CenterOnParentAnimation: {
      t: "center on parent",
      l: "center-on-parent",
      f: centerOnParent,
      load: () => import("./core-animations/CenterOnParentAnimation"),
    },
  },
  "generative showpieces": {
    FourierEpicycles: {
      t: "Fourier epicycles",
      l: "fourier-epicycles",
      f: FourierFormula,
      load: () => import("./core-animations/FourierEpicycles"),
    },
    GameOfLife: {
      t: "Conway's Game of Life",
      l: "game-of-life",
      f: GameOfLifeFormula,
      load: () => import("./core-animations/GameOfLife"),
    },
    FlowField: {
      t: "Perlin noise flow field",
      l: "flow-field",
      f: FlowFieldFormula,
      load: () => import("./core-animations/FlowField"),
    },
    WaveInterference: {
      t: "Wave interference",
      l: "wave-interference",
      f: WaveFormula,
      load: () => import("./core-animations/WaveInterference"),
    },
    GravitationalLensing: {
      t: "Gravitational lensing",
      l: "gravitational-lensing",
      f: LensingFormula,
      load: () => import("./core-animations/GravitationalLensing"),
    },
    OrbitalPrecession: {
      t: "Orbital precession (GR)",
      l: "orbital-precession",
      f: PrecessionFormula,
      load: () => import("./core-animations/OrbitalPrecession"),
    },
    Phyllotaxis: {
      t: "Phyllotaxis (golden angle)",
      l: "phyllotaxis",
      f: PhyllotaxisFormula,
      load: () => import("./core-animations/Phyllotaxis"),
    },
    Murmuration: {
      t: "Murmuration (flocking starlings)",
      l: "murmuration",
      f: BoidsObject,
      load: () => import("./core-animations/Murmuration"),
    },
    Sierpinski: {
      t: "Sierpinski Triangle",
      l: "sierpinski",
      f: SierpinskiFormula,
      load: () => import("./core-animations/Sierpinski"),
    },
    Glitter: {
      t: "Glitter",
      l: "glitter",
      f: GlitterFormula,
      load: () => import("./core-animations/Glitter"),
    },
    PrettyRing: {
      t: "Pretty Ring",
      l: "pretty-ring",
      f: PrettyRingFormula,
      load: () => import("./core-animations/PrettyRing"),
    },
    Sparklies: {
      t: "Sparklies",
      l: "sparklies",
      f: SparkliesFormula,
      load: () => import("./core-animations/Sparklies"),
    },
    Klimt: {
      t: "Klimt-Inspired Swirls",
      l: "klimt",
      f: KlimtFormula,
      load: () => import("./core-animations/Klimt"),
    },
  },
  "handy helpers": {
    Deg2RadAnimation: {
      t: "degrees to radians",
      l: "degrees-to-radians",
      f: degToRad,
      load: () => import("./core-animations/DegToRadAnimation"),
    },
    Rad2DegAnimation: {
      t: "radians to degrees",
      l: "radians-to-degrees",
      f: radToDeg,
      load: () => import("./core-animations/Rad2DegAnimation"),
    },
    NumberWithCommasAnimation: {
      t: "format number with commas",
      l: "format-number-with-commas",
      f: numberWithCommas,
      load: () => import("./core-animations/NumberWithCommasAnimation"),
    },
    RandomIntegerAnimation: {
      t: "random integer between",
      l: "random-integer-between",
      f: randomIntegerBetween,
      load: () => import("./core-animations/RandomIntegerAnimation"),
    },
    RandomNumberAnimation: {
      t: "random number between",
      l: "random-number-between",
      f: randomNumberBetween,
      load: () => import("./core-animations/RandomNumberAnimation"),
    },
    ColorLerpAnimation: {
      t: "color lerp (RGB vs HSL)",
      l: "color-lerp",
      f: lerpColorFormula,
      load: () => import("./core-animations/ColorLerp"),
    },
    ColorFamiliesAnimation: {
      t: "color families (pick a range by name)",
      l: "color-families",
      f: colorFamilyFormula,
      load: () => import("./core-animations/ColorFamilies"),
    },
  },
};

export default animationManifest;
