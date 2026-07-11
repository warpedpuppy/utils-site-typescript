// Manifest for build-time CodePen source generation (Work Package 2B of the
// 2026-07-11 code review remediation).
//
// One entry per function whose source is embedded in a Studio CodePen payload
// (src/pages/studio/pens-examples.ts and pens.ts). These used to be serialized
// at runtime with Function.prototype.toString(), which production minification
// breaks: terser renames the declaration while the handwritten pen glue keeps
// calling the original name, so every shipped payload threw ReferenceError.
//
// - `exportName`  — the original exported identifier, exactly as the
//                   handwritten CodePen glue calls it.
// - `sourceFile`  — repository-relative path to the canonical TypeScript
//                   source that declares it.
//
// scripts/generate-codepen-sources.mjs reads this manifest, extracts each
// declaration with the TypeScript compiler API (no regexes), strips the
// `export` modifier, transpiles to plain JavaScript, and writes
// src/pages/studio/generatedCodepenSources.ts.

export const CODEPEN_SOURCE_MANIFEST = [
  // ── @utilspalooza/core math ────────────────────────────────────────────────
  { exportName: "ballBounce", sourceFile: "packages/core/src/BallBounce.ts" },
  { exportName: "circleFromThreePoints", sourceFile: "packages/core/src/CircleFromThreePoints.ts" },
  { exportName: "circleToCircle", sourceFile: "packages/core/src/CircleToCircle.ts" },
  { exportName: "criticalDamping", sourceFile: "packages/core/src/Animate.ts" },
  { exportName: "deCasteljau", sourceFile: "packages/core/src/DeCasteljau.ts" },
  { exportName: "dft", sourceFile: "packages/core/src/DFT.ts" },
  { exportName: "equilateralTriangle", sourceFile: "packages/core/src/EquilateralTriangle.ts" },
  { exportName: "findPointAroundCircle", sourceFile: "packages/core/src/FindPointAroundCircle.ts" },
  { exportName: "gameOfLifeStep", sourceFile: "packages/core/src/GameOfLife.ts" },
  { exportName: "getRotation", sourceFile: "packages/core/src/GetRotation.ts" },
  { exportName: "hslToRgb", sourceFile: "packages/core/src/Color.ts" },
  { exportName: "lerp", sourceFile: "packages/core/src/Lerp.ts" },
  { exportName: "lerpAngle", sourceFile: "packages/core/src/AngleInterpolation.ts" },
  { exportName: "lineLength", sourceFile: "packages/core/src/LineLength.ts" },
  { exportName: "lineLine", sourceFile: "packages/core/src/CollisionObjectAPI/LineLine.ts" },
  { exportName: "lineToCircle", sourceFile: "packages/core/src/LineToCircle.ts" },
  { exportName: "lineToLine", sourceFile: "packages/core/src/LineToLine.ts" },
  { exportName: "lineToPoint", sourceFile: "packages/core/src/LineToPoint.ts" },
  { exportName: "moveAlongLine", sourceFile: "packages/core/src/MoveAlongLine.ts" },
  { exportName: "pointCircle", sourceFile: "packages/core/src/CollisionObjectAPI/PointCircle.ts" },
  { exportName: "polygonPoint", sourceFile: "packages/core/src/CollisionObjectAPI/PolygonPoint.ts" },
  { exportName: "quadraticBezier", sourceFile: "packages/core/src/QuadraticBezier.ts" },
  { exportName: "radToDeg", sourceFile: "packages/core/src/RadToDeg.ts" },
  { exportName: "rgbToCss", sourceFile: "packages/core/src/Color.ts" },
  { exportName: "shortestAngleBetween", sourceFile: "packages/core/src/AngleInterpolation.ts" },
  { exportName: "sineCurve", sourceFile: "packages/core/src/SineCurve.ts" },
  { exportName: "sphereLighting", sourceFile: "packages/core/src/SphereLighting.ts" },
  { exportName: "springValue", sourceFile: "packages/core/src/Animate.ts" },
  { exportName: "starVertices", sourceFile: "packages/core/src/Star.ts" },
  { exportName: "unitCirclePoint", sourceFile: "packages/core/src/UnitCirclePoint.ts" },
  { exportName: "vecNormalize", sourceFile: "packages/core/src/Vec2.ts" },
  { exportName: "vecPerpendicular", sourceFile: "packages/core/src/Vec2.ts" },
  { exportName: "vecReflect", sourceFile: "packages/core/src/Vec2.ts" },
  { exportName: "vecRotate", sourceFile: "packages/core/src/Vec2.ts" },
  { exportName: "wrapAngle", sourceFile: "packages/core/src/AngleInterpolation.ts" },

  // ── src/core-animations standalone draw functions & helpers ───────────────
  { exportName: "createKlimtSwirls", sourceFile: "src/core-animations/Klimt.ts" },
  { exportName: "drawAngleLerp", sourceFile: "src/core-animations/AngleLerp.tsx" },
  { exportName: "drawBezierCurves", sourceFile: "src/core-animations/BezierCurves.ts" },
  { exportName: "drawBird", sourceFile: "src/core-animations/Murmuration.ts" },
  { exportName: "drawCenterOnParent", sourceFile: "src/core-animations/CenterOnParentAnimation.tsx" },
  { exportName: "drawCircleField", sourceFile: "src/core-animations/CircleField.tsx" },
  { exportName: "drawCircleFromThreePoints", sourceFile: "src/core-animations/CircleFromThreePoints.tsx" },
  { exportName: "drawCircleToCircle", sourceFile: "src/core-animations/CircleToCircle.tsx" },
  { exportName: "drawCircleToRectangle", sourceFile: "src/core-animations/CircleToRect.tsx" },
  { exportName: "drawColorFamily", sourceFile: "src/core-animations/ColorFamilies.tsx" },
  { exportName: "drawColorLerp", sourceFile: "src/core-animations/ColorLerp.tsx" },
  { exportName: "drawDeMystifySineCosine", sourceFile: "src/core-animations/DeMystifySineCosine.tsx" },
  { exportName: "drawDegreesToRadians", sourceFile: "src/core-animations/DegToRadAnimation.tsx" },
  { exportName: "drawDistributeAroundCircle", sourceFile: "src/core-animations/DistributeAroundCircle.tsx" },
  { exportName: "drawEasing", sourceFile: "src/core-animations/Easing.tsx" },
  { exportName: "drawEquilateralTriangle", sourceFile: "src/core-animations/EquilateralTriangle.tsx" },
  { exportName: "drawFlowField", sourceFile: "src/core-animations/FlowField.ts" },
  { exportName: "drawFormatNumberWithCommas", sourceFile: "src/core-animations/NumberWithCommasAnimation.tsx" },
  { exportName: "drawFourierEpicycles", sourceFile: "src/core-animations/FourierEpicycles.ts" },
  { exportName: "drawGameOfLife", sourceFile: "src/core-animations/GameOfLife.ts" },
  { exportName: "drawGetPointOnLine", sourceFile: "src/core-animations/GetPointOnLine.tsx" },
  { exportName: "drawGravitationalLensing", sourceFile: "src/core-animations/GravitationalLensing.ts" },
  { exportName: "drawKlimt", sourceFile: "src/core-animations/Klimt.ts" },
  { exportName: "drawLerp", sourceFile: "src/core-animations/Lerp.tsx" },
  { exportName: "drawLineLength", sourceFile: "src/core-animations/LineLength.tsx" },
  { exportName: "drawLineToCircle", sourceFile: "src/core-animations/LineToCircle.tsx" },
  { exportName: "drawLineToLine", sourceFile: "src/core-animations/LineToLine.tsx" },
  { exportName: "drawLineToPoint", sourceFile: "src/core-animations/LineToPoint.tsx" },
  { exportName: "drawLineToRectangle", sourceFile: "src/core-animations/LineToRect.tsx" },
  { exportName: "drawMoveItemAroundCircle", sourceFile: "src/core-animations/MoveItemAroundCircle.ts" },
  { exportName: "drawMoveToDestination", sourceFile: "src/core-animations/MoveToDestination.tsx" },
  { exportName: "drawOrbitalMotion", sourceFile: "src/core-animations/OrbitalMotion.ts" },
  { exportName: "drawOrbitalPrecession", sourceFile: "src/core-animations/OrbitalPrecession.ts" },
  { exportName: "drawPhyllotaxis", sourceFile: "src/core-animations/Phyllotaxis.ts" },
  { exportName: "drawPointToCircle", sourceFile: "src/core-animations/PointToCircle.tsx" },
  { exportName: "drawPointToRectangle", sourceFile: "src/core-animations/PointToRect.tsx" },
  { exportName: "drawPointTowards", sourceFile: "src/core-animations/PointTowards.ts" },
  { exportName: "drawPolygon", sourceFile: "src/core-animations/Polygon.tsx" },
  { exportName: "drawPolygonToPolygon", sourceFile: "src/core-animations/PolygonToPolygonCollision.tsx" },
  { exportName: "drawQuadraticBezier", sourceFile: "src/core-animations/QuadraticBezier.tsx" },
  { exportName: "drawRadiansToDegrees", sourceFile: "src/core-animations/Rad2DegAnimation.tsx" },
  { exportName: "drawRainbowBall", sourceFile: "src/core-animations/BallBounce.tsx" },
  { exportName: "drawRandomIntegerBetween", sourceFile: "src/core-animations/RandomIntegerAnimation.tsx" },
  { exportName: "drawRandomNumberBetween", sourceFile: "src/core-animations/RandomNumberAnimation.tsx" },
  { exportName: "drawRectToRect", sourceFile: "src/core-animations/RectToRect.tsx" },
  { exportName: "drawSierpinski", sourceFile: "src/core-animations/Sierpinski.ts" },
  { exportName: "drawSineCurve", sourceFile: "src/core-animations/SineCurve.tsx" },
  { exportName: "drawSpring", sourceFile: "src/core-animations/Spring.tsx" },
  { exportName: "drawStar", sourceFile: "src/core-animations/Star.ts" },
  { exportName: "drawTriangleDataFromLine", sourceFile: "src/core-animations/TriangleDataFromLine.tsx" },
  { exportName: "drawVectorReflect", sourceFile: "src/core-animations/VectorReflect.tsx" },
  { exportName: "drawVectorRotate", sourceFile: "src/core-animations/VectorRotate.tsx" },
  { exportName: "drawWaveInterference", sourceFile: "src/core-animations/WaveInterference.ts" },
  { exportName: "grAccel", sourceFile: "src/core-animations/OrbitalPrecession.ts" },
  { exportName: "heartPath", sourceFile: "src/core-animations/FourierEpicycles.ts" },
  { exportName: "newtonAccel", sourceFile: "src/core-animations/OrbitalPrecession.ts" },
  { exportName: "phyllotaxisPoint", sourceFile: "src/core-animations/Phyllotaxis.ts" },
  { exportName: "sierpinskiMidpoints", sourceFile: "src/core-animations/Sierpinski.ts" },
];
