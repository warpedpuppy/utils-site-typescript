import { Point } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { MoveAlongLine } from "../../formulas/animation/MoveAlongLine";
import { GetRotation } from "../../formulas/animation/GetRotation";
class MoveObjectToDestinationPoint extends AnimationBaseClass {
  static t = "move object to changing point";
  static l = "move-to-changing-point";
  static f = MoveAlongLine.functionString;
  title: string = "move object to changing point";
  animationObject = MoveAlongLine;
  points = [];
  text = [];
  interval: any = undefined;
  dot: Point = { x: 0, y: 0 };
  dotNew: Point = { x: 0, y: 0 };
  arrowPoint: Point = { x: 0, y: 0 };
  img = new Image();
  ratio = 0;

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

    let newDotPoint = MoveAlongLine.keyFunction(
      this.dot,
      this.dotNew,
      this.ratio
    );
    this.dot = newDotPoint;
    this.ctx.beginPath();
    this.ctx.arc(this.dot.x, this.dot.y, 20, 0, 2 * Math.PI);
    this.ctx.stroke();

    let newPoint = MoveAlongLine.keyFunction(
      this.arrowPoint,
      this.dot,
      this.ratio
    );

    this.arrowPoint = newPoint;

    let angle = GetRotation.keyFunction(newPoint, this.dot);

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
