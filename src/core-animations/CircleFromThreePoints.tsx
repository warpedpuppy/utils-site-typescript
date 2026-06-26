import { GenericObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { circleFromThreePoints as CircleFromThreePointsFunc } from "@utilspalooza/core/CircleFromThreePoints";
import { circleFromThreePoints as circleFromThreePointsFormula } from "../pages/createJSON/formulas/animation/CircleFromThreePoints";

function drawCircleFromThreePoints(
  ctx: any,
  points: any[],
  text: string[],
  circleQ: number,
  textDiv: any
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let textString = "";
  text.forEach((txt: string, i: number) => {
    textString += `${txt}`;
  });
  if (textDiv) {
    textDiv.innerHTML = textString;
  }

  points.forEach((item: GenericObject) => {
    ctx.beginPath();
    ctx.arc(item.x, item.y, 5, 0, 2 * Math.PI);
    ctx.stroke();
  });

  if (points.length === 3) {
    let { center, radius } = CircleFromThreePointsFunc(
      points[0],
      points[1],
      points[2]
    );
    ctx.lineWidth = 3;
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, circleQ);
    ctx.stroke();
  }
}

export { drawCircleFromThreePoints };

export default class CircleFromThreePointsAnimation extends AnimationBaseClass {
  static t = "get circle from three points";
  static l = "circle-from-three-points";
  static f = circleFromThreePointsFormula;
  title = "get circle from three points";
  animationObject = circleFromThreePointsFormula;
  text: string[] = [];
  interval: any = 0;
  circleQ = 0;
  points: any = [
    { x: 423, y: 400 },
    { x: 576, y: 349 },
    { x: 519, y: 273 },
  ];
  allowDraw: boolean = false;

  init() {
    this.text.push("<h3>click screen three times to make three points.</h3>");
    this.draw();
  }

  draw = () => {
    if (!this.canvas || !this.ctx || !this.textDiv) return;
    drawCircleFromThreePoints(
      this.ctx,
      this.points,
      this.text,
      this.circleQ,
      this.textDiv
    );

    if (this.points.length === 3) {
      let { center, radius } = CircleFromThreePointsFunc(
        this.points[0],
        this.points[1],
        this.points[2]
      );
      this.text[3] = `<p>radius: ${Math.floor(
        radius
      )}, center: { x: ${Math.floor(center.x)}, y: ${Math.floor(
        center.y
      )} }</p>`;
    }
  };

  drawCircle = () => {
    let degree = 5 * (Math.PI / 180);
    this.circleQ = Math.min(this.circleQ + degree, Math.PI * 2);
    this.draw();
    if (this.circleQ < Math.PI * 2) {
      this.interval = setTimeout(this.drawCircle, 10);
    }
  };

  pointerDownHandler(e: PointerEvent) {
    if (!this.canvas) return;
    let { top, left } = this.canvas.getBoundingClientRect();
    if (this.points.length === 3) {
      this.points = [];
      this.circleQ = 0;
      this.text.slice(2);
    }
    this.points.push({
      x: Math.floor(e.pageX - left),
      y: Math.floor(e.pageY - top),
    });
    this.text[2] = this.formatText();
    this.draw();

    if (this.points.length === 3) {
      this.interval = setTimeout(this.drawCircle, 10);
    }
  }

  formatText() {
    let str = this.points
      .map((item: GenericObject, index: number) => {
        let i = index + 1;
        return `point ${i}: { x:${item.x}, y:${item.y} }`;
      })
      .join(", ");
    return `<p>${str}</p>`;
  }

  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
