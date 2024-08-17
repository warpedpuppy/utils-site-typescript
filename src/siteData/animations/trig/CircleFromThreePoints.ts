import { GenericObject, Nullable, Point } from "../../../types/types";
import Template from "../animationTemplate";
class CircleFromThreePoints extends Template {
  static t = "get circle from three points";
  static l = "circle-from-three-points";
  title = "get circle from three points";
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
      let { center, radius } = this.keyFunction(
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
  keyFunction(point1: Point, point2: Point, point3: Point) {
    let x12 = point1.x - point2.x;
    let x13 = point1.x - point3.x;

    let y12 = point1.y - point2.y;
    let y13 = point1.y - point3.y;

    let x31 = point3.x - point1.x;
    let x21 = point2.x - point1.x;

    let y31 = point3.y - point1.y;
    let y21 = point2.y - point1.y;

    let sx13 = Math.pow(point1.x, 2) - Math.pow(point3.x, 2);
    let sy13 = Math.pow(point1.y, 2) - Math.pow(point3.y, 2);
    let sx21 = Math.pow(point2.x, 2) - Math.pow(point1.x, 2);
    let sy21 = Math.pow(point2.y, 2) - Math.pow(point1.y, 2);

    let f =
      (sx13 * x12 + sy13 * x12 + sx21 * x13 + sy21 * x13) /
      (2 * (y31 * x12 - y21 * x13));
    let g =
      (sx13 * y12 + sy13 * y12 + sx21 * y13 + sy21 * y13) /
      (2 * (x31 * y12 - x21 * y13));

    let c =
      -Math.pow(point1.x, 2) -
      Math.pow(point1.y, 2) -
      2 * g * point1.x -
      2 * f * point1.y;

    let x = -g;
    let y = -f;
    let sqr_of_r = x * x + y * y - c;

    let radius = Math.sqrt(sqr_of_r);

    return { radius, center: { x, y } };
  }
}
export default CircleFromThreePoints;
