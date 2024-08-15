import { GenericObject, Nullable, Point } from "../../../types/types";
class CircleFromThreePoints {
  static t = "get circle from three points";
  static l = "circle-from-three-points";
  title = "get circle from three points";
  canvas: Nullable<HTMLCanvasElement> = document.createElement("canvas");
  textDiv: Nullable<HTMLElement> = document.getElementById(
    "primary-canvas--content--text"
  );
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  halfHeight: number = 0;
  halfWidth: number = 0;
  cont: HTMLDivElement = undefined!;
  ctx = this.canvas?.getContext("2d");
  startPoint: Nullable<Point> = null;
  endPoint: Nullable<Point> = null;
  top: number = 0;
  left: number = 0;
  text: string[] = [];
  interval: any = 0;
  circleQ = 0;
  points: any = [];
  allowDraw: boolean = false;
  init(cont: HTMLDivElement) {
    if (!this.canvas || !this.ctx) return;
    cont.innerHTML = "";
    this.cont = cont;
    cont.appendChild(this.canvas);
    this.canvas.width = cont.clientWidth;
    this.canvas.height = cont.clientHeight;
    this.halfHeight = cont.clientHeight / 2;
    this.halfWidth = cont.clientWidth / 2;
    this.ctx = this.canvas.getContext("2d");

    this.text.push("<h3>click screen three times to make three points.</h3>");
    this.canvas.addEventListener("pointerdown", this.pointerDownHandlerThree);
    window.addEventListener("resize", this.resizeHandler);
    this.draw();
  }
  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.cont.clientWidth;
    this.canvas.height = this.cont.clientHeight;
    this.draw();
  };
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
  pointerDownHandlerThree = (e: PointerEvent) => {
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
  };
  formatText() {
    let str = this.points
      .map((item: GenericObject, index: number) => {
        let i = index + 1;
        return `point ${i}: { x:${item.x}, y:${item.y} }`;
      })
      .join(", ");
    return `<p>${str}</p>`;
  }
  stop() {
    if (!this.textDiv || !this.ctx || !this.canvas || !this.cont) return;
    clearInterval(this.interval);
    this.textDiv.innerHTML = "";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.removeEventListener(
      "pointerdown",
      this.pointerDownHandlerThree
    );
    window.removeEventListener("resize", this.resizeHandler.bind(this));
    this.cont.removeChild(this.canvas);
    this.canvas = null;
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
