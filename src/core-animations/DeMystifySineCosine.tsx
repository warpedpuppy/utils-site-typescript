import { Point } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { findPointAroundCircle } from "@utilspalooza/core/FindPointAroundCircle";
import { findPointAroundCircle as findPointAroundCircleFormula } from "../pages/createJSON/formulas/animation/FindPointAroundCircle";
import { sineCurve } from "@utilspalooza/core/SineCurve";

function distanceBetweenPoints(startPoint: Point, endPoint: Point): number {
  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;
  return Math.sqrt(a * a + b * b);
}

function drawDeMystifySineCosine(
  ctx: any,
  canvasWidth: any,
  canvasHeight: any,
  textDiv: HTMLElement | null
): void {
  const halfHeight = canvasHeight / 2;
  const halfWidth = canvasWidth / 2;

  ctx.font = "bold 18px Arial";
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, halfHeight);
  ctx.lineTo(canvasWidth, halfHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvasWidth * 0.33, 0);
  ctx.lineTo(canvasWidth * 0.33, canvasHeight);
  ctx.stroke();

  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(canvasWidth * 0.33, halfHeight);
  ctx.lineTo(canvasWidth * 0.33, halfHeight - 100);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvasWidth * 0.66, 0);
  ctx.lineTo(canvasWidth * 0.66, canvasHeight);
  ctx.stroke();

  ctx.strokeStyle = "green";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(canvasWidth * 0.66, halfHeight);
  ctx.lineTo(canvasWidth * 0.66, halfHeight - 100);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(canvasWidth * 0.33, halfHeight, 100, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvasWidth * 0.66, halfHeight, 100, 0, 2 * Math.PI);
  ctx.stroke();

  let perc1 = sineCurve(62.5, 12.5, 0.001, performance.now());
  let point1 = findPointAroundCircle(
    {
      x: canvasWidth * 0.33,
      y: halfHeight,
    },
    100,
    perc1
  );

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvasWidth * 0.33, halfHeight);
  ctx.lineTo(point1.x, point1.y);
  ctx.stroke();

  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point1.x, halfHeight);
  ctx.stroke();

  let perc2 = sineCurve(-12.5, 12.5, 0.001, performance.now());
  let point2 = findPointAroundCircle(
    {
      x: canvasWidth * 0.66,
      y: halfHeight,
    },
    100,
    perc2
  );

  let smallRedLineHeight = Math.floor(
    distanceBetweenPoints(point1, {
      x: point1.x,
      y: halfHeight,
    })
  );

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvasWidth * 0.66, halfHeight);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(point2.x, point2.y);
  ctx.lineTo(point2.x, halfHeight);
  ctx.stroke();

  ctx.strokeStyle = "green";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(canvasWidth * 0.66, halfHeight);
  ctx.lineTo(point2.x, halfHeight);
  ctx.stroke();

  let smallGreenLineHeight = Math.floor(
    distanceBetweenPoints(point2, {
      x: point2.x,
      y: halfHeight,
    })
  );

  if (textDiv)
    textDiv.innerHTML = `
     <p>The sine of angle 'A' is the relationship between the two red lines: ${smallRedLineHeight} / 100.</p><p>We can use sine to calculate the y value of the triangle's hypotenuse because it represents vertical proportion.</p>
     <br />
      <p>The cosine of angle 'B' is the relationship between the two green lines: ${smallGreenLineHeight} / 100.</p><p>We can use cosine to calculate the x value of the triangle/s hypotenuse because it represents horizontal proportion.</p>
    `;
}

export { drawDeMystifySineCosine };

export default class DeMystifySineCosine extends AnimationBaseClass {
  static t: string = "demystify sine and cosine";
  static l: string = "demystify-sine-and-cosine";
  static f = findPointAroundCircleFormula;
  static include: boolean = false;
  title = "demystify sine and cosine";
  animationObject = findPointAroundCircleFormula;
  i: number = 0;
  startValue = 0;
  differential = 200;
  speed = 0.005;
  thinLine = 2;
  fatLine = 5;

  init() {
    this.draw();
  }

  draw = () => {
    if (!this.canvas || !this.ctx) return;
    drawDeMystifySineCosine(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.textDiv
    );
    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}
