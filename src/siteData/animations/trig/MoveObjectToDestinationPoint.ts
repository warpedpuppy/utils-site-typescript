import { Nullable, Point } from "../../../types/types";
import Template from "../animationTemplate";
class MoveObjectToDestinationPoint extends Template {
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
  keyFunction(origin: Point, destination: Point, ratio: number) {
    let x = origin.x + ratio * (destination.x - origin.x);
    let y = origin.y + ratio * (destination.y - origin.y);
    return { x, y };
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
    this.dotNew = {
      x: Math.floor(Math.random() * this.canvasWidth),
      y: Math.floor(Math.random() * this.canvasHeight),
    };
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

    this.ctx.drawImage(
      this.img,
      this.arrowPoint.x - 50,
      this.arrowPoint.y - 25
    );
    this.ctx.resetTransform();
    this.ratio += 0.0001;

    requestAnimationFrame(this.draw);
  };
}
export default MoveObjectToDestinationPoint;
