import { Nullable, Point } from "../../../types/types";
class DeMystifySineCosine {
  static t: string = "demystify sine and cosine";
  static l: string = "demystify-sine-and-cosine";
  title = "demystify sine and cosine";
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
  i: number = 0;
  startValue = 0;
  differential = 200;
  speed = 0.005;
  thinLine = 2;
  fatLine = 5;
  keyFunction(
    circleCenter: Point,
    radius: number,
    percentageAroundCircle: number
  ) {
    let totalCircleRadians = Math.PI * 2;
    let percent = percentageAroundCircle / 100;
    const x = circleCenter.x + radius * Math.cos(totalCircleRadians * percent);
    const y = circleCenter.y + radius * Math.sin(totalCircleRadians * percent);
    return { x, y };
  }
  sineCurve(startingValue: number, differential: number, speed: number) {
    const currentDate = new Date();
    return (
      startingValue + Math.sin(currentDate.getTime() * speed) * differential
    );
  }
  init(cont: HTMLDivElement) {
    if (!this.canvas || !this.ctx) return;
    this.canvas.width = this.canvasWidth = cont.clientWidth;
    this.canvas.height = this.canvasHeight = cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    this.ctx = this.canvas.getContext("2d");
    this.cont = cont;
    cont.innerHTML = "";
    cont.appendChild(this.canvas);

    this.draw();
    this.i = 0;
    window.addEventListener("resize", this.resizeHandler);
  }
  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.cont.clientWidth;
    this.canvas.height = this.cont.clientHeight;
  };
  changeHandler(value: any, type: string) {
    if (type === "starting") {
      this.startValue = value;
    } else if (type === "differential") {
      this.differential = value;
    } else if (type === "speed") {
      this.speed = value;
    }
  }
  draw = () => {
    if (!this.canvas || !this.ctx) return;
    this.ctx.font = "bold 18px Arial";
    this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
    this.ctx.strokeStyle = "rgba(0 0 0 /0.5)";
    this.ctx.lineWidth = this.thinLine;

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.halfHeight);
    this.ctx.lineTo(this.canvasWidth, this.halfHeight);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth * 0.33, 0);
    this.ctx.lineTo(this.canvasWidth * 0.33, this.canvasHeight);
    this.ctx.stroke();

    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = this.fatLine;
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth * 0.33, this.halfHeight);
    this.ctx.lineTo(this.canvasWidth * 0.33, this.halfHeight - 100);
    this.ctx.stroke();

    this.ctx.strokeStyle = "rgba(0 0 0 /0.5)";
    this.ctx.lineWidth = this.thinLine;
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth * 0.66, 0);
    this.ctx.lineTo(this.canvasWidth * 0.66, this.canvasHeight);
    this.ctx.stroke();

    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = this.fatLine;
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth * 0.66, this.halfHeight);
    this.ctx.lineTo(this.canvasWidth * 0.66, this.halfHeight - 100);
    this.ctx.stroke();

    this.ctx.strokeStyle = "rgba(0 0 0 /0.5)";
    this.ctx.lineWidth = this.thinLine;

    this.ctx.beginPath();
    this.ctx.arc(this.canvasWidth * 0.33, this.halfHeight, 100, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.canvasWidth * 0.66, this.halfHeight, 100, 0, 2 * Math.PI);
    this.ctx.stroke();

    let perc1 = this.sineCurve(62.5, 12.5, 0.001);
    let point1 = this.keyFunction(
      {
        x: this.canvasWidth * 0.33,
        y: this.halfHeight,
      },
      100,
      perc1
    );

    this.ctx.strokeStyle = "rgba(0 0 0 / 0.25)";
    this.ctx.lineWidth = this.thinLine;
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth * 0.33, this.halfHeight);
    this.ctx.lineTo(point1.x, point1.y);
    this.ctx.stroke();

    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = this.fatLine;
    this.ctx.beginPath();
    this.ctx.moveTo(point1.x, point1.y);
    this.ctx.lineTo(point1.x, this.halfHeight);
    this.ctx.stroke();

    let perc2 = this.sineCurve(-12.5, 12.5, 0.001);
    let point2 = this.keyFunction(
      {
        x: this.canvasWidth * 0.66,
        y: this.halfHeight,
      },
      100,
      perc2
    );

    let smallRedLineHeight = Math.floor(
      this.distanceBetweenPoints(point1, {
        x: point1.x,
        y: this.halfHeight,
      })
    );

    this.ctx.fillText("A", this.canvasWidth * 0.33 - 5, this.halfHeight - 5);
    this.ctx.fillText(
      `The sine of angle 'A' is the relationship between the two red lines: ${smallRedLineHeight} / 100`,
      this.canvasWidth * 0.1,
      this.halfHeight - 210
    );

    this.ctx.strokeStyle = "rgba(0 0 0 / 0.25)";
    this.ctx.lineWidth = this.thinLine;
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth * 0.66, this.halfHeight);
    this.ctx.lineTo(point2.x, point2.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(point2.x, point2.y);
    this.ctx.lineTo(point2.x, this.halfHeight);
    this.ctx.stroke();

    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = this.fatLine;
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth * 0.66, this.halfHeight);
    this.ctx.lineTo(point2.x, this.halfHeight);
    this.ctx.stroke();

    let smallGreenLineHeight = Math.floor(
      this.distanceBetweenPoints(point2, {
        x: point2.x,
        y: this.halfHeight,
      })
    );

    this.ctx.fillText("B", this.canvasWidth * 0.66 + 5, this.halfHeight - 5);
    this.ctx.fillText(
      `The sine of angle 'B' is the relationship between the two green lines: ${smallGreenLineHeight} / 100`,
      this.canvasWidth * 0.1,
      this.halfHeight - 170
    );

    requestAnimationFrame(this.draw);
  };
  distanceBetweenPoints(startPoint: Point, endPoint: Point) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }
  stop() {
    if (!this.canvas || !this.ctx || !this.cont) return;
    clearInterval(this.interval);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    window.removeEventListener("resize", this.resizeHandler.bind(this));
    this.cont.removeChild(this.canvas);
    this.canvas = null;
  }
}
export default DeMystifySineCosine;
