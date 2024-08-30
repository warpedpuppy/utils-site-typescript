import { GenericObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { CircleFromThreePoints } from "../../formulas/animation/CircleFromThreePoints";
class CircleFromThreePointsAnimation extends AnimationBaseClass {
  static t = "get circle from three points";
  static l = "circle-from-three-points";
  static f = CircleFromThreePoints.functionString;
  title = "get circle from three points";
  animationObject = CircleFromThreePoints;
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
  draw() {
    if (!this.canvas || !this.ctx || !this.textDiv) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let textString = "";
    this.text.forEach((text: string, i: number) => {
      textString += `${text}`;
    });
    this.textDiv.innerHTML = textString;

    this.points.forEach((item: GenericObject) => {
      if (!this.ctx) return;
      this.ctx.beginPath();
      this.ctx.arc(item.x, item.y, 5, 0, 2 * Math.PI);
      this.ctx.stroke();
    });

    if (this.points.length === 3) {
      let { center, radius } = CircleFromThreePoints.keyFunction(
        this.points[0],
        this.points[1],
        this.points[2]
      );
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = "green";
      this.ctx.beginPath();
      this.ctx.arc(center.x, center.y, radius, 0, this.circleQ);
      this.ctx.stroke();
      this.text[3] = `<p>radius: ${Math.floor(
        radius
      )}, center: { x: ${Math.floor(center.x)}, y: ${Math.floor(
        center.y
      )} }</p>`;

      this.interval = setTimeout(this.drawCircle.bind(this), 10);
    }
  }
  drawCircle() {
    let degree = 1 * (Math.PI / 180);
    this.circleQ += degree;
    if (this.circleQ < Math.PI * 2) {
      this.interval = setTimeout(this.drawCircle.bind(this), 10);
      this.draw();
    }
  }
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
}
export default CircleFromThreePointsAnimation;
