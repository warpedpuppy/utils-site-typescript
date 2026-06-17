import { Point } from "../../../types/shapes";
import AnimationBaseClass from "../../../core-animations/AnimationBaseClass";
class MoveObjectToDestinationPoint extends AnimationBaseClass {
  static t = "move object to changing point";
  static l = "move-to-changing-point";
  title: string = "move object to changing point";
  points = [];
  text = [];
  interval: any = undefined;
  dot: Point = { x: 0, y: 0 };
  dotNew: Point = { x: 0, y: 0 };
  arrowPoint: Point = { x: 0, y: 0 };
  img = new Image();
  ratio = 0;
  quadrantCounter = 0;
  quadrant: Point[] = [];
  keyFunction(origin: Point, destination: Point, ratio: number) {
    let x = origin.x + ratio * (destination.x - origin.x);
    let y = origin.y + ratio * (destination.y - origin.y);
    return { x, y };
  }
  distanceBetweenTwoPoint(startPoint: Point, endPoint: Point) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }
  createNewDestinationPoint(quadrant: number) {
    if (quadrant === 0) {
      return {
        x: Math.random() * (this.halfWidth / 2),
        y: Math.random() * (this.halfHeight / 2),
      };
    } else if (quadrant === 1) {
      return {
        x: Math.random() * this.halfWidth + this.halfWidth,
        y: Math.random() * (this.halfHeight / 2),
      };
    } else if (quadrant === 2) {
      return {
        x: Math.random() * (this.halfWidth / 2),
        y: Math.random() * this.halfHeight + this.halfHeight,
      };
    } else if (quadrant === 3) {
      return {
        x: Math.random() * this.halfWidth + this.halfWidth,
        y: Math.random() * this.halfHeight + this.halfHeight,
      };
    }
    return {
      x: Math.random() * this.halfWidth,
      y: Math.random() * this.halfHeight,
    };
  }
  init() {
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>this function shows you how the arrow moves to the point.  To see how to get the arrow to point towards the point, please see 'point one object towards a moving object'.</h3>";
    }

    this.dot = {
      x: Math.floor(Math.random() * this.canvasWidth),
      y: Math.floor(Math.random() * this.canvasHeight),
    };
    this.drawDot();

    this.img.addEventListener("load", () => {
      if (!this.ctx) return;
      this.ctx.drawImage(this.img, 0, 0);
      this.draw();
    });

    this.img.src = "/bmps/arrow.png";

    this.arrowPoint = { x: this.halfWidth - 50, y: this.halfHeight - 25 };

    this.interval = setInterval(this.drawDot, 2000);
  }
  getRotation(destinationPoint: Point, zeroReference: Point) {
    return Math.atan2(
      destinationPoint.y - zeroReference.y,
      destinationPoint.x - zeroReference.x
    );
  }
  drawDot = () => {
    this.ratio = 0;

    this.dotNew = this.createNewDestinationPoint(this.quadrantCounter);

    if (this.quadrantCounter < 3) {
      this.quadrantCounter++;
    } else {
      this.quadrantCounter = 0;
    }
  };
  draw = () => {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 10;

    let newDotPoint = this.keyFunction(this.dot, this.dotNew, this.ratio);
    this.dot = newDotPoint;
    this.ctx.beginPath();
    this.ctx.arc(this.dot.x, this.dot.y, 20, 0, 2 * Math.PI);
    this.ctx.stroke();

    let newPoint = this.keyFunction(this.arrowPoint, this.dot, this.ratio);

    this.arrowPoint = newPoint;

    let angle = this.getRotation(this.dot, newPoint);

    this.ctx.translate(newPoint.x, newPoint.y);
    this.ctx.rotate(angle);
    this.ctx.translate(-newPoint.x, -newPoint.y);

    this.ctx.strokeStyle = "rgba(255,255,255,0.35)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(this.arrowPoint.x, this.arrowPoint.y, 100, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.drawImage(
      this.img,
      this.arrowPoint.x - 50,
      this.arrowPoint.y - 25
    );

    this.ctx.resetTransform();
    this.ratio += 0.0001;

    this.ctx.strokeStyle = "rgba(255,255,255,0.35)";
    this.ctx.lineWidth = 0.5;
    this.ctx.beginPath();
    this.ctx.arc(this.arrowPoint.x, this.arrowPoint.y, 100, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.arrowPoint.x, this.arrowPoint.y);
    this.ctx.lineTo(this.arrowPoint.x + 100, this.arrowPoint.y);
    this.ctx.stroke();

    let newAngle = this.getRotation(this.arrowPoint, this.dot);

    this.ctx.beginPath();
    this.ctx.moveTo(this.arrowPoint.x, this.arrowPoint.y);
    let x = this.arrowPoint.x - 100 * Math.cos(newAngle);
    let y = this.arrowPoint.y - 100 * Math.sin(newAngle);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.ctx.font = "bold 12px Verdana";
    this.ctx.fillStyle = "rgba(255,255,255,0.75)";
    this.ctx.fillText(
      `${Math.floor((angle * 180) / Math.PI)} degrees`,
      this.arrowPoint.x - 35,
      this.arrowPoint.y
    );

    // let dist = Math.floor(
    //   this.distanceBetweenTwoPoint(this.arrowPoint, this.dot)
    // );

    requestAnimationFrame(this.draw);
  };
}
export default MoveObjectToDestinationPoint;
