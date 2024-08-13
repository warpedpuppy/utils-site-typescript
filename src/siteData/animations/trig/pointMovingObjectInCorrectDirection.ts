import { GenericObject, Point } from "../../../types/types";
const moveObjectToChangingPoint = {
  t: "move object to changing point",
  l: "move-to-changing-point",
  f: function (x1: number, y1: number, x2: number, y2: number, ratio: number) {
    x2 = x1 + ratio * (x2 - x1);
    y2 = y1 + ratio * (y2 - y1);
    return { x: x2, y: y2 };
  },
  bf: function (cont: HTMLDivElement, keyFunction: Function) {
    const obj: GenericObject = {
      // text: "",
      points: [],
      text: [],
      ctx: undefined,
      canvas: document.createElement("canvas"),
      init() {
        this.textDiv = document.getElementById("primary-canvas--content--text");
        this.text.push("<h3>click screen to make three points.</h3>");

        // this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvasWidth = cont.clientWidth;
        this.canvas.height = this.canvasHeight = cont.clientHeight;
        this.halfHeight = this.canvasHeight / 2;
        this.halfWidth = this.canvasWidth / 2;
        this.ctx = this.canvas.getContext("2d");
        this.interval = undefined;
        this.circleQ = 0;

        cont.appendChild(this.canvas);

        window.addEventListener("resize", this.resizeHandler.bind(this));

        this.dot = {
          x: Math.floor(Math.random() * this.canvasWidth),
          y: Math.floor(Math.random() * this.canvasHeight),
        };
        this.drawDot();
        this.img = new Image();

        this.draw = this.draw.bind(this);
        this.img.addEventListener("load", () => {
          this.ctx.drawImage(this.img, 0, 0);
          this.draw();
        });

        this.img.src = "/bmps/arrow.png";
        this.vx = 1;
        this.vy = 1;
        this.x = 0;
        this.y = 0;
        this.ratio = 0;

        this.arrowPoint = { x: this.halfWidth - 50, y: this.halfHeight - 25 };

        this.interval = setInterval(this.drawDot.bind(this), 2000);
      },
      getRotation(destinationPoint: Point, zeroReference: Point) {
        return Math.atan2(
          destinationPoint.y - zeroReference.y,
          destinationPoint.x - zeroReference.x
        );
      },
      drawDot() {
        this.ratio = 0;
        this.dotNew = {
          x: Math.floor(Math.random() * this.canvasWidth),
          y: Math.floor(Math.random() * this.canvasHeight),
        };
      },
      drawLine(x1: number, y1: number, x2: number, y2: number, ratio: number) {
        x2 = x1 + ratio * (x2 - x1);
        y2 = y1 + ratio * (y2 - y1);
        return { x: x2, y: y2 };
      },
      resizeHandler() {
        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.draw();
      },

      draw() {
        this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
        this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = 2;

        let newDotPoint = keyFunction(
          this.dot.x,
          this.dot.y,
          this.dotNew.x,
          this.dotNew.y,
          this.ratio
        );
        this.dot = newDotPoint;
        this.ctx.beginPath();
        this.ctx.arc(this.dot.x, this.dot.y, 5, 0, 2 * Math.PI);
        this.ctx.stroke();

        let newPoint = keyFunction(
          this.arrowPoint.x,
          this.arrowPoint.y,
          this.dot.x,
          this.dot.y,
          this.ratio
        );

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
      },
      stop() {
        clearInterval(this.interval);
        this.textDiv.innerHTML = "";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        window.removeEventListener("resize", this.resizeHandler.bind(this));
        cont.removeChild(this.canvas);
        this.canvas = null;
      },
    };
    return obj;
  },
};
export default moveObjectToChangingPoint;
