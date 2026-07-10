import { Point } from "../../../types/shapes";
import AnimationBaseClass from "../../../core-animations/AnimationBaseClass";
class MoveObjectToDestinationPoint extends AnimationBaseClass {
  static t = "move object to changing point";
  static l = "move-to-changing-point";
  title: string = "move object to changing point";
  points = [];
  text = [];
  interval: ReturnType<typeof setInterval> | undefined = undefined;
  dot: Point = { x: 0, y: 0 };
  dotOrigin: Point = { x: 0, y: 0 };
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
  // Pick a destination anywhere in the current window. We cycle through the four
  // quadrants so the dot keeps visiting every corner, and each quadrant spans its
  // full half of the canvas (minus a margin so the circle never clips the edge).
  // Reading canvasWidth/canvasHeight live means the reachable area re-expands on
  // resize instead of staying cramped in the center.
  createNewDestinationPoint(quadrant: number): Point {
    const margin = 60;
    const left = margin;
    const right = Math.max(margin, this.canvasWidth - margin);
    const top = margin;
    const bottom = Math.max(margin, this.canvasHeight - margin);
    const midX = this.halfWidth;
    const midY = this.halfHeight;
    const randIn = (min: number, max: number) =>
      min + Math.random() * (max - min);

    if (quadrant === 0) {
      return { x: randIn(left, midX), y: randIn(top, midY) };
    } else if (quadrant === 1) {
      return { x: randIn(midX, right), y: randIn(top, midY) };
    } else if (quadrant === 2) {
      return { x: randIn(left, midX), y: randIn(midY, bottom) };
    } else if (quadrant === 3) {
      return { x: randIn(midX, right), y: randIn(midY, bottom) };
    }
    return { x: randIn(left, right), y: randIn(top, bottom) };
  }

  // smoothstep — eases the dot in and out of each destination sweep.
  easeInOut(t: number): number {
    return t * t * (3 - 2 * t);
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
    // The dot's current spot becomes the start of the next sweep, so it travels
    // cleanly from where it is to the new destination.
    this.dotOrigin = { x: this.dot.x, y: this.dot.y };
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

    // Advance this sweep toward its destination and reach it fully (ratio → 1)
    // within the 2s interval, so the dot actually visits the far corners instead
    // of drifting only partway back toward the center.
    this.ratio = Math.min(this.ratio + 0.01, 1);
    this.dot = this.keyFunction(
      this.dotOrigin,
      this.dotNew,
      this.easeInOut(this.ratio)
    );
    this.ctx.beginPath();
    this.ctx.arc(this.dot.x, this.dot.y, 20, 0, 2 * Math.PI);
    this.ctx.stroke();

    // The arrow chases a point one tip-length (half the sprite) short of the dot,
    // so it settles with its TIP resting on the dot's center, not its body. It
    // trails with a constant follow factor for the chasing lag.
    const tipOffset = 50;
    const dx = this.dot.x - this.arrowPoint.x;
    const dy = this.dot.y - this.arrowPoint.y;
    const dist = Math.hypot(dx, dy) || 1;
    const target: Point = {
      x: this.dot.x - (tipOffset * dx) / dist,
      y: this.dot.y - (tipOffset * dy) / dist,
    };
    let newPoint = this.keyFunction(this.arrowPoint, target, 0.04);

    this.arrowPoint = newPoint;

    let angle = this.getRotation(this.dot, newPoint);

    this.ctx.translate(newPoint.x, newPoint.y);
    this.ctx.rotate(angle);
    this.ctx.translate(-newPoint.x, -newPoint.y);

    this.ctx.strokeStyle = "rgba(18, 16, 14, 0.3)"; // ink guide lines on paper
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

    this.ctx.strokeStyle = "rgba(18, 16, 14, 0.3)"; // ink guide lines on paper
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
    // Ink, not white: this canvas draws directly on the comic-paper page.
    this.ctx.fillStyle = "rgba(18, 16, 14, 0.75)";
    this.ctx.fillText(
      `${Math.floor((angle * 180) / Math.PI)} degrees`,
      this.arrowPoint.x - 35,
      this.arrowPoint.y
    );

    // let dist = Math.floor(
    //   this.distanceBetweenTwoPoint(this.arrowPoint, this.dot)
    // );

    this.raf(this.draw);
  };
}
export default MoveObjectToDestinationPoint;
