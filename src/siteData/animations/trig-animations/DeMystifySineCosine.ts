import { Point } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { FindPointAroundCircle } from "../utils/animation/FindPointAroundCircle";
import { SineCurve } from "../utils/animation/SineCurve";
class DeMystifySineCosine extends AnimationBaseClass {
  static t: string = "demystify sine and cosine";
  static l: string = "demystify-sine-and-cosine";
  static include: boolean = false;
  title = "demystify sine and cosine";
  animationObject = FindPointAroundCircle;
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

    let perc1 = SineCurve.keyFunction(62.5, 12.5, 0.001);
    let point1 = FindPointAroundCircle.keyFunction(
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

    let perc2 = SineCurve.keyFunction(-12.5, 12.5, 0.001);
    let point2 = FindPointAroundCircle.keyFunction(
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

    if (this.textDiv)
      this.textDiv.innerHTML = `
     <p>The sine of angle 'A' is the relationship between the two red lines: ${smallRedLineHeight} / 100.</p><p>We can use sine to calculate the y value of the triangle's hypotenuse because it represents vertical proportion.</p> 
     <br />
      <p>The cosine of angle 'B' is the relationship between the two green lines: ${smallGreenLineHeight} / 100.</p><p>We can use cosine to calculate the x value of the triangle/s hypotenuse because it represents horizontal proportion.</p> 
    `;

    requestAnimationFrame(this.draw);
  };
  distanceBetweenPoints(startPoint: Point, endPoint: Point) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }
}
export default DeMystifySineCosine;
