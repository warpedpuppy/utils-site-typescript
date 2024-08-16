import { Point, Nullable } from "../../../types/types";
class TriangleDataFromLine {
  static t = "get triangle data from line";
  static l = "get-triangle-data-from-line";
  title = "get triangle data from line";
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
  startPoint: Nullable<Point> = { x: 141, y: 317 };
  endPoint: Nullable<Point> = { x: 687, y: 120 };
  top: number = 0;
  left: number = 0;
  allowDraw: boolean = false;
  keyFunction(startPoint: Point, endPoint: Point) {
    let hypotenuse = distanceBetweenPoints(startPoint, endPoint);
    let adjacent = distanceBetweenPoints(startPoint, {
      x: endPoint.x,
      y: startPoint.y,
    });
    let opposite = distanceBetweenPoints(
      {
        x: endPoint.x,
        y: startPoint.y,
      },
      endPoint
    );

    let oh = opposite / hypotenuse;
    let angle1 = Math.asin(oh); // could have used acos or atan -- we have the data
    let angleInDegrees = Math.floor(angle1 * (180 / Math.PI));
    let remainingAngle = 180 - angleInDegrees - 90;

    return { angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite };

    function distanceBetweenPoints(startPoint: Point, endPoint: Point) {
      let a = startPoint.x - endPoint.x;
      let b = startPoint.y - endPoint.y;
      return Math.sqrt(a * a + b * b);
    }
  }
  init(cont: HTMLDivElement) {
    if (!this.canvas || !this.ctx || !this.textDiv) return;
    this.textDiv.innerHTML = `<h3>click and drag to draw line and get data.</h3>`;
    cont.innerHTML = "";
    this.cont = cont;
    cont.appendChild(this.canvas);
    this.canvas.width = cont.clientWidth;
    this.canvas.height = cont.clientHeight;
    this.ctx.font = "bold 14px sans serif";
    let { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    this.allowDraw = false;
    this.canvas.addEventListener(
      "pointerdown",
      this.pointerDownHandler.bind(this)
    );
    this.canvas.addEventListener(
      "pointermove",
      this.pointerMoveHandler.bind(this)
    );
    this.canvas.addEventListener("pointerup", this.pointerUpHandler.bind(this));
    window.addEventListener("resize", this.resizeHandler.bind(this));
    this.draw();
  }
  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.cont.clientWidth;
    this.canvas.height = this.cont.clientHeight;
    let { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    this.draw();
  };
  draw = () => {
    if (
      !this.canvas ||
      !this.ctx ||
      !this.startPoint ||
      !this.endPoint ||
      !this.textDiv
    )
      return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();
    this.ctx.fillText("A", this.startPoint.x, this.startPoint.y);

    this.ctx.strokeStyle = "grey";
    this.ctx.lineWidth = 0.25;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.startPoint.y);
    this.ctx.stroke();
    this.ctx.fillText("C", this.endPoint.x, this.startPoint.y);

    this.ctx.moveTo(this.endPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();
    this.ctx.fillText("B", this.endPoint.x, this.endPoint.y);

    let radius = this.distanceBetweenPoints(this.startPoint, this.endPoint);

    let { angleInDegrees, remainingAngle, hypotenuse, opposite, adjacent } =
      this.keyFunction(this.startPoint, this.endPoint);

    this.textDiv.innerHTML = `
        <h3>click and drag to draw line and get data.</h3>
        <h3>the hypotenuse  is ${Math.floor(hypotenuse)} pixels long.</h3>
        <h3>the adjacent  is ${Math.floor(adjacent)} pixels long.</h3>
        <h3>the opposite  is ${Math.floor(opposite)} pixels long.</h3>
        <h3>Angle "A" is ${Math.floor(angleInDegrees)} degrees.</h3>
        <h3>Angle "B" is ${Math.floor(remainingAngle)} degrees.</h3>
        <h3>Angle "C" is 90 degrees.</h3>
        `;

    this.ctx.beginPath();
    this.ctx.arc(this.startPoint.x, this.startPoint.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();

    console.log(this.startPoint, this.endPoint);
  };
  distanceBetweenPoints(startPoint: Point, endPoint: Point) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }
  pointerDownHandler(e: PointerEvent) {
    this.startPoint = {
      x: Math.floor(e.pageX - this.left),
      y: Math.floor(e.pageY - this.top),
    };
    this.allowDraw = true;
  }
  pointerMoveHandler(e: PointerEvent) {
    if (this.allowDraw) {
      this.endPoint = {
        x: Math.floor(e.pageX - this.left),
        y: Math.floor(e.pageY - this.top),
      };
      this.draw();
    }
  }
  pointerUpHandler(e: PointerEvent) {
    this.allowDraw = false;
  }
  stop() {
    if (
      !this.canvas ||
      !this.ctx ||
      !this.startPoint ||
      !this.endPoint ||
      !this.textDiv
    )
      return;
    this.textDiv.innerHTML = "";
    this.canvas.removeEventListener(
      "pointerdown",
      this.pointerDownHandler.bind(this)
    );
    this.canvas.removeEventListener(
      "pointermove",
      this.pointerMoveHandler.bind(this)
    );
    this.canvas.removeEventListener(
      "pointerup",
      this.pointerUpHandler.bind(this)
    );
    window.removeEventListener("resize", this.resizeHandler.bind(this));
    this.cont.removeChild(this.canvas);
    this.canvas = null;
  }
}
export default TriangleDataFromLine;
